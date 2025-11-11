import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json({ error: 'URL del feed mancante' }, { status: 400 });
  }

  try {
    // Revalidiamo la cache ogni 60 minuti (3600 secondi)
    const response = await fetch(feedUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Impossibile recuperare il feed: ${response.statusText}`);
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
    return NextResponse.json({ error: `Errore del server nel recuperare il feed: ${errorMessage}` }, { status: 500 });
  }
}
