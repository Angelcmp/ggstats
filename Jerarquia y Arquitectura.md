# Arquitectura y Jerarquía del Proyecto `ggstats`

Este documento detalla la arquitectura general y la jerarquía de directorios del proyecto `ggstats`, basándose en el análisis de sus archivos y dependencias.

## 1. Visión General del Proyecto

El proyecto `ggstats` es una **monorepo** que utiliza **Bun** como runtime y gestor de paquetes. Está diseñado para ser una aplicación de estadísticas de juegos, con un enfoque inicial en Dota 2 y Riot Games. La arquitectura se divide en componentes de backend y frontend, permitiendo un desarrollo y despliegue modular.

## 2. Tecnologías Clave por Componente

### Proyecto General (`/home/angel/ggstats`)
*   **Runtime/Gestor de Paquetes:** `Bun`

### Componente API (`packages/api`)
*   **Framework:** `NestJS` (TypeScript)
*   **ORM de Base de Datos:** `Prisma`
*   **Cliente de Caché/Redis:** `ioredis`, `@nestjs/cache-manager`, `cache-manager`
*   **APIs Externas:** `@fightmegg/riot-api` (para Riot Games), integración personalizada para Dota 2.
*   **Validación/Transformación:** `class-validator`, `class-transformer`

### Componente Web (`packages/web`)
*   **Framework Frontend:** `Next.js` (React, TypeScript)
*   **Estilos CSS:** `Tailwind CSS`
*   **Gráficos:** `recharts`
*   **Linting:** `eslint`, `eslint-config-next`

### Herramientas de Desarrollo/Documentación
*   **Control de Versiones:** `Git`
*   **Documentación:** Archivos Markdown (`.md`)
*   **Agente de Codificación:** `Serena` (instalado en el directorio `serena/`)

## 3. Jerarquía Detallada de Directorios

### Jerarquía General del Proyecto

```
/home/angel/ggstats/
├── .git/                   # Repositorio Git
├── .gitignore              # Archivo de configuración de Git
├── node_modules/           # Dependencias de Node.js/Bun (a nivel de monorepo)
├── packages/               # Contenedor para subproyectos (monorepo)
│   ├── api/                # Subproyecto de Backend
│   └── web/                # Subproyecto de Frontend
├── serena/                 # Repositorio de la herramienta Serena
├── bun.config.js           # Configuración global de Bun
├── bun.lock                # Archivo de bloqueo de dependencias de Bun
├── CHANGELOG.md            # Registro de cambios del proyecto
├── CLAUDE.md               # Documentación específica de Claude
├── ggstats.md              # Documentación general del proyecto
├── package.json            # Dependencias y scripts a nivel de monorepo
├── prompt-coding.md        # Documentación sobre prompts de codificación
├── prompt.md               # Documentación sobre prompts
├── README.md               # Documentación principal del proyecto
└── todo.md                 # Lista de tareas pendientes
```

### Jerarquía Detallada de `packages/api` (Backend)

```
pac
kages/api/
├── .env                    # Variables de entorno
├── .gitignore              # Gitignore para el subproyecto API
├── CLAUDE.md               # Documentación específica de Claude para API
├── index.ts                # Punto de entrada del módulo (Bun)
├── jest-e2e.json           # Configuración de Jest para pruebas E2E
├── jest.config.js          # Configuración de Jest
├── package.json            # Dependencias y scripts del subproyecto API
├── README.md               # README del subproyecto API
├── tsconfig.json           # Configuración de TypeScript
├── dist/                   # Directorio de salida de la compilación
├── prisma/                 # Configuración y migraciones de Prisma
│   ├── schema.prisma       # Esquema de la base de datos
│   └── migrations/         # Migraciones de la base de datos
│       ├── migration_lock.toml
│       └── 20250716215204_init/ # Ejemplo de migración
└── src/                    # Código fuente del subproyecto API
    ├── app.controller.ts   # Controlador principal de la aplicación NestJS
    ├── app.module.ts       # Módulo principal de la aplicación NestJS
    ├── app.service.ts      # Servicio principal de la aplicación NestJS
    ├── main.ts             # Punto de entrada de la aplicación (bootstrap de NestJS)
    ├── dota2/              # Módulo para la lógica de Dota 2
    │   ├── dota2.controller.ts
    │   ├── dota2.module.ts
    │   ├── dota2.service.ts
    │   └── dto/            # Data Transfer Objects para Dota 2
    ├── generated/          # Código generado (probablemente por Prisma)
    │   └── prisma/
    ├── prisma/             # Módulo de integración de Prisma
    │   ├── prisma.module.ts
    │   └── prisma.service.ts
    ├── redis/              # Módulo de integración de Redis
    │   ├── redis.module.ts
    │   └── redis.service.ts
    └── riot-api/           # Módulo para la lógica de Riot API
```

### Jerarquía Detallada de `packages/web` (Frontend)

```
packages/web/
├── next-env.d.ts           # Definiciones de tipos para Next.js
├── next.config.mjs         # Configuración de Next.js
├── package.json            # Dependencias y scripts del subproyecto Web
├── postcss.config.mjs      # Configuración de PostCSS
├── tailwind.config.ts      # Configuración de Tailwind CSS
├── tsconfig.json           # Configuración de TypeScript
├── .next/                  # Directorio de compilación de Next.js
│   ├── app-build-manifest.json
│   ├── build-manifest.json
│   ├── package.json
│   ├── react-loadable-manifest.json
│   ├── trace
│   ├── cache/
│   ├── server/
│   ├── static/
│   └── types/
├── node_modules/           # Dependencias de Node.js/Bun (a nivel de subproyecto)
├── public/                 # Activos estáticos
├── src/                    # Código fuente del subproyecto Web
│   ├── app/                # Directorio principal de la aplicación Next.js (App Router)
│   │   ├── dota2/          # Ruta para información específica de Dota 2
│   │   │   ├── ...         # Contiene subrutas o páginas relacionadas con Dota 2
│   │   ├── heroes/         # Ruta para información de héroes (Dota 2 o Riot)
│   │   │   ├── ...
│   │   ├── items/          # Ruta para información de ítems (Dota 2 o Riot)
│   │   │   ├── ...
│   │   ├── matches/        # Ruta para información de partidas (Dota 2 o Riot)
│   │   │   ├── ...
│   │   ├── meta-heroes/    # Ruta para meta-héroes (probablemente análisis de héroes en el meta actual)
│   │   │   ├── ...
│   │   ├── layout.tsx      # Layout principal de la aplicación (Next.js App Router)
│   │   └── page.tsx        # Página principal/raíz de la aplicación (Next.js App Router)
│   └── components/         # Componentes React reutilizables
│       ├── Hero/           # Componentes relacionados con héroes
│       │   ├── ...
│       ├── Dota2Search.tsx # Componente para la funcionalidad de búsqueda de Dota 2
│       └── Navbar.tsx      # Componente de la barra de navegación
└── styles/                 # Estilos globales
    └── globals.css
```

## 4. Flujo de Datos Hipotetizado

1.  El usuario interactúa con la **aplicación web (Next.js/React)**.
2.  La aplicación web realiza solicitudes a la **API de `packages/api`**.
3.  La API de `packages/api` procesa las solicitudes, interactúa con la **base de datos (Prisma)**, utiliza **Redis** para caché y se comunica con las **APIs de Dota 2 y Riot Games**.
4.  La API devuelve los datos al frontend.
5.  El frontend utiliza **`recharts`** para visualizar los datos (por ejemplo, gráficos de ventaja de oro/experiencia de Dota 2).

Esta estructura modular permite un desarrollo y despliegue independientes de las partes del frontend y el backend, lo que es una ventaja de las monorepos bien organizadas.
