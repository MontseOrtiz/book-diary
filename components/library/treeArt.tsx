"use client";

import { useEffect, useState, type RefObject } from "react";

export const ROW = 150;
export const GAP = 14;

type Pt = [number, number];

const BARK = "#5b4038";
const BARK_DARK = "#4a332d";
const BARK_LIGHT = "#7a5a4d";
const LEAVES = ["#6b8f71", "#7fa98c", "#4f6f56", "#93b79b"];
const PINKS = ["#f2c4d0", "#f7d6df", "#e9a7ba", "#fbe3ea"];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
function smooth(a: number, b: number, x: number) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(text: string) {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

const fmt = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

/** Polígono que sigue una curva y se afina de w0 a w1: da forma de rama real. */
function taper(points: Pt[], w0: number, w1: number): string {
  const n = points.length;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(n - 1, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    const w = lerp(w0, w1, Math.pow(i / (n - 1), 0.8)) / 2;
    left.push([points[i][0] - (dy / len) * w, points[i][1] + (dx / len) * w]);
    right.push([points[i][0] + (dy / len) * w, points[i][1] - (dx / len) * w]);
  }
  return `M${[...left, ...right.reverse()].map(fmt).join("L")}Z`;
}

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, n = 28): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return out;
}

/** Rama que sale del tronco, sube a la repisa (y), la recorre y remata con un rizo hacia arriba. */
function limb(startX: number, startY: number, tipX: number, y: number, curl: number): Pt[] {
  const pts: Pt[] = [];
  const n = 44;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const rise = (1 - smooth(0, 0.3, t)) * (startY - y);
    const wave = Math.sin(t * Math.PI * 2.4) * 2.5 * (1 - t * 0.5);
    const up = t > 0.82 ? Math.pow((t - 0.82) / 0.18, 2) * curl : 0;
    pts.push([lerp(startX, tipX, t), y + rise + wave - up]);
  }
  return pts;
}

interface Piece {
  key: string;
  node: React.ReactNode;
}

function leaf(key: string, x: number, y: number, angle: number, size: number, color: string): Piece {
  return {
    key,
    node: (
      <path
        d="M0 0C4-7 12-8 20 0C12 8 4 7 0 0Z"
        fill={color}
        transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(0)}) scale(${size.toFixed(2)})`}
      />
    ),
  };
}

function blossom(key: string, x: number, y: number, r: number, rand: () => number): Piece {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return (
      <circle
        key={i}
        cx={x + Math.cos(a) * r * 0.85}
        cy={y + Math.sin(a) * r * 0.85}
        r={r}
        fill={PINKS[Math.floor(rand() * PINKS.length)]}
      />
    );
  });
  return {
    key,
    node: (
      <g>
        {petals}
        <circle cx={x} cy={y} r={r * 0.3} fill="#d4a24e" />
      </g>
    ),
  };
}

/** Hojas y flores en la punta de una rama. */
function tipCluster(id: string, x: number, y: number, rand: () => number, dir: number): Piece[] {
  const out: Piece[] = [];
  for (let i = 0; i < 9; i++) {
    const angle = -90 + (rand() - 0.5) * 200 + (dir < 0 ? 0 : 0);
    out.push(
      leaf(
        `${id}-l${i}`,
        x + (rand() - 0.5) * 10,
        y + (rand() - 0.5) * 10,
        angle,
        0.9 + rand() * 0.7,
        LEAVES[Math.floor(rand() * LEAVES.length)],
      ),
    );
  }
  for (let i = 0; i < 3; i++) {
    out.push(blossom(`${id}-b${i}`, x + (rand() - 0.5) * 34, y - 4 + (rand() - 0.5) * 28, 5 + rand() * 3, rand));
  }
  return out;
}

export interface ShelfGeo {
  id: string;
  side: "left" | "right" | "top";
  innerX: number;
  outerX: number;
  rowYs: number[];
}

export interface TreeGeo {
  width: number;
  height: number;
  cx: number;
  trunkTop: number;
  trunkBottom: number;
  shelves: ShelfGeo[];
}

function measure(wrapper: HTMLElement): TreeGeo | null {
  const box = wrapper.getBoundingClientRect();
  const grid = wrapper.querySelector<HTMLElement>("[data-grid]");
  if (!grid) return null;
  const gridBox = grid.getBoundingClientRect();

  const shelves: ShelfGeo[] = [];
  wrapper.querySelectorAll<HTMLElement>("[data-shelf]").forEach((el) => {
    const side = el.dataset.side as ShelfGeo["side"];
    const books = el.querySelector<HTMLElement>("[data-books]");
    if (!books) return;
    const r = books.getBoundingClientRect();
    const rows = Math.max(1, Math.round(r.height / (ROW + GAP)));
    const left = r.left - box.left;
    const right = r.right - box.left;
    shelves.push({
      id: el.dataset.shelf ?? "",
      side,
      innerX: side === "left" ? right : left,
      // La punta queda un poco dentro de la repisa para que sus hojas no se corten.
      outerX: side === "left" ? left + 34 : right - 34,
      rowYs: Array.from({ length: rows }, (_, i) => r.top - box.top + i * (ROW + GAP) + ROW + GAP / 2),
    });
  });
  const top = shelves.find((s) => s.side === "top");
  if (!top) return null;

  return {
    width: box.width,
    height: box.height,
    cx: box.width / 2,
    trunkTop: top.rowYs[0],
    trunkBottom: gridBox.bottom - box.top,
    shelves,
  };
}

function trunkCenter(cx: number, y: number) {
  return cx + Math.sin(y * 0.011) * 7;
}

function renderTree(geo: TreeGeo) {
  const { cx, trunkTop, trunkBottom, shelves } = geo;
  const paths: React.ReactNode[] = [];
  const pieces: Piece[] = [];

  // --- Tronco ---
  const left: Pt[] = [];
  const right: Pt[] = [];
  const span = trunkBottom - trunkTop;
  for (let y = trunkTop - 4; y <= trunkBottom; y += 10) {
    const t = clamp((y - trunkTop) / span, 0, 1);
    const w = lerp(34, 50, t) + smooth(trunkBottom - 90, trunkBottom, y) * 44;
    const c = trunkCenter(cx, y);
    left.push([c - w / 2, y]);
    right.push([c + w / 2, y]);
  }
  const bottomL = left[left.length - 1];
  const bottomR = right[right.length - 1];
  const cap: Pt[] = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    return [lerp(bottomR[0], bottomL[0], t), bottomR[1] + Math.sin(t * Math.PI) * 12];
  });
  paths.push(
    <path key="trunk" d={`M${[...left, ...cap, ...right.reverse().slice(1)].map(fmt).join("L")}Z`} fill="url(#bark)" />,
  );
  for (const f of [-0.32, -0.1, 0.14, 0.33]) {
    const line: Pt[] = [];
    for (let y = trunkTop; y <= trunkBottom; y += 14) {
      const t = clamp((y - trunkTop) / span, 0, 1);
      line.push([trunkCenter(cx, y) + f * lerp(34, 50, t), y + Math.sin(y * 0.05 + f * 9) * 2]);
    }
    paths.push(
      <polyline
        key={`bark${f}`}
        points={line.map(fmt).join(" ")}
        fill="none"
        stroke={BARK_LIGHT}
        strokeOpacity="0.45"
        strokeWidth="1.6"
        strokeLinecap="round"
      />,
    );
  }

  // --- Ramas ---
  for (const shelf of shelves) {
    const rand = rng(hashString(shelf.id));

    if (shelf.side === "top") {
      for (const [dir, tipX] of [[-1, shelf.outerX], [1, shelf.innerX]] as const) {
        void tipX;
        const tx = dir < 0 ? shelf.innerX + 34 : shelf.outerX;
        shelf.rowYs.forEach((y, r) => {
          const pts = limb(cx, y, tx, y, r === 0 ? 30 : 20);
          paths.push(
            <path key={`top${dir}${r}`} d={taper(pts, r === 0 ? 20 : 14, 3)} fill={BARK} stroke={BARK_DARK} strokeWidth="0.6" />,
          );
          const tip = pts[pts.length - 1];
          pieces.push(...tipCluster(`top${dir}${r}`, tip[0], tip[1], rand, dir));
          for (let i = 0; i < 6; i++) {
            const p = pts[Math.floor(pts.length * (0.3 + i * 0.1))];
            pieces.push(leaf(`top${dir}${r}-s${i}`, p[0], p[1] + 9 + rand() * 6, 70 + rand() * 40, 0.7 + rand() * 0.4, LEAVES[i % 4]));
          }
        });
      }
      continue;
    }

    const dir = shelf.side === "left" ? -1 : 1;
    const lastY = shelf.rowYs[shelf.rowYs.length - 1];
    // Cada hilera es una rama propia que nace del tronco.
    let main: Pt[] = [];
    shelf.rowYs.forEach((y, r) => {
      const startX = trunkCenter(cx, y + 60) + dir * 8;
      const pts = limb(startX, y + 64, shelf.outerX, y, 34);
      paths.push(
        <path key={`m-${shelf.id}-${r}`} d={taper(pts, 17, 3)} fill={BARK} stroke={BARK_DARK} strokeWidth="0.6" />,
      );
      if (y === lastY) main = pts;
      else {
        const tip = pts[pts.length - 1];
        pieces.push(...tipCluster(`${shelf.id}-r${r}`, tip[0], tip[1], rand, dir));
      }
    });

    // Ramitas hacia abajo con hojas (el espacio sobre la repisa es de los libros).
    for (const t of [0.42, 0.68]) {
      const p = main[Math.floor(main.length * t)];
      const twig = bezier(p, [p[0] + dir * 8, p[1] + 10], [p[0] + dir * 18, p[1] + 20], [p[0] + dir * 28, p[1] + 26 + rand() * 8], 10);
      paths.push(<path key={`t-${shelf.id}-${t}`} d={taper(twig, 4, 1)} fill={BARK} />);
      const end = twig[twig.length - 1];
      for (let i = 0; i < 3; i++) {
        pieces.push(leaf(`${shelf.id}-tw${t}-${i}`, end[0], end[1], 20 + i * 50 + rand() * 20 + (dir < 0 ? 100 : 0), 0.8 + rand() * 0.4, LEAVES[Math.floor(rand() * 4)]));
      }
    }
    for (let i = 0; i < 5; i++) {
      const p = main[Math.floor(main.length * (0.25 + i * 0.12))];
      pieces.push(leaf(`${shelf.id}-s${i}`, p[0], p[1] + 8, 80 + rand() * 30, 0.6 + rand() * 0.4, LEAVES[i % 4]));
    }
    const tip = main[main.length - 1];
    pieces.push(...tipCluster(shelf.id, tip[0], tip[1], rand, dir));
  }

  return (
    <>
      {paths}
      {pieces.map((p) => (
        <g key={p.key}>{p.node}</g>
      ))}
    </>
  );
}

/** Dibujo del árbol detrás de las repisas; se recalcula según el alto real de cada una. */
export function TreeArt({ wrapperRef }: { wrapperRef: RefObject<HTMLDivElement | null> }) {
  const [geo, setGeo] = useState<TreeGeo | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setGeo(window.innerWidth >= 768 ? measure(el) : null);
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [wrapperRef]);

  if (!geo) return null;
  return (
    <svg
      aria-hidden="true"
      width={geo.width}
      height={geo.height}
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
    >
      <defs>
        <linearGradient id="bark" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={BARK_DARK} />
          <stop offset="0.5" stopColor={BARK} />
          <stop offset="1" stopColor={BARK_DARK} />
        </linearGradient>
      </defs>
      {renderTree(geo)}
    </svg>
  );
}
