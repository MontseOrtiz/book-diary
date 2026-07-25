"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { ReadingGoal } from "@/types/database";

export function ReadingGoalCard({
  year,
  initialGoal,
  finishedCount,
}: {
  year: number;
  initialGoal: ReadingGoal | null;
  finishedCount: number;
}) {
  const [goal, setGoal] = useState<ReadingGoal | null>(initialGoal);
  const [editing, setEditing] = useState(false);
  const [targetInput, setTargetInput] = useState(
    initialGoal ? String(initialGoal.target_count) : ""
  );
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const targetCount = Number(targetInput);
    if (!Number.isInteger(targetCount) || targetCount <= 0) {
      setErrorMessage("Ingresa un número entero mayor a cero.");
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    if (goal) {
      const { data, error } = await supabase
        .from("reading_goals")
        .update({ target_count: targetCount })
        .eq("id", goal.id)
        .select()
        .single();

      setSaving(false);

      if (error) {
        setErrorMessage("Error al actualizar la meta. Inténtalo de nuevo.");
        return;
      }

      setGoal(data);
      setEditing(false);
      return;
    }

    const { data, error } = await supabase
      .from("reading_goals")
      .insert({ year, target_count: targetCount })
      .select()
      .single();

    setSaving(false);

    if (error) {
      setErrorMessage("Error al guardar la meta. Inténtalo de nuevo.");
      return;
    }

    setGoal(data);
    setEditing(false);
  }

  if (!goal || editing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {goal
            ? `Editar meta de lectura para ${year}`
            : `¿Cuál es tu meta de lectura para ${year}?`}
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            type="number"
            min={1}
            step={1}
            value={targetInput}
            onChange={(event) => setTargetInput(event.target.value)}
            placeholder="Ej. 25"
            className="w-28 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {saving ? "Guardando..." : "Guardar meta"}
          </button>
          {goal && (
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setTargetInput(String(goal.target_count));
                setErrorMessage(null);
              }}
              className="rounded-lg border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
          )}
        </div>
        {errorMessage && (
          <p className="text-xs text-red-700 dark:text-red-400">{errorMessage}</p>
        )}
      </form>
    );
  }

  const progress = Math.min(100, Math.round((finishedCount / goal.target_count) * 100));

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Llevas {finishedCount} de {goal.target_count} libros este año
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Editar meta
        </button>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
