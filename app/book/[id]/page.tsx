"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BOOK_STATUS_LABELS, type Book } from "@/types/database";

interface CompletionForm {
  rating: number | null;
  wouldRecommend: boolean | null;
  wouldReread: boolean | null;
  engagement: number | null;
  notes: string;
}

const EMPTY_FORM: CompletionForm = {
  rating: null,
  wouldRecommend: null,
  wouldReread: null,
  engagement: null,
  notes: "",
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
          value === true
            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
            : "border-zinc-300 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
        }`}
      >
        Sí
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
          value === false
            ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
            : "border-zinc-300 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
        }`}
      >
        No
      </button>
    </div>
  );
}

function ScaleSelector({
  value,
  onChange,
  symbol,
}: {
  value: number | null;
  onChange: (value: number) => void;
  symbol?: "star";
}) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
            value !== null && n <= value
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-300 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          {symbol === "star" ? "★" : n}
        </button>
      ))}
    </div>
  );
}

export default function BookDetailPage() {
  const params = useParams<{ id: string }>();
  const bookId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [updating, setUpdating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CompletionForm>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBook() {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", bookId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setErrorMessage("Error al cargar el libro.");
      } else if (!data) {
        setNotFound(true);
      } else {
        setBook(data);
      }
      setLoading(false);
    }

    loadBook();
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  async function handleStartReading() {
    if (!book) return;
    setUpdating(true);
    setErrorMessage(null);

    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("books")
      .update({ status: "leyendo", start_date: today, last_updated_at: now })
      .eq("id", book.id)
      .select()
      .single();

    setUpdating(false);

    if (error) {
      setErrorMessage("Error al actualizar el libro. Inténtalo de nuevo.");
      return;
    }
    setBook(data);
  }

  async function handleLogProgress() {
    if (!book) return;
    setUpdating(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("books")
      .update({ last_updated_at: new Date().toISOString() })
      .eq("id", book.id)
      .select()
      .single();

    setUpdating(false);

    if (error) {
      setErrorMessage("Error al actualizar el libro. Inténtalo de nuevo.");
      return;
    }
    setBook(data);
  }

  function openCompletionForm() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  }

  function openEditForm() {
    if (!book) return;
    setForm({
      rating: book.rating,
      wouldRecommend: book.would_recommend,
      wouldReread: book.would_reread,
      engagement: book.engagement,
      notes: book.notes ?? "",
    });
    setFormError(null);
    setShowForm(true);
  }

  async function handleSubmitForm(event: FormEvent) {
    event.preventDefault();
    if (!book) return;

    if (form.rating === null) {
      setFormError("Selecciona una calificación.");
      return;
    }

    setUpdating(true);
    setFormError(null);

    const isCompleting = book.status === "leyendo";

    const { data, error } = await supabase
      .from("books")
      .update({
        rating: form.rating,
        would_recommend: form.wouldRecommend,
        would_reread: form.wouldReread,
        engagement: form.engagement,
        notes: form.notes.trim() || null,
        ...(isCompleting
          ? {
              status: "terminado" as const,
              finish_date: new Date().toISOString().slice(0, 10),
              last_updated_at: new Date().toISOString(),
            }
          : {}),
      })
      .eq("id", book.id)
      .select()
      .single();

    setUpdating(false);

    if (error) {
      setFormError("Error al guardar. Inténtalo de nuevo.");
      return;
    }

    setBook(data);
    setShowForm(false);
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
        <Link
          href="/"
          className="self-start text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Volver al inicio
        </Link>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando...</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
        <Link
          href="/"
          className="self-start text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Volver al inicio
        </Link>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Libro no encontrado.</p>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
        <Link
          href="/"
          className="self-start text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Volver al inicio
        </Link>
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {errorMessage ?? "Error al cargar el libro."}
        </p>
      </main>
    );
  }

  const startDateLabel = formatDate(book.start_date);
  const finishDateLabel = formatDate(book.finish_date);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
      <Link
        href="/"
        className="self-start text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Volver al inicio
      </Link>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      <div className="flex gap-5">
        <div className="h-44 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          {book.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {book.title}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {book.title}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {book.author ?? "Autor desconocido"}
            </p>
          </div>

          <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {BOOK_STATUS_LABELS[book.status]}
          </span>

          {startDateLabel && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Empezado: {startDateLabel}
            </p>
          )}
          {finishDateLabel && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Terminado: {finishDateLabel}
            </p>
          )}
        </div>
      </div>

      {book.status === "quiero_leer" && (
        <button
          type="button"
          onClick={handleStartReading}
          disabled={updating}
          className="self-start rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {updating ? "Guardando..." : "Empezar a leer"}
        </button>
      )}

      {book.status === "leyendo" && !showForm && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleLogProgress}
            disabled={updating}
            className="rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            {updating ? "Guardando..." : "Actualicé mi avance hoy"}
          </button>
          <button
            type="button"
            onClick={openCompletionForm}
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Marcar como terminado
          </button>
        </div>
      )}

      {book.status === "terminado" && !showForm && (
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Calificación</p>
            <p className="text-sm text-zinc-900 dark:text-zinc-50">
              {book.rating ? "★".repeat(book.rating) + "☆".repeat(5 - book.rating) : "Sin calificar"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              ¿Lo recomendarías?
            </p>
            <p className="text-sm text-zinc-900 dark:text-zinc-50">
              {book.would_recommend === null ? "—" : book.would_recommend ? "Sí" : "No"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              ¿Lo volverías a leer?
            </p>
            <p className="text-sm text-zinc-900 dark:text-zinc-50">
              {book.would_reread === null ? "—" : book.would_reread ? "Sí" : "No"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              ¿Qué tan enganchada estuviste?
            </p>
            <p className="text-sm text-zinc-900 dark:text-zinc-50">
              {book.engagement ?? "—"} / 5
            </p>
          </div>
          {book.notes && (
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Notas</p>
              <p className="whitespace-pre-wrap text-sm text-zinc-900 dark:text-zinc-50">
                {book.notes}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={openEditForm}
            className="self-start text-sm font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Editar
          </button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmitForm}
          className="flex flex-col gap-5 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Calificación
            </label>
            <ScaleSelector
              value={form.rating}
              onChange={(rating) => setForm((f) => ({ ...f, rating }))}
              symbol="star"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              ¿Lo recomendarías?
            </label>
            <YesNoToggle
              value={form.wouldRecommend}
              onChange={(wouldRecommend) => setForm((f) => ({ ...f, wouldRecommend }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              ¿Lo volverías a leer?
            </label>
            <YesNoToggle
              value={form.wouldReread}
              onChange={(wouldReread) => setForm((f) => ({ ...f, wouldReread }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              ¿Qué tan enganchada estuviste?
            </label>
            <ScaleSelector
              value={form.engagement}
              onChange={(engagement) => setForm((f) => ({ ...f, engagement }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Notas <span className="font-normal text-zinc-500 dark:text-zinc-400">(opcional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((f) => ({ ...f, notes: event.target.value }))}
              rows={4}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
            />
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
              {formError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={updating}
              className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {updating ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
