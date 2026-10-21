# Book Diary v2 — Propuesta de esquema físico

**Ruta:** `docs/architecture/SCHEMA_PROPOSAL.md`  
**Estado:** esquema CANDIDATO aprobado el 20/10/2026 (DEC-045; sin archivo legado por DEC-046) solo para ensayo en Supabase local con datos sintéticos. **Actualización 20/10/2026:** la migración `supabase/migrations/20261020190000_v2_schema_candidate.sql` se aplicó al proyecto remoto `book-diary` con `supabase db push`, tras borrar las tablas v1 de prueba (DEC-046); las 20 pruebas pasaron en local. En el remoto se verificó solo por volcado de esquema (tablas, RLS, políticas y grants); no se ejecutaron pruebas de comportamiento allí. Pendientes: alta de la propietaria y cierre de altas en Auth.  
**Fecha:** 20 de octubre de 2026 · **Idioma:** español.  
**Complementa** `docs/architecture/DATA_MODEL.md` (modelo lógico); no lo reemplaza.

## 1. Propósito y fuentes

Traducir las decisiones aprobadas a un esquema PostgreSQL concreto que pueda probarse en el Supabase **local** con datos sintéticos (DEC-043). Fuentes: `docs/DECISIONS.md` (DEC-001–046), `docs/architecture/DATA_MODEL.md`, `types/database.ts` (v1) y `supabase/migrations/20261020181122_phase1_local_security_harness.sql` (patrón de autorización ya ensayado con datos sintéticos).

Regla de lectura de este documento: el SQL de §4 es **ilustrativo**. Cualquier cosa marcada **[PENDIENTE]** no está decidida y no debe asumirse.

## 2. Resumen del diseño

| Tabla | Esquema | Propósito | Decisiones |
|---|---|---|---|
| `books` | `public` (sin acceso directo de `anon`) | Identidad bibliográfica: un libro por obra | DEC-001, 041, 044 |
| `readings` | `public` (sin acceso directo de `anon`) | Una lectura: estado, fechas parciales, formato, calificación, opinión | DEC-002–005, 014, 033, 038, 044 |
| `reading_events` | `public` (sin acceso directo de `anon`) | Historial de abandono y reanudación de la misma lectura | DEC-035, 039 |
| `reading_goals` | `public` | Meta anual | DEC-037 |
| `owners` | `private` | Lista de propietarias autorizadas | DEC-042 |
| `public_books`, `public_readings`, `public_reading_events` | vistas en `public` | Única superficie que lee un visitante | DEC-043 |

**Idea central:** como RLS filtra filas pero no columnas, el visitante **no tiene acceso a las tablas base**; solo lee tres vistas que ya excluyen lo privado (notas de abandonadas, lecturas eliminadas, archivo). La propietaria escribe en las tablas base, validada por RLS.

## 3. Decisiones de modelado que esta propuesta toma

Todas son reversibles mientras no haya migración real. Requieren tu visto bueno.

1. **Fechas parciales:** columnas separadas `*_year`, `*_month`, `*_day` (para inicio y fin) con restricciones de coherencia, como propone `DATA_MODEL.md §3.2`. Nada se rellena con `01` ni con fecha actual.
2. **Estados:** `reading`, `finished`, `abandoned` (texto con `CHECK`; evita un `enum` difícil de cambiar).
3. **Calificación:** `numeric(2,1)` con `CHECK` de 0.5 a 5 en pasos de 0.5. `NULL` = sin calificación.
4. **Historial de abandono:** tabla `reading_events` (`abandoned` / `resumed`) ligada a la **misma** fila de `readings` (DEC-039). El estado actual vive en `readings.status`; el historial, en los eventos. La nota del abandono vive en el evento y es privada.
5. **Borrado lógico:** `readings.deleted_at` (DEC-044). Las vistas públicas excluyen filas con `deleted_at`. Los conteos usan solo `deleted_at IS NULL`.
6. **Bloqueo de borrado del libro (DEC-008):** `readings.book_id` con `ON DELETE RESTRICT`. Como la lectura eliminada lógicamente sigue existiendo, también bloquea.
7. **Duplicados (DEC-044):** `books.match_key` guarda título+autor normalizados, **calculado por la app** (la normalización de acentos depende de `unaccent`, que no es inmutable y no sirve en una columna generada). Es un índice de búsqueda, **no** una restricción `UNIQUE`: solo sugiere. `open_library_id` y `google_books_id` son únicos cuando existen.
8. **Edición utilizada (DEC-041):** una sola columna opcional `readings.edition_label` (texto libre). **[PENDIENTE]** estructura definitiva de ediciones; no se crea tabla `editions` ni se exige ISBN.
9. **Sin archivo legado (DEC-046):** los datos de v1 eran de prueba; no hay migración de datos ni `legacy_archive`. Los campos `would_recommend`, `would_reread`, `engagement`, `last_updated_at` y el estado `quiero_leer` no existen en v2.

## 4. SQL ilustrativo (no ejecutado)

```sql
-- === Autorización (patrón del fixture local, DEC-042) ===
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE TABLE private.owners (owner_id uuid PRIMARY KEY);     -- el uuid real NO va al repo
ALTER TABLE private.owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY owners_read_self ON private.owners
  FOR SELECT TO authenticated USING (owner_id = (SELECT auth.uid()));
GRANT SELECT ON private.owners TO authenticated;

-- Función de ayuda reutilizable por todas las políticas
CREATE FUNCTION private.is_owner() RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
  AS $$ SELECT EXISTS (SELECT 1 FROM private.owners WHERE owner_id = (SELECT auth.uid())) $$;
REVOKE ALL ON FUNCTION private.is_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_owner() TO authenticated;

-- === Libros ===
CREATE TABLE public.books (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL CHECK (length(btrim(title)) > 0),
  author           text,
  cover_url        text,
  synopsis         text,
  genres           text[],
  series_name      text,
  series_position  numeric,
  open_library_id  text UNIQUE,
  google_books_id  text UNIQUE,
  match_key        text,                         -- título+autor normalizados, lo calcula la app
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX books_match_key_idx ON public.books (match_key);

-- === Lecturas ===
CREATE TABLE public.readings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id       uuid NOT NULL REFERENCES public.books(id) ON DELETE RESTRICT,
  status        text NOT NULL DEFAULT 'reading' CHECK (status IN ('reading','finished','abandoned')),
  format        text NOT NULL CHECK (format IN ('fisico','kindle','ipad','audiolibro','otro')),
  edition_label text,
  started_year  smallint, started_month smallint, started_day smallint,
  finished_year smallint, finished_month smallint, finished_day smallint,
  rating        numeric(2,1) CHECK (rating BETWEEN 0.5 AND 5 AND (rating * 2) = trunc(rating * 2)),
  review        text,
  deleted_at    timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  -- coherencia de fechas parciales (día requiere mes, mes requiere año)
  CONSTRAINT started_partial  CHECK ((started_day  IS NULL OR started_month  IS NOT NULL)
                                 AND (started_month IS NULL OR started_year   IS NOT NULL)),
  CONSTRAINT finished_partial CHECK ((finished_day IS NULL OR finished_month IS NOT NULL)
                                 AND (finished_month IS NULL OR finished_year  IS NOT NULL)),
  CONSTRAINT month_range CHECK ((started_month  IS NULL OR started_month  BETWEEN 1 AND 12)
                            AND (finished_month IS NULL OR finished_month BETWEEN 1 AND 12)),
  -- DEC-033: una lectura terminada exige al menos el año de fin
  CONSTRAINT finished_has_year CHECK (status <> 'finished' OR finished_year IS NOT NULL)
);
CREATE INDEX readings_book_idx   ON public.readings (book_id);
CREATE INDEX readings_status_idx ON public.readings (status) WHERE deleted_at IS NULL;
CREATE INDEX readings_year_idx   ON public.readings (finished_year) WHERE deleted_at IS NULL;

-- === Historial de abandono / reanudación (misma lectura, DEC-039) ===
CREATE TABLE public.reading_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id  uuid NOT NULL REFERENCES public.readings(id) ON DELETE RESTRICT,
  kind        text NOT NULL CHECK (kind IN ('abandoned','resumed')),
  year        smallint NOT NULL, month smallint, day smallint,
  note        text,                              -- PRIVADO
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- === Metas ===
CREATE TABLE public.reading_goals (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year         smallint NOT NULL UNIQUE,         -- una propietaria: una meta por año
  target_count integer  NOT NULL CHECK (target_count > 0),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- === RLS + permisos de las tablas base ===
ALTER TABLE public.books          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_goals  ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.books, public.readings, public.reading_events, public.reading_goals
  FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books, public.readings,
  public.reading_events, public.reading_goals TO authenticated;

-- Una política por tabla, solo propietaria (ejemplo; se repite para las otras tres)
CREATE POLICY owner_all ON public.readings
  FOR ALL TO authenticated USING (private.is_owner()) WITH CHECK (private.is_owner());
-- reading_goals: lectura pública vía vista; escritura solo propietaria (misma política)

-- === Superficie pública (DEC-043) ===
CREATE VIEW public.public_books WITH (security_invoker = false) AS
  SELECT id, title, author, cover_url, synopsis, genres, series_name, series_position FROM public.books;

CREATE VIEW public.public_readings WITH (security_invoker = false) AS
  SELECT id, book_id, status, format, edition_label,
         started_year, started_month, started_day,
         finished_year, finished_month, finished_day,
         rating,
         CASE WHEN status = 'finished' THEN review END AS review   -- notas de abandonadas: privadas
  FROM public.readings WHERE deleted_at IS NULL;

CREATE VIEW public.public_reading_events WITH (security_invoker = false) AS
  SELECT e.id, e.reading_id, e.kind, e.year, e.month, e.day          -- sin `note`
  FROM public.reading_events e JOIN public.readings r ON r.id = e.reading_id
  WHERE r.deleted_at IS NULL;

CREATE VIEW public.public_reading_goals WITH (security_invoker = false) AS
  SELECT year, target_count FROM public.reading_goals;

GRANT SELECT ON public.public_books, public.public_readings,
  public.public_reading_events, public.public_reading_goals TO anon, authenticated;
```

## 5. Reglas que NO van en `CHECK` y se validan en servidor

Se aplican en Server Actions (DEC-042) y, cuando sea barato, en un trigger:

- **Fechas futuras** (DEC-044): `CHECK` con `current_date` no es inmutable y complica restauraciones.
- **Fin no anterior al inicio**, comparando al nivel de precisión más grueso (DEC-044).
- **Transiciones** (DEC-044): `reading→finished|abandoned`, `abandoned→reading` (crea evento `resumed`). `finished` es final. Un trigger puede impedir `finished→reading`.
- **Día válido para su mes** (incluido bisiesto).
- **Sugerencia de duplicado**: consulta por `match_key` o IDs de catálogo antes de insertar; la propietaria elige «nueva lectura» o «corregir metadatos» (DEC-001).

## 6. Datos de v1 (DEC-046)

No hay mapeo ni migración: los registros de v1 eran de prueba y la base remota se reinicia con el esquema v2. Antes de aplicarlo al proyecto remoto, la propietaria confirma que no hay nada que conservar y autoriza la operación de forma expresa. Aplicar v2 reemplaza la política v1 «Allow all for anon» (acceso abierto de lectura y escritura).

## 7. Pruebas propuestas (locales, datos sintéticos)

Extienden el fixture existente (`supabase/tests/phase1_local_security_test.sql`) en lugar de reemplazarlo:

1. `anon` lee `public_readings` y no puede `SELECT` sobre `public.readings`, `reading_events`, `books` ni `private.*`.
2. En `public_readings`, `review` es `NULL` para una abandonada y visible para una terminada; una lectura con `deleted_at` no aparece.
3. `anon` y un usuario autenticado que no es propietaria no pueden `INSERT/UPDATE/DELETE` en ninguna tabla base.
4. La propietaria sí puede; tras quitarla de `private.owners`, ya no.
5. Restricciones: calificación `0.3` o `5.5` falla, `4.5` pasa; mes sin año falla; `finished` sin año falla; `DELETE` de un `book` con una lectura (incluso con `deleted_at`) falla.
6. Dos lecturas del mismo `book_id` con formatos distintos se aceptan (relectura, DEC-001).

## 8. Riesgos y qué no cubre

- **Vistas con `security_invoker = false`:** corren con los permisos de su dueño y por eso saltan RLS; es intencional, pero hay que verificar en local que **solo** exponen las columnas listadas. Es el punto más delicado del diseño.
- **Aún no verificado:** el esquema real del proyecto remoto sigue sin respaldo ni inventario completo (OPEN-07). Nada de esto se ejecuta ahí.
- **Pendientes que no bloquean el piloto local:** estructura final de ediciones, confirmaciones y política de purga, calificación al abandonar, límites de la meta anual.

## 9. Archivos que tocaría una futura implementación

Solo tras tu aprobación: `supabase/migrations/<fecha>_v2_schema.sql` (nuevo), `supabase/tests/` (casos de §7), `supabase/seed.sql` (datos sintéticos) y `types/database.ts`. Hoy no se modifica ninguno.
