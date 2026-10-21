# Book Diary v2 — Registro de decisiones

**Estado:** 41 decisiones de producto y UX aprobadas; decisiones técnicas y aprobación integral de especificaciones pendientes. No cierra Fase 0 ni autoriza Fase 1.  
**Fecha de consolidación inicial:** 18 de octubre de 2026.  
**Último registro de decisiones aprobadas:** 19 de octubre de 2026.  
**Ubicación:** `docs/DECISIONS.md`.

## 1. Propósito y reglas de uso

Este documento consolida **41 elecciones explícitas de la propietaria**: 32 decisiones iniciales en cuatro bloques y nueve complementos aprobados el 19/10/2026. Es independiente de la conversación y legible por cualquier agente de IA. Una elección aprobada define **qué** debe ocurrir, pero no autoriza a inferir tecnologías, límites, esquemas SQL, parámetros de animación o detalles no especificados.

- **APROBADA:** elección explícita de producto o experiencia. No implica que esté implementada.
- **PENDIENTE:** requiere decisión adicional, investigación o verificación técnica.
- **PROPUESTA:** alternativa sugerida, no aprobada.
- **Prioridad de interpretación:** las decisiones aprobadas aquí prevalecen sobre propuestas anteriores contradictorias en `PRODUCT.md`, `REQUIREMENTS.md`, `DESIGN.md`, `INTERACTIONS.md`, `DATA_MODEL.md` y `ARCHITECTURE.md`. El código de v1 es evidencia del estado anterior, no una definición de v2.
- **Control de cambios:** cualquier modificación a una decisión aprobada debe registrarse expresamente con su ID, motivo y documentos afectados. No modificar silenciosamente las decisiones.

## 2. Decisiones aprobadas — Bloque 1: libros, lecturas y organización

### DEC-001 — Libro existente y relectura
**Estado:** APROBADA · **Selección:** B

Cuando se intenta registrar un libro ya existente, mostrar opciones para **crear una nueva lectura/relectura** del libro o **corregir sus metadatos**. No duplicar automáticamente el registro bibliográfico ni sobrescribir lecturas anteriores. La identidad exacta de obra/edición y la detección de coincidencias siguen pendientes.

### DEC-002 — Formatos de lectura
**Estado:** APROBADA · **Selección:** A

Usar una lista fija: **Físico, Kindle, iPad, Audiolibro y Otro**. No ofrecer administración de formatos personalizados en el MVP. El comportamiento del valor «Otro» (etiqueta adicional o no) queda pendiente.

### DEC-003 — Calificación
**Estado:** APROBADA · **Selección:** B

Calificación **opcional**, de **0.5 a 5 estrellas** en incrementos de **0.5**. La ausencia de calificación es distinta de una calificación de cero. La evaluación pertenece a cada lectura.

### DEC-004 — Finalizar una lectura
**Estado:** APROBADA · **Selección:** A

Formulario minimalista con **fecha de finalización, calificación opcional y opinión opcional**. No exigir recomendación, intención de releer ni nivel de enganche al finalizar. La fecha puede ser parcial conforme a DEC-005.

### DEC-005 — Precisión de fechas
**Estado:** APROBADA · **Selección:** A

Admitir **día/mes/año**, **mes/año** o **solo año** sin inventar componentes desconocidos. La política de fechas de inicio incompletas o desconocidas y restricciones de consistencia requiere especificación adicional.

### DEC-006 — Árbol dinámico
**Estado:** APROBADA · **Selección:** C

En escritorio, la **estructura y distribución del árbol se adaptan a la cantidad de libros de cada mes**. Deben mantenerse la identificación y accesibilidad de los meses y de todos los libros, evitando solapamientos. No asumir doce repisas físicas rígidas ni fijar capacidad arbitraria. El algoritmo y los límites de rendimiento están pendientes.

### DEC-007 — «Actualmente leyendo» en el árbol
**Estado:** APROBADA · **Selección:** B

Incluir una **rama o repisa especial en la parte superior del árbol** para «Actualmente leyendo». Es visualmente distinguible de los doce meses de libros terminados. La relación entre el año seleccionado y lecturas en curso debe definirse sin cambiar la semántica de la lectura.

### DEC-008 — Eliminación de libros
**Estado:** APROBADA · **Selección:** B

**No permitir eliminar un libro mientras tenga lecturas asociadas.** Deben eliminarse primero las lecturas. Confirmaciones y manejo de borrado irreversible siguen pendientes de especificación. No borrar lecturas en cascada de forma implícita.

## 3. Decisiones aprobadas — Bloque 2: acceso, captura y datos

### DEC-009 — Inicio de sesión de la propietaria
**Estado:** APROBADA · **Selección:** C

Autenticación mediante **enlace mágico por correo electrónico**. La biblioteca es públicamente consultable, pero solo la **identidad expresamente autorizada** puede escribir. El correo autorizado, la gestión de sesión y las políticas RLS deben definirse y verificarse sin documentar datos personales o secretos en el repositorio.

### DEC-010 — Fuentes bibliográficas
**Estado:** APROBADA · **Selección:** B

Utilizar **Open Library y Google Books** para búsqueda y enriquecimiento bibliográfico. La prioridad entre fuentes, resolución de discrepancias, licencias, cuotas y comportamiento ante fallos están pendientes.

### DEC-011 — Alta mediante fotografía
**Estado:** APROBADA · **Selección:** C

La IA identifica el libro desde una fotografía y **precarga un formulario editable**. La propietaria revisa/corrige y **confirma antes de guardar**. No registrar automáticamente sin confirmación.

### DEC-012 — Libro no encontrado en APIs
**Estado:** APROBADA · **Selección:** C

Ofrecer **registro manual asistido por IA** cuando las fuentes bibliográficas no encuentran el libro. Los datos sugeridos deben ser revisables; no presentar inferencias no verificadas como hechos ni bloquear la captura si la IA falla.

### DEC-013 — Preservación de v1
**Estado:** APROBADA · **Selección:** A

**Conservar todos los registros existentes de v1**, incluidas fechas, evaluaciones y notas conocidas. No inventar relecturas ni fechas. **No ejecutar migración** sin inspección autorizada del esquema real de Supabase, respaldo, plan de reversión y verificaciones de integridad. El destino de los registros «quiero_leer» y de campos históricos fuera del MVP continúa pendiente; conservar no significa exhibirlos como lecturas terminadas.

### DEC-014 — Estados de lectura
**Estado:** APROBADA · **Selección:** B

Tres estados: **Leyendo, Terminado y Abandonado**. Las lecturas abandonadas no cuentan como completadas para metas. No añadir «Pausado» al MVP sin nueva decisión. Las transiciones permitidas y la ubicación visual de abandonados están pendientes.

### DEC-015 — Datos al comenzar
**Estado:** APROBADA · **Selección:** B

Al iniciar una lectura, registrar **libro, fecha de inicio y formato**. La obligatoriedad/precisión de la fecha de inicio requiere cierre de reglas de datos.

### DEC-016 — Cambio de formato
**Estado:** APROBADA · **Selección:** B

Permitir **editar el formato** de una lectura existente. No registrar múltiples formatos simultáneos como una capacidad del MVP. Mantener los formatos previos no fue aprobado.

## 4. Decisiones aprobadas — Bloque 3: experiencia visual

### DEC-017 — Hero y apertura de sakura
**Estado:** APROBADA · **Selección:** A

Hero inicial a pantalla completa con título **«Book Diary»** y ramas de sakura que **se abren progresivamente al hacer scroll**, revelando la fachada detrás. La transición debe ser reversible al desplazarse en sentido contrario, con alternativa para movimiento reducido.

### DEC-018 — Entrada a la librería
**Estado:** APROBADA · **Selección:** C

Tras revelar la fachada, crear una **aproximación visual hacia la puerta**, como si se entrara a la librería, antes de mostrar la biblioteca. La técnica (2D/3D), duración y fallback no están aprobados.

### DEC-019 — Cambio de año
**Estado:** APROBADA · **Selección:** A

Al seleccionar otro año, el árbol **reorganiza suavemente sus ramas** para acomodar los libros de ese año. Mantener claridad del año activo y equivalencia sin animaciones.

### DEC-020 — Detalles en escritorio
**Estado:** APROBADA · **Selección:** B

Seleccionar un lomo hace que el libro **salga de la repisa y gire para mostrar la portada**; la información se presenta en un **panel lateral**. Cerrar debe devolver la interfaz a su estado navegable.

### DEC-021 — Detalles en móvil
**Estado:** APROBADA · **Selección:** B

En móvil, mostrar detalles mediante **panel inferior (`bottom sheet`)**. Mantener librero móvil simplificado con repisas horizontales; no exigir la animación compleja del árbol de escritorio.

### DEC-022 — Grado de ilustración
**Estado:** APROBADA · **Selección:** C

**Interfaz funcional minimalista**. Concentrar las ilustraciones principalmente en el **hero** y en **acentos decorativos pequeños**. El árbol sigue siendo una visualización protagonista e interactiva, pero sin sobrecargar navegación, formularios y paneles. **Esta elección reemplaza** la propuesta anterior de UI «equilibrada» cuando implique ornamentación excesiva.

### DEC-023 — Carácter de las animaciones
**Estado:** APROBADA · **Selección:** B

Animaciones **mágicas e interactivas**, como pétalos ocasionales, movimientos sutiles de ramas y respuesta de libros al cursor. Evitar que efectos decorativos obstaculicen la lectura o interacción; respetar DEC-029.

### DEC-024 — Selector de años
**Estado:** APROBADA · **Selección:** A

Usar **selector horizontal de años**, con identificación clara del año activo. No sustituirlo por un desplegable como patrón principal sin nueva aprobación.

## 5. Decisiones aprobadas — Bloque 4: administración y detalles finales

### DEC-025 — Acceso a «Agregar libro»
**Estado:** APROBADA · **Selección:** B

Botón **«Agregar libro» en la navegación**, visible únicamente para la propietaria autenticada. Ocultar el botón no reemplaza los controles de autorización de servidor/base de datos.

### DEC-026 — Edición
**Estado:** APROBADA · **Selección:** A

Editar un libro **desde su panel de detalles** cuando la propietaria esté autenticada. No crear un panel administrativo independiente como requisito del MVP.

### DEC-027 — Tema
**Estado:** APROBADA · **Selección:** A

**Solo modo claro** en el MVP. No requerir modo oscuro ni selector de tema.

### DEC-028 — Idioma
**Estado:** APROBADA · **Selección:** A

Interfaz en **español**. «Book Diary» se mantiene como nombre propio del producto.

### DEC-029 — Movimiento reducido
**Estado:** APROBADA · **Selección:** A

Respetar **`prefers-reduced-motion`** del dispositivo: simplificar o eliminar movimiento decorativo y mantener disponibles todas las funciones. No se requiere un interruptor manual de animaciones.

### DEC-030 — Visualización de meta anual
**Estado:** APROBADA · **Selección:** C

Mostrar **indicador circular y conteo explícito** de libros completados frente a la meta (por ejemplo, «12 de 20 libros»). No depender únicamente del color o del porcentaje.

### DEC-031 — Meses sin lecturas
**Estado:** APROBADA · **Selección:** C

Conservar los **meses vacíos identificables**, con una **repisa vacía y un pequeño elemento decorativo**. El árbol dinámico debe acomodarlos sin inventar libros.

### DEC-032 — Letrero de la fachada
**Estado:** APROBADA · **Selección:** C

La fachada debe decir exactamente **«Book Diary»**. No utilizar «Book Diary by Montse» ni «Montse's Bookshop» como letrero definitivo.

## 5 bis. Decisiones aprobadas — Bloque 5: cierre parcial de reglas de producto (19/10/2026)

**Aprobación:** expresa de la propietaria, registrada el 19 de octubre de 2026. Son complementos trazables de las decisiones iniciales; **DEC-001–DEC-032 se conservan sin reescritura ni renumeración**. DEC-033 complementa DEC-005; DEC-034 complementa DEC-007; DEC-035 complementa DEC-014; DEC-036 complementa DEC-013. DEC-037 concreta el estado sin meta. Estos acuerdos definen producto, no autorizan implementación, migración ni elección técnica.

### DEC-033 — Año mínimo al finalizar
**Estado:** APROBADA · **Fecha de aprobación:** 19/10/2026

Finalizar una lectura **requiere al menos el año de finalización**. Mes y día son opcionales: admitir año, mes/año o día/mes/año sin inventar componentes desconocidos. Calificación y opinión siguen siendo opcionales conforme a DEC-003/004. La obligatoriedad/precisión de la fecha de inicio y otras validaciones de consistencia no se resuelven aquí.

**Motivo:** cerrar la fecha mínima de finalización señalada en A-01 de `docs/PHASE_0_REPORT.md`, conservando la precisión de DEC-005. **Documentos afectados:** `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`. No fabricar año para datos v1 desconocidos: su preservación/mapeo requiere OPEN-07/08.

### DEC-034 — Lecturas activas globales
**Estado:** APROBADA · **Fecha de aprobación:** 19/10/2026

**«Actualmente leyendo» muestra todas las lecturas activas independientemente del año seleccionado.** Mantener su rama superior diferenciada conforme a DEC-007; cambiar de año no filtra ni oculta lecturas activas. La geometría, navegación y rendimiento del árbol siguen pendientes OPEN-06.

**Motivo:** cerrar la relación activos/año señalada en A-02 sin confundir lecturas en curso con meses de finalización. **Documentos afectados:** `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`.

### DEC-035 — Conservación y retomada de abandonadas
**Estado:** APROBADA · **Fecha de aprobación:** 19/10/2026

Conservar las lecturas abandonadas en una sección **«Abandonados»**, con sus fechas y notas. La propietaria puede **retomarlas**. No cuentan como completadas para metas (DEC-014). El **mecanismo para preservar el historial al retomar permanece pendiente**: este acuerdo no elige reutilizar una instancia, crear otra, registrar eventos ni otro modelo; tampoco decide fechas nuevas, transiciones adicionales o calificación al abandonar. No implica publicar todas las notas ni campos históricos.

**Motivo:** concretar ubicación y posibilidad de retomada sin perder el historial de una lectura abandonada, cerrando parcialmente A-04/OPEN-04. **Documentos afectados:** `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`. Diseño concreto de la sección y privacidad de campos no aprobados siguen pendientes.

### DEC-036 — Archivo privado de campos históricos fuera del MVP
**Estado:** APROBADA · **Fecha de aprobación:** 19/10/2026

Conservar los **campos históricos de v1 que quedan fuera del MVP en un archivo privado, sin exposición pública ni borrado**. Esta decisión no archiva automáticamente todo v1, no decide el destino de todos sus registros ni publica las notas de «Abandonados» por inferencia. Almacenamiento, formato, ubicación del archivo, controles efectivos, inventario y mapeo siguen pendientes. La preservación total y condiciones de migración de DEC-013 permanecen vigentes.

**Motivo:** cerrar el destino/visibilidad de esos campos señalado en A-03/OPEN-08 sin ampliar el MVP ni elegir infraestructura. **Documentos afectados:** `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`.

### DEC-037 — Estado sin meta anual
**Estado:** APROBADA · **Fecha de aprobación:** 19/10/2026

Si no existe meta anual para el año consultado, mostrar exactamente **«Sin meta establecida»**. La propietaria puede crearla. La ausencia de meta no es un error de consulta ni autoriza mostrar un objetivo ficticio. Unicidad, límites del objetivo y representación del exceso siguen pendientes; esta decisión no los fija ni elige tecnología.

**Motivo:** concretar el estado sin objetivo de A-05, sin cerrar las demás invariantes de metas ni ampliar OPEN-04. **Documentos afectados:** `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`.

## 5 ter. Decisiones aprobadas — Bloque 6: identidad, historial y recuperación (19/10/2026)

**Aprobación:** expresa de la propietaria, registrada el 19 de octubre de 2026. Se añaden DEC-038–DEC-041 sin modificar ni renumerar los bloques DEC-001–DEC-037. DEC-038 concreta la pertenencia del formato de DEC-002/016; DEC-039 concreta la **misma identidad lógica de lectura** al retomar DEC-035. Las opciones que DEC-035 dejó entonces abiertas se conservan como historia de esa aprobación: desde DEC-039, **crear otra lectura como identidad lógica de retomada ya no es una opción vigente**. La estructura física para conservar la misma lectura y su historial aún requiere diseño. DEC-040 complementa la eliminación de lecturas y debe respetar DEC-008; DEC-041 concreta la organización obra/ediciones de DEC-001. Estos acuerdos no autorizan implementación, SQL, papelera ni operaciones sobre datos.

### DEC-038 — Formato propio de cada experiencia de lectura
**Estado:** APROBADA · **Fecha de aprobación:** 19/10/2026

Un libro admite **múltiples experiencias de lectura en distintos formatos**. El formato pertenece a **cada lectura, no al libro**. Conservar la lista fija y edición del formato de DEC-002/016: cada lectura mantiene un formato, sin aprobar múltiples formatos simultáneos dentro de una lectura ni historial de formatos anteriores.

**Motivo:** explicitar la separación entre identidad bibliográfica y experiencia/formato sin duplicar el libro por soporte. **Documentos afectados:** `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`. Representación física y validaciones restantes permanecen pendientes.

### DEC-039 — Retomar como la misma lectura con historial preservado
**Estado:** APROBADA · **Fecha de aprobación:** 19/10/2026

Retomar una abandonada como **la misma lectura**, conservando el **historial de abandono y reanudación**, sin sobrescribirlo ni perderlo. No crear una nueva lectura/relectura lógica para representar esa retomada. La persistencia del historial y sus estructuras, campos, reglas de fechas y mecanismo técnico siguen pendientes; identidad lógica aprobada no significa que todo deba guardarse en una única fila física.

**Motivo:** concretar la identidad de retomada que DEC-035 dejó abierta, sin confundirla con una relectura ni perder experiencias anteriores. **Documentos afectados:** `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`.

### DEC-040 — Lecturas eliminadas recuperables
**Estado:** APROBADA · **Fecha de aprobación:** 19/10/2026

Las lecturas eliminadas deben ser **recuperables**. Contemplar **borrado lógico o un mecanismo equivalente** que garantice recuperación; no tratar una eliminación irreversible sin recuperación como alternativa válida. No se implementa ni exige una **papelera** como interfaz por esta decisión, ni se elige estrategia física, campos SQL, plazos, purga o política de conservación/restauración por inferencia.

**Motivo:** preservar la posibilidad de recuperar lecturas eliminadas sin decidir una solución técnica ni una UI nueva. **Documentos afectados:** `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`. **Subdecisión pendiente OPEN-03/TECH-01:** documentar implicaciones en conteos, consultas/visibilidad, restauración, conflictos y bloqueo de DEC-008. Una lectura eliminada pero recuperable no equivale automáticamente a ausencia de asociación: no habilitar borrado del libro con lecturas asociadas ni cascadas; detener esa tarea hasta definir sus reglas compatibles con DEC-008.

### DEC-041 — Ediciones bajo un único libro con referencia opcional por lectura
**Estado:** APROBADA · **Fecha de aprobación:** 19/10/2026

Las distintas ediciones de una obra se mantienen bajo **un único libro**. Cada lectura **puede registrar la edición utilizada**, de forma opcional. No exigir edición, ISBN, tabla específica, proveedor o esquema concreto. La estructura técnica de ediciones/referencias, normalización y detección de coincidencias siguen pendientes; no reabrir la elección de libro único por obra.

**Motivo:** concretar obra/ediciones sin duplicar el registro bibliográfico por edición ni imponer metadatos desconocidos al registrar una lectura. **Documentos afectados:** `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md`, `docs/design/DESIGN.md`, `docs/design/INTERACTIONS.md`, `docs/architecture/DATA_MODEL.md`, `docs/architecture/ARCHITECTURE.md` y `docs/SYNC_REPORT.md`.

### DEC-042 — Identidad autorizada, altas, capa de escritura y sesión (cierre parcial de OPEN-01 / TECH-01)
**Estado:** APROBADA · **Fecha de aprobación:** 20/10/2026

Complementa DEC-009 sin reescribirla:

1. **Identidad:** la propietaria se identifica mediante una **tabla privada de propietarias autorizadas** (esquema no expuesto por la Data API) que contiene su identificador de Auth; las políticas RLS la consultan. No se usa el correo escrito en SQL ni un claim editable por el usuario (`user_metadata`). El identificador y el correo reales no se documentan ni versionan en el repositorio.
2. **Altas:** **cerradas** (`enable_signup = false` o equivalente). Solo se crea o invita a la propietaria; los visitantes consultan sin cuenta.
3. **Escrituras (TECH-01, parcial):** mediante **Server Actions o Route Handlers con sesión SSR por cookies y validación en servidor, con RLS como defensa final**. Pasar la escritura al servidor no sustituye RLS.
4. **Sesión:** sesión persistente con refresco y token de acceso de **1 hora** (valor por defecto). Revocar = retirar a la propietaria de la tabla (efecto inmediato sobre escritura) y cerrar sesión; no se presume revocación instantánea del JWT.

**Motivo:** cerrar la identidad, las altas, la frontera de escritura y la sesión necesarias para Fase 1, apoyándose en el patrón ya ensayado con datos sintéticos en `supabase/migrations/20261020181122_phase1_local_security_harness.sql`. **Documentos afectados:** `docs/DECISIONS.md` (§6), `docs/architecture/ARCHITECTURE.md`. **Siguen pendientes:** proyección pública de campos (qué ve un visitante), verificación en un entorno autorizado, mecanismo de alta de la propietaria y despliegue de la configuración de Auth, y límites de Server Actions frente a Route Handlers. Esta decisión no aprueba esquema físico, SQL definitivo ni cambios al proyecto remoto.

### DEC-043 — Proyección pública de campos y alcance proporcional del proyecto (cierre parcial de OPEN-01)
**Estado:** APROBADA · **Fecha de aprobación:** 20/10/2026

1. **Campos públicos (visitante anónimo):**

| Campo | Visibilidad |
|---|---|
| Título, autor, portada, estado, formato, fechas, calificación | Público |
| Opinión / notas de lecturas terminadas | Público |
| Notas de lecturas abandonadas | **Privado** (conforme a DEC-035: no se publican por inferencia) |
| `would_recommend`, `would_reread`, `engagement` y demás campos legados fuera del MVP | **Privado**, en el archivo histórico (DEC-036) |
| Registros `quiero_leer` | **Privado** hasta decidir su destino (OPEN-08) |
| Metas anuales | Público |

   La lista se hace cumplir con grants por columna o una vista segura (RLS filtra filas, no columnas); el mecanismo concreto se elige al diseñar el esquema.
2. **Alcance proporcional:** Book Diary es un proyecto personal de portafolio con datos no sensibles. Se usa **Supabase local** como único entorno de pruebas, sin proyecto remoto adicional ni Preview Branch; el conjunto de pruebas de seguridad se limita a los casos del fixture (anónimo, autenticado no propietaria, propietaria, revocación). Antes de migrar se exige respaldo y conteo de filas antes/después. **RLS y la separación de escritura se mantienen**: no compartir la liga de acceso no es un control de seguridad, porque la clave `anon` es visible en el navegador. Esto reduce la ceremonia de verificación, no los requisitos de DEC-009 ni DEC-042.

**Motivo:** cerrar la proyección pública pendiente de DEC-042 y dimensionar el esfuerzo de Fase 1 al tipo de proyecto. **Documentos afectados:** `docs/DECISIONS.md` (§6). **Siguen pendientes:** mecanismo de alta de la propietaria y verificación local de las políticas. Cambiar una fila a pública o privada requiere nueva aprobación registrada.

### DEC-044 — Reglas de lectura, duplicados y borrado lógico (cierre parcial de OPEN-03 / OPEN-04)
**Estado:** APROBADA · **Fecha de aprobación:** 20/10/2026

1. **Inicio:** la fecha de inicio es **opcional** y admite la misma precisión que la de fin (DEC-005): fecha completa, mes/año o solo año. Al empezar desde la app se propone la fecha de hoy, editable. No se inventa fecha de inicio para registros v1 que no la tengan.
2. **Consistencia de fechas:** solo dos reglas: (a) el fin no puede ser anterior al inicio cuando ambos existen, comparando al nivel de precisión más grueso de los dos; (b) no se admiten fechas futuras. No se añaden otras validaciones.
3. **Transiciones de estado:** Leyendo → Terminado, Leyendo → Abandonado y Abandonado → Leyendo (misma lectura, con historial preservado, DEC-039). **Terminado es final**: releer es una nueva lectura (DEC-001). Corregir un Terminado marcado por error se hace editando sus datos, sin cambiar de estado. No se permite Terminado → Leyendo.
4. **Formato «Otro»:** valor simple de la lista fija (DEC-002), **sin etiqueta de texto adicional**.
5. **Detección de duplicados:** se sugiere que un libro ya existe cuando coincide el **ID de catálogo** (Open Library / Google Books) o el **título y autor normalizados** (sin mayúsculas ni acentos). Es siempre una sugerencia con las opciones de DEC-001 (nueva lectura o corregir metadatos); nunca una fusión ni alta automática.
6. **Borrado de lecturas (DEC-040):** **borrado lógico** mediante una marca de eliminación (p. ej. `deleted_at`; nombre y detalle físico se fijan al diseñar el esquema). Una lectura eliminada se oculta, **no cuenta** para metas ni árbol, y se restaura quitando la marca; no se exige papelera en la interfaz. Una lectura eliminada **sigue bloqueando el borrado del libro** (DEC-008) hasta que se purgue; no hay cascadas.

**Motivo:** cerrar las reglas necesarias para diseñar el esquema de Fase 1. **Documentos afectados:** `docs/DECISIONS.md` (§6). **Siguen pendientes:** calificación y notas al abandonar, estructura del historial de abandono/reanudación, estructura de ediciones, confirmaciones de borrado y política de purga. No aprueba esquema físico ni SQL.

### DEC-045 — Esquema candidato v2 para pruebas locales y destino del legado (cierre parcial de OPEN-08 / OPEN-03 / OPEN-04)
**Estado:** APROBADA · **Fecha de aprobación:** 20/10/2026

Se aprueba `docs/architecture/SCHEMA_PROPOSAL.md` como **esquema candidato para ensayo en Supabase local con datos sintéticos**: tablas `books`, `readings`, `reading_events`, `reading_goals`, `private.owners` y `private.legacy_archive`; tablas base cerradas al visitante y lectura pública solo mediante vistas con las columnas de DEC-043; borrado lógico, fechas parciales y calificación en pasos de 0.5 conforme a DEC-044. Además:

1. **Archivo legado:** cada fila de v1 se conserva completa y sin transformar en `private.legacy_archive` (`jsonb`). Los campos `would_recommend`, `would_reread`, `engagement` y `last_updated_at` viven solo ahí (DEC-036).
2. **`quiero_leer`:** no se convierten en lecturas; quedan solo en el archivo, invisibles al público.
3. **Terminadas de v1 sin año de fin:** pasan a `readings` solo si existe `finished_year`; las demás permanecen únicamente en el archivo hasta que la propietaria les asigne año. Nunca se inventa una fecha. *(Interpretación registrada de la respuesta afirmativa de la propietaria entre las dos opciones de `SCHEMA_PROPOSAL.md §6`; ambas conservan todos los datos. Revisable con el inventario real.)*
4. **Notas de v1:** pasan a ser la opinión pública de las lecturas terminadas (DEC-043).

**Motivo:** fijar el esquema que se probará en local y el destino del legado. **Documentos afectados:** `docs/DECISIONS.md` (§6), `docs/architecture/SCHEMA_PROPOSAL.md`. **No aprueba** ejecutar SQL, migrar datos reales ni modificar el proyecto remoto. **Siguen pendientes:** verificar la escala real de calificación de v1 (el SQL de `rating` es 0.5–5; valores distintos se revisan a mano antes de migrar), estructura final de ediciones, confirmaciones y purga de borrado, calificación al abandonar, y verificar localmente que las vistas públicas exponen solo las columnas listadas.

### DEC-046 — Los datos de v1 son de prueba: partir de una base limpia (modifica DEC-013, DEC-036 y partes de DEC-045)
**Estado:** APROBADA · **Fecha de aprobación:** 20/10/2026

La propietaria declara que los registros de v1 en Supabase **eran solo pruebas, no información real**, y que en v2 se puede **borrar todo y empezar de nuevo** con la base de datos. En consecuencia:

1. **No hay migración de datos v1 → v2.** Se deja sin efecto la obligación de preservar los registros de v1 (DEC-013) y de conservar sus campos históricos en un archivo privado (DEC-036). Las reglas sobre `would_recommend`, `would_reread`, `engagement`, `last_updated_at` y `quiero_leer` ya no aplican: esos campos no existen en v2.
2. De DEC-045 se **retiran** `private.legacy_archive` y los puntos 1–4 (archivo, `quiero_leer`, terminadas sin año, notas de v1). El resto del esquema candidato se mantiene.
3. OPEN-07 (migración segura) y OPEN-08 (legado) quedan **sin objeto** para datos; OPEN-07 conserva solo la necesidad de aplicar el esquema v2 al proyecto remoto de forma controlada.
4. **Cuándo se borra y quién lo hace:** el borrado/reinicio del proyecto remoto y la aplicación del esquema v2 se ejecutan **solo con autorización expresa y específica** (AGENTS.md §5, §8) y haciendo antes una última comprobación de que no hay registros que la propietaria quiera conservar. Esta decisión no autoriza esa operación por sí sola.

**Motivo:** los datos de v1 no son reales; mantener archivo, mapeo y reconciliación añade complejidad sin beneficio. **Documentos afectados:** `docs/DECISIONS.md`, `docs/architecture/SCHEMA_PROPOSAL.md`, `supabase/migrations/20261020190000_v2_schema_candidate.sql`. DEC-013 y DEC-036 se conservan en el historial como decisiones anteriores; esta las sustituye en lo indicado. **Hecho verificable por la propietaria:** el esquema v1 original solo tenía la tabla `books` con la política «Allow all for anon» (lectura y escritura abiertas); aplicar v2 reemplaza esa política.

### DEC-047 — Técnica, arte y paleta del primer corte de Fase 4 (cierre parcial de OPEN-05 / TECH-02)
**Estado:** APROBADA · **Fecha de aprobación:** 20/10/2026

1. **Técnica (DEC-018):** hero, fachada y aproximación a la puerta se resuelven con una **escena 3D en Three.js** (react-three-fiber, ya presente en el proyecto) formada por **capas planas con textura SVG** y una cámara cuyo avance depende del scroll. Reversible al desplazarse en sentido contrario (DEC-017).
2. **Arte:** las ilustraciones (ramas de sakura, fachada, puerta) son **SVG estilizados dibujados por el agente**, sin recursos de terceros; son un punto de partida reemplazable por arte de la propietaria.
3. **Paleta y tipografía:** se **mantienen los tokens de v1** de `app/globals.css` y las fuentes Newsreader y Work Sans, solo tema claro (DEC-027). Quedan como valores vigentes, no como cierre definitivo de OPEN-05.
4. **Alcance del corte:** hero → fachada «Book Diary» → aproximación a la puerta → marcador de biblioteca provisional. **No incluye** el árbol dinámico (OPEN-06 sigue abierto) ni datos reales.
5. **Movimiento reducido y fallback (DEC-029):** con `prefers-reduced-motion` o sin WebGL se muestra la escena final estática, con título y acceso directo a la biblioteca; sin recorrido animado.

**Motivo:** poder empezar la Fase 4 sin bloquear por activos externos. **Documentos afectados:** `docs/DECISIONS.md` (§6), `docs/design/DESIGN.md` §5 (sin reescribir). **Siguen pendientes:** duraciones y easing definitivos, rendimiento medido en dispositivos modestos (TECH-02), algoritmo del árbol (OPEN-06) y tamaños/medidas finales.

### DEC-048 — Inicio de sesión con correo y contraseña; alcance personal (modifica el mecanismo de DEC-009)
**Estado:** APROBADA · **Fecha de aprobación:** 20/10/2026

1. **Login:** la propietaria entra con **correo y contraseña** de su usuario de Supabase Auth, mediante un formulario propio en `/login`. Sustituye al enlace mágico de DEC-009 como mecanismo; el resto de DEC-009 y DEC-042 se mantiene (lectura pública, escritura solo de la propietaria vía `private.owners`, RLS, altas cerradas, escrituras desde Server Actions). La contraseña nunca se guarda en el repositorio ni se comparte en el chat.
2. **Alcance:** proyecto personal y de portafolio; se evita infraestructura y ceremonia adicionales. El CRUD vive en la propia biblioteca (botones «Agregar libro» y «Editar» solo para la propietaria, DEC-025/026), sin panel administrativo separado.

**Motivo:** la propietaria prefiere un acceso simple con las credenciales ya creadas. **Documentos afectados:** `docs/DECISIONS.md` (§6). Esta decisión no cambia RLS ni el esquema.

### DEC-049 — Búsqueda dual de catálogos y retiro de foto/IA del alcance actual (cierre parcial de OPEN-02)
**Estado:** APROBADA · **Fecha de aprobación:** 20/10/2026

1. **Búsqueda:** el formulario «Agregar libro» busca por título o autor en **Open Library y Google Books** a la vez, desde el servidor y solo para la propietaria autenticada. Los resultados se mezclan y se **deduplican** por título+autor normalizados, conservando ambos identificadores del catálogo y completando campos faltantes (portada, sinopsis, géneros) con el otro proveedor. Elegir un resultado rellena un formulario **editable**; la propietaria confirma antes de guardar (DEC-010/011).
2. **Fallos y límites:** cada proveedor tiene un tiempo de espera corto; si uno falla se muestran los resultados del otro, y si fallan ambos se indica y queda disponible el **alta manual** (DEC-012). Sin claves ni cuotas propias: solo búsquedas públicas.
3. **Foto con IA fuera del alcance actual:** se retira la ruta `parse-book-photo` y la dependencia `@google/genai`; no se consume ninguna API de IA. Puede retomarse como corte aparte si se decide (la propietaria señaló que los planes gratuitos suelen tardar o quedar en cola).
4. **Duplicados (DEC-044):** al guardar, se sugiere/rechaza un libro cuyo ID de catálogo o título+autor normalizados ya existan, remitiendo a «nueva lectura» desde la lista de libros existentes.

**Motivo:** cubrir la captura asistida con el menor costo y complejidad. **Documentos afectados:** `docs/DECISIONS.md` (§6). **Siguen pendientes (OPEN-02):** prioridad fina de campos entre proveedores y cualquier uso de IA/foto.

### DEC-050 — Árbol-librero: propuesta de algoritmo, accesibilidad y panel (OPEN-06) — PROPUESTA, pendiente de aprobación
**Estado:** PROPUESTA implementada por solicitud de la propietaria de continuar; **no aprobada** hasta que la revise · **Fecha:** 20/10/2026

1. **Distribución:** rama superior «Actualmente leyendo» a todo lo ancho; debajo, un tronco central con **enero–junio a la izquierda y julio–diciembre a la derecha**, de arriba abajo. «Sin mes registrado» y «Abandonados» van como repisas bajo el árbol.
2. **Dinámico (DEC-006):** cada repisa tiene ancho fijo y los libros se **acomodan en filas**; al llenarse una fila se añade otra con su propia tabla, así que la repisa crece en altura con la cantidad de libros y nunca se solapan ni se ocultan. Los meses vacíos conservan repisa, etiqueta y una florecita (DEC-031).
3. **Lomos:** ancho, alto y color derivados del identificador de la lectura (estable entre visitas), con el título en vertical; no se afirma que exista imagen real del lomo.
4. **Selección y panel (DEC-020):** cada lomo es un botón; al activarlo el libro sube, se abre un **panel lateral** con la portada (con giro de entrada), datos, sinopsis y «Editar» solo para la propietaria. Se cierra con el botón o **Esc** y el foco vuelve al lomo.
5. **Móvil (DEC-021):** las repisas son filas con desplazamiento horizontal y el panel es una **hoja inferior** (*bottom sheet*).
6. **Movimiento reducido (DEC-029):** sin transiciones ni giro; el contenido y el panel funcionan igual.
7. **Límites:** sin virtualización (adecuado para cientos de libros por año); rendimiento no medido.

**Pendiente de aprobar:** esta distribución, la mecánica del panel y los límites. Si no te convence, se ajusta sin tocar datos ni esquema.

### DEC-051 — Animación de entrada una sola vez y ramas ancladas a los bordes (ajusta DEC-017 y DEC-047)
**Estado:** APROBADA · **Fecha de aprobación:** 21/10/2026

1. **Una sola vez:** la secuencia hero → fachada → puerta se anima solo en el primer recorrido tras cargar la página. Al dejarla atrás y volver arriba, el hero queda como la **librería estática** (fachada con su letrero, sin ramas ni animación). Al recargar, vuelve a animarse. Esto sustituye la reversibilidad con el scroll de DEC-017.
2. **Ramas de cerezo:** al inicio quedan **pegadas a los bordes izquierdo y derecho**; al hacer scroll se abren hacia afuera pero **siguen ancladas a los bordes**, sin salir de la pantalla ni cambiar de tamaño, sea cual sea la cantidad de scroll o el tamaño de la ventana.
3. **Acercamiento a la puerta (DEC-018):** se mantiene.
4. **Árbol de la biblioteca (DEC-050):** se quitan las raíces.

**Motivo:** pedido de la propietaria. **Documentos afectados:** `docs/DECISIONS.md` (§6).

## 6. Decisiones todavía pendientes (no aprobadas)

Estado vigente al **19/10/2026**: ninguna OPEN/TECH se cierra por completo. DEC-033–DEC-041 resuelven subreglas concretas; las partes restantes siguen pendientes y bloquean solo las tareas que dependen de ellas:

| ID | Tema pendiente | Requisito para cerrar |
|---|---|---|
| OPEN-01 | Identidad autorizada, sesión y seguridad de Supabase — parcialmente resuelto | DEC-042 fija tabla privada de propietarias, altas cerradas, escritura por servidor con RLS y sesión de 1 h. DEC-043 fija la proyección pública de campos y el alcance proporcional de pruebas. Quedan el procedimiento de alta de la propietaria y la verificación local de RLS/grants/Auth. |
| OPEN-02 | Integraciones externas | Definir prioridad/merge de Open Library y Google Books; límites de imagen, cuotas, timeout, privacidad, tratamiento de fallos y proveedor/modelo IA. |
| OPEN-03 | Identidad bibliográfica y eliminación — parcialmente resuelto | DEC-041 fija un libro por obra con edición opcional por lectura; DEC-040 exige recuperación de lecturas eliminadas. DEC-044 fija la detección de duplicados (ID de catálogo o título+autor normalizados) y el borrado lógico, que no cuenta pero sigue bloqueando el borrado del libro. Quedan estructura de ediciones, confirmaciones y política de purga. No borrar un libro mientras tenga lecturas asociadas ni asumir que eliminar recuperablemente elimina la asociación. |
| OPEN-04 | Reglas exactas de lectura — parcialmente resuelto | DEC-033 exige año al finalizar y DEC-035 define «Abandonados» con fechas/notas y posibilidad de retomar. DEC-044 fija inicio opcional con precisión parcial, validaciones de fechas, transiciones (Terminado es final) y «Otro» sin etiqueta. Siguen pendientes la evaluación al abandonar y el diseño/persistencia del historial de abandono y reanudación: DEC-039 fija la misma lectura lógica sin sobrescribir/perder historial. DEC-038 fija formato por lectura, no por libro, sin múltiples simultáneos. |
| OPEN-05 | Sistema visual concreto | Cerrar paleta HEX, tipografías, recursos gráficos, textos secundarios y especificaciones visuales verificables. |
| OPEN-06 | Algoritmo del árbol dinámico — parcialmente resuelto | DEC-034 fija todas las activas sin filtro anual; DEC-007 fija rama superior. Siguen pendientes geometría/distribución, casos extremos, navegación accesible y rendimiento. |
| OPEN-07 | Migración segura — sin objeto para datos | DEC-046: los datos de v1 eran de prueba, no hay migración de datos. Queda solo cómo y cuándo se aplica el esquema v2 al proyecto remoto (autorización expresa, comprobar antes que no haya nada que conservar). |
| OPEN-08 | Legado fuera del MVP — CERRADO por DEC-046 (sin datos que conservar; el texto siguiente es histórico) | DEC-036 fija archivo privado, sin exposición pública ni borrado, para los campos históricos fuera del MVP. DEC-045 fija `private.legacy_archive` (fila v1 completa en `jsonb`) y que `quiero_leer` queden solo en el archivo; falta el inventario real de datos. Siguen pendientes inventario/mapeo verificable (incluidos `would_recommend`, `would_reread`, `engagement` y demás campos históricos fuera del MVP), almacenamiento, formato, ubicación y controles, y destino de registros como «quiero_leer» cuando no esté determinado; no archivar todo v1 por inferencia. |
| TECH-01 | Organización técnica | Elegir límites de capa servidor/cliente, operaciones de dominio y arquitectura de autenticación; no asumir que el borrador de `ARCHITECTURE.md` ya está aprobado. |
| TECH-02 | Calidad y despliegue | Resolver versión de Node, pruebas, controles de acceso, rendimiento, responsive y recuperación ante errores. |

## 7. Inconsistencias y actualizaciones obligatorias

### Registro histórico del 18/10/2026

Los mandatos siguientes describen el estado inicial previo a la consolidación editorial del 19/10/2026 registrada en `docs/SYNC_REPORT.md`; se conservan para trazabilidad, no como afirmación de que esas instrucciones históricas sigan ausentes. Antes de implementar se exigió reconciliar los documentos previos con las decisiones iniciales:

1. **`docs/product/PRODUCT.md`**: actualizar OPEN-01 a OPEN-06 con las elecciones cerradas, manteniendo subdecisiones técnicas abiertas; incluir estado «Abandonado», medias estrellas, magic link, proveedores duales y la entrada a la librería.
2. **`docs/product/REQUIREMENTS.md`**: revisar cada RF/RNF y sus criterios de aceptación; cambiar calificación entera a incrementos de 0.5, incorporar abandonados, edición de formato, captura manual asistida y límites de eliminación. Añadir trazabilidad a DEC-001–DEC-032.
3. **`docs/design/DESIGN.md`**: reemplazar cualquier distribución de doce repisas fijas por árbol dinámico, mover «Actualmente leyendo» a rama superior, adoptar estilo minimalista, indicador circular, meses vacíos decorados y letrero «Book Diary».
4. **`docs/design/INTERACTIONS.md`**: documentar acercamiento a puerta, reorganización del árbol por año, panel lateral en escritorio, `bottom sheet` móvil y alternativas para movimiento reducido.
5. **`docs/architecture/DATA_MODEL.md`**: reflejar estados, media estrella, formatos fijos/editables, fechas parciales y borrado protegido; conservar el estatus de propuesta de esquema físico hasta validar backend.
6. **`docs/architecture/ARCHITECTURE.md`**: incorporar magic link, Open Library + Google Books, edición desde detalle y restricciones de APIs; mantener arquitectura y migración sujetas a validación.
7. **`docs/CURRENT_STATE.md`**: **no modificar su contenido histórico**. Es la auditoría de v1 a un commit concreto, no la especificación de v2.

### Estado vigente del 19/10/2026

La consolidación editorial inicial y la integración de DEC-033–DEC-037 se documentaron en `docs/SYNC_REPORT.md`. La aprobación posterior de DEC-038–DEC-041 agrega identidad/formato, retomada de la misma lectura, recuperación y ediciones opcionales, integradas en las seis especificaciones y la sincronización, preservando los pendientes de §6 y los bloques originales DEC-001–DEC-037. `docs/CURRENT_STATE.md` y el diagnóstico original de `docs/PHASE_0_REPORT.md` conservan su carácter histórico; este último distingue la actualización posterior del estado documental. Las reglas antes señaladas como abiertas en esos diagnósticos no reemplazan las nuevas decisiones aprobadas.

## 8. Condición de avance

### Registro histórico del 18/10/2026

Las 32 decisiones de producto y UX están aprobadas, pero **los documentos anteriores aún deben sincronizarse**. No ejecutar cambios de código, instalación, despliegue, SQL o migraciones basándose únicamente en este registro. Primero: actualizar specs, resolver bloqueos críticos de seguridad/datos, verificar consistencia entre documentos y aprobar un plan de implementación por fases.

### Estado vigente del 19/10/2026

Las **41 decisiones de producto y UX** están aprobadas; la aprobación integral de especificaciones, reglas técnicas restantes y cierre de toda Fase 0 siguen pendientes. El registro y sincronización de DEC-033–DEC-041 son trabajo documental, no implementación; no autorizan papelera ni eligen esquema físico, historial, recuperación o infraestructura. Ninguna decisión aprueba SQL, infraestructura, pruebas ejecutadas, migración o datos reales. Mantener las puertas de `docs/IMPLEMENTATION_PLAN.md`: **Fase 1 requiere autorización explícita**, además de decisiones/resguardos correspondientes a la tarea.
