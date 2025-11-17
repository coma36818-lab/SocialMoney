
"use client";
import React, { useRef, useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Camera, Video, Mic, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

interface VideoRecorderProps {
  onUploadComplete: (downloadUrl: string) => void;
  isSubmitting: boolean;
}

export default function VideoRecorder({ onUploadComplete, isSubmitting }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1080 },
          height: { ideal: 1920 },
          facingMode: "user"
        },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasCameraPermission(true);
      }
    } catch (err) {
      console.error("Errore fotocamera:", err);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Accesso Fotocamera Negato',
        description: 'Per registrare, abilita i permessi della fotocamera nelle impostazioni del browser.',
      });
    }
  };

  const startRecording = () => {
    if (!videoRef.current?.srcObject) {
      toast({ variant: 'destructive', title: 'Fotocamera non attiva', description: 'Attiva prima la fotocamera.' });
      return;
    }
    const stream = videoRef.current.srcObject as MediaStream;
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      await uploadVideo(videoBlob);
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const uploadVideo = async (blob: Blob) => {
    setUploading(true);
    const fileRef = ref(storage, `uploads/videos/${Date.now()}.webm`);
    const uploadTask = uploadBytesResumable(fileRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: update progress here
      },
      (error) => {
        console.error("Errore upload:", error);
        toast({ variant: 'destructive', title: 'Upload Fallito', description: 'Riprova.' });
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        toast({ title: 'Video Caricato!', description: 'Ora puoi pubblicare il tuo post.' });
        onUploadComplete(url);
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-contain" muted autoPlay playsInline />
        {hasCameraPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                 <Alert variant="destructive" className="m-4">
                      <AlertTitle>Accesso Fotocamera Richiesto</AlertTitle>
                      <AlertDescription>
                        Per favore, consenti l'accesso alla fotocamera per usare questa funzione.
                      </AlertDescription>
                </Alert>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button onClick={startCamera} variant="outline">
          <Camera className="mr-2" /> Attiva Fotocamera
        </Button>

        {!recording ? (
          <Button onClick={startRecording} disabled={!hasCameraPermission} className="bg-green-600 hover:bg-green-700 text-white">
            <Mic className="mr-2" /> Registra
          </Button>
        ) : (
          <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700 text-white">
             <div className="w-4 h-4 mr-2 bg-white rounded-sm"/> Stop
          </Button>
        )}
         <Button
            onClick={() => {
                // This is handled by onUploadComplete in uploadVideo
                if (recording) stopRecording();
            }}
            disabled={uploading || isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-primary-foreground neon-glow"
        >
            {uploading || isSubmitting ? (
            <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Caricamento...
            </>
            ) : (
            <>
                <Upload className="w-5 h-5 mr-2" />
                Pubblica Video
            </>
            )}
        </Button>
      </div>
    </div>
  );
}
