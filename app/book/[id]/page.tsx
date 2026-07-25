"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PencilSimple, WarningCircle, Star } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { BOOK_STATUS_LABELS, type Book, type BookStatus } from "@/types/database";

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

const STATUS_BADGE_CLASS: Record<BookStatus, string> = {
  quiero_leer: "badge-info",
  leyendo: "badge-warning",
  terminado: "badge-success",
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
        className={`rounded-xl border px-4 py-1.5 text-sm font-medium transition-colors ${
          value === true
            ? "border-primary bg-primary text-surface"
            : "border-ink-soft/25 text-ink hover:bg-surface-soft"
        }`}
      >
        Sí
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-xl border px-4 py-1.5 text-sm font-medium transition-colors ${
          value === false
            ? "border-primary bg-primary text-surface"
            : "border-ink-soft/25 text-ink hover:bg-surface-soft"
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
              ? "border-primary bg-primary text-surface"
              : "border-ink-soft/25 text-ink-soft hover:bg-surface-soft"
          }`}
        >
          {symbol === "star" ? <Star size={14} weight="fill" /> : n}
        </button>
      ))}
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-accent">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={16} weight={n <= rating ? "fill" : "regular"} />
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

  const backLink = (
    <Link href="/" className="btn-ghost inline-flex w-fit items-center gap-1.5 no-underline">
      <ArrowLeft size={14} weight="bold" />
      <span className="underline underline-offset-2">Volver al inicio</span>
    </Link>
  );

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
        {backLink}
        <p className="text-sm text-ink-soft">Cargando...</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
        {backLink}
        <p className="text-sm text-ink-soft">Libro no encontrado.</p>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
        {backLink}
        <p className="alert-error">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-error" />
          {errorMessage ?? "Error al cargar el libro."}
        </p>
      </main>
    );
  }

  const startDateLabel = formatDate(book.start_date);
  const finishDateLabel = formatDate(book.finish_date);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
      {backLink}

      {errorMessage && (
        <p className="alert-error">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-error" />
          {errorMessage}
        </p>
      )}

      <div className="flex gap-5">
        <div className="h-44 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-surface-soft shadow-sm">
          {book.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center font-serif text-xs text-ink-soft">
              {book.title}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-serif text-xl font-medium tracking-tight text-ink">
              {book.title}
            </h1>
            <p className="text-sm text-ink-soft">{book.author ?? "Autor desconocido"}</p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[book.status]}`}
          >
            {BOOK_STATUS_LABELS[book.status]}
          </span>

          {startDateLabel && (
            <p className="text-xs text-ink-soft">Empezado: {startDateLabel}</p>
          )}
          {finishDateLabel && (
            <p className="text-xs text-ink-soft">Terminado: {finishDateLabel}</p>
          )}
        </div>
      </div>

      {book.status === "quiero_leer" && (
        <button
          type="button"
          onClick={handleStartReading}
          disabled={updating}
          className="btn-primary self-start"
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
            className="btn-secondary"
          >
            {updating ? "Guardando..." : "Actualicé mi avance hoy"}
          </button>
          <button type="button" onClick={openCompletionForm} className="btn-primary">
            Marcar como terminado
          </button>
        </div>
      )}

      {book.status === "terminado" && !showForm && (
        <div className="card-surface flex flex-col gap-3 p-4">
          <div>
            <p className="text-xs font-medium text-ink-soft">Calificación</p>
            {book.rating ? (
              <RatingStars rating={book.rating} />
            ) : (
              <p className="text-sm text-ink">Sin calificar</p>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-ink-soft">¿Lo recomendarías?</p>
            <p className="text-sm text-ink">
              {book.would_recommend === null ? "Sin respuesta" : book.would_recommend ? "Sí" : "No"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-ink-soft">¿Lo volverías a leer?</p>
            <p className="text-sm text-ink">
              {book.would_reread === null ? "Sin respuesta" : book.would_reread ? "Sí" : "No"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-ink-soft">¿Qué tan enganchada estuviste?</p>
            <p className="text-sm text-ink">{book.engagement ?? "Sin respuesta"} / 5</p>
          </div>
          {book.notes && (
            <div>
              <p className="text-xs font-medium text-ink-soft">Notas</p>
              <p className="whitespace-pre-wrap text-sm text-ink">{book.notes}</p>
            </div>
          )}

          <button
            type="button"
            onClick={openEditForm}
            className="btn-ghost inline-flex w-fit items-center gap-1"
          >
            <PencilSimple size={14} weight="bold" />
            Editar
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmitForm} className="card-surface flex flex-col gap-5 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink">Calificación</label>
            <ScaleSelector
              value={form.rating}
              onChange={(rating) => setForm((f) => ({ ...f, rating }))}
              symbol="star"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink">¿Lo recomendarías?</label>
            <YesNoToggle
              value={form.wouldRecommend}
              onChange={(wouldRecommend) => setForm((f) => ({ ...f, wouldRecommend }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink">¿Lo volverías a leer?</label>
            <YesNoToggle
              value={form.wouldReread}
              onChange={(wouldReread) => setForm((f) => ({ ...f, wouldReread }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink">
              ¿Qué tan enganchada estuviste?
            </label>
            <ScaleSelector
              value={form.engagement}
              onChange={(engagement) => setForm((f) => ({ ...f, engagement }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink">
              Notas <span className="font-normal text-ink-soft">(opcional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((f) => ({ ...f, notes: event.target.value }))}
              rows={4}
              className="input-field resize-none"
            />
          </div>

          {formError && (
            <p className="alert-error">
              <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-error" />
              {formError}
            </p>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={updating} className="btn-primary">
              {updating ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
