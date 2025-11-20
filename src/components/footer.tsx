
import Link from 'next/link';
import { footerSectionsData } from '@/lib/data';

const footerSections = {
  about: {
    title: 'About MyDatinGame',
    description: 'Your ultimate digital magazine for trends, gossip, fashion, entertainment, and creator monetization strategies.',
  },
  legal: {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/#terms', label: 'Terms of Service' },
      { href: '/cookies', label: 'Cookie Policy' },
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
            <h4 className="text-lg font-bold mb-4">{footerSectionsData.categories.title}</h4>
            <ul className="space-y-2">
              {footerSectionsData.categories.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h4 className="text-lg font-bold mb-4">{footerSectionsData.resources.title}</h4>
            <ul className="space-y-2">
              {footerSectionsData.resources.links.map((link) => (
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
