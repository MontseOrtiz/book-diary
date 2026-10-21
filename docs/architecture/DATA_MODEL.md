# Book Diary v2 — Modelo de datos

**Ruta:** `docs/architecture/DATA_MODEL.md`  
**Estado:** EDICIÓN CONSOLIDADA PARA REVISIÓN — modelo lógico candidato, no esquema físico aprobado; no autoriza migraciones ni cierra Fase 0  
**Fecha de edición:** 19 de octubre de 2026  
**Idioma:** español · **Formato:** Markdown portable · **Alcance:** MVP

## 1. Propósito y fuentes de verdad

Definir las entidades, relaciones, invariantes y estrategia preliminar de transición de Book Diary v1 a v2. Este documento es **una propuesta lógica**, no un esquema SQL verificado ni una instrucción para alterar Supabase.

Documentos relacionados:
- `docs/CURRENT_STATE.md`: evidencia del repositorio v1, auditado estáticamente en el commit `b1d32f80a48e8bad2cc9b6a790a997afc265cd32`.
- `docs/product/PRODUCT.md`: visión y reglas de negocio (BR-01 a BR-10).
- `docs/product/REQUIREMENTS.md`: requisitos verificables (RF-001 a RF-022, RNF-001 a RNF-006).
- `docs/design/DESIGN.md` y `docs/design/INTERACTIONS.md`: presentación e interacción, no persistencia.
- `docs/DECISIONS.md`: fuente canónica de DEC-001–DEC-041 aprobadas y de las subdecisiones OPEN-01–08 / TECH-01–02 todavía pendientes.
- `docs/PHASE_0_REPORT.md`: diagnóstico histórico del 18/10/2026; sus hallazgos H-01–08 motivaron la consolidación. DEC-033–037 resuelven partes de A-01–05 sin reescribir ese informe ni cerrar los pendientes técnicos restantes.
- `docs/SYNC_REPORT.md`: alcance de la consolidación editorial.

**Regla de precedencia:** decisiones aprobadas de `docs/DECISIONS.md` > especificaciones coherentes con ellas > propuestas técnicas; la auditoría describe únicamente el legado. Las reglas de producto ya aprobadas se integran en el cuerpo de este documento; tablas, nombres de columnas, tipos y restricciones físicas siguen siendo candidatos. Si un detalle sigue abierto, no debe asumirse aprobado por aparecer aquí. Ningún metadato local certifica el esquema ni los permisos remotos.

## 2. Conceptos confirmados

| Concepto | Regla confirmada | Referencias |
| --- | --- | --- |
| Libro | Un único libro agrupa las ediciones de una obra y admite varias experiencias de lectura; si existe, ofrecer relectura o corrección, sin duplicarlo por edición o formato. | DEC-001/038/041; BR-02, RF-010, RF-016 |
| Lectura | Evento independiente con estado, fechas, formato y evaluación propios. | RF-012–RF-017 |
| Relectura | Otra lectura del mismo libro; no sobrescribe la anterior. | BR-05, RF-016 |
| Meta anual | Objetivo por año; su edición o eliminación no afecta lecturas. Si no existe, mostrar «Sin meta establecida» y permitir crearla a la propietaria. | DEC-037; BR-09, RF-018 |
| Finalización | Organiza la biblioteca por año/mes y determina el avance anual. | BR-03, BR-04, RF-004, RF-019 |
| Acceso | Biblioteca consultable públicamente; solo la identidad autorizada escribe, mediante enlace mágico por correo. Sesión y RLS pendientes. | DEC-009; BR-01, RF-001, RF-002 |
| Estados | Leyendo, Terminado y Abandonado; abandonados no cuentan como completados y se conservan en «Abandonados». Retomar conserva la **misma lectura lógica** y su historial de abandono/reanudación sin sobrescribirlo ni perderlo; persistencia y transiciones restantes pendientes. | DEC-014/035/039, OPEN-04 |
| Formato | Pertenece a cada lectura, **no al libro**: un valor de Físico, Kindle, iPad, Audiolibro u Otro, editable. Un libro admite lecturas en distintos formatos, no múltiples simultáneos por lectura ni historial de formatos aprobado. | DEC-002/016/038 |
| Edición utilizada | Cada lectura puede registrar opcionalmente la edición usada, bajo el mismo libro por obra; es distinta del formato. Representación y reparto de metadatos pendientes, sin exigir ISBN. | DEC-041, OPEN-03 |
| Eliminación de lecturas | Debe ser recuperable mediante borrado lógico o equivalente; estrategia, consultas, conteos, restauración y vínculo con bloqueo de borrado del libro pendientes. No exige interfaz de papelera. | DEC-040/008, OPEN-03/TECH-01 |
| Cierre de lectura | Formulario minimalista: fecha con **al menos año**, mes/día opcionales sin inventarlos; calificación opcional 0.5–5 en pasos de 0.5 y opinión opcional. | DEC-003/004/005/033 |
| Lecturas activas | La rama superior muestra **todas** las activas, independientemente del año seleccionado. | DEC-007/034 |
| Preservación | Conservar todos los registros de v1. Los campos históricos fuera del MVP se conservan en **archivo privado**, sin exposición pública ni borrado; mecanismo/mapeo/verificación pendientes. No archivar todo v1 por inferencia. | DEC-013/036, OPEN-07/08 |

El MVP **no** incluye lista de pendientes, seguimiento de páginas/porcentaje, estadísticas avanzadas, funciones sociales ni recomendaciones IA.

## 3. Modelo lógico propuesto (no aprobado)

```text
BOOKS (1) ─────────── (0..N) READINGS
                              │
                              └─ cada lectura conserva su propia experiencia

READING_GOALS: una meta lógica por año [unicidad por definir]
OWNER/IDENTITY: mecanismo de autorización pendiente [OPEN-01]
```

No se propone una tabla separada `rereads`: una relectura es otra instancia de lectura asociada al mismo libro. **Retomar una abandonada conserva la misma identidad lógica de lectura**, sin crear otra lectura/relectura lógica y sin perder ni sobrescribir historial de abandono/reanudación (DEC-039). Esto no exige una única fila física: persistencia, campos, orden temporal y fechas siguen pendientes. El diagrama tampoco impone una tabla de ediciones, una estructura de eventos ni campos de borrado lógico.

### 3.1 `books` — identidad bibliográfica

| Campo lógico | Tipo conceptual | Requerimiento / estado |
| --- | --- | --- |
| `id` | Identificador estable | **Propuesta:** clave primaria interna, no ID de proveedor. |
| `title` | Texto | **Confirmado:** necesario para identificar el libro; validación concreta pendiente. |
| `authors` | Autoría | **Confirmado:** capturable/recuperable cuando exista; **propuesta:** representación estructurada o lista. |
| `cover_url` | URL opcional | **Confirmado:** portada cuando esté disponible; su atribución a obra/edición y eventual representación del libro siguen pendientes. No copiar una portada de edición a la obra por inferencia. |
| `synopsis` | Texto opcional | **Confirmado:** metadato recuperable y corregible. |
| `genres` | Colección opcional | **Confirmado:** géneros si están disponibles; taxonomía pendiente. |
| `series_name`, `series_position` | Texto / orden opcionales | **Confirmado:** serie y orden cuando estén disponibles; tipos exactos pendientes. |
| `external_references` | Identificadores externos opcionales | **Propuesta:** proveedor + identificador con nivel obra/edición verificable; no asumir que toda referencia es de obra ni exigir ISBN. |
| `created_at`, `updated_at` | Instantes técnicos | **Propuesta:** auditoría de cambios; no representan fechas de lectura. |

**Aprobado DEC-041:** las distintas ediciones de una obra se agrupan bajo **un único libro**; una lectura puede registrar la edición utilizada, opcionalmente y separada de su formato (DEC-038). No reabrir obra frente a edición como elección de producto.

**Por decidir (OPEN-03):** representación de las ediciones y su vínculo opcional con lecturas; qué metadatos son propios de obra o edición; normalización, procedencia, identificación y deduplicación; confirmaciones y mecanismo recuperable de eliminación. No imponer tabla `editions`, ISBN u otro metadato obligatorio. No propagar metadatos específicos de una edición al libro/obra por inferencia. **Ya aprobado (DEC-008):** bloquear borrado del libro con lecturas asociadas, sin cascada implícita; la relación con lecturas eliminadas recuperables necesita política compatible, no una desvinculación supuesta. La existencia de portada no implica imagen real de lomo.

Los metadatos de búsqueda proceden de **Open Library + Google Books**; la prioridad, mezcla, procedencia exacta y discrepancias requieren OPEN-02 coordinado con OPEN-03. Foto/IA y alta manual asistida proponen datos en un formulario editable y exigen confirmación; un fallo de IA no impide el registro manual (DEC-010/011/012). No se aprueba aquí un SDK, proveedor/modelo de IA ni columnas físicas nuevas.

### 3.2 `readings` — instancia de lectura

| Campo lógico | Tipo conceptual | Requerimiento / estado |
| --- | --- | --- |
| `id` | Identificador estable | **Propuesta:** clave física; la identidad lógica de lectura debe mantenerse al retomar, sin imponer una sola fila (DEC-039). |
| `book_id` | Referencia a `books.id` | **Confirmado:** una lectura pertenece a un libro. |
| `status` | Códigos candidatos `reading` / `finished` / `abandoned` | **Aprobado:** tres estados, sección «Abandonados» y retomada de la **misma lectura lógica** con historial conservado (DEC-014/035/039). Códigos físicos, persistencia y transiciones restantes pendientes. |
| `started_on` | Fecha de inicio, representación por definir | **Aprobado:** registrar libro, fecha de inicio y formato al comenzar (DEC-015). Obligatoriedad, precisión y tratamiento de desconocidos pendientes; no fabricar fecha. |
| `finished_year` | Año de finalización; representación física candidata | **Aprobado DEC-033:** mínimo año al finalizar; mes/día opcionales. Puede no existir en otros estados o en legado: tratamiento/mapeo de v1 sin año pendiente, sin inventarlo ni descartarlo. |
| `finished_month` | Mes opcional, 1–12 | **Propuesta:** `null` cuando solo se conoce el año. |
| `finished_day` | Día opcional | **Propuesta:** `null` cuando solo se conoce mes/año o año. |
| `format` | Valor de lista fija; representación física pendiente | **Aprobado:** Físico, Kindle, iPad, Audiolibro, Otro; un formato editable por lectura, no por libro, sin múltiples simultáneos (DEC-002/016/038). Valor vacío y «Otro» pendientes. |
| Edición utilizada (concepto, no columna aprobada) | Referencia/datos opcionales; estructura pendiente | **Aprobado DEC-041:** puede registrarse por lectura bajo el único libro de la obra; no es formato ni exige ISBN/tabla específica. |
| Historial de abandono/reanudación (concepto) | Representación pendiente | **Aprobado DEC-039:** conservarlo sin pérdida/sobrescritura y con la misma lectura lógica; no impone tabla de eventos, filas, campos o timestamps. |
| Eliminación recuperable (concepto) | Mecanismo pendiente | **Aprobado DEC-040:** eliminación recuperable, distinta de los tres estados funcionales; no impone columna `deleted_at`, purga ni papelera. |
| `rating` | Número nullable; valores 0.5, 1.0, 1.5, …, 5.0 | **Aprobado:** opcional y por lectura; pasos de 0.5 (DEC-003). Ausencia `null`, no cero. Tipo SQL pendiente, no entero de estrellas completas. |
| `review` | Texto opcional | **Confirmado:** opinión independiente por lectura. |
| `created_at`, `updated_at` | Instantes técnicos | **Propuesta:** auditoría; nunca sustituyen fechas bibliográficas. |

**Decisión de modelado propuesta:** representar la precisión de finalización con `finished_year`, `finished_month`, `finished_day` (o un tipo equivalente con precisión explícita). **No** rellenar valores desconocidos con `01`, fechas UTC o fechas actuales. La elección física definitiva puede ser otra si preserva exactamente esa semántica.

**Reglas de producto y restricciones candidatas (sin aprobación física):**
- **Propuesta OPEN-04:** `finished_day` solo puede existir si existen `finished_month` y `finished_year`; `finished_month` requiere `finished_year`.
- **Propuesta OPEN-04:** las combinaciones completas deben formar una fecha válida (incluidos años bisiestos).
- **Regla aprobada DEC-033:** rechazar una nueva finalización sin año; admitir solo año o año/mes sin inventar los componentes faltantes. Esta validación no autoriza rechazar, borrar ni completar artificialmente registros legados v1 sin año: preservación y mapeo seguro pendientes OPEN-07/08.
- **Regla de producto:** una lectura `reading` no se contabiliza como completada ni aparece en repisas mensuales de finalización.
- **Reglas aprobadas DEC-014/035/039:** una abandonada no cuenta como completada; conservarla en «Abandonados» con fechas/notas. Al retomar, mantener la misma lectura lógica y todo su historial de abandono/reanudación sin pérdida/sobrescritura. Persistencia, orden/fechas, transiciones adicionales y calificación al abandonar siguen pendientes OPEN-04/TECH-01; no crear una relectura lógica por esa retomada.
- **Reglas aprobadas DEC-038/041:** distintas experiencias pueden compartir libro y tener formatos distintos; edición utilizada opcional por lectura y distinta de formato. No duplicar libro por esos datos ni imponerlos como metadatos obligatorios de obra.
- **Regla aprobada DEC-040:** una lectura eliminada es recuperable, no una eliminación irreversible. El mecanismo físico, las políticas de consulta/conteo/restauración y el vínculo con DEC-008 siguen pendientes; no equiparar recuperabilidad con ausencia de asociación al libro.
- **Regla aprobada DEC-034:** mostrar todas las lecturas activas en la rama superior sin filtrarlas por el año seleccionado.
- **Regla de producto:** cambiar `rating`, `review`, fechas o `format` de una lectura no altera otra lectura del mismo libro.
- **Consecuencia del modelo candidato:** no imponer unicidad de `book_id` en `readings`, porque bloquearía las relecturas aprobadas por DEC-001.

### 3.3 `reading_goals` — meta anual

| Campo lógico | Tipo conceptual | Requerimiento / estado |
| --- | --- | --- |
| `id` | Identificador estable | **Propuesta:** clave primaria. |
| `year` | Año calendario | **Confirmado:** meta para cualquier año. |
| `target_count` | Entero positivo | **Propuesta:** conservar validación positiva de v1; límites exactos por aprobar. |
| `created_at`, `updated_at` | Instantes técnicos | **Propuesta:** auditoría. |
| `owner_id` | Identificador de propietario | **Condicional:** depende del ámbito de propiedad/autorización por definir (OPEN-01), no de reabrir magic link ya elegido. |

**Unicidad por definir:** en un producto de una sola propietaria, se propone una meta por año; si se adopta un esquema con identidades, la restricción candidata es `(owner_id, year)`. No asumir que esa restricción existe en Supabase v1. Límites del objetivo y representación del exceso requieren decisión; el indicador circular y conteo están aprobados (DEC-030). **Ausencia de meta aprobada DEC-037:** mostrar exactamente «Sin meta establecida» y permitir que la propietaria cree una meta; no inventar objetivo ni confundir ausencia con error. Los pendientes de unicidad/límites/exceso se mantienen como asunto adicional relacionado con TECH-01/02 (A-05 de `docs/PHASE_0_REPORT.md`), sin ampliar OPEN-04.

## 4. Consultas derivadas y reglas de cómputo

**Política pendiente de eliminación recuperable (DEC-040, OPEN-03/TECH-01):** todas las proyecciones siguientes deben especificar inclusión/visibilidad de lecturas eliminadas recuperables y sus efectos en conteos/metas/restauración. No se agrega aquí un filtro físico, no se asume exclusión o inclusión y no se convierte la fórmula por año/estado en política definitiva. La regla de todas las activas sin filtro anual se mantiene; la condición de eliminación necesita resolución propia.

**Biblioteca anual candidata:** incluir lecturas terminadas con `finished_year = año_seleccionado`; agrupar por `finished_month`. Mes desconocido (`null`) va a **«Sin mes registrado»**. La fecha de inicio no determina agrupación. Las nuevas finalizaciones exigen año (DEC-033); los registros v1 sin año deben preservarse sin inventarlo ni descartarlos y requieren mapeo/presentación segura por resolver en OPEN-07/08, no una excepción implícita a la validación nueva.

**Actualmente leyendo:** rama superior diferenciada de los meses de finalización (DEC-007) que muestra **todas las lecturas activas, independientemente del año seleccionado** (DEC-034). La consulta candidata por estado `reading` no debe aplicar filtro del año seleccionado; algoritmo, layout, accesibilidad y rendimiento siguen pendientes OPEN-06/TECH-02.

**Abandonados:** conserva lecturas, fechas y notas, sin contarlas como completadas; la propietaria puede retomar **la misma lectura lógica**, manteniendo historial de abandono/reanudación (DEC-035/039). La proyección candidata por estado `abandoned` no fija filtro temporal, geometría ni tratamiento de eliminadas recuperables. Persistencia/orden/fechas del historial pendientes OPEN-04/TECH-01; no elegir filas/eventos ni publicar notas por inferencia (OPEN-01).

**Avance de meta:** `completed_count(year) = número de lecturas terminadas con finished_year = year`. Cada `reading.id` cuenta una vez, incluso cuando comparte `book_id` con otra lectura; las abandonadas no suman. Si se supera `target_count`, el conteo real no se trunca. El progreso es **derivado**, no una cifra manual que pueda desincronizarse. La UI presenta indicador circular y conteo explícito (DEC-030); límites y visualización del exceso no se deciden aquí.

**Consulta sin meta:** devolver ausencia como estado distinto de error para mostrar «Sin meta establecida» y habilitar creación solo a la propietaria autorizada (DEC-037). No convertir ausencia en objetivo cero ni resolver por ello unicidad/rango.

**Identidad al consultar:** el detalle corresponde a una lectura y puede mostrar su edición registrada opcionalmente y su formato; la edición no crea otro libro ni es un formato. La retomada no genera otra lectura lógica ni un conteo adicional por sí misma. La recuperación de una lectura eliminada no debe duplicar su identidad o historial; efectos concretos sobre conteos/metas y conflictos requieren política aprobada.

**Ejemplos obligatorios:**

| Caso | Resultado esperado |
| --- | --- |
| Inicio diciembre 2025, finalización enero 2026 | Cuenta y se muestra en enero 2026. |
| Finalización `2024` sin mes | Aparece en «Sin mes registrado» de 2024. |
| Finalización `2024-07` sin día | Aparece en julio 2024, sin inventar día. |
| Dos lecturas del mismo libro terminadas en 2026 | Cuentan dos en 2026. |
| Lectura en curso | No suma a ningún año. |
| Lectura abandonada y luego retomada | Conserva la misma identidad lógica, fechas/notas e historial de abandono/reanudación sin pérdida; no se crea otra relectura lógica. Persistencia y fechas concretas pendientes. |
| Dos experiencias de la misma obra, una Kindle y otra Físico | Un único libro y dos lecturas con su propio formato; ninguna exige múltiples formatos simultáneos. |
| Dos ediciones conocidas de la misma obra | Un único libro; cada lectura puede registrar su edición, también puede omitirla. No copiar metadatos editoriales a la obra por inferencia. |
| Eliminar y recuperar una lectura terminada | Debe poder recuperarse sin pérdida; visibilidad, conteos/metas, repetición/conflictos y asociación al libro requieren política aprobada antes de definir el resultado exacto. |
| Eliminar la meta de 2025 | No elimina ni modifica lecturas. |
| Calificación ausente | La lectura puede terminar sin estrellas. |
| Nueva finalización completamente desconocida, sin año | Se rechaza hasta proporcionar al menos año (DEC-033), sin fabricarlo. |
| Registro v1 con finalización sin año | Se conserva sin inventar componentes ni descartarlo; mapeo seguro pendiente OPEN-07/08. |
| Cambio de año con lecturas en curso | La rama superior sigue mostrando todas las activas, sin filtro del año seleccionado (DEC-034). |
| Campos históricos v1 fuera del MVP | Se conservan en archivo privado, sin exponerlos ni borrarlos (DEC-036); no archivar por ello todos los registros v1. |
| Año sin meta | Mostrar exactamente «Sin meta establecida»; la propietaria puede crearla (DEC-037). |

**Propuesta sobre zonas horarias, no política aprobada:** tratar las fechas bibliográficas como fechas de calendario y los timestamps técnicos como instantes permite evitar desplazamientos de día/mes/año. La representación física, zona y validaciones exactas siguen pendientes de OPEN-04/07. En cualquier alternativa se debe preservar la precisión conocida sin inventar componentes (DEC-005).

## 5. Acceso, integridad y borrado

- Lectura pública: solo datos cuyo inventario de publicación se apruebe (OPEN-01). Los campos históricos v1 fuera del MVP deben quedar en **archivo privado**, sin exposición pública ni borrado (DEC-036); esto no significa archivar todo v1. Tampoco se aprueba por inferencia publicar las notas conservadas en «Abandonados». No exponer claves, tokens ni detalles de infraestructura.
- Escritura: únicamente la propietaria, con autorización **efectiva en backend**; ocultar botones no constituye protección.
- **DEC-009 / OPEN-01:** magic link por correo ya elegido; definir identidad expresamente autorizada, sesión y políticas RLS y/o autorización de servidor. No definir políticas SQL definitivas antes de verificar el esquema remoto. Una sesión autenticada ajena no equivale a propietaria autorizada.
- **DEC-008/040 / OPEN-03:** rechazar borrado de `books` con lecturas asociadas, sin cascada implícita. La eliminación de lecturas debe ser recuperable; no asumir que elimina su asociación ni que habilita borrar el libro. Resolver esa interacción antes de ejecutar la tarea afectada; confirmar no habilita excepciones. No imponer eliminación irreversible para resolver el bloqueo.
- **Recuperación pendiente:** definir permisos efectivos para eliminar/restaurar, repetición/idempotencia, conflictos de restauración, integridad de referencias, consultas y efectos en metas. No se aprueban papelera, plazos, purga ni restauraciones automáticas. Recuperar lecturas no es el archivo privado de campos históricos v1 de DEC-036, y un respaldo genérico por sí solo no demuestra recuperabilidad de una lectura.
- La captura fotográfica no se almacena como parte de `books`/`readings` en la propuesta MVP: se extraen datos para revisión. Cualquier retención de imágenes requiere decisión separada (OPEN-02).

**Alternativas físicas candidatas para DEC-040, sin adoptar ninguna:**

| Alternativa | Implicaciones que deben diseñarse/verificarse |
| --- | --- |
| Marca lógica de eliminación | Mantiene datos/referencias, pero exige filtros coherentes, índices, permisos de acceso/restauración, manejo de repeticiones y conflictos; definir cómo afecta unicidad, consultas y conteos sin romper DEC-008. No se elige nombre/tipo de campo. |
| Archivo recuperable equivalente | Debe capturar y restaurar íntegramente lectura, identidad, historial y referencias; agrega complejidad de consistencia, versiones, permisos y conflictos entre representación activa/recuperable. No equivale al archivo privado DEC-036 ni decide formato/ubicación. |

Ambas requieren garantías observables de recuperación y política de referencias/conteos aprobada; no se eligen tablas, campos, plazos, purga o UI. El modelo lógico candidato no puede dar por resuelta esa política.

## 6. Diferencias verificadas respecto de v1

La auditoría estática de `CURRENT_STATE.md` identifica dos tablas tipadas, `books` y `reading_goals`, pero **no valida el esquema SQL remoto**. En v1, `books` mezcla metadatos y estado de una única lectura: `title`, `author`, `cover_image_url`, `open_library_id`, `status`, `start_date`, `finish_date`, `last_updated_at`, `rating`, `would_recommend`, `would_reread`, `engagement`, `notes`, además de identificadores y timestamps. `reading_goals` contiene `id`, `year`, `target_count`, `created_at`. No se identificaron migraciones SQL, RLS versionada ni autenticación propia en el repositorio.

**Consecuencias:**
- `would_reread` es una **intención**, no evidencia de una relectura ocurrida.
- `last_updated_at` es una marca de actividad, no historial de progreso.
- Las fechas de v1 pueden requerir interpretación cuidadosa por mezcla de UTC y fecha local.
- El campo `notes` y las evaluaciones antiguas **no deben descartarse silenciosamente**, aunque v2 simplifique la UI. El mapeo identificará qué contenido pertenece al MVP y qué campos históricos quedan fuera; estos últimos irán a **archivo privado**, no público (DEC-036).
- El estado legado `quiero_leer` está fuera del MVP v2; todas sus filas deben conservarse (DEC-013). Su mapeo seguro y la identificación de los campos sujetos al archivo privado necesitan inventario y verificación (OPEN-07/08), sin convertirlas en lecturas terminadas ni archivar todo v1 por defecto.

## 7. Estrategia de migración — borrador, NO EJECUTAR

1. **Inspección autorizada:** obtener esquema real, tipos, constraints, defaults, índices, triggers, RLS, permisos, cantidad y calidad de datos. Compararlo con `types/database.ts` y registrar discrepancias.
2. **Respaldo verificable:** generar copia recuperable de datos/esquema y documentar restauración; no ejecutar migraciones sobre datos personales sin autorización.
3. **Mapeo explícito por fila:** separar obra/libro, edición opcional utilizada y experiencia/formato por lectura conforme DEC-038/041; preservar correspondencia con IDs legados sin deduplicar a ciegas ni trasladar metadatos de edición a obra. Conservar **todos** los registros v1 (DEC-013); datos ambiguos requieren mapeo seguro, no descarte/publicación por defecto. No inventar abandonos/reanudaciones ausentes ni atribuir una retomada a nueva lectura lógica. DEC-036 no ordena archivar todo v1.
4. **Fechas y valores nulos:** conservar precisión efectivamente conocida; no inferir día/mes/año ausentes ni relecturas. La nueva validación de finalización exige año (DEC-033), pero los registros v1 sin año deben conservarse sin inventarlo; resolver el mapeo de datos inconsistentes antes de convertirlos.
5. **Campos históricos fuera del MVP:** conservarlos en **archivo privado**, sin exposición pública ni borrado (DEC-036). Inventariar y mapear `quiero_leer`, `would_recommend`, `would_reread`, `engagement`, `last_updated_at`, `notes` y demás contenido para distinguir lo que se conserva en el MVP de los campos fuera de él. Formato, ubicación, protección, almacenamiento, respaldos y verificación del archivo siguen pendientes OPEN-07/08; no se elige una tabla, proveedor o tecnología, ni se autoriza crear el archivo o extraer datos.
6. **Metas:** preservar años y objetivos; verificar duplicados reales antes de establecer unicidad.
7. **Verificación antes/después:** comparar filas por estado, IDs legados mapeados, lecturas completadas por año, fechas, notas y calificaciones; investigar diferencias antes de publicar.
8. **Reversión:** documentar punto de retorno y comprobar que puede recuperarse el estado previo; hacer despliegue y migración en fases, no junto a un rediseño sin pruebas.

No se incluyen scripts, DDL ni comandos destructivos: el esquema remoto y la estrategia de acceso siguen sin verificar.

## 8. Pruebas mínimas derivadas del modelo

| ID | Criterio |
| --- | --- |
| DM-01 | Un libro admite dos lecturas con IDs diferentes y evaluaciones independientes. |
| DM-02 | Las dos lecturas del mismo libro terminadas en el mismo año suman dos. |
| DM-03 | Una finalización solo con año conserva `month = null` y `day = null`. |
| DM-04 | Una finalización con año/mes y día desconocido no crea un día ficticio. |
| DM-05 | Una lectura iniciada en 2025 y terminada en 2026 cuenta para 2026. |
| DM-06 | Una lectura `reading` no suma a la meta ni aparece en meses. |
| DM-07 | Se permite `rating = null`; si existe, acepta 0.5–5 en pasos de 0.5 y rechaza 0, 5.5 e incrementos distintos. No confundir `null` con cero. |
| DM-08 | Eliminar/editar meta no modifica lecturas. El resultado exacto de conteos/metas tras eliminar o restaurar una lectura queda condicionado a la política de eliminación recuperable todavía pendiente; no imponer exclusión/inclusión por inferencia. |
| DM-09 | Visitantes y sesiones autenticadas no autorizadas no pueden insertar, actualizar ni eliminar datos aunque invoquen APIs directamente; la identidad propietaria sí, conforme al contrato de permisos por aprobar. |
| DM-10 | La migración preserva datos y no convierte `would_reread` en lectura real. |
| DM-11 | **Propuesta pendiente de política de fechas:** probar que la representación calendario elegida no cambia componentes conocidos según zona horaria; concretar el caso tras OPEN-04. |
| DM-12 | Los campos históricos v1 fuera del MVP se conservan en archivo privado, no público y sin borrado (DEC-036); mapeo y verificación pendientes. No convertir la regla en archivo de todo v1 ni en permiso para extraer datos. |
| DM-13 | Una abandonada no suma a metas y permanece en «Abandonados» con fechas/notas; retomar conserva la **misma lectura lógica** y el historial de abandono/reanudación sin sobrescribirlo/perderlo (DEC-035/039). Persistencia, transiciones/fechas/calificación restantes pendientes. |
| DM-14 | Un libro con lecturas asociadas no puede eliminarse ni provocar cascada. Una lectura eliminada debe ser recuperable (DEC-040); no asumir desvinculación del libro ni permiso para borrarlo: política compatible pendiente. |
| DM-15 | El formato pertenece a la lista fija aprobada y editarlo no altera otras lecturas; no añade formatos simultáneos ni historial aprobado. |
| DM-16 | Nueva finalización requiere al menos año y rechaza su ausencia; acepta solo año o mes/año sin inventar componentes (DEC-033). Los registros v1 sin año se conservan sin inventarlo ni descartarlos; mapeo seguro pendiente OPEN-07/08. |
| DM-17 | Cambiar el año seleccionado no filtra la rama superior: conserva todas las lecturas activas (DEC-034), separadas de los completados mensuales. |
| DM-18 | Si no existe meta, mostrar exactamente «Sin meta establecida» y permitir crearla solo a la propietaria autorizada (DEC-037); no confundir ausencia con error ni fabricar objetivo. |
| DM-19 | Un libro admite experiencias en formatos distintos; cada lectura mantiene su propio formato, no el libro, sin múltiples simultáneos (DEC-038). |
| DM-20 | Retomar repetidamente conserva la identidad lógica y el historial de abandono/reanudación; no crea nuevas relecturas lógicas ni duplica una finalización por la retomada. Persistencia, orden/fechas y control de repetición pendientes (DEC-039). |
| DM-21 | Una lectura eliminada puede recuperarse con identidad/historial/referencias íntegros. Casos de repetición, conflictos, permisos, consultas/conteos y DEC-008 requieren política aprobada; ningún respaldo genérico, purga o papelera se asume como solución (DEC-040). |
| DM-22 | Ediciones distintas de una obra permanecen bajo único libro y cada lectura puede registrar u omitir la edición utilizada, separada de formato y sin ISBN obligatorio. Estructura/dedupe/reparto de metadatos pendientes (DEC-041). |

Son casos para verificaciones futuras autorizadas, **no pruebas ejecutadas ni permiso para escribir datos**. Las propuestas y los casos bloqueados no se convierten en reglas físicas por aparecer en esta tabla.

## 9. Bloqueos y decisiones pendientes

| Referencia | Pregunta | Estado |
| --- | --- | --- |
| OPEN-01 | Identidad autorizada, sesión magic link, RLS y ámbito de propiedad/publicación | **Pendiente; bloquea seguridad/esquema** |
| OPEN-03 | Un libro por obra y edición opcional por lectura aprobados; pendientes representación/vínculo de ediciones, metadatos/deduplicación/mapeo, confirmaciones, mecanismo recuperable e implicaciones consultas/conteos/restauración/conflictos/permisos/DEC-008 | **Parcialmente resuelto DEC-040/041; bloquea integridad afectada** |
| OPEN-04 | Inicio, coherencia de fechas, «Otro»/valor vacío, transiciones restantes, calificación al abandonar y persistencia/orden/fechas del historial al retomar; misma lectura lógica aprobada DEC-039, formato por lectura DEC-038 y mínimo año DEC-033 | **Parcialmente resuelto; bloquea restricciones físicas afectadas** |
| OPEN-07 | Esquema remoto, respaldo, migración y reversión | **Pendiente; bloquea cualquier cambio de datos** |
| OPEN-08 | Mecanismo/formato/ubicación/protección, mapeo y verificación del archivo privado de campos históricos fuera del MVP (DEC-036); destino de registros como «quiero_leer» y mapeo seguro de v1 sin año pendientes con OPEN-07 | **Pendiente; bloquea migración, no reabre destino privado de esos campos** |
| OPEN-02 | Retención y protección del procesamiento de fotografías | **Pendiente para integración** |
| OPEN-06 / TECH-02 | Algoritmo/layout/accesibilidad/rendimiento de la rama con todas las activas, independiente del año conforme DEC-034 | **Pendiente; no reabre el filtro temporal aprobado** |
| TECH-01/02 (asunto adicional A-05) | Unicidad/límites de meta y representación del exceso; asignación formal por aprobar. Ausencia resuelta por DEC-037 | **Propuesta pendiente; bloquea restricciones/aceptación de metas afectadas** |

**No resuelto deliberadamente:** motor/ORM, SQL/columnas, representación de ediciones y reparto de metadatos, persistencia del historial de la misma lectura al retomar, eliminación recuperable y su vínculo DEC-008, archivo privado, índices/sesiones/despliegue. Se definirán con `docs/architecture/ARCHITECTURE.md` y decisiones técnicas aprobadas, tras verificar Supabase. DEC-033–041 cierran solo reglas de producto; ninguna OPEN/TECH completa ni Fase 0 quedan cerradas por esta edición.

## 10. Criterio de aprobación

Este documento podrá marcarse **APROBADO** cuando la propietaria valide el modelo lógico, se resuelvan las decisiones que bloquean la implementación del área y se confirme que las reglas concuerdan con `PRODUCT.md` y `REQUIREMENTS.md`. **Aprobación del modelo lógico no autoriza por sí sola una migración.**
