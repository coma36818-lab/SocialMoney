
'use client';
import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image as ImageIcon, Video, X, Loader2, Type, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { base44 } from "@/lib/api";
import Image from "next/image";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import VideoUploader from "@/components/upload/VideoUploader";
import VideoRecorder from "@/components/upload/VideoRecorder";


export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [textContent, setTextContent] = useState("");
  const [postType, setPostType] = useState("media");
   const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      router.push(createPageUrl("Upload"));
    }
  };


  const textUploadMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Utente non autenticato");
      if (!textContent.trim()) {
        throw new Error("Inserisci un testo");
      }
      
      await base44.entities.Post.create({
        created_by: user.email,
        description: textContent,
        media_url: "",
        media_type: "text",
        created_date: new Date().toISOString()
      });

      await base44.entities.Notification.create({
        created_by: user.email,
        type: "system",
        message: "Post pubblicato con successo!"
      });
    },
    onSuccess: () => {
      toast({ title: "Successo!", description: "Post di testo pubblicato con successo!"});
      queryClient.invalidateQueries({ queryKey: ['posts']});
      router.push(createPageUrl("Feed"));
    },
    onError: (error: Error) => {
        toast({ variant: 'destructive', title: "Errore", description: error.message });
    },
     onSettled: () => {
      setIsSubmitting(false);
    }
  });


  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Pubblica <span className="text-primary">Contenuto</span>
          </h1>
          <p className="text-muted-foreground">Carica, registra o scrivi e inizia a guadagnare</p>
        </div>

        <Tabs value={postType} onValueChange={setPostType} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted text-muted-foreground">
            <TabsTrigger value="media" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
              <ImageIcon className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="record" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
              <Camera className="w-4 h-4 mr-2" />
              Registra
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
              <Type className="w-4 h-4 mr-2" />
              Solo Testo
            </TabsTrigger>
          </TabsList>

          {/* Media Upload */}
          <TabsContent value="media">
            <Card className="glass-card">
              <CardContent className="p-8">
                 <VideoUploader />
              </CardContent>
            </Card>
          </TabsContent>
          
           {/* Recorder */}
          <TabsContent value="record">
            <Card className="glass-card">
              <CardContent className="p-8">
                 <VideoRecorder />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Text Post */}
          <TabsContent value="text">
            <Card className="glass-card">
              <CardContent className="p-8 space-y-6">
                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Cosa vuoi condividere?
                  </label>
                  <Textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Scrivi i tuoi pensieri, una citazione, un annuncio..."
                    className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground min-h-[300px] text-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {textContent.length} caratteri
                  </p>
                </div>

                <Button
                  onClick={() => {
                      setIsSubmitting(true);
                      textUploadMutation.mutate();
                  }}
                  disabled={isSubmitting || !textContent.trim()}
                  className="w-full bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-primary-foreground text-lg py-6 neon-glow"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Pubblicazione...
                    </>
                  ) : (
                    <>
                      <Type className="w-5 h-5 mr-2" />
                      Pubblica Post
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <h4 className="font-bold text-foreground mb-1 text-sm">Guadagna</h4>
            <p className="text-xs text-muted-foreground">€0.01 per ogni like</p>
          </div>
          
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <h4 className="font-bold text-foreground mb-1 text-sm">Viralità</h4>
            <p className="text-xs text-muted-foreground">Raggiungi migliaia di utenti</p>
          </div>
          
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-bold text-foreground mb-1 text-sm">Istantaneo</h4>
            <p className="text-xs text-muted-foreground">Pubblica in pochi secondi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
