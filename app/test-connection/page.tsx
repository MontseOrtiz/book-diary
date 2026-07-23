import { supabase } from "@/lib/supabase";

export default async function TestConnectionPage() {
  const { data, error, count } = await supabase
    .from("books")
    .select("*", { count: "exact" });

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <p className="text-red-600">Error de conexión: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <p>
        Conectado! Libros encontrados: {count ?? data?.length ?? 0}
      </p>
    </main>
  );
}
