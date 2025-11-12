
const gameImages = [
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592155931584-901ac15763e3?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605642629742-5c65b1693799?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542773998-9325f0a098d7?q=80&w=2232&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598550476439-6847785f5543?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580235310624-99881845184b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599408389392-40b9b398a69a?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1612036782180-6f0b6cd84627?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519682577862-22b62b24e493?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560423984-d7319717a615?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511882150382-421059c87d55?q=80&w=2070&auto=format&fit=crop",
];

export default function GameHubPage() {
  return (
    <div className="bg-background text-foreground">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold font-headline text-primary">Benvenuto al Game Hub</h1>
      </header>

      <section id="main-quadrant" className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gameImages.map((src, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-primary/30 transition-shadow">
              <img
                src={src}
                alt={`Gioco ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold">Scopri tutti i giochi!</h2>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-6 py-8 text-center">
        <div className="bg-card rounded-lg p-6 my-8 shadow-inner">
          <h3 className="text-xl font-bold mb-4">Banner affiliato</h3>
          {/* Inserisci qui il tuo codice affiliato, ad esempio AdCombo */}
          <div className="bg-muted/40 h-24 flex items-center justify-center rounded-md">
            <p className="text-muted-foreground">Il tuo banner qui</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 my-8 shadow-inner">
          <h3 className="text-xl font-bold mb-4">Supporta lo sviluppo</h3>
          <form action="https://www.paypal.com/donate" method="post" target="_blank">
            <input type="hidden" name="business" value="alibi81@libero.it" />
            <input type="hidden" name="currency_code" value="EUR" />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Dona con PayPal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
