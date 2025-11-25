
'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, UserCircle, FileText } from 'lucide-react';

export default function LikeFlowPage() {
  useEffect(() => {
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
      </Head>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-primary via-yellow-300 to-accent bg-clip-text text-transparent">
          Pubblica Contenuto
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Carica foto/video/testo e inizia a guadagnare
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="text-primary" /> Il Tuo Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="postDesc" className="text-sm font-medium text-muted-foreground">Descrizione (opzionale)</label>
                  <Textarea id="postDesc" placeholder="Scrivi una descrizione per il tuo post..." className="mt-2 bg-background/50" />
                </div>
                 <div>
                  <label htmlFor="mediaFile" className="text-sm font-medium text-muted-foreground">Carica Media</label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10">
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
            </Card>

             <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCircle className="text-primary" /> Info Creator (Opzionale)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="authorName" className="text-sm font-medium text-muted-foreground">Nome autore</label>
                  <Input id="authorName" placeholder="Es. Marco, LadyPhoto, Anonimo…" className="mt-2 bg-background/50" />
                </div>
                <div>
                  <label htmlFor="authorPhoto" className="text-sm font-medium text-muted-foreground">Foto autore</label>
                   <Input id="authorPhoto" type="file" accept="image/*" className="mt-2 file:text-primary file:font-semibold" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
             <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle>Le Tue Statistiche</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center bg-yellow-400/10 p-4 rounded-lg">
                        <span className="font-semibold">Saldo</span>
                        <span className="font-bold text-yellow-300 text-lg">0.00€</span>
                    </div>
                     <div className="flex justify-between items-center bg-pink-500/10 p-4 rounded-lg">
                        <span className="font-semibold">Like Ricevuti</span>
                        <span className="font-bold text-pink-400 text-lg">0</span>
                    </div>
                     <div className="flex justify-between items-center bg-blue-500/10 p-4 rounded-lg">
                        <span className="font-semibold">Like Disponibili</span>
                        <span className="font-bold text-blue-400 text-lg">0</span>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">+ Ricarica Like</Button>
                    <Button variant="outline" className="w-full bg-yellow-400/80 text-black hover:bg-yellow-300">Vai al Wallet</Button>
                </CardFooter>
            </Card>

            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle>Pubblica</CardTitle>
                    <CardDescription>Scegli un'opzione di pubblicazione</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => (window as any).uploadPost(false)}>
                        🔥 Carica Gratis (1 al giorno)
                    </Button>
                    <div className="text-center text-xs text-muted-foreground">oppure</div>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white" onClick={() => (window as any).uploadPost(true)}>
                        🚀 Pubblica con 1 Boost
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
