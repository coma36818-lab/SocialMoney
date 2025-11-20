
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="prose prose-invert mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-lg text-slate-300 mb-8">
          Questa è la pagina dedicata alla Privacy Policy. Qui puoi descrivere come tratti i dati dei tuoi utenti.
        </p>
        <div className="text-left">
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Informazioni che raccogliamo</h2>
            <p className="text-slate-300">
                Descrivi qui quali informazioni raccogli, come indirizzi email, dati di navigazione, ecc.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Come usiamo le informazioni</h2>
            <p className="text-slate-300">
                Spiega come utilizzi le informazioni raccolte, ad esempio per personalizzare l'esperienza, inviare newsletter, ecc.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Condivisione delle informazioni</h2>
            <p className="text-slate-300">
                Indica se e con chi condividi i dati degli utenti, come partner pubblicitari o fornitori di servizi.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Cookie</h2>
            <p className="text-slate-300">
                Spiega l'uso dei cookie sul tuo sito. Puoi fare riferimento alla tua Cookie Policy per maggiori dettagli.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. I tuoi diritti</h2>
            <p className="text-slate-300">
                Informa gli utenti dei loro diritti, come l'accesso, la rettifica o la cancellazione dei loro dati personali.
            </p>
            
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Contatti</h2>
            <p className="text-slate-300">
                Fornisci un modo per contattarti per domande sulla privacy, ad esempio un indirizzo email.
            </p>
        </div>
      </div>
    </div>
  );
}
