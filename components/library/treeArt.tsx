import Image from "next/image";

export const ROW = 150;
export const GAP = 14;

/** Árbol ilustrado detrás de las repisas; se estira al alto de la biblioteca. Solo escritorio. */
export function TreeArt() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden justify-center md:flex">
      <Image
        src="/landing/tree_base.png"
        alt=""
        width={1254}
        height={1254}
        sizes="1152px"
        className="h-full w-full max-w-[1100px] object-fill"
      />
    </div>
  );
}
