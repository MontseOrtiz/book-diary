import { MONTH_NAMES } from "@/types/library";

export function formatPartialDate(year: number | null, month: number | null, day: number | null) {
  if (year === null) return null;
  if (month === null) return String(year);
  const monthName = MONTH_NAMES[month - 1].toLowerCase();
  return day === null ? `${monthName} de ${year}` : `${day} de ${monthName} de ${year}`;
}
