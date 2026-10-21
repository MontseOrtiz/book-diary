"use client";

import { useActionState } from "react";
import { finishReading, updateReading, type FormState } from "@/app/actions";
import { DateFields, FormatSelect, RatingSelect } from "./DateFields";

const initial: FormState = {};

export interface EditData {
  id: string;
  status: "reading" | "finished" | "abandoned";
  format: string;
  edition_label: string | null;
  started_year: number | null;
  started_month: number | null;
  started_day: number | null;
  finished_year: number | null;
  finished_month: number | null;
  finished_day: number | null;
  rating: number | null;
  review: string | null;
  title: string;
  author: string | null;
  cover_url: string | null;
}

export function EditReadingForm({ data }: { data: EditData }) {
  const [state, action, pending] = useActionState(updateReading, initial);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-5">
      <input type="hidden" name="id" value={data.id} />
      <label className="flex flex-col gap-1 text-sm">
        Título
        <input name="title" defaultValue={data.title} className="field" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Autor
        <input name="author" defaultValue={data.author ?? ""} className="field" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        URL de portada
        <input name="cover_url" type="url" defaultValue={data.cover_url ?? ""} className="field" />
      </label>
      <FormatSelect defaultValue={data.format} />
      <label className="flex flex-col gap-1 text-sm">
        Edición (opcional)
        <input name="edition_label" defaultValue={data.edition_label ?? ""} className="field" />
      </label>
      <DateFields
        legend="Inicio (opcional)"
        prefix="started"
        defaults={{ year: data.started_year, month: data.started_month, day: data.started_day }}
      />
      {data.status === "finished" && (
        <>
          <DateFields
            legend="Fin"
            prefix="finished"
            defaults={{ year: data.finished_year, month: data.finished_month, day: data.finished_day }}
            hint="Al menos el año."
          />
          <RatingSelect defaultValue={data.rating} />
        </>
      )}
      <label className="flex flex-col gap-1 text-sm">
        {data.status === "finished" ? "Opinión" : "Notas"}
        <textarea name="review" rows={4} defaultValue={data.review ?? ""} className="field" />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary self-start">
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}

export function FinishForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(finishReading, initial);
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4 rounded-xl border border-ink-soft/15 p-4">
      <input type="hidden" name="id" value={id} />
      <h2 className="font-serif text-xl">Terminar lectura</h2>
      <DateFields legend="Fecha de fin" prefix="finished" hint="Al menos el año." />
      <RatingSelect />
      <label className="flex flex-col gap-1 text-sm">
        Opinión (opcional)
        <textarea name="review" rows={3} className="field" />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary self-start">
        Terminar
      </button>
    </form>
  );
}
