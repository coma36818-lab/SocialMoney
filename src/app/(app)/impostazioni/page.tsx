'use client';
import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Lock, Trash2, Save, AlertCircle, Moon, Sun, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/lib/api";
import type { User as UserType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmojiPicker from "@/components/EmojiPicker";

export default function Impostazioni() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    city: "",
    region: "",
    country: "",
    gender: "non specificato",
    avatar: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') !== 'light';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);


  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || "",
        bio: userData.bio || "",
        city: userData.city || "",
        region: userData.region || "",
        country: userData.country || "",
        gender: userData.gender || "non specificato",
        avatar: userData.avatar || "",
      });
      if (userData.avatar) {
        setAvatarPreview(userData.avatar);
      }
    } catch (error) {
      router.push(createPageUrl("login"));
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setAvatarPreview(result);
            setFormData(prev => ({...prev, avatar: result}));
        };
        reader.readAsDataURL(file);
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await base44.auth.updateMe({
        full_name: data.full_name,
        nickname: data.full_name, // Sync nickname
        bio: data.bio,
        city: data.city,
        region: data.region,
        country: data.country,
        gender: data.gender as UserType['gender'],
        avatar: data.avatar,
      });
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwOUKfk7rdiFAY4kdXzzHosBSl+zPLaizsKHGS/7+OaSwcNUKXh8LhjGgU7k9n1x3YtBSh+zfPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7lNf0y3YsBSh+zPPaizsKHGS/7+OaSwcNUKXh8LhjGgU7');
      audio.volume = 0.3;
      audio.play();
    },
    onSuccess: () => {
      toast({ title: "Successo", description: "Profilo aggiornato con successo!" });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      loadUser();
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: "Errore", description: "Errore nell'aggiornamento del profilo: " + error.message });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-gray-400">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] p-4 sm:p-8">
       <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-primary">Impostazioni</span>
          </h1>
          <p className="text-gray-400">Gestisci il tuo account e le preferenze</p>
        </motion.div>

        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="glass-card border-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                    {darkMode ? <Moon className="w-5 h-5 text-[#3D9DF7]" /> : <Sun className="w-5 h-5 text-[#FFD700]" />}
                    Aspetto
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-white">Tema Scuro</p>
                        <p className="text-sm text-gray-400">Attiva/disattiva il tema scuro</p>
                    </div>
                    <Switch
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                        className="data-[state=checked]:bg-[#FF0055]"
                    />
                    </div>
                </CardContent>
                </Card>
            </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5 text-primary" />
                  Informazioni Profilo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                <div className="flex flex-col items-center space-y-4">
                    <Label htmlFor="avatar-upload">Immagine Profilo</Label>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Avatar className="w-32 h-32 border-4 border-primary/50 hover:border-primary transition-colors">
                            <AvatarImage src={avatarPreview ?? undefined} alt="Avatar" className="object-cover" />
                            <AvatarFallback className="bg-muted-foreground">
                                <User className="w-16 h-16 text-white" />
                            </AvatarFallback>
                        </Avatar>
                    </label>
                    <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>


                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name" className="text-gray-300">Nickname</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-2"
                        placeholder="Il tuo nome"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender" className="text-gray-300">Genere</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white mt-2">
                          <SelectValue placeholder="Seleziona" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="uomo">Uomo</SelectItem>
                            <SelectItem value="donna">Donna</SelectItem>
                            <SelectItem value="altro">Altro</SelectItem>
                            <SelectItem value="non specificato">Preferisco non specificare</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                    <div className="relative">
                        <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-2 min-h-[100px]"
                        placeholder="Racconta qualcosa di te..."
                        />
                        <div className="absolute bottom-1 right-1">
                            <EmojiPicker onEmojiSelect={(emoji) => setFormData(prev => ({...prev, bio: prev.bio + emoji}))} />
                        </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-300">Città</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-2"
                        placeholder="Es: Roma"
                      />
                    </div>

                    <div>
                      <Label htmlFor="region" className="text-gray-300">Regione</Label>
                      <Input
                        id="region"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-2"
                        placeholder="Es: Lazio"
                      />
                    </div>
                  </div>

                   <div>
                      <Label htmlFor="country" className="text-gray-300">Paese</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="bg-white/5 border-white/10 text-white mt-2"
                        placeholder="Es: Italia"
                      />
                    </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="w-full bg-gradient-to-r from-primary to-[#ff3366] hover:opacity-90 text-white neon-glow"
                    >
                      {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      {updateProfileMutation.isPending ? "Salvataggio..." : "Salva Modifiche"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Mail className="w-5 h-5 text-[#3D9DF7]" />
                  Informazioni Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Email</Label>
                  <p className="text-white font-medium mt-1">{user.email}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Membro da</Label>
                  <p className="text-white font-medium mt-1">
                    {user.created_date ? new Date(user.created_date).toLocaleDateString('it-IT') : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Lock className="w-5 h-5 text-[#FFD700]" />
                  Sicurezza
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm mb-4">
                  Gestisci password e sicurezza del tuo account
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full border-white/10 text-white hover:bg-white/5 bg-[#1a1a1a] border"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Cambia Password
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} >
            <Card className="glass-card border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Trash2 className="w-5 h-5" />
                  Gestione Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Una volta eliminato l'account, non c'è modo di tornare indietro. 
                  Tutti i tuoi dati saranno persi permanentemente.
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Elimina Account
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
