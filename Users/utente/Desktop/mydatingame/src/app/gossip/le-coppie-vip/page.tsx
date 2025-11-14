
      import Image from 'next/image';

      export default function LeCoppieVipPage() {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Le Coppie VIP del Momento</h1>
            <p className="text-lg text-slate-300 mb-8">
              Questa è la pagina dedicata alle coppie VIP. Qui troverai articoli e approfondimenti.
            </p>
            <div className="flex justify-center">
              <Image
                src="/Schermata13.14.35.png"
                alt="Immagine coppie VIP"
                width={800}
                height={600}
                className="rounded-lg shadow-2xl"
                data-ai-hint="celebrity couple"
              />
            </div>
            <div className="max-w-2xl mx-auto text-left mt-8">
              <p className="text-slate-300 mb-4">
                Cardi B just dropped her latest release -- her first child with NFL star Stefon Diggs is here ... TMZ has learned.
              </p>
              <p className="text-slate-300 mb-4">
                Sources connected to the Diamond-selling rapper tell us Cardi gave birth to the baby boy last week.
              </p>
              <p className="text-slate-300 mb-4">
                We're told Stefon, the New England Patriots star receiver, was with Cardi when their baby boy arrived. Cardi announced the birth Thursday in a social media post.
              </p>
              <p className="text-slate-300">
                Cardi says ... "My life has always been a combination of different chapters and different seasons. My last chapter was the beginning of a new season. Starting over is never easy but it’s been so worth it! I brought new music and a new album to the world! A new baby into my world, and one more reason to be the best version of me, one more reason to love me more than anything else or anyone else so I can continue giving my babies the love and life they deserve."
              </p>
              <div className="mt-6 text-sm">
                <a href="https://www.tmz.com/2025/11/13/cardi-b-gives-birth-fourth-child-stefon-diggs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Fonte: TMZ
                </a>
              </div>
            </div>
          </div>
        );
      }
