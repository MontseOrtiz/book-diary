import Link from "next/link";
import { LandingSequence } from "@/components/landing/LandingSequence";
import { Library } from "@/components/library/Library";
import { isOwner } from "@/lib/auth/owner";
import { loadLibrary } from "@/lib/library";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year } = await searchParams;
  const parsed = Number(year);
  const requestedYear = Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  const [result, owner] = await Promise.all([loadLibrary(), isOwner()]);

  return (
    <>
      <a
        href="#biblioteca"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2"
      >
        Saltar a la biblioteca
      </a>
      <LandingSequence />
      <main id="biblioteca" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-24">
        <h2 className="mb-8 text-center font-serif text-4xl">Mis años de lectura</h2>
        <Library
          owner={owner}
          result={result}
          requestedYear={requestedYear}
          currentYear={new Date().getFullYear()}
        />
        {!owner && (
          <Link href="/login" className="btn-ghost mt-12 inline-block">
            Entrar
          </Link>
        )}
      </main>
    </>
  );
}
