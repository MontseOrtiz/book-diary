import { normalizeKey } from "./partial-date";

export interface BookSearchResult {
  title: string;
  author: string | null;
  cover_url: string | null;
  synopsis: string | null;
  genres: string[] | null;
  open_library_id: string | null;
  google_books_id: string | null;
}

const TIMEOUT_MS = 6000;

async function fetchJson(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function searchOpenLibrary(query: string): Promise<BookSearchResult[]> {
  const url =
    "https://openlibrary.org/search.json?limit=8&fields=key,title,author_name,cover_i,subject&q=" +
    encodeURIComponent(query);
  const data = await fetchJson(url);
  return (data.docs ?? []).map(
    (doc: { key: string; title: string; author_name?: string[]; cover_i?: number; subject?: string[] }) => ({
      title: doc.title,
      author: doc.author_name?.[0] ?? null,
      cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
      synopsis: null,
      genres: doc.subject?.slice(0, 3) ?? null,
      open_library_id: doc.key.replace("/works/", ""),
      google_books_id: null,
    }),
  );
}

async function searchGoogleBooks(query: string): Promise<BookSearchResult[]> {
  // Sin clave, la cuota compartida de Google suele estar agotada (429); con
  // GOOGLE_BOOKS_API_KEY propia (gratis) hay cuota personal.
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  const url =
    "https://www.googleapis.com/books/v1/volumes?maxResults=8&printType=books" +
    "&fields=items(id,volumeInfo(title,authors,description,categories,imageLinks/thumbnail))" +
    (key ? `&key=${encodeURIComponent(key)}` : "") +
    "&q=" +
    encodeURIComponent(query);
  const data = await fetchJson(url);
  return (data.items ?? []).map(
    (item: {
      id: string;
      volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        categories?: string[];
        imageLinks?: { thumbnail?: string };
      };
    }) => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] ?? null,
      cover_url: item.volumeInfo.imageLinks?.thumbnail?.replace(/^http:/, "https:") ?? null,
      synopsis: item.volumeInfo.description ?? null,
      genres: item.volumeInfo.categories?.slice(0, 3) ?? null,
      open_library_id: null,
      google_books_id: item.id,
    }),
  );
}

/** Une resultados de ambos proveedores por título+autor, completando campos faltantes. */
export function mergeResults(lists: BookSearchResult[][]): BookSearchResult[] {
  const merged = new Map<string, BookSearchResult>();
  const longest = Math.max(0, ...lists.map((list) => list.length));
  for (let i = 0; i < longest; i++) {
    for (const list of lists) {
      const item = list[i];
      if (!item?.title) continue;
      const key = normalizeKey(item.title, item.author ?? "");
      const current = merged.get(key);
      if (!current) {
        merged.set(key, { ...item });
        continue;
      }
      current.cover_url ??= item.cover_url;
      current.synopsis ??= item.synopsis;
      current.genres ??= item.genres;
      current.open_library_id ??= item.open_library_id;
      current.google_books_id ??= item.google_books_id;
    }
  }
  return [...merged.values()].slice(0, 10);
}

export async function searchCatalogs(
  query: string,
): Promise<{ results: BookSearchResult[]; failed: boolean }> {
  const settled = await Promise.allSettled([searchOpenLibrary(query), searchGoogleBooks(query)]);
  const lists = settled.flatMap((s) => (s.status === "fulfilled" ? [s.value] : []));
  return { results: mergeResults(lists), failed: lists.length === 0 };
}
