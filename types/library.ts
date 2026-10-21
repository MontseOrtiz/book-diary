// Filas de las vistas públicas del esquema v2 (docs/architecture/SCHEMA_PROPOSAL.md).
// Es lo único que un visitante puede leer (DEC-043).

export type ReadingStatus = "reading" | "finished" | "abandoned";
export type ReadingFormat = "fisico" | "kindle" | "ipad" | "audiolibro" | "otro";

export interface PublicBook {
  id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
  synopsis: string | null;
  genres: string[] | null;
  series_name: string | null;
  series_position: number | null;
}

export interface PublicReading {
  id: string;
  book_id: string;
  status: ReadingStatus;
  format: ReadingFormat;
  edition_label: string | null;
  started_year: number | null;
  started_month: number | null;
  started_day: number | null;
  finished_year: number | null;
  finished_month: number | null;
  finished_day: number | null;
  rating: number | null;
  review: string | null;
}

export interface PublicGoal {
  year: number;
  target_count: number;
}

export const FORMAT_LABELS: Record<ReadingFormat, string> = {
  fisico: "Físico",
  kindle: "Kindle",
  ipad: "iPad",
  audiolibro: "Audiolibro",
  otro: "Otro",
};

export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
