# Tareas Pendientes - ggstats

## Prioridad Alta

- [ ] **Investigar y Resolver el Error de Autorización de Riot API (401/403):**
    - **Causa:** La clave de desarrollo de Riot API sigue resultando en errores de autorización (`401 Unauthorized` o `403 Forbidden`) a pesar de las actualizaciones y la verificación de la carga de la clave.
    - **Acciones:**
        - [ ] Confirmar la validez y vigencia de la clave de desarrollo de Riot API (generar una nueva si es necesario).
        - [ ] Verificar que la clave se esté cargando correctamente en `RiotApiService` (ya se añadió un `console.log` para esto).
        - [ ] Investigar posibles restricciones de IP o límites de tasa que puedan estar afectando la clave.
        - [ ] Considerar el uso de un proxy si las restricciones de red son un problema.
        - [ ] Explorar alternativas para obtener datos de invocador por nombre si la librería `@fightmegg/riot-api` no lo soporta directamente y la llamada `fetch` sigue fallando.

## Próximas Funcionalidades (Perfil de Invocador 2.0)

- [ ] **Backend (NestJS):**
    - [ ] Crear un nuevo módulo para el análisis de perfil (`profile-analysis`).
    - [ ] Definir el DTO para las "Tarjetas de Insight".
    - [ ] Implementar la lógica para generar "Tarjetas de Insight" a partir de los datos de partidas.
    - [ ] Crear un nuevo endpoint en la API para servir las "Tarjetas de Insight".
- [ ] **Frontend (Next.js):**
    - [ ] Crear un nuevo componente para mostrar las "Tarjetas de Insight".
    - [ ] Integrar el nuevo componente en la página del perfil de invocador.
    - [ ] Realizar la llamada a la API para obtener los datos de las "Tarjetas de Insight".
    - [ ] Diseñar y estilizar las "Tarjetas de Insight" para que sean visualmente atractivas.

## Otras Tareas

- [ ] **Configurar Pruebas Automatizadas:**
    - [ ] Backend (NestJS): Configurar un framework de pruebas (ej. Jest) y escribir pruebas unitarias/de integración.
    - [ ] Frontend (Next.js): Configurar un framework de pruebas (ej. Jest, React Testing Library) y escribir pruebas de componentes/integración.
