import { createClient } from "@/lib/supabase/server";
import type { PublicBook, PublicGoal, PublicReading } from "@/types/library";

export interface LibraryEntry {
  reading: PublicReading;
  book: PublicBook;
}

export type LibraryResult =
  | { ok: true; entries: LibraryEntry[]; goals: PublicGoal[] }
  | { ok: false };

// Lee solo las vistas públicas. Un error nunca se interpreta como «sin datos».
export async function loadLibrary(): Promise<LibraryResult> {
  const supabase = await createClient();
  const [books, readings, goals] = await Promise.all([
    supabase.from("public_books").select("*"),
    supabase.from("public_readings").select("*"),
    supabase.from("public_reading_goals").select("*"),
  ]);

  if (books.error || readings.error || goals.error) return { ok: false };

  const bookById = new Map((books.data as PublicBook[]).map((b) => [b.id, b]));
  const entries: LibraryEntry[] = [];
  for (const reading of readings.data as PublicReading[]) {
    const book = bookById.get(reading.book_id);
    if (book) entries.push({ reading, book });
  }
  return { ok: true, entries, goals: goals.data as PublicGoal[] };
}

export interface YearView {
  year: number;
  years: number[];
  goal: PublicGoal | null;
  completed: number;
  reading: LibraryEntry[];
  abandoned: LibraryEntry[];
  /** Índice 0 = enero. */
  months: LibraryEntry[][];
  noMonth: LibraryEntry[];
}

function byFinishDesc(a: LibraryEntry, b: LibraryEntry) {
  const key = (e: LibraryEntry) =>
    (e.reading.finished_month ?? 0) * 100 + (e.reading.finished_day ?? 0);
  return key(b) - key(a);
}

export function selectYear(
  entries: LibraryEntry[],
  goals: PublicGoal[],
  requested: number | null,
  currentYear: number,
): YearView {
  const finished = entries.filter(
    (e) => e.reading.status === "finished" && e.reading.finished_year !== null,
  );
  const years = [
    ...new Set([
      currentYear,
      ...goals.map((g) => g.year),
      ...finished.map((e) => e.reading.finished_year as number),
    ]),
  ].sort((a, b) => b - a);

  const year = requested !== null && years.includes(requested) ? requested : currentYear;
  const ofYear = finished.filter((e) => e.reading.finished_year === year);

  const months: LibraryEntry[][] = Array.from({ length: 12 }, () => []);
  const noMonth: LibraryEntry[] = [];
  for (const entry of ofYear) {
    const month = entry.reading.finished_month;
    if (month === null) noMonth.push(entry);
    else months[month - 1].push(entry);
  }
  months.forEach((list) => list.sort(byFinishDesc));

  return {
    year,
    years,
    goal: goals.find((g) => g.year === year) ?? null,
    completed: ofYear.length,
    // DEC-034: todas las activas, sin filtrar por el año elegido.
    reading: entries.filter((e) => e.reading.status === "reading"),
    abandoned: entries.filter((e) => e.reading.status === "abandoned"),
    months,
    noMonth,
  };
}
