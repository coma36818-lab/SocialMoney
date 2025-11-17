
'use client';
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Download, Heart, FileText, Shield, CreditCard, Info, Loader2 } from "lucide-react";
import { format, subDays } from "date-fns";
import { it } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import type { User, Transaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";

export default function WalletPage() {
    const router = useRouter();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user: authUser, isUserLoading: isAuthLoading } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!authUser) return null;
        return doc(firestore, 'users', authUser.uid);
    }, [firestore, authUser]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userProfileRef);

    const transactionsQuery = useMemoFirebase(() => {
        if (!authUser) return null;
        return query(collection(firestore, `users/${authUser.uid}/transactions`), orderBy('created_date', 'desc'));
    }, [firestore, authUser]);
    const { data: transactions, isLoading: isLoadingTransactions } = useCollection<Transaction>(transactionsQuery);

    const requestPayoutMutation = useMutation({
        mutationFn: async () => {
            if (!authUser || !userProfile || !userProfileRef) throw new Error("Utente non autenticato");
            if (!userProfile.paypalEmail) throw new Error("Per prelevare, imposta prima il tuo indirizzo email PayPal nelle impostazioni del profilo.");
            if ((userProfile.walletBalance || 0) < 10) throw new Error("Il saldo minimo per il prelievo è di 10€.");

            const lastPayout = transactions?.find(t => t.type === 'payout');
            if (lastPayout && new Date(lastPayout.created_date) > subDays(new Date(), 7)) {
                throw new Error("Puoi richiedere un solo prelievo ogni 7 giorni.");
            }

            const amountToWithdraw = userProfile.walletBalance!;
            const fee = amountToWithdraw * 0.10; // 10% fee
            const finalAmount = amountToWithdraw - fee;

            await new Promise(resolve => setTimeout(resolve, 2000));

            updateDocumentNonBlocking(userProfileRef, {
                walletBalance: 0,
            });

            const transactionsCollRef = collection(firestore, `users/${authUser.uid}/transactions`);
            addDocumentNonBlocking(transactionsCollRef, {
                userId: authUser.uid,
                type: 'payout',
                description: `Prelievo di ${finalAmount.toFixed(2)}€ (lordo ${amountToWithdraw.toFixed(2)}€ - 10% fee)`,
                amount: -amountToWithdraw,
                status: 'completed',
                created_date: new Date().toISOString(),
            });

            return finalAmount;
        },
        onSuccess: (finalAmount) => {
            toast({
                title: "Prelievo in corso!",
                description: `Il tuo pagamento di ${finalAmount.toFixed(2)}€ è stato inviato a ${userProfile?.paypalEmail}. Riceverai una conferma a breve.`,
            });
            queryClient.invalidateQueries({ queryKey: ['transactions', authUser?.uid] });
            queryClient.invalidateQueries({ queryKey: ['user', authUser?.uid] });
        },
        onError: (error: Error) => {
            toast({
                variant: 'destructive',
                title: "Errore Prelievo",
                description: error.message,
            });
        }
    });

    const getTransactionIcon = (type: Transaction['type']) => {
        switch (type) {
            case "like_purchase": return <TrendingDown className="w-4 h-4" />;
            case "earning_from_like": return <Heart className="w-4 h-4" />;
            case "payout": return <Download className="w-4 h-4" />;
            default: return <DollarSign className="w-4 h-4" />;
        }
    };

    const getTransactionColor = (type: Transaction['type']) => {
        switch (type) {
            case "earning_from_like":
                return "text-green-500";
            case "like_purchase":
            case "payout":
                return "text-red-500";
            default:
                return "text-muted-foreground";
        }
    };

    const isLoading = isAuthLoading || isProfileLoading;

    if (isLoading || !userProfile) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin rounded-full h-12 w-12 text-primary" />
            </div>
        );
    }
    
    const legalLinks = [
        { title: "Termini di Servizio", icon: FileText, description: "Condizioni d'uso della piattaforma", url: createPageUrl("legal") + "?tab=terms" },
        { title: "Informativa Pagamenti", icon: CreditCard, description: "Come funzionano i pagamenti", url: createPageUrl("legal") + "?tab=payment" },
        { title: "Privacy GDPR", icon: Shield, description: "Protezione dei dati personali", url: createPageUrl("legal") + "?tab=privacy" },
        { title: "Regole Creator", icon: Info, description: "Linee guida per i contenuti", url: createPageUrl("legal") + "?tab=rules" }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Il Tuo <span className="text-accent">Wallet</span></h1>
                    <p className="text-muted-foreground">Gestisci i tuoi guadagni e transazioni</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                    <Card className="glass-card mb-8 overflow-hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-yellow-500/20" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
                            <CardContent className="relative p-8">
                                <div className="flex items-start justify-between mb-8">
                                    <div>
                                        <p className="text-muted-foreground text-sm mb-2">Saldo Disponibile</p>
                                        <motion.h2 animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl font-bold text-foreground mb-4">
                                            <span className="text-accent">€</span> {userProfile.walletBalance?.toFixed(2) || "0.00"}
                                        </motion.h2>
                                        <p className="text-sm text-muted-foreground">Guadagni totali: <span className="text-accent font-semibold">€{userProfile.totalLikesReceived ? (userProfile.totalLikesReceived * 0.01).toFixed(2) : "0.00"}</span></p>
                                    </div>
                                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="w-20 h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center gold-glow">
                                        <Wallet className="w-10 h-10 text-accent-foreground" />
                                    </motion.div>
                                </div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        onClick={() => requestPayoutMutation.mutate()}
                                        disabled={requestPayoutMutation.isPending || (userProfile.walletBalance || 0) < 10}
                                        className="w-full bg-gradient-to-r from-accent to-yellow-500 hover:opacity-90 text-accent-foreground font-bold text-lg py-6 gold-glow" 
                                        size="lg"
                                    >
                                        {requestPayoutMutation.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
                                        {requestPayoutMutation.isPending ? "Elaborazione..." : "Richiedi Pagamento PayPal"}
                                    </Button>
                                </motion.div>
                                <p className="text-xs text-muted-foreground text-center mt-3">Pagamenti disponibili da 10€. Commissione del 10%.</p>
                            </CardContent>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
                    <Card className="glass-card">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-foreground"><Info className="w-5 h-5 text-blue-500" /> Come Funziona</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                {legalLinks.map((link, index) => (
                                    <motion.div key={link.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }} whileHover={{ scale: 1.02 }}>
                                        <button onClick={() => router.push(link.url)} className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all border border-border hover:border-border/80">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0"><link.icon className="w-5 h-5 text-blue-500" /></div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-1">{link.title}</h4>
                                                    <p className="text-xs text-muted-foreground">{link.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Card className="glass-card">
                        <CardHeader><CardTitle className="text-foreground">Storico Transazioni</CardTitle></CardHeader>
                        <CardContent>
                            {isLoadingTransactions ? (
                                <div className="space-y-3 p-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="animate-pulse bg-muted/50 h-16 rounded-xl" />
                                    ))}
                                </div>
                            ) : !transactions || transactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-muted-foreground">Nessuna transazione ancora</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {transactions.map((transaction, index) => (
                                        <motion.div key={transaction.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 ${getTransactionColor(transaction.type)} bg-muted/50 rounded-xl flex items-center justify-center`}>{getTransactionIcon(transaction.type)}</div>
                                                <div>
                                                    <p className="font-medium text-foreground capitalize">{transaction.description || transaction.type.replace(/_/g, ' ')}</p>
                                                    <p className="text-xs text-muted-foreground">{format(new Date(transaction.created_date), "d MMM yyyy 'alle' HH:mm", { locale: it })}</p>
                                                </div>
                                            </div>
                                            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className={`font-bold ${getTransactionColor(transaction.type)}`}>
                                                {transaction.amount >= 0 ? "+" : "-"}€{Math.abs(transaction.amount).toFixed(2)}
                                            </motion.p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

    