"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth/owner";
import { searchCatalogs, type BookSearchResult } from "@/lib/book-search";
import { createClient } from "@/lib/supabase/server";
import {
  endsBeforeStart,
  normalizeKey,
  readPartialDate,
  todayParts,
  validatePartialDate,
  type PartialDate,
} from "@/lib/partial-date";

export type FormState = { error?: string };

const FORMATS = ["fisico", "kindle", "ipad", "audiolibro", "otro"];

function text(formData: FormData, name: string): string | null {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

function readRating(formData: FormData): { value: number | null; error?: string } {
  const raw = text(formData, "rating");
  if (raw === null) return { value: null };
  const value = Number(raw);
  if (!(value >= 0.5 && value <= 5 && Number.isInteger(value * 2))) {
    return { value: null, error: "La calificación va de 0.5 a 5 en pasos de 0.5." };
  }
  return { value };
}

/** Valida inicio/fin según DEC-033 y DEC-044. */
function checkDates(start: PartialDate, end: PartialDate | null): string | null {
  const today = todayParts();
  const startError = validatePartialDate(start, "Inicio", today);
  if (startError) return startError;
  if (!end) return null;
  if (end.year === null) return "Fin: indica al menos el año.";
  const endError = validatePartialDate(end, "Fin", today);
  if (endError) return endError;
  if (endsBeforeStart(start, end)) return "El fin no puede ser anterior al inicio.";
  return null;
}

function dateColumns(prefix: "started" | "finished", d: PartialDate | null) {
  return {
    [`${prefix}_year`]: d?.year ?? null,
    [`${prefix}_month`]: d?.month ?? null,
    [`${prefix}_day`]: d?.day ?? null,
  };
}

export type SearchState = { results: BookSearchResult[]; failed: boolean };

export async function searchBooks(query: string): Promise<SearchState> {
  await requireOwner();
  const trimmed = query.trim();
  if (trimmed.length < 2) return { results: [], failed: false };
  return searchCatalogs(trimmed);
}

export async function createReading(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireOwner();
  const supabase = await createClient();

  const status = String(formData.get("status"));
  const format = String(formData.get("format"));
  if (status !== "reading" && status !== "finished") return { error: "Estado no válido." };
  if (!FORMATS.includes(format)) return { error: "Elige un formato." };

  const start = readPartialDate(formData, "started");
  const end = status === "finished" ? readPartialDate(formData, "finished") : null;
  const dateError = checkDates(start, end);
  if (dateError) return { error: dateError };
  const rating = readRating(formData);
  if (rating.error) return { error: rating.error };

  let bookId = text(formData, "book_id");
  if (!bookId) {
    const title = text(formData, "title");
    const author = text(formData, "author") ?? "";
    if (!title) return { error: "Escribe el título o elige un libro existente." };

    const matchKey = normalizeKey(title, author);
    const openLibraryId = text(formData, "open_library_id");
    const googleBooksId = text(formData, "google_books_id");
    const ids = [
      `match_key.eq.${matchKey.replace(/[,()]/g, " ")}`,
      ...(openLibraryId ? [`open_library_id.eq.${openLibraryId}`] : []),
      ...(googleBooksId ? [`google_books_id.eq.${googleBooksId}`] : []),
    ];
    const { data: existing } = await supabase.from("books").select("id").or(ids.join(",")).limit(1);
    if (existing?.length) {
      return { error: "Ese libro ya existe. Elígelo en la lista para crear una relectura." };
    }
    const genres = text(formData, "genres");
    const { data: book, error } = await supabase
      .from("books")
      .insert({
        title,
        author: author || null,
        cover_url: text(formData, "cover_url"),
        synopsis: text(formData, "synopsis"),
        genres: genres ? genres.split("|") : null,
        open_library_id: openLibraryId,
        google_books_id: googleBooksId,
        match_key: matchKey,
      })
      .select("id")
      .single();
    if (error) return { error: "No se pudo guardar el libro." };
    bookId = book.id;
  }

  const { error } = await supabase.from("readings").insert({
    book_id: bookId,
    status,
    format,
    edition_label: text(formData, "edition_label"),
    ...dateColumns("started", start),
    ...dateColumns("finished", end),
    rating: status === "finished" ? rating.value : null,
    review: text(formData, "review"),
  });
  if (error) return { error: "No se pudo guardar la lectura." };

  revalidatePath("/");
  redirect("/");
}

export async function updateReading(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireOwner();
  const supabase = await createClient();
  const id = String(formData.get("id"));

  const { data: reading } = await supabase.from("readings").select("status, book_id").eq("id", id).single();
  if (!reading) return { error: "No se encontró la lectura." };

  const format = String(formData.get("format"));
  if (!FORMATS.includes(format)) return { error: "Elige un formato." };
  const title = text(formData, "title");
  if (!title) return { error: "El título no puede quedar vacío." };

  const finished = reading.status === "finished";
  const start = readPartialDate(formData, "started");
  const end = finished ? readPartialDate(formData, "finished") : null;
  const dateError = checkDates(start, end);
  if (dateError) return { error: dateError };
  const rating = readRating(formData);
  if (rating.error) return { error: rating.error };

  const author = text(formData, "author");
  const bookUpdate = await supabase
    .from("books")
    .update({
      title,
      author,
      cover_url: text(formData, "cover_url"),
      match_key: normalizeKey(title, author ?? ""),
      updated_at: new Date().toISOString(),
    })
    .eq("id", reading.book_id);
  if (bookUpdate.error) return { error: "No se pudo guardar el libro." };

  const { error } = await supabase
    .from("readings")
    .update({
      format,
      edition_label: text(formData, "edition_label"),
      ...dateColumns("started", start),
      ...(finished ? dateColumns("finished", end) : {}),
      rating: finished ? rating.value : null,
      review: text(formData, "review"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: "No se pudo guardar la lectura." };

  revalidatePath("/");
  redirect("/");
}

export async function finishReading(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireOwner();
  const supabase = await createClient();
  const id = String(formData.get("id"));

  const { data: reading } = await supabase
    .from("readings")
    .select("status, started_year, started_month, started_day")
    .eq("id", id)
    .single();
  if (!reading || reading.status !== "reading") return { error: "Solo se puede terminar una lectura en curso." };

  const end = readPartialDate(formData, "finished");
  const start = { year: reading.started_year, month: reading.started_month, day: reading.started_day };
  const dateError = checkDates(start, end);
  if (dateError) return { error: dateError };
  const rating = readRating(formData);
  if (rating.error) return { error: rating.error };

  const { error } = await supabase
    .from("readings")
    .update({
      status: "finished",
      ...dateColumns("finished", end),
      rating: rating.value,
      review: text(formData, "review"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: "No se pudo terminar la lectura." };

  revalidatePath("/");
  redirect("/");
}

async function changeStatus(id: string, from: "reading" | "abandoned", to: "reading" | "abandoned", note: string | null) {
  const supabase = await createClient();
  const { data: reading } = await supabase.from("readings").select("status").eq("id", id).single();
  if (!reading || reading.status !== from) throw new Error("Transición no permitida.");

  const today = todayParts();
  const event = await supabase.from("reading_events").insert({
    reading_id: id,
    kind: to === "abandoned" ? "abandoned" : "resumed",
    year: today.year,
    month: today.month,
    day: today.day,
    note,
  });
  if (event.error) throw new Error("No se pudo guardar el historial.");

  const { error } = await supabase
    .from("readings")
    .update({ status: to, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error("No se pudo cambiar el estado.");

  revalidatePath("/");
  redirect("/");
}

export async function abandonReading(formData: FormData) {
  await requireOwner();
  await changeStatus(String(formData.get("id")), "reading", "abandoned", text(formData, "note"));
}

export async function resumeReading(formData: FormData) {
  await requireOwner();
  await changeStatus(String(formData.get("id")), "abandoned", "reading", null);
}

// Borrado lógico (DEC-040/044): la lectura se oculta y se puede restaurar quitando deleted_at.
export async function deleteReading(formData: FormData) {
  await requireOwner();
  const supabase = await createClient();
  const { error } = await supabase
    .from("readings")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", String(formData.get("id")));
  if (error) throw new Error("No se pudo eliminar la lectura.");

  revalidatePath("/");
  redirect("/");
}

export async function saveGoal(formData: FormData) {
  await requireOwner();
  const year = Number(formData.get("year"));
  const target = Number(formData.get("target_count"));
  if (!Number.isInteger(year) || !Number.isInteger(target) || target < 1) {
    throw new Error("La meta debe ser un número entero positivo.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reading_goals")
    .upsert({ year, target_count: target, updated_at: new Date().toISOString() }, { onConflict: "year" });
  if (error) throw new Error("No se pudo guardar la meta.");

  revalidatePath("/");
}
