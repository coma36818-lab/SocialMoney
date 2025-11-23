
'use client';
import { PayPalButtonsComponent } from '@/components/paypal-buttons';

const plans = [
  {
    name: 'Starter',
    price: '3.00',
    priceSuffix: '/ post',
    description: '1 Sponsored Article, Link to your Website, Feed Visibility',
    features: ['1 Sponsored Article', 'Link to your Website', 'Feed Visibility'],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: '9.00',
    priceSuffix: '/ week',
    description: '3 Promos Weekly, Homepage Highlight, Newsletter Inclusion',
    features: ['3 Promos Weekly', 'Homepage Highlight', 'Newsletter Inclusion'],
    isPopular: true,
  },
  {
    name: 'Premium',
    price: '25.00',
    priceSuffix: '/ month',
    description: 'Max Visibility, Banner + Sponsored Articles, Social Media Post',
    features: ['Max Visibility', 'Banner + Sponsored Articles', 'Social Media Post'],
    isPopular: false,
  },
  {
    name: 'Ultra',
    price: '49.00',
    priceSuffix: '/ month',
    description: 'Full Promotion, Dedicated Video Post, Priority Placement',
    features: ['Full Promotion', 'Dedicated Video Post', 'Priority Placement'],
    isPopular: false,
  },
];

export default function SponsorPage() {
  return (
    <div className="container mx-auto px-4 py-12 font-body">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-headline">Become a Sponsor of MyDatinGame</h1>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
          Promote your brand to thousands of active monthly readers.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative border border-border/50 p-6 rounded-2xl bg-card/50 w-full max-w-sm flex flex-col h-full transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1 ${plan.isPopular ? 'border-primary shadow-primary/30' : ''}`}>
            {plan.isPopular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
            )}
            <h2 className="text-center text-2xl text-primary font-bold font-headline mt-4">{plan.name}</h2>
            <div className="flex-grow my-6">
              <div className="text-center mb-6">
                <span className="text-5xl font-bold">€{plan.price.split('.')[0]}</span>
                <span className="text-muted-foreground">{plan.priceSuffix}</span>
              </div>
              <ul className="space-y-3 text-muted-foreground text-center">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center justify-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto">
              <PayPalButtonsComponent
                plan={{
                  name: plan.name,
                  description: plan.description,
                  price: plan.price,
                }}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="text-center mt-16 bg-card/30 border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-2">📧 Sponsorship Contacts</h3>
        <p className="text-lg text-slate-300">
          Email: <strong className="text-primary">mydatingame@gmail.com</strong>
        </p>
      </section>
    </div>
  );
}
