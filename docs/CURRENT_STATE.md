# Book Diary — Estado técnico actual

## 1. Propósito, alcance y grado de certeza

Auditoría técnica del repositorio existente como base para especificar Book Diary v2: rediseño, registro asistido de libros, seguimiento, relecturas y metas anuales. Este documento describe el estado encontrado; **no es una especificación ni una implementación de v2**.

- **Fecha:** 17 de octubre de 2026.
- **Commit de referencia:** `b1d32f80a48e8bad2cc9b6a790a997afc265cd32`.
- **Estado inicial:** árbol de trabajo sin cambios reportados por `git status --short`.
- **Método:** inspección estática de archivos propios, imports, manifiestos, lockfile y documentación local de Next.js. Se excluyeron dependencias y artefactos generados del inventario de código propio.
- **Restricciones respetadas:** no se modificó código, configuración ni datos; no se instalaron dependencias; no se ejecutaron builds, migraciones, aplicación, lint, suites ni peticiones a proveedores. El único archivo creado en el repositorio es este documento.
- **Secretos:** no se leyeron ni reprodujeron los valores de `.env.local`. Solo se documentan nombres de variables presentes en código y en `.env.local.example`.

### Cómo interpretar los estados

- **Verificado en código:** existe un flujo o comportamiento respaldado por los archivos citados. No significa que haya sido probado en ejecución ni en producción.
- **Parcial:** existe una parte de la capacidad, pero no el alcance completo que podría sugerir su nombre.
- **No identificado:** no se encontró implementación en los archivos propios inventariados. No demuestra ausencia de servicios o controles externos al repositorio.
- **No comprobado:** requiere ejecución, acceso autorizado al backend, infraestructura o datos reales que no formaron parte de esta auditoría.

Los riesgos inferidos se distinguen de los defectos observables directamente en el código. Las referencias de líneas corresponden al commit indicado y pueden desplazarse en cambios posteriores.

## 2. Resumen ejecutivo

Book Diary es una aplicación pequeña de Next.js App Router, React y TypeScript. La persistencia se realiza con Supabase, consultado tanto desde páginas servidor como desde componentes cliente. Dos Route Handlers integran Open Library y Gemini. No hay una capa propia de servicios de dominio o repositorios: las páginas y componentes contienen consultas, mutaciones y reglas de presentación.

La base existente permite consultar libros por estado, buscar títulos, agregarlos a pendientes, comenzar una lectura mediante búsqueda o foto, finalizarla con evaluación, editar esa evaluación, consultar estadísticas y gestionar la meta del año actual. Sin embargo:

1. **Libro y lectura están combinados en una misma fila.** No hay historial de relecturas; `would_reread` expresa intención.
2. **El avance es una marca de actividad.** Solo modifica `last_updated_at`, sin páginas, porcentaje ni historial.
3. **La biblioteca no se navega por año.** Las estadísticas agrupan finalizaciones por períodos; la meta se limita al año actual.
4. **La automatización es asistida.** Foto → extracción → búsqueda → selección humana → inserción.
5. **La seguridad efectiva de Supabase no puede deducirse del repositorio.** No hay autenticación de aplicación identificada ni políticas SQL versionadas; RLS y permisos remotos no fueron comprobados.
6. **No se identificaron suites automatizadas.** Tampoco se validó la ejecución local: el Node disponible falla al arrancar y el proyecto no fija una versión compatible.

Evidencias principales: `types/database.ts:1-84`, `lib/supabase.ts:1-7`, `app/page.tsx:75-96`, `app/start-reading/page.tsx:45-144`, `app/book/[id]/page.tsx:157-264`, `package.json:5-32`.

## 3. Estructura y arquitectura observada

```text
app/
  layout.tsx                 Documento raíz, metadatos y fuentes
  globals.css                Tokens y estilos compartidos
  page.tsx                   Biblioteca por estado y meta actual
  add/page.tsx               Buscar y agregar a pendientes
  start-reading/page.tsx     Foto/búsqueda y alta como leyendo
  book/[id]/page.tsx         Detalle, actividad, finalización y evaluación
  estadisticas/page.tsx      Resúmenes por año, mes y semana
  test-connection/page.tsx   Diagnóstico manual de Supabase
  api/search-books/route.ts  Adaptación de búsqueda Open Library
  api/parse-book-photo/route.ts  Extracción de portada con Gemini
components/
  HeroBook.tsx               Escena decorativa React Three Fiber
  HeroBookStage.tsx          Carga cliente de la escena, sin SSR
  ReadingGoalCard.tsx        Formulario y progreso de meta
lib/supabase.ts              Cliente Supabase compartido
types/database.ts            Contrato TypeScript de datos y estados
public/                      SVG de plantilla; portadas referenciadas por URL
```

También existen `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `.env.local.example`, documentación de plantilla e instrucciones para agentes. `.next/`, `node_modules/`, `.env.local` y `*.tsbuildinfo` están ignorados por Git (`.gitignore:3-5,16-18,33-42`); su presencia local **no acredita** una ejecución o compilación válida del estado auditado.

### Límites de responsabilidad actuales

- **Servidor:** inicio y estadísticas consultan Supabase y calculan agrupaciones; ambas páginas declaran `dynamic = "force-dynamic"` (`app/page.tsx:8,75-96`; `app/estadisticas/page.tsx:6,75-122`).
- **Cliente:** altas, detalle y metas usan estado React y mutan Supabase directamente (`app/add/page.tsx:1-6,49-73`; `app/start-reading/page.tsx:1-12,119-144`; `app/book/[id]/page.tsx:1-8,157-264`; `components/ReadingGoalCard.tsx:1-6,25-72`).
- **APIs propias:** son adaptadores de proveedores, no APIs CRUD de libros. No se identificaron Server Actions, repositorios de dominio, middleware/proxy de acceso ni un backend propio separado en el inventario.
- **Presentación:** estilos Tailwind y funciones locales de página. El layout aporta idioma español, Newsreader, Work Sans y metadatos básicos (`app/layout.tsx:1-35`; `app/globals.css:1-86`).

## 4. Dependencias y herramientas

Las versiones siguientes son las resueltas en `package-lock.json` y coinciden con los manifiestos locales de los paquetes directos. **El uso se verificó por separado**, no por su mera presencia instalada.

| Dependencia | Versión resuelta | Uso comprobado o límite |
| --- | --- | --- |
| `next` | 16.2.0 | App Router, `Link`, navegación, fuentes, carga dinámica y `NextResponse`; `app/`, `app/layout.tsx`, `components/HeroBookStage.tsx`, ambas rutas API. |
| `react` / `react-dom` | 19.2.4 / 19.2.4 | Hooks y componentes React en pantallas cliente; React DOM como soporte del framework, sin imports propios directos identificados. |
| `@supabase/supabase-js` | 2.110.0 | `createClient<Database>` en `lib/supabase.ts`, consumido por páginas y tarjeta de meta. |
| `@google/genai` | 2.13.0 | SDK, contenido de imagen y clasificación de error en `app/api/parse-book-photo/route.ts:1-16,104-120`. |
| `@phosphor-icons/react` | 2.1.10 | Iconos cliente y variante SSR; por ejemplo `app/page.tsx:2` y `app/book/[id]/page.tsx:6`. |
| `@react-three/fiber` | 9.6.1 | `Canvas` y `useFrame` en `components/HeroBook.tsx:4,24-29,73-82`. |
| `three` / `@types/three` | 0.185.1 / 0.185.1 | Escena a través de Fiber; import propio de `Group` solo como tipo (`components/HeroBook.tsx:5`). `@types/three` está declarado entre dependencias de producción, aunque aporta tipado. |
| `@react-three/drei` | 10.7.7 | Declarado e instalado, pero **sin imports ni referencias identificados en código propio**. No atribuirle funcionalidad existente. |
| `tailwindcss` / `@tailwindcss/postcss` | 4.3.3 / 4.3.3 | Import, tema y `@apply` en `app/globals.css`; plugin en `postcss.config.mjs`. |
| `typescript` | 5.9.3 | Archivos TS/TSX y configuración estricta en `tsconfig.json`. No se comprobó que el estado actual pase el chequeo de tipos. |
| `eslint` / `eslint-config-next` | 9.39.5 / 16.2.0 | Script `lint` y reglas Next Core Web Vitals/TypeScript (`eslint.config.mjs:1-18`). No ejecutado. |
| `@types/node`, `@types/react`, `@types/react-dom` | 20.19.43, 19.2.17, 19.2.3 | Herramientas de tipado declaradas, no capacidades de producto. |

### Configuración y reproducibilidad

- `package.json:5-9` define `dev`, `build`, `start` y `lint`; no hay scripts de pruebas ni chequeo de tipos independiente. `package-lock.json` usa formato de lockfile 3.
- `tsconfig.json:2-23` activa `strict`, `noEmit`, resolución `bundler`, alias `@/*` e incremental. `skipLibCheck` está habilitado.
- `next.config.ts:3-5` no establece opciones personalizadas. No se identificaron manifiestos propios de despliegue, contenedores o workflows de CI en el inventario versionado.
- No se identificó pin de Node (`engines`, `.nvmrc`, `.node-version`, `.tool-versions`) ni `packageManager` en `package.json`.
- **Compatibilidad declarada:** Supabase 2.110.0 requiere Node `>=22.0.0`; Next 16.2.0, `>=20.9.0`; el SDK Gemini, `>=20.0.0`. Evidencia: entradas respectivas de `package-lock.json` y `node_modules/{@supabase/supabase-js,next,@google/genai}/package.json`.
- Un intento de consultar metadatos con el ejecutable local de Node falló antes de ejecutar JavaScript por `libicui18n.73.dylib` ausente. La ruta del ejecutable identifica Node 21.2.0: además del fallo de entorno, no satisface el mínimo declarado por Supabase. No se intentó reparar ni cambiar ese entorno.
- `README.md` sigue siendo el texto de `create-next-app`: no explica esquema, permisos, integraciones ni funcionamiento de Book Diary y menciona Geist aunque el layout usa otras fuentes (`README.md:1-36`; `app/layout.tsx:2-14`).

No se realizó análisis de vulnerabilidades publicadas, licencias, tamaño de bundle ni rendimiento; el lockfile por sí solo no permite declararlos seguros o problemáticos. Se consultó la guía local `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` para contrastar la estructura de Route Handlers de esta versión.

## 5. Funcionalidades y rutas

En esta tabla, “verificado” significa **verificado en código**, no validado extremo a extremo.

| Ruta / capacidad | Estado | Implementación y límites | Evidencia |
| --- | --- | --- | --- |
| `/` — biblioteca | Verificado | Agrupa por `quiero_leer`, `leyendo`, `terminado`. Ordena por creación, actividad o finalización según sección. Consulta todos los libros, no un año elegido. | `app/page.tsx:10-25,55-80,140-146` |
| `/add` — pendientes | Verificado | Busca título/autor en API propia y guarda un resultado como `quiero_leer`. No es alta libre de metadatos. | `app/add/page.tsx:18-73` |
| `/start-reading` — comenzar | Verificado; automatización parcial | Selección/captura de archivo de imagen, extracción con Gemini, búsqueda derivada y confirmación de resultado. Alternativa de búsqueda escrita. Inserta una fila nueva como `leyendo`. | `app/start-reading/page.tsx:45-144,171-219,223-272` |
| `/book/[id]` — detalle | Verificado | Consulta por ID y muestra carga, error o no encontrado. | `app/book/[id]/page.tsx:115-155,273-300,317-353` |
| Empezar un pendiente | Verificado | Cambia a `leyendo` y establece inicio y actividad. | `app/book/[id]/page.tsx:157-179,356-365` |
| “Actualicé mi avance hoy” | Parcial como seguimiento | Actualiza únicamente `last_updated_at`; no conserva eventos, páginas, porcentaje ni tiempo. | `app/book/[id]/page.tsx:181-200,367-379` |
| Finalizar lectura | Verificado | Exige calificación en formulario; guarda finalización, valoración 1–5, recomendación, intención de releer, enganche 1–5 y notas. Los demás campos de evaluación son opcionales. | `app/book/[id]/page.tsx:76-101,221-264,427-491` |
| Editar evaluación | Verificado | Precarga los campos y actualiza evaluación/notas. Si ya está terminado, no cambia fecha de finalización. No edita título, autor o fechas. | `app/book/[id]/page.tsx:208-219,233-249,383-423` |
| Meta anual | Verificado para año actual | Crea/edita objetivo positivo entero; cuenta filas terminadas ese año y limita barra al 100 %. No hay selector ni gestión de metas históricas en UI. | `app/page.tsx:76-96,122-126`; `components/ReadingGoalCard.tsx:25-72,114-135` |
| `/estadisticas` | Verificado | Agrega libros terminados con fecha por año, mes y semana iniciada en lunes. No muestra períodos vacíos ni filtra un año seleccionado. | `app/estadisticas/page.tsx:24-39,75-122,139-151` |
| Relecturas realizadas | No identificado | Solo existe `would_reread`: intención declarada. No hay acción para releer un terminado ni entidad para múltiples lecturas. | `types/database.ts:6-58`; `app/book/[id]/page.tsx:383-425` |
| `/test-connection` | Verificado como diagnóstico manual | Consulta libros y muestra conteo o mensaje de error. **No es una prueba automatizada.** | `app/test-connection/page.tsx:3-21` |
| Escena 3D | Verificado en código | Libro decorativo cargado sin SSR; consulta y escucha `prefers-reduced-motion`. Compatibilidad WebGL y rendimiento no comprobados. | `components/HeroBookStage.tsx:8-16`; `components/HeroBook.tsx:21-29,54-82` |

No se identificaron controles o APIs propios para eliminar libros, corregir metadatos bibliográficos, editar fechas históricas, abandonar/pausar lecturas, registrar libros fuera del catálogo externo o importar/exportar datos. La búsqueda “manual” sigue dependiendo de Open Library; no equivale a ingresar un libro arbitrario. Evidencia del alcance: pantallas de alta y detalle citadas e inventario de `app/`.

## 6. Datos y persistencia

### 6.1 Contrato local, no esquema SQL comprobado

`types/database.ts` declara dos tablas públicas y sus tipos `Row`, `Insert` y `Update`. No se encontraron DDL, migraciones, seeds ni políticas SQL en el inventario del repositorio. Las interfaces **no acreditan** tipos SQL, defaults, constraints, índices, triggers, unicidad o permisos del backend desplegado.

| Entidad | Campos declarados en `Row` | Observaciones |
| --- | --- | --- |
| `books` | `id`, `title`; `author`, `cover_image_url`, `open_library_id`; `status`; `start_date`, `finish_date`, `last_updated_at`, `created_at`; `rating`, `would_recommend`, `would_reread`, `engagement`, `notes` | ID y fechas son strings TypeScript; no se comprobó formato/tipo SQL. Autor, referencias, fechas de inicio/fin y evaluación permiten null. Combina catálogo, estado de una lectura y evaluación. |
| `reading_goals` | `id`, `year`, `target_count`, `created_at` | Objetivo numérico por año; no hay propietario declarado. El cliente espera como máximo una meta por año, pero el contrato no demuestra unicidad real. |

Evidencia: `types/database.ts:1-80`. Ambas entidades declaran `Relationships: []`; `Views` y `Functions` están vacíos en el contrato (`types/database.ts:58,79-84`). Esto tampoco demuestra que no existan objetos adicionales en Supabase.

En `Insert` son opcionales ID, estado, fechas/timestamps y evaluación. Las altas omiten, entre otros, ID, `created_at` y `last_updated_at`: dependen de comportamiento remoto no versionado aquí (`types/database.ts:24-39`; `app/add/page.tsx:53-61`; `app/start-reading/page.tsx:125-133`).

### 6.2 Acceso y flujos persistidos

`lib/supabase.ts:1-7` crea un cliente con `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `Database`. Las aserciones `!` no validan las variables en ejecución. El mismo módulo es consumido desde servidor y navegador.

```text
Inicio / estadísticas (servidor) ───────────────> Supabase
Alta / detalle / metas (navegador) ─────────────> Supabase
Navegador ─> API search-books ─────────────────> Open Library
Navegador ─> API parse-book-photo ─────────────> Gemini
Resultado de foto ─> búsqueda ─> confirmación ─> Supabase
```

Las altas siempre ejecutan `insert`; comenzar desde búsqueda/foto no busca ni actualiza automáticamente un pendiente ya existente. El detalle modifica por ID. No hay control de concurrencia/versionado de fila ni idempotencia de alta identificados en esos handlers. Que existan duplicados efectivos depende de constraints remotos no comprobados.

No se identificó uso propio explícito de Supabase Storage, archivos locales persistentes o `localStorage`/`sessionStorage` para libros. La foto se carga en memoria y se envía a Gemini; el flujo guarda metadatos y URL de portada, no el archivo fotografiado (`app/api/parse-book-photo/route.ts:87-108`; `app/start-reading/page.tsx:77-94,125-133`). La retención del proveedor no fue comprobada.

## 7. APIs e integraciones externas

### `GET /api/search-books?q=...`

Evidencia: `app/api/search-books/route.ts:3-66`.

- Exige `q` no vacío después de `trim`; de lo contrario devuelve `400` con `{ error }`.
- Consulta un destino fijo, `https://openlibrary.org/search.json`, con diez resultados, campos `key,title,author_name,cover_i` y `cache: "no-store"`.
- Responde `{ results }`; cada elemento contiene `title`, primer `author` o null, `open_library_id` tomado de `doc.key` y `cover_url` o null. Las portadas usan `covers.openlibrary.org`.
- Fallo de red o HTTP no exitoso del proveedor devuelve `502` con `{ error }`.
- **Límites:** el parseo JSON y `data.docs.slice(...).map(...)` quedan fuera del manejo de errores y sin validación runtime. Un payload inesperado puede producir una respuesta de error no normalizada. No hay timeout explícito, límite de longitud de búsqueda, paginación de cliente ni guardas locales de acceso/cuota.
- No se comprobó disponibilidad, calidad del catálogo o semántica remota de sus identificadores. No debe asumirse que la clave identifica una edición física concreta.

### `POST /api/parse-book-photo`

Evidencia: `app/api/parse-book-photo/route.ts:1-181`.

- Recibe `multipart/form-data` con un `File` llamado `image`. Formulario inválido, archivo ausente o MIME no `image/*` devuelve `400`.
- Convierte el archivo completo a Buffer/base64 y lo envía a Gemini con un prompt de extracción. Modelo fijado en código: `gemini-3.5-flash`; su disponibilidad real no fue comprobada.
- Pide salida JSON; elimina fences y extrae el primer objeto balanceado, respetando strings y escapes. Valida `title` string y normaliza autor no string a `""`. No rechaza título vacío.
- Responde `{ title, author }`; **no persiste un libro**. La UI usa la respuesta para buscar y confirmar.
- Hasta tres intentos, separados por dos segundos, solo para `ApiError` con estado 503. Agotamiento de saturación devuelve `503`; otros errores de proveedor o de formato, `502`.
- **Límites:** no hay máximo explícito de bytes, verificación de contenido real, lista cerrada de MIME, timeout o cuota local. `file.type` es un metadato declarado; no prueba que el contenido sea una imagen válida. Inicialización del SDK y lectura del archivo quedan fuera del bloque que captura errores del proveedor.
- Algunos errores incorporan el mensaje original del proveedor; ante JSON inválido se registra la respuesta completa (`:131-158`). Es un riesgo de exposición de detalles/datos en respuestas o logs, **no una fuga de credenciales demostrada**.

### Variables de entorno

`.env.local.example:1-3` documenta `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `GEMINI_API_KEY`. La clave Gemini se lee únicamente en la ruta servidor; las variables Supabase se usan en un cliente importado también por el navegador (`lib/supabase.ts:4-7`; `app/api/parse-book-photo/route.ts:6`). No se comprobó que los valores reales estén presentes o sean válidos.

## 8. Autenticación, autorización y límites de seguridad

**Verificado en el repositorio:** no se identificaron login/logout, llamadas a auth, gestión propia de sesión, propagación de sesión por cookies ni filtros de propietario. Las consultas de biblioteca/metas son globales y las mutaciones filtran por ID, no por usuario. Tampoco se identificó protección de acceso en los dos Route Handlers ni middleware/proxy propio.

Evidencia: `lib/supabase.ts:1-7`; `app/page.tsx:78-80`; `app/book/[id]/page.tsx:133-137,165-170,186-191,235-253`; `components/ReadingGoalCard.tsx:38-61`; ambas rutas API completas; inventario del repositorio.

**No comprobado:** RLS, grants, restricciones, exposición de red, autenticación impuesta por el hosting o un proxy externo, cuotas del proveedor y controles operativos. Por lo tanto, **no se puede afirmar que la base esté abierta**, ni que la aplicación desplegada sea privada. Una anon key pública no es por sí misma una filtración: la seguridad depende de permisos efectivos y políticas apropiadas.

La API de foto puede generar consumo de un proveedor autenticado si se publica sin controles adicionales. La ruta `/test-connection` muestra conteos o errores técnicos sin guardas propias (`app/test-connection/page.tsx:3-21`). Ambos puntos requieren revisión antes de exposición pública, aunque se trate de una aplicación personal.

## 9. Componentes y lógica reutilizables

Son candidatos, no decisiones de arquitectura de v2 ni garantías de compatibilidad sin cambios.

| Candidato | Ubicación | Condición / tradeoff |
| --- | --- | --- |
| Estados y etiquetas del legado | `types/database.ts:1,87-94` | Útiles para mapear datos existentes; revisar si el estado pertenece a una lectura y no al catálogo. |
| Adaptador Open Library y DTO de búsqueda | `app/api/search-books/route.ts:3-19,32-65` | Conservar normalización; agregar validación y errores controlados. Mover el DTO a un módulo neutral evitaría imports de tipos desde rutas en las páginas de alta. |
| Parser y clasificación de fallos Gemini | `app/api/parse-book-photo/route.ts:8-62,102-180` | Reutilizables tras aislarlos y probar JSON, escapes y reintentos. El modelo/proveedor debe poder sustituirse sin modificar UI. |
| Flujo de confirmación humana | `app/start-reading/page.tsx:45-144` | Reutilizable como concepto para reducir altas incorrectas; no confundir con persistencia autónoma. |
| Meta anual | `components/ReadingGoalCard.tsx` | Reutilizar validación/presentación; separar acceso a datos y definir unicidad/concurrencia. |
| Tarjetas, secciones y selectores | `app/page.tsx:28-73`; `app/book/[id]/page.tsx:41-113`; `app/estadisticas/page.tsx:42-73` | Hoy son funciones internas de páginas. Extraer facilita consistencia y pruebas, pero no implica conservar el diseño visual en v2. |
| Orden y agregaciones | `app/page.tsx:12-25`; `app/estadisticas/page.tsx:24-39,92-122` | Separar como funciones puras después de definir fechas; no copiar sin corregir los riesgos temporales. |
| Tokens y estilos compartidos | `app/globals.css:3-86`; `app/layout.tsx` | Inventario útil para el rediseño; no asumir que la paleta/fuentes actuales son requisitos nuevos. |
| Escena decorativa 3D | `components/HeroBook.tsx`; `components/HeroBookStage.tsx` | Ya está aislada y diferida. Conservar aporta identidad; prescindir de ella reduce superficie WebGL y dependencias. Decidir con mediciones y fallback, no por presencia de paquetes. |

El SDK Supabase y su contrato tipado pueden seguir siendo útiles. El singleton compartido actual no debe adoptarse automáticamente como arquitectura de autenticación servidor/cliente de v2.

## 10. Problemas, deuda y riesgos de migración

“Alta” indica prioridad antes de diseñar o exponer v2; no implica una vulnerabilidad explotada o un fallo ya reproducido.

| Prioridad | Hallazgo y certeza | Impacto / recomendación | Evidencia |
| --- | --- | --- | --- |
| Alta | **Esquema y seguridad remotos no comprobados.** No hay SQL/políticas versionadas identificadas. | No migrar desde interfaces TS solamente. Relevar esquema, constraints, índices, defaults, RLS y permisos con acceso autorizado; preparar respaldo y reversión. | `types/database.ts`; `lib/supabase.ts`; inventario versionado. |
| Alta | **Modelo de una sola lectura por fila, verificado.** | V2 necesita definir identidad de libro/edición y de cada lectura. No convertir `would_reread` en un evento histórico ni inventar lecturas ausentes. | `types/database.ts:6-58`; `app/book/[id]/page.tsx:233-249,399-403`. |
| Alta | **Sin controles locales de acceso/cuota en APIs; controles externos desconocidos.** | Limitar consumo y acceso antes de publicarlas; validar tamaño/tipo de imágenes y tiempos máximos. | `app/api/parse-book-photo/route.ts:76-122`; `app/api/search-books/route.ts:21-66`. |
| Alta | **Sin red automatizada de regresión identificada.** | Cambiar modelo y UI simultáneamente sin pruebas aumenta riesgo de pérdida de reglas y datos. Incorporar casos de caracterización antes de implementar. | `package.json:5-32`; inventario de pruebas de sección 11. |
| Alta | **Runtime no reproducible en el entorno auditado.** | Fijar un Node compatible con todos los paquetes; reparar el entorno en una tarea autorizada, separada de esta auditoría. | `package.json`; `package-lock.json`, entradas Supabase/Next/Gemini; fallo local de Node descrito en sección 4. |
| Media | **Error de meta descartado, verificado.** Home solo conserva error de libros. | Permisos, múltiples filas o fallos pueden verse como ausencia de meta y ofrecer otra inserción. Diferenciar error de “sin datos”; verificar unicidad real por año/propietario. | `app/page.tsx:78-81,122-125`; `components/ReadingGoalCard.tsx:57-61`. |
| Media | **Altas sin idempotencia o reutilización local, verificado; duplicación remota no comprobada.** | Una selección repetida o comenzar desde búsqueda un pendiente existente puede intentar otra fila. Definir si representa duplicado, edición distinta o relectura. | `app/add/page.tsx:49-73`; `app/start-reading/page.tsx:119-144`. |
| Media | **Fechas UTC y locales mezcladas, riesgo inferido no reproducido.** | Se generan fechas con `toISOString().slice(0,10)` y se leen con `Date`/getters locales. Puede cambiar día/período según zona. Definir fecha calendario vs. instante, zona y política anual/semanal antes de migrar. | `app/start-reading/page.tsx:123`; `app/book/[id]/page.tsx:32-38,162,246`; `app/page.tsx:91-96`; `app/estadisticas/page.tsx:24-38,92-108`. |
| Media | **Consultas completas sin paginar y cómputo en memoria, verificado.** | Coste creciente y posibles conteos incompletos según límites remotos. Volumen, límites y rendimiento reales no comprobados. | `app/page.tsx:78-96`; `app/estadisticas/page.tsx:75-122`. |
| Media | **Validación externa y errores incompletos, verificado.** | Normalizar respuestas inesperadas, títulos vacíos y excepciones; no confiar en interfaces TS para validar datos recibidos. | `app/api/search-books/route.ts:54-63`; `app/api/parse-book-photo/route.ts:95,131-179`. |
| Media | **Acoplamiento y duplicación, verificado.** | UI mezcla datos, transiciones y mensajes; alta/búsqueda/resultados se repiten. Extraer casos de uso y adaptadores reduce divergencias al introducir relecturas. | `app/add/page.tsx`; `app/start-reading/page.tsx`; `app/book/[id]/page.tsx`; `components/ReadingGoalCard.tsx`. |
| Media | **Etiquetas semanales sin año y usadas como key, verificado.** | Distintos años pueden generar etiquetas iguales: ambigüedad y claves React repetidas. Usar identidad temporal estable e incluir año visible. | `app/estadisticas/page.tsx:56,108-121`. |
| Media | **Accesibilidad semántica incompleta, verificada en marcado.** | Búsquedas sin label asociado; meta sin asociación label/input; estrellas sin nombre explícito; toggles sin estado semántico. Revisar con teclado/lector además de corregir marcado. | `app/add/page.tsx:86-93`; `app/start-reading/page.tsx:207-215`; `components/ReadingGoalCard.tsx:77-90`; `app/book/[id]/page.tsx:41-100`. |
| Baja | **Diagnóstico y documentación de plantilla, verificado.** | Revisar exposición de `/test-connection` y documentar instalación, datos, secretos por nombre y operación real. | `app/test-connection/page.tsx`; `README.md`; `.env.local.example`. |

Las validaciones de objetivos, calificación y escalas existen en UI, pero no demuestran restricciones equivalentes en la base (`components/ReadingGoalCard.tsx:25-31`; `app/book/[id]/page.tsx:76-101,225-227`). Tampoco se comprobó si datos legados cumplen esas reglas.

### Decisiones que las especificaciones deberán resolver

- **Identidad y relecturas:** separar catálogo/edición de lecturas permite historial y evaluaciones por lectura, a cambio de relaciones y migración más complejas. Mantener una fila por lectura con metadatos repetidos simplifica la transición, pero exige una identidad compartida y reglas claras de deduplicación. No se eligió una alternativa en esta auditoría.
- **Acceso a datos:** Supabase directo desde cliente puede mantenerse con políticas verificadas y restricciones consistentes. Una capa servidor facilita centralizar invariantes, cuotas y errores, pero agrega responsabilidades operativas. Mover llamadas al servidor no sustituye autorización.
- **Privacidad:** aplicación individual protegida por infraestructura versus autenticación propia con propiedad de registros. La primera reduce implementación de cuentas, pero exige demostrar el perímetro; la segunda permite aislamiento explícito con mayor complejidad de sesión y políticas.
- **Proveedores y visuales:** mantener Gemini/Open Library acelera reutilización, pero requiere contratos robustos y estrategia ante indisponibilidad. Conservar Three.js es una decisión de producto/rendimiento, no una necesidad del registro de lecturas.

## 11. Pruebas existentes y cobertura pendiente

### Inventario comprobado

- No se identificaron archivos propios `*.test.*`, `*.spec.*`, suites unitarias/de integración/E2E ni directorios de pruebas en el inventario, excluyendo dependencias y generados.
- `package.json:5-32` no declara runner, scripts de pruebas o dependencias de testing. `eslint.config.mjs` configura análisis estático; **lint no reemplaza pruebas**.
- No se identificaron workflows de CI ni configuración de cobertura en archivos versionados.
- `app/test-connection/page.tsx` es una página manual de diagnóstico, sin assertions ni runner. No acredita cobertura.
- La ausencia de suites encontradas no permite asignar un porcentaje de cobertura medido. No se ejecutó ni generó un reporte.

### Casos prioritarios para caracterizar antes de v2

| Área | Casos sin cobertura automatizada identificada | Código de referencia |
| --- | --- | --- |
| Estados y evaluación | Pendiente → leyendo → terminado; valoración requerida; campos opcionales/null; finalizar vs. editar sin alterar finalización. | `app/book/[id]/page.tsx:157-264` |
| Seguimiento e historial | Actividad actual solo timestamp; futuras reglas de progreso/relectura sin perder lecturas previas. | `app/book/[id]/page.tsx:181-200`; `types/database.ts` |
| Fechas, metas y estadísticas | Zonas horarias, medianoche, límites año/mes/semana, períodos vacíos, orden y claves semanales entre años. | `app/page.tsx:12-25,91-96`; `app/estadisticas/page.tsx:24-39,92-122` |
| Metas | Entero positivo, creación/edición, error al cargar, filas duplicadas y escrituras concurrentes. | `components/ReadingGoalCard.tsx:25-72`; `app/page.tsx:78-81` |
| Catálogo | Query vacía, sin resultados, primer autor/portada ausentes, red/HTTP/JSON inválidos y shape inesperado. | `app/api/search-books/route.ts`; pantallas de alta. |
| Foto/IA | Multipart inválido, archivo ausente/tipo/tamaño, título vacío, fences/braces/escapes, salida inválida, reintentos 503 y otros errores. | `app/api/parse-book-photo/route.ts`; `app/start-reading/page.tsx:70-99` |
| Persistencia y acceso | Altas repetidas, recuperación de errores, restricciones reales, RLS y permisos por rol en un entorno autorizado. | `lib/supabase.ts`; mutaciones cliente citadas. |
| Interfaz | Carga/error/no encontrado, confirmación, teclado, nombres accesibles, lectura móvil y movimiento reducido/WebGL. | Páginas cliente; `components/HeroBook.tsx`; `components/ReadingGoalCard.tsx`. |
| Migración futura | Preservación de IDs/referencias, fechas originales, nulls, notas y evaluaciones; reglas de duplicación y conteos antes/después. | `types/database.ts`; flujos persistidos de sección 6. |

Los contratos de proveedores deberían probarse con dobles/respuestas controladas, sin depender de consumir APIs reales en cada prueba. La verificación de políticas requiere un backend de prueba autorizado; no debe ejecutarse contra datos personales sin planificación.

## 12. Recomendaciones priorizadas y verificaciones pendientes

Estas recomendaciones **no se ejecutaron** como parte de la auditoría.

1. **Establecer la verdad del backend antes de migrar:** inventario autorizado de esquema real, constraints, defaults, índices, políticas, permisos y datos; respaldo y procedimiento de restauración. Comparar contra `types/database.ts` y registrar discrepancias.
2. **Especificar conceptos antes de rediseñar pantallas:** identidad de libro/edición, lectura y relectura; progreso/actividad; evaluación por lectura o libro; año de conteo; fechas calendario y zona horaria. Definir tratamiento de duplicados y nulos legados sin inventar historia.
3. **Resolver perímetro y consumo:** confirmar acceso privado o diseñar autenticación/autorización; validar RLS y cuotas. Establecer límites de imagen, tiempos máximos y manejo seguro de errores/logs de IA.
4. **Recuperar reproducibilidad en una tarea separada:** Node compatible con todos los engines declarados, pin de runtime/gestor y documentación operativa. Después, validar tipos/lint y preparar pruebas de caracterización, sin interpretar artefactos antiguos como evidencia.
5. **Crear una red de pruebas previa al cambio de modelo:** priorizar fechas, transiciones, conteos, error de meta, duplicados, contratos de proveedor y permisos. Diseñar verificaciones de integridad antes/después y reversión para una futura migración.
6. **Refactorizar de forma incremental, no reescribir por defecto:** conservar adaptadores y conceptos útiles, separar UI/datos/reglas, reforzar validación runtime y revisar paginación/agregación según volumen real. Evaluar escena 3D y dependencias no referenciadas con el rediseño.

### No se pudo comprobar

- Conexión y contenido reales de Supabase; tipos SQL, constraints, defaults, índices, triggers, RLS, roles, respaldos o consistencia de filas existentes.
- Estado de despliegue, acceso público/privado, secretos operativos, cuotas y observabilidad externos al repositorio.
- Disponibilidad efectiva de Open Library/Gemini, validez del modelo configurado, calidad de reconocimiento y retención de imágenes por el proveedor.
- Que el estado actual compile, pase lint/tipos o funcione en navegador; tampoco accesibilidad completa, compatibilidad móvil/WebGL o rendimiento.
- Fallos temporales, duplicados o problemas de concurrencia reproducidos con datos reales. Se documentan como riesgos de implementación, no como incidentes confirmados.

La siguiente fase SDD debería usar este inventario como línea base, manteniendo separadas las capacidades verificadas del legado, los requisitos nuevos y las verificaciones externas pendientes.
