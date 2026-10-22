# Book Diary v2 — Sistema de diseño y dirección de arte

> **Estado:** Borrador consolidado para revisión; no aprobado como especificación completa · **Fecha:** 19 de octubre de 2026 · **Idioma:** español
>
> **Ubicación:** `docs/design/DESIGN.md`
>
> **Fuentes:** `docs/DECISIONS.md`, `docs/product/PRODUCT.md`, `docs/product/REQUIREMENTS.md` y la referencia conceptual descrita en §11. **No constituye autorización para implementar ni cierre de Fase 0.**

## 1. Propósito y precedencia

Este documento define la intención visual y la estructura de la experiencia pública y administrativa de Book Diary v2. Es independiente del framework, motor gráfico, librería de componentes y agente de IA. Debe poder leerse sin acceso a conversaciones anteriores.

- Las decisiones aprobadas de `docs/DECISIONS.md` prevalecen sobre cualquier propuesta incompatible. Esta edición conserva DEC-001–037 e integra DEC-038–041 en el cuerpo, sin convertir detalles técnicos pendientes en aprobados.
- `docs/product/PRODUCT.md` define visión, alcance y reglas de producto.
- `docs/product/REQUIREMENTS.md` define capacidades y criterios verificables (en especial RF-003–006 y RF-020–022).
- Este documento define composición, lenguaje visual, componentes y comportamiento responsive.
- `docs/design/INTERACTIONS.md` especifica estados, secuencias, gestos y accesibilidad; conserva pendientes los parámetros sin aprobación.
- Los valores marcados **PROPUESTA** requieren aprobación antes de convertirse en tokens o parámetros definitivos.

Los términos **aprobado en concepto/estructura** identifican decisiones existentes, no la aprobación integral de este borrador. HEX, tipografías, medidas, recursos finales, algoritmo, duraciones y easing siguen como propuestas o pendientes. Si aparece una contradicción o una regla abierta, detener solo la parte afectada y registrar opciones para aprobación; no resolverla por inferencia. `docs/PHASE_0_REPORT.md` documenta los hallazgos previos y `docs/SYNC_REPORT.md` registra la consolidación.

## 2. Concepto creativo y decisiones aprobadas

**Un diario de lectura que se explora como un pequeño mundo ilustrado.** El visitante entra por una escena de cerezos en flor, descubre una librería acogedora y llega a un árbol-librero donde los libros cuentan la historia de cada año.

**Dirección conceptual candidata heredada:** estética **storybook contemporánea**, ilustración cálida, profundidad y texturas sutiles, combinadas con interfaz de uso diario moderna, limpia y fácil de leer. Es una referencia para evaluar en OPEN-05, no una aprobación de estilo, recursos o materiales definitivos. No propone un videojuego, una interfaz infantil ni una reproducción fotorrealista.

La **UI funcional es minimalista**, en **español** y solo **tema claro** (DEC-022/027/028). Las ilustraciones se concentran principalmente en el hero y pequeños acentos; el árbol conserva su protagonismo interactivo sin recargar navegación, formularios o paneles. Las animaciones tienen carácter mágico y discreto —pétalos ocasionales, ramas sutiles, respuesta al cursor— sin obstaculizar contenido y con equivalencia para `prefers-reduced-motion` (DEC-023/029). No se requiere selector de tema ni interruptor manual de animaciones.

### Principios

1. **Los libros son protagonistas:** ornamentos subordinados a títulos, lomos, navegación y lectura de información.
2. **Ilustración con función narrativa:** sakura, fachada y árbol aportan identidad, no obstaculizan acciones.
3. **Dos capas visuales:** escenas ilustradas expresivas; formularios, menús, botones y textos sobrios.
4. **Calidez sin saturación:** colores pastel y contraste suficiente para leer y navegar.
5. **Movimiento con propósito:** revelar, orientar y explicar cambios; nunca bloquear una tarea.
6. **Móvil por diseño:** adaptación deliberadamente sencilla, no una reducción literal del árbol.

## 3. Paleta y materiales

### 3.1 Familias cromáticas — referencia conceptual heredada

Los siguientes tonos se conservan como referencias candidatas del borrador previo; **no constituyen una paleta definitiva aprobada**. Su selección y validación permanecen pendientes OPEN-05; la consolidación no elige ni cambia colores.

- Marfil / crema: fondos principales, superficies luminosas.
- Rosa sakura empolvado: flores, detalles suaves y acentos ilustrados.
- Madera en tonos miel y moka: estantes, tronco, elementos de librería.
- Verde salvia: follaje y detalles secundarios.
- Azul grisáceo empolvado: fachada y contrastes ornamentales.
- Marrón oscuro / tinta cálida: texto y trazos de interfaz.

### 3.2 Tokens iniciales — PROPUESTA, no aprobados

Los siguientes valores son **puntos de partida para prototipos**, no equivalencias exactas extraídas del mockup. Deben revisarse visualmente y comprobar contraste antes de aprobarse.

| Token conceptual | Hex propuesto | Uso sugerido |
| --- | --- | --- |
| `color.background` | `#FAF6EF` | Fondo general |
| `color.surface` | `#FFFDF8` | Tarjetas, paneles y formularios |
| `color.text` | `#46382F` | Texto principal |
| `color.text-muted` | `#786A60` | Metadatos y ayuda |
| `color.sakura` | `#EAB9C5` | Ilustración y acentos suaves |
| `color.sakura-soft` | `#F7E5E9` | Fondos de etiquetas |
| `color.sage` | `#A9B9A1` | Vegetación y acentos |
| `color.dusty-blue` | `#A8B9C7` | Fachada y ornamentos |
| `color.wood` | `#B88B67` | Repisas y tronco |
| `color.wood-dark` | `#76513F` | Profundidad y vetas |
| `color.border` | `#E7DCD1` | Separadores y contornos discretos |
| `color.focus` | `#365B72` | Foco visible, sujeto a contraste |

**Reglas:** no usar rosa claro o salvia claro como color de texto pequeño sobre crema sin validar contraste. Las texturas no deben reducir la legibilidad. Los estados de error/éxito no deben depender exclusivamente del color.

## 4. Tipografía — PROPUESTA

Se propone una combinación de **serif editorial expresiva** para títulos y **sans serif neutra** para navegación, etiquetas, controles y lectura larga. Las familias concretas aún no están elegidas; las fuentes existentes de v1 (Newsreader y Work Sans) son candidatas a evaluar, no una decisión de v2.

- Título del hero: serif con carácter de cuento, grande y respirado.
- Encabezados de secciones y meses: serif o combinación editorial consistente.
- UI funcional, reseñas, metadatos y formularios: sans serif de alta legibilidad.
- Jerarquía basada en tamaño, peso, espacio y contraste, no solo en color.
- Evitar texto curvo, rotado o integrado en ilustraciones para información esencial.

Los tamaños exactos, escala tipográfica y fuentes finales quedan pendientes de validación visual.

## 5. Composición y recorrido de escritorio — APROBADO en estructura

### 5.1 Escena inicial: hero

- El hero inicial ocupa la **pantalla completa** y presenta **«Book Diary»** como título principal, enmarcado por ramas de sakura (DEC-017).
- Sensación de espacio, aire y profundidad ilustrada; el título debe leerse con claridad.
- Las ramas pertenecen a la escena, no a una capa que tape controles críticos.
- El hero no debe mostrar cifras, portadas o botones ficticios como datos reales.

### 5.2 Revelación de librería

- La **fachada de una librería ilustrada está detrás de las ramas** del hero.
- Con el scroll, las ramas se apartan como cortinas y permiten descubrirla.
- La escena es una **revelación dentro del recorrido**, no una sección de fachada desconectada.
- Letrero aprobado: **«Book Diary»** (DEC-032).
- La apertura progresa con el scroll y se revierte al desplazar en sentido contrario (DEC-017). Después de revelar la fachada se realiza una **aproximación visual hacia la puerta**, como entrada a la librería, antes de la biblioteca (DEC-018).
- `docs/design/INTERACTIONS.md` describe la secuencia y la equivalencia sin movimiento. Técnica 2D/3D, distancias, capas, duración y fallback concreto siguen pendientes; no imponer un recorrido cinematográfico con movimiento reducido (DEC-029).

### 5.3 Zona de biblioteca

La secuencia **hero → fachada → aproximación a puerta → biblioteca** está aprobada (DEC-017/018). Dentro de la biblioteca, la siguiente **organización es una propuesta de composición**, no una nueva decisión sobre su orden exacto; respeta los patrones aprobados de selector horizontal, meta circular con conteo y árbol dinámico:

1. Selector **horizontal** de años, con año activo claramente identificado (DEC-024).
2. Meta anual, si existe, con **indicador circular y conteo explícito** de completados frente al objetivo, por ejemplo «12 de 20 libros» (DEC-030). No depender solo de color o porcentaje.
3. Árbol-librero con repisas por mes.

La sección **«Actualmente leyendo»** se ubica en una **rama superior del árbol**, diferenciada de los doce meses. Las lecturas con año conocido y mes desconocido se muestran en **«Sin mes registrado»**, sin atribuirles un mes inventado.

**Actualmente leyendo muestra todas las lecturas activas, independientemente del año seleccionado** (DEC-034), manteniendo la rama superior aprobada por DEC-007. La finalización requiere **como mínimo el año**; mes y día son opcionales y no se inventan (DEC-033). Las finalizaciones conocidas solo por año permanecen en «Sin mes registrado».

La biblioteca incluye una sección llamada exactamente **«Abandonados»**, que conserva fechas y notas; la propietaria puede retomar **la misma lectura**, conservando su historial de abandono/reanudación sin sobrescribirlo (DEC-035/039). Esto no fija posición, filtros, estilo ni visibilidad pública de notas, ni el almacenamiento/presentación del historial.

Un libro agrupa las **ediciones de una misma obra**; la edición usada es **opcional por lectura** (DEC-041). También puede tener experiencias distintas en varios formatos, porque el formato pertenece a cada **lectura**, no al libro (DEC-038). Se mantiene un formato editable por lectura, sin varios simultáneos ni historial de formatos aprobado (DEC-002/016); cambiar formato no crea automáticamente otra lectura. Estructura técnica de ediciones, identificadores y conflictos siguen pendientes.

La navegación funcional debe mantenerse discreta. **«Agregar libro» aparece en navegación solo para la propietaria autenticada y autorizada**; **«Editar» se ofrece desde el panel de detalle** (DEC-025/026). La sesión usa enlace mágico por correo (DEC-009); identidad, sesión y permisos efectivos siguen pendientes OPEN-01. Ocultar controles no constituye autorización. No hay panel administrativo separado como requisito del MVP. Elementos del mockup como «Estadísticas» o «Sobre mí» **no están aprobados para el MVP** por el hecho de aparecer en la imagen.

## 6. Árbol-librero de escritorio — APROBADO en concepto

- Un árbol ilustrado con volumen moderado, sombras y texturas cálidas organiza repisas de lectura.
- Las repisas representan los **doce meses correctos, de enero a diciembre**. Cada mes debe identificarse por una etiqueta textual legible.
- La **estructura y distribución son dinámicas**: ramas y repisas se adaptan a la cantidad de libros de cada mes y se reorganizan suavemente al cambiar de año (DEC-006/019). No se exige geometría rígida ni doce repisas físicas fijas. Mantener identidad navegable y foco coherente no significa congelar la geometría.
- Cada libro se muestra **inicialmente por el lomo**. No sustituir esta decisión por una cuadrícula de portadas.
- Al seleccionar un libro, este sale visualmente de su posición y rota hasta mostrar la portada; la información aparece en un **panel lateral** legible y operable (DEC-020). El cierre revierte la interacción y recupera el estado navegable, con restauración apropiada del foco; el acceso sigue disponible sin animación.
- Si el catálogo proporciona solo imagen frontal, el lomo se representará mediante un tratamiento visual estilizado; **no se debe afirmar que existe una imagen real del lomo**.
- El aspecto del lomo debe permitir distinguir libros; no se exige reproducir fielmente el diseño editorial del canto físico.

**Pendiente OPEN-06:** algoritmo, distribución exacta de meses/rama superior, densidad, desbordamiento y repisas adicionales, navegación y límites de rendimiento junto con TECH-02. No fijar capacidades arbitrarias ni ocultar o solapar libros por razones decorativas. Los doce meses, incluidos los vacíos con **repisa y pequeño elemento decorativo**, deben permanecer identificables (DEC-031).

## 7. Experiencia móvil — APROBADO en concepto

- Sustituir el árbol complejo por un **librero vertical sencillo**.
- Una repisa por mes, con etiqueta clara; los libros siguen mostrándose por el lomo.
- Cada repisa permite desplazamiento horizontal cuando su contenido supera el ancho disponible.
- Seleccionar un libro abre sus detalles en un **panel inferior (`bottom sheet`)**, sin exigir rotación 3D, WebGL, hover o gesto de precisión (DEC-021). Al cerrar, restaurar un foco apropiado; la mecánica accesible concreta sigue pendiente.
- Sakura como detalle ornamental discreto; controles, títulos y navegación tienen prioridad.
- Año, meta, todas las lecturas activas independientes del año, sección **«Abandonados»** y agrupación por mes siguen disponibles. No se asigna aquí una posición ni filtro nuevo a abandonados.
- «Sin mes registrado» debe poder explorarse también en móvil cuando aplique.

**Pendiente OPEN-05/06 y TECH-02:** umbrales responsive, controles accesibles de desplazamiento, densidad, dimensiones y comportamiento accesible concreto del bottom sheet. Su patrón inferior ya está aprobado, no se reabre como una superficie libre.

## 8. Componentes y superficies

| Componente | Responsabilidad visual | Estado |
| --- | --- | --- |
| Hero ilustrado | Pantalla completa, título «Book Diary» y sakura reversible por scroll | Concepto aprobado; parámetros pendientes |
| Fachada/entrada ilustrada | Letrero «Book Diary», revelación y aproximación a puerta | Secuencia aprobada; técnica pendiente |
| Navegación | Acceso a secciones aprobadas y acciones autorizadas | Estructura exacta pendiente |
| Selector de año | Patrón horizontal, año activo identificable | Patrón aprobado; estilo pendiente |
| Tarjeta de meta | Indicador circular/conteo; sin meta, texto «Sin meta establecida» y posibilidad de crearla para la propietaria | Patrones/texto aprobados; límites/exceso/diseño de acción pendientes |
| Árbol y repisas | Distribución dinámica, doce meses, rama superior de activos | Concepto aprobado; algoritmo pendiente |
| Abandonados | Retomar la misma lectura y conservar fechas/notas e historial de abandono/reanudación | Regla aprobada; posición/filtros/estilo, visibilidad de notas y almacenamiento/presentación del historial pendientes |
| Lecturas eliminadas | Conservar posibilidad de recuperación, sin destruir historia | Recuperabilidad aprobada; interfaz, controles, plazos, visibilidad/conteos y solución física pendientes; no se aprueba una papelera |
| Lomo de libro | Identificar y seleccionar un libro | Concepto aprobado; tratamiento pendiente |
| Vista de detalle | Portada/metadatos/lectura; panel lateral desktop, bottom sheet móvil | Patrones aprobados; dimensiones/foco pendientes |
| Librero móvil | Repisas verticales con desplazamiento horizontal | Concepto aprobado |
| Formularios administrativos | Alta, corrección, lecturas y metas | Funciones aprobadas; diseño pendiente |
| Estados vacíos/error/carga | Explicar claramente cada estado sin inventar datos | Necesarios; diseño pendiente |

Las vistas administrativas deben utilizar superficies claras y controles convencionales, no intentar convertir cada formulario en una ilustración.

## 9. Estados de contenido y datos

- **Año sin lecturas:** mantener navegación y una explicación amable; no crear lomos de muestra como si fueran registros.
- **Mes vacío:** conservar etiqueta, repisa vacía y pequeño elemento decorativo; no inventar libros (DEC-031). Recurso gráfico concreto pendiente OPEN-05.
- **Año sin meta:** mostrar exactamente **«Sin meta establecida»**; la propietaria puede crear una meta (DEC-037). Distinguir ausencia de error de carga, sin objetivo ficticio ni copiar una meta de otro año. La presentación/acción concreta y límites siguen pendientes.
- **Actualmente leyendo:** rama superior diferenciada de los meses; muestra **todas** las lecturas activas, sin depender del año seleccionado (DEC-007/034).
- **Abandonados:** retomar conserva **la misma lectura** y su historial de abandono/reanudación, sin sobrescribir fechas/notas ni historia (DEC-035/039). No suma como completado mientras está abandonado (DEC-014). Posición/filtros/estilo, publicación de notas, transiciones adicionales, evaluación al abandonar y almacenamiento/presentación del historial siguen pendientes; identidad de la lectura al retomar ya no es una alternativa abierta.
- **Relecturas, formatos y ediciones:** varias experiencias de un mismo libro mantienen identidad propia; pueden tener formatos distintos y edición usada opcional por lectura. Las ediciones de la obra permanecen agrupadas bajo un libro (DEC-038/041). No confundir relectura con reanudación de la misma lectura ni fijar representación de edición/ISBN o formularios sin decisión.
- **Lecturas eliminadas:** deben poder recuperarse mediante borrado lógico o equivalente (DEC-040). No se admite pérdida irreversible como alternativa. Interfaz/controles, plazos, almacenamiento, visibilidad, filtros/conteos y comportamiento de restauración siguen pendientes; no se elige un botón, pantalla o sección «Papelera». DEC-008 sigue bloqueando libros con lecturas: no asumir que una lectura recuperable deja de estar asociada al libro.
- **Portada ausente:** alternativa legible con título/autor, sin imagen rota.
- **Metadatos extensos:** títulos largos, múltiples autores y reseñas no deben desbordar la interfaz.
- **Carga/error:** mensajes claros y acciones de recuperación cuando correspondan.

Los campos históricos v1 **fuera del MVP** se conservan en un **archivo privado**, sin exponerlos públicamente ni eliminarlos (DEC-013 y DEC-036). Formato, ubicación, almacenamiento, mapeo y controles efectivos siguen pendientes OPEN-08/07/01; no se propone una pantalla pública ni se implementa el archivo en esta especificación. Esta regla del legado no decide la visibilidad de notas de «Abandonados». Unicidad, rango del objetivo y saturación del círculo de metas siguen pendientes, sin reabrir el texto aprobado para ausencia de meta.

## 10. Accesibilidad y rendimiento — REQUISITOS

- Navegación completa mediante teclado, foco visible y nombres accesibles para libros, meses y controles.
- El detalle debe poder abrirse y cerrarse sin animación; restaurar el foco a su origen cuando corresponda.
- Respetar la preferencia de **movimiento reducido** con una experiencia equivalente y sin transiciones obligatorias.
- No depender del hover, de WebGL o de animaciones para acceder a contenido.
- Garantizar contraste legible entre texto y fondos; validar en prototipos y en la implementación.
- Proveer textos alternativos para portadas informativas; tratar adornos de sakura y texturas como decorativos.
- Evitar saltos de contenido durante carga y cambio de año; mantener funcionalidad en dispositivos modestos.
- No seleccionar Three.js u otra tecnología gráfica solo por su presencia en v1; la decisión depende de arquitectura, pruebas y fallback.

## 11. Referencias visuales y fidelidad

La dirección de arte se inspiró en un moodboard de librerías ilustradas, sakura, estantes de madera y colores pastel, y en un mockup conceptual de escritorio y móvil aceptado durante la fase de diseño.

**Importante:** las imágenes de referencia no están incluidas en este documento. Al incorporarlas al repositorio, guardar archivos con nombres descriptivos bajo `docs/design/references/` y documentar su origen y propósito. No asumir que un agente tendrá acceso a imágenes presentes solo en una conversación.

El mockup no constituye una maqueta pixel-perfect ni fuente de datos: contiene etiquetas mensuales incorrectas o repetidas, cifras de ejemplo y elementos de navegación no aprobados. Deben prevalecer los requisitos escritos y los datos reales.

## 12. Decisiones abiertas y próximas validaciones

| ID | Decisión pendiente | Impacto |
| --- | --- | --- |
| OPEN-05 | HEX, fuentes, recursos/derechos, tamaños, textos secundarios, lomos/placeholder y detalles de paneles | Identidad visual; español, tema claro y letrero ya aprobados |
| OPEN-06 | Algoritmo dinámico, ubicación geométrica de meses/rama superior, overflow y navegación accesible | Árbol escalable; rama superior y todas las activas independientes del año ya aprobadas |
| TECH-02 | Breakpoints, rendimiento, parámetros de movimiento y fallback concreto; foco/interrupciones junto a `docs/design/INTERACTIONS.md` | Calidad y responsive; no aprueba técnicas gráficas |
| OPEN-01 / TECH-01 | Identidad autorizada, sesión magic link y permisos de operaciones | Formularios/controles protegidos; ocultamiento no basta |
| OPEN-03 / TECH-01 / TECH-02 | Deduplicación/conflictos de obra-edición, estructura de edición opcional por lectura e identificadores; confirmaciones y solución de recuperación, interfaz/plazos/filtros/conteos/restauración | Libro agrupa ediciones de una obra, formato por lectura y recuperabilidad de lecturas aprobados; no suponer cero asociaciones por eliminación recuperable |
| OPEN-04 / TECH-01 | Inicio desconocido, coherencia de fechas, transiciones adicionales, «Otro», evaluación de abandono y almacenamiento/presentación del historial | Mínimo año, «Abandonados» y retomada de la misma lectura sin sobrescribir historia ya aprobados; posición/filtros/estilo y privacidad de notas pendientes |
| OPEN-08 / OPEN-07 / OPEN-01 | Formato, ubicación/almacenamiento, mapeo y permisos del archivo privado del legado | Privacidad y conservación aprobadas; implementación y verificación no realizadas |

Estos son IDs canónicos de `docs/DECISIONS.md`, no nuevas decisiones aprobadas. No convertir propuestas en parámetros de implementación sin validación explícita; las dependencias se aplican solo a la actividad afectada.

## 13. Criterio de aprobación

El documento puede marcarse **Aprobado** cuando la propietaria valide el lenguaje visual, los tokens o criterios cromáticos definitivos, la composición y los puntos abiertos que bloqueen el diseño. La aprobación de `DESIGN.md` no aprueba automáticamente animaciones detalladas, arquitectura, cambios de datos o desarrollo.

La edición documental del 19/10/2026 integra las reglas visuales/de dominio pertinentes hasta DEC-041, sin superponer versiones. Conserva las propuestas y los pendientes técnicos restantes. No acredita implementación, validación visual, cierre integral de Fase 0 ni autorización de Fase 1.
