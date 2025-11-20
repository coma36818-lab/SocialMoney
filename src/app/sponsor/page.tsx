
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: '€20 / post',
    features: ['1 articolo dedicato', 'Link al sito', 'Inserimento nel feed'],
  },
  {
    name: 'Pro',
    price: '€50 / settimana',
    features: ['3 post a settimana', 'Promozione sulla homepage', 'Inserimento nella newsletter'],
  },
  {
    name: 'Premium',
    price: '€120 / mese',
    features: ['Visibilità totale', 'Banner + articoli sponsorizzati', 'Post social dedicati'],
  },
];

export default function SponsorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">🤝 Diventa Sponsor di MyDatinGame</h1>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
          Promuovi il tuo brand su una rivista digitale moderna con migliaia di lettori mensili.
        </p>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-5 mb-12">
        {plans.map((plan) => (
          <div key={plan.name} className="border border-border/50 p-5 rounded-2xl bg-card/50 w-full max-w-[280px] flex flex-col">
            <h3 className="text-center text-2xl text-primary font-bold">{plan.name}</h3>
            <div className="flex-grow my-6">
              <p className="text-4xl font-bold text-center">{plan.price}</p>
              <ul className="mt-6 space-y-3 text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button asChild className="w-full mt-auto bg-foreground text-background hover:bg-foreground/80">
                <Link href="mailto:mydatingame@gmail.com">Richiedi</Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">📧 Contatti Sponsorizzazioni</h2>
        <p className="text-lg text-slate-300">
          Email: <strong className="text-primary">mydatingame@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}
