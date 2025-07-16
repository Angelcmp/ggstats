# ggstats

Tu centro de estadísticas de juegos para League of Legends.

## Descripción

**ggstats** es una plataforma de análisis y estadísticas de League of Legends, construida como un monorepo para ofrecer una experiencia moderna, escalable y con soporte para modo claro/oscuro. El proyecto está diseñado para proporcionar insights personalizados y accionables a los jugadores.

## Estructura del Proyecto

Este proyecto es un monorepo gestionado con [Bun Workspaces](https://bun.sh/docs/workspaces), que contiene las siguientes aplicaciones:

```
/
├── packages/
│   ├── api/          # Backend (NestJS) para la lógica de negocio y la API de Riot Games.
│   └── web/          # Frontend (Next.js) para la interfaz de usuario.
├── infra/            # Definiciones de infraestructura (futuras).
├── bun.config.js     # Configuración de Bun.
├── package.json      # Configuración del monorepo y workspaces.
├── CHANGELOG.md      # Historial de cambios del proyecto.
├── log_diario.md     # Registro de desarrollo y tareas pendientes.
└── README.md         # Este archivo.
```

## Tecnologías Clave

*   **Monorepo:** [Bun Workspaces](https://bun.sh/docs/workspaces)
*   **Backend:** [NestJS](https://nestjs.com/) (TypeScript)
    *   **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
    *   **ORM:** [Prisma](https://www.prisma.io/)
    *   **Caché/Rate Limiting:** [Redis](https://redis.io/)
    *   **API de Riot Games:** [`@fightmegg/riot-api`](https://github.com/fightmegg/riot-api)
*   **Frontend:** [Next.js](https://nextjs.org/) (React, TypeScript)
    *   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)

## Configuración Inicial

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/Angelcmp/ggstats.git
    cd ggstats
    ```
2.  **Instala las dependencias del monorepo:**
    ```bash
    bun install
    ```
3.  **Configura tu clave de la API de Riot Games:**
    *   Obtén una clave de API de desarrollo en el [Portal de Desarrolladores de Riot Games](https://developer.riotgames.com/).
    *   Crea un archivo `.env` en `packages/api/` y añade tu clave:
        ```
        RIOT_API_KEY=TU_CLAVE_DE_API_DE_RIOT
        ```
4.  **Configura PostgreSQL:**
    *   Asegúrate de tener una instancia de PostgreSQL ejecutándose.
    *   Actualiza la `DATABASE_URL` en `packages/api/.env` con tus credenciales de PostgreSQL. Ejemplo:
        ```
        DATABASE_API="postgresql://user:password@localhost:5432/ggstats_db"
        ```
    *   Ejecuta las migraciones de Prisma para configurar la base de datos:
        ```bash
        cd packages/api
        bun prisma migrate dev --name init
        cd ../.. # Vuelve a la raíz del monorepo
        ```
5.  **Configura Redis:**
    *   Asegúrate de tener una instancia de Redis ejecutándose (por defecto en `localhost:6379`).
    *   Si tu configuración de Redis es diferente, actualiza `REDIS_HOST`, `REDIS_PORT` y `REDIS_PASSWORD` en `packages/api/.env`.

## Cómo Iniciar la Aplicación

Para ejecutar la aplicación, necesitarás iniciar el backend y el frontend en terminales separadas.

1.  **Iniciar el Backend (NestJS API):**
    *   Abre una nueva terminal.
    *   Navega al directorio `packages/api`:
        ```bash
        cd packages/api
        ```
    *   Inicia la aplicación NestJS:
        ```bash
        bun start
        ```
    *   La API debería estar corriendo en `http://localhost:3001`.

2.  **Iniciar el Frontend (Next.js Web):**
    *   Abre otra nueva terminal.
    *   Navega al directorio `packages/web`:
        ```bash
        cd packages/web
        ```
    *   Inicia el servidor de desarrollo de Next.js:
        ```bash
        bun dev
        ```
    *   El frontend debería estar corriendo en `http://localhost:3000`.

Una vez que ambos estén corriendo, abre tu navegador en `http://localhost:3000`.

## Créditos

*   Desarrollado por el equipo de ggstats.

---

© 2024 ggstats. Todos los derechos reservados.