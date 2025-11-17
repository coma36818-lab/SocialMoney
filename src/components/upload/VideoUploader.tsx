
"use client";

import React, { useState } from "react";
import { storage, useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { collection } from "firebase/firestore";

export default function VideoUploader() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Inattivo");
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useUser();
  const firestore = useFirestore();

  const MAX_SIZE_MB = 100;

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!authUser) {
        toast({ variant: "destructive", title: "Autenticazione richiesta", description: "Devi accedere per caricare un video." });
        return;
    }
    
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({ variant: "destructive", title: "File troppo grande", description: `Il video supera il limite di ${MAX_SIZE_MB}MB` });
      return;
    }

    setLoading(true);

    try {
      let finalFile = file;
      let fileType = file.type.startsWith('image') ? 'image' : 'video';

      // Simple client-side check if conversion is needed for videos
      if (fileType === 'video' && !file.type.includes('mp4')) {
        setStatus("Conversione in MP4...");
        const ffmpeg = new FFmpeg();
        await ffmpeg.load();

        ffmpeg.writeFile("input", await fetchFile(file));
        await ffmpeg.exec(["-i", "input", "output.mp4"]);
        const mp4Data = await ffmpeg.readFile("output.mp4");
        finalFile = new File([mp4Data], `${uuid()}.mp4`, { type: "video/mp4" });
      }

      setStatus("Caricamento...");
      const filePath = `${fileType}s/${authUser.uid}/${finalFile.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, finalFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        (err) => { throw err }, // Rethrow to be caught by outer catch
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Salva nel database
          setStatus("Finalizzazione...");
          const postsCollRef = collection(firestore, 'posts');
          await addDocumentNonBlocking(postsCollRef, {
            userId: authUser.uid,
            media_url: downloadURL,
            media_type: fileType,
            description: "", // Can be filled from another input
            created_date: new Date().toISOString(),
            likes_count: 0,
            earnings: 0,
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
            htmlFor="media-upload"
            className="relative flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
        >
            <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    Seleziona un video o un'immagine
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    File fino a ${MAX_SIZE_MB} MB.
                </p>
            </div>
            <Input
                id="media-upload"
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

    