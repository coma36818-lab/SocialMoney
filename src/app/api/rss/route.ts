import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json({ error: 'URL del feed mancante' }, { status: 400 });
  }

  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // Se il fetch non va a buon fine, restituiamo uno status specifico
      // che il client può gestire senza interrompere tutto.
      return NextResponse.json(
        { error: `Impossibile recuperare il feed: ${response.statusText}` },
        { status: response.status } // Usiamo lo status code originale se disponibile
      );
    }

    const text = await response.text();
    
    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });

  } catch (error) {
    console.error(`Errore nel recuperare il feed ${feedUrl}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    // Restituisce un errore 500 solo per errori di server imprevisti
    return NextResponse.json({ error: `Errore del server nel recuperare il feed: ${errorMessage}` }, { status: 500 });
  }
}
