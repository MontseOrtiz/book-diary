import Link from "next/link";
import { Camera, Plus, ChartBar } from "@phosphor-icons/react/dist/ssr";
import { supabase } from "@/lib/supabase";
import { BOOK_STATUS_LABELS, type Book, type BookStatus } from "@/types/database";
import { ReadingGoalCard } from "@/components/ReadingGoalCard";
import { HeroBookStage } from "@/components/HeroBookStage";

export const dynamic = "force-dynamic";

const SECTION_ORDER: BookStatus[] = ["quiero_leer", "leyendo", "terminado"];

function toTime(value: string | null): number {
  return value ? new Date(value).getTime() : 0;
}

function booksForSection(status: BookStatus, books: Book[]): Book[] {
  const filtered = books.filter((book) => book.status === status);

  if (status === "leyendo") {
    return filtered.sort((a, b) => toTime(b.last_updated_at) - toTime(a.last_updated_at));
  }
  if (status === "terminado") {
    return filtered.sort((a, b) => toTime(b.finish_date) - toTime(a.finish_date));
  }
  return filtered.sort((a, b) => toTime(b.created_at) - toTime(a.created_at));
}

function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/book/${book.id}`} className="group flex flex-col gap-2">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-surface-soft shadow-sm">
        {book.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-2 text-center font-serif text-xs text-ink-soft">
            {book.title}
          </div>
        )}
      </div>
      <div>
        <p className="line-clamp-2 font-serif text-sm font-medium text-ink">{book.title}</p>
        <p className="line-clamp-1 text-xs text-ink-soft">
          {book.author ?? "Autor desconocido"}
        </p>
      </div>
    </Link>
  );
}

function BookSection({ label, books }: { label: string; books: Book[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-xl font-medium tracking-tight text-ink">{label}</h2>

      {books.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-soft/25 bg-surface-soft/50 px-4 py-6 text-center text-sm text-ink-soft">
          Aún no tienes libros aquí.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function Home() {
  const currentYear = new Date().getFullYear();

  const [{ data: books, error }, { data: goal }] = await Promise.all([
    supabase.from("books").select("*"),
    supabase.from("reading_goals").select("*").eq("year", currentYear).maybeSingle(),
  ]);

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
        <p className="alert-error">Error al cargar tus libros: {error.message}</p>
      </main>
    );
  }

  const finishedThisYear = (books ?? []).filter(
    (book) =>
      book.status === "terminado" &&
      book.finish_date !== null &&
      new Date(book.finish_date).getFullYear() === currentYear
  ).length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-14 px-6 py-12">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-ink">
              Mi diario de lectura
            </h1>
            <p className="mt-2 text-base text-ink-soft">
              Todo lo que quieres leer, estás leyendo y ya terminaste.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/start-reading" className="btn-primary">
              <Camera size={18} weight="bold" />
              Tomar foto y empezar a leer
            </Link>
            <Link href="/add" className="btn-secondary">
              <Plus size={18} weight="bold" />
              Agregar a mi lista
            </Link>
          </div>

          <ReadingGoalCard
            year={currentYear}
            initialGoal={goal ?? null}
            finishedCount={finishedThisYear}
          />

          <Link
            href="/estadisticas"
            className="btn-ghost inline-flex w-fit items-center gap-1.5 no-underline"
          >
            <ChartBar size={16} weight="bold" />
            <span className="underline underline-offset-2">Ver estadísticas completas</span>
          </Link>
        </div>

        <HeroBookStage />
      </div>

      <div className="flex flex-col gap-10">
        {SECTION_ORDER.map((status) => (
          <BookSection
            key={status}
            label={BOOK_STATUS_LABELS[status]}
            books={booksForSection(status, books ?? [])}
          />
        ))}
      </div>
    </main>
  );
}
