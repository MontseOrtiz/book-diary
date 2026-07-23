import { NextResponse } from "next/server";

export interface BookSearchResult {
  title: string;
  author: string | null;
  open_library_id: string;
  cover_url: string | null;
}

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

interface OpenLibrarySearchResponse {
  docs: OpenLibraryDoc[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Falta el parámetro de búsqueda (q)." },
      { status: 400 }
    );
  }

  const openLibraryUrl = new URL("https://openlibrary.org/search.json");
  openLibraryUrl.searchParams.set("q", query);
  openLibraryUrl.searchParams.set("limit", "10");
  openLibraryUrl.searchParams.set("fields", "key,title,author_name,cover_i");

  let response: Response;
  try {
    response = await fetch(openLibraryUrl, { cache: "no-store" });
  } catch {
    return NextResponse.json(
      { error: "No se pudo contactar a Open Library." },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "Open Library respondió con un error." },
      { status: 502 }
    );
  }

  const data: OpenLibrarySearchResponse = await response.json();

  const results: BookSearchResult[] = data.docs.slice(0, 10).map((doc) => ({
    title: doc.title,
    author: doc.author_name?.[0] ?? null,
    open_library_id: doc.key,
    cover_url: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
  }));

  return NextResponse.json({ results });
}
