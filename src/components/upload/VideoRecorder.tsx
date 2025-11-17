
'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, StopCircle, Upload, Loader2, Video as VideoIcon, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, storage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { base44 } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { createPageUrl } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function VideoRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Funzione non supportata',
          description: 'Il tuo browser non supporta l\'accesso alla fotocamera.',
        });
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: true,
      });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Accesso Fotocamera Negato',
        description: 'Abilita i permessi per la fotocamera nelle impostazioni del browser.',
      });
    }
  };


  const startRecording = () => {
    if (!videoRef.current?.srcObject) {
      toast({ variant: 'destructive', title: 'Fotocamera non pronta' });
      return;
    }
    setRecordedBlob(null);
    const stream = videoRef.current.srcObject as MediaStream;
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: BlobPart[] = [];
    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setRecordedBlob(blob);
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!recordedBlob) {
      toast({ variant: 'destructive', title: 'Nessun video da caricare' });
      return;
    }
    const user = auth.currentUser;
    if (!user || !user.email) {
      toast({ variant: 'destructive', title: 'Autenticazione richiesta' });
      return;
    }

    setIsUploading(true);
    const videoId = uuid();
    const videoRefPath = `videos/${user.uid}/${videoId}.webm`;
    const storageRef = ref(storage, videoRefPath);
    const uploadTask = uploadBytesResumable(storageRef, recordedBlob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      (error) => {
        console.error('Upload error:', error);
        toast({ variant: 'destructive', title: 'Errore di caricamento', description: 'Riprova.' });
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await base44.entities.Post.create({
            created_by: user.email!,
            media_url: downloadURL,
            media_type: 'video',
            description: 'Video registrato dall\'app!',
            created_date: new Date().toISOString(),
          });
          toast({ title: 'Successo!', description: 'Video pubblicato con successo!' });
          router.push(createPageUrl('feed'));
        } catch (dbError) {
          console.error('Database error:', dbError);
          toast({ variant: 'destructive', title: 'Errore Database', description: 'Impossibile salvare il post.' });
        } finally {
          setIsUploading(false);
        }
      }
    );
  };

  const reset = () => {
    setRecordedBlob(null);
    setIsRecording(false);
    setIsUploading(false);
    setUploadProgress(0);
    getCameraPermission();
  };

  if (hasCameraPermission === false) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Accesso Fotocamera Richiesto</AlertTitle>
        <AlertDescription>
          Per registrare, abilita i permessi per la fotocamera nel tuo browser.
          <br />
          <Button onClick={getCameraPermission} className="mt-4">
            Riprova
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (hasCameraPermission === null) {
      return (
          <div className="text-center">
              <Button onClick={getCameraPermission} size="lg" className="bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-primary-foreground">
                  <Camera className="mr-2" /> Attiva Fotocamera
              </Button>
          </div>
      )
  }


  return (
    <div className="space-y-6">
      <div className="relative w-full aspect-video bg-muted rounded-2xl overflow-hidden glass-card">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        {recordedBlob && !isRecording && (
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
               <div className="text-center text-white">
                  <VideoIcon className="w-16 h-16 mx-auto" />
                  <p className="mt-2 font-semibold">Video pronto per l'upload</p>
               </div>
           </div>
        )}
      </div>

      {isUploading ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4"/>
              Caricamento in corso...
            </p>
            <p className="font-semibold text-primary">{uploadProgress}%</p>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      ) : recordedBlob ? (
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={reset} variant="outline" size="lg">
            <RotateCcw className="mr-2" /> Registra di nuovo
          </Button>
          <Button onClick={handleUpload} size="lg" className="bg-gradient-to-r from-primary to-[#ff3366] text-primary-foreground neon-glow">
            <Upload className="mr-2" /> Pubblica Video
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="w-full max-w-sm"
          >
            {isRecording ? (
                <>
                    <StopCircle className="mr-2" /> Ferma registrazione
                </>
            ) : (
                <>
                    <StopCircle className="mr-2" /> Inizia a registrare
                </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
