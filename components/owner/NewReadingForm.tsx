"use client";

import { useActionState, useState, useTransition } from "react";
import { createReading, searchBooks, type FormState, type SearchState } from "@/app/actions";
import { DateFields, FormatSelect, RatingSelect } from "./DateFields";

const initial: FormState = {};

interface Catalog {
  title: string;
  author: string;
  cover_url: string;
  synopsis: string;
  genres: string;
  open_library_id: string;
  google_books_id: string;
}

const EMPTY: Catalog = {
  title: "",
  author: "",
  cover_url: "",
  synopsis: "",
  genres: "",
  open_library_id: "",
  google_books_id: "",
};

export function NewReadingForm({ books }: { books: { id: string; title: string; author: string | null }[] }) {
  const [state, action, pending] = useActionState(createReading, initial);
  const [status, setStatus] = useState("reading");
  const [bookId, setBookId] = useState("");
  const [book, setBook] = useState<Catalog>(EMPTY);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState<SearchState | null>(null);
  const [searching, startSearch] = useTransition();

  function runSearch() {
    startSearch(async () => setSearch(await searchBooks(query)));
  }

  function field(name: keyof Catalog) {
    return { name, value: book[name], onChange: (e: { target: { value: string } }) => setBook({ ...book, [name]: e.target.value }) };
  }

  return (
    <form action={action} className="flex max-w-lg flex-col gap-5">
      <label className="flex flex-col gap-1 text-sm">
        Libro
        <select name="book_id" value={bookId} onChange={(e) => setBookId(e.target.value)} className="field">
          <option value="">Libro nuevo</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
              {b.author ? ` — ${b.author}` : ""} (nueva lectura)
            </option>
          ))}
        </select>
      </label>

      {!bookId && (
        <>
          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Buscar en catálogos
              <div className="flex gap-2">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      runSearch();
                    }
                  }}
                  placeholder="Título o autor"
                  className="field flex-1"
                />
                <button type="button" onClick={runSearch} disabled={searching} className="btn-secondary">
                  {searching ? "Buscando…" : "Buscar"}
                </button>
              </div>
            </label>
            {search?.failed && (
              <p role="status" className="text-sm text-ink-soft">
                No se pudo consultar los catálogos. Puedes escribir los datos a mano.
              </p>
            )}
            {search && !search.failed && search.results.length === 0 && (
              <p role="status" className="text-sm text-ink-soft">
                Sin resultados. Puedes escribir los datos a mano.
              </p>
            )}
            {search && search.results.length > 0 && (
              <ul className="flex flex-col gap-2">
                {search.results.map((r) => (
                  <li key={`${r.open_library_id}-${r.google_books_id}-${r.title}`}>
                    <button
                      type="button"
                      onClick={() =>
                        setBook({
                          title: r.title,
                          author: r.author ?? "",
                          cover_url: r.cover_url ?? "",
                          synopsis: r.synopsis ?? "",
                          genres: r.genres?.join("|") ?? "",
                          open_library_id: r.open_library_id ?? "",
                          google_books_id: r.google_books_id ?? "",
                        })
                      }
                      className="card-surface flex w-full items-center gap-3 p-2 text-left hover:bg-surface-soft"
                    >
                      {r.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.cover_url} alt="" className="h-14 w-10 rounded object-cover" />
                      ) : (
                        <span className="h-14 w-10 rounded bg-surface-soft" aria-hidden="true" />
                      )}
                      <span className="text-sm">
                        <span className="font-serif">{r.title}</span>
                        {r.author && <span className="block text-ink-soft">{r.author}</span>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="flex flex-col gap-1 text-sm">
            Título
            <input {...field("title")} className="field" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Autor
            <input {...field("author")} className="field" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            URL de portada (opcional)
            <input {...field("cover_url")} type="url" className="field" />
          </label>
          {book.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.cover_url} alt="Vista previa de la portada" className="h-32 w-auto self-start rounded" />
          )}
          <input type="hidden" name="synopsis" value={book.synopsis} />
          <input type="hidden" name="genres" value={book.genres} />
          <input type="hidden" name="open_library_id" value={book.open_library_id} />
          <input type="hidden" name="google_books_id" value={book.google_books_id} />
        </>
      )}

      <FormatSelect />
      <label className="flex flex-col gap-1 text-sm">
        Estado
        <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className="field w-40">
          <option value="reading">Leyendo</option>
          <option value="finished">Terminado</option>
        </select>
      </label>

      <DateFields legend="Inicio (opcional)" prefix="started" hint="Puedes dejar mes y día vacíos." />
      {status === "finished" && (
        <>
          <DateFields legend="Fin" prefix="finished" hint="Al menos el año." />
          <RatingSelect />
          <label className="flex flex-col gap-1 text-sm">
            Opinión (opcional)
            <textarea name="review" rows={4} className="field" />
          </label>
        </>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary self-start">
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
