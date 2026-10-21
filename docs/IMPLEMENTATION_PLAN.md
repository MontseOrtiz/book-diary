# Book Diary v2 — Plan de implementación por fases

**Estado:** PROPUESTA PARA REVISIÓN. No autoriza implementar, migrar, desplegar ni acceder a datos reales.  
**Fecha de edición documental:** 19 de octubre de 2026; plan original del 18/10/2026.  
**Ubicación:** `docs/IMPLEMENTATION_PLAN.md`.  
**Idioma:** español. **Formato:** Markdown estándar, reutilizable por cualquier agente de IA.

## 1. Propósito y fuentes de verdad

Convertir las especificaciones de Book Diary v2 en entregas pequeñas, comprobables y reversibles, sin perder el historial de v1. El producto es **público para lectura y exclusivo de la propietaria para modificaciones**. Se mantiene el enfoque Spec-Driven Development (SDD).

Consultar, en este orden: `docs/DECISIONS.md` (DEC-001–DEC-041 y asuntos abiertos), `docs/SYNC_REPORT.md`, `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/CURRENT_STATE.md`. `docs/PHASE_0_REPORT.md §§1–10` conserva el diagnóstico histórico del 18/10/2026; §§11–12 documentan actualizaciones posteriores y §13 registra esta revisión de seguimiento. Seguir `/AGENTS.md`.

**Precedencia vigente:** decisiones aprobadas de `docs/DECISIONS.md` > especificaciones coherentes con ellas > propuestas técnicas. Las secciones superpuestas de «Actualización» se integraron editorialmente en los cuerpos según `docs/SYNC_REPORT.md`; no son una segunda versión de las reglas. Ningún diseño lógico constituye autorización para aplicar SQL. La auditoría de v1 fue estática, sobre el commit `b1d32f80a48e8bad2cc9b6a790a997afc265cd32`; no valida el esquema remoto, la seguridad ni el funcionamiento en ejecución.

## 2. Principios de ejecución

1. **Aprobación por fase:** una aprobación del plan no autoriza ejecutar ninguna fase. Cada fase requiere autorización explícita, alcance y entorno definidos.
2. **Protección de datos:** no ejecutar migraciones, borrados, cambios de RLS ni escrituras sobre datos reales sin inventario, respaldo verificable, ensayo y plan de reversión aprobados.
3. **Seguridad efectiva:** ocultar «Agregar libro» o «Editar» no es control de acceso. Comprobar autenticación, autorización y permisos efectivos.
4. **No inventar decisiones:** ante `OPEN-*` o `TECH-*` sin resolver, detener solo las tareas afectadas y presentar opciones; el resto puede seguir en análisis autorizado.
5. **Pruebas y trazabilidad:** cada cambio debe señalar requisito/decisión, archivos tocados, verificación ejecutada y limitaciones. No declarar pruebas no ejecutadas.
6. **Entrega incremental:** separar cambios de datos, lógica, integraciones, UI y despliegue; evitar una reescritura simultánea.

## 3. Mapa de fases y dependencias

| Fase | Resultado principal | Depende de | Puerta para avanzar |
| --- | --- | --- | --- |
| **0. Preparación y cierre de especificaciones** | Base documental coherente y entorno reproducible | Auditoría y borradores actuales | Decisiones bloqueantes asignadas, alcance y criterios de aceptación aprobados |
| **1. Datos, identidad y seguridad** | Modelo y controles probados en entorno aislado; migración ensayada | 0; OPEN-01/03/04/07/08, TECH-01 | Integridad, permisos y restauración verificados; migración real requiere permiso aparte |
| **2. Gestión de libros y lecturas** | Casos de uso y UI funcional básica | 1 (o esquema de prueba aprobado); OPEN-03/04 | Flujos CRUD, relecturas, metas y fechas probados |
| **3. Catálogos y captura asistida** | Búsqueda dual, foto/IA y registro manual | 2; OPEN-02 | Confirmación humana, errores y límites probados |
| **4. Diseño y árbol en escritorio** | Hero, entrada, árbol dinámico y detalle lateral | 2; OPEN-05/06 | Accesibilidad, casos extremos y rendimiento aceptables |
| **5. Móvil y refinamiento accesible** | Repisas móviles, bottom sheet y movimiento reducido | 3–4 | Flujos completos en móvil, teclado y movimiento reducido |
| **6. Validación y lanzamiento** | Aplicación lista para publicar, con reversión | 1–5; TECH-02 | Checklist funcional, seguridad, datos, despliegue y recuperación aprobado |

La secuencia es orientativa: investigación y prototipos aislados pueden realizarse en paralelo si no escriben datos reales ni introducen decisiones no aprobadas.

## 4. Fase 0 — Preparación y cierre de especificaciones

**Objetivo:** evitar que Codex implemente contradicciones o dependa de un entorno no reproducible.

**Tareas y estado documental al 19/10/2026:**
- [x] Confirmar existencia de las fuentes y registrar diferencias del repositorio frente a la auditoría. Evidencia: `docs/PHASE_0_REPORT.md §§3,5`; es inspección estática, no validación del backend.
- [x] Integrar editorialmente las secciones «Actualización» en las seis specs y corregir H-01–H-08; actualizar `docs/SYNC_REPORT.md`. DEC-001–032 permanecen intactas; DEC-033–041 se añadieron con aprobación expresa y trazabilidad.
- [ ] Completar decisiones bloqueantes y aprobación de alcance/aceptación: **parcial**. DEC-033/034 cierran mínimo año y todas las activas globales; DEC-035/036/037 cierran subreglas de abandono, archivo privado y texto sin meta. OPEN-01–08/TECH-01–02 conservan remanentes; ver `docs/DECISIONS.md §6` y `docs/PHASE_0_REPORT.md §11`.
- [ ] Completar tratamiento del legado sin pérdida: **parcial**. Archivo privado sin exposición ni borrado para campos históricos fuera del MVP aprobado (DEC-036); inventario, formato/ubicación/almacenamiento, mapeo, permisos y destino de registros como `quiero_leer` aún requieren definición. No archivar todo v1 por inferencia.
- [ ] Elegir versión compatible de Node/gestor y forma de fijarla: **pendiente**. Node local funciona para el diagnóstico, no está fijado ni se seleccionó una versión de proyecto. El antiguo fallo de Node 21/ICU es histórico, no una reparación ejecutada o asumida; cualquier cambio de entorno requiere autorización específica.
- [ ] Aprobar plan de caracterización de v1 y estrategia de ramas/commits: **propuestos**, no aprobados ni ejecutados, en `docs/PHASE_0_REPORT.md §9`. No se crearon suites ni se ejecutaron pruebas; no realizar builds bajo la regla vigente.

**Criterios de salida:** documentos sin contradicciones activas; preguntas críticas resueltas o claramente bloqueadas; entorno y pruebas planificados; no se han modificado datos ni código de producto.

**Evidencia:** matriz de decisiones pendientes, diff documental, checklist de preparación y reporte de limitaciones.

**Límite:** completar la consolidación y registrar 41 decisiones no marca por sí solo la salida integral de Fase 0 ni habilita automáticamente otra fase. No se aprobaron modelo físico, controles efectivos, runtime fijado, pruebas o cambios remotos por editar este checklist. La autorización de una fase, su alcance y su entorno deben constar por separado; ver §2 y el estado actualizado de `docs/PHASE_0_REPORT.md §13`.

## 5. Fase 1 — Datos, identidad y seguridad

**Objetivo:** preparar una base segura para libros, lecturas independientes, metas anuales y acceso de solo lectura pública.

**Tareas:**
- [x] Realizar inventario básico de solo lectura de tablas, columnas, restricciones observadas, conteos, Auth tables, RLS y grants del proyecto conectado. Evidencia y límites: `docs/PHASE_0_REPORT.md §12.2`. **Parcial respecto de la tarea completa:** Data API/Auth config, índices/DDL manual completo, exposición efectiva y demás verificaciones requieren acceso/validación autorizados; el inventario no equivale a entorno de prueba ni cierra Fase 1.
- [ ] Aprobar identidad bibliográfica (obra/edición), relación libro–lecturas, precisión de fechas, reglas de borrado y conservación del legado (`OPEN-03/04/08`).
- [ ] Diseñar y revisar flujo de magic link, identidad autorizada, sesión, reglas de lectura pública y escritura privada (`OPEN-01`, `TECH-01`).
- [ ] Especificar SQL versionado y políticas como **propuesta**; ejecutar solo en entorno de prueba autorizado.
- [ ] Inventariar datos reales de forma segura, definir mapeo v1→v2 sin inventar fechas ni relecturas; conservar notas, calificaciones y campos legados.
- [ ] Preparar respaldo, procedimiento de restauración, migración repetible/segura, conteos e invariantes antes/después.
- [ ] Ensayar migración y reversión en un entorno aislado; comprobar acceso anónimo de lectura y denegación de escrituras no autorizadas.

**Criterios de salida:** esquema de prueba y permisos verificados; historial conservado en ensayo; conteos e integridad documentados; restauración ensayada. **No incluye migración de producción.**

**Riesgos:** pérdida de registros, acceso indebido, cambios de zona horaria, duplicación. **Mitigación:** respaldo, pruebas de autorización, mapeo explícito, revisión manual de casos ambiguos.

## 6. Fase 2 — Gestión de libros, lecturas y metas

**Objetivo:** ofrecer funcionalidad central con una UI sencilla antes de introducir animaciones complejas.

**Tareas:**
- [ ] Implementar consultas de biblioteca por año y mes de finalización, con fechas completas/parciales y «Sin mes registrado» cuando corresponda.
- [ ] Implementar entidades y flujos separados de libro y lectura; si el libro existe, preguntar «crear relectura» o «corregir información» (`DEC-001`).
- [ ] Implementar estados **Leyendo, Terminado, Abandonado**; «Actualmente leyendo» incluye todas las activas sin depender del año seleccionado (DEC-034). Sección **«Abandonados»** conserva fechas/notas y permite retomar a la propietaria (DEC-035); mecanismo de historial y demás detalles requieren decisión antes de implementar la tarea afectada.
- [ ] Registrar inicio (libro, fecha, formato fijo), permitir editar el formato; finalizar con **al menos año**, mes/día opcionales sin inventarlos (DEC-033), calificación opcional 0.5–5 en pasos de 0.5 y opinión opcional.
- [ ] Implementar edición desde detalle; eliminar lecturas conforme a la política/confirmaciones todavía por aprobar; impedir eliminar libro mientras tenga lecturas asociadas (`DEC-008/026`). Confirmación no permite excepción al bloqueo.
- [ ] Implementar metas CRUD por año, conteo de lecturas finalizadas (incluidas relecturas) y progreso circular con cantidad; sin meta mostrar **«Sin meta establecida»** y permitir crearla a la propietaria (DEC-037). Unicidad, límites y exceso pendientes.
- [ ] Cubrir casos de duplicados, datos faltantes, cambios de año, fechas límite, errores de permisos y estados vacíos.

**Criterios de salida:** operaciones autorizadas completas en entorno de prueba; usuarios anónimos no pueden escribir; las relecturas cuentan de forma independiente; cambiar/eliminar una meta no altera lecturas; pruebas de reglas y fechas pasan.

**Pendiente que no se debe improvisar:** transiciones adicionales, inicio, coherencia de fechas, `Otro`, evaluación al abandonar e historial al retomar (`OPEN-04`); diseño/filtros/posición y privacidad de notas de «Abandonados». El concepto de sección/retomada, mínimo año y todas las activas globales ya están aprobados; no reabrirlos.

## 7. Fase 3 — Catálogos y captura asistida

**Objetivo:** registrar libros con ayuda de proveedores sin perder el control humano.

**Tareas:**
- [ ] Definir contratos y estrategia de búsqueda/normalización entre **Open Library + Google Books**, deduplicación y procedencia de campos.
- [ ] Implementar búsqueda por título/autor, selección de resultado y formulario editable con portada, autor, género, sinopsis y serie si están disponibles.
- [ ] Adaptar captura por fotografía para extraer título/autor y proponer información editable; **nunca guardar automáticamente sin confirmación**.
- [ ] Habilitar registro manual y asistencia de IA cuando no haya resultados; diferenciar datos confirmados, sugeridos y desconocidos.
- [ ] Acordar y aplicar límites de tamaño/tipo, timeouts, cuotas, errores seguros y privacidad/retención de imágenes; proteger costos de API.
- [ ] Probar sin depender de llamadas reales en cada test: resultados vacíos, fallos, respuestas inesperadas, títulos ambiguos y reintentos.

**Criterios de salida:** alta por búsqueda, foto y manual funciona con confirmación; fallos de proveedores no impiden alta manual; controles de acceso y consumo verificados.

## 8. Fase 4 — Experiencia de escritorio y árbol dinámico

**Objetivo:** implementar el diseño aprobado sin comprometer navegación y rendimiento.

**Tareas:**
- [ ] Cerrar paleta, fuentes, recursos y criterios visuales (`OPEN-05`); verificar derechos y peso de imágenes/ilustraciones.
- [ ] Implementar hero a pantalla completa, sakura reversible con scroll, fachada rotulada **«Book Diary»** y acercamiento visual a la puerta (`DEC-017/018/032`).
- [ ] Implementar selector horizontal de años, progreso circular y árbol **dinámico** con rama superior «Actualmente leyendo», doce meses reconocibles y repisas vacías decoradas.
- [ ] Definir algoritmo de distribución, límites, colisiones, densidad, rendimiento, orden y acceso a libros con muchos registros (`OPEN-06`).
- [ ] Mostrar lomos inicialmente; al seleccionar, extraer/girar libro y abrir panel lateral con información; cerrar invierte la interacción.
- [ ] Mantener UI funcional minimalista, en español, solo modo claro; detalles mágicos discretos.
- [ ] Incorporar navegación alternativa con teclado y experiencia completa sin animación para `prefers-reduced-motion`.

**Criterios de salida:** árbol legible con 0, pocos y muchos libros; meses y lecturas activas identificables; interacción de detalle reversible; teclado, foco y movimiento reducido funcionales; rendimiento medido, no supuesto.

**Nota:** la implementación del árbol no obliga a adoptar WebGL; elegir tecnología después de evaluar prototipo, fallback y mantenimiento.

## 9. Fase 5 — Móvil, responsive y accesibilidad

**Objetivo:** experiencia móvil deliberadamente distinta y usable.

**Tareas:**
- [ ] Implementar librero vertical con repisa desplazable horizontalmente por mes; evitar trasladar el árbol complejo al móvil.
- [ ] Implementar detalle como **bottom sheet** accesible, con foco, cierre y retorno al libro seleccionado.
- [ ] Adaptar navegación por años, meta, búsqueda, alta y edición a pantallas táctiles.
- [ ] Comprobar `prefers-reduced-motion`, lectores de pantalla, teclado, contraste, objetivos táctiles y ausencia de scroll horizontal involuntario.
- [ ] Validar tamaños representativos de pantalla y estados de carga, error, vacío y conexión lenta.

**Criterios de salida:** todas las funciones esenciales disponibles en móvil, sin dependencia de hover/WebGL ni pérdida de contexto; verificaciones accesibles documentadas.

## 10. Fase 6 — Validación integral y lanzamiento

**Objetivo:** decidir si la versión puede publicarse con seguridad y recuperación.

**Tareas:**
- [ ] Ejecutar comprobaciones disponibles: tipos, lint, pruebas unitarias/integración/E2E, flujos de autorización y accesibilidad; registrar resultados reales.
- [ ] Revisar rendimiento de hero/árbol, carga de portadas, dispositivos modestos y movimiento reducido.
- [ ] Verificar rutas y APIs frente a abuso, errores de proveedores, cuotas y exposición de datos; revisar configuración de despliegue.
- [ ] Realizar ensayo de migración final y restauración; comparar conteos, fechas, notas y relecturas antes/después.
- [ ] Preparar plan de publicación y rollback; ejecutar migración real **únicamente con autorización expresa adicional**.
- [ ] Validar manualmente una lista de recorridos críticos: visitante, propietaria, registro por foto/manual, relectura, cambio de año, edición, abandono, metas y móvil.

**Criterios de salida:** checklist de aceptación firmado, permisos efectivos verificados, integridad de datos comprobada, fallos conocidos documentados y procedimiento de reversión disponible. No declarar lanzamiento hasta comprobar el entorno real.

## 11. Puertas de aprobación y evidencias

| Momento | Aprobación requerida | Evidencia mínima |
| --- | --- | --- |
| Antes de cualquier implementación | Fase concreta, alcance, entorno y archivos a modificar | Plan de cambios y requisitos/DEC asociados |
| Antes de inspeccionar backend remoto | Acceso autorizado y alcance de solo lectura | Inventario sin secretos |
| Antes de modificar esquema o RLS | Diseño técnico aprobado y entorno de prueba | Migraciones versionadas, casos de permisos y rollback |
| Antes de tocar datos existentes | Respaldo verificable y mapeo aprobado | Conteos, ensayo, restauración y aprobación explícita |
| Antes de consumir IA o APIs con costo | Cuotas, protección y autorización | Límites, manejo de errores y privacidad documentados |
| Antes de desplegar | Checklist integral y plan de reversión | Resultados de pruebas, revisión de seguridad e integridad |

## 12. Matriz de asuntos pendientes por fase

| ID | Impacta principalmente | Condición para desbloquear |
| --- | --- | --- |
| OPEN-01 | 1, 2, 3, 6 | Identidad autorizada, sesiones, RLS y permisos verificados |
| OPEN-02 | 3, 6 | Contratos de catálogo, cuotas, seguridad y privacidad de IA |
| OPEN-03 | 1, 2 | Identidad libro/edición, duplicados y reglas de borrado |
| OPEN-04 | 1, 2 | Inicio/consistencia, transiciones adicionales, «Otro», evaluación al abandonar e historial al retomar; mínimo año y sección/retomada ya aprobados |
| OPEN-05 | 4, 5 | Tokens, recursos, tipografías y especificaciones visuales |
| OPEN-06 | 4, 5 | Algoritmo de árbol, casos extremos y alternativa accesible; todas las activas sin filtro anual ya aprobadas |
| OPEN-07 | 1, 6 | Esquema real, respaldo, migración y reversión ensayados |
| OPEN-08 | 0, 1, 2 | Inventario/mapeo, formato/ubicación/almacenamiento y permisos del archivo privado aprobado; destino restante de registros legados sin pérdida |
| TECH-01 | 1, 2, 3 | Límites servidor/cliente y autorización aprobados |
| TECH-02 | 0, 4, 5, 6 | Runtime, pruebas, rendimiento y despliegue definidos |

## 13. Encargo inicial de análisis — registro histórico

El diagnóstico inicial se realizó y está documentado en `docs/PHASE_0_REPORT.md §§1–10`; §11 y `docs/SYNC_REPORT.md` registran avances posteriores. Se conserva la formulación original como antecedente, no como nueva autorización ni como señal de que el informe sigue pendiente. El siguiente trabajo se delimita en §14.

> Lee `/AGENTS.md`, `docs/DECISIONS.md`, `docs/SYNC_REPORT.md`, las especificaciones y `docs/CURRENT_STATE.md`. Revisa el repositorio actual sin modificar código, dependencias, base de datos ni configuración. Contrasta este plan con la estructura real. Entrega una matriz de discrepancias, dependencias y bloqueos para la **Fase 0**, citando rutas de archivos y distinguiendo lo verificado de lo propuesto. No implementes ni ejecutes migraciones. Pide aprobación antes de cualquier operación de escritura.

## 14. Estado y próxima revisión

- **Aprobado:** decisiones de producto/UX `DEC-001` a `DEC-041` registradas en `docs/DECISIONS.md`; DEC-033–DEC-041 complementan las iniciales intactas, sin aprobación técnica implícita.
- **Propuesto:** orden de fases, arquitectura candidata, diseño lógico, pruebas y puertas de aprobación de este plan.
- **Realizado documentalmente:** diagnóstico de Fase 0, consolidación editorial y sincronización de las decisiones aprobadas; ver `docs/SYNC_REPORT.md` y `docs/PHASE_0_REPORT.md §11`.
- **Pendiente:** remanentes de `OPEN-01`–`OPEN-08` y `TECH-01`–`TECH-02`, aprobación integral de especificaciones/alcance, runtime/pin y estrategia de pruebas, verificación autorizada del backend y demás condiciones de salida de Fase 0. Ninguna OPEN/TECH se declara completamente cerrada.
- **Estado de autorización:** la propietaria autorizó iniciar tareas de preparación de Fase 1. Esto no autoriza crear proyectos/branches con costo, modificar Supabase, ejecutar SQL/migraciones, tocar datos o políticas, instalar dependencias, cambiar configuración, desplegar ni completar tareas que dependan de OPEN/TECH sin aprobación específica.
- **Siguiente acción:** continuar preparación no destructiva, documentar requisitos y realizar verificaciones read-only autorizadas; antes de cualquier operación externa de escritura se requiere entorno aislado confirmado y alcance explícito. La salida integral de Fase 0 y los criterios de salida de Fase 1 siguen pendientes.
