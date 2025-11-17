
'use client';
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, User, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import type { User as UserType, Message } from "@/lib/types";
import EmojiPicker from "@/components/EmojiPicker";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, orderBy, doc } from "firebase/firestore";

export default function Messaggi() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUserEmail]);

  const allUsersQuery = useMemoFirebase(() => {
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: allUsers } = useCollection<UserType>(allUsersQuery);

  const messagesQuery = useMemoFirebase(() => {
    if (!authUser) return null;
    return query(
        collection(firestore, 'messages'), 
        where('participants', 'array-contains', authUser.uid),
        orderBy('created_date', 'desc')
    );
  }, [firestore, authUser]);

  const { data: allMessages } = useCollection<Message>(messagesQuery, { refetchInterval: 3000 });


  const sendMessageMutation = useMutation({
    mutationFn: async ({ to, message }: { to: string, message: string }) => {
        if (!authUser || !allUsers) return;

        const toUser = allUsers.find(u => u.email === to);
        if (!toUser) throw new Error("Recipient not found");

        const messageColl = collection(firestore, 'messages');
        addDocumentNonBlocking(messageColl, {
            participants: [authUser.uid, toUser.uid],
            fromUserId: authUser.uid,
            toUserId: toUser.uid,
            message,
            read: false,
            created_date: new Date().toISOString(),
        });
        
        const notificationColl = collection(firestore, `users/${toUser.uid}/notifications`);
        addDocumentNonBlocking(notificationColl, {
            userId: toUser.uid,
            message: `Nuovo messaggio da ${authUser.displayName || authUser.email}`,
            type: "system",
            read: false,
            created_date: new Date().toISOString()
        });
    },
    onSuccess: () => {
      setMessageText("");
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
      audio.volume = 0.3;
      audio.play();
    }
  });


  const getConversations = () => {
    if (!authUser || !allMessages || !allUsers) return [];
    
    const conversations: {[key: string]: {user: UserType, messages: Message[], unreadCount: number, lastMessage: Message}} = {};
    
    allMessages.forEach(msg => {
      const otherUserId = msg.fromUserId === authUser.uid ? msg.toUserId : msg.fromUserId;
      const otherUser = allUsers.find(u => u.uid === otherUserId);

      if (!otherUser) return;
      
      if (!conversations[otherUser.uid]) {
        conversations[otherUser.uid] = {
          user: otherUser,
          messages: [],
          unreadCount: 0,
          lastMessage: msg
        };
      }
      
      conversations[otherUser.uid].messages.push(msg);
      
      if (!msg.read && msg.toUserId === authUser.uid) {
        conversations[otherUser.uid].unreadCount++;
      }
      if (new Date(msg.created_date) > new Date(conversations[otherUser.uid].lastMessage.created_date)) {
        conversations[otherUser.uid].lastMessage = msg;
      }
    });

    return Object.values(conversations)
      .sort((a, b) => new Date(b.lastMessage.created_date).getTime() - new Date(a.lastMessage.created_date).getTime());
  };

  const getMessagesWithUser = (otherUserUid: string) => {
    if (!authUser || !allMessages) return [];
    return allMessages
      .filter(msg => msg.participants.includes(otherUserUid) && msg.participants.includes(authUser.uid))
      .sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
  };

  const handleSelectUser = (user: UserType) => {
    setSelectedUserEmail(user.email);
    if (!authUser || !allMessages) return;
    
    const unreadMessages = allMessages
      .filter(msg => msg.fromUserId === user.uid && msg.toUserId === authUser.uid && !msg.read)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      unreadMessages.forEach(id => {
          const msgRef = doc(firestore, 'messages', id);
          updateDocumentNonBlocking(msgRef, { read: true });
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserEmail) return;
    
    sendMessageMutation.mutate({
      to: selectedUserEmail,
      message: messageText
    });
  };

  const conversations = getConversations();
  const selectedUser = allUsers?.find(u => u.email === selectedUserEmail);
  const currentMessages = selectedUser ? getMessagesWithUser(selectedUser.uid) : [];
  
  const filteredUsers = (allUsers || []).filter(u => 
    u.email !== authUser?.email && 
    (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isUserLoading || !authUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="h-[calc(100vh-5rem)] max-w-7xl mx-auto px-4 py-8">
        <div className="h-full grid md:grid-cols-3 gap-6">
          {/* Sidebar - Conversazioni */}
          <div className="md:col-span-1">
            <Card className="glass-card h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Messaggi
                </CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca utenti..."
                    className="pl-10 bg-muted/50 border-border text-foreground"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                {searchQuery ? (
                  <div className="space-y-1">
                    {filteredUsers.map(u => (
                      <button
                        key={u.email}
                        onClick={() => {
                          handleSelectUser(u);
                          setSearchQuery("");
                        }}
                        className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#ff3366] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-foreground text-sm">{u.full_name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Nessuna conversazione</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map(conv => (
                      <button
                        key={conv.user.email}
                        onClick={() => handleSelectUser(conv.user)}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                          selectedUserEmail === conv.user.email ? "bg-muted" : ""
                        }`}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-[#ff3366] rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-primary-foreground" />
                          </div>
                          {conv.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-accent-foreground">{conv.unreadCount}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-foreground text-sm">{conv.user.full_name || conv.user.email.split('@')[0]}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage.message}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2">
            <Card className="glass-card h-full flex flex-col">
              {selectedUser ? (
                <>
                  <CardHeader className="border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#ff3366] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{selectedUser.full_name || selectedUser.email.split('@')[0]}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentMessages.map((msg, index) => {
                      const isMe = msg.fromUserId === authUser?.uid;
                      return (
                        <div
                          key={index}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[70%]`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isMe
                                  ? "bg-gradient-to-r from-primary to-[#ff3366] text-primary-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p className="break-words">{msg.message}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-2">
                              {format(new Date(msg.created_date), "HH:mm", { locale: it })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  <div className="border-t border-border p-4">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <EmojiPicker onEmojiSelect={(emoji) => setMessageText(prev => prev + emoji)} />
                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Scrivi un messaggio..."
                        className="flex-1 bg-muted/50 border-border text-foreground"
                      />
                      <Button
                        type="submit"
                        disabled={!messageText.trim() || sendMessageMutation.isPending}
                        className="bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-primary-foreground"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">Seleziona una conversazione</h3>
                    <p className="text-muted-foreground">Scegli un utente per iniziare a chattare</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

    