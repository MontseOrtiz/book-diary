"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { BookSearchResult } from "@/app/api/search-books/route";

type Step = "capture" | "results";
type CaptureMode = "photo" | "manual";

export default function StartReadingPage() {
  const [step, setStep] = useState<Step>("capture");
  const [captureMode, setCaptureMode] = useState<CaptureMode>("photo");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [searchedAtLeastOnce, setSearchedAtLeastOnce] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function resetToStart() {
    setStep("capture");
    setCaptureMode("photo");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setQuery("");
    setResults([]);
    setSearchedAtLeastOnce(false);
  }

  async function runSearch(searchQuery: string) {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setErrorMessage("No se pudo determinar un título o autor para buscar.");
      return;
    }

    const response = await fetch(`/api/search-books?q=${encodeURIComponent(trimmed)}`);
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.error ?? "Error al buscar libros.");
      return;
    }

    setResults(data.results);
    setSearchedAtLeastOnce(true);
    setStep("results");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null);
    setErrorMessage(null);
  }

  async function handleAnalyzePhoto() {
    if (!selectedFile) return;

    setAnalyzing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/parse-book-photo", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error ?? "Error al leer la portada.");
        setAnalyzing(false);
        return;
      }

      const derivedQuery = [data.title, data.author].filter(Boolean).join(" ");
      await runSearch(derivedQuery);
    } catch {
      setErrorMessage("Hubo un error al leer la portada. Inténtalo de nuevo.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleManualSearch(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await runSearch(query);
    } catch {
      setErrorMessage("Hubo un error al buscar libros. Inténtalo de nuevo.");
    } finally {
      setSearching(false);
    }
  }

  async function handleConfirm(book: BookSearchResult) {
    setSavingId(book.open_library_id);
    setErrorMessage(null);

    const today = new Date().toISOString().slice(0, 10);

    const { error } = await supabase.from("books").insert({
      title: book.title,
      author: book.author,
      cover_image_url: book.cover_url,
      open_library_id: book.open_library_id,
      status: "leyendo",
      start_date: today,
      finish_date: null,
    });

    setSavingId(null);

    if (error) {
      setErrorMessage(`Error al guardar "${book.title}". Inténtalo de nuevo.`);
      return;
    }

    setSuccessMessage(`¡Ya estás leyendo "${book.title}"!`);
    resetToStart();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Empezar a leer
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Toma una foto de la portada o busca el libro manualmente.
        </p>
      </div>

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

      {step === "capture" && captureMode === "photo" && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-900 hover:file:bg-zinc-200 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-zinc-50 dark:hover:file:bg-zinc-700"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAnalyzePhoto}
              disabled={!selectedFile || analyzing}
              className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {analyzing ? "Leyendo la portada..." : "Analizar portada"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setCaptureMode("manual");
              setErrorMessage(null);
            }}
            className="self-start text-sm font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Buscar manualmente
          </button>
        </div>
      )}

      {step === "capture" && captureMode === "manual" && (
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej. Harry Potter"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={searching}
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {searching ? "Buscando..." : "Buscar"}
          </button>
        </form>
      )}

      {step === "results" && (
        <>
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
                  onClick={() => handleConfirm(book)}
                  disabled={savingId === book.open_library_id}
                  className="flex-shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
                >
                  {savingId === book.open_library_id
                    ? "Guardando..."
                    : "Confirmar y empezar a leer"}
                </button>
              </li>
            ))}
          </ul>

          {searchedAtLeastOnce && results.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No se encontraron resultados. Intenta con otro título o autor.
            </p>
          )}

          <button
            type="button"
            onClick={resetToStart}
            className="self-start text-sm font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Empezar de nuevo
          </button>
        </>
      )}
    </main>
  );
}
