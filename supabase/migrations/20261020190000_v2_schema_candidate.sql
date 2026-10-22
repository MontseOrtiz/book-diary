-- Book Diary v2 candidate schema (docs/architecture/SCHEMA_PROPOSAL.md, DEC-045).
-- LOCAL TESTING ONLY. Not approved for the remote project or real data.

-- === Authorization (DEC-042) ===
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE TABLE private.owners (owner_id uuid PRIMARY KEY);
ALTER TABLE private.owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY owners_read_self ON private.owners
  FOR SELECT TO authenticated USING (owner_id = (SELECT auth.uid()));
GRANT SELECT ON private.owners TO authenticated;

CREATE FUNCTION private.is_owner() RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
  AS $$ SELECT EXISTS (SELECT 1 FROM private.owners WHERE owner_id = (SELECT auth.uid())) $$;
REVOKE ALL ON FUNCTION private.is_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_owner() TO authenticated;

-- === Books ===
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
  match_key        text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX books_match_key_idx ON public.books (match_key);

-- === Readings ===
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
  CONSTRAINT started_partial  CHECK ((started_day  IS NULL OR started_month  IS NOT NULL)
                                 AND (started_month IS NULL OR started_year   IS NOT NULL)),
  CONSTRAINT finished_partial CHECK ((finished_day IS NULL OR finished_month IS NOT NULL)
                                 AND (finished_month IS NULL OR finished_year  IS NOT NULL)),
  CONSTRAINT month_range CHECK ((started_month  IS NULL OR started_month  BETWEEN 1 AND 12)
                            AND (finished_month IS NULL OR finished_month BETWEEN 1 AND 12)),
  CONSTRAINT finished_has_year CHECK (status <> 'finished' OR finished_year IS NOT NULL)
);
CREATE INDEX readings_book_idx   ON public.readings (book_id);
CREATE INDEX readings_status_idx ON public.readings (status) WHERE deleted_at IS NULL;
CREATE INDEX readings_year_idx   ON public.readings (finished_year) WHERE deleted_at IS NULL;

-- === Abandon / resume history (same reading, DEC-039) ===
CREATE TABLE public.reading_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id  uuid NOT NULL REFERENCES public.readings(id) ON DELETE RESTRICT,
  kind        text NOT NULL CHECK (kind IN ('abandoned','resumed')),
  year        smallint NOT NULL, month smallint, day smallint,
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- === Goals ===
CREATE TABLE public.reading_goals (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year         smallint NOT NULL UNIQUE,
  target_count integer  NOT NULL CHECK (target_count > 0),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- === RLS and grants on base tables ===
ALTER TABLE public.books          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_goals  ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.books, public.readings, public.reading_events, public.reading_goals
  FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books, public.readings,
  public.reading_events, public.reading_goals TO authenticated;

CREATE POLICY owner_all ON public.books
  FOR ALL TO authenticated USING (private.is_owner()) WITH CHECK (private.is_owner());
CREATE POLICY owner_all ON public.readings
  FOR ALL TO authenticated USING (private.is_owner()) WITH CHECK (private.is_owner());
CREATE POLICY owner_all ON public.reading_events
  FOR ALL TO authenticated USING (private.is_owner()) WITH CHECK (private.is_owner());
CREATE POLICY owner_all ON public.reading_goals
  FOR ALL TO authenticated USING (private.is_owner()) WITH CHECK (private.is_owner());

-- === Public surface (DEC-043): the only thing a visitor can read ===
CREATE VIEW public.public_books WITH (security_invoker = false) AS
  SELECT id, title, author, cover_url, synopsis, genres, series_name, series_position
  FROM public.books;

CREATE VIEW public.public_readings WITH (security_invoker = false) AS
  SELECT id, book_id, status, format, edition_label,
         started_year, started_month, started_day,
         finished_year, finished_month, finished_day,
         rating,
         CASE WHEN status = 'finished' THEN review END AS review
  FROM public.readings
  WHERE deleted_at IS NULL;

CREATE VIEW public.public_reading_events WITH (security_invoker = false) AS
  SELECT e.id, e.reading_id, e.kind, e.year, e.month, e.day
  FROM public.reading_events e
  JOIN public.readings r ON r.id = e.reading_id
  WHERE r.deleted_at IS NULL;

CREATE VIEW public.public_reading_goals WITH (security_invoker = false) AS
  SELECT year, target_count FROM public.reading_goals;

REVOKE ALL ON public.public_books, public.public_readings,
  public.public_reading_events, public.public_reading_goals FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.public_books, public.public_readings,
  public.public_reading_events, public.public_reading_goals TO anon, authenticated;
