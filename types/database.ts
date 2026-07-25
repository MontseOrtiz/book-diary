export type BookStatus = "quiero_leer" | "leyendo" | "terminado";

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string;
          title: string;
          author: string | null;
          cover_image_url: string | null;
          open_library_id: string | null;
          status: BookStatus;
          start_date: string | null;
          finish_date: string | null;
          last_updated_at: string;
          rating: number | null;
          would_recommend: boolean | null;
          would_reread: boolean | null;
          engagement: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author?: string | null;
          cover_image_url?: string | null;
          open_library_id?: string | null;
          status?: BookStatus;
          start_date?: string | null;
          finish_date?: string | null;
          last_updated_at?: string;
          rating?: number | null;
          would_recommend?: boolean | null;
          would_reread?: boolean | null;
          engagement?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string | null;
          cover_image_url?: string | null;
          open_library_id?: string | null;
          status?: BookStatus;
          start_date?: string | null;
          finish_date?: string | null;
          last_updated_at?: string;
          rating?: number | null;
          would_recommend?: boolean | null;
          would_reread?: boolean | null;
          engagement?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reading_goals: {
        Row: {
          id: string;
          year: number;
          target_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          year: number;
          target_count: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          year?: number;
          target_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type Book = Database["public"]["Tables"]["books"]["Row"];
export type ReadingGoal = Database["public"]["Tables"]["reading_goals"]["Row"];

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  quiero_leer: "Quiero leer",
  leyendo: "Leyendo",
  terminado: "Terminado",
};
