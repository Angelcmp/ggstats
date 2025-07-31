# Tareas Pendientes - ggstats
# JULIO 2025
## Funcionalidades Implementadas

- [x] **Integración con OpenDota API (Dota 2):**
    - Se creó el módulo `dota2` con `Dota2Service` y `Dota2Controller`.
    - Se implementaron endpoints para:
        - Buscar jugadores por nombre (`/dota2/search/:playerName`)
        - Obtener estadísticas de jugador por Account ID (`/dota2/player/:accountId`)
        - Obtener registro de victorias/derrotas por Account ID (`/dota2/player/:accountId/winloss`)
        - Obtener partidas recientes por Account ID (`/dota2/player/:accountId/recentMatches`)
    - Se integró `Dota2Module` en `AppModule`.
    - Se verificó la funcionalidad básica de los endpoints.

- [x] **Expansión de Endpoints de Riot API:**
    - Se añadió el endpoint de rotaciones de campeones (`/riot-api/champion-rotations/:region`).
    - Se añadió el endpoint de lista de partidas de Valorant (`/riot-api/valorant/matchlist/:region/:gameName/:tagLine`).
    - Se corrigieron errores de sintaxis en `riot-api.service.ts` y `riot-api.controller.ts`.

- [x] **Explorar otras funcionalidades de la API de OpenDota:**
    - [x] Se añadieron endpoints en el backend para `proPlayers`, `publicMatches` y `rankings`.
    - [x] Se implementó la página de "Pro Players" con búsqueda, filtro por región competitiva y banderas de países.
    - [x] Se implementó la página de "Public Matches".
    - [x] Se implementó la página de "Rankings".
    - [x] Se añadió un enlace a "Pro Players" en la barra de navegación.
    - [x] Se implementó la página de perfil de jugador (`/players/[accountId]`) con estadísticas, win/loss y partidas recientes con detalles de héroes.

- [x] **Mejoras en la interfaz visual:**
    - [x] Se aplicó un diseño similar al de "Meta Heroes" en la página de "Pro Players".
    - [x] Se integraron banderas de países en las tarjetas de jugadores.

- [x] **Corrección de errores:**
    - [x] Se corrigió el error `ECONNREFUSED` ajustando el puerto del proxy en `next.config.mjs`.
    - [x] Se corrigió el error `Cannot read properties of undefined (reading 'toLowerCase')` en el buscador de jugadores.
    - [x] Se desinstaló y eliminó la referencia a `@stagewise/toolbar-next` para resolver errores de ejecución.

## Prioridad Alta (Pendiente)

- [ ] **Investigar y Resolver el Error de Autorización de Riot API (401/403):**
    - **Estado Actual:** El problema persiste a pesar de la verificación de la clave y el cambio de región. Se ha decidido pivotar a Dota 2 por ahora, pero esta tarea sigue siendo relevante si se retoma la integración con Riot API.
    - **Estimación:** Altamente variable, desde 30 minutos hasta varias horas o incluso días.
    - **Acciones Pendientes:**
        - Reconfirmar la validez y permisos de la clave de desarrollo de Riot API para todas las APIs relevantes (LoL, Valorant, Account).
        - Investigar posibles restricciones de IP o límites de tasa que puedan estar afectando la clave.
        - Considerar el uso de un proxy o VPN si las restricciones de red son un problema.

- [ ] **Investigar y Resolver Conflicto de Dependencias en el Frontend:**
    - **Estado Actual:** La instalación de nuevas dependencias (ej. `recharts`) falla debido a un conflicto con `ts-jest`. El error `ETARGET` con `ts-jest@^30.0.0` persiste incluso después de intentar varias soluciones (npm, bun, --legacy-peer-deps, reinstalación).
    - **Estimación:** 15-30 minutos para configurar ESLint; 5-10 minutos para revisar la diferencia de versiones de `recharts`.
    - **Acciones Pendientes:**
        - Analizar el `bun.lock` para identificar la dependencia que requiere `ts-jest`.
        - Considerar la posibilidad de eliminar y reinstalar toda la configuración de `jest` en el frontend.
        - Explorar alternativas a `recharts` si el conflicto persiste.
        - Configurar ESLint para el frontend (15-30 minutos).
        - Revisar la diferencia de versiones de `recharts` (5-10 minutos).

## Próximas Funcionalidades (Dota 2)

- [x] **Backend (NestJS):**
    - [x] Explorar y añadir más endpoints de OpenDota API (ej. héroes, partidas detalladas).
    - [x] Implementar caché para las llamadas a la API de OpenDota.
    - [x] Definir DTOs para los datos de Dota 2.
    - [x] Añadir endpoints para héroes y detalles de partidas.
    - [x] Añadir endpoint para ítems.
    - [x] Definir DTO para ítems.
    - [x] Añadir endpoint para habilidades (`/dota2/abilities`).

- [x] **Frontend (Next.js):**
    - [x] Crear componentes para mostrar los datos de jugadores de Dota 2.
    - [x] Integrar los nuevos componentes en la interfaz de usuario.
    - [x] Diseñar y estilizar las vistas de perfil de jugador y estadísticas de Dota 2.
    - [x] Crear página de héroes (`/heroes`).
    - [x] Actualizar barra de navegación con enlace a héroes.
    - [x] Crear página de detalles de partida (`/matches/[matchId]`).
    - [x] Integrar enlaces a detalles de partida en el perfil del jugador.
    - [x] Crear página de ítems (`/items`).
    - [x] Actualizar barra de navegación con enlace a ítems.
    - [x] Asegurar que los estilos visuales se apliquen correctamente (incluyendo la imagen de fondo y la configuración de Tailwind).
    - [x] Mostrar detalles de partida (jugadores, héroes, ítems).
    - [x] Mejorar la página de detalles del héroe con estadísticas profesionales, de atributos y combate, y builds de ítems populares.
    - [x] Implementar buscador, filtros y ordenamiento en la página de lista de héroes (`/heroes`).
    - [x] Mejorar el diseño visual de la página de lista de héroes (colores, bordes, tipografía).
    - [x] Mejorar el diseño visual de la página de ítems (tamaño de imágenes, filtros, búsqueda).

## Próximas Funcionalidades (General)

- [x] **Implementar más cambios de estadísticas en la página web.**
    - Se mejoró la visualización de las tablas en la página de Meta Héroes, incluyendo:
        - Encabezados de tabla mejorados.
        - Colores de fila alternos (zebra striping).
        - Ajuste de espaciado y relleno en celdas.
        - Diseño mejorado de iconos de héroes (rectangulares, con borde y tamaño ajustado).
        - Implementación de badge de rol principal con efecto glassmorphism y colores por rol.
- [ ] **Mostrar User Rate y Win Rate para Ítems:**
    - **Estado Actual:** No es posible con el endpoint actual de OpenDota API. Requiere encontrar un nuevo endpoint o implementar lógica compleja de cálculo.
    - **Acciones Pendientes:** Investigar si OpenDota API ofrece un endpoint para estas estadísticas o considerar alternativas a futuro.
- [x] **Configurar Pruebas Automatizadas:**
    - [x] Backend (NestJS): Configurar un framework de pruebas (ej. Jest) y escribir pruebas unitarias/de integración para los servicios y controladores.
    - [x] Frontend (Next.js): Configurar un framework de pruebas (ej. Jest, React Testing Library) y escribir pruebas de componentes/integración.

- [ ] **Refactorizar y Limpiar Código:**
    - [ ] Revisar y mejorar la estructura del código, aplicando principios SOLID y patrones de diseño.
    - [ ] Eliminar código comentado o temporal.

- [x] **Implementar la página de detalles de ítems:**
    - **Acciones Pendientes:** Crear una página para cada ítem donde se muestren sus propiedades, lore, etc.

- [ ] **Trabajar en el diseño general:**
    - **Acciones Pendientes:** Mejorar la estética y la experiencia de usuario en otras partes de la aplicación.

- [ ] **Volver a intentar con las imágenes de héroes/habilidades:**
    - **Estado Actual:** Las imágenes no cargan correctamente. Se necesita investigación o procesamiento adicional para las imágenes.
    - **Acciones Pendientes:** Investigar nuevas soluciones o recursos para solucionar el problema de las imágenes.

- [ ] **Implementar Builds de Habilidades Populares en la página de detalles del héroe:**
    - **Estado Actual:** Los datos `ability_build` están disponibles, pero las imágenes de habilidades no cargan. Se necesita investigación o procesamiento adicional para las imágenes.

- [x] **Implementar Matchups (Buenos/Malos contra) en la página de detalles del héroe:**
    - **Estado Actual:** Los datos `matchups` están disponibles en `heroStats`, pero requieren procesamiento para una visualización elaborada.

## Tareas Postergadas

- [ ] **Investigar y Resolver el Error de Autorización de Riot API (401/403):**
    - **Estado Actual:** El problema persiste a pesar de la verificación de la clave y el cambio de región. Se ha decidido pivotar a Dota 2 por ahora, pero esta tarea sigue siendo relevante si se retoma la integración con Riot API.
    - **Estimación:** Altamente variable, desde 30 minutos hasta varias horas o incluso días.
    - **Acciones Pendientes:**
        - Reconfirmar la validez y permisos de la clave de desarrollo de Riot API para todas las APIs relevantes (LoL, Valorant, Account).
        - Investigar posibles restricciones de IP o límites de tasa que puedan estar afectando la clave.
        - Considerar el uso de un proxy o VPN si las restricciones de red son un problema.