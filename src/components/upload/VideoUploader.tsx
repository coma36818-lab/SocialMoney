
"use client";

import React, { useState } from "react";
import { auth, storage } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { base44 } from "@/lib/api";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";

export default function VideoUploader() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Inattivo");
  const { toast } = useToast();
  const router = useRouter();

  const MAX_SIZE_MB = 100;

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
        toast({ variant: "destructive", title: "Autenticazione richiesta", description: "Devi accedere per caricare un video." });
        return;
    }
    
    // This check is often not populated immediately, so we rely on backend rules
    // if (!user.emailVerified) {
    //     toast({ variant: "destructive", title: "Email non verificata", description: "Verifica la tua email prima di caricare video." });
    //     return;
    // }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({ variant: "destructive", title: "File troppo grande", description: `Il video supera il limite di ${MAX_SIZE_MB}MB` });
      return;
    }

    setLoading(true);

    try {
      let finalFile = file;

      // Simple client-side check if conversion is needed
      if (!file.type.includes('mp4')) {
        // 2) CONVERSIONE MP4 (ffmpeg WASM)
        setStatus("Conversione in MP4...");
        const ffmpeg = new FFmpeg();
        await ffmpeg.load();

        ffmpeg.writeFile("input", await fetchFile(file));
        await ffmpeg.exec(["-i", "input", "output.mp4"]);
        const mp4Data = await ffmpeg.readFile("output.mp4");
        finalFile = new File([mp4Data], `${uuid()}.mp4`, { type: "video/mp4" });
      }

      // UPLOAD IN BACKGROUND (QUEUE AUTOMATICO)
      setStatus("Caricamento video...");
      const videoRef = ref(storage, `videos/${user.uid}/${finalFile.name}`);
      const uploadTask = uploadBytesResumable(videoRef, finalFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        (err) => { throw err }, // Rethrow to be caught by outer catch
        async () => {
          const videoURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Salva nel database
          setStatus("Finalizzazione...");
          await base44.entities.Post.create({
            created_by: user.email,
            media_url: videoURL,
            media_type: 'video',
            imageUrl: '', // Thumbnails can be generated server-side
            description: "", // Can be filled from another input
            created_date: new Date().toISOString(),
          });

          setLoading(false);
          toast({ title: "Successo", description: "Caricamento completato!" });
          router.push(createPageUrl("feed"));
        }
      );
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Errore durante l'upload", description: "Qualcosa è andato storto. Riprova." });
      setLoading(false);
      setProgress(0);
      setStatus("Inattivo");
    }
  };

  return (
    <div className="space-y-6">
       <label
            htmlFor="video-upload"
            className="relative flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
        >
            <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    Seleziona un video da caricare
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Video fino a ${MAX_SIZE_MB} MB.
                </p>
            </div>
            <Input
                id="video-upload"
                type="file"
                className="sr-only"
                accept="video/*,image/*"
                onChange={handleUpload}
                disabled={loading}
            />
        </label>


      {loading && (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                 <p className="text-muted-foreground font-medium">{status}</p>
                 <p className="font-semibold text-primary">{progress}%</p>
            </div>
            <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  );
}
