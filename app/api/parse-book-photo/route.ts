import { NextResponse } from "next/server";
import { GoogleGenAI, createUserContent, createPartFromBase64, ApiError } from "@google/genai";

export const dynamic = "force-dynamic";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MAX_GEMINI_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isUnavailableError(err: unknown): boolean {
  return err instanceof ApiError && err.status === 503;
}

function stripMarkdownCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

// Extracts the first balanced { ... } object, ignoring any leading/trailing
// text or stray braces Gemini sometimes appends after the JSON itself.
function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

const PROMPT = `You are reading a photo of a book cover.
Identify the book's title and author from the cover and return ONLY valid JSON matching exactly this structure (no markdown, no code fences, no explanation — just the JSON):

{
  "title": "string",
  "author": "string or empty string if not visible"
}

Rules:
- Never invent a title or author that isn't visible on the cover.
- If the author isn't visible or legible, use an empty string for "author".`;

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Se esperaba un formulario multipart/form-data con un campo "image".' },
      { status: 400 }
    );
  }

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se proporcionó ninguna imagen." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo subido no es una imagen." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Send the photo to Gemini and ask it to read the cover.
  // Retries only on 503 (UNAVAILABLE / high demand) — other errors fail immediately.
  let responseText: string | undefined;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_GEMINI_ATTEMPTS; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: createUserContent([
          PROMPT,
          createPartFromBase64(buffer.toString("base64"), file.type),
        ]),
        config: {
          responseMimeType: "application/json",
        },
      });
      responseText = result.text;
      lastError = undefined;
      break;
    } catch (err) {
      lastError = err;
      if (!isUnavailableError(err) || attempt === MAX_GEMINI_ATTEMPTS) break;
      await sleep(RETRY_DELAY_MS);
    }
  }

  if (lastError) {
    if (isUnavailableError(lastError)) {
      return NextResponse.json(
        { error: "El servicio de IA está saturado, intenta de nuevo en unos minutos." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        error: `Error al conectar con Gemini: ${lastError instanceof Error ? lastError.message : "error desconocido"}`,
      },
      { status: 502 }
    );
  }

  if (!responseText) {
    return NextResponse.json({ error: "Gemini no devolvió ninguna respuesta." }, { status: 502 });
  }

  const jsonCandidate = extractFirstJsonObject(stripMarkdownCodeFence(responseText));

  if (!jsonCandidate) {
    console.error("No se encontró un objeto JSON en la respuesta de Gemini:", responseText);
    return NextResponse.json(
      { error: "Gemini devolvió una respuesta que no es JSON válido." },
      { status: 502 }
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonCandidate);
  } catch {
    console.error("Gemini devolvió una respuesta que no es JSON válido:", responseText);
    return NextResponse.json(
      { error: "Gemini devolvió una respuesta que no es JSON válido." },
      { status: 502 }
    );
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { title?: unknown }).title !== "string"
  ) {
    return NextResponse.json(
      { error: "Gemini devolvió un formato inesperado." },
      { status: 502 }
    );
  }

  const { title, author } = parsed as { title: string; author?: unknown };

  return NextResponse.json({
    title,
    author: typeof author === "string" ? author : "",
  });
}
