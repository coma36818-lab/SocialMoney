'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const LegalContent = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Card className="glass-card">
        <CardHeader>
            <CardTitle className="text-2xl text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white">
            {children}
        </CardContent>
    </Card>
);

export default function LegalPage() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'terms';

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-2">Informazioni Legali</h1>
                    <p className="text-gray-400">Termini, privacy e regole della piattaforma.</p>
                </motion.div>

                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="terms">Termini di Servizio</TabsTrigger>
                        <TabsTrigger value="payment">Informativa Pagamenti</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy GDPR</TabsTrigger>
                        <TabsTrigger value="rules">Regole Creator</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="terms">
                        <LegalContent title="Termini di Servizio">
                            <p>Benvenuto in Social Money. Utilizzando la nostra piattaforma, accetti di rispettare i seguenti termini e condizioni. È vietato pubblicare contenuti illegali, offensivi o che violino i diritti di terzi.</p>
                            <p>L'account è personale e non può essere ceduto. Ci riserviamo il diritto di sospendere o chiudere gli account che violano le nostre politiche senza preavviso.</p>
                        </LegalContent>
                    </TabsContent>
                    <TabsContent value="payment">
                        <LegalContent title="Informativa Pagamenti">
                            <p>I guadagni derivano dai 'Like' ricevuti dagli altri utenti. Ogni Like ha un valore monetario di €0.01. Il saldo è visibile nel Wallet.</p>
                            <p>I pagamenti possono essere richiesti al raggiungimento di una soglia minima di €10.00 e vengono elaborati tramite PayPal. Social Money trattiene una commissione del 10% su ogni transazione di pagamento per coprire i costi operativi.</p>
                        </LegalContent>
                    </TabsContent>
                    <TabsContent value="privacy">
                        <LegalContent title="Informativa Privacy (GDPR)">
                            <p>Rispettiamo la tua privacy. I dati raccolti (email, dati anagrafici, etc.) sono utilizzati per fornire il servizio e non vengono ceduti a terzi per scopi di marketing.</p>
                            <p>In conformità con il GDPR, hai il diritto di accedere, modificare o cancellare i tuoi dati personali. Puoi gestire le tue informazioni dalla pagina Impostazioni o contattando il nostro supporto.</p>
                        </LegalContent>
                    </TabsContent>
                    <TabsContent value="rules">
                        <LegalContent title="Regole per i Creator">
                            <p>Come creator, sei responsabile dei contenuti che pubblichi. Assicurati di possedere i diritti per tutto il materiale (foto, video, testi) che condividi.</p>
                            <p>È vietato l'uso di bot o altri mezzi artificiali per gonfiare i like. La violazione di questa regola comporterà la chiusura immediata dell'account e la perdita dei guadagni accumulati.</p>
                        </LegalContent>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
