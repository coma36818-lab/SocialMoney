
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="prose prose-invert mx-auto max-w-3xl text-left">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Privacy Policy – MyDatinGame</h1>

        <p className="text-center text-muted-foreground">Ultimo aggiornamento: 2025</p>

        <p>
          Questa Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo i dati
          degli utenti su <strong>mydatingame.com</strong>.
          Il sito è gestito da: <strong>MyDatinGame</strong>.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Dati raccolti</h2>
        <ul className="list-disc list-inside">
          <li>Informazioni fornite volontariamente (email nel form contatti o newsletter)</li>
          <li>Dati tecnici anonimi (browser, dispositivo, pagine visitate)</li>
          <li>Cookie necessari per il funzionamento del sito</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Uso dei dati</h2>
        <p>I dati sono utilizzati esclusivamente per:</p>
        <ul className="list-disc list-inside">
          <li>rispondere ai messaggi inviati tramite il form contatti</li>
          <li>statistiche aggregate anonime</li>
          <li>miglioramento dell’esperienza utente</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Cookie</h2>
        <p>
          mydatingame.com utilizza cookie tecnici e funzionali.
          Non utilizziamo cookie di profilazione, pubblicità o terze parti (come Google Ads).
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Servizi di terze parti usati</h2>
        <p>
          Attualmente utilizziamo:
        </p>
        <ul className="list-disc list-inside">
          <li>Hosting: Netlify</li>
          <li>Statistiche: eventuale analytics anonimo</li>
          <li>Link affiliati (Amazon, Awin, Etsy, Booking, Fiverr)</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Diritti dell’utente</h2>
        <p>Puoi richiedere in ogni momento:</p>
        <ul className="list-disc list-inside">
          <li>accesso ai tuoi dati</li>
          <li>cancellazione dei dati</li>
          <li>informazioni sul trattamento</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Contatti</h2>
        <p>
          Per qualsiasi richiesta scrivi a:<br />
          <strong>mydatingame@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}
