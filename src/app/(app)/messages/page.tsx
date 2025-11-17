'use client';
import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/lib/api";
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

export default function Messaggi() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserType | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUser, ]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      router.push(createPageUrl("Feed"));
    }
  };

  const { data: allMessages } = useQuery({
    queryKey: ['messages'],
    queryFn: () => base44.entities.Message.list('-created_date'),
    enabled: !!user,
    initialData: [],
    refetchInterval: 3000,
  });

  const { data: allUsers } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ to, message }: {to: string, message: string}) => {
        if (!user) return;
      await base44.entities.Message.create({
        to_user_email: to,
        from_user_email: user.email,
        message,
        read: false
      });

      await base44.entities.Notification.create({
        created_by: to,
        type: "system",
        message: `Nuovo messaggio da ${user.full_name}`,
        related_id: to
      });

      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
      audio.volume = 0.3;
      audio.play();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey:['messages']});
      setMessageText("");
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageIds: string[]) => {
      for (const id of messageIds) {
        await base44.entities.Message.update(id, { read: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['messages']});
    }
  });

  const getConversations = () => {
    if (!user || !allMessages) return [];
    
    const conversations: {[key: string]: {email: string; messages: Message[], unreadCount: number, lastMessage: Message}} = {};
    
    allMessages.forEach(msg => {
      const otherUser = msg.from_user_email === user.email ? msg.to_user_email : msg.from_user_email;
      
      if (!conversations[otherUser]) {
        conversations[otherUser] = {
          email: otherUser,
          messages: [],
          unreadCount: 0,
          lastMessage: msg
        };
      }
      
      conversations[otherUser].messages.push(msg);
      
      if (!msg.read && msg.to_user_email === user.email) {
        conversations[otherUser].unreadCount++;
      }
      if (new Date(msg.created_date) > new Date(conversations[otherUser].lastMessage.created_date)) {
        conversations[otherUser].lastMessage = msg;
      }
    });

    return Object.values(conversations)
      .sort((a, b) => new Date(b.lastMessage.created_date).getTime() - new Date(a.lastMessage.created_date).getTime());
  };

  const getMessagesWithUser = (userEmail: string) => {
    if (!user || !allMessages) return [];
    
    return allMessages
      .filter(msg => 
        (msg.from_user_email === user.email && msg.to_user_email === userEmail) ||
        (msg.to_user_email === user.email && msg.from_user_email === userEmail)
      )
      .sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
  };

  const handleSelectUser = (userEmail: string) => {
    setSelectedUser(userEmail);
    if (!user || !allMessages) return;
    
    const unreadMessages = allMessages
      .filter(msg => msg.from_user_email === userEmail && msg.to_user_email === user.email && !msg.read)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      markAsReadMutation.mutate(unreadMessages);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;
    
    sendMessageMutation.mutate({
      to: selectedUser,
      message: messageText
    });
  };

  const conversations = getConversations();
  const currentMessages = selectedUser ? getMessagesWithUser(selectedUser) : [];
  const filteredUsers = (allUsers || []).filter(u => 
    u.email !== user?.email && 
    (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-gray-400">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="h-[calc(100vh)] max-w-7xl mx-auto px-4 py-8">
        <div className="h-full grid md:grid-cols-3 gap-6">
          {/* Sidebar - Conversazioni */}
          <div className="md:col-span-1">
            <Card className="glass-card border-white/5 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageCircle className="w-5 h-5 text-[#FF0055]" />
                  Messaggi
                </CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca utenti..."
                    className="pl-10 bg-white/5 border-white/10 text-white"
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
                          handleSelectUser(u.email);
                          setSearchQuery("");
                        }}
                        className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF0055] to-[#ff3366] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-white text-sm">{u.full_name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Nessuna conversazione</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map(conv => (
                      <button
                        key={conv.email}
                        onClick={() => handleSelectUser(conv.email)}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                          selectedUser === conv.email ? "bg-white/10" : ""
                        }`}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#FF0055] to-[#ff3366] rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          {conv.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-black">{conv.unreadCount}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-white text-sm">{conv.email.split('@')[0]}</p>
                          <p className="text-xs text-gray-400 truncate">
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
            <Card className="glass-card border-white/5 h-full flex flex-col">
              {selectedUser ? (
                <>
                  <CardHeader className="border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#FF0055] to-[#ff3366] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{selectedUser.split('@')[0]}</p>
                        <p className="text-xs text-gray-500">{selectedUser}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentMessages.map((msg, index) => {
                      const isMe = msg.from_user_email === user?.email;
                      return (
                        <div
                          key={index}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[70%]`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isMe
                                  ? "bg-gradient-to-r from-[#FF0055] to-[#ff3366] text-white"
                                  : "bg-white/5 text-white"
                              }`}
                            >
                              <p className="break-words">{msg.message}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 px-2">
                              {format(new Date(msg.created_date), "HH:mm", { locale: it })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  <div className="border-t border-white/5 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Scrivi un messaggio..."
                        className="flex-1 bg-white/5 border-white/10 text-white"
                      />
                      <Button
                        type="submit"
                        disabled={!messageText.trim() || sendMessageMutation.isPending}
                        className="bg-gradient-to-r from-[#FF0055] to-[#ff3366] hover:opacity-90 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Seleziona una conversazione</h3>
                    <p className="text-gray-400">Scegli un utente per iniziare a chattare</p>
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
