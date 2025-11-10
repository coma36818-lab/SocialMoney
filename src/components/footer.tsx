import Link from 'next/link';

const footerSections = {
  about: {
    title: 'About MyDatinGame',
    description: 'Your ultimate digital magazine for trends, gossip, fashion, entertainment, and creator monetization strategies.',
  },
  categories: {
    title: 'Categories',
    links: [
      { href: '#real-news', label: 'Notizie' },
      { href: '#gossip', label: 'Gossip & VIP' },
      { href: '#influencer', label: 'Influencer' },
      { href: '#cucina', label: 'Cucina' },
      { href: '#cinema', label: 'Cinema & Serie TV' },
      { href: '#games', label: 'Gaming' },
      { href: '#handmade', label: 'Handmade' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { href: '#affiliates', label: 'Affiliate Programs' },
      { href: '#tips', label: 'Creator Tips' },
      { href: '#ai-analyzer', label: 'AI Trend Analyzer' },
      { href: '#guadagnare-social', label: 'Guadagnare sui Social' },
      { href: '#join-creators', label: 'Partecipa' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '#privacy', label: 'Privacy Policy' },
      { href: '#terms', label: 'Terms of Service' },
      { href: '#cookies', label: 'Cookie Policy' },
      { href: 'mailto:mydatingame@gmail.com', label: 'Contact Us' },
    ],
  },
};

export function AppFooter() {
  return (
    <footer className="bg-background/80 border-t border-border mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-4">{footerSections.about.title}</h4>
            <p className="text-muted-foreground text-sm">{footerSections.about.description}</p>
          </div>
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-4">{footerSections.categories.title}</h4>
            <ul className="space-y-2">
              {footerSections.categories.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-4">{footerSections.resources.title}</h4>
            <ul className="space-y-2">
              {footerSections.resources.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-4">{footerSections.legal.title}</h4>
            <ul className="space-y-2">
              {footerSections.legal.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} MyDatinGame. All rights reserved. Made with ❤️ for creators worldwide.</p>
          <p className="mt-2">
            Collabora con noi: <a href="mailto:mydatingame@gmail.com" className="text-primary hover:underline">mydatingame@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
