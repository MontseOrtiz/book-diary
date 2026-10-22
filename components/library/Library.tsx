import Link from "next/link";
import type { LibraryResult } from "@/lib/library";
import { selectYear } from "@/lib/library";
import { signOut } from "@/app/login/actions";
import { GoalEditor } from "./GoalEditor";
import { LibraryTree } from "./LibraryTree";

function GoalIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-primary">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function GoalBox({ year, completed, target }: { year: number; completed: number; target: number | null }) {
  const percent = target ? Math.min(100, Math.round((completed / target) * 100)) : 0;
  return (
    <div className="inline-flex w-[80vw] items-center gap-4 rounded-xl border border-solid border-ink-soft/40 bg-surface px-5 py-3">
      <GoalIcon />
      <div className="flex flex-col">
        <span className="text-sm font-medium">Meta {year}</span>
        <span className="text-sm text-ink-soft">
          {target ? `${completed} de ${target} libros` : "Sin meta establecida"}
        </span>
      </div>
      {target && (
        <div
          role="progressbar"
          aria-label={`Progreso de la meta ${year}`}
          aria-valuemin={0}
          aria-valuemax={target}
          aria-valuenow={Math.min(completed, target)}
          className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-soft"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
      )}
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
      <nav aria-label="Año" className="flex max-w-full justify-center">
        <div className="inline-flex max-w-full overflow-x-auto rounded-xl border border-primary/25 bg-surface">
          {view.years.map((year) => (
            <Link
              key={year}
              href={`/?year=${year}#biblioteca`}
              aria-current={year === view.year ? "page" : undefined}
              className={`px-5 py-2.5 text-center text-sm font-medium transition-colors not-first:border-l not-first:border-primary/25 ${
                year === view.year ? "bg-primary text-surface" : "text-ink hover:bg-surface-soft"
              }`}
            >
              {year}
            </Link>
          ))}
        </div>
      </nav>

      <div className="flex justify-center">
        <GoalBox year={view.year} completed={view.completed} target={view.goal?.target_count ?? null} />
      </div>
      {owner && <GoalEditor year={view.year} current={view.goal?.target_count ?? null} />}

      {owner && (
        <div className="flex items-center justify-center gap-4">
          <form action={signOut}>
            <button type="submit" className="btn-ghost">
              Salir
            </button>
          </form>
        </div>
      )}

      <LibraryTree
        key={view.year}
        reading={view.reading}
        months={view.months}
        noMonth={view.noMonth}
        abandoned={view.abandoned}
        owner={owner}
      />
    </div>
  );
}
