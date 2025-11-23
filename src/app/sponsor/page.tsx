
'use client';
import { PayPalButtonsComponent } from '@/components/paypal-provider';

const plans = [
  {
    name: 'Starter',
    price: '3.00',
    priceSuffix: '/ post',
    features: ['1 Sponsored Article', 'Link to your Website', 'Feed Visibility'],
    isPopular: false,
    description: "Starter Sponsorship - MyDatinGame"
  },
  {
    name: 'Pro',
    price: '9.00',
    priceSuffix: '/ week',
    features: ['3 Promos Weekly', 'Homepage Highlight', 'Newsletter Inclusion'],
    isPopular: true,
    description: "Pro Sponsorship - MyDatinGame"
  },
  {
    name: 'Premium',
    price: '25.00',
    priceSuffix: '/ month',
    features: ['Max Visibility', 'Banner + Sponsored Articles', 'Social Media Post'],
    isPopular: false,
    description: "Premium Sponsorship - MyDatinGame"
  },
  {
    name: 'Ultra',
    price: '49.00',
    priceSuffix: '/ month',
    features: ['Full Promotion', 'Dedicated Video Post', 'Priority Placement'],
    isPopular: false,
    description: "Ultra Sponsorship - MyDatinGame"
  },
];

export default function SponsorPage() {
  return (
      <div className="font-body">
        <section className="sponsor-hero">
          <h1>Become a Sponsor of MyDatinGame</h1>
          <p>Promote your brand to thousands of active monthly readers.</p>
        </section>

        <section className="sponsor-plans">
          {plans.map((plan) => (
            <div key={plan.name} className={`plan ${plan.isPopular ? 'popular' : ''}`}>
              {plan.isPopular && <div className="badge">Most Popular</div>}
              <h2>{plan.name}</h2>
              <div className="price">€{plan.price.split('.')[0]} <span>{plan.priceSuffix}</span></div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className='mt-4'>
                <PayPalButtonsComponent
                    amount={plan.price}
                    description={plan.description}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="contact-box">
          <h3>📧 Sponsorship Contacts</h3>
          <p>Email: <strong>mydatingame@gmail.com</strong></p>
           <a href="mailto:mydatingame@gmail.com?subject=Richiesta%20Sponsorizzazione&body=Ciao%2C%20voglio%20promuovere%20il%20mio%20brand%20su%20MyDatinGame." 
            className="dm-button">
              ✉️ Invia Messaggio Diretto
          </a>
        </section>
      </div>
  );
}
