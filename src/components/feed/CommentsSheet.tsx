'use client';
import React, { useState, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { initializeFirebase, addDocumentNonBlocking } from '@/firebase';

const { firestore: db } = initializeFirebase();

export function CommentsSheet({ isOpen, onClose, postId }: { isOpen: boolean, onClose: () => void, postId: string | null }) {
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthorName(localStorage.getItem('likeflow_username') || '');
    }
  }, []);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => {
      if (!postId) return [];
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('postId', '==', postId), orderBy('timestamp', 'desc'));
      return new Promise((resolve) => {
        onSnapshot(q, (snapshot) => {
          const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          resolve(commentsData);
        });
      });
    },
    enabled: isOpen && !!postId,
  });

  const addCommentMutation = useMutation({
    mutationFn: (data: { postId: string, authorName: string, text: string }) => {
        const commentData = {
          ...data,
          timestamp: serverTimestamp()
        };
        return addDocumentNonBlocking(collection(db, "comments"), commentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !postId) return;

    if (authorName) {
      localStorage.setItem('likeflow_username', authorName);
    }

    addCommentMutation.mutate({
      postId,
      authorName: authorName || 'Anonimo',
      text: newComment.trim()
    });
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}g`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-[#111] rounded-t-3xl z-50 max-h-[70vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-800">
              <h3 className="text-white font-bold text-lg">{comments.length} commenti</h3>
              <button onClick={onClose} className="p-2">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nessun commento ancora</p>
                  <p className="text-gray-600 text-sm mt-1">Sii il primo a commentare!</p>
                </div>
              ) : (
                comments.map((comment: any, index: number) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700]/30 to-[#B8860B]/30 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">
                          {comment.authorName || 'Anonimo'}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatTime(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-[#0a0a0a]">
              <div className="flex gap-2 mb-2">
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Il tuo nome"
                  className="flex-1 bg-[#1a1a1a] border-gray-700 text-white text-sm h-10 rounded-full px-4"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Aggiungi un commento..."
                  className="flex-1 bg-[#1a1a1a] border-gray-700 text-white text-sm h-12 rounded-full px-4"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={!newComment.trim() || addCommentMutation.isPending}
                  className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="w-5 h-5 text-black" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
