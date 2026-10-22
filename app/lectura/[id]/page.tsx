import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { abandonReading, deleteReading, resumeReading } from "@/app/actions";
import { EditReadingForm, FinishForm, type EditData } from "@/components/owner/EditReadingForm";
import { isOwner } from "@/lib/auth/owner";
import { createClient } from "@/lib/supabase/server";

export default async function EditReadingPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isOwner())) redirect("/login");
  const { id } = await params;

  const supabase = await createClient();
  const { data: reading } = await supabase.from("readings").select("*").eq("id", id).is("deleted_at", null).single();
  if (!reading) notFound();
  const { data: book } = await supabase.from("books").select("*").eq("id", reading.book_id).single();
  if (!book) notFound();

  const data: EditData = { ...reading, title: book.title, author: book.author, cover_url: book.cover_url };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <Link href="/#biblioteca" className="btn-ghost self-start">
        ← Volver
      </Link>
      <h1 className="font-display text-5xl">Editar lectura</h1>
      <EditReadingForm data={data} />

      {reading.status === "reading" && (
        <>
          <FinishForm id={id} />
          <form action={abandonReading} className="flex max-w-lg flex-col gap-3">
            <input type="hidden" name="id" value={id} />
            <label className="flex flex-col gap-1 text-sm">
              Nota al abandonar (privada, opcional)
              <textarea name="note" rows={2} className="field" />
            </label>
            <button type="submit" className="btn-secondary self-start">
              Abandonar
            </button>
          </form>
        </>
      )}
      {reading.status === "abandoned" && (
        <form action={resumeReading}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="btn-secondary">
            Retomar lectura
          </button>
        </form>
      )}

      <form action={deleteReading} className="border-t border-ink-soft/15 pt-6">
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="btn-ghost text-error">
          Eliminar lectura
        </button>
        <p className="mt-1 text-xs text-ink-soft">Se oculta; se puede recuperar desde la base de datos.</p>
      </form>
    </main>
  );
}
