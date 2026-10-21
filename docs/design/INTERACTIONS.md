# Book Diary v2 — Interacciones y comportamiento

> **Estado:** Borrador consolidado para revisión; no aprobado como especificación completa · **Fecha:** 19 de octubre de 2026 · **Idioma:** español
> **Ubicación:** `docs/design/INTERACTIONS.md`
> **Fuentes:** `docs/DECISIONS.md`, `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md` y `docs/design/DESIGN.md`.
> **Alcance:** especificación de experiencia, **no** autorización de implementación, elección de tecnología ni cierre de Fase 0.

## 1. Convenciones y precedencia

- **CONFIRMADO:** comportamiento aprobado en `docs/DECISIONS.md` o criterio derivado que no completa decisiones abiertas; no significa implementado ni probado.
- **PROPUESTA:** decisión operativa recomendada para validar; no constituye requisito aprobado.
- **PENDIENTE:** aspecto sin definición suficiente; no inventar valores ni tratar propuestas como acuerdos.
- Las decisiones aprobadas de `docs/DECISIONS.md` prevalecen sobre propuestas incompatibles. Esta edición mantiene DEC-001–037 e integra DEC-038–041 en flujos y casos, sin aprobar sus detalles técnicos pendientes.
- Ante discrepancias o reglas abiertas, detener solo la parte afectada y registrar alternativas para aprobación antes de implementar. `docs/PHASE_0_REPORT.md` conserva los hallazgos previos; `docs/SYNC_REPORT.md` registra el pase editorial.
- Los identificadores `INT-*` de este documento son locales; `RF-*` y `RNF-*` corresponden a `REQUIREMENTS.md`.

## 2. Recorrido general de la página pública

### INT-001 — Hero inicial (CONFIRMADO; RF-020; DEC-017/029)

**Estado inicial:** hero a **pantalla completa** con título «Book Diary», enmarcado por ramas de sakura; la fachada de la librería existe visualmente detrás de las ramas, no como una sección independiente.

**Acción:** desplazamiento vertical hacia abajo.

**Resultado:** las ramas se apartan progresivamente como cortinas y revelan la fachada ilustrada. La composición preserva la legibilidad del título y no tapa controles críticos.

**Reversibilidad:** al desplazarse hacia arriba, la transición retrocede y recupera la composición inicial.

**No hacer:** sustituir el efecto por una transición entre dos páginas desconectadas, ni bloquear el acceso a la biblioteca detrás de una animación obligatoria.

La apertura **progresiva y reversible vinculada al scroll** está aprobada; no es una alternativa autónoma por decidir. Distancia, anclaje, curva de movimiento, capas y comportamiento del título siguen **PENDIENTES** (OPEN-05/TECH-02). Con movimiento reducido se ofrece acceso equivalente sin recorrido animado obligatorio; su fallback concreto no está elegido.

### INT-002 — De la fachada a la biblioteca (CONFIRMADO; RF-003, RF-019, RF-020; DEC-007/009/018/024/025/030/032)

La secuencia aprobada es **hero → revelación de fachada con letrero exactamente «Book Diary» → aproximación visual hacia la puerta → biblioteca**. En la biblioteca están los patrones aprobados de **selector horizontal de años, meta anual con indicador circular y conteo (si existe), y árbol/librero**. Presentarlos en ese orden interno es una **propuesta de composición**, no una decisión nueva sobre su orden exacto. El año activo se identifica claramente y el conteo puede expresarse como «12 de 20 libros», sin depender solo de color o porcentaje.

«Actualmente leyendo» ocupa una **rama o repisa superior diferenciada** de los doce meses y muestra **todas las lecturas activas, sin depender del año seleccionado** (DEC-007/034). La geometría concreta permanece pendiente OPEN-06; no ocultar activas por su año de inicio o por el año de finalizados consultado.

**Sin meta:** mostrar exactamente **«Sin meta establecida»** y permitir a la propietaria crearla (DEC-037). No confundir este estado con error de consulta ni inventar un objetivo. La forma de la acción conserva el control de autorización, sin fijar un texto de botón nuevo.

**PENDIENTE:** técnica 2D/3D y parámetros del acercamiento, fallback concreto y tratamiento del objetivo superado. No se fija aquí rango de objetivo, unicidad, saturación visual ni diseño concreto del estado sin meta. El acceso a biblioteca se conserva sin desplazamiento cinematográfico cuando corresponde movimiento reducido.

La navegación funcional no debe añadir «Estadísticas» o «Sobre mí» únicamente porque aparecieron en un mockup. **«Agregar libro» está en navegación solo para la propietaria autenticada y autorizada**. El método de acceso es enlace mágico por correo; identidad autorizada, sesión y permisos/RLS siguen pendientes OPEN-01/TECH-01. Ocultar el control no reemplaza verificar permisos.

## 3. Árbol y exploración por año en escritorio

### INT-003 — Estado de las repisas (CONFIRMADO; RF-004, RF-005, RF-021; DEC-005/006/007/031)

- El árbol adapta **estructura y distribución** de ramas/repisas a la cantidad de libros de cada mes y las reorganiza suavemente al cambiar el año. No se exige una geometría rígida ni doce repisas físicas fijas.
- Existen etiquetas legibles para **enero a diciembre**, sin duplicar u omitir meses.
- Los libros completados se ubican por su **fecha de finalización**, no de inicio.
- Si se conoce el año pero no el mes, la lectura aparece en **«Sin mes registrado»**, sin inventar un mes.
- **Todas las lecturas activas** pertenecen a la **rama superior «Actualmente leyendo»**, no a un mes de finalización, y se muestran independientemente del año seleccionado (DEC-034).
- Todos los libros de las repisas se presentan **inicialmente por el lomo**. Si no existe imagen de lomo real, se usa una representación estilizada identificable.
- Los meses vacíos conservan **etiqueta, repisa vacía y pequeño elemento decorativo**; no muestran libros ficticios.

La finalización requiere **al menos año**; mes y día desconocidos se conservan como tales, sin inventarlos (DEC-033). No se completa una lectura con año vacío. La conservación/migración de datos legados no autoriza fabricar un año para registros antiguos inconsistentes (DEC-013).

**PENDIENTE OPEN-06/TECH-02:** algoritmo, distribución geométrica de meses/rama superior, densidad, desbordamiento, repisas adicionales y límites de rendimiento. No fijar capacidad arbitraria, ocultar meses/lecturas ni permitir solapamientos que impidan acceso.

### INT-004 — Selección de un libro en escritorio (CONFIRMADO; RF-006, RF-021; DEC-020/026/029)

| Estado | Disparador | Resultado esperado |
| --- | --- | --- |
| `en_repisa` | Estado inicial | Lomo visible e identificable; el libro se puede activar. |
| `abriendo` | Activación del libro | El libro seleccionado sale visualmente de la repisa y gira para revelar la portada. |
| `detalle_abierto` | Fin de apertura o apertura sin movimiento | Se presenta un **panel lateral** legible con datos del libro y de la lectura seleccionada. |
| `cerrando` | Acción de cerrar | La presentación visual regresa al lomo y a la posición de origen. |
| `en_repisa` | Fin del cierre | La repisa vuelve a estar disponible para explorar. |

**Nota:** los nombres de estados son descriptivos, no nombres de variables obligatorios.

**Reglas:**

1. La animación es una representación de la transición; **la información no depende de que termine o de que exista WebGL**.
2. Si falta la portada, el detalle ofrece una alternativa textual o visual identificable; no se inventa una cubierta editorial auténtica.
3. Una selección repetida o rápida no debe dejar dos detalles superpuestos ni un libro permanentemente fuera de su repisa.
4. La lectura seleccionada debe conservar su identidad propia: dos relecturas del mismo libro pueden mostrar calificaciones y fechas distintas.
5. Debe existir una acción explícita para cerrar el detalle.
6. La propietaria autenticada y autorizada puede iniciar **«Editar» desde el panel**; no se requiere dashboard administrativo independiente.
7. Al cerrar se revierte la interacción o se recupera el estado navegable sin animación cuando proceda, restaurando un foco apropiado. El detalle debe seguir siendo accesible si la animación se interrumpe.
8. Formato y edición usada, cuando se registre, corresponden a la **lectura seleccionada**, no se propagan a otras experiencias del mismo libro. Las ediciones de una obra se agrupan bajo un libro; edición usada es opcional por lectura (DEC-038/041). Representación/controles concretos pendientes.

**PROPUESTA para validar:** el panel lateral podría usar patrón de diálogo modal con `Escape` y control de foco mientras está abierto, o una presentación lateral no modal con patrón accesible equivalente. La modalidad y esos mecanismos concretos no están aprobados; el formato lateral y la restauración apropiada de foco sí están definidos.

**PENDIENTE OPEN-05/TECH-02:** tamaño, posición exacta dentro del formato lateral, modalidad, respuesta a clic exterior, duración, easing, perspectiva, escala y manejo exacto de interrupciones. No reabrir el panel lateral aprobado como un tipo de detalle libre.

### INT-005 — Cambio de año (CONFIRMADO; RF-003, RF-019, RF-021; DEC-006/019/024/029)

**Acción:** elegir otro año disponible en el **selector horizontal**, con identificación clara del año activo.

**Resultado:** cambia el año activo, las lecturas completadas agrupadas en meses y el objetivo/progreso correspondiente. **El árbol reorganiza suavemente sus ramas** según el volumen de libros del año seleccionado; la transición no impide interactuar.

Cambios rápidos no mezclan lecturas completadas de años distintos ni dejan meses o libros inaccesibles. Mantener identidad y foco coherentes **no exige conservar la geometría entre años**. Sin animación deben actualizarse los mismos datos y mantenerse todas las acciones. **Todas las activas siguen visibles al cambiar año** (DEC-034); el filtro anual solo cambia los finalizados correspondientes, no excluye activas.

**Estados que deben distinguirse:** año con lecturas, año sin lecturas, meta existente, **«Sin meta establecida»**, carga y error. La ausencia de meta permite crearla a la propietaria y no debe confundirse con un error de consulta (DEC-037).

**PROPUESTA para validar:** si hay un detalle abierto al cambiar de año, cerrarlo de forma controlada antes de reemplazar el contenido, conservando un destino de foco coherente. La elección exacta del comportamiento queda **PENDIENTE**.

## 4. Experiencia móvil

### INT-006 — Librero vertical móvil (CONFIRMADO; RF-022; DEC-021/029)

- Sustituye el árbol complejo por un **librero vertical sencillo**.
- Una repisa etiquetada por mes; libros inicialmente por el lomo.
- Cuando no caben, la repisa permite **desplazamiento horizontal** para alcanzar todos los libros.
- Al activar un libro se muestra su detalle en un **panel inferior (`bottom sheet`)**, sin exigir rotación 3D, hover, WebGL ni gesto de precisión.
- Cerrar el bottom sheet recupera el contexto navegable y un foco apropiado; todas las acciones siguen disponibles sin animación. Su patrón accesible concreto se debe especificar antes de implementar.
- Año, meta, todas las activas de «Actualmente leyendo», «Abandonados» y «Sin mes registrado» permanecen accesibles cuando correspondan, sin asignar aquí posición o filtros nuevos a abandonados.
- El sakura es decorativo y no compite con los controles.

**PROPUESTA para validar:** añadir controles accesibles de avance/retroceso cuando el contenido horizontal no quepa, además del gesto táctil; mantener etiquetas y nombres de libros accesibles para lectores de pantalla.

**PENDIENTE OPEN-05/06 y TECH-02:** puntos de corte, cantidad de lomos visibles, dimensiones, modalidad y gestos/cierre concretos del bottom sheet, controles de desplazamiento y tratamiento del hero en pantallas pequeñas. El patrón inferior ya está aprobado.

## 5. Flujos administrativos y estados de interfaz

### INT-007 — Alta por búsqueda, fotografía o vía manual (CONFIRMADO; RF-007–010, RF-016; DEC-001/010/011/012)

**Búsqueda:** introducir título o autor → consultar **Open Library y Google Books** → elegir resultado → revisar/corregir datos en **formulario editable** → confirmar registro. Prioridad, combinación de respuestas y resolución de discrepancias siguen pendientes OPEN-02.

**Fotografía:** seleccionar/capturar imagen de portada física o pantalla Kindle → identificar título/autor con IA → buscar coincidencias → precargar **formulario editable** → revisión/corrección humana → confirmación → registro. El reconocimiento por imagen **no equivale a alta automática sin revisión**.

**Sin resultados o fallo:** ofrecer **registro manual asistido por IA**, con sugerencias revisables y sin presentarlas como hechos verificados. Si catálogos o IA fallan, la entrada completamente manual debe seguir disponible; no exigir asistencia exitosa para guardar.

**Libro existente:** ofrecer **«Nueva lectura/relectura»** o **«Corregir datos»**, sin duplicar automáticamente ni sobrescribir lecturas. Las **ediciones de una obra se agrupan bajo un libro**, con **edición usada opcional por lectura** (DEC-041); obra frente a edición ya no son alternativas de identidad abiertas. Detección de coincidencias, referencias/ISBN, conflictos y estructura técnica siguen pendientes OPEN-03, coordinados con OPEN-02/TECH-01.

**Estados mínimos:** entrada, procesando, resultados, sin resultados, error recuperable, revisión y confirmación. No afirmar que un proveedor ha identificado con certeza una edición si los datos no lo sustentan.

**PENDIENTE OPEN-02/03:** prioridad/procedencia de datos, deduplicación/conflictos, identificadores y representación de ediciones, proveedor/modelo IA, límites de archivo/consumo, timeout, privacidad, retención y errores seguros. Detalles de formulario/mensajes se revisan con OPEN-05; autorización con OPEN-01/TECH-01. No fijar valores ni llamar servicios para validar esta especificación.

### INT-008 — Gestión de lecturas y metas (CONFIRMADO; RF-011–019; DEC-002–005/008/013–016/030/033–041)

- Iniciar y terminar una lectura modifica **esa instancia de lectura**, no la identidad bibliográfica global.
- Los estados son **Leyendo, Terminado y Abandonado**. Las abandonadas no cuentan como completadas para metas (DEC-014). En **«Abandonados»** se conservan fechas/notas y la propietaria puede retomar **la misma lectura**, preservando el historial de abandono/reanudación sin sobrescribirlo (DEC-035/039). No crear automáticamente otra lectura al reanudar. No añadir «Pausado»; transiciones adicionales, posición/filtros/estilo, evaluación al abandonar y almacenamiento/presentación del historial siguen pendientes. Notas conservadas no son públicas por inferencia ni por la regla del archivo privado de campos legados.
- Al comenzar se registran libro, fecha de inicio y formato; la obligatoriedad/precisión del inicio sigue pendiente OPEN-04. El formato es un valor de **Físico, Kindle, iPad, Audiolibro u Otro**, editable por lectura; no se aprueba mantener historial ni múltiples formatos simultáneos. El detalle de «Otro» está pendiente.
- Un libro puede tener **experiencias distintas en varios formatos** porque el formato pertenece a la lectura, no al libro (DEC-038). Cada lectura mantiene un formato editable; cambiarlo no crea automáticamente otra lectura ni altera experiencias previas (DEC-002/016). Ediciones de una obra agrupadas bajo un libro, con edición usada **opcional** por lectura (DEC-041); no exigir ISBN ni elegir tablas/campos/UI físicos.
- La finalización usa un formulario minimalista: **fecha de finalización; calificación opcional de 0.5 a 5 en pasos de 0.5; opinión opcional**. No exigir recomendación, intención de releer o enganche. Cero no significa ausencia de estrellas y no es una calificación válida.
- Una relectura crea una instancia independiente; no sobrescribe fechas, formato ni evaluación previas.
- Las lecturas históricas admiten la precisión de fecha aprobada en producto; el agrupamiento nunca inventa un mes.
- Finalizar exige **como mínimo año**; mes y día son opcionales, con fecha completa, mes/año o solo año sin inventar componentes (DEC-033). El caso de año vacío no cumple el requisito de finalización. Inicio desconocido y demás validaciones/transiciones permanecen pendientes OPEN-04; no inventar fechas legadas para forzar su migración.
- Crear, editar o eliminar una meta anual no borra ni altera lecturas; el progreso cuenta las lecturas finalizadas del año correspondiente, incluidas las relecturas.
- La meta usa **indicador circular y conteo explícito**; no truncar el conteo real si se supera el objetivo. Si no hay meta, mostrar exactamente **«Sin meta establecida»** y permitir que la propietaria cree una (DEC-037). Límites del objetivo, unicidad, exceso y presentación concreta siguen pendientes, relacionados con TECH-01/02 y sin ampliar silenciosamente OPEN-04.
- **Bloquear el borrado de un libro mientras tenga lecturas asociadas.** Deben eliminarse primero esas lecturas mediante acciones explícitas; no ejecutar cascadas implícitas ni permitir que una confirmación habilite esa excepción (DEC-008).
- **Las lecturas eliminadas deben poder recuperarse**, mediante borrado lógico o equivalente (DEC-040). La eliminación irreversible no es una alternativa admitida. No se aprueban papelera, plazos, controles, columnas ni estrategia física; visibilidad/filtros/conteos, permisos y efectos de restauración deben especificarse antes de implementar. No asumir que una lectura eliminada recuperable deja de estar asociada y permite borrar el libro: la relación con el bloqueo DEC-008 requiere resolución técnica explícita, sin destruir historial ni recuperación.
- Preservar todos los registros v1 (DEC-013). Los campos históricos **fuera del MVP** se conservan en **archivo privado**, sin exposición pública ni eliminación (DEC-036). Formato, ubicación, almacenamiento, mapeo y permisos efectivos siguen pendientes OPEN-08/07/01. No convertir pendientes en terminados ni extender esta decisión a la publicación de notas de «Abandonados».

**PROPUESTA para validar (OPEN-03):** solicitar confirmación antes de eliminar una lectura o un libro **sin lecturas asociadas**, explicando impacto conforme a las reglas aprobadas. La confirmación y el mecanismo físico siguen pendientes; la **recuperabilidad de lecturas ya es obligatoria** por DEC-040 y no se extiende por inferencia al borrado de libros. El bloqueo DEC-008 no se puede eludir con confirmación ni tratar recuperables como cero asociaciones sin una regla técnica resuelta.

## 6. Accesibilidad, movimiento reducido y fallbacks

### INT-009 — Acceso equivalente (REQUISITO; RNF-003, RNF-005; DEC-022/023/027/028/029)

- Todas las acciones principales se pueden realizar mediante teclado y tecnologías de asistencia; ninguna depende exclusivamente de hover, arrastre preciso o efectos 3D.
- Cada libro seleccionable tiene nombre accesible que permite identificarlo, aunque visualmente solo se vea el lomo.
- La posición del foco debe ser predecible al abrir y cerrar detalles, cambiar de año y mostrar errores.
- Las transiciones no deben ocultar información necesaria ni impedir desplazamiento normal.
- Respetar `prefers-reduced-motion`: mostrar hero/fachada y detalles mediante estados estáticos o cambios mínimos, **sin exigir el recorrido animado**.
- Si falla el render ilustrado o WebGL, la biblioteca y el detalle siguen disponibles mediante una representación operable.
- Los mensajes de error y los estados de carga se comunican de forma textual, no solo por color o animación.
- UI funcional **minimalista**, en **español**, solo **tema claro**. Ilustraciones principalmente en hero/acentos y árbol central; pétalos, ramas y respuesta al cursor son mágicos pero discretos, nunca barreras ni distracción que impida leer o actuar.
- `prefers-reduced-motion` se respeta automáticamente; no se exige interruptor manual de animaciones. La alternativa mantiene entrada a biblioteca, años, detalle y gestión disponibles sin movimiento obligatorio.

**PROPUESTA para validar:** usar transiciones discretas de opacidad para movimiento reducido cuando no produzcan barreras; una versión completamente estática también es válida.

## 7. Pruebas de aceptación de interacciones

Casos **especificados, no ejecutados**. Conservan los IDs IA existentes e integran decisiones hasta DEC-041 sin superponer versiones. No aprueban tokens, tiempos, gestos, modalidad ni detalles OPEN/TECH todavía pendientes.

| Caso | Resultado comprobable | Trazabilidad |
| --- | --- | --- |
| IA-01 | El hero de pantalla completa muestra «Book Diary» y sakura; el scroll revela progresivamente la fachada detrás de las ramas. | INT-001 / RF-020 / DEC-017 |
| IA-02 | Al subir se recupera la escena inicial sin navegación adicional. | INT-001 / RF-020 |
| IA-03 | Los doce meses son identificables; cada mes vacío conserva repisa y pequeño adorno, sin libros ficticios ni meses ocultos. | INT-003 / RF-004, RF-021 / DEC-006/031 |
| IA-04 | Activar un lomo lo extrae/gira hacia portada y abre panel lateral; al cerrar se recupera navegación y foco apropiado, con alternativa sin animación. | INT-004 / RF-006, RF-021 / DEC-020/029 |
| IA-05 | Con movimiento reducido o sin efectos 3D, el detalle sigue siendo accesible. | INT-004, INT-009 / RNF-003 |
| IA-06 | El selector horizontal identifica año activo; cambiarlo reorganiza suavemente las ramas según volumen y actualiza finalizados/meta sin exigir geometría fija. Cambios rápidos no mezclan años y sin animación hay equivalencia funcional. | INT-005 / RF-003, RF-019 / DEC-006/019/024/029 |
| IA-07 | Una lectura sin mes conocido se muestra en «Sin mes registrado». | INT-003, INT-006 / RF-004 |
| IA-08 | En móvil se alcanza todo lomo mediante repisas horizontales y se abre bottom sheet sin WebGL/hover; cerrar recupera contexto y foco apropiado. | INT-006 / RF-022 / DEC-021 |
| IA-09 | Búsqueda dual o fotografía precargan formulario editable, con revisión/confirmación antes de guardar; no hay alta automática y permanece alternativa manual ante fallos. | INT-007 / RF-007–010 / DEC-010/011 |
| IA-10 | Dos lecturas del mismo libro conservan detalles independientes. | INT-008 / RF-016 |
| IA-11 | «Agregar libro» en navegación y «Editar» desde detalle solo aparecen para propietaria autenticada/autorizada; visitante o sesión no autorizada no pueden escribir por invocación directa. Verificación de backend requiere entorno autorizado. | INT-002/004 / RF-002, RNF-001 / DEC-009/025/026 |
| IA-12 | La fachada dice exactamente «Book Diary»; después de revelarse ocurre aproximación visual a puerta antes de biblioteca, con entrada funcional sin movimiento obligatorio. | INT-001/002/009 / RF-020 / DEC-018/029/032 |
| IA-13 | «Actualmente leyendo» está en rama superior diferenciada de los doce meses y muestra todas las activas, independientemente del año; cambiar año no las excluye por fecha de inicio. | INT-002/003/005 / RF-005 / DEC-007/034 |
| IA-14 | Un libro existente ofrece nueva lectura/relectura o corregir datos, sin duplicación automática ni sobrescribir historia. | INT-007/008 / RF-010, RF-016 / DEC-001 |
| IA-15 | Sin resultados se ofrece registro manual asistido por IA revisable; fallo de IA no impide entrada completamente manual. | INT-007 / RF-009 / DEC-012 |
| IA-16 | Finalizar admite ausencia de estrellas/opinión; si hay estrellas son 0.5–5 en pasos 0.5, rechazando 0, 5.5 y fracciones distintas. No exige evaluación legada. | INT-008 / RF-013 / DEC-003/004 |
| IA-17 | La lista de formatos es Físico, Kindle, iPad, Audiolibro, Otro; pertenece a cada lectura, no al libro, y editar uno no altera otra lectura ni añade varios simultáneos. Inicio/«Otro» siguen pendientes. | INT-008 / RF-012, RF-014 / DEC-002/015/016/038 |
| IA-18 | Libro con cualquier lectura asociada no puede borrarse ni mediante confirmación; no se pierden lecturas por cascada implícita. | INT-008 / RF-011 / DEC-008 |
| IA-19 | «Abandonados» conserva fechas/notas y no suma como completados; retomar conserva la misma lectura y su historial sin sobrescribirlo. Almacenamiento/presentación del historial, transiciones adicionales, posición/filtros/estilo y publicación de notas no se inventan. | INT-008 / RF-019 / DEC-014/035/039 |
| IA-20 | Meta combina círculo y conteo explícito de finalizaciones, incluidas relecturas; editar/eliminar meta no cambia lecturas. No se fija saturación ni objetivo sin regla aprobada. | INT-002/008 / RF-018, RF-019 / DEC-030 |
| IA-21 | UI funcional es minimalista, en español y solo clara; ornamentos discretos no bloquean lectura, teclado, controles ni funciones con movimiento reducido. | INT-009 / RNF-003, RNF-005 / DEC-022/023/027/028/029 |
| IA-22 | Finalizar requiere al menos año; acepta solo año o mes/año sin inventar componentes y rechaza año vacío, sin exigir estrellas/opinión. | INT-003/008 / RF-004, RF-013 / DEC-033 |
| IA-23 | Los campos históricos v1 fuera del MVP se preservan en archivo privado sin exposición pública ni eliminación; el caso no selecciona formato, ubicación o almacenamiento ni escribe datos reales. | INT-008 / RNF-002 / DEC-013/036 |
| IA-24 | Si no hay meta, aparece exactamente «Sin meta establecida» y la propietaria puede crearla; un error de consulta no se presenta como ausencia ni concede permiso de escritura a visitantes. | INT-002/005/008 / RF-018, RF-019 / DEC-037 |
| IA-25 | Un mismo libro admite experiencias distintas con formatos diferentes; el formato se consulta/edita por lectura y no altera el libro ni otras lecturas. Cambiar formato no crea automáticamente otra experiencia. | INT-004/008 / RF-014, RF-016 / DEC-038/002/016 |
| IA-26 | Reanudar una abandonada mantiene la identidad de la misma lectura y preserva su historial de abandono/reanudación y fechas/notas; no la sustituye por una nueva ni sobrescribe el pasado. La prueba física espera diseño del historial. | INT-008 / RF-015 / DEC-039 |
| IA-27 | Una lectura eliminada permanece recuperable y conserva historia; no se implementa borrado irreversible ni se presupone papelera. Controles, plazos, filtros/conteos y efectos de restauración quedan bloqueados hasta especificación técnica; no se libera automáticamente el borrado del libro. | INT-008 / RF-011, RF-015 / DEC-008/040 |
| IA-28 | Ediciones de la misma obra se agrupan bajo un libro y la edición usada es opcional por lectura. No exige ISBN ni duplica automáticamente el libro por una edición distinta; coincidencias/conflictos concretos requieren la regla pendiente. | INT-007/008 / RF-010, RF-012, RF-016 / DEC-041 |

## 8. Decisiones abiertas que requieren validación

| ID | Decisión | Estado |
| --- | --- | --- |
| OPEN-05 / TECH-02 | Recursos, distancias, capas, técnica de entrada, duraciones/easing y fallback concreto; no se reabren secuencia ni reversibilidad. | PENDIENTE de validación visual/técnica |
| OPEN-06 / TECH-02 | Algoritmo dinámico, densidad/overflow, geometría de meses y rama superior, navegación y rendimiento. | PENDIENTE; rama superior y todas las activas sin filtro anual ya aprobadas |
| OPEN-05 / TECH-02 | Dimensiones, modalidad y patrón de foco de panel lateral/bottom sheet; cierre exterior, gestos, interrupciones y cambio de año con detalle abierto. | PENDIENTE; formatos lateral/inferior ya aprobados |
| TECH-02 | Breakpoints, controles accesibles de desplazamiento y hero móvil. | PENDIENTE; sin tamaños ni capacidades arbitrarias |
| OPEN-01 / TECH-01 | Identidad autorizada, sesión magic link y permisos efectivos de cada operación. | PENDIENTE de diseño y verificación autorizada |
| OPEN-02 / OPEN-03 | Contratos/límites/privacidad y deduplicación/conflictos/identificadores de obra-ediciones; estructura y controles de edición usada opcional. | PENDIENTE; libro agrupa ediciones de obra, formato por lectura y revisión humana ya aprobados |
| OPEN-03 / TECH-01 / TECH-02 | Confirmaciones; mecanismo/controles/plazos de recuperación de lecturas, visibilidad/filtros/conteos/efectos de restauración y vínculo con bloqueo de libros. | Recuperabilidad de lecturas obligatoria; sin papelera ni SQL elegidos; no suponer cero asociaciones |
| OPEN-04 / TECH-01 | Inicio desconocido/coherencia de fechas, transiciones adicionales, evaluación al abandonar, «Otro» y almacenamiento/presentación del historial. | Retomar misma lectura sin sobrescribir historia ya aprobado; posición/filtros/estilo y privacidad de notas pendientes |
| OPEN-08 / OPEN-07 / OPEN-01 | Formato, ubicación/almacenamiento, mapeo y controles de acceso del archivo privado de campos legados fuera del MVP; publicación de notas de abandonados por definir separadamente. | PENDIENTE; privacidad/conservación del archivo aprobadas, sin elegir implementación ni visibilidad de notas ajenas a ese archivo |

Los IDs son los canónicos de `docs/DECISIONS.md`; `INT-*` e `IA-*` solo identifican flujos/casos locales. Las invariantes adicionales de metas (unicidad/rango/exceso) y su presentación concreta requieren aprobación relacionada con TECH-01/02, sin ampliar OPEN-04; el texto «Sin meta establecida» y poder crear una meta ya están aprobados.

## 9. Criterio de aprobación

Este documento pasa a **Aprobado** únicamente cuando la propietaria confirme los comportamientos propuestos que afecten la experiencia y se resuelvan los pendientes bloqueantes. No implica aprobación de librerías, arquitectura, migraciones o código. Ningún agente debe implementar valores temporales o de layout inventados como si fueran requisitos confirmados.

La edición documental del 19/10/2026 integra DEC-001–041 en los flujos INT y casos IA pertinentes, sin sección superpuesta de actualización. No prueba implementación ni validación de esos recorridos, no cierra toda Fase 0 y no autoriza Fase 1.
