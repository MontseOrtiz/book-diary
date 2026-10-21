import Link from "next/link";
import { redirect } from "next/navigation";
import { NewReadingForm } from "@/components/owner/NewReadingForm";
import { isOwner } from "@/lib/auth/owner";
import { createClient } from "@/lib/supabase/server";

export default async function NewReadingPage() {
  if (!(await isOwner())) redirect("/login?next=/libros/nuevo");

  const supabase = await createClient();
  const { data: books } = await supabase.from("books").select("id, title, author").order("title");

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <Link href="/#biblioteca" className="btn-ghost self-start">
        ← Volver
      </Link>
      <h1 className="font-display text-5xl">Agregar libro</h1>
      <NewReadingForm books={books ?? []} />
    </main>
  );
}
