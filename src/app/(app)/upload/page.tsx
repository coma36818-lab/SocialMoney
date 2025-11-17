'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { base44 } from '@/lib/api';
import { Loader2, Image as ImageIcon, Video, Type, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { suggestPostCaption } from '@/ai/flows/suggest-post-caption';

const postSchema = z.object({
  description: z.string().min(1, 'La descrizione è richiesta').max(1000),
  media_type: z.enum(['text', 'image', 'video']),
  media_file: z.any().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('text');
  const [preview, setPreview] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      description: '',
      media_type: 'text',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('media_file', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      const user = await base44.auth.me();
      return base44.entities.Post.create({
        created_by: user.email,
        description: data.description,
        media_type: data.media_type,
        media_url: preview || undefined, // In a real app, this would be the URL from blob storage
        created_date: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      toast({ title: 'Successo!', description: 'Il tuo post è stato pubblicato.' });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push('/feed');
    },
    onError: (error: Error) => {
      toast({ variant: 'destructive', title: 'Errore', description: error.message });
    },
  });

  const onSubmit = (data: PostFormValues) => {
    createPostMutation.mutate(data);
  };
  
  const handleSuggestCaption = async () => {
    if (activeTab !== 'image' || !preview) {
        toast({variant: 'destructive', title: 'Nessuna immagine selezionata'});
        return;
    }
    setIsSuggesting(true);
    try {
        const result = await suggestPostCaption({ mediaDataUri: preview });
        if (result.caption) {
            form.setValue('description', result.caption);
            toast({title: 'Didascalia suggerita!', description: 'La didascalia è stata inserita.'});
        }
    } catch (e) {
        toast({variant: 'destructive', title: 'Errore AI', description: 'Impossibile suggerire una didascalia.'});
    } finally {
        setIsSuggesting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass-card w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Crea un Nuovo Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs
                defaultValue="text"
                className="w-full"
                onValueChange={(value) => {
                  setActiveTab(value);
                  form.setValue('media_type', value as 'text' | 'image' | 'video');
                  setPreview(null);
                  form.setValue('media_file', null);
                }}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text"><Type className="w-4 h-4 mr-2"/>Testo</TabsTrigger>
                  <TabsTrigger value="image"><ImageIcon className="w-4 h-4 mr-2"/>Immagine</TabsTrigger>
                  <TabsTrigger value="video"><Video className="w-4 h-4 mr-2"/>Video</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-6" />
                <TabsContent value="image" className="mt-6">
                  <FormField name="media_file" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Immagine</FormLabel>
                      <FormControl><Input type="file" accept="image/*" onChange={handleFileChange} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   {preview && <Image src={preview} alt="Preview" width={500} height={300} className="mt-4 rounded-lg object-cover w-full" />}
                </TabsContent>
                <TabsContent value="video" className="mt-6">
                  <FormField name="media_file" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Video</FormLabel>
                      <FormControl><Input type="file" accept="video/*" onChange={handleFileChange} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {preview && <video src={preview} controls className="mt-4 rounded-lg w-full" />}
                </TabsContent>
              </Tabs>

              <div className="relative">
                <FormField name="description" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descrizione</FormLabel>
                        <FormControl><Textarea placeholder="Scrivi qualcosa di interessante..." {...field} rows={5} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                {activeTab === 'image' && preview && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSuggestCaption} 
                        disabled={isSuggesting}
                        className="absolute bottom-10 right-2 flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                    >
                         {isSuggesting ? <Loader2 className="h-3 w-3 animate-spin"/> : <Sparkles className="h-3 w-3" />}
                         Suggerisci
                    </Button>
                )}
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 neon-glow" disabled={createPostMutation.isPending}>
                {createPostMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pubblica Post
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
