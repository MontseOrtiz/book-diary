"use client";

import { useActionState, useState } from "react";
import { createReading, type FormState } from "@/app/actions";
import { DateFields, FormatSelect, RatingSelect } from "./DateFields";

const initial: FormState = {};

export function NewReadingForm({ books }: { books: { id: string; title: string; author: string | null }[] }) {
  const [state, action, pending] = useActionState(createReading, initial);
  const [status, setStatus] = useState("reading");
  const [bookId, setBookId] = useState("");

  return (
    <form action={action} className="flex max-w-lg flex-col gap-5">
      <label className="flex flex-col gap-1 text-sm">
        Libro
        <select name="book_id" value={bookId} onChange={(e) => setBookId(e.target.value)} className="field">
          <option value="">Libro nuevo</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
              {book.author ? ` — ${book.author}` : ""} (nueva lectura)
            </option>
          ))}
        </select>
      </label>

      {!bookId && (
        <>
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input name="title" className="field" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Autor
            <input name="author" className="field" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            URL de portada (opcional)
            <input name="cover_url" type="url" className="field" />
          </label>
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
