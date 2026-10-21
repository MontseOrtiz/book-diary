import Link from "next/link";

// Casi transparente: deja ver el hero detrás. Sin sesión, /libros/nuevo manda a /login
// y de ahí de vuelta al formulario.
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 h-16 bg-background/10 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-4xl">Book Diary</span>
          <span className="-mt-1 text-xs text-ink-soft">by Montse</span>
        </Link>
        <Link href="/libros/nuevo" className="btn-primary">
          Agregar libro
        </Link>
      </div>
    </header>
  );
}
