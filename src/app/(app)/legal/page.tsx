'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Shield, CreditCard, Info } from "lucide-react";
import { useEffect, useState } from "react";

const LegalContent = ({ title, children, icon: Icon, iconClass }: { title: string, children: React.ReactNode, icon: React.ElementType, iconClass: string }) => (
    <Card className="glass-card">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
                <Icon className={`w-5 h-5 ${iconClass}`} />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert dark:prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-p:leading-relaxed prose-h3:text-xl prose-h3:font-bold prose-h3:text-foreground prose-h3:mt-6 space-y-4">
            {children}
        </CardContent>
    </Card>
);

export default function LegalPage() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'terms';
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        setLastUpdated(new Date().toLocaleDateString('it-IT'));
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3D9DF7] to-[#5ba8f7] rounded-2xl mb-4">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        Documenti <span className="text-[#3D9DF7]">Legali</span>
                    </h1>
                    <p className="text-muted-foreground">Termini, privacy e politiche della piattaforma</p>
                </motion.div>

                <Tabs defaultValue={defaultTab} className="w-full">
                     <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted text-muted-foreground">
                        <TabsTrigger value="terms" className="data-[state=active]:bg-card data-[state=active]:text-foreground">Termini</TabsTrigger>
                        <TabsTrigger value="privacy" className="data-[state=active]:bg-card data-[state=active]:text-foreground">Privacy</TabsTrigger>
                        <TabsTrigger value="payment" className="data-[state=active]:bg-card data-[state=active]:text-foreground">Pagamenti</TabsTrigger>
                        <TabsTrigger value="rules" className="data-[state=active]:bg-card data-[state=active]:text-foreground">Regole</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="terms">
                        <LegalContent title="Termini di Servizio" icon={FileText} iconClass="text-primary">
                            <p>Ultimo aggiornamento: {lastUpdated}</p>
                
                            <h3>1. Accettazione dei Termini</h3>
                            <p>
                              Utilizzando Social Money, accetti di essere vincolato da questi termini di servizio. 
                              Se non accetti questi termini, non utilizzare il servizio.
                            </p>

                            <h3>2. Descrizione del Servizio</h3>
                            <p>
                              Social Money è una piattaforma social che permette agli utenti di pubblicare contenuti 
                              e guadagnare attraverso un sistema di like a pagamento.
                            </p>

                            <h3>3. Contenuti Utente</h3>
                            <p>
                              Gli utenti sono responsabili dei contenuti che pubblicano. Non sono ammessi contenuti 
                              illegali, offensivi, pornografici o che violano i diritti di terzi.
                            </p>

                            <h3>4. Sistema di Pagamento</h3>
                            <p>
                              Gli utenti possono acquistare "like" da inviare ad altri creator. Ogni like ha un 
                              valore economico che viene trasferito al proprietario del contenuto.
                            </p>

                            <h3>5. Limitazioni di Responsabilità</h3>
                            <p>
                              Social Money non è responsabile per perdite economiche, contenuti inappropriati 
                              pubblicati dagli utenti, o problemi tecnici della piattaforma.
                            </p>

                            <h3>6. Modifiche ai Termini</h3>
                            <p>
                              Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. 
                              Le modifiche saranno comunicate via email agli utenti registrati.
                            </p>
                        </LegalContent>
                    </TabsContent>
                    <TabsContent value="privacy">
                       <LegalContent title="Informativa Privacy (GDPR)" icon={Shield} iconClass="text-[#3D9DF7]">
                            <p>Ultimo aggiornamento: {lastUpdated}</p>
                
                            <h3>1. Dati Raccolti</h3>
                            <p>
                              Raccogliamo i seguenti dati personali:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Nome e cognome</li>
                              <li>Indirizzo email</li>
                              <li>Contenuti pubblicati (foto, video, descrizioni)</li>
                              <li>Dati di utilizzo della piattaforma</li>
                              <li>Informazioni di pagamento (tramite provider terzi)</li>
                            </ul>

                            <h3>2. Uso dei Dati</h3>
                            <p>
                              Utilizziamo i tuoi dati per:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Fornire e migliorare il servizio</li>
                              <li>Gestire pagamenti e transazioni</li>
                              <li>Comunicazioni relative al servizio</li>
                              <li>Analisi e statistiche anonime</li>
                            </ul>

                            <h3>3. Diritti GDPR</h3>
                            <p>
                              Hai diritto a:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Accedere ai tuoi dati personali</li>
                              <li>Richiedere la correzione di dati inesatti</li>
                              <li>Richiedere la cancellazione dei tuoi dati</li>
                              <li>Opporti al trattamento dei tuoi dati</li>
                              <li>Richiedere la portabilità dei dati</li>
                            </ul>

                            <h3>4. Cookie</h3>
                            <p>
                              Utilizziamo cookie tecnici essenziali per il funzionamento del sito. 
                              Non utilizziamo cookie di profilazione senza il tuo consenso esplicito.
                            </p>

                            <h3>5. Contatti</h3>
                            <p>
                              Per esercitare i tuoi diritti o per domande sulla privacy, contatta: 
                              <span className="text-[#3D9DF7]"> privacy@socialmoney.com</span>
                            </p>
                        </LegalContent>
                    </TabsContent>
                    <TabsContent value="payment">
                         <LegalContent title="Politica Pagamenti" icon={CreditCard} iconClass="text-accent">
                            <h3>1. Acquisto Like</h3>
                            <p>
                              Gli utenti possono acquistare pacchetti di "like" da utilizzare sulla piattaforma. 
                              I prezzi sono chiaramente indicati prima dell'acquisto.
                            </p>

                            <h3>2. Valore dei Like</h3>
                            <p>
                              Ogni like inviato ha un valore di €0.01 che viene accreditato al creator 
                              che riceve il like.
                            </p>

                            <h3>3. Prelievi</h3>
                            <p>
                              I creator possono richiedere il pagamento del loro saldo tramite PayPal. 
                              Requisiti minimi:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Saldo minimo: €10.00</li>
                              <li>Account PayPal verificato</li>
                              <li>Tempi di elaborazione: 3-5 giorni lavorativi</li>
                            </ul>

                            <h3>4. Commissioni</h3>
                            <p>
                              Social Money applica una commissione del 10% su tutti i guadagni per coprire 
                              i costi della piattaforma e dei servizi di pagamento.
                            </p>

                            <h3>5. Rimborsi</h3>
                            <p>
                              I like acquistati non sono rimborsabili una volta completata la transazione. 
                              In caso di problemi tecnici, contatta il supporto.
                            </p>

                            <h3>6. Frodi e Abusi</h3>
                            <p>
                              È vietato utilizzare bot, account falsi o altri metodi fraudolenti. 
                              Violazioni comportano la sospensione permanente dell'account e il congelamento dei fondi.
                            </p>
                        </LegalContent>
                    </TabsContent>
                    <TabsContent value="rules">
                        <LegalContent title="Regole Creator e Community" icon={Info} iconClass="text-primary">
                            <h3>Contenuti Ammessi</h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Foto e video originali o per i quali hai i diritti</li>
                              <li>Contenuti creativi, artistici, educativi</li>
                              <li>Contenuti che rispettano le leggi locali e internazionali</li>
                            </ul>

                            <h3>Contenuti Vietati</h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Contenuti pornografici o sessualmente espliciti</li>
                              <li>Violenza, odio, discriminazione</li>
                              <li>Materiale protetto da copyright senza autorizzazione</li>
                              <li>Spam, truffe, contenuti ingannevoli</li>
                              <li>Contenuti che violano la privacy di terzi</li>
                            </ul>

                            <h3>Comportamento</h3>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Rispetta gli altri utenti</li>
                              <li>Non molestare o minacciare</li>
                              <li>Non creare account multipli per abusare del sistema</li>
                              <li>Non acquistare like con metodi fraudolenti</li>
                            </ul>

                            <h3>Sanzioni</h3>
                            <p>
                              Le violazioni possono comportare:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                              <li>Avviso e rimozione del contenuto</li>
                              <li>Sospensione temporanea (7-30 giorni)</li>
                              <li>Ban permanente con perdita di fondi non prelevati</li>
                            </ul>

                            <h3>Segnalazioni</h3>
                            <p>
                              Puoi segnalare contenuti inappropriati o comportamenti scorretti. 
                              Il team di moderazione esaminerà ogni segnalazione entro 24-48 ore.
                            </p>
                        </LegalContent>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
