# Book Diary v2 — Instrucciones para agentes de IA

**Estado:** vigente para análisis y planificación; **NO autoriza implementación**.  
**Ubicación:** `/AGENTS.md` (raíz del repositorio).  
**Idioma de trabajo y documentación:** español.  
**Compatibilidad:** instrucciones independientes de proveedor; aplican a Codex, Claude, Gemini, Cursor y otros agentes.

## 1. Objetivo

Book Diary v2 es un diario personal de lecturas **público para consulta y privado para edición**. Se desarrolla mediante **Spec-Driven Development (SDD)**: analizar → especificar → resolver decisiones → planificar → implementar con autorización → verificar. El código existente es v1; no debe confundirse con la especificación de v2.

## 2. Documentación obligatoria y orden de lectura

Antes de proponer cambios, leer, según la tarea:

1. `docs/DECISIONS.md` — **32 decisiones de producto y UX aprobadas** y asuntos abiertos `OPEN-01`–`OPEN-08`, `TECH-01`–`TECH-02`.
2. `docs/SYNC_REPORT.md` — alcance y limitaciones de la sincronización de borradores.
3. `docs/product/PRODUCT.md` — visión, límites del MVP y reglas de negocio.
4. `docs/product/REQUIREMENTS.md` — requisitos y criterios de aceptación.
5. `docs/design/DESIGN.md` — dirección visual; `docs/design/INTERACTIONS.md` — comportamiento y accesibilidad, para tareas de UI.
6. `docs/architecture/DATA_MODEL.md` — **modelo lógico candidato, no esquema SQL aprobado**.
7. `docs/architecture/ARCHITECTURE.md` — **arquitectura candidata, no decisión técnica definitiva**.
8. `docs/CURRENT_STATE.md` — auditoría estática de v1 (commit `b1d32f80a48e8bad2cc9b6a790a997afc265cd32`), no validación de ejecución ni de backend.

No asumir que un archivo existe o está actualizado sin comprobarlo. Si faltan documentos, están en otra ruta o el repositorio cambió desde la auditoría, indicarlo antes de proceder.

## 3. Precedencia y manejo de contradicciones

- Las **decisiones aprobadas** de `docs/DECISIONS.md` prevalecen sobre propuestas anteriores incompatibles.
- Las secciones **«Actualización»** añadidas a las especificaciones sincronizadas prevalecen sobre el texto histórico de esos mismos borradores. Ver `docs/SYNC_REPORT.md`.
- Ningún borrador técnico prevalece sobre una decisión aprobada ni autoriza ejecutar SQL o modificar infraestructura.
- Ante ambigüedad, conflicto no resuelto o requisito sin criterio comprobable: **detener la parte afectada**, citar archivos/secciones y plantear opciones con consecuencias. No completar huecos con suposiciones.
- Para cambiar una decisión aprobada, solicitar aprobación expresa y registrar ID, motivo, fecha y documentos afectados. No reescribir el historial de decisiones silenciosamente.

## 4. Requisitos de producto que no deben perderse

- Visitantes pueden consultar; solo la propietaria autorizada puede crear, editar o borrar. Inicio de sesión por **enlace mágico por correo**; los controles reales de autorización están pendientes de diseño y verificación (`OPEN-01`).
- Separar conceptualmente **libro bibliográfico** de **lectura individual**; conservar relecturas independientes. Al detectar un libro existente, ofrecer crear una relectura o corregir metadatos, sin duplicar automáticamente.
- Estados: **Leyendo, Terminado, Abandonado**. Formatos fijos: **Físico, Kindle, iPad, Audiolibro, Otro**; se puede cambiar el formato de una lectura.
- Calificación opcional de **0.5 a 5**, en pasos de 0.5. Finalización minimalista: fecha, calificación opcional y opinión opcional. Admitir fecha completa, mes/año o solo año sin inventar datos faltantes.
- Buscar en **Open Library + Google Books**; fotografía y ayuda de IA proponen datos en un **formulario editable**, con confirmación humana y vía manual alternativa.
- Preservar **todos** los registros de v1 durante una futura migración, incluidos campos legados aunque queden fuera del MVP. No borrar ni transformar datos sin respaldo, mapeo y verificación.
- Desktop: hero de sakura controlado por scroll → fachada **«Book Diary»** → acercamiento visual a la entrada → biblioteca con **árbol dinámico**, rama superior «Actualmente leyendo», meses identificables y detalles en panel lateral. Móvil: repisas horizontales y detalles en *bottom sheet*.
- UI minimalista en español, solo tema claro; animaciones mágicas discretas y alternativa funcional para `prefers-reduced-motion`. Selector horizontal de años; meta circular con conteo; meses vacíos con pequeño detalle decorativo.
- Solo la propietaria autenticada ve «Agregar libro» en navegación y «Editar» en el detalle. No construir un panel administrativo separado sin nueva aprobación.

Estas notas son un **resumen**: ante diferencias o detalles faltantes, consultar las especificaciones y `DECISIONS.md`.

## 5. Restricciones de trabajo — fase actual

**Hasta autorización explícita para una fase concreta:**

- Permitido: lectura e inspección del repositorio, análisis, revisión de documentación, propuestas, planes y preguntas de decisión.
- No permitido: implementar funcionalidades, refactorizar código, instalar/actualizar dependencias, ejecutar migraciones, alterar datos o permisos, cambiar variables de entorno, publicar/desplegar, ni crear credenciales o consumir APIs de pago.
- No ejecutar operaciones destructivas o de escritura en Supabase, ni asumir que RLS, esquemas, backups o políticas remotas están verificados.
- No leer, copiar, imprimir ni incorporar a documentos secretos de `.env.local` u otras credenciales. Registrar solo **nombres** de variables cuando sea necesario.
- Si una tarea requiere una acción fuera del alcance autorizado, describir exactamente qué acción se necesita y pedir permiso **antes** de ejecutarla.

Cuando se autorice implementación, limitarse al alcance aprobado, evitar cambios ajenos a la tarea y verificar antes de declarar terminado.

## 6. Asuntos bloqueantes antes de implementar

Consultar la definición completa en `docs/DECISIONS.md`:

- `OPEN-01`: identidad autorizada, sesiones, RLS y permisos efectivos.
- `OPEN-02`: integración de catálogos, límites y privacidad de imagen/IA.
- `OPEN-03`: identidad obra/edición, deduplicación y borrado.
- `OPEN-04`: transiciones de lectura, fechas y campo «Otro».
- `OPEN-05`: tokens visuales y recursos definitivos.
- `OPEN-06`: algoritmo, accesibilidad y límites del árbol dinámico.
- `OPEN-07`: esquema remoto real, respaldo, migración y reversión.
- `OPEN-08`: preservación y visibilidad de campos legados fuera del MVP.
- `TECH-01`: límites servidor/cliente, autorización y operaciones de dominio.
- `TECH-02`: runtime compatible, pruebas, calidad, rendimiento y despliegue.

**No todos bloquean toda actividad:** señalar qué decisión bloquea qué fase o tarea; continuar únicamente con análisis o documentación independiente y autorizada.

## 7. Formato de entregables para cualquier IA

Documentar en **Markdown estándar UTF-8**, en español, con rutas relativas al repositorio. Cada documento o propuesta debe ser autónomo y contener, según corresponda:

- propósito, alcance, estado (**aprobado / propuesta / pendiente / verificado en código / no comprobado**), fecha y referencias a archivos o IDs;
- requisitos y criterios de aceptación observables, sin confundir expectativas con implementación existente;
- decisiones, alternativas, dependencias, riesgos, supuestos explícitos y preguntas abiertas;
- pruebas/verificaciones propuestas y condiciones de reversión para cambios de datos;
- lista precisa de archivos afectados, cuando se solicite planificar cambios.

Evitar referencias a «lo hablado en el chat», formatos exclusivos de un modelo, afirmaciones sin evidencia y rutas inventadas.

## 8. Protocolo de ejecución cuando una fase sea autorizada

1. Confirmar **objetivo, archivos afectados, requisitos/IDs y alcance autorizado**.
2. Revisar documentación vigente y estado actual del repositorio; advertir discrepancias.
3. Presentar plan pequeño con riesgos, dependencias y criterios de aceptación.
4. Implementar **solo después de autorización**, sin tocar producción ni datos reales salvo permiso específico.
5. Ejecutar las verificaciones autorizadas disponibles (tipos, lint, pruebas, accesibilidad, revisión manual); indicar las que no pudieron ejecutarse y por qué.
6. Entregar resumen de cambios, evidencias, limitaciones y próximos pasos. No declarar éxito de compilación, seguridad, migración o pruebas que no se hayan ejecutado.

### Reglas especiales para datos y seguridad

Cualquier migración requiere antes: inspección autorizada del esquema y políticas reales, inventario de datos, respaldo verificable, transformación/mapeo explícitos, ensayo en entorno seguro, controles de integridad y procedimiento de reversión. La auditoría `CURRENT_STATE.md` es **estática**: no acredita el estado de Supabase en producción.

La interfaz que oculta botones **no** constituye autorización. El diseño debe validar permisos en la capa correspondiente y probar RLS o controles equivalentes en un entorno autorizado.

## 9. Próximo trabajo esperado

El siguiente entregable previsto es `docs/IMPLEMENTATION_PLAN.md`, **solo planificación**: fases, dependencias, puertas de aprobación, verificaciones y criterios de salida. Debe tratar los bloqueos técnicos antes de proponer migraciones o exposición pública. No interpretar la existencia de este `AGENTS.md` como permiso para comenzar a programar.
