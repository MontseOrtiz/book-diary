import type { PartialDate } from "@/lib/partial-date";

export function DateFields({
  legend,
  prefix,
  defaults,
  hint,
}: {
  legend: string;
  prefix: "started" | "finished";
  defaults?: PartialDate;
  hint?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="mb-1 text-sm">{legend}</legend>
      <div className="flex gap-2">
        <input name={`${prefix}_year`} type="number" placeholder="Año" aria-label={`${legend}: año`}
          defaultValue={defaults?.year ?? ""} className="field w-24" />
        <input name={`${prefix}_month`} type="number" min={1} max={12} placeholder="Mes" aria-label={`${legend}: mes`}
          defaultValue={defaults?.month ?? ""} className="field w-20" />
        <input name={`${prefix}_day`} type="number" min={1} max={31} placeholder="Día" aria-label={`${legend}: día`}
          defaultValue={defaults?.day ?? ""} className="field w-20" />
      </div>
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </fieldset>
  );
}

export const RATING_OPTIONS = Array.from({ length: 10 }, (_, i) => (i + 1) / 2);

export function RatingSelect({ defaultValue }: { defaultValue?: number | null }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      Calificación (opcional)
      <select name="rating" defaultValue={defaultValue ?? ""} className="field w-40">
        <option value="">Sin calificar</option>
        {RATING_OPTIONS.map((value) => (
          <option key={value} value={value}>
            ★ {value}
          </option>
        ))}
      </select>
    </label>
  );
}

export const FORMAT_OPTIONS = [
  ["fisico", "Físico"],
  ["kindle", "Kindle"],
  ["ipad", "iPad"],
  ["audiolibro", "Audiolibro"],
  ["otro", "Otro"],
] as const;

export function FormatSelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      Formato
      <select name="format" defaultValue={defaultValue ?? "fisico"} className="field w-40">
        {FORMAT_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
