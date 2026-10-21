BEGIN;
SELECT plan(22);

-- Synthetic data only. Seeded as the migration role before switching to API roles.
INSERT INTO private.owners (owner_id) VALUES ('11111111-1111-4111-8111-111111111111');

INSERT INTO public.books (id, title, author) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'Libro de prueba', 'Autora de prueba'),
  ('b0000000-0000-4000-8000-000000000002', 'Libro sin lecturas', 'Autora de prueba');

INSERT INTO public.readings (id, book_id, status, format, finished_year, rating, review) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001',
   'finished', 'kindle', 2026, 4.5, 'opinion publica');
INSERT INTO public.readings (id, book_id, status, format, review) VALUES
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001',
   'abandoned', 'fisico', 'nota privada de abandono');
INSERT INTO public.readings (id, book_id, status, format, finished_year, deleted_at) VALUES
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001',
   'finished', 'ipad', 2025, now());

INSERT INTO public.reading_events (reading_id, kind, year, note) VALUES
  ('c0000000-0000-4000-8000-000000000002', 'abandoned', 2026, 'nota privada de evento');
INSERT INTO public.reading_goals (year, target_count) VALUES (2026, 24);

-- 1-2: anonymous reads only the public views
SET LOCAL ROLE anon;
SELECT is((SELECT count(*)::integer FROM public.public_readings), 2,
  'anon sees two non-deleted readings through the view');
SELECT is((SELECT count(*)::integer FROM public.public_books), 2,
  'anon sees books through the view');
SELECT is((SELECT review FROM public.public_readings WHERE status = 'finished'), 'opinion publica',
  'finished review is public');
SELECT is((SELECT review FROM public.public_readings WHERE status = 'abandoned'), NULL,
  'abandoned note is hidden by the view');
SELECT is((SELECT count(*)::integer FROM public.public_readings
           WHERE id = 'c0000000-0000-4000-8000-000000000003'), 0,
  'soft-deleted reading is not public');
SELECT is((SELECT count(*)::integer FROM public.public_reading_goals), 1,
  'anon reads goals through the view');

-- 3: anonymous cannot touch base tables or private objects
SELECT throws_ok($$SELECT * FROM public.readings$$, '42501', NULL, 'anon cannot read readings table');
SELECT throws_ok($$SELECT * FROM public.reading_events$$, '42501', NULL, 'anon cannot read events table');
SELECT throws_ok($$SELECT * FROM public.books$$, '42501', NULL, 'anon cannot read books table');
SELECT throws_ok($$SELECT * FROM private.owners$$, '42501', NULL, 'anon cannot read the private owners table');
SELECT throws_ok($$INSERT INTO public.books (title) VALUES ('anon write')$$, '42501', NULL,
  'anon cannot insert');
RESET ROLE;

-- 3: authenticated non-owner
SET LOCAL request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';
SET LOCAL ROLE authenticated;
SELECT throws_ok($$INSERT INTO public.books (title) VALUES ('non-owner write')$$, '42501', NULL,
  'non-owner insert is rejected by RLS');
SELECT is((SELECT count(*)::integer FROM public.readings), 0,
  'non-owner sees no rows in the readings table');
SELECT is((SELECT count(*)::integer FROM private.owners), 0,
  'non-owner cannot see the owners list');
RESET ROLE;

-- 4: owner can write; revoked owner cannot
SET LOCAL request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';
SET LOCAL ROLE authenticated;
SELECT lives_ok(
  $$INSERT INTO public.readings (book_id, status, format, finished_year)
    VALUES ('b0000000-0000-4000-8000-000000000001', 'finished', 'audiolibro', 2026)$$,
  'owner can insert a re-reading of the same book with a different format');
RESET ROLE;
DELETE FROM private.owners WHERE owner_id = '11111111-1111-4111-8111-111111111111';
SET LOCAL ROLE authenticated;
SELECT throws_ok($$INSERT INTO public.books (title) VALUES ('revoked write')$$, '42501', NULL,
  'revoked owner can no longer insert');
RESET ROLE;

-- am_i_owner(): anon cannot call it; non-owner gets false
SET LOCAL ROLE anon;
SELECT throws_ok($$SELECT public.am_i_owner()$$, '42501', NULL, 'anon cannot call am_i_owner');
RESET ROLE;
SET LOCAL request.jwt.claims = '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';
SET LOCAL ROLE authenticated;
SELECT is(public.am_i_owner(), false, 'non-owner gets false from am_i_owner');
RESET ROLE;

-- 5: constraints (as migration role)
SELECT throws_ok(
  $$INSERT INTO public.readings (book_id, format, rating) VALUES ('b0000000-0000-4000-8000-000000000001', 'fisico', 0.3)$$,
  '23514', NULL, 'rating 0.3 is rejected');
SELECT throws_ok(
  $$INSERT INTO public.readings (book_id, format, finished_month) VALUES ('b0000000-0000-4000-8000-000000000001', 'fisico', 3)$$,
  '23514', NULL, 'month without year is rejected');
SELECT throws_ok(
  $$INSERT INTO public.readings (book_id, format, status) VALUES ('b0000000-0000-4000-8000-000000000001', 'fisico', 'finished')$$,
  '23514', NULL, 'finished without year is rejected');
SELECT throws_ok(
  $$DELETE FROM public.books WHERE id = 'b0000000-0000-4000-8000-000000000001'$$,
  '23503', NULL, 'book with readings (even soft-deleted) cannot be deleted');

SELECT * FROM finish();
ROLLBACK;
