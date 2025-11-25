'use client';
import React, { useState, useRef, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, orderBy, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload as UploadIcon, Image as ImageIcon, Video, Music, User, X, Check, Loader2, AlertCircle, Sparkles, Camera, Film, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const { firestore: db } = initializeFirebase();
const { storage } = initializeFirebase();

const SuccessAnimation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center"
        animate={{ boxShadow: ['0 0 0 0 rgba(255,215,0,0.4)', '0 0 0 40px rgba(255,215,0,0)'] }}
        transition={{ duration: 1, repeat: 3 }}
      >
        <Check className="w-12 h-12 text-black" />
      </motion.div>
      {/* Confetti particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7'][i % 4],
            top: '50%',
            left: '50%'
          }}
          initial={{ x: 0, y: 0, scale: 0 }}
          animate={{
            x: Math.cos(i * 30 * Math.PI / 180) * 100,
            y: Math.sin(i * 30 * Math.PI / 180) * 100,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      ))}
    </motion.div>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-white text-xl font-bold mt-6"
    >
      Pubblicato! 🎉
    </motion.p>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-gray-400 mt-2"
    >
      Il tuo contenuto è online
    </motion.p>
  </motion.div>
);

export default function Upload() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<{
    authorName: string;
    authorPhoto: File | null;
    authorPhotoPreview: string | null;
    description: string;
    mediaFile: File | null;
    mediaPreview: string | null;
    mediaType: 'video' | 'audio' | 'photo' | null
}>({
    authorName: '',
    authorPhoto: null,
    authorPhotoPreview: null,
    description: '',
    mediaFile: null,
    mediaPreview: null,
    mediaType: null
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [wallet, setWallet] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('likeflow_wallet');
      if (saved) return JSON.parse(saved);
    }
    return { likes: 5, uploads: 3 };
  });

  const updateWallet = (newWallet: { likes: number, uploads: number }) => {
    setWallet(newWallet);
    if (typeof window !== 'undefined') {
      localStorage.setItem('likeflow_wallet', JSON.stringify(newWallet));
    }
  };

  const handleMediaSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type.split('/')[0];
    let mediaType: 'photo' | 'video' | 'audio' | null = 'photo';
    if (type === 'video') mediaType = 'video';
    else if (type === 'audio') mediaType = 'audio';

    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      mediaFile: file,
      mediaPreview: preview,
      mediaType
    }));
  };

  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      authorPhoto: file,
      authorPhotoPreview: preview
    }));
  };

  const removeMedia = () => {
    setFormData(prev => ({
      ...prev,
      mediaFile: null,
      mediaPreview: null,
      mediaType: null
    }));
  };

  const removeAuthorPhoto = () => {
    setFormData(prev => ({
      ...prev,
      authorPhoto: null,
      authorPhotoPreview: null
    }));
  };

  const handleSubmit = async () => {
    if (!formData.mediaFile) {
      setError('Seleziona un file da caricare');
      return;
    }

    if (wallet.uploads <= 0) {
      setError('Upload terminati! Acquista un pacchetto per continuare.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const mediaRef = ref(storage, "posts/" + Date.now() + "-" + formData.mediaFile.name);
      await uploadBytes(mediaRef, formData.mediaFile);
      const mediaURL = await getDownloadURL(mediaRef);


      let authorPhotoUrl = "";
      if (formData.authorPhoto) {
          const apRef = ref(storage, "authors/" + Date.now() + "-" + formData.authorPhoto.name);
          await uploadBytes(apRef, formData.authorPhoto);
          authorPhotoUrl = await getDownloadURL(apRef);
      }

      setUploadProgress(95);

      await addDoc(collection(db, "posts"), {
        authorName: formData.authorName || null,
        authorPhoto: authorPhotoUrl,
        postDesc: formData.description || null,
        mediaURL: mediaURL,
        mediaType: formData.mediaFile.type,
        likes: 0,
        likesWeek: 0,
        timestamp: Date.now()
      });

      setUploadProgress(100);
      clearInterval(progressInterval);

      updateWallet({ ...wallet, uploads: wallet.uploads - 1 });
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      setSuccess(true);
      setTimeout(() => {
        router.push('/likeflow/feed');
      }, 2500);

    } catch (err) {
      clearInterval(progressInterval);
      setError('Errore durante il caricamento. Riprova.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };


  const getMediaIcon = () => {
    switch (formData.mediaType) {
      case 'video': return <Film className="w-6 h-6" />;
      case 'audio': return <Mic className="w-6 h-6" />;
      default: return <Camera className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black pb-8 pt-16 overflow-y-auto">
      {/* Success animation */}
      <AnimatePresence>
        {success && <SuccessAnimation />}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 bg-gradient-to-b from-black to-transparent backdrop-blur-sm px-4 py-4 z-10"
      >
        <h1 className="text-white text-xl font-bold text-center flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FFD700]" />
          Crea
        </h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <motion.div 
            className="flex items-center gap-2 bg-[#FFD700]/10 rounded-full px-3 py-1"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <UploadIcon className="w-4 h-4 text-[#FFD700]" />
            <span className="text-[#FFD700] text-sm font-medium">{wallet.uploads} disponibili</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 mb-6 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-red-400 text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media upload area */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {!formData.mediaPreview ? (
            <motion.button
              whileHover={{ scale: 1.02, borderColor: '#FFD700' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[9/16] max-h-[400px] rounded-3xl border-2 border-dashed border-[#333] bg-gradient-to-br from-[#111] to-[#0a0a0a] flex flex-col items-center justify-center gap-6 transition-all overflow-hidden relative"
            >
              {/* Animated background */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute w-96 h-96 rounded-full bg-[#FFD700]/5 blur-3xl"
                  animate={{ 
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
                  <UploadIcon className="w-10 h-10 text-black" />
                </div>
              </motion.div>
              
              <div className="text-center relative z-10">
                <p className="text-white font-bold text-lg">Tocca per caricare</p>
                <p className="text-gray-500 text-sm mt-2">Video, foto o audio</p>
                <p className="text-gray-600 text-xs mt-1">Max 20MB</p>
              </div>

              {/* Quick action buttons */}
              <div className="flex gap-4 mt-2 relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center">
                    <Camera className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <span className="text-gray-500 text-xs">Foto</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center">
                    <Film className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <span className="text-gray-500 text-xs">Video</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center">
                    <Mic className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <span className="text-gray-500 text-xs">Audio</span>
                </motion.div>
              </div>
            </motion.button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden bg-[#111] aspect-[9/16] max-h-[400px]"
            >
              {formData.mediaType === 'video' && (
                <video 
                  src={formData.mediaPreview!} 
                  className="w-full h-full object-cover"
                  controls
                />
              )}
              {formData.mediaType === 'photo' && (
                <img 
                  src={formData.mediaPreview!} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
              {formData.mediaType === 'audio' && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center mb-6"
                  >
                    <Mic className="w-16 h-16 text-black" />
                  </motion.div>
                  <audio src={formData.mediaPreview!} controls className="w-3/4" />
                </div>
              )}
              
              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={removeMedia}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center border border-white/20"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
              
              {/* Media type badge */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
                {getMediaIcon()}
                <span className="text-white text-sm font-medium capitalize">{formData.mediaType}</span>
              </div>
            </motion.div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleMediaSelect}
            className="hidden"
          />
        </motion.div>

        {/* Author section */}
        <motion.div 
          className="mb-6 p-4 rounded-2xl bg-[#111] border border-[#222]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">Informazioni autore (opzionale)</p>
          
          <div className="flex items-center gap-4 mb-4">
            {formData.authorPhotoPreview ? (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <img 
                  src={formData.authorPhotoPreview}
                  alt="Author"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#FFD700]"
                />
                <button
                  onClick={removeAuthorPhoto}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, borderColor: '#FFD700' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => photoInputRef.current?.click()}
                className="w-16 h-16 rounded-full border-2 border-dashed border-[#333] bg-[#0a0a0a] flex items-center justify-center transition-colors"
              >
                <User className="w-7 h-7 text-gray-500" />
              </motion.button>
            )}
            
            <div className="flex-1">
              <Input
                value={formData.authorName}
                onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                placeholder="@username"
                className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-gray-600 focus:border-[#FFD700] rounded-xl"
              />
            </div>
          </div>
          
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </motion.div>

        {/* Description */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Scrivi una descrizione accattivante..."
            rows={3}
            className="bg-[#111] border-[#222] text-white placeholder:text-gray-600 focus:border-[#FFD700] resize-none rounded-2xl"
          />
        </motion.div>

        {/* Upload progress */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Caricamento...</span>
                <span className="text-[#FFD700] text-sm font-bold">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FFD700] to-[#B8860B]"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: formData.mediaFile && !isUploading ? 1.02 : 1 }}
          whileTap={{ scale: formData.mediaFile && !isUploading ? 0.98 : 1 }}
          onClick={handleSubmit}
          disabled={isUploading || !formData.mediaFile}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            formData.mediaFile && !isUploading
              ? 'bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black shadow-lg shadow-[#FFD700]/20'
              : 'bg-[#222] text-gray-500 cursor-not-allowed'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Pubblicazione...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Pubblica
            </>
          )}
        </motion.button>

        {/* Low uploads warning */}
        {wallet.uploads <= 1 && !isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-2xl border border-[#FFD700]/30 bg-[#FFD700]/5"
          >
            <p className="text-[#FFD700] text-sm text-center mb-3">
              ⚡ Upload quasi terminati!
            </p>
            <Button
              onClick={() => router.push('/likeflow/purchase')}
              variant="outline"
              className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black rounded-xl"
            >
              Acquista Upload
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
