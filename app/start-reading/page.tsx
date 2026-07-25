"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Camera,
  MagnifyingGlass,
  CheckCircle,
  WarningCircle,
  ArrowLeft,
} from "@phosphor-icons/react";
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
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
          Empezar a leer
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Toma una foto de la portada o busca el libro manualmente.
        </p>
      </div>

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

      {step === "capture" && captureMode === "photo" && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="text-sm text-ink-soft file:mr-4 file:rounded-xl file:border-0 file:bg-surface-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-surface-soft/70"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAnalyzePhoto}
              disabled={!selectedFile || analyzing}
              className="btn-primary"
            >
              <Camera size={18} weight="bold" />
              {analyzing ? "Leyendo la portada..." : "Analizar portada"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setCaptureMode("manual");
              setErrorMessage(null);
            }}
            className="btn-ghost self-start"
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
            className="input-field flex-1"
          />
          <button type="submit" disabled={searching} className="btn-primary">
            <MagnifyingGlass size={18} weight="bold" />
            {searching ? "Buscando..." : "Buscar"}
          </button>
        </form>
      )}

      {step === "results" && (
        <>
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
                  <p className="text-sm text-ink-soft">
                    {book.author ?? "Autor desconocido"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleConfirm(book)}
                  disabled={savingId === book.open_library_id}
                  className="btn-secondary flex-shrink-0 px-3 py-1.5 text-xs"
                >
                  {savingId === book.open_library_id
                    ? "Guardando..."
                    : "Confirmar y empezar a leer"}
                </button>
              </li>
            ))}
          </ul>

          {searchedAtLeastOnce && results.length === 0 && (
            <p className="text-sm text-ink-soft">
              No se encontraron resultados. Intenta con otro título o autor.
            </p>
          )}

          <button type="button" onClick={resetToStart} className="btn-ghost inline-flex w-fit items-center gap-1.5">
            <ArrowLeft size={14} weight="bold" />
            Empezar de nuevo
          </button>
        </>
      )}
    </main>
  );
}
