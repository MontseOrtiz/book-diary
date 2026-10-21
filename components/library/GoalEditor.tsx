"use client";

import { useState } from "react";
import { saveGoal } from "@/app/actions";

// El formulario de la meta se muestra solo al pedirlo, no ocupa espacio de entrada.
export function GoalEditor({ year, current }: { year: number; current: number | null }) {
  const [open, setOpen] = useState(false);

  async function submit(formData: FormData) {
    await saveGoal(formData);
    setOpen(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="btn-ghost inline-flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        {open ? "Cerrar" : current ? "Cambiar meta" : "Establecer meta"}
      </button>
      {open && (
        <form action={submit} className="flex items-end justify-center gap-2">
          <input type="hidden" name="year" value={year} />
          <label className="flex flex-col gap-1 text-sm">
            Meta {year}
            <input name="target_count" type="number" min={1} required autoFocus
              defaultValue={current ?? ""} className="field w-28" />
          </label>
          <button type="submit" className="btn-secondary">
            Guardar meta
          </button>
        </form>
      )}
    </div>
  );
}
