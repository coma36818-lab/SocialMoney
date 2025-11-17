'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, User, MessageCircle, Share2, Send, Trash2, Reply, ThumbsUp, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import EmojiPicker from "../EmojiPicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Post, User as UserType, Comment, CommentReply, Like } from "@/lib/types";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";


interface PostCardProps {
    post: Post;
    user: UserType | null;
    onSendLike: () => void;
    onDelete: () => void;
    isLiking: boolean;
}

export default function PostCard({ post, user, onSendLike, onDelete }: PostCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const queryClient = useQueryClient();

  const canLike = user && user.likes_available > 0 && post.created_by !== user?.email;
  const isOwner = post.created_by === user?.email;

  const { data: owner } = useQuery({
      queryKey: ['user', post.created_by],
      queryFn: async () => {
          const users = await base44.entities.User.filter({ email: post.created_by });
          return users[0] || null;
      },
      enabled: !!post.created_by,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => base44.entities.Comment.filter({ post_id: post.id }, '-created_date'),
    enabled: showComments,
  });

  const { data: likes = [] } = useQuery({
    queryKey: ['postLikes', post.id],
    queryFn: () => base44.entities.Like.filter({ post_id: post.id }),
    enabled: showLikesModal,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error("User not authenticated");

      if (replyingTo) {
        await base44.entities.CommentReply.create({
          comment_id: replyingTo.id,
          reply_text: text,
          user_email: user.email,
          user_name: user.full_name
        });
      } else {
        await base44.entities.Comment.create({
          post_id: post.id,
          comment_text: text,
          user_email: user.email,
          user_name: user.full_name
        });
      }

      await base44.entities.Notification.create({
        created_by: replyingTo ? replyingTo.user_email : post.created_by,
        type: "system",
        message: `${user.full_name} ha ${replyingTo ? 'risposto al tuo' : 'commentato il tuo'} post`
      });

      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
      audio.volume = 0.3;
      audio.play();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
      setCommentText("");
      setReplyingTo(null);
    }
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
        if (!user) throw new Error("User not authenticated");
      await base44.entities.CommentLike.create({
        comment_id: commentId,
        user_email: user.email,
        user_name: user.full_name
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
      toast({ title: "Commento piaciuto!" });
    }
  });

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText);
  };

  const handleLike = () => {
    onSendLike();
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
    audio.volume = 0.4;
    audio.play();
  };

  const handleShare = (platform: string) => {
    const postUrl = window.location.origin + '/post/' + post.id;
    const shareText = `Guarda questo post su Social Money! ${post.description || ''}`;
    
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
    audio.volume = 0.3;
    audio.play();

    const shareUrls: { [key: string]: string } = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
      copy: postUrl
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(postUrl);
      toast({ title: 'Link copiato negli appunti!' });
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setCommentText(prev => prev + emoji);
  };
  
  const getInitials = (name: string) => {
      if (!name) return '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const handleProfileClick = (email: string) => {
    if (user && email === user.email) {
      router.push(createPageUrl("profilo"));
    } else {
       router.push(createPageUrl("profiloutente") + "?email=" + email);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden hover:border-white/10 transition-all"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 pb-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleProfileClick(post.created_by)}
        >
            <Avatar className="h-11 w-11 border-2 border-primary/50">
              <AvatarImage src={owner?.avatar} alt={owner?.full_name} className="object-cover" />
              <AvatarFallback className="bg-muted-foreground">{getInitials(owner?.full_name || post.created_by.split('@')[0])}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-white hover:text-primary transition-colors">
              {owner?.full_name || post.created_by?.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(post.created_date), "d MMM yyyy · HH:mm", { locale: it })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm text-gray-400">Guadagnato</p>
            <motion.p 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              className="text-lg font-bold text-accent"
            >
              {post.earnings?.toFixed(2) || "0.00"}€
            </motion.p>
          </div>
          {isOwner && (
            <Button
              onClick={onDelete}
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Media or Text Content */}
      {post.media_type === "text" ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 sm:px-6 py-8"
        >
          <p className="text-white text-base sm:text-lg whitespace-pre-wrap leading-relaxed">
            {post.description}
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative aspect-video bg-gradient-to-br from-gray-900 to-black overflow-hidden"
          >
            {post.media_type === "image" ? (
              <Image
                src={post.media_url}
                alt={post.description || "Post image"}
                fill
                className="object-contain"
              />
            ) : (
              <video
                src={post.media_url}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>

          {post.description && (
            <div className="px-4 sm:px-6 pt-4">
              <p className="text-gray-300 text-sm sm:text-base">{post.description}</p>
            </div>
          )}
        </>
      )}

      {/* Actions */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Like */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowLikesModal(true)}
              className="flex items-center gap-2"
            >
              <Heart className="w-5 h-5 text-accent" fill="hsl(var(--accent))" />
              <span className="text-base sm:text-lg font-bold text-accent">
                {post.likes_count || 0}
              </span>
            </motion.button>

            {/* Comments */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{comments.length}</span>
            </motion.button>

            {/* Share */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">Condividi</span>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1a1a1a] border-white/10">
                <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="text-white hover:bg-white/10 cursor-pointer">
                  💬 WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('facebook')} className="text-white hover:bg-white/10 cursor-pointer">
                  📘 Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('twitter')} className="text-white hover:bg-white/10 cursor-pointer">
                  🐦 Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('telegram')} className="text-white hover:bg-white/10 cursor-pointer">
                  ✈️ Telegram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('linkedin')} className="text-white hover:bg-white/10 cursor-pointer">
                  💼 LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('copy')} className="text-white hover:bg-white/10 cursor-pointer">
                  🔗 Copia Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {canLike ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLike}
                className="bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-white neon-glow text-sm sm:text-base"
              >
                <Heart className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Invia Like (-1)</span>
                <span className="sm:hidden">Like</span>
              </Button>
            </motion.div>
          ) : !user ? (
            <Button disabled className="border-white/10 text-gray-400 bg-[#1a1a1a] border text-sm">
              Accedi
            </Button>
          ) : isOwner ? (
            <Button disabled className="border-white/10 text-gray-400 bg-[#1a1a1a] border text-sm">
              Tuo post
            </Button>
          ) : (
            <Button disabled className="border-white/10 text-gray-400 bg-[#1a1a1a] border text-sm">
              Esauriti
            </Button>
          )}
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/10 pt-4 space-y-4"
            >
              {/* Comment Form */}
              {user && (
                <form onSubmit={handleComment} className="space-y-2">
                  {replyingTo && (
                    <div className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-400">
                        Rispondi a {replyingTo.user_name || replyingTo.user_email.split('@')[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="text-gray-500 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Scrivi un commento..."
                      className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        disabled={!commentText.trim() || addCommentMutation.isPending}
                        className="bg-gradient-to-r from-[#3D9DF7] to-[#5ba8f7] hover:opacity-90 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div 
                        className="w-8 h-8 bg-gradient-to-br from-[#3D9DF7] to-[#5ba8f7] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
                        onClick={() => handleProfileClick(comment.user_email)}
                      >
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p 
                          className="font-semibold text-white text-sm cursor-pointer hover:text-[#3D9DF7] transition-colors"
                          onClick={() => handleProfileClick(comment.user_email)}
                        >
                          {comment.user_name || comment.user_email.split('@')[0]}
                        </p>
                        <p className="text-gray-300 text-sm mt-1">{comment.comment_text}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-xs text-gray-500">
                            {format(new Date(comment.created_date), "d MMM · HH:mm", { locale: it })}
                          </p>
                          <button
                            onClick={() => likeCommentMutation.mutate(comment.id)}
                            className="text-xs text-gray-400 hover:text-accent transition-colors flex items-center gap-1"
                          >
                            <ThumbsUp className="w-3 h-3" /> Mi piace
                          </button>
                          <button
                            onClick={() => setReplyingTo(comment)}
                            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <Reply className="w-3 h-3" /> Rispondi
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">
                    Nessun commento ancora. Sii il primo a commentare!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Likes Modal */}
      <Dialog open={showLikesModal} onOpenChange={setShowLikesModal}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Like ricevuti ({likes.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {likes.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nessun like ancora</p>
            ) : (
              (likes as Like[]).map((like, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                  onClick={() => {
                    setShowLikesModal(false);
                    handleProfileClick(like.created_by);
                  }}
                >
                    <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage src={undefined} alt={like.created_by} className="object-cover" />
                        <AvatarFallback className="bg-muted-foreground">{getInitials(like.created_by)}</AvatarFallback>
                    </Avatar>
                  <p className="text-white font-medium">{like.created_by?.split('@')[0]}</p>
                </motion.div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
