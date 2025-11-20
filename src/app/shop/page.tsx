
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const products = [
  {
    id: 1,
    name: 'Elgato Key Light Air Pannello LED Professionale con 1400 Lumen',
    description: 'Elgato Key Light Air Pannello LED Professionale con 1400 Lumen, Tecnologia di Diffusione a Più Strati, con Supporto App, Temperatura del Colore Regolabile per Mac/Windows/iPhone/Android, Nero',
    imageUrl: '/profili_emryn_corretto.jpg',
    imageHint: 'LED light',
    link: 'https://amzn.to/4rfBBYg',
  },
  {
    id: 2,
    name: 'Elgato Key Light Pannello LED Professionale da Studio',
    description: 'Elgato Key Light Pannello LED Professionale da Studio con 2800 Lumen, Regolabile a Colori, Abilitato per le App, per PC e Mac, Supporto da Tavolo in Metallo',
    imageUrl: '/712QsKLnK5L._AC_SL1500_.jpg',
    imageHint: '/712QsKLnK5L._AC_SL1500_.jpg',
    link: 'https://amzn.to/49ZaiuU',
  },
  {
    id: 3,
    name: 'Elgato Key Light Mini – Pannello LED portatile per streaming',
    description: 'Elgato Key Light Mini – Pannello LED portatile per streaming, videoconferenze, gaming, 800 lumen, batteria ricaricabile, TikTok, Instagram, YouTube, Zoom, Microsoft Teams, PC/Mac/iPhone/Android',
    imageUrl: '/71clOXmW3GL._AC_SL1500_.jpg',
    imageHint: 'Pannello LED portatile',
    link: 'https://amzn.to/47Rp5Xh',
  },
  {
    id: 4,
    name: 'Logitech for Creators Litra Glow Luce LED Streaming Premium',
    description: 'Logitech for Creators Litra Glow Luce LED Streaming Premium - Illuminazione per Computer per Videoconferenze, Riunioni Zoom, con Supporto Regolabile e Controllo da App per PC / Mac - Grafite',
    imageUrl: '/41-fZ3ICQ8L._AC_SL1500_.jpg',
    imageHint: 'Pannello LED portatile',
    link: 'https://amzn.to/48o3965',
  },
  {
    id: 5,
    name: 'Logitech Litra Glow + StreamCam',
    description: 'Logitech Litra Glow + StreamCam, La soluzione definitiva per un aspetto ottimo nei video, velocemente, Nero',
    imageUrl: '/71gMBankWHL._AC_SL1500_.jpg',
    imageHint: 'Pannello LED portatile',
    link: 'https://amzn.to/3XFHZKy',
  }
];

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">🔥 Shop – Recommended Products</h1>
        <p className="text-lg text-slate-300">
          Selected products from the world of tech, beauty, cooking, gaming, and lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <Card key={product.id} className="bg-card/30 border-border overflow-hidden transition-all duration-300 group hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
            <CardHeader>
              <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={product.imageHint}
                />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
              <CardDescription className="flex-grow text-muted-foreground">{product.description}</CardDescription>
            </CardContent>
            <CardFooter className={`flex ${product.price ? 'justify-between' : 'justify-end'} items-center mt-4`}>
              {product.price && <span className="text-2xl font-bold text-primary">{product.price}</span>}
              <Button asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-primary/40">
                <Link href={product.link} target="_blank" rel="noopener noreferrer">Buy Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        * The links present may be affiliated. You don't pay anything extra, but you support MyDatinGame.
      </p>
    </div>
  );
}
