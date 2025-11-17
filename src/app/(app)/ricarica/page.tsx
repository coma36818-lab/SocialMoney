'use client';
import React, { useState, useEffect } from "react";
import { base44 } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Zap, Star, Crown, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const likePackages = [
    { name: 'Base', likes: 100, price: 1.99, icon: Heart, color: 'text-muted-foreground' },
    { name: 'Spark', likes: 300, price: 4.99, icon: Zap, color: 'text-blue-500', popular: false },
    { name: 'Superstar', likes: 1000, price: 9.99, icon: Star, color: 'text-yellow-500', popular: true },
    { name: 'Legend', likes: 3000, price: 25.00, icon: Crown, color: 'text-primary', popular: false },
];

export default function RicaricaPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [selectedPackage, setSelectedPackage] = useState(likePackages[2]);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await base44.auth.me();
            setUser(userData);
        } catch (error) {
            router.push(createPageUrl("login"));
        }
    };

    const purchaseMutation = useMutation({
        mutationFn: async (pkg: typeof likePackages[0]) => {
            if (!user) throw new Error("Utente non autenticato");
            
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            const updatedUser = await base44.auth.updateMe({
                likes_available: (user.likes_available || 0) + pkg.likes,
            });

            await base44.entities.Transaction.create({
                userId: user.id,
                type: 'like_purchase',
                description: `Acquisto pacchetto ${pkg.name}`,
                amount: -pkg.price,
                status: 'completed',
            });

            return updatedUser;
        },
        onSuccess: (updatedUser) => {
            setUser(updatedUser as User);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast({
                title: "Ricarica Effettuata!",
                description: `Hai aggiunto ${selectedPackage.likes} like al tuo account.`,
            });
        },
        onError: (error: Error) => {
            toast({
                variant: 'destructive',
                title: "Errore Acquisto",
                description: error.message,
            });
        }
    });

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-2">Ricarica i Tuoi <span className="text-primary">Like</span></h1>
                    <p className="text-muted-foreground">Supporta i tuoi creator preferiti e aumenta la tua influenza.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Scegli il tuo pacchetto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {likePackages.map(pkg => (
                                    <div
                                        key={pkg.name}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={cn(
                                            "glass-card rounded-lg p-4 flex items-center justify-between cursor-pointer border-2 transition-all",
                                            selectedPackage.name === pkg.name ? "border-primary neon-glow" : "border-transparent hover:border-primary/50"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <pkg.icon className={cn("w-8 h-8", pkg.color)} />
                                            <div>
                                                <p className="font-bold text-lg">{pkg.name}</p>
                                                <p className="text-sm text-primary font-semibold">{pkg.likes.toLocaleString('it-IT')} Like</p>
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold">€{pkg.price.toFixed(2)}</p>
                                        {pkg.popular && <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">POPULAR</div>}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="sticky top-8">
                        <Card className="glass-card border-primary/50">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Riepilogo Ordine</CardTitle>
                                <selectedPackage.icon className={cn("w-16 h-16 mx-auto my-4", selectedPackage.color)} />
                                <h3 className="text-3xl font-bold">{selectedPackage.name}</h3>
                                <p className="text-5xl font-extrabold text-primary my-2">{selectedPackage.likes.toLocaleString('it-IT')}</p>
                                <p className="text-muted-foreground">Like da aggiungere al tuo account</p>
                            </CardHeader>
                            <CardContent>
                                <div className="border-t border-border pt-4 mt-4 space-y-2">
                                     <div className="flex justify-between text-lg">
                                        <span>Like attuali:</span>
                                        <span className="font-semibold">{(user.likes_available || 0).toLocaleString('it-IT')}</span>
                                    </div>
                                    <div className="flex justify-between text-lg text-primary">
                                        <span>Nuovi like:</span>
                                        <span className="font-semibold">+{selectedPackage.likes.toLocaleString('it-IT')}</span>
                                    </div>
                                     <div className="flex justify-between text-xl font-bold border-t border-border pt-2 mt-2">
                                        <span>Totale dopo acquisto:</span>
                                        <span>{((user.likes_available || 0) + selectedPackage.likes).toLocaleString('it-IT')}</span>
                                    </div>
                                </div>
                                <Button 
                                    size="lg" 
                                    className="w-full mt-6 bg-primary text-lg h-14 hover:bg-primary/90 neon-glow text-primary-foreground"
                                    onClick={() => purchaseMutation.mutate(selectedPackage)}
                                    disabled={purchaseMutation.isPending}
                                >
                                    {purchaseMutation.isPending ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-6 h-6 mr-2"/>
                                            <span>Acquista per €{selectedPackage.price.toFixed(2)}</span>
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-3">Pagamento sicuro con PayPal.</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
