# Arquitectura del Proyecto GGStats

Este documento describe la arquitectura general del proyecto GGStats, cubriendo tanto el backend (API) como el frontend (Web), las tecnologías utilizadas y los patrones de diseño implementados.

## 1. Visión General: Arquitectura Monorepo

El proyecto está estructurado como un **monorepo**, gestionado con `bun`. Esto significa que un único repositorio de código fuente contiene múltiples subproyectos o "paquetes" (`packages/api` y `packages/web`).

-   **Herramienta de Gestión:** `bun` se utiliza para la gestión de dependencias y la ejecución de scripts, configurado a través de `bun.config.js`.
-   **Ventajas Clave:**
    -   **Código Compartido:** Facilita la compartición de lógica, tipos (ej. DTOs) o componentes entre la API y la web, evitando la duplicación.
    -   **Gestión Centralizada:** Permite configurar herramientas de desarrollo (linters, formateadores) una sola vez a nivel raíz.
    -   **Desarrollos Atómicos:** Los cambios que afectan tanto al backend como al frontend se pueden realizar en un único commit, mejorando la trazabilidad.

---

## 2. Backend (`packages/api`)

El backend está construido con **NestJS**, un framework de Node.js para crear aplicaciones del lado del servidor eficientes y escalables. Actúa principalmente como un **Backend for Frontend (BFF)**.

### 2.1. Rol: Backend for Frontend (BFF)

La API sirve como un intermediario robusto entre el frontend y los servicios externos (APIs de Dota 2, Riot Games, etc.).

-   **Seguridad:** Oculta las claves de API (API Keys) de terceros. El frontend nunca tiene acceso directo a ellas.
-   **Eficiencia:** Agrega y transforma datos de múltiples fuentes en un solo endpoint, optimizando las peticiones desde el cliente.
-   **Adaptación de Datos:** Procesa y moldea los datos externos al formato exacto que el frontend necesita, simplificando la lógica en la interfaz de usuario.

### 2.2. Estructura y Principios

La API sigue una arquitectura modular y se adhiere a principios de diseño de software sólidos.

-   **Framework:** NestJS (TypeScript).
-   **Principios SOLID:**
    -   **Single Responsibility (SRP):** Las clases tienen responsabilidades únicas y bien definidas:
        -   **Controladores (`*.controller.ts`):** Manejan las peticiones HTTP, validan la entrada y delegan la lógica de negocio. Definen los **endpoints** de la API.
        -   **Servicios (`*.service.ts`):** Contienen la lógica de negocio principal (ej. comunicarse con APIs externas, realizar cálculos).
        -   **Módulos (`*.module.ts`):** Agrupan controladores y servicios relacionados, gestionando la inyección de dependencias.
    -   **Dependency Inversion (DIP):** NestJS utiliza **Inyección de Dependencias (DI)** de forma nativa. Los servicios y otras dependencias se "inyectan" en las clases a través de sus constructores en lugar de ser instanciados directamente.
-   **Patrones de Diseño:**
    -   **Decorador:** Usado extensivamente (`@Controller`, `@Injectable`, `@Get`) para añadir metadatos y funcionalidades a las clases de forma declarativa.
    -   **Módulo:** Encapsula un conjunto de funcionalidades, promoviendo una arquitectura organizada.
    -   **Singleton:** Los servicios son singletons por defecto, asegurando que solo exista una instancia de ellos en toda la aplicación.

### 2.3. Data Transfer Objects (DTOs)

Los DTOs (`packages/api/src/dota2/dto/`) definen la estructura de los datos que se transfieren entre el cliente y el servidor. Proporcionan contratos de datos claros y facilitan la validación.

### 2.4. Persistencia y Caching

-   **Base de Datos (Prisma):**
    -   **ORM:** Se utiliza Prisma como ORM para interactuar con la base de datos.
    -   **Schema:** `prisma/schema.prisma` es la fuente de verdad para el modelo de datos.
    -   **Migraciones:** Los cambios en el esquema se gestionan de forma segura con `prisma migrate`.
    -   **Cliente Tipado:** `prisma generate` crea un cliente con tipos seguros para realizar consultas a la base de datos.
-   **Caching (Redis):**
    -   La presencia de un módulo de Redis (`src/redis/`) indica el uso de caching para mejorar el rendimiento.
    -   **Flujo:** Las peticiones primero consultan Redis. Si los datos existen, se devuelven instantáneamente. Si no, se obtienen de la fuente original (ej. API de Dota 2), se almacenan en Redis para futuras peticiones y se devuelven al cliente. Esto reduce la latencia y el consumo de las APIs externas.

### 2.5. Pruebas

-   **Framework:** **Jest** es el framework utilizado para las pruebas, configurado en `jest.config.js`.
-   **Tipos de Pruebas:**
    -   **Unitarias (`*.spec.ts`):** Prueban unidades de código aisladas (ej. un método de un servicio).
    -   **Integración/End-to-End (`*-e2e.spec.ts`):** Prueban el flujo completo de una petición a través de varias capas (controlador -> servicio), como se configura en `jest-e2e.json`.

---

## 3. Frontend (`packages/web`)

El frontend es una aplicación web moderna construida con **Next.js** (un framework de React).

### 3.1. Framework y Arquitectura

-   **Framework:** Next.js con **App Router**.
-   **Rutas:** La estructura de carpetas en `src/app/` define las rutas de la aplicación (ej. `src/app/heroes/page.tsx` se mapea a la URL `/heroes`).
-   **Renderizado:** Utiliza **React Server Components (RSC)** por defecto. Los componentes se renderizan en el servidor para un mejor rendimiento y SEO. Se debe usar la directiva `"use client"` para componentes que requieran interactividad en el navegador (hooks, eventos).

### 3.2. Estilos Visuales

-   **Framework CSS:** **Tailwind CSS**.
-   **Configuración:** `tailwind.config.ts` define el sistema de diseño (colores, fuentes, espaciado).
-   **Estilos Globales:** `styles/globals.css` contiene los estilos base y las directivas de Tailwind.
-   **Aplicación:** Los estilos se aplican mediante clases de utilidad directamente en los atributos `className` de los componentes JSX/TSX.

### 3.3. Dependencias

Las dependencias del frontend están listadas en `packages/web/package.json`. Incluyen librerías clave como:
-   `react`, `react-dom`
-   `next`
-   `tailwindcss`
-   Librerías de visualización de datos como `recharts` o `d3` para los gráficos.

---

## 4. Flujo de Trabajo: Añadir una Nueva Funcionalidad

Para ilustrar cómo estas piezas encajan, a continuación se describe un flujo de trabajo típico para añadir una nueva funcionalidad (ej. "mostrar el ítem más popular de la semana").

1.  **Backend (`packages/api`):**
    -   **Modelo de Datos (si es necesario):** Si la información debe persistir, se añade un nuevo modelo al `schema.prisma`.
    -   **Migración:** Se ejecutan los comandos `bunx prisma migrate dev` y `bunx prisma generate` para actualizar la base de datos y el cliente de Prisma.
    -   **DTO:** Se crea un nuevo DTO (ej. `popular-item.dto.ts`) para definir la forma de los datos de respuesta.
    -   **Lógica de Negocio:** En el servicio correspondiente (ej. `dota2.service.ts`), se implementa un método (`getPopularItem()`) que obtiene, calcula o procesa los datos.
    -   **Endpoint:** En el controlador (`dota2.controller.ts`), se crea un nuevo endpoint (`@Get('popular-item')`) que expone la funcionalidad a través de la API.

2.  **Frontend (`packages/web`):**
    -   **Ruta:** Se crea una nueva estructura de carpetas en `src/app/` (ej. `src/app/dota2/popular-item/`).
    -   **Página:** Dentro de la nueva carpeta, se crea el archivo `page.tsx`.
    -   **Obtención de Datos:** En el componente `page.tsx`, se realiza una llamada `fetch` al nuevo endpoint de la API (`/api/dota2/popular-item`) para obtener los datos.
    -   **Interfaz de Usuario (UI):** Se crea un componente de React para visualizar los datos obtenidos de una manera clara y atractiva para el usuario.
