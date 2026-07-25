"use client";

import { useState, type FormEvent } from "react";
import { PencilSimple } from "@phosphor-icons/react";
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
      <form onSubmit={handleSubmit} className="card-surface flex flex-col gap-3 p-4">
        <label className="font-serif text-base font-medium text-ink">
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
            className="input-field w-28"
          />
          <button type="submit" disabled={saving} className="btn-primary">
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
              className="btn-secondary"
            >
              Cancelar
            </button>
          )}
        </div>
        {errorMessage && <p className="text-xs text-error">{errorMessage}</p>}
      </form>
    );
  }

  const progress = Math.min(100, Math.round((finishedCount / goal.target_count) * 100));

  return (
    <div className="card-surface flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-serif text-base font-medium text-ink">
          Llevas {finishedCount} de {goal.target_count} libros este año
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="btn-ghost inline-flex items-center gap-1"
        >
          <PencilSimple size={14} weight="bold" />
          Editar meta
        </button>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-soft">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
