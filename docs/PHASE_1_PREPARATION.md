# Book Diary v2 — Preparación de Fase 1

**Estado:** preparación autorizada; ejecución sobre Supabase y cambios de aplicación no autorizados por este documento. · **Última revisión:** 20 de octubre de 2026.

**Fuentes:** `AGENTS.md`; `docs/DECISIONS.md`; `docs/IMPLEMENTATION_PLAN.md`; `docs/PHASE_0_REPORT.md`; `docs/SYNC_REPORT.md`; las seis especificaciones; `package.json` y `package-lock.json`; inspección estática local y documentación oficial de Supabase consultada el 20/10/2026.

## 1. Alcance

La propietaria autorizó iniciar tareas de preparación de Fase 1. Este documento ordena el trabajo previo de forma segura; no cierra decisiones funcionales ni reemplaza la autorización específica que se requiere antes de crear un entorno con costo, ejecutar SQL, cambiar esquema/RLS, tocar datos, instalar dependencias, desplegar o migrar.

Objetivo de Fase 1: probar modelo de datos, identidad y permisos en un entorno aislado, conservar los datos de v1 y ensayar restauración/migración/reversión antes de considerar producción. No se considera completada hasta cumplir las puertas de `docs/IMPLEMENTATION_PLAN.md §5`.

## 2. Estado verificado

### Supabase — solo lectura

- Hay un proyecto llamado `book-diary` (`mxghetuvlknxvztqcgtp`), estado `ACTIVE_HEALTHY`, PostgreSQL 17.6.1.147.
- La organización conectada también contiene `wod-tracker`, estado `INACTIVE`; no se asume que sea un entorno de prueba ni debe usarse para este proyecto.
- No hay branches de desarrollo listados para `book-diary`.
- El inventario de esquema, permisos, conteos y limitaciones de Auth/Data API ya está descrito en `docs/PHASE_0_REPORT.md §12.2`.
- El proyecto conectado no queda certificado como staging. No se creó branch/proyecto y no se hicieron cambios remotos.

### Repositorio y especificaciones

- El registro documental disponible enumera DEC-001–DEC-041; `DECISIONES_FASE_0_FINAL.md` no se encontró en el árbol inspeccionado.
- La auditoría documental informa cobertura de estas decisiones en las seis especificaciones y requisitos. La inspección estática posterior también revisó `AGENTS.md`; quedan discrepancias documentales generales que no se resuelven en este checklist.
- Permanecen asuntos OPEN/TECH. En especial, OPEN-01 (identidad y autorización), OPEN-03 (ediciones, recuperación y conteos), OPEN-04 (fechas/transiciones/historial), OPEN-07 (mapeo y respaldo) y OPEN-08 (archivo privado) afectan diseño y migración.
- **Inspección estática completada el 19/10/2026:** se verificó acceso a la raíz del repositorio y lectura de `AGENTS.md`, manifiestos, tipos, cliente Supabase y puntos de consulta/mutación. Estado de Git observado: rama `main...origin/main`, `AGENTS.md` modificado y documentos de especificación no seguidos; no se hicieron cambios durante esa inspección.
- En el código revisado, `lib/supabase.ts` crea un cliente con variables `NEXT_PUBLIC_*`, usado desde componentes de servidor y cliente. No se encontraron llamadas a Supabase Auth, manejo propio de sesión/cookies ni comprobaciones de identidad/propiedad en los archivos inspeccionados. Las mutaciones de libros y metas usan directamente el cliente Supabase. Esto es una constatación estática del repositorio, no verificación de permisos remotos ni de controles externos.
- Los archivos solicitados —`AGENTS.md`, decisiones, plan, informes, seis especificaciones, `package.json` y `package-lock.json`— son legibles. Git está en `main...origin/main`; ya había cambios locales (`AGENTS.md` modificado y documentación sin seguimiento) antes de esta actualización. Se preservan; no se interpretan como cambios de este pase.
- El contrato local `types/database.ts` solo declara tipos: una tabla lógica `books` mezcla libro y lectura, más `reading_goals`; no representa los conceptos v2 aprobados de lecturas separadas, formato por lectura, edición opcional por lectura ni historial/recuperación. No es DDL ni prueba del esquema remoto. No se encontraron archivos `.sql`, carpeta `supabase/`, `supabase/config.toml`, migraciones ni seed versionados. `docs/PHASE_0_REPORT.md §12.2` documenta un inventario read-only previo, pero no contiene un dump reproducible completo ni descarta DDL manual.
- `package.json` ofrece `dev`, `build`, `start` y `lint`, sin script de pruebas ni dependencia de Supabase CLI/runner; el lockfile fija `@supabase/supabase-js` 2.110.0. En el PATH se encontró el binario Docker, no la CLI `supabase`; no se comprobó si el daemon está activo. No se instaló nada. `.env.local` y secretos no se leyeron.

## 3. Riesgos que condicionan el trabajo

1. **Permisos existentes:** el informe registra policies permisivas y grants para `anon` en las tablas observadas. La exposición de Data API no se verificó. Requiere evaluación de la propietaria/admin; no hacer cambios al proyecto conectado.
2. **Sin entorno reproducible en el repositorio:** no hay esquema/migraciones/seed para construir una base local o branch con el estado actual. El inventario read-only de Fase 0 no es fuente suficiente para replicar DDL manual desconocido. Un branch sin migraciones versionadas no debe tratarse como clon de ese esquema; puede incurrir en cargos de uso.
3. **Sin restauración demostrada:** no existe evidencia documentada de un respaldo restaurable ni de un ensayo de reversión.
4. **Modelo incompleto:** no diseñar migración final mientras sigan sin resolver las subdecisiones OPEN que afectan restricciones, recuperación y conservación del historial.
5. **Inspección estática limitada:** el código fue leído, pero esto no verifica ejecución, comportamiento del backend ni permisos efectivos; no afirmar que la aplicación implemente los requisitos de v2.

## 4. Checklist de preparación

### A. Evidencia y alcance

- [x] Reunir inventario básico read-only de Supabase en `PHASE_0_REPORT.md §12.2`.
- [x] Confirmar desde la lista conectada que no hay branch de desarrollo de `book-diary`.
- [ ] Confirmar si `DECISIONES_FASE_0_FINAL.md` está fuera del repositorio o si DEC-001–041 es la lista completa definitiva.
- [x] Obtener acceso y revisar estáticamente `AGENTS.md`, estado de Git, manifiestos, estructura y puntos de integración Supabase sin alterar el proyecto; resultado y límites registrados en §2.
- [ ] Confirmar con la propietaria/admin si la Data API expone `public` y obtener la evaluación autorizada del riesgo de permisos; no modificar policies/grants durante la verificación.

### B. Entorno de prueba

- [ ] Usar primero un stack Supabase local y aislado, una vez que existan configuración, esquema/migraciones versionadas revisadas y seed sintético; en esta tarea no se creó ni inicializó.
- [ ] Si la prueba exige un comportamiento exclusivo del servicio hospedado, evaluar después un proyecto remoto separado; requerir aprobación expresa de plan, coste máximo, duración, región, datos y borrado final.
- [ ] No elegir Preview Branch como sustituto de esquema versionado: GitHub branches construyen desde migraciones del repositorio y branches de Dashboard desde historial de migraciones base; ese historial está reportado vacío. No crea copia de datos, salvo opción de incluirlos explícitamente.
- [ ] No copiar datos de producción; usar únicamente fixtures sintéticos, incluida identidad propietaria ficticia y usuario autenticado no autorizado.
- [ ] Definir URLs/keys locales o de prueba y separación de secretos sin exponer valores; verificar destino antes de cada conexión.

### C. Modelo, seguridad y legado

- [ ] Cerrar las subdecisiones OPEN-01/03/04/08 que sean necesarias para el esquema y políticas a ensayar; mantener registro trazable sin alterar decisiones aprobadas.
- [ ] Documentar modelo destino y matriz de autorización (visitante de lectura / propietaria de escritura), incluyendo lecturas anonimizadas de sólo los campos permitidos.
- [ ] Especificar plan de respaldo, restauración, mapeo v1→v2, archivo privado y criterios de reconciliación antes de cualquier migración.
- [ ] Preparar propuesta de migración versionada en el repositorio; revisar por separado antes de aplicarla al entorno aislado.
- [ ] Ensayar rollback/restauración y pruebas negativas de acceso antes de considerar Fase 1 completa.

## 5. Orden de trabajo recomendado

1. **Completado:** acceso al repo fuente y revisión estática de la app/configuración sin leer secretos; ver §2. No se consultó Supabase durante esa inspección.
2. Confirmar documentalmente el conjunto final de decisiones y la autorización del entorno aislado.
3. Cerrar solo los remanentes OPEN/TECH necesarios para identidad, modelo de lecturas/ediciones y archivo histórico; no reabrir DEC aprobadas.
4. Preparar en el repositorio el esquema/configuración/fixtures sintéticos reproducibles como propuesta, tras resolver bloqueos aplicables y obtener autorización específica para añadirlos/instalar herramientas.
5. Ejecutar primero localmente el plan de §8 cuando se autoricen SQL, migraciones, instalación y pruebas; si hay una necesidad comprobada de hosting, pedir aprobación previa de costes y alcance para proyecto separado. No crear Preview Branch por defecto.
6. Comparar invariantes y conteos del dataset sintético, probar respaldo/restauración y reversión, y documentar resultados. No usar datos productivos.

## 6. Alcance de seguridad y recomendación técnica inicial

### Alcance

Se mantienen intactos los requisitos aprobados: la biblioteca es pública para lectura y solo la propietaria puede modificarla; el inicio de sesión es por magic link (DEC-009). **No se simplifica ni se reabre el alcance funcional.** La simplificación permitida es exclusivamente elegir una implementación técnica pequeña y mantenible que haga cumplir esos requisitos.

### Baseline técnico recomendado — pendiente de ensayo

1. **Autenticación:** integrar Supabase Auth con magic link usando cliente SSR con cookies para Next.js; validar la identidad autenticada en el servidor. No tratar una sesión extraída del cliente como prueba suficiente de autorización.
2. **Autorización:** distinguir explícitamente a la propietaria de cualquier otro usuario autenticado. Usar un mecanismo de allowlist/rol de propietaria administrado por canal confiable, nunca `user_metadata` editable por el usuario. Un usuario autenticado sin autorización de propietaria no puede mutar datos.
3. **Defensa final en la base:** aplicar RLS a todas las tablas expuestas, con lectura anónima solo para una proyección pública de campos permitidos y mutaciones únicamente para la identidad autorizada. Revocar privilegios innecesarios de `anon`; no conceder `TRUNCATE`, `REFERENCES` o `TRIGGER` a roles de aplicación. Las validaciones de servidor complementan RLS, no la reemplazan.
4. **Privacidad por defecto:** hasta aprobar el inventario de campos públicos, denegar exposición de notas, archivo histórico, metadatos privados y campos de abandono no aprobados. DEC-036 obliga a mantener el archivo histórico fuera del alcance público.
5. **Secretos:** solo clave publishable en el cliente; nunca usar clave `service_role`/secret en navegador ni en variables `NEXT_PUBLIC_*`.
6. **Verificación requerida:** pruebas de lectura anónima de campos permitidos, denegación de escrituras anónimas, denegación de escrituras para cuentas autenticadas no propietarias, autorización de la propietaria y revocación de sesión/rol. Ejecutarlas solo en un entorno aislado autorizado.

**Justificación:** el repositorio revisado usa un cliente Supabase desde componentes de servidor y cliente, y no se encontraron llamadas Auth ni comprobaciones de propietario en los archivos inspeccionados. Por ello la frontera de autorización debe hacerse explícita. La combinación de sesión SSR, autorización de propietario y RLS reduce el riesgo de que ocultar controles de UI o mover mutaciones al servidor se confunda con seguridad efectiva.

**Estado:** recomendación de diseño técnico para preparar TECH-01/OPEN-01; no modifica DEC-009, no selecciona los campos públicos, no se ha implementado ni validado, y no cierra OPEN-01/TECH-01. Fuentes oficiales: [Supabase: SSR client](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase: Securing your data](https://supabase.com/docs/guides/database/secure-data).

## 7. Comparación de entornos y recomendación

| Opción | Aislamiento / fidelidad | Costos y requisitos | Evaluación para Book Diary |
| --- | --- | --- | --- |
| **Supabase local (recomendado como primer entorno)** | Servicios locales aislados para Postgres, Auth y API; permite fixtures sintéticos y probar RLS/Auth sin alcanzar producción. No debe exponerse a redes externas. Una pila Supabase completa es más fiel que PostgreSQL solo. | Sin cargo de nube; consume recursos locales. Requiere Supabase CLI y runtime compatible con Docker. Hoy solo se encontró Docker CLI; no `supabase` CLI y no se verificó daemon. La documentación oficial recomienda versionar config, migraciones y seed para reconstruir. | Mejor relación aislamiento/reproducibilidad/costo, pero **todavía no reproducible**: no hay config, migraciones ni seed. Necesita primero un esquema v2 candidato aprobado, cuya estructura física depende de decisiones pendientes. |
| **Proyecto Supabase separado** | Mayor fidelidad a servicios hospedados, Auth y settings reales; frontera clara respecto del proyecto activo. Aun así, solo será repetible con migraciones/configuración y fixtures versionados; no importar datos productivos. | Cada proyecto tiene su propio Postgres/compute; costo según plan, tamaño y uso. El plan Free contempla hasta dos proyectos en organizaciones donde la persona es Owner/Admin, pero esto no demuestra que la cuenta actual tenga cupo ni que el coste efectivo sea cero; proyectos pagos y cuotas/uso pueden generar cargos. Requiere aprobación previa informada. | Alternativa posterior si hay pruebas cloud-only; no recomendar ahora por costo y ausencia de esquema reproducible. No se consultó plan/cupo/cuenta.
| **Preview Branch** | Entorno separado con servicios Supabase; por defecto sin filas/storage de base. El esquema se construye desde migraciones de GitHub o historial de migraciones de la base de Dashboard, no se clona el esquema físico manualmente. | Cobro variable por uso; documentación consultada indica Micro desde USD 0.01344/h más otros usos, fuera del spend cap; créditos de compute no se aplican al compute de branches. El total depende de uso/organización y debe recalcularse antes de aprobar. | No recomendado: no hay migraciones en repo y el historial gestionado fue reportado vacío; no reproduciría de forma confiable el DDL manual. No crear.
| **PostgreSQL local simple o mocks** | Base SQL local puede probar restricciones SQL; mocks prueban lógica aislada. No reproducen por sí solos Supabase Auth, Data API/JWT y políticas RLS reales; depende de cómo se monte el rol/claims. | Sin cargo de nube; PostgreSQL requiere instalación/gestión local. Mocks no requieren servicio. | Útiles como complemento barato para lógica/fixtures, insuficientes como única evidencia para los casos de autorización solicitados. |

**Recomendación:** empezar con Supabase local, usando exclusivamente datos sintéticos, después de aprobar y versionar un esquema candidato, `config.toml`, migraciones y seed. Esa opción es costo-cero de nube, permite repetir resets y se mantiene desconectada del Supabase remoto si no se vincula; la pila local incluye Auth y Mailpit para capturar enlaces de acceso sin correo real. En su estado actual el repo no tiene los artefactos para arrancar una réplica fiel. Usar PostgreSQL/mock solo para pruebas unitarias auxiliares. Pasar a proyecto remoto separado únicamente si Auth/Data API/configuración hospedada requiere validación no disponible localmente, con presupuesto y aprobación previos. Un Preview Branch no arregla la ausencia de historial de migraciones.

**Fuentes oficiales consultadas el 20/10/2026:** [flujo de desarrollo local y artefactos versionados](https://supabase.com/docs/guides/local-development/cli-workflows), [branching y fuente del esquema por tipo de branch](https://supabase.com/docs/guides/deployment/branching), [uso y facturación de branches](https://supabase.com/docs/guides/platform/manage-your-usage/branching), [facturación de proyectos y plan Free](https://supabase.com/docs/guides/platform/billing-on-supabase), [pruebas locales con pgTAP/Mailpit](https://supabase.com/docs/guides/local-development/cli/testing-and-linting), [alcance de RLS por fila y grants](https://supabase.com/docs/guides/database/postgres/row-level-security), [privilegios por columna](https://supabase.com/docs/guides/database/postgres/column-level-security), [sesiones y cierre de sesión](https://supabase.com/docs/guides/auth/sessions). Los importes/planes cambian; no se consultó la facturación de la organización.

## 8. Plan propuesto de pruebas (sin ejecutar)

**Precondiciones:** definir campo por campo la proyección pública de la biblioteca (OPEN-01; DEC-009/036), identidad/rol autorizado, comportamiento de sesión/revocación (OPEN-01/TECH-01), modelo y fixtures compatibles con DEC-001–041, y reconstrucción local por migraciones. No publicar notas, archivo histórico ni campos de abandono sin aprobación. RLS filtra filas, no columnas; comprobar la proyección y los grants/selectores de columnas o vista segura que finalmente se aprueben. No introducir correo ni claves reales. En una revocación Supabase normal, el access token puede seguir siendo válido hasta expirar; por eso se mide y documenta ese límite, no se presume revocación JWT instantánea.

| Caso | Actor/dataset sintético | Procedimiento y resultado esperado | Dependencias |
| --- | --- | --- | --- |
| Lectura pública acotada | `anon`; libro/lectura con campos públicos ficticios y campos privados centinela | Leer la proyección aprobada mediante API pública y UI; respuesta contiene solo campos permitidos. Probar intento explícito de seleccionar columna privada y rutas alternativas: no debe revelar notas/archivo/campos privados. La lista exacta no se inventa aquí. | OPEN-01 (inventario de campos visibles); DEC-009/036; TECH-01 (proyección/API). |
| Rechazo de escritura anónima | `anon`; fixture de cada entidad que se ensaye | Intentar INSERT/UPDATE/DELETE por API directa, no solo desde UI; cada operación debe fallar/no persistir y el snapshot posterior debe ser idéntico. Incluir revisión de privilegios peligrosos no cubiertos por RLS (`TRUNCATE`, `REFERENCES`, `TRIGGER`) según la arquitectura autorizada. | OPEN-01, TECH-01; OPEN-03/04 para tablas/estados existentes. |
| Rechazo de autenticado no autorizado | Usuario Auth sintético distinto de propietaria | Con token válido de prueba, intentar INSERT/UPDATE/DELETE directo a API y endpoints de servidor; no debe persistir ni leer el archivo privado. Estar autenticado no basta. | OPEN-01 (criterio de identidad autorizada); TECH-01 (capa/enforcement); DEC-009/036. |
| Escritura de propietaria | Identidad de propietaria **ficticia/de prueba**, creada solo en el entorno local | Conceder rol/identidad autorizado exclusivamente al fixture; ejecutar operaciones permitidas y verificar cambios, integridad y privacidad. Repetir en cliente/API y rutas de servidor para evitar seguridad solo de interfaz. | OPEN-01/TECH-01; el mecanismo técnico se aprueba aparte; nunca usar correo real/credenciales de producción. |
| Revocación | Mismo usuario sintético antes y después de revocar autorización y sesión | Verificar que la sesión revocada no puede abrir una sesión nueva ni seguir mutando. Probar token ya emitido, refresh y petición posterior a revocación; registrar tiempo real hasta denegación. Fijar expectativa (inmediata o limitada por TTL/validación de sesión) antes de aceptar. | OPEN-01 (semántica revocación/expiración); TECH-01 (enforcement/validación sesión). |
| Integridad de datos | Seed sintético con múltiples lecturas/formatos, fecha parcial, terminado/leyendo/abandonado, metas y campos históricos | Antes/después, cotejar conteos e IDs, relación libro-lecturas, ratings/fechas, metas, estado/historial y no exposición del archivo. No inventar constraints o mapeos todavía abiertos. | DEC-001/003/005/008/013/033–041; OPEN-03/04/08; OPEN-07. |
| Respaldo/restauración/reversión | Solo base local con seed sintético y migración propuesta una vez aprobada | Crear snapshot antes del cambio; restaurar en instancia local limpia; verificar conteos, relaciones, lectura/autorización; ensayar rollback o restauración documentada a estado previo, repetir migración y comparar invariantes. Registrar comandos, checksums/fechas y resultado sin incluir datos reales. Abortar ante diferencias no explicadas. | OPEN-07 (backup/mapeo/reversión); OPEN-03/04/08 (semántica/mapeo); TECH-01/02 (herramientas y runner). |

**Evidencia por prueba:** versión de herramientas aprobada, commit del esquema/seed, entorno y destino explícitos (local/remoto), fixture usado, pasos, resultado esperado/observado, evidencia sin secretos/filas personales, y criterio de aborto. Ninguna prueba se ejecutó en esta tarea; `package.json` actualmente no define scripts de test. Definir/instalar runner, CLI y versión de Node corresponde a TECH-02 y requiere autorización que permita esos cambios.

## 9. Límites y definición de listo

**No está listo para pasar a Fase 2** hasta que Fase 1 cumpla los criterios de salida: modelo y permisos verificados en entorno aislado, datos/historial preservados en ensayo, conteos e integridad documentados y restauración ensayada. La existencia de este checklist no equivale a aprobación para operaciones externas.

**Preparación de entorno y plan completados documentalmente:** comparación y recomendación en §7; casos y dependencias en §8. No se creó infraestructura ni se ejecutaron pruebas. El próximo paso técnico, sujeto a autorización específica, es aprobar inventario de campos/identidad (OPEN-01), diseño mínimo de esquema que preserve DEC-001–041 y mecanismo de restauración, y luego versionar/revisar los artefactos para el stack local. No asumir que el proyecto conectado es staging ni crear un entorno remoto implícitamente.
