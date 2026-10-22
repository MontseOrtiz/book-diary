# Book Diary v2 — Informe de Fase 0

> **Nota de lectura — 19/10/2026:** los §§1–10 conservan íntegro el diagnóstico original del 18/10/2026, incluidos sus estados y referencias de líneas de aquel momento. El **§11** registra la consolidación inicial y DEC-033–037; el **§12** registra DEC-001–041 y el inventario Supabase read-only. El **§13** contiene el seguimiento documental más reciente y prevalece en asuntos de estado y trazabilidad sobre los pasajes históricos. Fase 0 no queda cerrada integralmente por esta auditoría documental; el permiso para iniciar una fase, el entorno y el alcance se documentan por separado y no autorizan escrituras remotas.

**Fecha de base:** 18 de octubre de 2026. **Actualización de auditoría remota:** 19 de octubre de 2026.
**Estado:** revisión documental y diagnóstico local completados; decisiones técnicas y cierre integral de Fase 0 pendientes. **Fase 1 no autorizada.**
**Alcance autorizado:** inspección de solo lectura y creación de este informe. No se modificaron aplicación, especificaciones previas, dependencias, configuración, entorno ni datos; no se ejecutaron builds, migraciones ni llamadas al backend.
**Repositorio de referencia:** rama `main`, HEAD `e696ba4710a9b17986123f0ea5c75efa02e66400`. Los documentos no versionados y `AGENTS.md` modificado que ya estaban presentes forman parte de las fuentes revisadas, no de cambios realizados por esta fase.

## 1. Resumen ejecutivo

1. **Existen y se revisaron todas las fuentes solicitadas.** Las seis especificaciones siguen siendo borradores; arquitectura y modelo son candidatos, no aprobaciones técnicas ni SQL verificado. Las 32 decisiones de producto/UX sí están aprobadas en `docs/DECISIONS.md`.
2. **Las 32 decisiones tienen cobertura documental explícita** en la actualización de `docs/product/REQUIREMENTS.md:17–33`. Sin embargo, los cuerpos históricos todavía contienen criterios incompatibles y pendientes ya resueltos. La precedencia documentada evita tomar esos criterios como vigentes, pero no sustituye su consolidación editorial (`docs/SYNC_REPORT.md`, «Revisión antes de implementación»).
3. **Persisten ambigüedades relevantes:** finalización sin año conocido, relación entre año seleccionado y lecturas activas, alcance público de datos legados, transiciones de abandono y contratos de autorización. No se resolvieron por inferencia; se asignan a OPEN/TECH en este informe.
4. **El entorno actual difiere de la auditoría histórica:** Node `v26.2.0` y npm `11.17.0` funcionan para diagnóstico. No se reprodujo el antiguo fallo de Node 21/ICU de `docs/CURRENT_STATE.md`. Los metadatos locales satisfacen los engines revisados, pero no hay runtime fijado ni pruebas de ejecución de la aplicación.
5. **La inspección remota read-only confirmó un riesgo importante de autorización.** Las tablas públicas observadas tienen RLS habilitado, pero políticas permisivas `ALL` para el rol `public` y grants CRUD a `anon`; la exposición efectiva por Data API no se verificó. El esquema y conteos observados ya están inventariados abajo. No se modificó Supabase.
6. **Se actualizan los informes de Fase 0, no se cierra integralmente el plan.** La inspección Supabase y la sincronización de `PHASE_0_REPORT.md`/`SYNC_REPORT.md` documentan el estado remoto y los bloqueos restantes. No hay autorización implícita para Fase 1 ni para cambiar servicios.

## 2. Método, certeza y límites

- **Verificado documentalmente:** archivo presente, texto, IDs, referencias y contradicciones observables.
- **Verificado en código/metadatos:** comportamiento o declaración identificado estáticamente; no significa validación funcional ni en producción.
- **Propuesta:** alternativa para aprobación; no cambia decisiones existentes.
- **No comprobado:** requiere ejecución, servicio remoto, datos o permisos no incluidos en esta revisión.

Se leyeron las fuentes completas, se contrastaron las 32 DEC con las actualizaciones y los criterios históricos, se inspeccionaron código, manifiestos, lockfile y metadatos instalados, y se comparó HEAD con el commit de la auditoría. No se leyeron secretos de `.env.local`; solo se registran nombres de variables documentadas. La consulta de documentación pública oficial para soporte de Node/Next no involucró servicios de la aplicación.

No se ejecutaron aplicación, suites, lint, chequeo de tipos, instalación, actualización, build, auditoría de vulnerabilidades, solicitudes a catálogos/IA/Supabase ni inspección remota. No se midieron cobertura, accesibilidad, rendimiento, costos, licencias ni compatibilidad de despliegue. Los artefactos existentes no prueban que HEAD haya sido validado.

## 3. Estado de las especificaciones

| Fuente revisada | Estado y resultado | Pendiente principal |
| --- | --- | --- |
| `AGENTS.md` | Instrucciones vigentes; distingue v1/v2 y protege datos. | §9 todavía anuncia el plan como siguiente entregable, aunque ya existe. Actualización editorial futura. |
| `docs/DECISIONS.md` | 32 DEC aprobadas; OPEN-01–08 y TECH-01/02 pendientes. Fuente canónica de decisiones. | §§7–8 conservan mandato de sincronización; actualización del estado sin modificar acuerdos. |
| `docs/SYNC_REPORT.md` | Confirma sincronización por secciones «Actualización», no consolidación completa. | Integrar cambios en cuerpos originales y eliminar duplicidad, con autorización. |
| `docs/IMPLEMENTATION_PLAN.md` | Propuesta de fases y puertas de autorización; se revisó especialmente §4. | Cerrar Fase 0 y aprobar alcance concreto de la siguiente fase. Su §14 conserva la autorización de Fase 0 como siguiente acción. |
| `docs/product/PRODUCT.md` | Borrador con actualización vinculante y reglas BR-01–10. | Pendientes históricos, legado, meta sin objetivo, relación activos/año y aprobación formal del documento completo. |
| `docs/product/REQUIREMENTS.md` | Borrador; RF-001–022 y RNF-001–006; actualización cubre las 32 DEC. | Consolidar CA antiguos; completar reglas y casos verificables indicados abajo. |
| `docs/design/DESIGN.md` | Borrador; intención visual aprobada separada de tokens propuestos. | OPEN-05/06; referencias visuales no incluidas en el documento, sin asumir acceso al mockup original. |
| `docs/design/INTERACTIONS.md` | Borrador con INT-001–009 y casos IA-01–11. | Foco/interrupciones, cierre, responsive y depuración de pendientes ya decididos. |
| `docs/architecture/DATA_MODEL.md` | Modelo lógico candidato, con invariantes actualizados. | Identidad, fechas, legado, autorización y esquema real; tabla histórica todavía contradice estados/calificación aprobados. |
| `docs/architecture/ARCHITECTURE.md` | Arquitectura candidata, no topología aprobada. | Límites de mutaciones/sesión, contratos, precedencia, IDs TECH y diagramas históricos incompletos. |
| `docs/CURRENT_STATE.md` | Auditoría histórica del 17/10/2026, commit `b1d32f80a48e8bad2cc9b6a790a997afc265cd32`. | Conservar intacta; las diferencias actuales se registran en este informe. |

**Resultado:** corpus suficiente para continuar análisis y decisiones, **no especificación final completa para implementar**. Las referencias «por crear», «cuando exista» y «pendiente» en cuerpos históricos no acreditan ausencia actual de archivos: por ejemplo, `PRODUCT.md §11`, `DESIGN.md §1` y `ARCHITECTURE.md §1`.

### 3.1 Matriz de las 32 decisiones aprobadas

En las tablas de este informe **P** = `docs/product/PRODUCT.md`; **R** = `docs/product/REQUIREMENTS.md`; **D** = `docs/design/DESIGN.md`; **I** = `docs/design/INTERACTIONS.md`; **M** = `docs/architecture/DATA_MODEL.md`; **A** = `docs/architecture/ARCHITECTURE.md`. Las líneas corresponden al estado inspeccionado. «Reflejada» significa cobertura normativa, **no implementación ni aprobación de subdecisiones técnicas**.

| DEC | Regla aprobada reflejada | Evidencia principal | Límite o cierre pendiente |
| --- | --- | --- | --- |
| 001 | Libro existente: relectura o corrección, sin sobrescritura automática. | R:27; M:12 | Identidad obra/edición y deduplicación OPEN-03. |
| 002 | Físico, Kindle, iPad, Audiolibro, Otro; lista fija. | R:25; M:13 | Valor vacío y detalle de «Otro»: OPEN-04. |
| 003 | Calificación opcional 0.5–5, paso 0.5, por lectura. | R:26,35,213; M:14 | Sustituir rango histórico incompatible; `null` no es cero. |
| 004 | Finalización minimalista: fecha; calificación y opinión opcionales. | R:26,211 | Precisar obligatoriedad de fecha/año: OPEN-04. |
| 005 | Fechas completas, mes/año o año sin inventar partes. | R:19,26,94–100; M:15 | Fechas desconocidas, consistencia y datos legados. |
| 006 | Árbol dinámico según volumen mensual, sin ocultar libros. | R:19,31; D:14–15 | Algoritmo, densidad y rendimiento OPEN-06. |
| 007 | Rama superior «Actualmente leyendo», distinta de meses. | R:19; D:15 | Relación activos/año seleccionado aún abierta. |
| 008 | Bloquear borrado de libro con lecturas; no cascada implícita. | R:24,35; M:16 | Confirmación y reversibilidad OPEN-03; la prohibición ya está decidida. |
| 009 | Magic link, consulta pública y escritura solo identidad autorizada. | R:17; A:12 | Identidad, sesión, permisos y RLS OPEN-01. |
| 010 | Open Library + Google Books. | R:21; A:13 | Prioridad, normalización, discrepancias/licencias/cuotas OPEN-02. |
| 011 | Foto/IA precarga formulario editable; confirmación humana. | R:22; I:16 | Archivos, privacidad, cuotas y fallos OPEN-02. |
| 012 | Alta manual asistida por IA, sin depender de que IA funcione. | R:23; I:16 | Procedencia y validación de sugerencias OPEN-02. |
| 013 | Preservar todos los registros v1 con migración protegida. | R:28; M:18 | Inventario, respaldo, mapeo y reversión OPEN-07/08. |
| 014 | Leyendo, Terminado, Abandonado; abandono no cuenta. | R:19,29; M:13,15 | Transiciones, ubicación y evaluación al abandonar OPEN-04. |
| 015 | Inicio con libro, fecha y formato. | R:25; M:13 | Obligatoriedad y precisión de inicio OPEN-04. |
| 016 | Editar un formato por lectura; no historial de formatos aprobado. | R:25,228; M:13 | Validación de campos OPEN-04. |
| 017 | Hero completo y sakura reversible por scroll. | R:30; D:13; I:12 | Parámetros/fallback; ampliar CA atómicos sin cambiar intención. |
| 018 | Aproximación visual a la puerta antes de biblioteca. | R:30; D:13; I:12 | Técnica y CA específico del acercamiento y alternativa accesible. |
| 019 | Cambio de año reorganiza suavemente las ramas. | R:18,31; D:14; I:13 | Eliminar CA históricos de geometría fija; interrupciones. |
| 020 | Lomo sale/gira y detalle en panel lateral de escritorio. | R:20; D:16; I:14 | Patrón de foco, cierre y animaciones interrumpidas. |
| 021 | Bottom sheet móvil y repisas horizontales simplificadas. | R:20,32; D:16; I:15 | Foco, cierre, breakpoints y gestos accesibles. |
| 022 | UI funcional minimalista; ilustración concentrada y discreta. | R:33; D:17; I:18 | Tokens y recursos definitivos OPEN-05. |
| 023 | Animaciones mágicas sutiles, no obstructivas. | R:31; D:17; I:18 | Criterios concretos de aceptación y presupuesto de rendimiento. |
| 024 | Selector horizontal con año activo identificable. | R:18; D:14; I:19 | Consolidar CA del patrón y navegación por teclado. |
| 025 | «Agregar libro» en navegación solo para propietaria. | R:17,35; D:18; I:19 | Probar también sesión autenticada no autorizada, no solo visitante. |
| 026 | Edición desde detalle; sin dashboard separado obligatorio. | R:17; D:18; I:14 | Campos editables y permisos; no inventar administración adicional. |
| 027 | Solo tema claro. | R:33; D:17; I:18 | Convertir cobertura de tabla en comprobación explícita. |
| 028 | UI en español; nombre propio «Book Diary». | R:33; D:17; I:18 | Textos finales OPEN-05; no reabrir idioma. |
| 029 | `prefers-reduced-motion`, equivalencia funcional sin interruptor. | R:33,35; I:150 | Completar verificaciones por flujo, foco y fallback. |
| 030 | Meta circular con conteo explícito. | R:29; D:14; I:19 | Sin meta, límites de objetivo y objetivo superado. |
| 031 | Meses vacíos identificables, repisa y pequeño adorno. | R:19,31; D:15; I:13 | Casos 0/pocos/muchos y accesibilidad OPEN-06. |
| 032 | Fachada exactamente «Book Diary». | R:30; D:13,109; I:12 | Consolidar CA del texto exacto; no reabrir nombre. |

**Cobertura: 32/32 decisiones identificadas.** No es un porcentaje de cumplimiento funcional. Faltan criterios específicos para abandono y sus transiciones, sesión válida no propietaria, aproximación a puerta y equivalencia accesible, algunos detalles visuales y parámetros cuantitativos de calidad. Estos huecos se convierten en tareas; no anulan las decisiones aprobadas.

## 4. Contradicciones y ambigüedades

### 4.1 Texto histórico incompatible, con precedencia ya definida

La solución normativa existente es **DEC aprobada > Actualización > texto histórico** (`AGENTS.md §3`, `DECISIONS.md §1`, `SYNC_REPORT.md`). No hay que volver a elegir estas reglas. La corrección propuesta es un pase editorial autorizado, con diff revisable y sin cambiar las 32 DEC.

| ID / prioridad | Evidencia del conflicto | Regla vigente y solución propuesta |
| --- | --- | --- |
| H-01 / alta | M:85 solo `reading/finished`; M:91 entero 1–5; DM-07 M:179 rango 1–5. | DEC-003/014 y actualización M:13–15: tres estados y 0.5–5 en pasos 0.5. Actualizar tabla/pruebas históricas, sin inferir SQL. |
| H-02 / alta | R CA-003.3:85, CA-021.4:327 e I IA-06:165 piden mantener estructura principal; A:183 describe árbol estable. | DEC-006/019 y actualizaciones R:18,31/D:14: la geometría se adapta. Conservar identidad navegable y foco, no geometría rígida. |
| H-03 / alta | A:140 conserva calificación 1–5; A:179 dice no añadir Google Books sin decidirlo; diagrama §4 y carpetas §5 solo muestran Open Library/Gemini. | DEC-003/010 y actualización A:13,15: medias estrellas y dos catálogos. La elección bibliográfica no exige instalar un SDK específico. |
| H-04 / media | P §10, R:72,113,139,191, D:200,202–203 e I:178–179 mantienen acceso/proveedores, borrado, idioma/letrero, ubicación o patrón de detalle como abiertos en bloque. | Ya se aprobaron magic link, catálogos duales, bloqueo de borrado, español, letrero, rama superior y tipos de panel. Conservar solo subdecisiones técnicas realmente abiertas. |
| H-05 / alta | A:35 coloca «requisitos de producto aprobados» antes de «decisiones aprobadas». | Prevalece `DECISIONS.md` según `AGENTS.md §3`. Unificar jerarquía al consolidar; no permitir que un requisito histórico revierta una DEC. |
| H-06 / alta | A:243 llama TECH-02 a técnica visual y A:244 introduce TECH-03 para runtime/CI; `DECISIONS.md §6` y plan §12 usan TECH-02 para calidad/despliegue. | Usar IDs canónicos DECISIONS: técnica visual se relaciona con OPEN-06/TECH-02; TECH-03 histórico no está aprobado como nuevo asunto. Proponer remapeo sin editar el registro silenciosamente. |
| H-07 / media | I §5/INT-008 propone confirmar borrado de un libro con lecturas, como si pudiera permitirse. | DEC-008 lo bloquea mientras existan lecturas. La confirmación no habilita cascada ni excepción; especificar aparte borrado explícito de lecturas. |
| H-08 / media | A:214 propone comprobar tipos/lint/build como línea base; la instrucción de trabajo vigente prohíbe builds. | No ejecutar builds. Ajustar futuras listas de verificación al permiso vigente; este informe no autoriza tampoco lint o pruebas. |

### 4.2 Ambigüedades vigentes: requieren cierre, no corrección automática

| ID / prioridad | Evidencia | Propuesta para decisión y actividad afectada |
| --- | --- | --- |
| A-01 / alta | Actualización M:14 afirma que finalizar requiere un dato de fecha; R:219 y M:100 dejan pendiente exigir al menos año. DEC-005 no define el caso completamente desconocido. | OPEN-04: exigir año al finalizar simplifica metas/historial; admitir finalización sin año preserva casos desconocidos pero exige grupo/exclusión y reglas de conteo. No fijar constraints ni formulario definitivo hasta aprobar. |
| A-02 / alta | DEC-007 reserva la relación activos/año; M:119 y A:113 afirman independencia completa como texto candidato. | OPEN-06/04: activos globales mantienen visibilidad; filtrarlos por contexto anual requiere definir qué fecha gobierna y cómo no ocultarlos. Rama superior sí aprobada; filtro temporal no. Bloquea esa consulta/presentación, no análisis de identidad. |
| A-03 / alta | Actualización P, «Conservación», excluye pendientes/campos antiguos de pantallas nuevas, mientras DEC-013/OPEN-08 mantiene pendiente destino y visibilidad; P §2 deja política de publicación abierta. | OPEN-08/01: separar **preservación de datos** de **exposición pública**. Archivo privado conserva sin ampliar MVP; adaptación visible recupera información con mayor alcance y revisión de privacidad. No asumir que notas/valoraciones legadas serán públicas. |
| A-04 / alta | DEC-014/OPEN-04, R:19 y M:13 incorporan abandono sin matriz de transiciones ni CA dedicado; DEC-015/OPEN-04 no cierra obligatoriedad de inicio. | Especificar estados/orígenes/destinos, fechas que se conservan, evaluación al abandonar, reapertura, «Otro» y campos obligatorios. Bloquea reglas físicas y casos de uso, no la revisión documental. |
| A-05 / media | R:282,297 y P §4.4 dejan límites, ausencia de meta y exceso abiertos; M §3.3 propone unicidad/entero positivo. | Aprobar invariantes de metas y casos sin objetivo. Son candidatos, no constraints remotos comprobados; afectan esquema, API y aceptación. Asunto adicional de modelo relacionado con TECH-01/02: aprobar su registro/asignación sin ampliar silenciosamente el alcance canónico de OPEN-04. |

No se detectó necesidad de cambiar ninguna de las 32 elecciones para resolver estos puntos. Si una futura solución exige cambiar una DEC, se requerirán aprobación explícita, motivo, fecha e impacto documental.

## 5. Estado actual del repositorio y del entorno

### 5.1 Diferencias con la auditoría histórica

- HEAD actual: `e696ba4710a9b17986123f0ea5c75efa02e66400`, rama `main`. La comparación `b1d32f8..HEAD` muestra cambios de código únicamente en `app/book/[id]/page.tsx` y la incorporación de `docs/CURRENT_STATE.md`.
- El cambio de código agrega accesibilidad a controles/valores de evaluación: `aria-label`, `aria-pressed`, texto `sr-only` e iconos decorativos (`app/book/[id]/page.tsx:92–119`). La observación histórica de «estrellas sin nombre» **no debe repetirse como defecto actual**. Esto tampoco demuestra accesibilidad completa.
- Al inicio ya existían `M AGENTS.md` y documentos no versionados: `docs/DECISIONS.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/SYNC_REPORT.md`, `docs/architecture/`, `docs/design/`, `docs/product/`. Se preservaron. No se tomó el árbol como limpio ni se hicieron commits.
- El modelo actual sigue mezclando libro/lectura (`types/database.ts`); no se identificaron entidades de relecturas, abandono, calificación opcional por lectura, magic link ni catálogos duales completos. La presencia de una ruta, paquete o propuesta no acredita esas capacidades v2.

### 5.2 Runtime, dependencias y reproducibilidad

| Elemento | Diagnóstico actual | Interpretación / acción propuesta |
| --- | --- | --- |
| Node/npm | Node `v26.2.0`; npm `11.17.0`; ejecutables bajo `~/.nvm/versions/node/v26.2.0/bin`. | Funcionan para estos diagnósticos. El antiguo Node 21 y fallo ICU son históricos; no requieren una reparación asumida. |
| Sistema local | `Darwin 25.6.0`, arquitectura `arm64`, según `uname -a`. | Describe esta máquina, no el hosting ni la compatibilidad nativa de todos los paquetes. |
| Declaraciones | No se identificaron `engines` ni `packageManager` en `package.json`, ni `.nvmrc`, `.node-version` o `.tool-versions` propios. | No hay runtime/gestor fijados; una máquina funcional no equivale a entorno reproducible. |
| Coincidencia local | 19 dependencias directas/dev coinciden entre manifiesto, lock e instalación local. Lockfile v3, 535 entradas. | Coincidencia de metadatos; no acredita instalación limpia reproducible ni ejecución. |
| Engines | 341 restricciones Node del lock revisadas con semver local; ninguna incompatible con Node 26.2.0. Supabase JS requiere `>=22.0.0`, Next `>=20.9.0`, GenAI `>=20.0.0`. | Satisfacer mínimos no certifica soporte de todos los proveedores ni calidad. No elegir Node 20 solo por el mínimo de Next. |
| Peers directos | Sin incompatibilidades en peers obligatorios revisados, incluido React 19.2.4/Fiber 9.6.1/Drei 10.7.7/Three 0.185.1. | No demuestra compatibilidad integral de renderizado, navegador ni paquetes transitivos. |
| Calidad | Scripts `dev`, `build`, `start`, `lint`; sin runner/script de pruebas ni chequeo de tipos independiente identificados. Sin suites/CI propias identificadas. | Proponer red de caracterización y verificaciones posteriores autorizadas. No asignar cobertura porcentual. |
| Secretos/configuración | Nombres documentados: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`. | No se comprobaron valores, validez ni despliegue; no se abrió `.env.local`. |

Versiones locales relevantes: Next `16.2.0`; React/React DOM `19.2.4`; Supabase JS `2.110.0`; GenAI `2.13.0`; Fiber `9.6.1`; Drei `10.7.7`; Three `0.185.1`; Tailwind/PostCSS `4.3.3`; TypeScript `5.9.3`; ESLint `9.39.5`; eslint-config-next `16.2.0`. Evidencia: `package.json`, `package-lock.json` y manifiestos locales correspondientes; engines en `package-lock.json:491,1619,5985`, peers en `:1471–1475,1500–1508,6002,6528`. Que Drei esté instalado no implica uso propio identificado. `@types/node 20.19.43` no coincide en major con el runtime 26: revisar su alineación como parte de TECH-02, sin afirmar un fallo de tipos no ejecutado. No se comprobó toda la instalación transitiva ni cada peer transitivo.

**Propuesta TECH-02, no aprobada:** fijar una línea LTS mantenida y un patch concreto tras revisar entorno destino. Node 24 LTS ofrece más horizonte de soporte que Node 22; Node 22 reduce el salto frente al mínimo de Supabase, pero su mantenimiento es más corto. Al 18/10/2026, Node 26 está en Current y su paso a LTS está previsto para 28/10/2026: el Node actual operable no es todavía la elección LTS del proyecto. El calendario oficial prevé fin de soporte de 22 el 30/04/2027 y de 24 el 30/04/2028; fechas sujetas a cambios. Fuente: [calendario oficial Node.js Release](https://github.com/nodejs/Release). El mínimo Next 16 es Node 20.9 y TypeScript 5.1, no una recomendación suficiente para este conjunto de dependencias: [guía oficial Next 16](https://nextjs.org/docs/app/guides/upgrading/version-16).

No se instaló, seleccionó ni fijó ninguna versión; tampoco se cambiaron paquetes, lockfile o configuración. El pin de runtime/gestor y su validación deberán ser una tarea autorizada con archivos precisos.

### 5.3 Comprobaciones efectivamente realizadas

Se utilizaron comandos de lectura e inspección, entre ellos:

- `git status --short`, `git rev-parse HEAD`, consulta de rama y `git log -5`; comparación `git diff --stat b1d32f8..HEAD` y diff de `app/book/[id]/page.tsx`.
- Inventario y lectura de archivos con `rg`, `find`, `cat`, `sed`, `nl` y `wc`; inspección de manifiestos/configuración, sin abrir archivos de secretos.
- Resolución de ejecutables `command -v node`, `command -v npm`; versiones `node --version`, `npm --version`; sistema con `uname -a`.
- Lectura de JSON mediante Node y comprobaciones semver locales de engines/peers, sin instalar, ejecutar scripts del proyecto ni usar red.

Estos resultados son diagnósticos de metadatos, **no resultados de pruebas del producto**. No se ejecutó `npm run build`, `next build`, `npm install`, `npm update`, `npm audit`, suites, lint, tipos ni aplicación.

## 6. Riesgos de seguridad, integridad y migración

| Prioridad / riesgo | Evidencia y certeza | Dependencia y mitigación propuesta |
| --- | --- | --- |
| Crítica: permisos efectivos desconocidos. | `lib/supabase.ts`; consultas/mutaciones en páginas y `components/ReadingGoalCard.tsx`; sin RLS/migraciones propias identificadas. No se verificó backend. | OPEN-01/07, TECH-01: diseñar identidad autorizada; inspección remota solo lectura con permiso específico; pruebas de visitante, sesión ajena y propietaria en entorno aislado. |
| Alta: endpoints costosos sin guardas propias identificadas. | `app/api/parse-book-photo/route.ts` y `app/api/search-books/route.ts`: no se identificaron autorización/cuotas/timeout explícitos. Controles externos desconocidos. | OPEN-02/01: proteger acceso, tamaño/tipo real, consumo, reintentos y tiempos; no realizar llamadas pagas para verificar. |
| Alta: imagen/errores/logs. | `app/api/parse-book-photo/route.ts`: lectura completa/base64, MIME declarado, mensajes de proveedor y registro de respuesta inválida. Riesgo, no filtración demostrada. | OPEN-02: límites cuantitativos, errores seguros, política de logs/retención y privacidad de IA; verificar disponibilidad del modelo antes de adoptarlo. |
| Crítica: pérdida o reinterpretación de historial. | `types/database.ts`; DEC-013; `DATA_MODEL.md §§6–7`: libro y lectura combinados, campos legados y `quiero_leer`. | OPEN-03/07/08: mapeo por ID legado, conservación exacta, cuarentena de ambiguos y copia recuperable; no convertir `would_reread` en relectura realizada. |
| Alta: fechas fabricadas/desplazadas. | `app/start-reading/page.tsx`, `app/book/[id]/page.tsx`, agregaciones de `app/page.tsx`/`app/estadisticas/page.tsx`; mezcla UTC/local identificada estáticamente. | OPEN-04/07: decidir calendario/instante y precisión, conservar originales, casos de zonas/límites/año; no afirmar fallo reproducido. |
| Alta: duplicados y conteos inconsistentes. | Altas por `insert` en `app/add/page.tsx` y `app/start-reading/page.tsx`; meta con `maybeSingle` en home; constraints remotos no comprobados. | OPEN-03/04/07: identidad, idempotencia y unicidad a diseñar; inventario de duplicados antes de imponer restricciones. |
| Alta: regresiones sin red de pruebas. | `package.json`; inventario propio sin suites/CI. | TECH-02: caracterización de v1 y aceptación de v2 separadas, proveedores simulados, datos sintéticos y pruebas de autorización aisladas. |
| Media: exposición de diagnóstico y fallos de consultas. | `app/test-connection/page.tsx` muestra conteos/errores; home descarta error de consulta de meta. | Revisar antes de publicación; distinguir ausencia/error sin editar en esta fase. |
| Media: rendimiento y accesibilidad no medidos. | Consultas completas en home/estadísticas; `HeroBook.tsx`; decisiones de árbol aún sin algoritmo. | OPEN-05/06, TECH-02: presupuestos y casos extremos; fallback operable sin WebGL/movimiento. No elegir librería por estar instalada. |

**Condición para cualquier migración futura:** inventario real autorizado → respaldo verificable → mapeo aprobado → ensayo aislado → comparación por IDs/conteos/fechas/notas/calificaciones/metas → restauración ensayada → aprobación específica. Si difieren invariantes o permisos, detener el paso y conservar el respaldo; no compensar eliminando registros. Los ensayos pertenecen a Fase 1, no se ejecutaron ni se exigieron como un diagnóstico de Fase 0.

## 7. Decisiones pendientes, alternativas y aceptación

Todas las alternativas siguientes son **propuestas**. La propietaria aprueba reglas/alcance; la verificación técnica exige evidencia adicional. No se reabren las 32 DEC.

| ID | Decisión y alternativas con tradeoffs | Bloquea / condición observable para cerrar |
| --- | --- | --- |
| OPEN-01 | Magic link ya elegido. Resolver identidad autorizada, altas de cuentas ajenas, expiración/revocación y publicación. Allowlist de identidad estable reduce ambigüedad; control solo por email exige resolver cambios/verificación y no reemplaza políticas. | Diseño de permisos de Fase 1 y toda escritura. Contrato de sesión y matriz de operaciones aprobados; luego pruebas negativas y positivas aisladas. No documentar correo personal. |
| OPEN-02 | Doble catálogo ya elegido. Prioridad por proveedor simplifica trazabilidad; merge por campo enriquece pero requiere procedencia/conflictos. Fijar modelo IA, cuotas, archivos, timeout, logs y retención; no retener fotos reduce datos, conservarlas exige motivo/permiso. | Implementación Fase 3 y exposición segura. Contratos/fallos/límites aprobados y verificables; coordinar identidad de catálogos con OPEN-03. No bloquea por sí solo diseño de datos independiente. |
| OPEN-03 | Libro como obra facilita agrupar relecturas; edición conserva ISBN/portada/formato editorial con mayor complejidad de vínculos. Borrado físico de lectura es simple pero irreversible; borrado lógico permite recuperación con filtros/costos extra. | Modelo/integridad Fase 1 y casos Fase 2. Ejemplos de misma obra, ediciones distintas, coincidencia incierta y concurrencia; borrado de libro siempre bloqueado mientras existan lecturas. |
| OPEN-04 | Resolver A-01/A-04: fechas inicio/fin, transiciones, «Otro» y abandono. Exigir año facilita clasificación; aceptar desconocido necesita presentación/conteo explícitos. A-05 (metas) requiere aprobación como asunto adicional de modelo relacionado con TECH-01/02, no se incorpora por inferencia a este ID. | Restricciones de lecturas y operaciones Fases 1–2. Tabla de estados, validaciones y casos válidos/negativos aprobados, sin fechas inventadas ni abandono contado. |
| OPEN-05 | Mantener fuentes v1 como candidatas reduce trabajo; elegir recursos nuevos aporta identidad con revisión de derechos/peso. Tokens de HEX/dimensiones aún son propuestas. | UI afectada Fases 4–5, no inspección de datos. Recursos disponibles con origen, contraste y tokens/textos aprobados; idioma/letrero/tema no se reabren. |
| OPEN-06 | DOM/SVG favorece semántica/mantenimiento; canvas/WebGL ofrece escena compleja con mayor costo, fallback y accesibilidad. Resolver activos/año, layout dinámico, densidad y overflow sin capacidades arbitrarias. | Árbol/UI Fases 4–5. Casos 0/pocos/muchos, todos los meses/libros accesibles, teclado y movimiento reducido; presupuesto de rendimiento medible. |
| OPEN-07 | Inspección y esquema reales pendientes. Transformación en tablas paralelas facilita comparación/rollback pero requiere coexistencia; transformación in situ reduce duplicación y aumenta acoplamiento/reversión. Elegir solo con inventario. | Cualquier modificación de esquema/datos. Autorizar primero inspección solo lectura; después inventario, respaldo/restauración y ensayo aprobados. No requiere migrar antes de autorizar el diseño de Fase 1. |
| OPEN-08 | Archivo/tabla legado privada conserva sin ampliar MVP; mapeo adaptado permite reutilización con semántica y privacidad más complejas. No eliminar pendientes ni evaluaciones antiguas. | Mapeo y ensayo de migración Fase 1, exposición Fase 2. Matriz campo/estado→destino/visibilidad/verificación, incluida `notes`, `last_updated_at`, `would_recommend`, `would_reread`, `engagement`, `quiero_leer`. |
| TECH-01 | Mutaciones centralizadas en servidor concentran validación/cuotas con más capa operativa; cliente Supabase+RLS reduce capa pero exige invariantes/políticas completas; combinación necesita límites explícitos. Servidor no sustituye autorización. | Arquitectura y contratos Fases 1–3. Decidir frontera por operación, sesión/caché y repositorios; pruebas de permisos e invariantes en la capa efectiva. |
| TECH-02 | Resolver runtime/gestor, runner, tipos/lint, pruebas, CI, rendimiento y despliegue. Node 24 LTS frente a 22: mayor soporte frente a menor cambio; no escoger solo por engines. Tests unitarios/integración rápidos frente a E2E más costosos pero cercanos al usuario. | Reproducibilidad y verificación posterior; no autoriza instalaciones ni builds. Plan con versiones/pin, comandos permitidos, responsables, criterios y entorno aislado. Remapear TECH históricos antes de seguimiento. |

## 8. Checklist de preparación y puertas para Fase 1

### 8.1 Encargo de diagnóstico realizado

- [x] Revisar `AGENTS.md` y las diez fuentes documentales solicitadas, incluido `SYNC_REPORT.md`.
- [x] Comprobar existencia, estados de aprobación, precedencia y cobertura de las 32 DEC.
- [x] Documentar contradicciones históricas y ambigüedades sin cambiar decisiones/specs.
- [x] Registrar HEAD, diferencias respecto a auditoría y cambios preexistentes.
- [x] Evaluar runtime y compatibilidad declarada de dependencias con diagnósticos de lectura.
- [x] Identificar riesgos, decisiones, dependencias y tareas previas; crear este informe.
- [x] Mantener intactos código/configuración/datos y no avanzar a Fase 1.

### 8.2 Cierre integral de Fase 0 según el plan: pendiente

- [ ] Autorizar pase editorial de las seis especificaciones y `SYNC_REPORT.md`; conservar las 32 DEC y mostrar diff.
- [ ] Reconciliar H-01–H-08, IDs canónicos y estados documentales; aclarar A-01–A-05 o marcar su tarea como bloqueada explícitamente.
- [ ] Aprobar matriz de decisiones pendientes, responsables y orden de resolución; no confundir asignación de bloqueo con decisión cerrada.
- [ ] Aprobar tratamiento/visibilidad del legado y alcance MVP; no basta excluirlo de UI para decidir su destino.
- [ ] Elegir runtime/gestor y estrategia de pin; cualquier modificación futura requiere autorización específica. El entorno actual funciona, pero no está fijado.
- [ ] Aprobar plan de caracterización y estrategia de ramas/commits que sigue; no se crearon pruebas ni ramas.
- [ ] Revisar y aceptar el alcance/criterios de salida documentales para autorizar el siguiente trabajo.

### 8.3 Puertas distintas: diseño, inspección y ejecución

1. **Para comenzar diseño/análisis de Fase 1:** autorización explícita con alcance/archivos/entorno; reglas OPEN-01/03/04/08 y TECH-01 cerradas para la tarea concreta o tratadas como decisiones a resolver antes de implementar. La consolidación no puede dejar instrucciones activas contradictorias en esa tarea.
2. **Para inspeccionar Supabase:** permiso específico de solo lectura, objetos/metadatos y tratamiento seguro de información. La autorización de este informe no lo incluye. Esa inspección es una tarea de Fase 1, no algo ya realizado.
3. **Para escribir SQL, cambiar RLS o implementar en pruebas:** modelo/arquitectura y permisos aprobados, entorno aislado autorizado, mapeo, pruebas e invariantes; jamás inferir permiso desde un diagrama candidato.
4. **Para ensayar migración/restauración:** inventario y respaldo verificados, datos/entorno autorizados y criterios antes/después. Es evidencia de salida de Fase 1.
5. **Para producción:** permiso adicional y específico; ningún cierre de Fase 0 o ensayo de Fase 1 autoriza migración real, despliegue o publicación.

OPEN-05/06 no bloquean diseño de identidad/mapeo independiente; OPEN-02 no obliga a implementar catálogos en Fase 1, aunque sus identificadores deben coordinarse con OPEN-03. Los bloqueos se aplican por actividad, no como impedimento indiscriminado a todo análisis.

## 9. Recomendaciones priorizadas y próximos trabajos propuestos

### P0 — Antes de cualquier implementación afectada

1. **Consolidación editorial autorizada.** Archivos propuestos: `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`. Actualizar referencias/estados de `AGENTS.md` y `docs/IMPLEMENTATION_PLAN.md` solo si se autoriza. No modificar `CURRENT_STATE.md` ni reescribir las DEC.
2. **Sesión de decisiones trazables.** Priorizar OPEN-01/03/04/08 y TECH-01; resolver fecha final desconocida, filtro de activos, legado público/privado, abandono y metas. Registrar acuerdos aprobados con ID/motivo/fecha/documentos afectados; este informe solo presenta alternativas.
3. **Preparar permiso de inspección remota, no ejecutarla.** Definir alcance mínimo para OPEN-07 sin leer secretos ni volcar datos personales al repositorio. Después, diseñar respaldo/mapeo con hechos reales.

### P1 — Antes de validar cambios funcionales

4. **Reproducibilidad separada.** Proponer archivos concretos para pin de Node/gestor y documentación de setup; conservar lockfile salvo cambio aprobado. Validar el runtime elegido y el entorno destino posteriormente, sin builds bajo la regla vigente.
5. **Caracterización v1 y aceptación v2 separadas.** La caracterización registra reglas existentes, incluso distintas de v2; no perpetúa la obligación v1 de estrellas ni sus estados como requisito futuro. Priorizar:
   - fechas calendario/UTC, límites de año/mes y precisión desconocida;
   - finalización/edición sin alterar historia, actividad como timestamp e intención de releer sin evento;
   - metas: error frente a ausencia, duplicados, objetivo positivo y conteos;
   - catálogo/imagen: JSON inválido, campos ausentes, título vacío, 503, reintentos y salida manual, usando dobles;
   - casos v2: dos lecturas independientes, medias estrellas opcionales, abandono fuera de metas, borrado protegido y formatos;
   - autorización aislada: visitante, sesión no propietaria, sesión vencida y propietaria; nunca comprobar con escrituras en producción.
6. **Estrategia de trabajo propuesta.** Conservar el árbol actual; revisar/capturar documentación existente antes de atribuir cambios nuevos. Crear rama de trabajo por entrega autorizada, no en esta revisión; commits convencionales pequeños separando documentación/runtime/dominio/datos/UI. Sin `Co-Authored-By` ni atribución de IA. Verificar diff, archivos y criterios de cada entrega; no mezclar migración y rediseño.

### P2 — Antes de UI avanzada y publicación

7. Cerrar OPEN-02/05/06: contratos/privacidad de proveedores, recursos visuales locales con derechos y algoritmo/fallback medibles. No elegir WebGL por presencia de Three/Fiber/Drei.
8. Definir controles de rendimiento, accesibilidad, errores, observabilidad y recuperación de TECH-02. Convertir intención narrativa en casos de aceptación atómicos sin agregar funciones al MVP.

## 10. Resultado y aprobaciones necesarias

**Encargo de revisión e informe:** realizado con las limitaciones declaradas. **Salida completa de Fase 0 del plan:** pendiente de consolidación y aprobaciones. **Preparación para implementar Fase 1:** no aprobada ni demostrada. No se afirma éxito de build, pruebas, seguridad remota, migración o despliegue.

Requieren aprobación: (1) pase editorial y archivos afectados; (2) reglas de identidad/autorización, libro/edición, fechas/transiciones/metas y legado; (3) límites técnicos servidor/cliente; (4) runtime/gestor y estrategia de pruebas; (5) alcance de una futura inspección remota solo lectura; y (6) autorización expresa de la actividad concreta de Fase 1. Las decisiones visuales y de proveedores se cerrarán antes de sus entregas, sin bloquear el análisis independiente.

**Único archivo creado por este encargo:** `docs/PHASE_0_REPORT.md`. Las especificaciones, código, configuración y datos se preservan. Este documento no concede permisos para ninguna fase siguiente.

## 11. Estado documental posterior — 19 de octubre de 2026

### 11.1 Alcance y progreso documentado

Este apartado complementa el diagnóstico histórico de §§1–10, sin reescribir hallazgos ni resultados técnicos. La autorización posterior comprende **documentación**, no implementación ni cambios de entorno/datos.

- Las seis especificaciones se consolidaron editorialmente: `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md` y `docs/architecture/ARCHITECTURE.md`. Se integraron las reglas en cuerpos, flujos y criterios, sin secciones superpuestas de «Actualización».
- H-01–H-08 se consideran **corregidos editorialmente** en esas especificaciones, con evidencias y remapeo de IDs en `docs/SYNC_REPORT.md §§2–5`; sus formulaciones originales en §4.1 se conservan como historial. Esto no verifica la aplicación ni cierra las decisiones técnicas subyacentes.
- `docs/DECISIONS.md §5 bis` registra cinco aprobaciones adicionales, **DEC-033–DEC-037**, sin alterar ni renumerar los bloques DEC-001–DEC-032. Hay **37 decisiones de producto/UX aprobadas**, trazadas a requisitos en `docs/product/REQUIREMENTS.md §10` y a flujos/casos en `docs/SYNC_REPORT.md §3`.
- Este informe incorpora solo la nota inicial y este §11. El plan `docs/IMPLEMENTATION_PLAN.md` actualiza su estado documental y parciales de Fase 0; sus fases y puertas de autorización no se convierten en permisos de ejecución.
- Las verificaciones posteriores son estáticas/documentales: no se ejecutaron builds, pruebas de producto, instalaciones, aplicación, migraciones ni llamadas al backend. No se volvió a certificar runtime, paquetes, seguridad, datos o servicios remotos. Los resultados técnicos originales conservan su alcance y fecha, no se elevan a validación vigente por editar documentación.

### 11.2 Nuevas decisiones y cierre parcial de ambigüedades

| Decisión aprobada | Efecto sobre los hallazgos de §4.2 | Pendiente que no se da por aprobado |
| --- | --- | --- |
| DEC-033: finalizar requiere al menos año; mes/día opcionales sin inventarlos | A-01 queda resuelto **normativamente** para finalización. | Inicio/consistencia de fechas y mapeo de v1 desconocido; no fabricar año legado. No hay constraint SQL ni formulario implementados. |
| DEC-034: todas las activas en «Actualmente leyendo», sin depender del año seleccionado | A-02 queda resuelto **normativamente**; se mantiene la rama superior de DEC-007. | Geometría, densidad/overflow, navegación y rendimiento OPEN-06/TECH-02. No hay consulta implementada o ejecutada como evidencia. |
| DEC-035: sección «Abandonados», conservación de fechas/notas y posibilidad de retomar para la propietaria | A-04/OPEN-04 resueltos **parcialmente**. | Mecanismo de historial al retomar, transiciones adicionales, fechas nuevas, calificación al abandonar, diseño/filtros/posición y publicación de notas; no elegir reutilizar instancia, nueva lectura o eventos. |
| DEC-036: campos históricos v1 fuera del MVP en archivo privado, sin exposición pública ni borrado | A-03/OPEN-08 resueltos **parcialmente** para esos campos. | Formato, almacenamiento, ubicación, controles, inventario/mapeo y destino de registros aún no determinado, como «quiero_leer». No archivar todo v1 ni deducir privacidad/publicación de notas de abandonadas por esta regla. |
| DEC-037: mostrar «Sin meta establecida» y permitir crearla a la propietaria | A-05 resuelto **parcialmente** para el estado sin meta. | Unicidad, rango/límites de objetivo, exceso y diseño/contratos concretos siguen pendientes, relacionados con TECH-01/02 sin ampliar OPEN-04. |

El cierre normativo de A-01/A-02 no equivale a implementación ni prueba. Las decisiones complementan las anteriores; calificación/opinión siguen opcionales, la preservación total de v1 se mantiene y ninguna confirmación habilita borrar un libro con lecturas.

### 11.3 Preparación restante y puertas intactas

- **Completado documentalmente:** inventario/diagnóstico original, consolidación editorial, corrección H-01–08, registro de las cinco nuevas decisiones y trazabilidad normativa actualizada.
- **Parcial:** reglas de lecturas, abandono/retomada, archivo privado y metas. OPEN-04/06/08 tienen cierres concretos; ninguna OPEN/TECH se declara cerrada por completo.
- **Pendiente:** identidad/sesión/RLS y permisos efectivos (OPEN-01), contratos/cuotas/privacidad/modelo IA (OPEN-02), obra/edición/deduplicación/borrado (OPEN-03), inicio/transiciones/«Otro»/historial/validaciones restantes (OPEN-04), tokens/recursos (OPEN-05), algoritmo/accesibilidad/rendimiento (OPEN-06), esquema real/respaldo/mapeo/ensayo/reversión (OPEN-07), implementación y mapeo seguro del archivo/legado (OPEN-08), fronteras de operaciones (TECH-01) y runtime/pin/pruebas/calidad/despliegue (TECH-02).
- **No realizado ni aprobado por este pase:** fijar Node/gestor, instalar o ejecutar suites/tipos/lint/build, validar backend, crear archivo real de datos, ejecutar SQL, migrar, modificar permisos ni publicar.

**Dictamen actual:** preparación documental avanzada; **salida integral de Fase 0 pendiente** de reglas técnicas/aprobaciones y entorno/pruebas planificados conforme al alcance que se autorice. `docs/IMPLEMENTATION_PLAN.md §4` distingue tareas documentales completadas de parciales y pendientes. Las puertas de §8.3 histórico y las del plan siguen vigentes: Fase 1, inspección remota, cambios de esquema, ensayos y producción requieren sus autorizaciones específicas. **No avanzar a Fase 1 sin autorización explícita.**

## 12. Actualización de auditoría técnica y preparación — 19 de octubre de 2026

Este apartado actualiza el estado posterior de §§1–11 con evidencia de la revisión documental/técnica actual. Los hallazgos y métricas originales se conservan como histórico; no son evidencia de ejecución ni de infraestructura remota vigente.

### 12.1 Especificaciones y decisiones

- `docs/DECISIONS.md` registra **41 decisiones aprobadas, DEC-001–DEC-041**. Los bloques anteriores se preservan y DEC-033–041 están integradas en las seis especificaciones.
- Se corrigieron dos remanentes detectados: `docs/product/REQUIREMENTS.md` se atribuía una matriz de 37 decisiones y no trazaba DEC-038–041; `docs/architecture/ARCHITECTURE.md` aún presentaba como abierta la opción entre retomar la misma lectura o crear otra. Requisitos y arquitectura ahora reflejan la matriz de 41, la misma identidad lógica de retomada, conservación obligatoria del historial, recuperación obligatoria de lecturas eliminadas y agrupación de ediciones bajo un libro por obra. Las estructuras físicas permanecen pendientes.
- La revisión textual no encontró otras contradicciones activas entre las reglas aprobadas de `PRODUCT.md`, `REQUIREMENTS.md`, `DESIGN.md`, `INTERACTIONS.md`, `DATA_MODEL.md` y `ARCHITECTURE.md` después de esas correcciones. Esto no equivale a aprobación integral de las especificaciones.
- No se encontró `DECISIONES_FASE_0_FINAL.md` en el árbol inspeccionado. La sincronización se verificó contra `docs/DECISIONS.md`; no se afirma que el documento faltante contenga solo esas mismas 41 decisiones. Si ese archivo existe fuera del repositorio, debe quedar incorporado o accesible para cotejo antes del cierre final, sin reabrir los acuerdos ya registrados.

### 12.2 Inspección de Supabase — verificada en modo solo lectura

**Alcance y certeza.** Inspección de metadata, catálogo y conteos del proyecto `book-diary` (ref `mxghetuvlknxvztqcgtp`), estado `ACTIVE_HEALTHY`, región `us-west-2`, PostgreSQL `17.6.1.147` (major 17). No se leyeron filas de negocio ni valores de secretos; no se alteraron datos, esquema, políticas, Auth ni configuración. La lista de migraciones administradas consultada estaba vacía; esto no descarta cambios manuales ni constituye historial completo de DDL. El repositorio no aporta migraciones/esquema SQL versionado.

**Esquema público observado:**

| Tabla | Columnas observadas | Restricciones/relaciones observadas | Conteo exacto |
| --- | --- | --- | ---: |
| `public.books` | `id`, `title`, `author`, `cover_image_url`, `open_library_id`, `status`, `start_date`, `finish_date`, `last_updated_at`, `rating`, `would_recommend`, `would_reread`, `engagement`, `notes`, `created_at` | PK `id`; `status` restringido a `quiero_leer/leyendo/terminado`; `rating` entero 1–5; `engagement` 1–5. No se observaron FKs ni unicidad de `open_library_id`. | 6 |
| `public.reading_goals` | `id`, `year`, `target_count`, `created_at` | PK `id`; `year` único. No se observaron FKs ni CHECK para `target_count`. | 1 |

Los índices observados corresponden a PK y unicidad de `reading_goals.year`. No se encontraron restricciones relacionales entre las dos tablas. Columnas no nulas: `books.id/title/status` y `reading_goals.id/year/target_count`; los demás campos admiten NULL. Defaults observados: UUID mediante `gen_random_uuid()` en ambos `id`, `now()` en `books.last_updated_at`, `books.created_at` y `reading_goals.created_at`; no se observó default para otros campos. No se observaron triggers en estas tablas. El helper de listado estimó cero filas para ambas, pero `COUNT(*)` read-only devolvió 6 y 1; prevalecen los conteos exactos y no la estimación.

**RLS, grants y Auth — hallazgo P0 para revisión inmediata:** RLS está habilitado pero no forzado en ambas tablas; cada una tiene una política permisiva `Allow all for anon`, rol `public`, comando `ALL`, `qual=true` y `with_check=true`. `anon` y `authenticated` tienen grants `SELECT/INSERT/UPDATE/DELETE` y también `TRUNCATE`, `REFERENCES` y `TRIGGER`; `service_role` tiene grants similares. Esto no restringe escrituras a la propietaria. En particular, **PostgreSQL no aplica RLS a `TRUNCATE` ni `REFERENCES`** ([documentación PostgreSQL sobre RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)); el grant de `TRUNCATE` es un privilegio de riesgo adicional, pero esta auditoría no identificó ni probó una vía PostgREST/RPC/directa que permita a `anon` invocarlo. **No se verificó si el Data API está expuesto/habilitado, no se hizo una petición REST anónima y no se afirma explotación ni acceso externo confirmado.** Si el API expone `public`, los grants CRUD y la policy permissiva podrían permitir acceso y operaciones anónimas; su efecto se debe validar en un entorno autorizado. La propietaria/admin debe confirmar exposición y priorizar revisión/contención. No cambiar políticas/grants sin autorización separada.

Se observaron las tablas estándar de Auth, incluyendo `auth.users`, `identities`, `sessions` y `refresh_tokens`; el conteo exacto de `auth.users` fue 0. La herramienta no permite confirmar proveedor/email OTP/magic link, plantillas, URLs de redirección ni límites. El asesor de seguridad devolvió cero lints; ese resultado no invalida las políticas/grants inspeccionados manualmente.

**Implicaciones para OPEN:** `OPEN-01` ya no es “infraestructura desconocida” en su totalidad: existe evidencia de acceso permisivo para `public/anon`, pero quedan por verificar exposición Data API, proveedor/configuración Auth, modelo de identidad autorizado y matriz de permisos deseada. `OPEN-07` deja de estar bloqueado por desconocer el inventario básico: tablas, columnas, nulabilidad, defaults, restricciones observadas y conteos están documentados; siguen pendientes mapeo v1→v2, integridad, respaldo/restauración verificables y ensayo. El esquema v1 observado mezcla libro y experiencia de lectura; el status check y rating no bastan para representar las reglas v2 ni múltiples lecturas/formatos. El snapshot no autoriza migrar ni elegir un esquema destino.

### 12.3 Compatibilidad local con Node.js 26

**Verificado por comandos de diagnóstico:** Node `v26.2.0`, npm `11.17.0`. Lectura de `package.json`, lockfile y metadatos locales instalados, sin instalar ni actualizar paquetes:

| Paquete directo | Versión observada | `engines.node` observado | Resultado estático frente a Node 26 |
| --- | --- | --- | --- |
| Next.js | 16.2.0 | `>=20.9.0` | Cumple mínimo declarado |
| `@supabase/supabase-js` | 2.110.0 | `>=22.0.0` | Cumple mínimo declarado |
| `@google/genai` | 2.13.0 | `>=20.0.0` | Cumple mínimo declarado |
| TypeScript | 5.9.3 | `>=14.17` | Cumple mínimo declarado |

`package.json` no fija `engines` ni `packageManager`; no se encontró `.nvmrc`, `.node-version` o `.tool-versions`. `@types/node` está en major 20. El lockfile está presente. Estos datos solo establecen compatibilidad declarada de los paquetes directos observados; no certifican la aplicación, dependencias transitivas, toolchain/deploy destino o APIs de Node específicas. No se ejecutaron build, servidor, lint, typecheck ni pruebas. Se recomienda resolver TECH-02 y fijar la misma línea de Node/gestor para desarrollo y CI antes de basar la reproducibilidad en Node 26; alinear `@types/node` y ejecutar verificaciones cuando estén autorizadas. No se cambió configuración.

### 12.4 Estrategia de migración segura — propuesta, no ejecución

1. Preservar v1 sin cambios. El inventario remoto read-only básico ya está documentado en §12.2; verificar exposición/configuración faltantes y ampliar evidencia solo con acceso autorizado.
2. Definir mapeo determinista por registro, identificadores y tablas de correspondencia; documentar incertidumbres, sin inventar fechas, relecturas o historial. Conservar todos los registros (DEC-013) y segregar los campos históricos fuera de MVP en el destino privado aprobado (DEC-036), sin exportarlos al repositorio.
3. Crear respaldo consistente y comprobar una restauración antes de cualquier escritura. Hacer ensayo en ambiente/branch aislado con copia autorizada o datos sintéticos, nunca empezar por producción.
4. Diseñar cambios aditivos y repetibles, con checks previos, validación de constraints/relaciones y autorización explícita por operación. Las opciones físicas para ediciones, historial de abandono/reanudación y lecturas recuperables no se eligen hasta revisar esquema y compatibilidades con DEC-008.
5. Comparar antes/después: conteos de origen/destino, claves, relaciones, fechas parciales, notas, calificaciones, metas y contenido archivado; fijar condiciones de aborto, restauración/reversión y revisión de discrepancias.
6. Ejecutar en datos reales solo tras ensayo exitoso, respaldo restaurable, mapeo aprobado y permiso específico; despliegue/migración de producción requiere autorización separada.

Es una estrategia de preparación, no un procedimiento ejecutado ni aprobación de un esquema, proveedor de backup, mecanismo físico o SQL. No se copian datos ni se ejecuta migración en Fase 0.

### 12.5 Riesgos, checklist y estado de Fase 0

**Riesgos prioritarios:** (P0) políticas `ALL` permisivas para `public` y grants CRUD a `anon` en ambas tablas; existe además grant `TRUNCATE` no restringido por RLS, aunque no se identificó/probó una ruta para invocarlo desde la API; la exposición por Data API debe confirmarse y la propietaria/admin debe evaluar contención urgente; (P0) migración aún no tiene respaldo/restauración ni ensayo comprobados; (P0) el documento final citado no está en el repositorio; (P1) Auth/proveedor, identidad propietaria y exposición API sin verificar; (P1) decisiones técnicas de ediciones, historial y recuperación condicionan modelo/migración; (P1) Node 26 no está fijado ni probado con la aplicación; (P2) `@types/node` major 20 requiere alineación/verificación.

**Checklist antes de Fase 1:**

- [ ] Cotejar `DECISIONES_FASE_0_FINAL.md` (no encontrado) con el registro canónico, o confirmar formalmente DEC-001–041 como inventario final.
- [ ] Obtener especificación/aprobación integral de las seis specs, conservando abiertas solo las decisiones técnicas que no bloqueen la tarea inicial.
- [x] Inventariar en modo solo lectura tablas, columnas, restricciones observadas, conteos, Auth tables, RLS y grants del proyecto conectado; conservar la limitación de que la configuración Data API/Auth y cambios manuales de DDL no quedaron verificadas.
- [ ] Confirmar con propietaria/admin si Data API expone el esquema `public` y revisar/contener de forma autorizada las políticas y grants permisivos; no hacerlo desde esta Fase 0.
- [ ] Resolver interfaces técnicas mínimas de identidad/autorización, obra/edición, historial al retomar, recuperación y relaciones con DEC-008 antes de diseñar migraciones afectadas.
- [ ] Acordar runtime/gestor y verificaciones; no asumir que `node --version` certifica la aplicación.
- [ ] Definir respaldo/restauración, mapa v1→v2, ensayo aislado, reconciliación de integridad y reversión antes de cualquier escritura.
- [ ] Obtener autorización explícita de Fase 1, alcance y entorno no productivo.

## 13. Seguimiento de sincronización documental — 19 de octubre de 2026

### 13.1 Alcance y resultado

Se revisó el resultado de la auditoría documental compartido por la propietaria. La auditoría informa que DEC-001–DEC-041 están trazadas en `docs/product/REQUIREMENTS.md §10` y reflejadas en las seis especificaciones; los asuntos OPEN/TECH siguen abiertos cuando corresponde. Esta revisión no reejecutó la auditoría de cada sección ni inspeccionó código, Supabase, configuración o dependencias. Por lo tanto, esos resultados se atribuyen al texto de auditoría recibido y no se presentan como una nueva verificación independiente.

### 13.2 Correcciones de seguimiento aplicadas

- `docs/IMPLEMENTATION_PLAN.md` ahora cita DEC-001–041, incluye DEC-038–041 en el estado de consolidación, y distingue el inventario básico read-only ya documentado de las verificaciones restantes de Fase 1.
- Se añadió una referencia explícita a este seguimiento para no confundir los conteos históricos de §§1–3 con el conjunto vigente de 41 decisiones.
- No se modificaron las decisiones aprobadas ni se cerró ningún asunto OPEN/TECH. Los puntos funcionales/técnicos que el informe recibido mantiene abiertos conservan su estado.

### 13.3 Limitaciones y pendientes

- `AGENTS.md` no fue accesible para lectura/escritura en esta sesión; sus posibles referencias obsoletas no se modificaron. La auditoría recibida señala que ese archivo requiere sincronización (conteo, precedencia documental y referencia al plan). Revisarlo y actualizarlo requiere acceso efectivo al archivo.
- `DECISIONES_FASE_0_FINAL.md` no aparece en el árbol documental enumerado. No se puede cotejar su contenido ni asegurar que no contenga acuerdos adicionales a DEC-001–041.
- La propietaria autorizó iniciar tareas de preparación de Fase 1. Esa autorización no constituye validación de comportamiento, seguridad efectiva, configuración de Supabase, migración, respaldo/restauración ni permiso para operaciones remotas de escritura.

**Estado:** sincronización documental de las seis especificaciones reportada como parcial/completa según la auditoría recibida; corpus completo aún no certificable mientras falte cotejar el documento final citado y revisar `AGENTS.md`. La preparación de Fase 1 está autorizada; la fase no se declara terminada por esta actualización.

**¿Se puede comenzar Fase 1? No automáticamente.** La inspección read-only ya se hizo y documentó, pero el riesgo de permisos anónimos exige evaluación de la propietaria/admin, quedan decisiones técnicas que condicionan tareas de modelo y migración, no se comprobó respaldo/restauración y falta cotejo del archivo final citado. Tampoco se recibió autorización explícita para iniciar esa fase; esta tarea de preparación no autoriza avanzar. Una aprobación posterior de Fase 1 debe definir alcance y tratar primero el riesgo observado sin hacer cambios remotos implícitos.

**Primera tarea propuesta (requiere autorización de Fase 1):** confirmar con propietaria/admin la exposición del Data API y acordar un plan de contención/revisión del hallazgo de políticas/grants `anon`, sin ejecutar cambios hasta tener permiso específico. La primera tarea de código, una vez autorizada y con alcance aprobado, sería establecer en entorno aislado la frontera de autorización/acceso a datos con pruebas negativas para visitante y positivas para identidad propietaria; precede a migraciones o exposición de operaciones.

No se instalaron/actualizaron dependencias, no se modificó el entorno ni Supabase, y no se ejecutaron builds, pruebas, migraciones, cambios de datos/políticas o despliegues.
