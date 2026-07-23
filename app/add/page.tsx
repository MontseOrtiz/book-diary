"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { BookSearchResult } from "@/app/api/search-books/route";

type SearchStatus = "idle" | "loading" | "error";

export default function AddBookPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setSearchStatus("loading");
    setErrorMessage(null);
    setSuccessMessage(null);
    setResults([]);

    try {
      const response = await fetch(
        `/api/search-books?q=${encodeURIComponent(trimmedQuery)}`
      );
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? "Error al buscar libros.");
        setSearchStatus("error");
        return;
      }

      setResults(data.results);
      setSearchStatus("idle");
    } catch {
      setErrorMessage("Hubo un error al buscar libros. Inténtalo de nuevo.");
      setSearchStatus("error");
    }
  }

  async function handleAddBook(book: BookSearchResult) {
    setSavingId(book.open_library_id);
    setErrorMessage(null);

    const { error } = await supabase.from("books").insert({
      title: book.title,
      author: book.author,
      cover_image_url: book.cover_url,
      open_library_id: book.open_library_id,
      status: "quiero_leer",
      start_date: null,
      finish_date: null,
    });

    setSavingId(null);

    if (error) {
      setErrorMessage(`Error al guardar "${book.title}". Inténtalo de nuevo.`);
      return;
    }

    setSuccessMessage(`"${book.title}" se agregó a tu lista.`);
    setQuery("");
    setResults([]);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Agregar libro
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Busca un libro por título o autor para agregarlo a tu lista.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ej. Harry Potter"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={searchStatus === "loading"}
          className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {searchStatus === "loading" ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {successMessage && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {searchStatus === "idle" &&
        results.length === 0 &&
        !errorMessage &&
        query === "" && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Escribe un título o autor y presiona &quot;Buscar&quot;.
          </p>
        )}

      <ul className="flex flex-col gap-3">
        {results.map((book) => (
          <li
            key={book.open_library_id}
            className="flex items-center gap-4 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
          >
            {book.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.cover_url}
                alt={book.title}
                className="h-20 w-14 flex-shrink-0 rounded object-cover"
              />
            ) : (
              <div className="flex h-20 w-14 flex-shrink-0 items-center justify-center rounded bg-zinc-100 text-center text-[10px] text-zinc-400 dark:bg-zinc-800">
                Sin portada
              </div>
            )}

            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {book.title}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {book.author ?? "Autor desconocido"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleAddBook(book)}
              disabled={savingId === book.open_library_id}
              className="flex-shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              {savingId === book.open_library_id
                ? "Agregando..."
                : "Agregar a mi lista"}
            </button>
          </li>
        ))}
      </ul>

      {searchStatus === "idle" &&
        results.length === 0 &&
        query !== "" &&
        !errorMessage && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No se encontraron resultados. Intenta con otro título o autor.
          </p>
        )}
    </main>
  );
}
