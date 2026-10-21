import Link from "next/link";
import type { LibraryResult } from "@/lib/library";
import { selectYear } from "@/lib/library";
import { saveGoal } from "@/app/actions";
import { signOut } from "@/app/login/actions";
import { LibraryTree } from "./LibraryTree";

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
