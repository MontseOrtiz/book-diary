# Informe de sincronización — Book Diary v2

**Fecha:** 20 de octubre de 2026. · **Estado:** consolidación editorial de las seis especificaciones registrada hasta DEC-041; preparación técnica documental de Fase 1 ampliada. El estado de `AGENTS.md` como inaccesible corresponde al pase histórico descrito en §9. En esta actualización se pudo leer, pero no se modificó y conserva referencias de estado que requieren sincronización aparte. **No certifica el cierre integral de Fase 0 ni la salida de Fase 1.**

**Propósito:** registrar qué se consolidó, dónde se encuentran ahora las reglas y qué permanece abierto, sin depender de versiones superpuestas ni del historial de una conversación.

## 1. Alcance y precedencia

La sincronización del 18/10/2026 había añadido secciones «Actualización» a seis borradores, conservando cuerpos históricos incompatibles. La **consolidación editorial inicial del 19/10/2026** integró DEC-001–032 en cuerpos, flujos y criterios, eliminó las secciones superpuestas y corrigió H-01–H-08. Los encargos documentales posteriores registraron DEC-033–041 y las integraron en las especificaciones. Esta edición corrige remanentes de trazabilidad/estado que seguían describiendo 37 decisiones y texto incompatible con DEC-039/040. No se modifica ni renumera DEC-001–032 ni se adoptan opciones técnicas pendientes por inferencia.

**Archivos de consolidación y sincronización:**

1. `docs/product/PRODUCT.md`.
2. `docs/product/REQUIREMENTS.md`.
3. `docs/design/DESIGN.md`.
4. `docs/design/INTERACTIONS.md`.
5. `docs/architecture/DATA_MODEL.md`.
6. `docs/architecture/ARCHITECTURE.md`.
7. `docs/SYNC_REPORT.md` (este informe).

**Documentos adicionales del encargo posterior:** `docs/DECISIONS.md` registra el bloque 5 y sus cierres parciales; `docs/PHASE_0_REPORT.md` conserva íntegro su diagnóstico original §§1–10 y añade nota/§11 de estado posterior; `docs/IMPLEMENTATION_PLAN.md` actualiza referencias y avance documental sin cambiar fases ni permisos. El conjunto del encargo posterior comprende esas diez rutas; `AGENTS.md` y `docs/CURRENT_STATE.md` no se modifican.

**Fuente normativa:** decisiones aprobadas de `docs/DECISIONS.md` > especificaciones coherentes con ellas > propuestas técnicas. Los documentos consolidados mantienen su condición de borrador/modelo/arquitectura candidatos donde corresponda. Una regla de producto aprobada no significa tecnología, SQL, límites, parámetros o aprobación integral del documento.

No se modificaron aplicación, dependencias, configuración, variables de entorno ni datos; no se ejecutaron builds, pruebas de producto, instalaciones, migraciones ni operaciones remotas. Las comprobaciones de este pase son **documentales**, no evidencia de funcionamiento, seguridad o despliegue.

## 2. Cambios por archivo

| Archivo | Secciones consolidadas y resultado | Límites conservados |
| --- | --- | --- |
| `docs/product/PRODUCT.md` | La consolidación inicial integró reglas de acceso/captura/dominio/visual/legado en §§2–11. Posteriormente §§2/4/6/8/10 incorporan año mínimo, activas globales, «Abandonados»/retomada, archivo privado de campos fuera MVP y estado sin meta. | Inicio/transiciones/«Otro»/historial al retomar, diseño de abandonados, implementación/mapeo del archivo y demás invariantes de metas pendientes. Estilo/tonos conceptuales no son paleta aprobada. |
| `docs/product/REQUIREMENTS.md` | RF-001–022/RNF-001–006 y 83 CA trazan las reglas vigentes; §10 contiene DEC-001–041. RF-014/015/016 y OPEN-03/04 distinguen resultados aprobados de mecánica pendiente. | Criterios no ejecutados; no se eligen reglas de consulta/conteo/restauración ni esquema físico del historial/ediciones/recuperación. |
| `docs/design/DESIGN.md` | §§5.3/7–9/12 integran las reglas aprobadas hasta DEC-041: activas globales, mínimo año, abandono/retomada con misma lectura e historial, recuperación, formato por lectura y edición opcional por lectura bajo libro único de obra. | §§3–4 mantienen tonos/HEX/fuentes candidatos; geometría, parámetros y orden interno propuestos. No se decide ubicación/filtros/estilo de abandonados, publicación de notas ni interfaz de papelera. |
| `docs/design/INTERACTIONS.md` | INT-001–009 conservados; DEC nuevas en INT-002/003/005/006/008 y pendientes. IA-13/19 se ajustan; IA-22/23/24 añaden año mínimo, archivo privado y sin meta: 24 casos. H-07 sigue corregido en INT-008/IA-18. | Modalidad/gestos/duraciones/foco exacto, historial de retomada, controles del archivo y demás reglas abiertas siguen sin elegir. |
| `docs/architecture/DATA_MODEL.md` | §§2–5/7–9 incorporan mínimo año, todas las activas, «Abandonados»/retomada, archivo privado solo para campos fuera MVP y sin meta. DM-12/13/16 actualizados y DM-17/18 nuevos: 18 casos. | Modelo lógico, códigos/columnas/constraints candidatos; no acredita SQL/RLS remotos ni decide instancia/eventos al retomar o almacenamiento del archivo. |
| `docs/architecture/ARCHITECTURE.md` | §§6–11/13 integran nuevas reglas en consultas/flujos, privacidad, contratos candidatos `finishReading`/`resumeReading`/`loadGoal`, estados, migración y verificaciones. Cierre H-08 y remapeo TECH se conservan. | Fronteras, persistencia, SDK/modelo IA, renderizado, runtime y pruebas no elegidos. Contratos candidatos no aprueban topología/SQL ni historial de retomada. |
| `docs/SYNC_REPORT.md` | Sustituye el estado de superposición por inventario de consolidación, trazabilidad, remapeos, hallazgos editoriales y pendientes. | No modifica ni certifica las decisiones o los informes históricos referenciados. |
| `docs/DECISIONS.md` | §§5 bis/5 ter registran DEC-033–041; §6 distingue cierres parciales de OPEN-03/04/06/08; §§7–8 separan historia/estado vigente. | Bloques DEC-001–032 intactos; ninguna OPEN/TECH completamente cerrada. |
| `docs/PHASE_0_REPORT.md` | Nota y §§11–12 registran avances documentales, compatibilidad estática y auditoría Supabase read-only realizada el 19/10/2026. | §§1–10 conservan su diagnóstico histórico; §12.2 y §12.5 actualizan el estado remoto. Data API/Auth config, respaldos y aprobación de Fase 1 no están verificados. |
| `docs/IMPLEMENTATION_PLAN.md` | Referencias/precedencia, checklist §4 y estados/reglas en §§6/12/14 actualizados. | Fases/puertas intactas; runtime fijado, pruebas aprobadas, backend verificado y cierre integral de Fase 0 no acreditados. |

## 3. Trazabilidad de las 41 decisiones

La **matriz canónica DEC-001–DEC-041 → RF/RNF** está en `docs/product/REQUIREMENTS.md §10`, «Decisiones aprobadas integradas en los requisitos»: contiene las 41 decisiones, sin sustituir sus definiciones ni los pendientes. La siguiente tabla complementa esa localización con CA, flujos INT/casos IA y secciones; los casos son especificaciones para verificación futura, no resultados aprobados en ejecución.

| Decisiones | Requisitos / criterios localizables | Flujos / casos y secciones complementarias |
| --- | --- | --- |
| DEC-001 | RF-012/016; CA-012.3, CA-016.1–3 | INT-007/008; IA-10/14; `DATA_MODEL.md §§2–3` |
| DEC-002/015/016 | RF-012/014 y CA-014.1–2; reglas de inicio/formato en sus cuerpos | INT-008; IA-17; `DATA_MODEL.md §3.2`, DM-15 |
| DEC-003/004/005 | RF-004/013/017; CA-004.2–4, CA-013.1–5, CA-017.3 | INT-003/008; IA-07/16; `DATA_MODEL.md §3.2`, DM-03/04/07/16 |
| DEC-006/007/019/031 | RF-003/005/021; CA-003.3, CA-005.1–2, CA-021.4–5 | INT-003/005; IA-03/06/13; `DESIGN.md §§5.3,6,9`, `ARCHITECTURE.md §9` |
| DEC-008 | RF-011; CA-011.2 | INT-008; IA-18; `DATA_MODEL.md §5`, DM-14 |
| DEC-009/025/026 | RF-002/006, RNF-001; CA-002.1–5, CA-006.3 | INT-002/004; IA-11; `PRODUCT.md §2`, `ARCHITECTURE.md §7` |
| DEC-010/011/012 | RF-007–010; CA-007.1–3, CA-008.2–4, CA-009.3, CA-010.1–3 | INT-007; IA-09/15; `ARCHITECTURE.md §§4,6.2,8` |
| DEC-013 | RF-017, RNF-002 y sus criterios de conservación | INT-008; `PRODUCT.md §8`, `DATA_MODEL.md §§6–8`, DM-10/12 |
| DEC-014 | RF-012/019; CA-019.5 y reglas de estados en sus cuerpos | INT-008; IA-19; `DATA_MODEL.md §3.2`, DM-13 |
| DEC-017/018/032 | RF-020; CA-020.1–4 | INT-001/002; IA-01/02/12; `DESIGN.md §§5.1–5.2` |
| DEC-020/021 | RF-006/021/022; CA-006.3, CA-021.1–3, CA-022.1–3 | INT-004/006; IA-04/08; `DESIGN.md §§6–8` |
| DEC-022/023/027/028/029 | RNF-003/005 y CA-020.5; criterios de equivalencia, UI e idioma | INT-009; IA-05/21; `DESIGN.md §§2,10`, `ARCHITECTURE.md §9` |
| DEC-024 | RF-003; CA-003.4 | INT-002/005; IA-06; `DESIGN.md §§5.3,8` |
| DEC-030 | RF-019; CA-019.4–5 | INT-002/008; IA-20; `PRODUCT.md §4.4`, `DESIGN.md §§5.3,8` |
| DEC-033 | RF-004/013/017; CA-013.6 | INT-003/008; IA-22; `DESIGN.md §5.3`, `DATA_MODEL.md §3.2`, DM-16 |
| DEC-034 | RF-005/021; CA-005.3 | INT-002/003/005; IA-13; `DESIGN.md §§5.3,9`, `DATA_MODEL.md §4`, DM-17 |
| DEC-035 | RF-015/019; CA-015.4–5 | INT-006/008; IA-19; `DESIGN.md §§8–9`, `DATA_MODEL.md §4`, DM-13 |
| DEC-036 | RF-006/017, RNF-002; CA-017.4 | INT-008; IA-23; `DESIGN.md §9`, `DATA_MODEL.md §§5–8`, DM-12 |
| DEC-037 | RF-018/019; CA-018.5 | INT-002/005/008; IA-24; `DESIGN.md §§8–9`, `DATA_MODEL.md §4`, DM-18 |
| DEC-038 | RF-014/016; CA-014.1–2 | INT-004/008; IA-25; `PRODUCT.md §4`, `DESIGN.md §5.3`, `DATA_MODEL.md §§3–4`, DM-19 |
| DEC-039 | RF-015/019; CA-015.5 | INT-008; IA-19/26; `PRODUCT.md §§3,6`, `DESIGN.md §§5.3,8–9`, `DATA_MODEL.md §§3–4`, DM-13/20 |
| DEC-040 | RF-011/015; CA-015.2 | INT-008; IA-18/27; `PRODUCT.md §§4,6`, `DESIGN.md §9`, `DATA_MODEL.md §§3–5`, DM-14/21 |
| DEC-041 | RF-009/012/016; CA-016.4 | INT-007/008; IA-28; `PRODUCT.md §§3–4`, `DESIGN.md §5.3`, `DATA_MODEL.md §§3,5`, DM-22 |

Se conserva la distinción entre cobertura normativa y aceptación técnica: panel lateral/inferior no aprueba modalidad o gesto; mínimo año no decide cómo mapear legados sin año; retomar no elige mecanismo de historial; archivo privado solo para campos fuera MVP no archiva todo v1 ni decide publicación de notas dentro del MVP.

## 4. Cierre de hallazgos editoriales H-01–H-08

Los IDs y el texto original de los hallazgos permanecen en `docs/PHASE_0_REPORT.md §4.1`. Aquí **cerrado editorialmente** significa que se retiró o corrigió la instrucción histórica incompatible en las especificaciones editadas; no cierra OPEN/TECH, verifica implementación ni declara terminada toda Fase 0.

| Hallazgo | Corrección integrada / evidencia actual | Estado y límite |
| --- | --- | --- |
| H-01 | `DATA_MODEL.md §3.2` describe Leyendo/Terminado/Abandonado y rating nullable 0.5–5/paso 0.5; DM-07/13/15 en §8. | Cerrado editorialmente; tipos SQL/transiciones no aprobados. |
| H-02 | `REQUIREMENTS.md` CA-003.3/021.4; `DESIGN.md §6`; INT-003/005 e IA-06; `ARCHITECTURE.md §9`: dinámica por volumen, no geometría rígida. | Cerrado editorialmente; identidad/foco no congelan geometría. Algoritmo pendiente. |
| H-03 | `ARCHITECTURE.md §§4–6,8` usa Open Library + Google Books y asistencia revisable; §6.3 medias estrellas. | Cerrado editorialmente; integración dual no exige adoptar un SDK concreto ni un modelo IA. |
| H-04 | `PRODUCT.md §§2,4–5,10`; `REQUIREMENTS.md` RF-002/005/007/011 y §11; `DESIGN.md §12`; `INTERACTIONS.md §8`: separan decisiones cerradas de subdecisiones abiertas. | Cerrado editorialmente; no reabrir magic link, catálogos, letrero, idioma, rama superior o tipos de panel. |
| H-05 | Precedencia DEC aprobadas en `PRODUCT.md §11`, `REQUIREMENTS.md §§1,13`, `DESIGN.md §1`, `INTERACTIONS.md §1`, `DATA_MODEL.md §1` y `ARCHITECTURE.md §1`. | Cerrado editorialmente; ningún candidato técnico puede revertir una DEC. |
| H-06 | `ARCHITECTURE.md §13` remapea los TECH locales y usa los IDs canónicos; tablas de pendientes de las seis specs se alinean. | Cerrado editorialmente; remapeo de referencias, no elección de tecnología ni aprobación de nuevo ID. |
| H-07 | INT-008 bloquea borrar libro con lecturas; confirmación solo candidata para lectura o libro **sin lecturas**. IA-18, CA-011.2 y DM-14 rechazan excepción/cascada. | Cerrado editorialmente; confirmar no habilita violar DEC-008. Política física/recuperación pendiente. |
| H-08 | `ARCHITECTURE.md §11` prohíbe builds bajo la regla vigente y deja ejecución de verificaciones sujeta a autorización. | Cerrado editorialmente; no se ejecutaron builds ni pruebas. |

## 5. Remapeo de identificadores históricos

No se renumeran DEC-001–032 ni RF/RNF/CA/INT/IA existentes; DEC-033–041 son complementos aprobados posteriores. Las tablas de pendientes usan los IDs canónicos de `docs/DECISIONS.md §6`; los alias siguientes solo permiten reconocer referencias antiguas, **no son nuevos asuntos aprobados**.

| Referencia histórica | Decisión aprobada relacionada, sin reabrirla | Subdecisión canónica restante |
| --- | --- | --- |
| TECH-02 local de `ARCHITECTURE.md`: técnica visual | DEC-006/007/017–024/029/031/032 definen patrones, no tecnología. | OPEN-06; coordinado con TECH-02 canónico para rendimiento/responsive y OPEN-05 para recursos. No elige SVG/DOM/WebGL. |
| TECH-03 local de `ARCHITECTURE.md`: runtime/pruebas/CI/despliegue | Ninguna versión, runner, hosting o CI se aprueba por remapear. | TECH-02 canónico. TECH-01 mantiene fronteras/operaciones/autorización. |
| DESIGN-OPEN-01 | DEC-028: español; DEC-032: letrero «Book Diary». | OPEN-05: paleta/fuentes/recursos y textos secundarios; idioma/letrero no siguen abiertos. |
| DESIGN-OPEN-02, INT-OPEN-02 | DEC-006/019: árbol dinámico; DEC-031: meses vacíos identificables con repisa y adorno. | OPEN-06 y TECH-02: geometría de meses, overflow/casos extremos y rendimiento. |
| DESIGN-OPEN-03, INT-OPEN-03 | DEC-007: rama superior; DEC-034: todas las activas sin depender del año. | OPEN-06: geometría concreta, casos extremos, navegación y rendimiento; filtro anual ya resuelto. |
| DESIGN-OPEN-04, INT-OPEN-04 | DEC-020/021: panel lateral de escritorio y bottom sheet móvil. | OPEN-05/TECH-02: dimensiones, modalidad y patrón accesible concreto. |
| DESIGN-OPEN-05 | DEC-020 contempla selección de lomo/extracción/giro; no aprueba su imagen o estilo exacto. | OPEN-05: lomos sintetizados, placeholders y etiquetas. |
| DESIGN-OPEN-06, INT-OPEN-06 | DEC-021: repisas horizontales y bottom sheet móvil; DEC-029: equivalencia funcional. | TECH-02 y OPEN-06/05 según layout/recursos: breakpoints, densidad y controles accesibles. |
| DESIGN-OPEN-07 | DEC-025/026: agregar en navegación y editar desde detalle, sin dashboard separado obligatorio. | OPEN-05: diseño de formularios/navegación; OPEN-01/TECH-01: identidad, permisos y contratos. |
| DESIGN-OPEN-08, INT-OPEN-07 | DEC-023/029: animación mágica discreta y movimiento reducido automático, sin interruptor manual requerido. | TECH-02 y OPEN-05/06 según recursos/layout: duraciones/easing, técnica y fallback concreto. |
| INT-OPEN-01 | DEC-017/018/032: sakura progresiva/reversible por scroll, fachada «Book Diary» y aproximación a puerta. | OPEN-05/TECH-02: distancia, ritmo, capas y título; técnica/recursos concretos pendientes. |
| INT-OPEN-05 | DEC-019/020/021/029: reorganización y detalle con equivalencia sin movimiento. | TECH-02 y OPEN-05: interrupciones, cierre exterior y foco cuando cambia año con detalle abierto. |
| INT-OPEN-08 | DEC-008: bloquear libro con lecturas, sin excepción por confirmación ni cascada implícita. | OPEN-03: confirmaciones, borrado explícito de lecturas, política física/recuperación; reglas de lecturas coordinadas con OPEN-04. |

Las invariantes adicionales de metas aún abiertas (unicidad/límites/exceso de A-05) requieren registro/asignación explícitos, relacionadas con TECH-01/02; **no se incorporan silenciosamente a OPEN-04**. DEC-037 ya aprueba el texto sin meta y poder crearla. Campos bibliográficos mínimos/validación requieren asimismo definición/asignación expresa relacionada con contratos TECH-01, coordinada con OPEN-03/02; no se inventan reglas nuevas de lectura para cubrirlos.

## 6. Estado posterior de A-01–A-05 y remanentes

| Hallazgo de Fase 0 | Tratamiento actual sin resolver por inferencia | Referencias |
| --- | --- | --- |
| A-01: fecha final sin año | **Resuelto normativamente por DEC-033:** se exige año; mes/día opcionales sin inventarlos. Inicio/consistencia y mapeo del legado sin año no se resuelven ni ejecutan. | RF-013/CA-013.6; `DATA_MODEL.md §3.2`, INT-008/IA-22; remanentes OPEN-04/07/08 |
| A-02: activos/año | **Resuelto normativamente por DEC-034:** mostrar todas las activas sin depender del año. Geometría/rendimiento/navegación aún pendientes. | RF-005/CA-005.3; `DATA_MODEL.md §4`, INT-002/003/005/IA-13; remanentes OPEN-06/TECH-02 |
| A-03: legado/público | **Parcial por DEC-036:** campos históricos fuera MVP en archivo privado, sin exposición/borrado. Formato/ubicación/almacenamiento, controles y mapeo pendientes; no archiva todo v1 ni decide notas de abandonadas. | RF-017/CA-017.4, RNF-002; `DATA_MODEL.md §§5–7`, INT-008/IA-23; OPEN-08/07/01 |
| A-04: estados/inicio/«Otro» | **Parcial por DEC-035:** «Abandonados», fechas/notas y posibilidad de retomar aprobados. Historial al retomar, transiciones adicionales, inicio/«Otro»/calificación al abandonar, posición/filtros/estilo y privacidad de notas aún pendientes. | RF-015/CA-015.4–5; `DATA_MODEL.md §4`, INT-008/IA-19; OPEN-04 y diseño/privacidad afectados |
| A-05: metas | **Parcial por DEC-037:** «Sin meta establecida» y creación por propietaria aprobados. Unicidad, límites del objetivo, exceso y diseño/contratos concretos siguen pendientes. | RF-018/CA-018.5; `DATA_MODEL.md §3.3`, `ARCHITECTURE.md §6.4`, IA-24; asunto adicional TECH-01/02, no ampliación de OPEN-04 |

**Ninguna OPEN/TECH se cierra por completo.** OPEN-04/06/08 tienen subreglas aprobadas posteriores y remanentes explícitos en `docs/DECISIONS.md §6`. Siguen pendientes identidad/sesión/RLS, contratos/cuotas/privacidad/modelo IA, obra/edición/borrado, reglas restantes de lecturas/historial, tokens/recursos, algoritmo/overflow/accesibilidad, esquema real/backup/migración/reversión, implementación/mapeo seguro del legado, fronteras y calidad/runtime/pruebas/despliegue. No se verificó backend ni se eligieron tecnologías, cuotas o valores por defecto.

## 7. Evidencia, referencias preservadas y límites de cierre

- Los documentos son Markdown UTF-8; se revisan estáticamente encabezados, tablas, IDs y referencias. Los casos CA/IA/DM **no se ejecutaron**. En el estado de esta sincronización, la matriz normativa cubre las 41 DEC, no un porcentaje de implementación.
- Los borradores previos no estaban seguidos por Git al comenzar este pase. La comparación editorial usa una copia previa del árbol local y un parche entregable como artefacto de revisión, no como dependencia durable del repositorio. No se hizo staging ni commit; las rutas documentales de este informe son relativas al repositorio.
- **Sin modificar:** `AGENTS.md`, `docs/CURRENT_STATE.md` y bloques originales DEC-001–DEC-032. El diagnóstico original de `docs/PHASE_0_REPORT.md §§1–10` también permanece íntegro; solo se añaden nota inicial/§11. No se reescriben resultados técnicos históricos.
- `docs/DECISIONS.md §§7–8` distingue mandatos históricos del estado vigente; el plan §§4/6/12/14 ya refleja progreso parcial sin cerrar fases. `AGENTS.md` todavía resume 32 DEC, menciona secciones «Actualización» integradas (§3) y anuncia el plan como próximo documento (§9); esas referencias de estado quedan fuera del alcance, no prevalecen sobre decisiones aprobadas posteriores ni autorizan acciones.
- `docs/PHASE_0_REPORT.md §§1–10` conserva hallazgos/conteos/líneas del 18/10/2026; su §11 y este reporte registran la consolidación y aprobaciones posteriores. Las líneas históricas no son numeración actual de las specs. `docs/CURRENT_STATE.md` sigue siendo auditoría histórica de v1, no seguridad ni entorno remotos vigentes.

**Resultado de la actualización documental anterior (hasta DEC-041):** consolidación editorial sin aprobación integral de especificaciones ni cierre técnico o de toda Fase 0. El estado vigente se registra en §8: matriz de 41 decisiones, además de bloqueos de entorno/backend. **Fase 0 sigue en curso; cualquier SQL, migración, alteración de permisos/datos o despliegue requiere alcance, entorno y autorización explícitos.**

## 8. Actualización de preparación técnica — 19 de octubre de 2026

### 8.1 Verificación documental y decisiones disponibles

- `docs/DECISIONS.md` contiene DEC-001–041; los bloques aprobados previos se conservan. DEC-033–041 están integradas en `PRODUCT.md`, `DESIGN.md`, `INTERACTIONS.md` y `DATA_MODEL.md`. Esta edición corrige trazabilidad explícita en requisitos y afirmaciones de arquitectura que reabrían la identidad de retomada o trataban la recuperabilidad como pendiente de aprobación.
- La ruta `DECISIONES_FASE_0_FINAL.md` no existe en el árbol inspeccionado. No se cotejó ese documento ni se puede afirmar que contenga decisiones adicionales a las 41 registradas. No se infieren decisiones nuevas ni se vuelve a preguntar por las ya registradas.
- La revisión textual de las seis especificaciones no encontró otra contradicción activa entre reglas de producto aprobadas y los cuerpos sincronizados después de corregir `REQUIREMENTS.md` y `ARCHITECTURE.md`. Las subdecisiones técnicas pendientes siguen bloqueando únicamente las tareas afectadas; esto no equivale a aprobación integral de las especificaciones.

### 8.2 Supabase y esquema remoto — actualización tras inspección read-only

- Se inspeccionó en modo solo lectura el proyecto `book-diary` (ref `mxghetuvlknxvztqcgtp`), `ACTIVE_HEALTHY`, región `us-west-2`, PostgreSQL `17.6.1.147` (major 17). La lista de migraciones administradas está vacía, pero no excluye DDL manual. No se leyeron secretos ni filas de negocio, no se hicieron escrituras y no se modificaron datos, esquema, políticas, Auth o configuración.
- `public.books` contiene columnas `id,title,author,cover_image_url,open_library_id,status,start_date,finish_date,last_updated_at,rating,would_recommend,would_reread,engagement,notes,created_at`; conteo exacto 6. Observado PK `id`, CHECK de status `quiero_leer/leyendo/terminado`, rating entero 1–5 y engagement 1–5; sin FKs ni unicidad observada para `open_library_id`. `id/title/status` son NOT NULL; `id` default `gen_random_uuid()`, `last_updated_at/created_at` default `now()`.
- `public.reading_goals` contiene `id,year,target_count,created_at`; conteo exacto 1. Observado PK `id` y `year` único; no se observó CHECK de `target_count` ni FK. `id/year/target_count` son NOT NULL; `id` default `gen_random_uuid()`, `created_at` default `now()`. Los demás campos de ambas tablas admiten NULL y no tienen defaults observados. Índices: PKs y unicidad de `reading_goals.year`; no se observaron triggers. El helper de listado estimó 0 filas para ambas tablas, pero `COUNT(*)` devolvió 6/1; se documentan los conteos exactos.
- **Hallazgo P0:** ambas tablas tienen RLS habilitado (no forzado) y política permisiva `Allow all for anon` asignada a `public`, comando `ALL`, predicados `qual=true` y `with_check=true`. Grantee `anon` y `authenticated` tienen CRUD y también `TRUNCATE`, `REFERENCES` y `TRIGGER`; `service_role` tiene grants similares. RLS no aplica a operaciones de tabla completa como `TRUNCATE` ([PostgreSQL: Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)); este grant es adicionalmente sensible, pero no se identificó/probó una ruta PostgREST/RPC/directa para invocarlo. La configuración/alcance del Data API no se pudo verificar y no se probó acceso REST anónimo, así que se documenta riesgo condicional, no exposición externa confirmada ni explotación. Security Advisor sin lints no elimina esta evidencia manual.
- Se observaron tablas estándar de Auth, incluidas `auth.users`, `identities`, `sessions` y `refresh_tokens`; `auth.users` tiene conteo 0. Configuración de proveedor, OTP/magic link, plantillas, redirect URLs y límites no visible en el acceso disponible.
- **Estado de OPEN:** OPEN-01 queda parcialmente evidenciado: política/grants permisivos observados, pero Data API, proveedor/Auth y diseño de identidad/permisos siguen pendientes. OPEN-07 queda parcialmente evidenciado: el inventario básico ya existe; siguen pendientes relación/mapeo v1→v2, backup restaurable, integridad, ensayo y reversión. El modelo v1 mezcla libro/lectura y sus checks no reflejan el dominio v2.
- **Acción requerida antes de cambios de datos:** propietaria/admin debe confirmar exposición Data API y decidir revisión/contención de políticas/grants mediante autorización separada. No alterar políticas o grants como parte de esta actualización documental. El hallazgo, conteos y columnas constan con más contexto en `docs/PHASE_0_REPORT.md §12.2`.

### 8.3 Runtime y dependencias

- Diagnóstico local: Node `v26.2.0`, npm `11.17.0`; se ejecutaron solo `node --version`, `npm --version` y lectura de manifiestos/metadatos instalados. Versiones directas observadas: Next `16.2.0` (`node >=20.9.0`), Supabase JS `2.110.0` (`>=22.0.0`), Google GenAI `2.13.0` (`>=20.0.0`) y TypeScript `5.9.3` (`>=14.17`). Node 26 satisface esos mínimos declarados, pero **no se ejecutó la aplicación ni build/lint/tipos/pruebas**, por instrucción de proyecto; no es certificación de runtime.
- `package.json` no fija `engines` ni `packageManager`; no se encontró `.nvmrc`, `.node-version` o `.tool-versions`. `@types/node` está en major 20 mientras el runtime disponible es major 26; no se afirma incompatibilidad, pero se recomienda alinear y validar tipos al aprobar TECH-02. `package-lock.json` está presente y no se modificó.
- Recomendación técnica pendiente de aprobación: escoger y fijar una línea de Node soportada por todos los entornos de destino y dependencias, más versión de npm; ejecutar verificaciones no destructivas autorizadas en la fase correspondiente. No cambiar runtime ni dependencias en este pase.

### 8.4 Estrategia de migración segura propuesta (no ejecutada)

1. Mantener v1 y sus datos de origen intactos; capturar inventario de esquema, relaciones, constraints, índices, defaults, RLS/grants y conteos en modo solo lectura.
2. Definir mapeo fila por fila v1→modelo candidato, identificadores estables y resolución manual de ambigüedades; no fabricar fechas, relecturas o historiales ausentes. Conservar todos los registros (DEC-013) y custodiar por separado, de forma privada, campos históricos fuera del MVP (DEC-036).
3. Generar respaldo consistente y demostrar restauración antes de cualquier escritura; trabajar primero en proyecto/branch aislado con datos sintéticos o copia controlada y acceso restringido.
4. Proponer migración aditiva, repetible/idempotente y verificable, con restricciones de integridad y autorización diseñadas explícitamente. No decidir aún SQL ni método físico de recuperación/ediciones/historial; resolver las dependencias técnicas de DEC-008/038–041 y OPEN-01/03/04/07/08.
5. Ensayar migración y reversión/restauración; cotejar conteos, relaciones, claves, fechas parciales, notas, campos archivados, relecturas y metas antes/después. Registrar diferencias y umbrales de aborto. Solo después de aprobación explícita considerar datos reales; producción requiere permiso separado.

Esta es una **propuesta de proceso**, no una estrategia ya aplicada ni una elección de proveedor, mecanismo físico, estrategia de backup o esquema SQL.

### 8.5 Riesgos, entrada a Fase 1 y primera tarea

- **Crítico/P0:** políticas `ALL` permisivas para `public` y grants CRUD a `anon` en ambas tablas; existe además grant `TRUNCATE` no restringido por RLS, aunque no se identificó/probó una vía para invocarlo desde la API. Confirmar con propietaria/admin si el Data API expone `public` y decidir contención urgente, sin cambios remotos implícitos.
- **Alto:** aún no se localizó `DECISIONES_FASE_0_FINAL.md`; validar que las 41 decisiones disponibles sean el conjunto definitivo antes de declarar sincronización definitiva. La evidencia de esta sesión se limita al registro canónico actual.
- **Alto:** falta cerrar estructura técnica para historial al retomar, recuperación de lecturas en relación con DEC-008, ediciones por obra y reglas de visibilidad/conteos. El resultado de producto está aprobado, pero los mecanismos técnicos bloquean esas partes de modelo/migración.
- **Medio:** Node 26 satisface engines directos observados, pero no está fijado y no hay evidencia de ejecución de la aplicación; los tipos Node major 20 requieren validación futura.
- **Checklist previo a Fase 1:** [ ] localizar y cotejar el documento final de decisiones (o confirmar formalmente que DEC-001–041 son el conjunto aprobado); [ ] seis especificaciones revisadas/aprobadas; [x] inventario de solo lectura del proyecto identificado documentado sin secretos ni filas de negocio; [ ] confirmar alcance del Data API y acordar revisión/contención de políticas/grants permisivos con autorización específica; [ ] decisiones técnicas de identidad/Auth, modelo, historial, recuperación, ediciones y migración asignadas; [ ] respaldo/restauración verificables antes de cualquier escritura; [ ] runtime y verificaciones aprobados; [ ] autorización expresa de Fase 1 y entorno aislado.

**Dictamen al redactar este apartado:** la preparación documental mejoró, DEC-001–041 están trazadas y se completó el inventario Supabase de solo lectura, pero Fase 0 **no podía declararse completa**: la fuente final citada no estaba disponible, el riesgo P0 de grants/políticas permisivas requería evaluación autorizada, la exposición Data API/Auth config seguía sin verificarse y faltaban decisiones técnicas y validaciones de respaldo/restauración. La autorización posterior para iniciar preparación de Fase 1 se registra en §9; no equivale a autorización de cambios externos ni al cierre de fase.

**Primera tarea recomendada (solo tras autorización expresa de Fase 1):** confirmar con propietaria/admin el alcance del Data API y acordar el plan autorizado para revisar/contener las políticas y grants permisivos observados. No realizar cambios remotos por esta recomendación. Una primera tarea de código, tras definir alcance y permisos, sería establecer la frontera de autorización/acceso a datos en entorno aislado, con pruebas negativas de visitante y positivas para identidad propietaria; antes de migrar o exponer operaciones.

No se instalaron/actualizaron dependencias, ni se ejecutaron builds, suites, migraciones, SQL de escritura, cambios remotos o despliegues.

## 9. Seguimiento de la auditoría documental — 19 de octubre de 2026

### 9.1 Resultado recibido

La propietaria compartió una auditoría cuyo dictamen es **«parcialmente sincronizado»**. Según ese informe, DEC-001–041 están trazadas en `docs/product/REQUIREMENTS.md §10` y en las seis especificaciones, sin que OPEN/TECH completos se presenten como resueltos. La auditoría señala referencias de estado antiguas en `AGENTS.md` y `docs/IMPLEMENTATION_PLAN.md`, desajuste entre inventario Supabase y checklist, contexto histórico que requiere una nota más visible y ausencia de `DECISIONES_FASE_0_FINAL.md`. Estas afirmaciones se registran como evidencia del documento recibido; no se repitió aquí la auditoría completa de cada decisión.

### 9.2 Cambios documentales realizados en este seguimiento

- `docs/IMPLEMENTATION_PLAN.md`: se actualizaron referencias y conteos a DEC-001–041; se registró el inventario read-only como realizado en su alcance básico y explícitamente parcial respecto de exposición Data API/Auth, DDL manual y pruebas de Fase 1.
- `docs/PHASE_0_REPORT.md`: se añadió nota de lectura vigente y §13 para diferenciar resultados históricos de los actuales, registrar este seguimiento y conservar los pendientes sin cerrar OPEN/TECH.
- `docs/SYNC_REPORT.md`: se actualizó la fecha/estado del documento, se corrigió la referencia al corte DEC-037 y se añadió este apartado.
- `docs/PHASE_1_PREPARATION.md`: se creó un checklist de preparación con hallazgos read-only, riesgos, dependencias, orden recomendado, límites de autorización y baseline técnico recomendado para identidad/RLS. Este baseline conserva el alcance de producto y no cierra OPEN-01/TECH-01.
- No se cambió `docs/DECISIONS.md`, no se alteraron decisiones aprobadas y no se modificaron las seis especificaciones como parte de esta corrección de seguimiento.

### 9.3 Limitaciones y bloqueos conservados

- `AGENTS.md` no fue accesible para lectura ni escritura en esta sesión. La auditoría recibida documenta referencias que habría que sincronizar allí (conteo, precedencia y referencia al plan), pero no se afirma que estén corregidas.
- `DECISIONES_FASE_0_FINAL.md` no está en el árbol documental inspeccionado; no se puede cotejar ni declarar que no contenga acuerdos adicionales.
- La actualización del checklist no equivale a cierre de Fase 1: siguen pendientes las verificaciones de entorno y seguridad, mapeo, respaldo restaurable, ensayo y reversión, además de las subdecisiones OPEN/TECH que afectan el modelo.
- La propietaria autorizó iniciar tareas de preparación de Fase 1. La consulta read-only de proyectos/branches confirmó que `book-diary` está activo y que no hay branches listados; no se creó un branch/proyecto.
- No se inspeccionó código ni se cambió configuración; Supabase solo se consultó en lectura de metadatos. No hubo SQL, escrituras, migraciones, cambios de permisos/datos o despliegue.

**Estado de sincronización:** las seis especificaciones se mantienen reportadas con cobertura DEC-001–041; el conjunto documental completo queda **parcialmente sincronizado** hasta revisar `AGENTS.md` y cotejar el documento de decisiones final citado. Ningún asunto OPEN/TECH se cierra por esta actualización.

## 10. Preparación de entorno aislado y plan de pruebas — 20 de octubre de 2026

### 10.1 Alcance y archivos

Se actualizaron `docs/PHASE_1_PREPARATION.md` §§2, 3, 4, 5, 7–9 y este informe. Se leyeron `AGENTS.md`, decisiones, plan, informe de Fase 0, checklist de Fase 1, las seis especificaciones y manifiestos/lockfile. La inspección fue local/documental; no se consultó Supabase, no se leyeron `.env.local`, secretos ni filas de negocio, y no se crearon proyectos/branches ni se ejecutó SQL, migraciones, builds o pruebas.

### 10.2 Estado de reproducibilidad y propuesta

- No hay `supabase/`, `config.toml`, archivos SQL de esquema/migración ni seed en el repositorio. `types/database.ts` es un contrato TypeScript v1, no DDL; combina libro y lectura en `books` y no representa el modelo lógico v2. El inventario histórico de `docs/PHASE_0_REPORT.md §12.2` y la lista de migraciones gestionadas vacía no permiten garantizar una réplica del DDL manual.
- Se propone como primera opción un Supabase local, aislado y con fixtures sintéticos, **después** de aprobar/versionar esquema, configuración, migraciones y seed. No requiere gasto de nube, pero necesita CLI y runtime compatible; la CLI no está en PATH, Docker CLI sí, y no se comprobó el daemon. No se instalaron dependencias.
- Se compararon alternativa de proyecto remoto separado, Preview Branch y PostgreSQL/mocks locales. Proyecto y branch hospedados pueden cobrar compute/uso y requieren permiso de coste/alcance; un branch no recrea cambios manuales sin migraciones. PostgreSQL/mocks son complementos pero no bastan para validar Auth/RLS/Data API.
- Los precios y comportamiento de planes se consultaron en documentación oficial fechada al momento de esta revisión y se citan en `PHASE_1_PREPARATION.md §7`; no se inspeccionó la cuenta, plan, cupo ni facturación de la propietaria. El coste final no está determinado.

### 10.3 Plan propuesto y bloqueos

`PHASE_1_PREPARATION.md §8` contiene casos sintéticos para lectura pública limitada, rechazo de escritura anónima/no propietaria, escritura de propietaria de prueba, revocación, integridad y respaldo/restauración/reversión. Los casos no están ejecutados y sus precondiciones se mantienen: OPEN-01 debe aprobar identidad, revocación y campos públicos; OPEN-03/04/08 condicionan entidades, fechas, recuperación e historial/archivo; OPEN-07 requiere respaldo/mapeo/restauración; TECH-01 define el enforcement por capa; TECH-02 requiere runtime y runner. Se preservan DEC-001–DEC-041 sin cambios y no se da por resuelta ninguna OPEN/TECH.

### 10.4 Puertas antes de ejecutar

1. Aprobar lista de campos que pueden leerse públicamente, identidad propietaria, sesiones/revocación y mecanismo de autorización.
2. Resolver las subdecisiones de modelo que cambian la integridad/restauración y aprobar el esquema candidato; derivarlo con cuidado del inventario autorizado, nunca de tipos TypeScript solamente.
3. Obtener autorización específica para crear/versionar configuración, migraciones y seed sintéticos, instalar o usar la CLI/runner y ejecutar SQL/pruebas localmente. Esta actualización no autoriza esos pasos.
4. Solo si la fidelidad hospedada es necesaria, presentar presupuesto, duración, alcance, límites y limpieza de un proyecto/branch separado y esperar aprobación expresa antes de crearlo.

**Resultado:** recomendación y plan listos para revisión documental; el entorno todavía no está preparado en ejecución. Fase 1 continúa incompleta; no se avanza a Fase 2.
