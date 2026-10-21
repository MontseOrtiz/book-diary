# Book Diary v2 — Requisitos funcionales y criterios de aceptación

> **Estado:** Consolidado editorialmente; decisiones de producto aprobadas y detalles pendientes. No constituye aprobación integral de la especificación ni cierre de Fase 0. · **Fecha:** 19 de octubre de 2026 · **Idioma:** español
>
> **Fuente de producto:** `docs/DECISIONS.md` (41 DEC aprobadas) y `docs/product/PRODUCT.md` (consolidado editorialmente, con detalles pendientes).
>
> **Referencia de legado:** `docs/CURRENT_STATE.md` (auditoría estática, 17 de octubre de 2026, commit `b1d32f80a48e8bad2cc9b6a790a997afc265cd32`).
>
> **Propósito:** definir comportamientos observables y comprobables del MVP, sin imponer stack, proveedor ni arquitectura. **Este documento no autoriza implementación, migraciones ni cambios de datos.**

## 1. Cómo interpretar este documento

- **RF**: requisito funcional. **RNF**: requisito no funcional. **CA**: criterio de aceptación.
- **Aprobado por DEC**: comportamiento de producto/UX respaldado por una decisión aprobada de `docs/DECISIONS.md`; no implica implementación ni aprobación integral de esta especificación.
- **Confirmado en PRODUCT.md**: regla ya documentada en producto; no convierte los detalles candidatos o pendientes en decisiones aprobadas.
- **Propuesta para validar**: comportamiento concreto sugerido para hacer verificable un requisito; **no debe implementarse como decisión aprobada**.
- **Bloqueado por decisión**: no hay información suficiente para establecer un criterio definitivo.
- Cada requisito contiene criterios observables. Los escenarios son ejemplos, no datos reales ni promesas sobre el backend existente.
- El cumplimiento se evaluará mediante pruebas y revisión, no por la sola existencia de componentes o dependencias.
- **Precedencia:** las DEC aprobadas prevalecen sobre propuestas incompatibles de cualquier especificación. Los IDs OPEN-01–OPEN-08 y TECH-01/02 son los canónicos de `docs/DECISIONS.md`.
- Ante un pendiente, **bloquear solo la implementación de la regla afectada**; esta consolidación no resuelve decisiones técnicas ni autoriza Fase 1. Ver `docs/PHASE_0_REPORT.md` y `docs/SYNC_REPORT.md`.

DEC-033–DEC-041 son complementos aprobados el 19/10/2026 e integrados en RF/CA y RNF, sin reescribir DEC-001–DEC-032. Los informes históricos pueden contener las alternativas previas; para reglas actuales prevalece `docs/DECISIONS.md`. Ninguna OPEN/TECH se cierra por completo.

## 2. Actores y límites de acceso

### RF-001 — Exploración pública de la biblioteca
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

Cualquier visitante puede explorar años, metas, lecturas completadas y detalles publicados sin iniciar sesión.

**CA-001.1:** Dado un visitante sin sesión, cuando abre la biblioteca, puede visualizar los contenidos públicos disponibles.

**CA-001.2:** Dado un visitante sin sesión, cuando selecciona un año o un libro, puede consultar sus datos públicos sin autenticarse.

### RF-002 — Escritura exclusiva de la propietaria
**Estado:** Magic link aprobado por DEC-009; identidad, sesión y permisos pendientes OPEN-01 · **Prioridad:** MVP / seguridad crítica

Solo la **identidad expresamente autorizada**, autenticada mediante **enlace mágico por correo**, puede crear, editar o eliminar libros, lecturas y metas (DEC-009). «Agregar libro» aparece en navegación solo para esa sesión; «Editar» se inicia desde el detalle, sin dashboard administrativo separado (DEC-025/026).

**CA-002.1:** Un visitante no puede realizar mutaciones aunque intente invocar directamente la operación, sin usar la interfaz.

**CA-002.2:** Una sesión autenticada y autorizada como propietaria puede acceder a las operaciones administrativas.

**CA-002.3:** Ocultar botones de edición **no** se considera una medida suficiente de autorización.

**CA-002.4:** (DEC-025/026) Solo la propietaria autenticada ve «Agregar libro» en navegación y «Editar» desde el detalle; visitantes no ven esos controles.

**CA-002.5:** (DEC-009) Una sesión autenticada sin identidad autorizada tampoco puede escribir, aunque invoque directamente operaciones. El contrato de identidad y sesión debe resolverse en OPEN-01 antes de implementar su comprobación.

**Pendiente y bloqueado:** identidad autorizada, flujo concreto/sesión de magic link y políticas efectivas de autorización/RLS (OPEN-01); límites de capa (TECH-01). No documentar correo personal ni secretos.

## 3. Biblioteca y navegación temporal

### RF-003 — Selección de año
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La biblioteca permite elegir un año mediante **selector horizontal**, con año activo identificable (DEC-024), y muestra las lecturas completadas correspondientes y la meta de ese año, si existe.

**CA-003.1:** Al seleccionar un año diferente, se actualizan las lecturas completadas y la meta asociadas a ese año.

**CA-003.2:** Una lectura terminada en un año distinto no aparece en las repisas de finalizados del año seleccionado.

**CA-003.3:** (DEC-006/019) En escritorio, cambiar de año actualiza lecturas y meta y **reorganiza suavemente las ramas** según el volumen mensual. Conserva meses/libros accesibles y claridad del año activo, no una geometría fija; existe equivalencia sin animación.

**CA-003.4:** (DEC-024) El patrón principal de selección es horizontal, no un desplegable, y permite identificar el año activo.

**Pendiente de diseño:** años disponibles, año seleccionado por defecto y presentación del estado sin lecturas.

### RF-004 — Agrupación por finalización y precisión de fecha
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

Las lecturas completadas se agrupan por su fecha de finalización, respetando la precisión realmente conocida. Para finalizar se requiere **al menos año**; mes/día son opcionales sin inventarlos (DEC-033). El inventario y mapeo de registros v1 desconocidos se preserva sin fabricar fechas (OPEN-07/08).

**CA-004.1:** Una lectura iniciada en diciembre de 2025 y finalizada en enero de 2026 aparece en enero de 2026.

**CA-004.2:** Una lectura con finalización conocida solo como «2024» aparece en «Sin mes registrado» del año 2024.

**CA-004.3:** Una lectura con finalización «marzo de 2025» aparece en marzo de 2025 sin inventar un día.

**CA-004.4:** La presentación no afirma una fecha más precisa que la registrada.

**Pendiente:** inicio desconocido, validaciones de consistencia de fechas y tratamiento/mapeo de datos legados desconocidos (OPEN-04/07/08). El año mínimo para finalizar ya está aprobado por DEC-033.

### RF-005 — Lecturas en curso independientes de las repisas mensuales
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

Existe una **rama o repisa especial en la parte superior del árbol** para «Actualmente leyendo», distinguible de los doce meses de finalización (DEC-007). La rama muestra **todas las lecturas activas, independientemente del año seleccionado** (DEC-034).

**CA-005.1:** Una lectura en estado «Leyendo» aparece en «Actualmente leyendo» y no entre los libros terminados de un mes.

**CA-005.2:** Al completar esa lectura, deja de figurar como activa y pasa a la agrupación que corresponda a su fecha de finalización.

**CA-005.3:** (DEC-034) Al consultar o cambiar cualquier año, «Actualmente leyendo» conserva todas las lecturas activas; no aplica filtro anual.

**Pendiente y bloqueado para su diseño concreto:** geometría, casos extremos, navegación accesible y rendimiento de la rama (OPEN-06/TECH-02); el filtro global y la posición superior ya están aprobados.

### RF-006 — Consulta de detalles
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

Se pueden consultar los datos bibliográficos disponibles y los datos de la lectura seleccionada. En escritorio, seleccionar el lomo extrae/gira el libro y abre un **panel lateral**; en móvil abre un **bottom sheet**, sin exigir animación compleja (DEC-020/021). La propietaria inicia edición desde ese detalle (DEC-026).

**CA-006.1:** Al seleccionar una lectura, se muestra su libro y la información de esa lectura sin confundirla con otra lectura del mismo libro.

**CA-006.2:** Los campos opcionales ausentes no se rellenan con información inventada.

**CA-006.3:** (DEC-020/021) El detalle usa panel lateral en escritorio y panel inferior en móvil; cerrar recupera una interfaz navegable y el acceso al libro, también sin animación.

**Privacidad aprobada (DEC-036):** los campos históricos de v1 fuera del MVP quedan en archivo privado, sin exposición pública ni borrado; no se incluyen en detalles públicos.

**Pendiente y bloqueado para la exposición afectada:** inventario/política de campos públicos dentro del MVP (OPEN-01), mapeo y mecanismo/protección del archivo (OPEN-07/08), y diseño concreto/distinción visual entre lecturas (OPEN-05/06). DEC-035 no publica automáticamente todas las notas de abandonadas ni DEC-036 archiva todo v1.

## 4. Registro y mantenimiento bibliográfico

### RF-007 — Búsqueda por título o autor
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La propietaria puede buscar por título o autor en **Open Library y Google Books**, revisar resultados y seleccionar uno (DEC-010). No se presupone un SDK o tecnología de integración.

**CA-007.1:** La búsqueda permite revisar resultados antes de registrar un libro.

**CA-007.2:** Seleccionar un resultado no implica guardar automáticamente sin revisión y confirmación.

**CA-007.3:** Si el servicio falla o no encuentra resultados, la propietaria conserva la opción de alta manual.

**Pendiente y bloqueado:** prioridad/mezcla de ambos catálogos, discrepancias, licencias, cuotas, límites, timeouts y resultados ambiguos (OPEN-02); estructura técnica, metadatos por nivel, coincidencias y deduplicación (OPEN-03). DEC-041 ya fija un libro único por obra y edición opcional por lectura; no vuelve a estar abierta esa regla de producto.

### RF-008 — Alta mediante fotografía
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La propietaria puede cargar o capturar una fotografía de una portada física o pantalla Kindle para identificar el libro con IA, buscar coincidencias y **precargar un formulario editable**, con revisión/corrección y confirmación humana antes de guardar (DEC-011).

**CA-008.1:** El flujo permite elegir una imagen y recibir, cuando sea posible, una propuesta bibliográfica.

**CA-008.2:** (DEC-011) La propietaria revisa/corrige el formulario precargado y confirma explícitamente antes de guardar; un reconocimiento acertado tampoco autoriza persistencia automática.

**CA-008.3:** Un reconocimiento incorrecto o fallido no provoca la creación automática de un libro.

**CA-008.4:** Si falla la extracción o la búsqueda posterior, permanece disponible el registro manual.

**Pendiente:** formatos/tamaños admitidos, retención de imágenes, límites de consumo y proveedor (OPEN-02; RNF-004).

### RF-009 — Registro manual asistido por IA, con vía completamente manual
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La propietaria puede registrar un libro no encontrado en los catálogos mediante **alta manual asistida por IA**, con sugerencias revisables sin presentarlas como hechos verificados (DEC-012). Puede crear el libro completamente a mano si catálogos, reconocimiento o asistencia de IA fallan.

**CA-009.1:** Un libro que no existe en los resultados externos puede registrarse manualmente.

**CA-009.2:** Una caída del catálogo o del servicio de fotografías no bloquea la vía manual.

**CA-009.3:** (DEC-012) Las sugerencias de IA pueden corregirse antes de confirmar; su fallo no impide continuar ni guardar por la vía manual.

**Pendiente y bloqueado:** campos bibliográficos mínimos y validación del alta requieren definición/asignación explícita, relacionada con contratos TECH-01; identidad/deduplicación corresponde a OPEN-03 y procedencia/tratamiento de sugerencias IA a OPEN-02. No inferir campos obligatorios ni ampliar OPEN-04 a reglas bibliográficas nuevas.

### RF-010 — Revisión y corrección de metadatos
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

Antes de guardar datos sugeridos automáticamente, la propietaria puede corregirlos; posteriormente puede corregir la información bibliográfica de un libro registrado.

**CA-010.1:** La propietaria puede revisar y modificar los metadatos recuperados antes de confirmar el alta.

**CA-010.2:** La ausencia de género, sinopsis, portada o serie/orden no se sustituye por datos inventados.

**CA-010.3:** Una corrección bibliográfica no debe alterar automáticamente la valoración ni las fechas de una lectura independiente.

**Metadatos candidatos:** título, autoría, portada, sinopsis, género, serie y orden en serie, cuando existan.

**Pendiente y bloqueado:** estructura técnica de ediciones, identificación/coincidencias y deduplicación (OPEN-03). La agrupación de ediciones bajo un libro por obra y la edición opcional por lectura ya están aprobadas por DEC-041. La obligatoriedad y validación bibliográfica concreta requieren definición/asignación explícita, relacionada con contratos TECH-01.

### RF-011 — Eliminación de libros
**Estado:** Borrado protegido de libros aprobado por DEC-008; recuperación de lecturas aprobada por DEC-040 · **Prioridad:** MVP

La propietaria puede eliminar registros bibliográficos **solo si no tienen lecturas asociadas**. Si existen, bloquear el borrado hasta eliminarlas primero mediante acciones explícitas; no ejecutar cascada implícita (DEC-008).

**CA-011.1:** Un visitante no puede eliminar libros.

**CA-011.2:** (DEC-008) Intentar eliminar un libro con cualquier lectura asociada falla sin eliminar libro ni lecturas; no se admite cascada implícita ni excepción por confirmación.

**Pendiente y bloqueado:** confirmaciones, política física o equivalente de recuperación, consultas/conteos, restauración y conflictos (OPEN-03). La recuperación de lecturas ya está aprobada; un libro con lecturas asociadas sigue protegido por DEC-008, sin cascada implícita.

## 5. Lecturas y relecturas

### RF-012 — Iniciar una lectura
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La propietaria puede iniciar una lectura de un libro existente o registrar libro y lectura en un mismo flujo, registrando **libro, fecha de inicio y formato** (DEC-015). Los estados del MVP son **Leyendo, Terminado y Abandonado**; no incorporar «Pausado» sin nueva aprobación (DEC-014).

**CA-012.1:** Una lectura iniciada se registra como «Leyendo».

**CA-012.2:** El alta de una lectura no exige crear un nuevo registro bibliográfico si el libro ya existe.

**CA-012.3:** (DEC-001) Cuando se detecta un libro existente, ofrecer nueva lectura/relectura o corrección de metadatos, sin duplicar automáticamente el registro bibliográfico ni sobrescribir lecturas.

**Pendiente y bloqueado:** obligatoriedad/precisión o desconocimiento de fecha de inicio, valor vacío/default del formato y transiciones, incluido abandono (OPEN-04); detección de duplicados (OPEN-03). No convertir el resumen de datos iniciales en una validación de obligatoriedad aún no aprobada.

### RF-013 — Finalizar una lectura
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La propietaria puede marcar una lectura como «Terminado» mediante un **formulario minimalista de fecha de finalización, calificación opcional y opinión opcional** (DEC-003/004). No exigir recomendación, intención de releer ni nivel de enganche. Admitir fecha completa, mes/año o año sin inventar partes (DEC-005). **Finalizar requiere al menos el año de finalización; mes y día son opcionales**, sin inventarlos (DEC-033).

**CA-013.1:** Se puede completar una lectura sin asignar estrellas ni escribir una opinión.

**CA-013.2:** Si se asigna una calificación, pertenece al rango de 0.5 a 5 en incrementos de 0.5.

**CA-013.3:** Una lectura completada se contabiliza en el año de finalización, no en el año de inicio.

**CA-013.4:** No se inventan día o mes cuando la propietaria solo conoce una fecha parcial.

**CA-013.5:** (DEC-003) Se rechazan 0, 5.5 e incrementos distintos de 0.5. Ausencia de calificación es distinta de cero y la evaluación pertenece a esa lectura.

**CA-013.6:** (DEC-033) Una nueva finalización sin año no se puede completar. Solo año es válido; mes/día pueden quedar desconocidos sin reemplazarlos por componentes ficticios. La conservación/migración de datos v1 desconocidos no se resuelve rechazando o borrando registros históricos.

**Pendiente y bloqueado:** transiciones adicionales/reversión y validaciones de coherencia de fechas, sin reabrir el año mínimo aprobado (OPEN-04); mapeo seguro de datos v1 desconocidos (OPEN-07/08).

### RF-014 — Formato de lectura
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

Cada lectura usa **un formato** de la lista fija **Físico, Kindle, iPad, Audiolibro, Otro**, editable posteriormente (DEC-002/016). No ofrecer formatos personalizados ni múltiples simultáneos. El formato pertenece a cada lectura, no al libro (DEC-038); un mismo libro puede tener distintas lecturas en formatos diferentes. Mantener un historial de formatos previos no es una capacidad aprobada del MVP.

**CA-014.1:** (DEC-038) Dos lecturas del mismo libro pueden tener formatos distintos; el formato de una no pertenece ni modifica el del libro o el de otra lectura.

**CA-014.2:** Cambiar el formato de una lectura no modifica el de otra.

**Aprobado:** lista fija Físico, Kindle, iPad, Audiolibro y Otro; formato editable. **Pendiente:** valor vacío y comportamiento de «Otro» (OPEN-04).

### RF-015 — Edición y eliminación de lecturas
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La propietaria puede editar datos de una lectura y eliminar registros de lectura. Conservar las abandonadas en una sección **«Abandonados» con fechas y notas**; la propietaria puede **retomarlas como la misma lectura lógica**, preservando el historial de abandono y reanudación sin sobrescribirlo ni perderlo (DEC-035/039). No cuentan como completadas (DEC-014). La estructura física y los campos para persistir ese historial siguen pendientes; la decisión no exige una fila ni una tabla de eventos.

**CA-015.1:** Una modificación de una lectura no cambia fechas, opinión ni calificación de otra lectura del mismo libro.

**CA-015.2:** Una lectura eliminada debe poder recuperarse (DEC-040). Su inclusión en consultas/conteos, el efecto de restaurar y los conflictos de recuperación quedan pendientes; no asumir que eliminarla equivale a desvincularla del libro ni fija sus conteos.

**CA-015.3:** Un visitante no puede editar ni eliminar lecturas.

**CA-015.4:** (DEC-035) Las lecturas abandonadas se conservan y pueden consultarse en **«Abandonados»** con sus fechas y notas, sin presentarlas como completadas. Su filtro temporal concreto no se define mediante este criterio. Esta sección no autoriza publicar todas las notas o campos históricos.

**CA-015.5:** (DEC-035/039) La propietaria puede retomar una abandonada como la misma lectura lógica y el historial de abandono/reanudación debe conservarse sin sobrescribirlo ni perderlo. La aceptación de su estructura física, orden/fechas y reglas adicionales queda pendiente; no crear una nueva lectura lógica para la retomada.

**Pendiente y bloqueado:** estrategia física recuperable, consultas/conteos, restauración, conflictos y compatibilidad con DEC-008 (OPEN-03); estructura física/orden/fechas del historial, reglas adicionales de modificación y evaluación al abandonar (OPEN-04). La recuperabilidad y la misma identidad lógica al retomar están aprobadas; no asumir borrado irreversible ni inventar una matriz general de transiciones.

### RF-016 — Relecturas independientes
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

El mismo libro puede vincularse a varias lecturas con datos e historial independientes.

**CA-016.1:** Un libro leído en 2025 y nuevamente en 2027 conserva dos lecturas distintas.

**CA-016.2:** La nueva lectura no sobrescribe fechas, formato, calificación ni opinión de la anterior.

**CA-016.3:** Dos lecturas del mismo libro completadas en un mismo año cuentan como dos lecturas para la meta de ese año.

**CA-016.4:** (DEC-041) Las ediciones de una misma obra se agrupan bajo un único libro; cada lectura puede registrar opcionalmente la edición utilizada. No se exige ISBN ni una estructura física concreta.

### RF-017 — Registro de lecturas históricas
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La propietaria puede incorporar lecturas completadas en años anteriores, conservando únicamente la precisión de fecha que conozca (DEC-005). La transición desde v1 debe preservar **todos** sus registros, incluidas notas/evaluaciones y campos ajenos al nuevo MVP, sin inventar fechas o relecturas (DEC-013; RNF-002). Los **campos históricos fuera del MVP** se conservan en **archivo privado, sin exposición pública ni borrado** (DEC-036), no todos los registros v1 por inferencia. No convertir pendientes en lecturas terminadas ni fabricar años desconocidos para satisfacer DEC-033.

**CA-017.1:** Se puede registrar una lectura finalizada en un año anterior al actual.

**CA-017.2:** Una lectura histórica se muestra en el año/mes que corresponda a su finalización y afecta el conteo anual de ese año.

**CA-017.3:** Si solo se conoce el año, aparece en «Sin mes registrado».

**CA-017.4:** (DEC-036) Los campos históricos v1 fuera del MVP no se borran ni aparecen en respuestas/vistas públicas: se conservan en archivo privado. La verificación técnica queda sujeta al inventario, mapeo y mecanismo de archivo/protección que se aprueben; no se elige formato, almacenamiento o ubicación.

## 6. Metas anuales

### RF-018 — Crear, editar y eliminar metas por año
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La propietaria puede administrar metas para cualquier año, sin alterar las lecturas. Si no existe meta anual para el año consultado, mostrar exactamente **«Sin meta establecida»**; la propietaria puede crearla (DEC-037). No mostrar objetivo ficticio ni confundir ausencia con error de consulta.

**CA-018.1:** Se puede crear una meta para un año anterior o posterior al actual.

**CA-018.2:** Editar una meta cambia el objetivo, pero no modifica ni elimina lecturas.

**CA-018.3:** Eliminar una meta no elimina las lecturas de ese año.

**CA-018.4:** Los visitantes pueden ver las metas públicas, pero no modificarlas.

**CA-018.5:** (DEC-037) Sin meta anual se muestra exactamente **«Sin meta establecida»** y la propietaria puede crear una para ese año; visitantes no pueden crearla (RF-002).

**Pendiente y bloqueado para esas reglas:** unicidad por año y límites del objetivo. El texto sin meta y creación por propietaria ya están aprobados; su diseño concreto no fija las invariantes restantes. Son asuntos adicionales de modelo/calidad relacionados con TECH-01/02 cuyo registro/asignación requiere aprobación; no amplían OPEN-04. Las restricciones propuestas en `DATA_MODEL.md` no son decisiones aprobadas ni constraints comprobados.

### RF-019 — Cálculo del progreso anual
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

El progreso anual se calcula contando las lecturas completadas cuyo año de finalización coincide con el año de la meta. Mostrar **indicador circular y conteo explícito**, por ejemplo «12 de 20 libros» (DEC-030); no depender solo de color o porcentaje. **Abandonadas no cuentan** (DEC-014).

**CA-019.1:** Una lectura iniciada en diciembre de 2025 y terminada en enero de 2026 suma a 2026 y no a 2025.

**CA-019.2:** Dos finalizaciones distintas del mismo libro en 2026 suman dos.

**CA-019.3:** Una lectura en curso no suma a la meta.

**CA-019.4:** Si el total supera el objetivo, el conteo real sigue mostrándose correctamente; no se trunca el número de lecturas completadas.

**CA-019.5:** (DEC-014/030) Una lectura abandonada no incrementa completados; el progreso combina indicador circular y cantidad de lecturas terminadas frente a la meta.

**Estado sin meta aprobado:** aplicar RF-018/DEC-037, con texto exacto «Sin meta establecida», sin progreso sobre un objetivo inventado.

**Pendiente y bloqueado para ese comportamiento:** representación del indicador circular al superar objetivo; decisiones adicionales de modelo/calidad relacionadas con TECH-01/02, sin aprobación implícita de límites.

## 7. Interfaz e interacciones visuales

> Estos requisitos integran las decisiones de producto/UX aprobadas de `docs/DECISIONS.md`; no aprueban todos los detalles de `PRODUCT.md`. Los detalles de layout, accesibilidad, tiempos, gestos y fallback pertenecen a `DESIGN.md` e `INTERACTIONS.md`.

### RF-020 — Hero y revelación de librería en escritorio
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

El hero **a pantalla completa** muestra «Book Diary» enmarcado por sakura; las ramas se abren progresivamente con el scroll, revelando la fachada detrás y revirtiendo al regresar (DEC-017). La fachada dice exactamente **«Book Diary»**, no «Book Diary by Montse» ni «Montse's Bookshop» (DEC-032). Antes de mostrar la biblioteca hay **aproximación visual a la puerta**, como entrada a la librería (DEC-018), sin exigir una tecnología 2D/3D concreta.

**CA-020.1:** (DEC-017) La primera escena ocupa la pantalla completa y muestra el título y las ramas.

**CA-020.2:** El scroll revela la fachada mediante el movimiento de las ramas, no como una sección inconexa.

**CA-020.3:** Al invertir el desplazamiento, la transición puede revertirse.

**CA-020.4:** (DEC-018/032) Después de revelar la fachada con letrero exacto «Book Diary», hay acercamiento visual a la puerta antes de mostrar la biblioteca.

**CA-020.5:** (DEC-029) Con `prefers-reduced-motion`, se puede acceder a la biblioteca mediante una experiencia equivalente sin recorrido cinematográfico obligatorio.

**Pendiente y bloqueado para sus parámetros:** técnica de entrada, tamaños, distancias, tiempos y fallback concreto (OPEN-05/06; TECH-02). La equivalencia funcional con movimiento reducido ya está aprobada.

### RF-021 — Árbol y libros de lomo en escritorio
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

La biblioteca de escritorio presenta un **árbol dinámico** cuya estructura y distribución se adaptan al volumen por mes, conservando los doce meses y todos los libros accesibles, sin solapamientos ni capacidad arbitraria (DEC-006). Los libros aparecen por el lomo; al seleccionarlos salen/giran hacia portada y abren **panel lateral** (DEC-020). Los meses vacíos conservan repisa identificable y pequeño adorno (DEC-031); la rama superior contiene «Actualmente leyendo» (DEC-007), con todas las activas sin filtro anual (DEC-034; RF-005).

**CA-021.1:** El estado inicial de cada libro en repisa muestra el lomo, no su portada frontal.

**CA-021.2:** Seleccionar un libro revela su portada y permite consultar el detalle.

**CA-021.3:** Cerrar el detalle devuelve el libro a su estado en repisa.

**CA-021.4:** (DEC-006/019) Cambiar de año reorganiza suavemente ramas/repisas según volumen mensual, sin exigir geometría fija y sin perder acceso a meses o libros; movimiento reducido mantiene funciones equivalentes.

**CA-021.5:** (DEC-031) Los doce meses permanecen identificables; cada mes vacío presenta repisa y pequeño adorno, sin libros ficticios.

**Pendiente:** distribución de doce meses, repisas extra, representación de lomos cuando solo existe portada y fallback sin efectos (OPEN-06).

### RF-022 — Librero simplificado en móvil
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

En móvil se presenta un librero vertical con repisas por mes y desplazamiento horizontal cuando haya varios libros, manteniendo acceso al detalle mediante **bottom sheet**, sin exigir las animaciones complejas de escritorio (DEC-021).

**CA-022.1:** Se pueden explorar meses y libros en pantalla pequeña.

**CA-022.2:** Las repisas con varios libros permiten acceder a los que quedan fuera del ancho visible.

**CA-022.3:** La selección de un libro permite consultar sus detalles sin depender de WebGL ni de un gesto de precisión.

**Pendiente:** umbrales responsive y controles de desplazamiento accesibles.

## 8. Requisitos no funcionales

### RNF-001 — Autorización efectiva
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** Crítica

Las operaciones de escritura deben verificar autorización en la capa que las ejecuta; el ocultamiento de controles no basta. Deben comprobarse permisos efectivos del backend antes de publicar.

**CA:** Pruebas autorizadas demuestran que un visitante no puede crear, modificar ni eliminar libros, lecturas o metas mediante peticiones directas.

### RNF-002 — Integridad y migración segura
**Estado:** Confirmado en PRODUCT.md y auditoría · **Prioridad:** Crítica

No se permite migrar datos sin inventario del esquema real, permisos, respaldo, mapeo y plan de reversión; deben conservarse **todos los registros v1**, fechas conocidas, notas, calificaciones, historial disponible y campos legados fuera del nuevo MVP (DEC-013). **DEC-036 fija archivo privado, sin exposición pública ni borrado, para campos históricos fuera del MVP**, no para todo v1. Inventario, mapeo, almacenamiento, formato, ubicación, protección y verificación siguen pendientes (OPEN-07/08); campos del MVP no quedan automáticamente autorizados para publicación (OPEN-01).

**CA:** Existe una verificación documentada de conteos y datos antes/después de una migración de prueba, y un procedimiento de restauración probado o validado antes de tocar datos reales.

**Nota:** V1 no modela relecturas independientes; no deben inventarse relecturas históricas a partir de `would_reread`.

### RNF-003 — Accesibilidad y movimiento reducido
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

Las funciones centrales son utilizables con teclado, controles etiquetados, contraste suficiente y alternativa a animaciones intensas; respetar automáticamente **`prefers-reduced-motion`**, simplificando o eliminando movimiento decorativo sin perder funciones ni requerir interruptor manual (DEC-029). Las animaciones mágicas/interactivas —pétalos ocasionales, ramas sutiles y respuesta de libros al cursor— no obstaculizan lectura ni interacción (DEC-023).

**CA:** Se pueden seleccionar años, abrir/cerrar detalles y gestionar registros sin depender exclusivamente de animaciones o puntero; con movimiento reducido se ofrece una interacción funcional equivalente.

**Pendiente:** métricas y checklist de conformidad exactos en diseño y pruebas.

### RNF-004 — Resiliencia y protección de integraciones
**Estado:** Confirmado en PRODUCT.md; límites cuantitativos pendientes · **Prioridad:** MVP / seguridad crítica

Errores de proveedores no bloquean el registro manual. Las rutas que consumen servicios de pago o procesan archivos tienen validaciones, controles de consumo y errores seguros.

**CA:** Ante errores simulados de búsqueda o reconocimiento, se presenta una salida manual; archivos inválidos se rechazan de forma controlada; respuestas de error no exponen secretos.

**Pendiente:** tamaños, formatos, cuotas, tiempos máximos, retención de imágenes y política de logs (OPEN-02).

### RNF-005 — Compatibilidad responsive
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** MVP

Las operaciones esenciales de consulta y administración deben estar disponibles en escritorio y móvil, aunque cambie la presentación. La **UI funcional es minimalista**, con ilustración principalmente en hero y acentos pequeños (DEC-022), **solo tema claro** (DEC-027) y textos en **español**, manteniendo «Book Diary» como nombre propio (DEC-028).

**CA:** Las tareas de seleccionar año, ver detalles, registrar libros, gestionar lecturas y metas pueden completarse en ambos contextos; navegación, formularios y paneles conservan UI minimalista, tema claro y español, sin exigir selector de tema.

### RNF-006 — Especificaciones portables y verificables
**Estado:** Confirmado en PRODUCT.md · **Prioridad:** Transversal

Los documentos deben ser Markdown estándar, legibles sin el historial del chat, con decisiones explícitas y sin depender de un agente o proveedor específico.

**CA:** Un agente nuevo puede identificar alcance, reglas, criterios, dependencias y decisiones abiertas a partir de los documentos versionados.

## 9. Exclusiones explícitas del MVP

No implementar por inercia del legado ni como supuesto: lista «Por leer»; red social y cuentas públicas; comentarios de visitantes; recomendaciones por IA; estadísticas avanzadas; seguimiento de páginas, porcentajes o tiempo; sincronización automática con Kindle u otras plataformas. Cualquier incorporación requiere una decisión documentada y aprobación.

## 10. Matriz de trazabilidad

| Regla de producto | Requisitos vinculados |
| --- | --- |
| BR-01 — Escritura exclusiva | RF-001, RF-002, RNF-001 |
| BR-02 — Libro distinto de lectura | RF-010, RF-012, RF-015, RF-016 |
| BR-03 — Año de finalización | RF-003, RF-004, RF-013, RF-017, RF-019 |
| BR-04 — Fechas parciales | RF-004, RF-013, RF-017 |
| BR-05 — Relecturas cuentan | RF-016, RF-019 |
| BR-06 — Evaluación opcional | RF-013 |
| BR-07 — Revisión de metadatos | RF-007, RF-008, RF-010 |
| BR-08 — Alta manual | RF-007, RF-008, RF-009, RNF-004 |
| BR-09 — Metas independientes | RF-018, RF-019 |
| BR-10 — Lecturas activas separadas | RF-005, RF-012, RF-013 |

### Decisiones aprobadas integradas en los requisitos

Esta tabla localiza el contenido normativo distribuido arriba; no lo reemplaza ni resuelve sus pendientes.

| Decisión | Requisitos que incorporan la regla |
| --- | --- |
| DEC-001 | RF-012, RF-016 |
| DEC-002 | RF-014 |
| DEC-003 | RF-013 |
| DEC-004 | RF-013 |
| DEC-005 | RF-004, RF-013, RF-017 |
| DEC-006 | RF-003, RF-021 |
| DEC-007 | RF-005, RF-021 |
| DEC-008 | RF-011 |
| DEC-009 | RF-002, RNF-001 |
| DEC-010 | RF-007 |
| DEC-011 | RF-008, RF-010 |
| DEC-012 | RF-009 |
| DEC-013 | RF-017, RNF-002 |
| DEC-014 | RF-012, RF-019 |
| DEC-015 | RF-012 |
| DEC-016 | RF-014 |
| DEC-017 | RF-020 |
| DEC-018 | RF-020 |
| DEC-019 | RF-003, RF-021 |
| DEC-020 | RF-006, RF-021 |
| DEC-021 | RF-006, RF-022 |
| DEC-022 | RNF-005 |
| DEC-023 | RNF-003 |
| DEC-024 | RF-003 |
| DEC-025 | RF-002 |
| DEC-026 | RF-002, RF-006 |
| DEC-027 | RNF-005 |
| DEC-028 | RNF-005 |
| DEC-029 | RF-020, RNF-003 |
| DEC-030 | RF-019 |
| DEC-031 | RF-021 |
| DEC-032 | RF-020 |
| DEC-033 | RF-004, RF-013, RF-017 |
| DEC-034 | RF-005, RF-021 |
| DEC-035 | RF-015, RF-019 |
| DEC-036 | RF-006, RF-017, RNF-002 |
| DEC-037 | RF-018, RF-019 |
| DEC-038 | RF-014, RF-016 |
| DEC-039 | RF-015, RF-019 |
| DEC-040 | RF-015, RF-011 |
| DEC-041 | RF-009, RF-012, RF-016 |

## 11. Decisiones pendientes y bloqueos

| Referencia | Pregunta que debe resolverse antes de implementar el área | Afecta |
| --- | --- | --- |
| OPEN-01 | ¿Qué identidad se autoriza, cómo funciona la sesión de magic link y qué permisos/RLS y campos públicos se validan? | RF-002, RF-006, RNF-001 |
| OPEN-02 | ¿Qué prioridad/mezcla, licencias, cuotas, fallos y límites rigen los dos catálogos y qué proveedor/modelo IA y privacidad se aceptan? | RF-007–RF-010, RNF-004 |
| OPEN-03 | Parcialmente resuelto: libro único por obra, edición opcional por lectura y recuperabilidad de lecturas aprobados DEC-040/041. ¿Qué estructura/identificación/deduplicación, mecanismo de recuperación, consultas/conteos, restauración, conflictos y confirmaciones se aceptan respetando DEC-008? | RF-009–RF-012, RF-015 |
| OPEN-04 | Parcialmente resuelto: año mínimo DEC-033; «Abandonados» DEC-035; misma lectura lógica e historial conservado DEC-039; formato por lectura DEC-038. ¿Qué inicio/precisión, consistencia, transiciones adicionales, estructura/orden/fechas del historial, evaluación al abandonar y valor «Otro» se aceptan? | RF-004, RF-012–RF-015, RF-019 |
| OPEN-05 | ¿Cuál es el sistema visual final y los textos de interfaz? | RF-020–RF-022 |
| OPEN-06 | Parcialmente resuelto: todas las activas sin filtro anual DEC-034. ¿Qué algoritmo distribuye meses/libros y rama superior, y qué límites/fallback accesible se verifican? | RF-003, RF-005, RF-021, RF-022 |
| OPEN-07 | ¿Cuál es el esquema real y el plan seguro de migración? | RNF-002 |
| OPEN-08 | Parcialmente resuelto: campos históricos fuera del MVP en archivo privado sin exposición pública ni borrado DEC-036. ¿Qué inventario/mapeo, almacenamiento, formato, ubicación, controles y verificaciones se aprueban, y cuál es el destino de registros aún no determinado? | RF-004, RF-006, RF-017, RNF-002 |
| TECH-01 | ¿Qué límites servidor/cliente, operaciones de dominio y arquitectura de autenticación se aprueban? | RF-002, RF-009–RF-019, RNF-001 |
| TECH-02 | ¿Qué runtime, pruebas, calidad, rendimiento, responsive y despliegue se aprueban? | Verificación transversal, RNF-003–RNF-005 |

**Asunto adicional pendiente de registro/asignación:** reglas de metas (unicidad, límites y representación del exceso; el estado sin meta está aprobado por DEC-037), relacionadas con TECH-01/02 y RF-018/019. No se consideran resueltas ni se incorporan silenciosamente al alcance canónico de OPEN-04. Cada tarea dependiente permanece bloqueada hasta aprobar su regla.

**Propuestas para revisión, no decisiones aprobadas:** (a) ofrecer confirmación antes de eliminaciones destructivas; (b) concretar el estado vacío de un año sin lecturas; sin meta ya corresponde el texto aprobado por DEC-037; (c) tratar las fechas como fechas de calendario y no convertirlas silenciosamente entre zonas horarias. Estas propuestas deben pasar a `DECISIONS.md` cuando se aprueben.

## 12. Condiciones de entrada a implementación

1. `PRODUCT.md` y este documento revisados y aprobados por la propietaria.
2. Decisiones bloqueantes de la funcionalidad que se implementará resueltas y registradas.
3. `DESIGN.md` e `INTERACTIONS.md` aprobados para cualquier tarea de UI afectada.
4. `DATA_MODEL.md` y `ARCHITECTURE.md` aprobados antes de cambios estructurales.
5. Esquema real, RLS/permisos, respaldo, estrategia de migración y restauración verificados antes de tocar datos existentes.
6. Plan de pruebas de aceptación derivado de los criterios anteriores; no confundir auditoría estática con ejecución validada.

## 13. Precedencia y control de cambios

- `PRODUCT.md` define visión, alcance y reglas aprobables; este documento detalla comportamientos y pruebas.
- `CURRENT_STATE.md` describe únicamente lo observado en v1; no sustituye requisitos de v2.
- `DESIGN.md` e `INTERACTIONS.md` concretarán UI sin alterar reglas de negocio.
- `DATA_MODEL.md` y `ARCHITECTURE.md` concretarán implementación sin modificar silenciosamente requisitos.
- `docs/DECISIONS.md` es la fuente canónica de acuerdos aprobados y pendientes; prevalece sobre propuestas incompatibles y registra cambios con fecha, motivo e impacto.
- Ante contradicción, **detener la implementación afectada y solicitar aclaración**; no elegir por cuenta propia el comportamiento legado.

**Criterio de aprobación:** la propietaria confirma que los requisitos, exclusiones y criterios de aceptación reflejan lo que desea construir. Hasta entonces, **consolidado editorialmente con detalles pendientes**, no aprobado integralmente; Fase 0 no se declara cerrada y Fase 1 no está autorizada.
