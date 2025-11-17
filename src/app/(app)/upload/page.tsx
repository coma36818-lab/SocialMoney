
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
import VideoRecorder from "@/components/upload/VideoRecorder";


export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [textContent, setTextContent] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [postType, setPostType] = useState("media");

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime'];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast({ variant: 'destructive', title: "Formato non supportato", description: "Usa JPG, PNG o MP4" });
      return;
    }

    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const uploadMutation = useMutation({
    mutationFn: async (mediaUrl?: string) => {
      if (!user) throw new Error("Utente non autenticato");

      if (postType === "text") {
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
      } else { // media or record
        const finalMediaUrl = mediaUrl || preview;
        if (!finalMediaUrl) throw new Error("File non selezionato o non registrato");
        const mediaType = file?.type.startsWith('image/') ? 'image' : 'video';
        
        await base44.entities.Post.create({
          created_by: user.email,
          description,
          media_url: finalMediaUrl,
          media_type: mediaType,
          created_date: new Date().toISOString()
        });
      }

      await base44.entities.Notification.create({
        created_by: user.email,
        type: "system",
        message: "Post pubblicato con successo!"
      });
    },
    onSuccess: () => {
      toast({ title: "Successo!", description: "Post pubblicato con successo!"});
      queryClient.invalidateQueries({ queryKey: ['posts']});
      router.push(createPageUrl("Feed"));
    },
    onError: (error: Error) => {
        toast({ variant: 'destructive', title: "Errore", description: error.message });
    }
  });

  const handleSubmit = (mediaUrl?: string) => {
    if (postType === "media" && !file) {
      toast({ variant: 'destructive', title: "Errore", description: "Seleziona un file da caricare" });
      return;
    }
     if (postType === "record" && !mediaUrl) {
      toast({ variant: 'destructive', title: "Errore", description: "Nessun video registrato da pubblicare." });
      return;
    }
    if (postType === "text" && !textContent.trim()) {
       toast({ variant: 'destructive', title: "Errore", description: "Scrivi qualcosa da pubblicare" });
      return;
    }
    uploadMutation.mutate(mediaUrl);
  };

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
                {!preview ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileInput}
                      accept="image/*,video/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-[#ff3366] rounded-2xl flex items-center justify-center neon-glow">
                        <Upload className="w-10 h-10 text-primary-foreground" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Carica Media
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Trascina qui il file o clicca per selezionare
                      </p>
                      
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          <span>JPG, PNG</span>
                        </div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          <span>MP4</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Preview */}
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                      {file?.type.startsWith('image/') ? (
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <video
                          src={preview}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )}
                      
                      <Button
                        onClick={() => {
                          setFile(null);
                          setPreview(null);
                        }}
                        variant="destructive"
                        size="icon"
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-foreground font-semibold mb-2">
                        Descrizione (opzionale)
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Scrivi una descrizione per il tuo post..."
                        className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground min-h-[120px]"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={() => handleSubmit()}
                      disabled={uploadMutation.isPending}
                      className="w-full bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-primary-foreground text-lg py-6 neon-glow"
                      size="lg"
                    >
                      {uploadMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Pubblicazione...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Pubblica Post
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

           {/* Record Video */}
          <TabsContent value="record">
            <Card className="glass-card">
              <CardContent className="p-8 space-y-6">
                <VideoRecorder onUploadComplete={handleSubmit} isSubmitting={uploadMutation.isPending} />
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
                  onClick={() => handleSubmit()}
                  disabled={uploadMutation.isPending || !textContent.trim()}
                  className="w-full bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-primary-foreground text-lg py-6 neon-glow"
                  size="lg"
                >
                  {uploadMutation.isPending ? (
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
