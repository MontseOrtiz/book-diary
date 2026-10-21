import Link from "next/link";
import type { LibraryResult } from "@/lib/library";
import { selectYear } from "@/lib/library";
import { saveGoal } from "@/app/actions";
import { signOut } from "@/app/login/actions";
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
    <div className="mx-auto inline-flex items-center gap-4 rounded-xl border border-solid border-ink-soft/40 bg-surface px-5 py-3">
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
          className="h-2.5 w-32 overflow-hidden rounded-full bg-surface-soft sm:w-48"
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
      <nav aria-label="Año" className="flex justify-center gap-2 overflow-x-auto pb-1">
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

      <div className="flex justify-center">
        <GoalBox year={view.year} completed={view.completed} target={view.goal?.target_count ?? null} />
      </div>
      {owner && (
        <form action={saveGoal} className="flex items-end justify-center gap-2">
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

      {owner && (
        <div className="flex items-center justify-center gap-4">
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
