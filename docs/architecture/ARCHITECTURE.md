# Book Diary v2 — Arquitectura de software

**Ruta:** `docs/architecture/ARCHITECTURE.md`  
**Estado:** EDICIÓN CONSOLIDADA PARA REVISIÓN — arquitectura candidata, no aprobada; no autoriza implementación ni cambios en Supabase ni cierra Fase 0  
**Fecha de edición:** 19 de octubre de 2026  
**Idioma:** español · **Formato:** Markdown portable · **Alcance:** MVP

## 1. Propósito y trazabilidad

Definir una arquitectura candidata, incremental y verificable para Book Diary v2, separando lo observado en v1 de las propuestas de diseño técnico. No constituye un mandato de reescritura, un esquema SQL ni una aprobación para desplegar.

**Fuentes del proyecto:**
- `docs/CURRENT_STATE.md`: auditoría estática de v1 en commit `b1d32f80a48e8bad2cc9b6a790a997afc265cd32`; no equivale a pruebas en ejecución.
- `docs/product/PRODUCT.md`: visión, alcance y reglas del producto.
- `docs/product/REQUIREMENTS.md`: RF-001–RF-022 y RNF-001–RNF-006.
- `docs/design/DESIGN.md` y `docs/design/INTERACTIONS.md`: dirección visual y comportamientos.
- `docs/architecture/DATA_MODEL.md`: modelo lógico propuesto; todavía no aprobado como esquema físico.
- `docs/DECISIONS.md`: fuente canónica de DEC-001–DEC-041 aprobadas y las subdecisiones OPEN-01–08 / TECH-01–02 todavía pendientes.
- `docs/PHASE_0_REPORT.md`: revisión histórica del 18/10/2026 y actualizaciones de estado posteriores; hallazgos H-01–08 como base de la consolidación y A-01–05 parcialmente resueltas por DEC-033–037, sin cerrar pendientes técnicos.
- `docs/IMPLEMENTATION_PLAN.md`: plan candidato de fases y puertas de aprobación.
- `docs/SYNC_REPORT.md`: alcance y trazabilidad de la consolidación editorial.

**Precedencia:** decisiones aprobadas de `docs/DECISIONS.md` > especificaciones coherentes con ellas > propuestas técnicas; las observaciones del legado describen v1 y no definen v2. Las DEC relevantes están integradas en el cuerpo de esta edición, sin aprobar la topología, los contratos físicos ni el esquema remoto. Ante contradicción o punto abierto, registrar la discrepancia; no inventar una decisión.

**Bloqueos vigentes:** subdecisiones restantes de OPEN-01–08 y TECH-01/02. DEC-033–041 fijan año mínimo al finalizar, activas globales, sección «Abandonados», archivo privado de campos históricos fuera del MVP, estado sin meta, formato por lectura, misma lectura lógica al retomar con historial preservado, recuperabilidad de lecturas eliminadas y libro único por obra con edición opcional en cada lectura. No seleccionan SSR/CSR, librerías, algoritmo, correo, proveedor/modelo IA, estructura física del historial/ediciones/recuperación ni SQL. Ninguna OPEN/TECH completa ni Fase 0 quedan cerradas por esta edición.

## 2. Estado observado en v1 (evidencia, no propuesta)

La auditoría identifica Next.js 16.2.0 (App Router), React 19.2.4, TypeScript, Tailwind 4, Supabase JS, Open Library, Google GenAI y una escena React Three Fiber. Las páginas y componentes mezclan interfaz, consultas y mutaciones; algunas lecturas se hacen desde servidor y otras escrituras directamente desde el navegador. Hay dos Route Handlers: `/api/search-books` y `/api/parse-book-photo`. El modelo actual mezcla datos del libro y de una lectura en `books`; las metas se guardan en `reading_goals`.

**No se verificó** el esquema SQL real, RLS, autenticación externa, despliegue, funcionamiento de APIs, compilación, pruebas automatizadas ni integridad de los datos desplegados. La auditoría tampoco identificó un mecanismo propio de login o controles de propietario. Esto **no prueba** que el backend esté abierto; obliga a comprobar permisos efectivos antes de publicar o migrar.

Referencias del código auditado: `lib/supabase.ts`, `types/database.ts`, `app/page.tsx`, `app/start-reading/page.tsx`, `app/book/[id]/page.tsx`, `app/api/search-books/route.ts`, `app/api/parse-book-photo/route.ts`, `components/ReadingGoalCard.tsx`, `components/HeroBook.tsx`.

El delta de repositorio y diagnóstico local posterior se registra en `docs/PHASE_0_REPORT.md §5`. Ni la operatividad local de Node ni la compatibilidad semver de metadatos equivalen a elegir runtime, validar la aplicación o certificar Supabase; TECH-02 y OPEN-07 siguen pendientes. No se modifica la auditoría histórica.

## 3. Principios arquitectónicos propuestos

1. **Evolución incremental:** conservar el stack y los adaptadores útiles mientras se separan responsabilidades; no reescribir por defecto.
2. **Dominio independiente de la UI:** reglas de lecturas, fechas parciales, relecturas y metas expresadas en funciones/casos de uso testeables.
3. **Seguridad verificable:** autorización para toda escritura, incluso si se oculta el botón en la UI; RLS y/o comprobaciones de servidor acordes con la identidad elegida.
4. **Datos históricos primero:** ningún cambio destructivo sin inventario real, respaldo probado, migración ensayada y reversión.
5. **Integraciones reemplazables:** la UI no depende de las respuestas específicas de Open Library, Google Books ni del proveedor IA elegido posteriormente; Gemini es evidencia de v1, no una selección definitiva de v2.
6. **Experiencia progresiva:** ilustraciones y animaciones no bloquean lectura, navegación, teclado ni dispositivos modestos.
7. **Estados explícitos:** carga, vacío, error y éxito son distinguibles; no presentar un fallo de consulta como «no hay libros».

Estos principios son recomendaciones de arquitectura, **pendientes de aprobación**.

## 4. Diagrama lógico candidato

```text
Visitante / propietaria
         │
         ▼
Next.js (App Router)
  ├─ Presentación pública: hero, fachada, año, árbol dinámico/librero, detalle
  ├─ Presentación propietaria: agregar en navegación, editar desde detalle, metas
  ├─ Casos de uso: catálogo, lecturas/retomada, metas, calendario
  ├─ Adaptadores de datos / repositorios ───────────────► Supabase
  │                                                  (tablas + políticas)
  └─ Endpoints servidor de integración
        ├─ búsqueda bibliográfica ─────────────────────► Open Library + Google Books
        └─ foto / asistencia manual IA ────────────────► proveedor/modelo por definir

Autenticación: enlace mágico por correo (DEC-009)
Identidad autorizada, sesión + permisos efectivos: DISEÑO PENDIENTE (OPEN-01)
```

**Importante:** el diagrama indica responsabilidades, no una decisión definitiva sobre si todas las mutaciones serán Server Actions, Route Handlers o llamadas autorizadas directamente a Supabase. Ese límite debe resolverse tras OPEN-01 y el inventario de RLS.

## 5. Capas y responsabilidades propuestas

| Capa | Responsabilidad | No debe hacer |
| --- | --- | --- |
| Presentación | Renderizar vistas responsive, estados y accesibilidad; iniciar acciones del usuario. | Implementar reglas de conteo, confiar en ocultar controles como seguridad. |
| Casos de uso | Crear/corregir libros, iniciar/finalizar/editar lecturas, retomar abandonadas conservando historial (mecanismo pendiente), relecturas, metas y selección de año. | Depender de componentes React o de JSON sin validar de terceros; equiparar por inferencia retomada y relectura. |
| Dominio | Validar estados, precisión de fechas, pertenencia de lectura, conteos y restricciones. | Conocer proveedores externos o detalles visuales. |
| Persistencia | Leer/escribir `books`, `readings`, `reading_goals`; mapear errores; aplicar límites y consultas eficientes. | Suponer restricciones SQL no comprobadas. |
| Integraciones | Normalizar Open Library + Google Books y propuestas de foto/IA; manejar timeouts, errores, cuotas, formatos y procedencia. | Persistir automáticamente datos ambiguos sin revisión humana. |
| Autorización | Determinar propietario y proteger mutaciones y recursos costosos. | Confiar únicamente en checks del cliente. |

**Organización de carpetas candidata (no orden de implementación):**

```text
app/                       # rutas y composición de pantallas
components/                # UI y visuales
features/books/            # casos de uso y componentes de catálogo
features/readings/         # casos de uso y componentes de lecturas
features/goals/            # casos de uso y componentes de metas
lib/domain/                # reglas puras compartidas
lib/integrations/          # adaptadores Open Library, Google Books e IA por definir
lib/data/                  # acceso a datos y mapeos
lib/auth/                  # acceso/identidad, por decidir
types/                     # contratos y tipos de frontera
```

La distribución física exacta queda abierta; no crear carpetas vacías solo por este esquema.

## 6. Flujos funcionales

### 6.1 Explorar biblioteca pública (RF-001, RF-003–RF-006)

1. El visitante abre el sitio y puede explorar sin iniciar sesión.
2. Se muestra el año elegido y su meta, si existe; si no hay meta, mostrar exactamente **«Sin meta establecida»** y permitir crearla a la propietaria autorizada (DEC-037). Las lecturas finalizadas se filtran por **año de finalización**, no por inicio.
3. Se agrupan por mes; un año conocido sin mes va a «Sin mes registrado».
4. «Actualmente leyendo» ocupa la rama superior distinguible de los meses (DEC-007) y muestra **todas las lecturas activas independientemente del año seleccionado** (DEC-034). No aplicar el filtro anual de finalizados a esa consulta; layout/algoritmo/rendimiento pendientes OPEN-06/TECH-02.
5. Seleccionar un lomo abre el detalle de **esa lectura**, no una ficha genérica que mezcle relecturas: panel lateral en escritorio y bottom sheet en móvil (DEC-020/021).
6. Las consultas devuelven estados diferenciados: cargando, sin datos, error y datos disponibles.
7. Las abandonadas se conservan en **«Abandonados»**, con fechas y notas y posibilidad de retomada por la propietaria, sin contar como completadas (DEC-035). Diseño concreto de la sección e inventario público de sus campos pendientes; no publicar notas por inferencia.

Las nuevas finalizaciones requieren **al menos año** y admiten mes/día desconocidos sin inventarlos (DEC-033). Los registros legados v1 sin año se conservan sin inventarlo ni descartarlos: mapeo y tratamiento seguro pendientes OPEN-07/08. Los campos históricos fuera del MVP van a **archivo privado**, sin exposición pública ni borrado (DEC-036); eso no archiva todo v1 ni aprueba publicar notas de «Abandonados». El inventario público restante sigue pendiente OPEN-01.

**Propuesta técnica:** preparar una proyección de biblioteca anual con `book` + `reading` y conteos derivados; evitar cargar toda la historia para cada cambio de año. Paginación/límites se dimensionarán con datos reales. No se fija aún SSR, RSC o estrategia de caché por vista.

### 6.2 Agregar o corregir un libro (RF-007–RF-010)

```text
Título/autor ─────────────► Open Library + Google Books ──┐
Fotografía ─► propuesta IA ─► búsqueda dual ──────────────┤
Alta manual + asistencia IA disponible ──────────────────┘
                                                        │
                                         formulario editable + revisión
                                                        │
                                              confirmación explícita
                                                        ▼
                                         validar + guardar libro
                                         [iniciar lectura opcional]
```

- La búsqueda y enriquecimiento usan **Open Library + Google Books** (DEC-010); prioridad, mezcla y resolución de conflictos pendientes OPEN-02.
- Foto/IA precarga un **formulario editable** y requiere confirmación humana antes de guardar (DEC-011). No confundir reconocimiento con persistencia automática.
- Si no hay coincidencia, ofrecer registro manual asistido por IA; sugerencias revisables, sin presentar inferencias como hechos. Un fallo de búsqueda o IA no impide el alta completamente manual (DEC-012).
- **Propuesta técnica:** normalizar proveedores a un contrato interno; conservar procedencia/IDs externos solo cuando sean confiables. La forma concreta sigue pendiente.
- **No asumir** que una portada externa sirve para representar el lomo; el lomo es una representación visual.
- Si se detecta un libro existente, ofrecer nueva lectura/relectura o corregir metadatos, sin duplicar automáticamente ni sobrescribir lecturas (DEC-001). Un libro representa la obra y agrupa sus ediciones; cada lectura puede referir opcionalmente a una edición (DEC-041). Identificación, estructura técnica y deduplicación siguen abiertas (OPEN-03).
- «Agregar libro» está en navegación solo para la propietaria autorizada; la edición se inicia desde el detalle, sin dashboard independiente obligatorio (DEC-025/026). Ocultar controles no reemplaza autorización.

### 6.3 Lecturas, relecturas y fechas (RF-012–RF-017)

- Una lectura pertenece a un libro; varias lecturas pueden compartir `book_id`.
- Finalizar y editar una lectura nunca debe sobrescribir otra relectura.
- Estados aprobados: **Leyendo, Terminado y Abandonado**; no añadir Pausado. Las abandonadas no cuentan como completadas y se conservan en **«Abandonados»** con sus lecturas, fechas y notas; la propietaria puede retomar (DEC-014/035). Coherencia de fechas, transiciones adicionales y calificación al abandonar pendientes OPEN-04.
- Al iniciar, registrar libro, fecha de inicio y formato; obligatoriedad/precisión del inicio pendiente (DEC-015, OPEN-04). Formatos fijos **Físico, Kindle, iPad, Audiolibro y Otro**; un valor editable por lectura, sin historial de formatos aprobado. Valor vacío y detalle de «Otro» pendientes (DEC-002/016).
- Finalización minimalista: fecha de finalización, calificación **opcional 0.5–5 en pasos de 0.5** (`null`, no cero) y opinión opcional; no exigir recomendación, intención de releer ni enganche (DEC-003/004).
- Finalizar **requiere al menos año** y admite día/mes/año, mes/año o solo año sin inventar componentes (DEC-005/033). Rechazar la nueva finalización sin año; la preservación y el mapeo de registros v1 sin año son otro problema y siguen pendientes OPEN-07/08, sin descartarlos ni fabricarles fechas.
- Una lectura terminada cuenta **una vez** en la meta del año conocido de finalización; una relectura terminada cuenta como otra lectura. El mapeo de casos v1 sin año no se decide a partir de esa fórmula.
- Retomar una abandonada conserva la **misma identidad lógica de lectura** y todo el historial de abandono/reanudación sin sobrescribirlo/perderlo (DEC-039); no es una relectura nueva. La persistencia/orden físico del historial sigue pendiente OPEN-04/TECH-01; no se prescribe una fila única, una tabla de eventos ni fechas concretas.
- **Borrado aprobado (DEC-008/040):** bloquear eliminación de libro con cualquier lectura asociada, sin cascada implícita; una lectura eliminada debe ser recuperable. La estrategia física o equivalente, consultas/conteos, restauración, conflictos y compatibilidad con el bloqueo de libro siguen pendientes OPEN-03. No proponer eliminación irreversible ni asumir que una lectura recuperablemente eliminada deja de estar asociada.
- Un libro agrupa las ediciones de una obra y cada lectura puede registrar opcionalmente la edición utilizada (DEC-041). La normalización, estructura, metadatos e identificación/deduplicación siguen pendientes OPEN-03; no exigir ISBN ni tabla de ediciones.
- El formato es un atributo de cada lectura y puede diferir entre lecturas del mismo libro (DEC-038); no es un atributo del libro.
- Las restricciones físicas y casos de uso quedan bloqueados donde dependan de esas reglas abiertas; ningún tipo local prueba constraints remotos.

### 6.4 Metas (RF-018–RF-019)

- Crear, editar y eliminar la meta de cualquier año sin cambiar lecturas.
- Calcular progreso desde lecturas terminadas del año; no guardar el conteo como dato editable.
- Mostrar **indicador circular y conteo explícito**, por ejemplo «12 de 20 libros» (DEC-030); preservar el conteo real al superar el objetivo. La representación del exceso, límites del objetivo y unicidad siguen pendientes como asunto adicional de modelo relacionado con TECH-01/02 (A-05 de `docs/PHASE_0_REPORT.md`), sin incorporarlos por inferencia al alcance canónico de OPEN-04.
- Manejar explícitamente error de consulta y ausencia de meta; v1 confunde estos casos en ciertos flujos.
- Si no existe meta, mostrar exactamente **«Sin meta establecida»**; la propietaria autorizada puede crearla (DEC-037). No inventar objetivo ni interpretar un error de consulta como ausencia. Esta regla no aprueba unicidad, rango ni comportamiento del círculo al superar objetivo.

## 7. Identidad, seguridad y privacidad — bloqueo de diseño

**Objetivo confirmado:** cualquier visitante puede leer la biblioteca y solo la propietaria puede modificarla (RF-001, RF-002, RNF-001).

**Aprobado DEC-009:** inicio de sesión mediante enlace mágico por correo. **Pendiente OPEN-01:** identidad expresamente autorizada, altas de cuentas ajenas, sesión/expiración/revocación, propiedad de registros y operaciones públicas/privadas; verificar RLS, grants y permisos efectivos en Supabase. Estar autenticado no equivale a ser la propietaria. **Aprobado DEC-036:** los campos históricos v1 fuera del MVP se conservan en archivo privado, sin exposición pública ni borrado; no archivar todo v1 ni publicar notas de abandonadas por inferencia. El inventario de campos públicos restante sigue pendiente. Formato, ubicación, protección, almacenamiento y verificación del archivo requieren OPEN-07/08; no se autoriza crearlo ni extraer datos. Una clave `anon` visible en navegador no es por sí sola una filtración, pero exige permisos correctos. Pasar una escritura al servidor **no reemplaza** autorización.

**Requisitos de seguridad propuestos:**
- Comprobar autorización en cada alta, edición y eliminación, y en el acceso a endpoints con coste o información sensible.
- No enviar `GEMINI_API_KEY` al cliente ni copiar secretos a documentación o logs.
- Aplicar validación del lado servidor o de la base para invariantes críticas, además de validación en UI.
- Limitar solicitudes a servicios externos, tamaño y tipo real de imágenes, duración, reintentos y exposición de errores.
- Retención de fotografías y reglas de borrado por definir (OPEN-02).
- Revisar la exposición de `/test-connection` antes de publicar.

**No redactar ni ejecutar políticas RLS definitivas** hasta inspeccionar el esquema y decidir identidad/propiedad.

## 8. APIs e integraciones — contratos candidatos

| Operación lógica | Entrada | Salida interna | Comportamiento ante error |
| --- | --- | --- | --- |
| `searchBooks` | texto de búsqueda para Open Library + Google Books | resultados normalizados con título, autores, portada, IDs/procedencia disponibles | error controlado o sin resultados; mezcla y fallo parcial pendientes OPEN-02, sin fabricar libros |
| `parseBookPhoto` | imagen validada | candidato a título/autor | error controlado y alternativa manual |
| `assistManualEntry` | datos manuales por completar | sugerencias IA revisables en formulario editable | fallo no bloquea entrada manual; sin guardar inferencias automáticamente |
| `saveBook` | metadatos revisados | libro persistido | validación, conflicto o error explícito |
| `startReading` | `book_id` y datos de lectura | nueva lectura | error explícito, sin duplicación accidental por reintento |
| `finishReading` | `reading_id`, fecha con **al menos año**, calificación opcional 0.5–5/paso 0.5 y opinión opcional | lectura finalizada sin inventar mes/día | rechazar nueva finalización sin año (DEC-033); validar permisos y consistencia restante según reglas por cerrar |
| `resumeReading` | identificación de lectura abandonada; demás datos por definir | retomada de la misma identidad lógica, con historial de abandono/reanudación preservado | estructura física, orden/fechas y reglas adicionales pendientes; no crear otra lectura lógica ni prescribir una tabla de eventos (DEC-039) |
| `deleteBook` | identificador de libro | eliminación solo si no tiene lecturas | bloquear con lecturas asociadas; no cascada implícita; confirmación/política física pendientes |
| `manageGoal` | año y objetivo o eliminación | meta resultante | diferenciar ausencia, conflicto y error |
| `loadGoal` | año consultado | meta o ausencia explícita para «Sin meta establecida» | error no equivale a ausencia; creación reservada a propietaria autorizada (DEC-037) |

Son **contratos candidatos de dominio**, no endpoints HTTP aprobados ni promesa de una API pública. La elección de Open Library + Google Books ya está aprobada, pero no obliga a instalar un SDK concreto ni autoriza consumir servicios. Para foto, la auditoría identificó uso v1 de Gemini y ausencia de límites explícitos de tamaño/cuota/timeout; protección y proveedor/modelo definitivo requieren OPEN-02 antes de implementar/publicar.

## 9. Renderizado, diseño y rendimiento

- **Escritorio:** hero a pantalla completa «Book Diary», sakura que se abre progresivamente con scroll reversible → fachada rotulada exactamente **«Book Diary»** → aproximación visual a la puerta → biblioteca (DEC-017/018/032). La técnica 2D/3D no está elegida.
- **Árbol dinámico:** estructura y ramas adaptadas al volumen de libros por mes, sin geometría rígida ni capacidad arbitraria; doce meses identificables y accesibles, incluidos vacíos con repisa y pequeño adorno. Rama superior «Actualmente leyendo» con **todas las activas sin filtro del año seleccionado** (DEC-006/007/031/034); algoritmo/layout/rendimiento pendientes OPEN-06/TECH-02.
- **Exploración:** selector horizontal de años, meta circular con conteo, lomos que salen/giran hacia portada y detalle en **panel lateral**; cierre devuelve navegación (DEC-019/020/024/030).
- **Estados de producto:** sección «Abandonados» con conservación de fechas/notas y posibilidad de retomar por la propietaria; diseño concreto e inventario de campos públicos pendientes (DEC-035, OPEN-01/05). Sin meta, texto exacto «Sin meta establecida» y creación disponible para propietaria (DEC-037), sin fijar rango/unicidad/exceso.
- **Móvil:** librero vertical simplificado, repisas horizontales desplazables y **bottom sheet** accesible; no exigir hover, WebGL ni animación compleja del árbol (DEC-021).
- **Lenguaje:** UI funcional minimalista, solo tema claro, español; ilustración principalmente en hero y pequeños acentos. Animaciones mágicas discretas sin obstaculizar lectura/interacción (DEC-022/023/027/028).
- **Accesibilidad:** navegación completa con teclado, foco visible, controles semánticos y alternativa funcional equivalente para `prefers-reduced-motion`, sin interruptor manual obligatorio (DEC-029).
- **Rendimiento propuesto:** cargar imágenes e ilustraciones de manera progresiva; reservar espacio para evitar saltos; ofrecer fallback estático si una escena avanzada no es viable. El uso de Three.js **no está aprobado** como solución para el árbol: v1 solo prueba la presencia de una escena decorativa.
- **Año seleccionado:** reorganizar suavemente ramas y contenido según volumen; conservar identidad navegable y foco, **no geometría fija**. Equivalencia sin animaciones (DEC-019); algoritmo, interrupciones, densidad y presupuestos siguen pendientes OPEN-06/TECH-02.

Los tiempos exactos, easing, breakpoints y tecnologías de animación deben respetar `DESIGN.md` e `INTERACTIONS.md` cuando se aprueben. No inferirlos de una imagen conceptual.

## 10. Estrategia de transición desde v1 — NO EJECUTAR

1. Confirmar versión del repositorio, entorno de ejecución y conexión autorizada.
2. Obtener inventario **real** de tablas, columnas, defaults, constraints, índices, RLS, roles, volúmenes y calidad de datos; contrastar con `types/database.ts`.
3. Inventariar y mapear registros `quiero_leer` y campos legados (`would_recommend`, `would_reread`, `engagement`, `last_updated_at`, `notes`, etc.) sin inventar relecturas ni perder notas. **Conservar todos los registros v1** (DEC-013); los campos históricos fuera del MVP tienen destino aprobado **archivo privado**, no público y sin borrado (DEC-036). El destino/mapeo de todos los registros no queda decidido ni se archiva todo v1. Formato, ubicación, protección, almacenamiento y verificación del archivo pendientes OPEN-07/08; no se autoriza extracción ni creación.
4. Aprobar el modelo físico, restricciones, estrategia de IDs y mapeo de datos.
5. Crear respaldo verificable y ensayo de restauración; diseñar migración reversible e idempotente en entorno de prueba.
6. Comparar conteos, relaciones, fechas parciales, evaluaciones, notas y metas antes/después. Preservar casos v1 sin año sin fabricarlo ni descartarlos; resolver su mapeo seguro antes de transformar. La nueva validación de finalización con año mínimo no es permiso para perder legado.
7. Solo con autorización explícita, planear ejecución y despliegue por etapas con observación y plan de reversión.

**Prohibido en esta fase:** cambiar tablas, ejecutar migraciones, limpiar datos, modificar permisos remotos o reemplazar la aplicación en producción.

## 11. Pruebas y calidad — plan candidato

| Nivel | Verificaciones prioritarias | Referencias |
| --- | --- | --- |
| Dominio (unitarias) | nueva finalización exige año sin inventar mes/día; relecturas independientes, rating nullable 0.5–5/paso 0.5, formato por lectura, abandono excluido de metas, misma lectura lógica al retomar e historial preservado; transiciones/coherencia y persistencia física pendientes | RF-004, RF-013–RF-019; DEC-002–005/014–016/033/035/038/039 |
| Integración de adaptadores | respuesta vacía/inválida, fallos parciales y límites de Open Library + Google Books, foto/IA con formulario editable, confirmación, asistencia manual y fallback si IA falla | RF-007–RF-010, RNF-004; DEC-010–012 |
| Persistencia/seguridad | inventario público por aprobar, campos históricos fuera del MVP en archivo privado sin exposición/borrado; escrituras solo propietaria, bloqueo de borrado con lecturas, permisos y errores; unicidad de metas por decidir | RF-001, RF-002, RF-011, RNF-001/002; DEC-008/009/036 |
| E2E | alta manual, foto/revisión, relectura, todas las activas al cambiar año, sección Abandonados, retomada autorizada con historia (caso concreto bloqueado hasta definir mecanismo), detalle, ausencia de meta con texto exacto y creación por propietaria, edición/borrado autorizados | RF-003–RF-019; DEC-034/035/037 |
| UX/accesibilidad | teclado/foco, hero reversible y aproximación a puerta, fachada Book Diary, ramas dinámicas y doce meses/meses vacíos accesibles, panel lateral/bottom sheet, selector horizontal, meta circular/conteo, movimiento reducido, claro/español y UI minimalista | RF-003–RF-006, RF-018–RF-022, RNF-003; DEC-006/007/017–032 |
| Migración | preservación de todos los registros, incluidos v1 sin año sin fabricarlo; campos históricos fuera del MVP en archivo privado sin archivar todo v1; comparación antes/después y restauración ensayada | RNF-002; DEC-013/033/036 |

La auditoría no encontró suites de pruebas en v1; **no se ha ejecutado** ninguno de estos casos. TECH-02 debe resolver versión compatible y pin de Node/gestor, runner y estrategia de tipos/lint/pruebas; cada ejecución o cambio requiere autorización específica. El diagnóstico local de `docs/PHASE_0_REPORT.md` no selecciona runtime ni demuestra funcionamiento. **No ejecutar builds bajo la regla vigente**, tampoco como paso futuro implícitamente autorizado de este plan. El alcance de esta edición es exclusivamente documental, sin pruebas ni cambios de entorno.

## 12. Secuencia propuesta para Codex, sujeta a aprobación

**Fase A — cerrar especificaciones:** revisar PRODUCT, REQUIREMENTS, DESIGN, INTERACTIONS, DATA_MODEL y este documento; resolver bloqueos y registrar decisiones en `docs/DECISIONS.md`.

**Fase B — verificar infraestructura y legado:** inventario de Supabase con acceso autorizado, respaldos, runtime reproducible y pruebas de caracterización; sin migrar todavía.

**Fase C — preparar base de dominio y seguridad:** implementar tras aprobación identidad/autorización, modelo y contratos con pruebas; migración primero ensayada.

**Fase D — flujos de producto:** catálogo, lecturas, metas, búsqueda/foto y administración.

**Fase E — experiencia visual:** hero, fachada, árbol, lomos, detalle y móvil; pruebas de accesibilidad/rendimiento.

**Fase F — verificación y publicación:** pruebas integrales, revisión de permisos, datos y observabilidad; despliegue autorizado.

Esta secuencia candidata expresa **dependencias**, no fechas ni permiso de ejecución; no reemplaza la numeración ni las puertas de `docs/IMPLEMENTATION_PLAN.md`. Se debe producir un plan revisable y obtener autorización concreta antes de editar código, entorno o datos; la consolidación editorial no autoriza Fase 1.

## 13. Decisiones abiertas y bloqueos

| ID | Pregunta | Bloquea |
| --- | --- | --- |
| OPEN-01 | Con magic link ya aprobado, ¿qué identidad, sesión y permisos efectivos se verifican en Supabase y endpoints? | Modelo físico, escrituras, despliegue público |
| OPEN-02 | ¿Qué prioridad/mezcla y tratamiento de fallos tendrán ambos catálogos? ¿Qué proveedor/modelo IA, límites y privacidad se aceptan? | Integraciones seguras |
| OPEN-03 | Libro único por obra, edición opcional por lectura y recuperación de lecturas ya aprobados (DEC-040/041). ¿Cómo representar ediciones y detectar duplicados; qué mecanismo recuperable, consultas/conteos, restauración, conflictos y confirmaciones respetan DEC-008? | Integridad del catálogo y borrado/restauración |
| OPEN-04 | Con año mínimo, formato por lectura y misma lectura lógica con historial preservado ya aprobados (DEC-033/038/039), ¿qué inicio/precisión, coherencia, transiciones adicionales, «Otro»/valor vacío, calificación al abandonar y representación física/orden/fechas del historial se aceptan? | Restricciones y formularios afectados |
| OPEN-05 | ¿Qué tokens, tipografías, textos secundarios y recursos finales se aceptan? | UI afectada |
| OPEN-06 | Con todas las activas sin filtro anual ya aprobado, ¿qué algoritmo/layout distribuye meses, rama superior y casos extremos con navegación accesible y rendimiento? | Consulta/presentación afectada, árbol accesible |
| OPEN-07 | ¿Cuál es el esquema remoto real y cómo se respaldará/migrará/revertirá? | Cualquier migración |
| OPEN-08 | Con archivo privado de campos históricos fuera del MVP ya aprobado, ¿qué inventario/mapeo, formato, ubicación, almacenamiento, protección y verificación se aceptan? Destino de registros como «quiero_leer» y mapeo v1 sin año pendientes con OPEN-07. | Migración sin pérdida, sin archivar todo v1 por inferencia |
| TECH-01 | ¿Mutaciones autorizadas por servidor, Supabase cliente con RLS o combinación? | Contratos y límites de capa |
| TECH-02 | ¿Qué runtime/gestor, pruebas/CI, calidad, rendimiento, responsive, recuperación y despliegue se aprobarán? | Reproducibilidad, verificaciones autorizadas y publicación |
| Asunto adicional A-05 (relacionado con TECH-01/02) | ¿Qué unicidad/límites de metas y representación al superar objetivo se aceptan? Ausencia resuelta por DEC-037; asignación formal de lo restante pendiente, no nuevo ID aprobado. | Restricciones y aceptación de metas afectadas |

Los IDs canónicos son los de `docs/DECISIONS.md §6`; no se crean asuntos aprobados mediante este documento. DEC-033–041 resuelven solo las subreglas citadas; ninguna OPEN/TECH completa queda resuelta por esta edición.

**Remapeo editorial para trazabilidad (H-06 de `docs/PHASE_0_REPORT.md`, no decisión técnica):** el antiguo TECH-02 local de este borrador («técnica visual») se referencia ahora como **OPEN-06**, coordinado con **TECH-02** canónico para calidad/rendimiento/responsive y con OPEN-05 para recursos. El antiguo TECH-03 local («runtime/despliegue/pruebas/CI») se referencia como **TECH-02** canónico. TECH-01 mantiene su significado de organización/fronteras/autorización. Los alias históricos se citan solo aquí para reconocer referencias previas; no son nuevos IDs ni elecciones de tecnología.

## 14. Criterios para aprobar ARCHITECTURE.md

- [ ] Producto, requisitos y modelo de datos están revisados y sin contradicciones críticas.
- [ ] Se ha verificado el esquema remoto y existe estrategia de respaldo/restauración.
- [ ] Se definieron identidad autorizada, sesión y controles verificables para magic link ya aprobado.
- [ ] Se acordó cómo preservar los datos históricos y los pendientes.
- [ ] Se aprobaron límites de integraciones y contratos de errores.
- [ ] Se acordó estrategia de renderizado accesible para escritorio y móvil.
- [ ] Existe plan de pruebas y fases de implementación revisable, sujeto a autorización y sin builds bajo la regla vigente.
- [ ] Decisiones y cambios quedaron registrados en `docs/DECISIONS.md`.

**Hasta cumplirlos, este archivo sigue siendo una arquitectura candidata para revisión.** La consolidación editorial no acredita seguridad, esquema real, pruebas, migración ni cierre integral de Fase 0; no autoriza ninguna fase de implementación.
