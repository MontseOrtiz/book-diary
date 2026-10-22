export const ROW = 150;
export const GAP = 14;

/** Tronco ilustrado detrás de las repisas (solo escritorio). Copa y base conservan su forma;
 *  el tramo liso del medio se estira, así que el árbol crece con el contenido. */
export function TreeArt() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-16 top-[96px] z-[2] hidden justify-center md:flex"
    >
      <div className="flex h-full w-[640px] max-w-none shrink-0 flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/tree/trunk-top.webp" alt="" className="block h-auto w-full" />
        <div
          className="-my-px min-h-0 flex-1 bg-[url(/tree/trunk-mid.webp)] bg-[length:100%_100%]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/tree/trunk-bottom.webp" alt="" className="block h-auto w-full" />
      </div>
    </div>
  );
}
