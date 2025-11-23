
'use client';
import Script from 'next/script';

const plans = [
  {
    name: 'Starter',
    price: '3.00',
    priceSuffix: '/ post',
    features: ['1 Sponsored Article', 'Link to your Website', 'Feed Visibility'],
    isPopular: false,
    paypalId: 'paypal-starter'
  },
  {
    name: 'Pro',
    price: '9.00',
    priceSuffix: '/ week',
    features: ['3 Promos Weekly', 'Homepage Highlight', 'Newsletter Inclusion'],
    isPopular: true,
    paypalId: 'paypal-pro'
  },
  {
    name: 'Premium',
    price: '25.00',
    priceSuffix: '/ month',
    features: ['Max Visibility', 'Banner + Sponsored Articles', 'Social Media Post'],
    isPopular: false,
    paypalId: 'paypal-premium'
  },
  {
    name: 'Ultra',
    price: '49.00',
    priceSuffix: '/ month',
    features: ['Full Promotion', 'Dedicated Video Post', 'Priority Placement'],
    isPopular: false,
    paypalId: 'paypal-ultra'
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
            <div id={plan.paypalId}></div>
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

      <Script id="paypal-buttons-script">
        {`
          if (typeof paypal !== 'undefined') {
            paypal.Buttons({
              createOrder: function(data, actions) {
                return actions.order.create({
                  purchase_units: [{
                    amount: { value: "3.00" },
                    description: "Starter Sponsorship - MyDatinGame",
                    payee: { email_address: "alibi81@libero.it" }
                  }]
                });
              },
              onApprove: function(data, actions) {
                alert("Pagamento ricevuto! Invia i tuoi contenuti a mydatingame@gmail.com");
                return actions.order.capture();
              }
            }).render('#paypal-starter');

            paypal.Buttons({
              createOrder: (d,a)=>a.order.create({
                purchase_units:[{ amount:{ value:"9.00" }, description:"Pro Sponsorship", payee: { email_address: "alibi81@libero.it" } }]
              }),
              onApprove:(d,a)=>{ alert("Grazie! Invia materiale a mydatingame@gmail.com"); a.order.capture(); }
            }).render('#paypal-pro');

            paypal.Buttons({
              createOrder:(d,a)=>a.order.create({
                purchase_units:[{ amount:{ value:"25.00" }, description:"Premium Sponsorship", payee: { email_address: "alibi81@libero.it" } }]
              }),
              onApprove:(d,a)=>{ alert("Pagamento ricevuto!"); a.order.capture(); }
            }).render('#paypal-premium');

            paypal.Buttons({
              createOrder:(d,a)=>a.order.create({
                purchase_units:[{ amount:{ value:"49.00" }, description:"Ultra Sponsorship", payee: { email_address: "alibi81@libero.it" } }]
              }),
              onApprove:(d,a)=>{ alert("Grazie!"); a.order.capture(); }
            }).render('#paypal-ultra');
          }
        `}
      </Script>
    </div>
  );
}
