import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get('url');

  if (!feedUrl) {
    return NextResponse.json({ error: 'URL del feed mancante' }, { status: 400 });
  }

  try {
    const response = await fetch(feedUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      // If fetching fails, return a specific status that the client can handle
      // without halting everything. 424 Failed Dependency is a good candidate.
      return NextResponse.json(
        { error: `Impossibile recuperare il feed: ${response.statusText}` },
        { status: response.status }
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
    // Return a 500 only for unexpected server errors, otherwise pass the original status
    return NextResponse.json({ error: `Errore del server nel recuperare il feed: ${errorMessage}` }, { status: 500 });
  }
}
