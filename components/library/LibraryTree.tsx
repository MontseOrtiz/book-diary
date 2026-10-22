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

const DECOR_ICONS = [
  "/landing/Bunny-Icon.png",
  "/landing/Watercolor-Globe-Icon.png",
  "/landing/ceramic-bouquete-icon.png",
  "/landing/portrait-icon.png",
];
// Con más libros que esto la repisa ya está llena y el adorno estorba.
const DECOR_MAX_BOOKS = 3;

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
    <div className="flex shrink-0 items-end" style={{ height: ROW }}>
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
  selectedId,
  onSelect,
}: {
  id: string;
  title: string;
  entries: LibraryEntry[];
  empty?: string;
  side?: "left" | "right" | "top";
  selectedId: string | null;
  onSelect: (entry: LibraryEntry, trigger: HTMLElement) => void;
}) {
  return (
    <section
      aria-labelledby={id}
      className={`min-w-0 ${side ? "shelf-art" : ""}`}
      data-shelf={side ? id : undefined}
      data-side={side}
      data-plank={side ? { left: "l", right: "r", top: "t" }[side] : undefined}
    >
      <h3 id={id} className="mb-2 font-serif text-xl">
        {title}
      </h3>
      <div
        data-books
        className={`${side ? "" : "shelf-planks"} flex flex-nowrap items-end gap-x-1 overflow-x-auto md:flex-wrap md:overflow-visible ${side ? SIDE_PADDING[side] : ""}`}
        style={{ rowGap: GAP, paddingBottom: side ? 56 : GAP, minHeight: ROW + GAP + (side ? 30 : 0) }}
      >
        {entries.length ? (
          entries.map((entry) => (
            <Spine
              key={entry.reading.id}
              entry={entry}
              selected={entry.reading.id === selectedId}
              onSelect={onSelect}
            />
          ))
        ) : (
          <p className="self-center pl-2 text-sm text-ink-soft">{empty ?? "Sin lecturas este mes."}</p>
        )}
        {side && entries.length <= DECOR_MAX_BOOKS && (
          <Image
            src={DECOR_ICONS[hash(id) % DECOR_ICONS.length]}
            alt=""
            aria-hidden="true"
            width={96}
            height={96}
            className="mx-2 h-20 w-20 shrink-0 self-end object-contain"
          />
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
  const monthShelf = (index: number, side: "left" | "right") => (
    <Shelf
      key={MONTH_NAMES[index]}
      id={`mes-${index}`}
      title={MONTH_NAMES[index]}
      entries={months[index]}
      side={side}
      selectedId={selectedId}
      onSelect={select}
    />
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="relative">
        <TreeArt />
        <div className="relative z-10 flex flex-col gap-10">
          <Shelf
            id="leyendo"
            title="Actualmente leyendo"
            entries={reading}
            empty="Sin lecturas en curso."
            side="top"
            selectedId={selectedId}
            onSelect={select}
          />

          <div data-grid className="grid gap-8 md:grid-cols-[1fr_64px_1fr]">
            <div className="flex flex-col gap-8">{[0, 1, 2, 3, 4, 5].map((i) => monthShelf(i, "left"))}</div>
            <div aria-hidden="true" className="hidden md:block" />
            <div className="flex flex-col gap-8">{[6, 7, 8, 9, 10, 11].map((i) => monthShelf(i, "right"))}</div>
          </div>
        </div>
        <div aria-hidden="true" className="hidden h-6 md:block" />
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
