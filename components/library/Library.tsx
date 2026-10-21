import Link from "next/link";
import type { LibraryEntry, LibraryResult } from "@/lib/library";
import { selectYear } from "@/lib/library";
import { saveGoal } from "@/app/actions";
import { signOut } from "@/app/login/actions";
import { FORMAT_LABELS, MONTH_NAMES } from "@/types/library";

function formatPartialDate(year: number | null, month: number | null, day: number | null) {
  if (year === null) return null;
  if (month === null) return String(year);
  const monthName = MONTH_NAMES[month - 1].toLowerCase();
  return day === null ? `${monthName} de ${year}` : `${day} de ${monthName} de ${year}`;
}

function Entry({ entry, owner }: { entry: LibraryEntry; owner: boolean }) {
  const { reading, book } = entry;
  const finished = formatPartialDate(
    reading.finished_year,
    reading.finished_month,
    reading.finished_day,
  );
  return (
    <li className="card-surface flex flex-col gap-1 p-4">
      <p className="font-serif text-lg leading-snug">{book.title}</p>
      {book.author && <p className="text-sm text-ink-soft">{book.author}</p>}
      <p className="text-xs text-ink-soft">
        {FORMAT_LABELS[reading.format]}
        {finished && ` · ${finished}`}
        {reading.rating !== null && (
          <span aria-label={`Calificación ${reading.rating} de 5`}> · ★ {reading.rating}</span>
        )}
      </p>
      {reading.review && <p className="mt-1 text-sm">{reading.review}</p>}
      {owner && (
        <Link href={`/lectura/${reading.id}`} className="btn-ghost mt-2 self-start">
          Editar
        </Link>
      )}
    </li>
  );
}

function EntryList({ entries, owner }: { entries: LibraryEntry[]; owner: boolean }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <Entry key={entry.reading.id} entry={entry} owner={owner} />
      ))}
    </ul>
  );
}

function GoalRing({ completed, target }: { completed: number; target: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.min(1, completed / target);
  return (
    <div className="flex items-center gap-4">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
        <circle cx="36" cy="36" r={radius} fill="none" strokeWidth="6" className="stroke-surface-soft" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          transform="rotate(-90 36 36)"
          className="stroke-primary"
        />
      </svg>
      <p className="text-lg">
        {completed} de {target} libros
      </p>
    </div>
  );
}

export function Library({
  result,
  requestedYear,
  currentYear,
  owner,
}: {
  owner: boolean;
  result: LibraryResult;
  requestedYear: number | null;
  currentYear: number;
}) {
  if (!result.ok) {
    return <p role="alert">No se pudo cargar la biblioteca. Intenta de nuevo más tarde.</p>;
  }

  const view = selectYear(result.entries, result.goals, requestedYear, currentYear);

  return (
    <div className="flex flex-col gap-10">
      <nav aria-label="Año" className="flex gap-2 overflow-x-auto pb-1">
        {view.years.map((year) => (
          <Link
            key={year}
            href={`/?year=${year}#biblioteca`}
            aria-current={year === view.year ? "page" : undefined}
            className={
              year === view.year
                ? "btn-primary"
                : "btn-secondary"
            }
          >
            {year}
          </Link>
        ))}
      </nav>

      {owner && (
        <div className="flex items-center gap-4">
          <Link href="/libros/nuevo" className="btn-primary">
            Agregar libro
          </Link>
          <form action={signOut}>
            <button type="submit" className="btn-ghost">
              Salir
            </button>
          </form>
        </div>
      )}

      {view.goal ? (
        <GoalRing completed={view.completed} target={view.goal.target_count} />
      ) : (
        <p className="text-ink-soft">Sin meta establecida</p>
      )}
      {owner && (
        <form action={saveGoal} className="flex items-end gap-2">
          <input type="hidden" name="year" value={view.year} />
          <label className="flex flex-col gap-1 text-sm">
            Meta {view.year}
            <input name="target_count" type="number" min={1} defaultValue={view.goal?.target_count ?? ""}
              className="field w-28" />
          </label>
          <button type="submit" className="btn-secondary">
            Guardar meta
          </button>
        </form>
      )}

      <section aria-labelledby="leyendo">
        <h3 id="leyendo" className="mb-3 font-serif text-2xl">Actualmente leyendo</h3>
        {view.reading.length ? (
          <EntryList entries={view.reading} owner={owner} />
        ) : (
          <p className="text-sm text-ink-soft">Sin lecturas en curso.</p>
        )}
      </section>

      {view.months.map((entries, index) => (
        <section key={MONTH_NAMES[index]} aria-labelledby={`mes-${index}`}>
          <h3 id={`mes-${index}`} className="mb-3 font-serif text-2xl">{MONTH_NAMES[index]}</h3>
          {entries.length ? (
            <EntryList entries={entries} owner={owner} />
          ) : (
            <p className="text-sm text-ink-soft">
              <span aria-hidden="true">✿ </span>Sin lecturas este mes.
            </p>
          )}
        </section>
      ))}

      {view.noMonth.length > 0 && (
        <section aria-labelledby="sin-mes">
          <h3 id="sin-mes" className="mb-3 font-serif text-2xl">Sin mes registrado</h3>
          <EntryList entries={view.noMonth} owner={owner} />
        </section>
      )}

      {view.abandoned.length > 0 && (
        <section aria-labelledby="abandonados">
          <h3 id="abandonados" className="mb-3 font-serif text-2xl">Abandonados</h3>
          <EntryList entries={view.abandoned} owner={owner} />
        </section>
      )}
    </div>
  );
}
