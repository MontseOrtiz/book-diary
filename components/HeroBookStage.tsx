"use client";

import dynamic from "next/dynamic";

// Three.js/WebGL cannot render on the server, so the actual scene is loaded
// client-only. This wrapper exists because ssr:false is only valid inside a
// Client Component, and the home page itself is a Server Component.
const HeroBook = dynamic(() => import("./HeroBook").then((mod) => mod.HeroBook), {
  ssr: false,
});

export function HeroBookStage() {
  return (
    <div className="h-56 w-full sm:h-64">
      <HeroBook />
    </div>
  );
}
