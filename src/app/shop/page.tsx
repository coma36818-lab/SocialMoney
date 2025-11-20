
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const products = [
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
        
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        * The links present may be affiliated. You don't pay anything extra, but you support MyDatinGame.
      </p>
    </div>
  );
}
