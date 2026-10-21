// Fechas parciales (DEC-005): año, mes/año o fecha completa. Nada se inventa.

export interface PartialDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

function num(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const parsed = Number(text);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

export function readPartialDate(formData: FormData, prefix: string): PartialDate {
  return {
    year: num(formData.get(`${prefix}_year`)),
    month: num(formData.get(`${prefix}_month`)),
    day: num(formData.get(`${prefix}_day`)),
  };
}

export function todayParts(now = new Date()): PartialDate {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

const precision = (d: PartialDate) => (d.year === null ? 0 : d.month === null ? 1 : d.day === null ? 2 : 3);
const parts = (d: PartialDate) => [d.year, d.month, d.day] as number[];

/** Devuelve un mensaje de error, o null si la fecha es válida (DEC-044). */
export function validatePartialDate(d: PartialDate, label: string, today: PartialDate): string | null {
  const values = [d.year, d.month, d.day];
  if (values.some((v) => v !== null && Number.isNaN(v))) return `${label}: usa solo números.`;
  if (d.day !== null && d.month === null) return `${label}: el día requiere mes.`;
  if (d.month !== null && d.year === null) return `${label}: el mes requiere año.`;
  if (d.year === null) return null;
  if (d.year < 1000 || d.year > 9999) return `${label}: año no válido.`;
  if (d.month !== null && (d.month < 1 || d.month > 12)) return `${label}: mes no válido.`;
  if (d.month !== null && d.day !== null) {
    const date = new Date(Date.UTC(d.year, d.month - 1, d.day));
    if (date.getUTCMonth() !== d.month - 1 || date.getUTCDate() !== d.day) {
      return `${label}: esa fecha no existe.`;
    }
  }
  const level = precision(d);
  const a = parts(d).slice(0, level);
  const b = parts(today).slice(0, level);
  for (let i = 0; i < level; i++) {
    if (a[i] > b[i]) return `${label}: no puede ser una fecha futura.`;
    if (a[i] < b[i]) break;
  }
  return null;
}

/** El fin no puede ser anterior al inicio, al nivel de precisión más grueso de ambos. */
export function endsBeforeStart(start: PartialDate, end: PartialDate): boolean {
  const level = Math.min(precision(start), precision(end));
  const s = parts(start).slice(0, level);
  const e = parts(end).slice(0, level);
  for (let i = 0; i < level; i++) {
    if (e[i] < s[i]) return true;
    if (e[i] > s[i]) return false;
  }
  return false;
}

export function normalizeKey(title: string, author: string): string {
  const clean = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  return `${clean(title)}|${clean(author)}`;
}
