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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, AuthError } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { faker } from '@faker-js/faker';

const signupSchema = z.object({
  username: z.string().min(3, 'Il nome utente deve avere almeno 3 caratteri'),
  email: z.string().email('Email non valida'),
  password: z.string().min(8, 'La password deve avere almeno 8 caratteri'),
  age: z.coerce.number().min(18, 'Devi avere almeno 18 anni'),
  gender: z.enum(['uomo', 'donna', 'altro', 'non specificato']),
  city: z.string().min(1, 'La città è richiesta'),
  country: z.string().min(1, 'Il paese è richiesto'),
  region: z.string().min(1, 'La regione è richiesta'),
  referredBy: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      age: 18,
      gender: 'non specificato',
      city: '',
      country: 'Italia',
      region: '',
      referredBy: ''
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // 2. Create user profile in Firestore
      const newUserProfile: Omit<User, 'id'> = {
        uid: firebaseUser.uid,
        username: data.username,
        full_name: data.username,
        email: data.email,
        age: data.age,
        gender: data.gender,
        city: data.city,
        country: data.country,
        region: data.region,
        referredBy: data.referredBy || null,
        likeBalance: 20, // Default starting likes
        totalLikesReceived: 0,
        totalLikesSent: 0,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
        referralCode: faker.string.alphanumeric(8),
        accountStatus: 'active',
        verified: false, // Email is not verified on creation
      };

      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      setDocumentNonBlocking(userDocRef, newUserProfile, { merge: true });

      // 3. Send verification email
      await sendEmailVerification(firebaseUser);

      toast({
        title: 'Registrazione completata!',
        description: 'Ti abbiamo inviato un\'email di conferma. Controlla la tua casella di posta!',
      });
      router.push('/login');

    } catch (error) {
      const authError = error as AuthError;
      let description = 'Si è verificato un errore durante la registrazione.';
      if (authError.code === 'auth/email-already-in-use') {
        description = 'Questa email è già stata utilizzata per un altro account.';
      }
      toast({
        variant: 'destructive',
        title: 'Errore di registrazione',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-foreground">Crea un Account</CardTitle>
        <CardDescription>Unisciti a Social Money e inizia a guadagnare</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="username" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="Tuo Username" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="age" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Età</FormLabel><FormControl><Input type="number" placeholder="18" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="tu@email.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="password" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="gender" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Genere</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Seleziona genere" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="uomo">Uomo</SelectItem>
                    <SelectItem value="donna">Donna</SelectItem>
                    <SelectItem value="altro">Altro</SelectItem>
                    <SelectItem value="non specificato">Preferisco non specificare</SelectItem>
                  </SelectContent>
              </Select><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-3 gap-4">
               <FormField name="city" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Città</FormLabel><FormControl><Input placeholder="Roma" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField name="region" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Regione</FormLabel><FormControl><Input placeholder="Lazio" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField name="country" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Paese</FormLabel><FormControl><Input placeholder="Italia" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
             <FormField name="referredBy" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice Referral (Opzionale)</FormLabel>
                  <FormControl><Input placeholder="Codice amico" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />


            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 neon-glow" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrati
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Hai già un account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Accedi
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
