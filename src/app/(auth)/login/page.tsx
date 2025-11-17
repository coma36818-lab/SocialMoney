'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(1, 'La password è richiesta'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Accesso effettuato',
        description: 'Bentornato!',
      });
      router.push('/feed');
    } catch (error) {
      const authError = error as AuthError;
      let description = 'Credenziali non valide o utente non trovato.';
      switch (authError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          description = 'Email o password non corretti.';
          break;
        case 'auth/invalid-credential':
            description = 'Le credenziali fornite non sono valide.';
            break;
        default:
          description = 'Si è verificato un errore durante l\'accesso.';
          break;
      }
      toast({
        variant: 'destructive',
        title: 'Errore di accesso',
        description,
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-foreground">Social Money</CardTitle>
        <CardDescription>Accedi al tuo account per continuare</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 neon-glow" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Accedi
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Non hai un account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Registrati
            </Link>
          </p>
      </CardFooter>
    </Card>
  );
}
