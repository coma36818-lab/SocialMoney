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
import { base44 } from '@/lib/api';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const signupSchema = z.object({
  nickname: z.string().min(3, 'Il nickname deve avere almeno 3 caratteri'),
  email: z.string().email('Email non valida'),
  password: z.string().min(8, 'La password deve avere almeno 8 caratteri'),
  age: z.coerce.number().min(18, 'Devi avere almeno 18 anni'),
  gender: z.enum(['uomo', 'donna', 'altro', 'non specificato']),
  city: z.string().min(1, 'La città è richiesta'),
  country: z.string().min(1, 'Il paese è richiesto'),
  region: z.string().min(1, 'La regione è richiesta'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      age: 18,
      gender: 'non specificato',
      city: '',
      country: 'Italia',
      region: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      await base44.auth.signup(data);
      toast({
        title: 'Registrazione completata',
        description: 'Benvenuto in Social Money!',
      });
      router.push('/feed');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Errore di registrazione',
        description: error instanceof Error ? error.message : 'Si è verificato un errore',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-white">Crea un Account</CardTitle>
        <CardDescription>Unisciti a Social Money e inizia a guadagnare</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField name="nickname" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Nickname</FormLabel><FormControl><Input placeholder="Tuo Nickname" {...field} /></FormControl><FormMessage /></FormItem>
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
