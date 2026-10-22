"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GAP, ROW, TreeArt } from "./treeArt";
import type { LibraryEntry } from "@/lib/library";
import { formatPartialDate } from "@/lib/format";
import { FORMAT_LABELS, MONTH_NAMES } from "@/types/library";

const SPINE_COLORS = ["#7c4a57", "#4f6f56", "#8a5a44", "#4d647a", "#6b4f7a", "#9a4f55", "#6e6a4a"];

function hash(text: string) {
  let h = 0;
  for (const char of text) h = (h * 31 + char.charCodeAt(0)) >>> 0;
  return h;
}

// `drop` = margen transparente inferior de cada imagen (fracción de su alto), para que el
// objeto pise la repisa en vez de flotar sobre ella.
const DECOR_ICONS = [
  { src: "/landing/Bunny-Icon.png", drop: 0.117 },
  { src: "/landing/Watercolor-Globe-Icon.png", drop: 0.069 },
  { src: "/landing/ceramic-bouquete-icon.png", drop: 0.074 },
  { src: "/landing/portrait-icon.png", drop: 0.206 },
  { src: "/landing/Bookmark-icon.png", drop: 0.053 },
  { src: "/landing/Lantern-icon.png", drop: 0.061 },
];
const DECOR_SIZE = 96;
// Los libros y adornos se hunden un poco tras la cara de la rama, que va por delante.
const SINK = 6;

// Adornos por repisa: más cuando hay pocos libros, ninguno cuando ya está llena.
function decorCount(books: number) {
  if (books <= 2) return 2;
  if (books <= 5) return 1;
  return 0;
}

type Item = { kind: "book"; entry: LibraryEntry } | { kind: "decor"; icon: (typeof DECOR_ICONS)[number]; key: string };

/** Mezcla adornos entre los libros (al inicio, en medio o al final), estable por repisa. */
function withDecor(id: string, entries: LibraryEntry[], enabled: boolean): Item[] {
  const items: Item[] = entries.map((entry) => ({ kind: "book", entry }));
  if (!enabled) return items;
  let seed = hash(id);
  const next = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const icons = [...DECOR_ICONS];
  for (let i = 0; i < decorCount(entries.length) && icons.length; i++) {
    const icon = icons.splice(Math.floor(next() * icons.length), 1)[0];
    const slot = Math.floor(next() * (items.length + 1));
    items.splice(slot, 0, { kind: "decor", icon, key: `decor-${i}` });
  }
  return items;
}

interface Selection {
  entry: LibraryEntry;
  trigger: HTMLElement;
}

function Spine({
  entry,
  selected,
  onSelect,
}: {
  entry: LibraryEntry;
  selected: boolean;
  onSelect: (entry: LibraryEntry, trigger: HTMLElement) => void;
}) {
  const h = hash(entry.reading.id);
  const width = 30 + (h % 5) * 5;
  const height = 110 + ((h >>> 3) % 4) * 8;
  const color = SPINE_COLORS[(h >>> 6) % SPINE_COLORS.length];
  const label = entry.book.author ? `${entry.book.title}, ${entry.book.author}` : entry.book.title;

  return (
    <div className="flex shrink-0 items-end" style={{ height: ROW, transform: `translateY(${SINK}px)` }}>
      <button
        type="button"
        aria-pressed={selected}
        aria-label={label}
        onClick={(event) => onSelect(entry, event.currentTarget)}
        className={`relative overflow-hidden rounded-t-sm text-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-safe:transition-transform ${
          selected ? "-translate-y-3" : "hover:-translate-y-1"
        }`}
        style={{ width, height, backgroundColor: color }}
      >
        <span aria-hidden="true" className="absolute inset-x-0 top-2 h-1.5 bg-accent/80" />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-2 top-6 flex justify-center overflow-hidden text-[11px] leading-none"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="truncate">{entry.book.title}</span>
        </span>
      </button>
    </div>
  );
}

const SIDE_PADDING = {
  left: "pl-8 pr-14 md:pl-10 md:pr-[70px]",
  right: "pl-14 pr-8 md:pl-[70px] md:pr-10",
  top: "px-8 md:px-10",
} as const;

function Shelf({
  id,
  title,
  entries,
  empty,
  side,
  row,
  selectedId,
  onSelect,
}: {
  id: string;
  title: string;
  entries: LibraryEntry[];
  empty?: string;
  side?: "left" | "right" | "top";
  /** Fila de la cuadrícula en escritorio: Enero y Julio comparten fila, así sus ramas quedan alineadas. */
  row?: number;
  selectedId: string | null;
  onSelect: (entry: LibraryEntry, trigger: HTMLElement) => void;
}) {
  return (
    <section
      aria-labelledby={id}
      className={`min-w-0 ${side ? "shelf-art" : ""} ${
        side === "left" ? "md:col-start-1" : side === "right" ? "md:col-start-3" : ""
      } ${row ? "md:[grid-row-start:var(--row)]" : ""}`}
      style={row ? ({ "--row": row } as React.CSSProperties) : undefined}
      data-shelf={side ? id : undefined}
      data-side={side}
      data-plank={side ? { left: "l", right: "r", top: "t" }[side] : undefined}
    >
      <h3 id={id} className={`mb-2 h-7 ${side === "right" ? "text-right" : ""}`}>
        <span className="month-sign">{title}</span>
      </h3>
      <div
        data-books
        className={`${side ? "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "shelf-planks"} flex flex-nowrap items-end gap-x-1 overflow-x-auto md:flex-wrap md:overflow-visible ${side ? SIDE_PADDING[side] : ""}`}
        style={{ rowGap: GAP, paddingBottom: side ? 56 : GAP, minHeight: ROW + GAP + (side ? 30 : 0) }}
      >
        {!entries.length && (
          <p className="shrink-0 self-center whitespace-nowrap pl-2 text-xs text-ink-soft md:text-sm">
            {empty ?? "Sin lecturas este mes."}
          </p>
        )}
        {withDecor(id, entries, Boolean(side)).map((item) =>
          item.kind === "book" ? (
            <Spine
              key={item.entry.reading.id}
              entry={item.entry}
              selected={item.entry.reading.id === selectedId}
              onSelect={onSelect}
            />
          ) : (
            <Image
              key={item.key}
              src={item.icon.src}
              alt=""
              aria-hidden="true"
              width={DECOR_SIZE}
              height={DECOR_SIZE}
              className={`mx-1 shrink-0 self-end object-contain ${item.key !== "decor-0" && !entries.length ? "max-md:hidden" : ""}`}
              style={{ width: DECOR_SIZE, height: DECOR_SIZE, transform: `translateY(${Math.round(item.icon.drop * DECOR_SIZE) + SINK}px)` }}
            />
          ),
        )}
      </div>
    </section>
  );
}

function DetailPanel({
  selection,
  owner,
  onClose,
}: {
  selection: Selection;
  owner: boolean;
  onClose: () => void;
}) {
  const { reading, book } = selection.entry;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const finished = formatPartialDate(reading.finished_year, reading.finished_month, reading.finished_day);
  const started = formatPartialDate(reading.started_year, reading.started_month, reading.started_day);

  useEffect(() => {
    headingRef.current?.focus();
  }, [reading.id]);

  return (
    <aside
      role="dialog"
      aria-label={`Detalle de ${book.title}`}
      className="fixed inset-x-0 bottom-0 z-40 max-h-[75vh] overflow-y-auto rounded-t-2xl border border-ink-soft/15 bg-surface p-5 shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[380px] md:rounded-none md:rounded-l-2xl"
    >
      <button type="button" onClick={onClose} className="btn-ghost absolute right-4 top-4">
        Cerrar
      </button>
      <div key={reading.id} className="cover-in mx-auto mb-4 mt-6 w-32">
        {book.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.cover_url} alt={`Portada de ${book.title}`} className="w-full rounded shadow-lg" />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-44 items-center justify-center rounded bg-primary p-2 text-center font-serif text-sm text-surface shadow-lg"
          >
            {book.title}
          </div>
        )}
      </div>
      <h2 ref={headingRef} tabIndex={-1} className="font-serif text-2xl outline-none">
        {book.title}
      </h2>
      {book.author && <p className="text-ink-soft">{book.author}</p>}
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-ink-soft">Formato</dt>
        <dd>{FORMAT_LABELS[reading.format]}</dd>
        {started && (
          <>
            <dt className="text-ink-soft">Inicio</dt>
            <dd>{started}</dd>
          </>
        )}
        {finished && (
          <>
            <dt className="text-ink-soft">Fin</dt>
            <dd>{finished}</dd>
          </>
        )}
        {reading.rating !== null && (
          <>
            <dt className="text-ink-soft">Calificación</dt>
            <dd aria-label={`${reading.rating} de 5`}>★ {reading.rating}</dd>
          </>
        )}
      </dl>
      {reading.review && <p className="mt-4 text-sm">{reading.review}</p>}
      {book.synopsis && <p className="mt-4 line-clamp-6 text-sm text-ink-soft">{book.synopsis}</p>}
      {book.genres && book.genres.length > 0 && (
        <p className="mt-3 text-xs text-ink-soft">{book.genres.join(" · ")}</p>
      )}
      {owner && (
        <Link href={`/lectura/${reading.id}`} className="btn-secondary mt-6">
          Editar
        </Link>
      )}
    </aside>
  );
}

export function LibraryTree({
  reading,
  months,
  noMonth,
  abandoned,
  owner,
}: {
  reading: LibraryEntry[];
  months: LibraryEntry[][];
  noMonth: LibraryEntry[];
  abandoned: LibraryEntry[];
  owner: boolean;
}) {
  const [selection, setSelection] = useState<Selection | null>(null);

  function select(entry: LibraryEntry, trigger: HTMLElement) {
    setSelection(
      selection?.entry.reading.id === entry.reading.id ? null : { entry, trigger },
    );
  }

  function close() {
    selection?.trigger.focus();
    setSelection(null);
  }

  useEffect(() => {
    if (!selection) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        selection?.trigger.focus();
        setSelection(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selection]);

  const selectedId = selection?.entry.reading.id ?? null;
  const monthShelf = (index: number, side: "left" | "right", row: number) => (
    <Shelf
      key={MONTH_NAMES[index]}
      id={`mes-${index}`}
      title={MONTH_NAMES[index]}
      entries={months[index]}
      side={side}
      row={row}
      selectedId={selectedId}
      onSelect={select}
    />
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="relative isolate">
        <TreeArt />
        <div className="flex flex-col gap-10">
          <Shelf
            id="leyendo"
            title="Actualmente leyendo"
            entries={reading}
            empty="Sin lecturas en curso."
            side="top"
            selectedId={selectedId}
            onSelect={select}
          />

          <div data-grid className="grid gap-x-0 gap-y-8 md:grid-cols-[1fr_24px_1fr]">
            {[0, 1, 2, 3, 4, 5].map((i) => monthShelf(i, "left", i + 1))}
            {[6, 7, 8, 9, 10, 11].map((i) => monthShelf(i, "right", i - 5))}
          </div>
        </div>
        <div aria-hidden="true" className="hidden h-16 md:block" />
      </div>

      {noMonth.length > 0 && (
        <Shelf id="sin-mes" title="Sin mes registrado" entries={noMonth} selectedId={selectedId} onSelect={select} />
      )}
      {abandoned.length > 0 && (
        <Shelf id="abandonados" title="Abandonados" entries={abandoned} selectedId={selectedId} onSelect={select} />
      )}

      {selection && <DetailPanel selection={selection} owner={owner} onClose={close} />}
    </div>
  );
}
