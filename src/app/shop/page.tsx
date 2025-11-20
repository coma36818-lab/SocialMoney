
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const products = [
    {
        name: 'Professional Ring Light',
        description: 'Perfect for TikTok and creator shoots.',
        imageUrl: 'https://m.media-amazon.com/images/I/81b8VgJqC9L._AC_SX522_.jpg',
        link: 'https://www.amazon.it/dp/B08B5X5V2X?_encoding=UTF8&psc=1&linkCode=li2&tag=mydatingame-21&linkId=3b49eb12f5a8c2f1f0a1d6365b68b752&ref_=as_li_ss_il',
    },
    {
        name: 'USB Creator Microphone',
        description: 'Crystal clear audio for podcasts and videos.',
        imageUrl: 'https://m.media-amazon.com/images/I/71v9Bn0ZLXL._AC_SX522_.jpg',
        link: 'https://www.amazon.it/dp/B07N2WRH2W?_encoding=UTF8&psc=1&linkCode=li2&tag=mydatingame-21&linkId=8573138b369c3a3721d9652a9254d3cd&ref_=as_li_ss_il',
    },
    {
        name: 'Creator Photography Set',
        description: 'Complete kit for professional photos and videos.',
        imageUrl: 'https://m.media-amazon.com/images/I/51tCq0XaLXL._AC_.jpg',
        link: 'https://www.amazon.it/dp/B07G31G51C?_encoding=UTF8&psc=1&linkCode=li2&tag=mydatingame-21&linkId=b92780e0c90c763d3957f884f1837685&ref_=as_li_ss_il',
    },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.name} className="bg-card/50 overflow-hidden flex flex-col">
            <div className="aspect-square relative w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{product.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={product.link} target="_blank" rel="noopener noreferrer">
                  Buy on Amazon →
                </Link>
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
