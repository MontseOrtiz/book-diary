"use client";

import { useState, type FormEvent } from "react";
import { MagnifyingGlass, Plus, CheckCircle, WarningCircle } from "@phosphor-icons/react";
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
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
          Agregar libro
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Busca un libro por título o autor para agregarlo a tu lista.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ej. Harry Potter"
          className="input-field flex-1"
        />
        <button type="submit" disabled={searchStatus === "loading"} className="btn-primary">
          <MagnifyingGlass size={18} weight="bold" />
          {searchStatus === "loading" ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {successMessage && (
        <p className="alert-success">
          <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-success" />
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="alert-error">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-error" />
          {errorMessage}
        </p>
      )}

      {searchStatus === "idle" &&
        results.length === 0 &&
        !errorMessage &&
        query === "" && (
          <p className="text-sm text-ink-soft">
            Escribe un título o autor y presiona &quot;Buscar&quot;.
          </p>
        )}

      <ul className="flex flex-col gap-3">
        {results.map((book) => (
          <li key={book.open_library_id} className="card-surface flex items-center gap-4 p-3">
            {book.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.cover_url}
                alt={book.title}
                className="h-20 w-14 flex-shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-20 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-surface-soft text-center text-[10px] text-ink-soft">
                Sin portada
              </div>
            )}

            <div className="flex-1">
              <p className="font-serif text-sm font-medium text-ink">{book.title}</p>
              <p className="text-sm text-ink-soft">{book.author ?? "Autor desconocido"}</p>
            </div>

            <button
              type="button"
              onClick={() => handleAddBook(book)}
              disabled={savingId === book.open_library_id}
              className="btn-secondary flex-shrink-0 px-3 py-1.5 text-xs"
            >
              <Plus size={14} weight="bold" />
              {savingId === book.open_library_id ? "Agregando..." : "Agregar a mi lista"}
            </button>
          </li>
        ))}
      </ul>

      {searchStatus === "idle" &&
        results.length === 0 &&
        query !== "" &&
        !errorMessage && (
          <p className="text-sm text-ink-soft">
            No se encontraron resultados. Intenta con otro título o autor.
          </p>
        )}
    </main>
  );
}
