
'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

export default function LikeFlowUploadPage() {
  useEffect(() => {
    // This script now handles all LikeFlow logic.
    // Ensure it's correctly placed in the /public folder.
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/likeflow.js';
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>LikeFlow - Upload</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="title text-4xl font-black text-center mb-8 bg-gradient-to-r from-primary via-yellow-300 to-accent bg-clip-text text-transparent">
          🎬 Carica un nuovo post
        </h1>

        <Card className="bg-card/50 upload-container">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="authorName" className="text-sm font-medium text-muted-foreground">Nome autore (opzionale)</label>
              <Input id="authorName" placeholder="Es. Marco, LadyPhoto, Anonimo…" className="bg-background/50" />
            </div>
            
            <div className="space-y-2">
                <label htmlFor="authorPhoto" className="text-sm font-medium text-muted-foreground">Foto autore (opzionale)</label>
                <Input id="authorPhoto" type="file" accept="image/*" className="mt-2 file:text-primary file:font-semibold" />
            </div>

            <div className="space-y-2">
              <label htmlFor="postDesc" className="text-sm font-medium text-muted-foreground">Descrizione (opzionale)</label>
              <Textarea id="postDesc" rows={3} placeholder="Scrivi una descrizione…" className="bg-background/50" />
            </div>
            
            <div className="space-y-2">
                <label htmlFor="mediaFile" className="text-sm font-medium text-muted-foreground">Carica il tuo contenuto</label>
                 <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-primary/50 px-6 py-10">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                          <label htmlFor="mediaFile" className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background hover:text-primary/80">
                            <span>Carica un file</span>
                            <input id="mediaFile" name="mediaFile" type="file" className="sr-only" accept="video/*,image/*,audio/*"/>
                          </label>
                          <p className="pl-1">o trascina e rilascia</p>
                        </div>
                        <p className="text-xs leading-5 text-muted-foreground/70">Video, Immagini, Audio</p>
                      </div>
                  </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button onClick={() => (window as any).uploadPost()} className="w-full bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300">
              Carica Post
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
