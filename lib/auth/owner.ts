import { createClient } from "@/lib/supabase/server";

// Solo para decidir qué mostrar. La autorización real de cada escritura la
// hacen la Server Action (requireOwner) y RLS.
export async function isOwner(): Promise<boolean> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;

  const { data, error } = await supabase.rpc("am_i_owner");
  return !error && data === true;
}

export async function requireOwner() {
  if (!(await isOwner())) {
    throw new Error("No autorizada");
  }
}
