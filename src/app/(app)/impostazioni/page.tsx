'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { base44 } from '@/lib/api';
import { Loader2, User as UserIcon } from 'lucide-react';
import type { User } from '@/lib/types';
import { createPageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import EmojiPicker from '@/components/EmojiPicker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const settingsSchema = z.object({
  nickname: z.string().min(3, 'Il nickname deve avere almeno 3 caratteri'),
  bio: z.string().max(200, 'La bio non può superare i 200 caratteri').optional(),
  city: z.string().min(1, 'La città è richiesta'),
  region: z.string().min(1, 'La regione è richiesta'),
  avatar: z.any().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);


  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        form.reset({
          nickname: userData.nickname,
          bio: userData.bio || '',
          city: userData.city,
          region: userData.region,
        });
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
        }
      } catch (error) {
        router.push(createPageUrl("login"));
      }
    };
    loadUser();
  }, [router, form]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };


  const updateProfileMutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      const updates: Partial<User> = {
        nickname: data.nickname,
        full_name: data.nickname, // Keep them in sync
        bio: data.bio,
        city: data.city,
        region: data.region,
      };

      if (avatarPreview && avatarPreview !== user?.avatar) {
        updates.avatar = avatarPreview;
      }
      return await base44.auth.updateMe(updates);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', user?.email] });
      toast({ title: 'Profilo aggiornato!', description: 'Le tue modifiche sono state salvate.' });
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Errore', description: error.message });
    },
  });
  
  const onSubmit = (data: SettingsFormValues) => {
    updateProfileMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Impostazioni Profilo</CardTitle>
          <CardDescription>Aggiorna le tue informazioni personali.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField name="avatar" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                    <FormLabel>Immagine Profilo</FormLabel>
                    <FormControl>
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Avatar className="w-32 h-32 border-4 border-primary/50 hover:border-primary transition-colors">
                                <AvatarImage src={avatarPreview ?? undefined} alt="Avatar" className="object-cover" />
                                <AvatarFallback className="bg-muted-foreground">
                                    <UserIcon className="w-16 h-16 text-white" />
                                </AvatarFallback>
                            </Avatar>
                            <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </label>
                    </FormControl>
                    <FormMessage />
                </FormItem>
              )} />


              <FormField name="nickname" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl><Input placeholder="Il tuo nickname" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="bio" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <div className="relative">
                    <FormControl><Textarea placeholder="Parlaci un po' di te..." {...field} /></FormControl>
                    <div className="absolute bottom-1 right-1">
                      <EmojiPicker onEmojiSelect={(emoji) => field.onChange(field.value + emoji)} />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField name="city" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Città</FormLabel>
                    <FormControl><Input placeholder="La tua città" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField name="region" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regione</FormLabel>
                    <FormControl><Input placeholder="La tua regione" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 neon-glow" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salva Modifiche
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
