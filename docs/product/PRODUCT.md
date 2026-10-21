# Book Diary v2 — Definición del producto

> **Estado:** Consolidado editorialmente; decisiones de producto aprobadas y detalles pendientes. No constituye aprobación integral de la especificación ni cierre de Fase 0. · **Fecha:** 19 de octubre de 2026 · **Idioma del documento:** español
>
> **Propósito:** definir qué producto se construirá y sus límites, independientemente del framework, proveedor o agente de IA. Este documento **no autoriza implementación ni migraciones**.

**Fuentes y precedencia:** las decisiones aprobadas de `docs/DECISIONS.md` prevalecen sobre las propuestas de esta especificación. Esta edición integra las **41 decisiones DEC-001–DEC-041**; DEC-033–041 cierran subreglas aprobadas el 19/10/2026, sin cerrar por completo OPEN-01–OPEN-08 ni TECH-01/02. Ver `docs/PHASE_0_REPORT.md` y `docs/SYNC_REPORT.md` para antecedentes y límites.

## 1. Visión

Book Diary v2 es un diario personal de lectura que permite compartir públicamente una biblioteca visual y registrar las experiencias de lectura de su propietaria. La experiencia de exploración combina una librería ilustrada, un árbol con repisas por mes y una interfaz funcional sencilla.

La aplicación prioriza **libros que se están leyendo o que ya se terminaron**. No pretende ser una red social, una plataforma de recomendaciones ni un gestor de libros pendientes.

## 2. Usuarios y permisos

| Actor | Puede | No puede |
| --- | --- | --- |
| Visitante | Explorar años, metas y libros publicados; consultar detalles y opiniones. | Crear, modificar o eliminar libros, lecturas o metas. |
| Propietaria autenticada | Todo lo anterior; registrar y corregir libros; iniciar, completar, editar y eliminar lecturas; administrar metas anuales. | — |

**Aprobado (DEC-009/025/026):** biblioteca pública de consulta y escritura exclusiva de la identidad autorizada, autenticada por **enlace mágico por correo**. «Agregar libro» aparece en la navegación solo para la propietaria autenticada; «Editar» se ofrece desde el panel de detalle. No se requiere un dashboard administrativo independiente. Ocultar controles no reemplaza autorización efectiva.

**Pendiente y bloqueado para implementar:** identidad autorizada, sesión, permisos/RLS y política de publicación de campos dentro del MVP (OPEN-01). Los campos históricos v1 fuera del MVP se conservan en **archivo privado, sin exposición pública ni borrado** (DEC-036); almacenamiento, formato, ubicación, protección, inventario y mapeo siguen pendientes (OPEN-07/08). No asumir publicación de todas las notas ni archivar todo v1.

## 3. Conceptos del dominio

- **Libro (Book):** identidad bibliográfica reutilizable de una obra: sus ediciones se agrupan bajo **un único libro** (DEC-041), con título, autoría, portada y metadatos disponibles. Admite múltiples experiencias de lectura, incluso en distintos formatos (DEC-038).
- **Lectura (Reading):** experiencia individual de leer un libro. El **formato pertenece a cada lectura, no al libro** (DEC-038); incluye estado, fechas, calificación y opinión, según corresponda. **Puede** registrar la edición utilizada, de forma **opcional** (DEC-041), sin exigir ISBN ni una estructura técnica específica.
- **Relectura:** una nueva lectura del mismo libro, con historial y evaluación independientes. Cuenta como una lectura completada para la meta del año de finalización. **Retomar una abandonada es la misma lectura**, no una relectura lógica: conserva historial de abandono/reanudación sin sobrescribirlo ni perderlo (DEC-039).
- **Meta anual (Reading Goal):** número objetivo de lecturas terminadas en un año calendario; se administra sin alterar las lecturas.

**Regla central:** un libro no equivale a una lectura. Libro único por obra y edición opcional por lectura ya están aprobados (DEC-041). Normalización, estructura técnica de ediciones, identificadores y detección de coincidencias siguen pendientes en `docs/architecture/DATA_MODEL.md` (OPEN-03), sin reabrir esa identidad.

## 4. Alcance funcional del MVP

### 4.1 Explorar la biblioteca

- Mostrar un selector **horizontal** de años con año activo identificable y su meta anual, si existe (DEC-024).
- Mostrar las lecturas completadas del año seleccionado agrupadas por **mes de finalización**, no por mes de inicio. Conservar los doce meses identificables, incluidos los vacíos con repisa y pequeño elemento decorativo (DEC-031), sin inventar libros.
- Mantener **Actualmente leyendo** en una **rama superior del árbol**, distinguible de los meses de finalización (DEC-007). Mostrar **todas las lecturas activas independientemente del año seleccionado** (DEC-034); cambiar de año no las filtra. Geometría, navegación y rendimiento siguen pendientes (OPEN-06).
- Cuando se conozca el año de finalización pero no el mes, ubicar la lectura en **Sin mes registrado**.
- Permitir consultar los detalles bibliográficos y de lectura de cada elemento.
- Permitir cambiar de año reorganizando suavemente las ramas del árbol dinámico; se actualizan los libros y la meta.

### 4.2 Registrar libros

La propietaria puede registrar un libro por tres vías:

1. **Búsqueda bibliográfica:** introducir título o autor, consultar **Open Library y Google Books**, elegir el resultado correcto y revisar sus datos (DEC-010). La prioridad entre fuentes, mezcla, cuotas, licencias y fallos siguen pendientes (OPEN-02).
2. **Fotografía:** tomar o subir una imagen de la portada física o de una pantalla Kindle; identificar el libro con IA, buscar coincidencias y precargar un **formulario editable**; la propietaria revisa/corrige y **confirma antes de guardar** (DEC-011).
3. **Alta manual asistida por IA:** ingresar un libro aunque no exista en los catálogos; revisar sugerencias sin presentarlas como hechos comprobados. La vía completamente manual permanece disponible si la IA o los catálogos fallan (DEC-012).

Los datos que se intentará recuperar, cuando estén disponibles, incluyen título, autor, portada, sinopsis, género y serie/orden. **Ningún dato opcional se debe inventar**; la propietaria podrá corregir la información recuperada.

Si se detecta un libro existente, ofrecer **crear una nueva lectura/relectura o corregir metadatos**, sin duplicar automáticamente el registro bibliográfico ni sobrescribir lecturas previas (DEC-001). Ediciones de una obra se mantienen bajo un único libro y cada lectura puede registrar la edición utilizada (DEC-041). Estructura técnica y detección de coincidencias siguen pendientes (OPEN-03), sin duplicar el libro por formato o edición.

### 4.3 Gestionar lecturas

- Iniciar una lectura de un libro registrado o registrar libro y lectura en un mismo flujo, registrando **libro, fecha de inicio y formato** (DEC-015). La obligatoriedad/precisión del inicio permanece pendiente (OPEN-04).
- Mantener estados funcionales **Leyendo**, **Terminado** y **Abandonado** para el MVP (DEC-014). Las abandonadas no cuentan para metas; conservarlas en sección **«Abandonados» con fechas y notas**, y permitir que la propietaria las **retome** (DEC-035). No añadir «Pausado» sin nueva aprobación. **Retomar conserva la misma identidad lógica de lectura y el historial de abandono/reanudación sin sobrescritura ni pérdida** (DEC-039). Persistencia/estructura del historial, reglas de fechas, transiciones adicionales y evaluación al abandonar siguen pendientes (OPEN-04/TECH-01); no elegir fila o eventos físicos ni publicar todas las notas.
- Registrar **un formato por lectura** de la lista fija **Físico, Kindle, iPad, Audiolibro, Otro**; permitir editarlo (DEC-002/016). No ofrecer formatos personalizados, múltiples simultáneos ni asumir historial de formatos. Un libro puede tener varias lecturas en distintos formatos, pero el formato no pertenece al libro (DEC-038). «Otro» y valor vacío siguen pendientes (OPEN-04).
- Finalizar mediante formulario minimalista: **fecha de finalización**, calificación **opcional de 0.5 a 5 en incrementos de 0.5** y opinión **opcional** por lectura (DEC-003/004). Ausencia de calificación no significa cero. No exigir recomendación, intención de releer ni enganche.
- Editar información de la lectura y eliminarla mediante controles exclusivos de la propietaria, **con recuperación garantizada** (DEC-040). Borrado lógico o equivalente son estrategias a evaluar, no una elección realizada. No se exige ni implementa papelera, plazos, purga o campos SQL por esta decisión.
- Cada lectura puede registrar opcionalmente la edición utilizada bajo el libro único de la obra (DEC-041), sin exigirla para iniciar, finalizar o retomar.
- Crear una nueva lectura de un libro ya leído sin sobrescribir experiencias anteriores.
- Registrar lecturas históricas.

**Fechas de finalización admitidas:** día/mes/año; mes/año; o solo año. No se debe fabricar un día o mes desconocido. El año usado para agrupación y metas es el de **finalización** (DEC-005). **Finalizar requiere al menos el año**; mes/día son opcionales y no se inventan (DEC-033). No fabricar años ni borrar registros v1 con fechas desconocidas: su preservación y mapeo siguen sujetos a OPEN-07/08.

**Por especificar:** inicio desconocido, confirmaciones, implementación de eliminación recuperable/restauración, transiciones adicionales, historial físico y reglas precisas de fechas. **Bloquear el borrado de un libro mientras tenga lecturas asociadas**, sin cascada implícita (DEC-008). Eliminar una lectura de forma recuperable **no equivale automáticamente a desvincularla** ni habilita eliminar el libro; deben aprobarse antes las implicaciones en asociaciones, consultas, conteos, restauración y conflictos (DEC-040; OPEN-03/TECH-01). La confirmación no habilita excepciones.

### 4.4 Metas anuales

- Crear, editar y eliminar una meta para cualquier año.
- Calcular avance con el número de **lecturas completadas** cuyo año de finalización coincide con el año de la meta.
- Contar las relecturas completadas como eventos independientes.
- Mostrar **indicador circular y conteo explícito**, por ejemplo «12 de 20 libros» (DEC-030), sin depender solo de color o porcentaje. Permitir que el total supere el objetivo sin truncar el conteo real; el tratamiento visual del exceso sigue pendiente.
- No modificar ni eliminar lecturas cuando se cambie o elimine una meta.
- Si no hay meta para el año consultado, mostrar exactamente **«Sin meta establecida»**; la propietaria puede crearla (DEC-037). No confundir ausencia con error de consulta ni mostrar un objetivo ficticio.

**Pendiente y bloqueado para implementar sus reglas:** unicidad, límites del objetivo, representación de objetivos superados y efecto de lecturas eliminadas recuperables/restauradas en consultas y conteos (DEC-040). No decidir si se excluyen o reincorporan por inferencia. El texto sin meta y la posibilidad de crearla ya están aprobados por DEC-037; su diseño concreto no determina las invariantes restantes. Son asuntos adicionales de modelo/calidad relacionados con TECH-01/02; su registro y asignación requieren aprobación. No ampliar OPEN-04 ni convertir candidatos del modelo en decisiones aprobadas.

## 5. Experiencia visual: decisiones aprobadas y detalles pendientes

**Dirección conceptual candidata heredada, no paleta aprobada:** estética storybook acogedora con acabado ilustrado y tonos crema, rosa suave, madera, salvia y azul empolvado. Estos estilos/tonos son referencias para evaluar, no decisiones finales de OPEN-05.

**Decisiones aprobadas:** interfaz funcional **minimalista**, ilustraciones concentradas en hero y pequeños acentos, **solo tema claro y textos en español** (DEC-022/027/028). «Book Diary» conserva su nombre propio. La secuencia visual aprobada se describe a continuación; HEX, fuentes y recursos concretos permanecen pendientes (OPEN-05).

**Escritorio:**

- Hero inicial **a pantalla completa** con título **Book Diary** entre ramas de sakura (DEC-017).
- Al desplazarse, las ramas se separan como cortinas y revelan la fachada de una librería ilustrada situada detrás; la transición es reversible con el scroll.
- Tras revelar la fachada rotulada exactamente **«Book Diary»**, realizar **aproximación visual hacia la puerta** antes de mostrar la biblioteca (DEC-018/032). La biblioteca incluye selector horizontal, meta circular con conteo y árbol (DEC-024/030); su orden interno concreto sigue siendo una propuesta de composición, no una decisión adicional aprobada. No usar «Book Diary by Montse» ni «Montse's Bookshop» como letrero. Técnica y fallback de entrada quedan pendientes.
- Los libros muestran inicialmente el **lomo**. Al seleccionarlos, salen de la repisa, giran para revelar la portada y muestran sus detalles en **panel lateral**; cerrar devuelve la interfaz a su estado navegable (DEC-020).
- La estructura y distribución del árbol son **dinámicas** según el volumen de libros por mes; al cambiar de año reorganiza suavemente sus ramas, conservando meses/libros accesibles y sin solapamientos (DEC-006/019). No asumir doce repisas físicas rígidas ni capacidad arbitraria.
- Animaciones **mágicas e interactivas discretas**, como pétalos ocasionales, movimiento sutil de ramas y respuesta al cursor, sin obstaculizar lectura ni controles (DEC-023).

**Móvil:**

- Librero vertical simplificado, con repisas horizontales por mes y desplazamiento lateral cuando sea necesario.
- Libros de lomo y apertura de detalle en **panel inferior (bottom sheet)**, sin exigir los efectos complejos del árbol de escritorio (DEC-021).
- Decoración de sakura discreta y prioridad a legibilidad, controles táctiles y rendimiento.

**Movimiento reducido (DEC-029):** respetar automáticamente `prefers-reduced-motion`, simplificar/eliminar movimiento decorativo y mantener todas las funciones; no se requiere un interruptor manual. La reorganización, entrada y detalle tienen equivalencia sin animación.

**Importante:** el mockup visual aprobado es una **referencia conceptual**, no una especificación literal. Los nombres y cantidades de libros, metas y meses que aparecen en la ilustración son ejemplos; el producto debe mostrar meses correctos y datos reales. El letrero definitivo de la fachada es «Book Diary».

## 6. Reglas de producto y ejemplos de aceptación

| ID | Regla | Ejemplo comprobable |
| --- | --- | --- |
| BR-01 | Solo la identidad autorizada, autenticada mediante magic link, puede modificar datos (DEC-009). | Un visitante puede abrir detalles, pero no guardar cambios. |
| BR-02 | Un libro por obra reúne ediciones y varias lecturas; formato por lectura y edición utilizada opcional (DEC-001/038/041). | Físico y Kindle pueden corresponder a dos lecturas del mismo libro; ninguna exige edición/ISBN. |
| BR-03 | La biblioteca anual se organiza por finalización. | Lectura iniciada en diciembre de 2025 y terminada en enero de 2026 aparece en enero de 2026. |
| BR-04 | Finalizar requiere año; mes/día opcionales conservan precisión conocida (DEC-005/033). | Una lectura terminada en 2024 sin mes aparece en «Sin mes registrado» de 2024; no se inventa mes/día. |
| BR-05 | Las relecturas cuentan para la meta. | Dos finalizaciones del mismo libro en un año suman dos al avance; una abandonada no suma (DEC-014). |
| BR-06 | Calificación y opinión son opcionales. | Se puede finalizar una lectura sin asignar estrellas. |
| BR-07 | Los metadatos automáticos requieren revisión. | La foto extrae un título, pero no se guarda sin confirmación. |
| BR-08 | Existe salida manual ante fallos de catálogos. | La propietaria puede registrar un libro que no aparece en la búsqueda. |
| BR-09 | Una meta no controla la existencia de lecturas; sin ella mostrar «Sin meta establecida» y permitir que la propietaria la cree (DEC-037). | Eliminar la meta de 2025 no borra lecturas; el año muestra el texto aprobado. |
| BR-10 | Todas las lecturas activas se muestran en la rama superior sin filtrar por año (DEC-007/034). | Cambiar de año mantiene todas las activas; ninguna aparece como completada en un mes. |

## 7. Fuera del alcance del MVP

- Lista de libros **por leer** o backlog.
- Red social, cuentas de lectores, comentarios públicos y seguimiento entre usuarios.
- Recomendaciones generadas por IA.
- Estadísticas avanzadas o dashboards analíticos.
- Seguimiento de páginas, porcentajes o tiempo de lectura.
- Sincronización automática con Kindle u otras plataformas de lectura.

Estas capacidades solo podrán incorporarse mediante una decisión posterior documentada; su presencia en v1 no las convierte automáticamente en requisitos de v2.

## 8. Estado de v1 y precauciones de transición

La auditoría `CURRENT_STATE.md` del **17 de octubre de 2026**, commit `b1d32f80a48e8bad2cc9b6a790a997afc265cd32`, informa que v1 ya implementa búsqueda con Open Library, foto con Gemini, estados de lectura, finalización/evaluación y meta del año actual. También identifica diferencias relevantes:

- V1 mezcla datos del libro y de la lectura en una fila; no representa relecturas históricas.
- V1 tiene una lista de pendientes y estadísticas que **no son parte del MVP definido aquí**. DEC-036 fija archivo privado, sin exposición pública ni borrado, para los **campos históricos fuera del MVP**. No decide archivar todos los registros v1; inventario, mapeo y destino de registros no determinado siguen pendientes OPEN-08.
- V1 exige calificación para finalizar; v2 la permitirá omitir.
- No se comprobó el esquema real de Supabase ni sus políticas RLS; la ausencia de autenticación en código no demuestra por sí sola exposición pública.
- No se ejecutaron pruebas, compilación ni verificación contra el backend real durante la auditoría.

**Preservación aprobada (DEC-013):** conservar **todos los registros existentes de v1**, fechas, evaluaciones, notas y campos legados, incluso los ajenos al nuevo MVP; no inventar relecturas ni fechas. Preservar no implica publicar ni exhibir pendientes como lecturas terminadas. Los campos históricos fuera del MVP van a **archivo privado, sin exposición pública ni borrado** (DEC-036); su almacenamiento, formato, ubicación y protección/mapeo siguen pendientes. No archivar todo v1 por inferencia.

**Condición obligatoria antes de migrar:** verificar esquema y permisos reales con acceso autorizado, hacer respaldo, definir mapeo de datos y plan de reversión, y comprobar integridad de las lecturas. No deducir el esquema remoto únicamente de tipos TypeScript.

## 9. Restricciones de calidad

- **Seguridad:** lectura pública y escritura protegida con autorización efectiva; limitar acceso y consumo de APIs costosas, especialmente procesamiento de imágenes.
- **Accesibilidad:** navegación por teclado, controles identificables, contraste suficiente, alternativas a interacciones de movimiento y respeto a `prefers-reduced-motion`.
- **Responsive:** las funcionalidades centrales deben estar disponibles en escritorio y móvil, aunque las animaciones difieran.
- **Resiliencia:** los fallos de búsqueda, extracción de imágenes o portadas no deben impedir el registro manual.
- **Integridad:** no perder historial, fechas conocidas, notas ni calificaciones al evolucionar el modelo.
- **Mantenibilidad:** contratos y reglas verificables, sin dependencia de un proveedor o agente de IA concreto para interpretar la documentación.

## 10. Decisiones abiertas

| ID | Tema | Estado |
| --- | --- | --- |
| OPEN-01 | Identidad autorizada, sesión de magic link, autorización/RLS y política de publicación | Pendiente; bloquea permisos y exposición de campos |
| OPEN-02 | Prioridad/mezcla de Open Library + Google Books, límites, fallos y proveedor/modelo IA | Pendiente; bloquea integraciones concretas |
| OPEN-03 | Deduplicación, estructura de ediciones opcionales, confirmaciones y mecanismo de recuperación; efectos de eliminación/restauración sobre consultas/conteos/conflictos/asociaciones | Parcialmente resuelto: libro único por obra DEC-041 y lecturas eliminadas recuperables DEC-040. No asumir desaparición de asociadas ni habilitar cascada/borrado del libro. |
| OPEN-04 | Inicio/desconocidos, consistencia, transiciones adicionales, evaluación al abandonar, «Otro» y persistencia del historial | Parcialmente resuelto: año mínimo DEC-033; «Abandonados» DEC-035; misma lectura e historial conservado DEC-039; formato por lectura DEC-038. Representación técnica y demás reglas citadas pendientes, no nueva identidad lógica. |
| OPEN-05 | Paleta exacta, tipografías, recursos y textos secundarios; español, tema y letrero ya aprobados | Pendiente; bloquea UI concreta |
| OPEN-06 | Geometría/distribución dinámica, casos extremos, accesibilidad y rendimiento | Parcialmente resuelto: todas las activas sin filtro anual DEC-034; restantes detalles pendientes. |
| OPEN-07 | Estrategia de migración, respaldo y reversión | Pendiente de auditoría autorizada de backend |
| OPEN-08 | Inventario/mapeo, almacenamiento, formato, ubicación y protección del archivo de campos fuera del MVP; destino de registros no determinado | Parcialmente resuelto: archivo privado sin exposición pública ni borrado DEC-036; mecanismos y verificaciones siguen pendientes, sin archivar todo v1. |
| TECH-01 | Límites servidor/cliente, operaciones de dominio y arquitectura de autenticación | Pendiente; bloquea arquitectura concreta |
| TECH-02 | Runtime, pruebas, calidad, rendimiento, responsive y despliegue | Pendiente; bloquea reproducibilidad y verificaciones afectadas |

## 11. Documentos relacionados y precedencia

- `docs/CURRENT_STATE.md`: **evidencia de implementación existente**, no fuente de requisitos futuros.
- `docs/product/PRODUCT.md` (este documento): visión, alcance y reglas de producto.
- `docs/product/REQUIREMENTS.md`: requisitos detallados y criterios de aceptación; conserva reglas pendientes de cierre.
- `docs/design/DESIGN.md` y `docs/design/INTERACTIONS.md`: especificaciones visuales y de interacción.
- `docs/architecture/DATA_MODEL.md` y `docs/architecture/ARCHITECTURE.md`: propuestas técnicas sujetas a aprobación.
- `docs/DECISIONS.md`: fuente canónica de decisiones aprobadas y pendientes; prevalece sobre propuestas incompatibles.
- `docs/PHASE_0_REPORT.md`: auditoría histórica de preparación, riesgos y bloqueos; no acredita ejecución.
- `docs/IMPLEMENTATION_PLAN.md`: fases y puertas de aprobación; no autoriza avanzar por sí solo.

Si el código legado contradice este documento, **no se asume que el comportamiento legado sea el deseado**. Si este documento deja una cuestión abierta, **no debe resolverse silenciosamente al implementar**: registrar una propuesta y solicitar aprobación.

## 12. Criterio para aprobar este documento

El documento consolidado editorialmente podrá pasar a **Aprobado** cuando la propietaria confirme su visión, alcance, reglas y exclusiones. La aprobación del producto no implica aprobación automática de arquitectura, migraciones, diseño detallado ni implementación.
