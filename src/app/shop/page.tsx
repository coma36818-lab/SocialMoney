
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const products = [
  {
    id: 1,
    name: 'Elgato Key Light Mini',
    description: 'Elgato Key Light Air Professional LED Panel with 1400 Lumens, Multi-layer Diffusion Technology, with App Support, Adjustable Color Temperature for Mac/Windows/iPhone/Android, Black',
    price: '€99.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71wV2b-0g+L._AC_UF1000,1000_QL80_.jpg',
    imageHint: 'professional LED light',
    link: 'https://www.amazon.it/dp/B09L725S3D',
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
            <CardFooter className="flex justify-between items-center mt-4">
              <span className="text-2xl font-bold text-primary">{product.price}</span>
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

