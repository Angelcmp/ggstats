# Tareas Pendientes - ggstats

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

## Prioridad Alta (Pendiente)

- [ ] **Investigar y Resolver el Error de Autorización de Riot API (401/403):**
    - **Estado Actual:** El problema persiste a pesar de la verificación de la clave y el cambio de región. Se ha decidido pivotar a Dota 2 por ahora, pero esta tarea sigue siendo relevante si se retoma la integración con Riot API.
    - **Acciones Pendientes:**
        - Reconfirmar la validez y permisos de la clave de desarrollo de Riot API para todas las APIs relevantes (LoL, Valorant, Account).
        - Investigar posibles restricciones de IP o límites de tasa que puedan estar afectando la clave.
        - Considerar el uso de un proxy o VPN si las restricciones de red son un problema.

## Próximas Funcionalidades (Dota 2)

- [x] **Backend (NestJS):**
    - [x] Explorar y añadir más endpoints de OpenDota API (ej. héroes, partidas detalladas).
    - [x] Implementar caché para las llamadas a la API de OpenDota.
    - [x] Definir DTOs para los datos de Dota 2.
- [x] **Frontend (Next.js):**
    - [x] Crear componentes para mostrar los datos de jugadores de Dota 2.
    - [x] Integrar los nuevos componentes en la interfaz de usuario.
    - [x] Diseñar y estilizar las vistas de perfil de jugador y estadísticas de Dota 2.

## Próximas Funcionalidades (General)

- [ ] **Configurar Pruebas Automatizadas:**
    - [ ] Backend (NestJS): Configurar un framework de pruebas (ej. Jest) y escribir pruebas unitarias/de integración para los servicios y controladores.
    - [ ] Frontend (Next.js): Configurar un framework de pruebas (ej. Jest, React Testing Library) y escribir pruebas de componentes/integración.

- [ ] **Refactorizar y Limpiar Código:**
    - [ ] Revisar y mejorar la estructura del código, aplicando principios SOLID y patrones de diseño.
    - [ ] Eliminar código comentado o temporal.