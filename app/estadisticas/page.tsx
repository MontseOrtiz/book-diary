import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { supabase } from "@/lib/supabase";
import type { Book } from "@/types/database";

export const dynamic = "force-dynamic";

const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

// Monday-based ISO week start for the given date.
function startOfWeek(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

function countByKey(books: Book[], keyOf: (finishDate: Date) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const book of books) {
    const key = keyOf(new Date(book.finish_date as string));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function StatList({ rows }: { rows: { label: string; count: number }[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-ink-soft/25 bg-surface-soft/50 px-4 py-6 text-center text-sm text-ink-soft">
        Aún no hay libros terminados.
      </p>
    );
  }

  const maxCount = Math.max(...rows.map((row) => row.count));

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li key={row.label} className="card-surface flex flex-col gap-2 p-3">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="font-serif text-ink">{row.label}</span>
            <span className="text-ink-soft">
              {row.count} {row.count === 1 ? "libro" : "libros"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(row.count / maxCount) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function EstadisticasPage() {
  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .eq("status", "terminado")
    .not("finish_date", "is", null);

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-6 py-12">
        <p className="alert-error">Error al cargar las estadísticas: {error.message}</p>
      </main>
    );
  }

  const finishedBooks = books ?? [];

  const byYear = countByKey(finishedBooks, (date) => String(date.getFullYear()));
  const yearRows = Array.from(byYear.entries())
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, count]) => ({ label: year, count }));

  const byMonth = countByKey(
    finishedBooks,
    (date) => `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`
  );
  const monthRows = Array.from(byMonth.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, count]) => {
      const [year, month] = key.split("-").map(Number);
      return { label: `${MONTH_NAMES[month]} ${year}`, count };
    });

  const byWeek = countByKey(finishedBooks, (date) => startOfWeek(date).toISOString().slice(0, 10));
  const weekRows = Array.from(byWeek.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, count]) => {
      const weekStart = new Date(`${key}T00:00:00`);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const label =
        weekStart.getMonth() === weekEnd.getMonth()
          ? `Semana del ${weekStart.getDate()} al ${weekEnd.getDate()} de ${MONTH_NAMES[weekStart.getMonth()]}`
          : `Semana del ${weekStart.getDate()} de ${MONTH_NAMES[weekStart.getMonth()]} al ${weekEnd.getDate()} de ${MONTH_NAMES[weekEnd.getMonth()]}`;

      return { label, count };
    });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-4">
        <Link href="/" className="btn-ghost inline-flex w-fit items-center gap-1.5 no-underline">
          <ArrowLeft size={14} weight="bold" />
          <span className="underline underline-offset-2">Volver al inicio</span>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
            Estadísticas
          </h1>
          <p className="mt-1 text-sm text-ink-soft">Un resumen de los libros que has terminado.</p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl font-medium tracking-tight text-ink">Por año</h2>
        <StatList rows={yearRows} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl font-medium tracking-tight text-ink">Por mes</h2>
        <StatList rows={monthRows} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl font-medium tracking-tight text-ink">Por semana</h2>
        <StatList rows={weekRows} />
      </section>
    </main>
  );
}
