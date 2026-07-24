import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BOOK_STATUS_LABELS, type Book, type BookStatus } from "@/types/database";

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
      <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
        {book.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
            {book.title}
          </div>
        )}
      </div>
      <div>
        <p className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {book.title}
        </p>
        <p className="line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
          {book.author ?? "Autor desconocido"}
        </p>
      </div>
    </Link>
  );
}

function BookSection({ label, books }: { label: string; books: Book[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {label}
      </h2>

      {books.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
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
  const { data: books, error } = await supabase.from("books").select("*");

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          Error al cargar tus libros: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mi diario de lectura
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Todo lo que quieres leer, estás leyendo y ya terminaste.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/start-reading"
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Tomar foto y empezar a leer
          </Link>
          <Link
            href="/add"
            className="rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Agregar a mi lista
          </Link>
        </div>
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
