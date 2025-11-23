
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PayPalButtonsComponent } from '@/components/paypal-buttons';

const plans = [
  {
    name: 'Starter',
    price: '20.00',
    description: '1 dedicated article, Link to your site, Inclusion in the feed',
    features: ['1 dedicated article', 'Link to your site', 'Inclusion in the feed'],
  },
  {
    name: 'Pro',
    price: '50.00',
    description: '3 posts per week, Homepage promotion, Newsletter inclusion',
    features: ['3 posts per week', 'Homepage promotion', 'Newsletter inclusion'],
  },
  {
    name: 'Premium',
    price: '120.00',
    description: 'Total visibility, Banner + sponsored articles, Dedicated social posts',
    features: ['Total visibility', 'Banner + sponsored articles', 'Dedicated social posts'],
  },
];

export default function SponsorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">🤝 Become a Sponsor of MyDatinGame</h1>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
          Promote your brand on a modern digital magazine with thousands of monthly readers.
        </p>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-5 mb-12">
        {plans.map((plan) => (
          <div key={plan.name} className="border border-border/50 p-5 rounded-2xl bg-card/50 w-full max-w-[280px] flex flex-col">
            <h3 className="text-center text-2xl text-primary font-bold">{plan.name}</h3>
            <div className="flex-grow my-6">
              <p className="text-4xl font-bold text-center">€{plan.price}</p>
              <ul className="mt-6 space-y-3 text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <PayPalButtonsComponent
              plan={{
                name: plan.name,
                description: plan.description,
                price: plan.price,
              }}
            />
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">📧 Sponsorship Contacts</h2>
        <p className="text-lg text-slate-300">
          Email: <strong className="text-primary">mydatingame@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}