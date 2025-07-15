# Hoja de Ruta para el Desarrollo de GG-Stats

## 1. Análisis y Guía Inicial

### a. Función Principal y Público Objetivo

*   **Función Principal:** Crear una plataforma de análisis y estadísticas de *League of Legends* que no solo presente datos, sino que ofrezca *insights* personalizados y accionables para ayudar a los jugadores a mejorar de manera medible.
*   **Público Objetivo:**
    *   **Jugadores Competitivos (Primario):** Desde Hierro hasta Aspirante, que buscan activamente mejorar su rendimiento, entender el metajuego y analizar sus propias partidas.
    *   **Jugadores Casuales (Secundario):** Interesados en ver sus estadísticas, compararse con amigos y explorar builds populares de forma sencilla.
    *   **Analistas y Entrenadores:** Que necesitan herramientas avanzadas para analizar datos de equipos y jugadores.

### b. Secciones y Funcionalidades Clave

*   **Perfil de Invocador 2.0 (Diferenciador):**
    *   **Dashboard Personalizado:** En lugar de solo mostrar KDA y win rate, el dashboard principal ofrecerá "Tarjetas de Insight" como: "Tu farmeo promedio en los primeros 10 minutos es un 15% inferior al de otros jugadores de tu ELO con este campeón. Haz clic para ver una guía de farmeo".
    *   **Análisis de Tendencias:** Gráficos que muestren la evolución del rendimiento del jugador a lo largo del tiempo (semanas, parches).
    *   **Reconocimiento de Hitos:** Notificaciones y badges por logros ("¡Alcanzaste un KDA de 5 por primera vez con Jinx!", "¡Has ganado 5 partidas seguidas!").

*   **Análisis de Campeones:**
    *   **Estadísticas Estándar:** Win rate, pick rate, ban rate, builds, runas, hechizos.
    *   **Análisis de Matchups Avanzado:** No solo mostrar quién gana más, sino *por qué*. "Contra Garen, los jugadores de Darius que compran 'Cuchilla Negra' como primer objeto ganan un 8% más de partidas".
    *   **Curvas de Poder:** Gráficos interactivos que muestren el win rate de un campeón según la duración de la partida.

*   **Tier Lists Dinámicas:**
    *   **Tier List General:** Basada en el rendimiento global.
    *   **Tier List Personalizada:** "¿Cuál es el mejor campeón para *ti*?". Basándose en el estilo de juego del usuario (agresivo, de farmeo, etc.) y su pool de campeones, la web sugerirá los campeones más fuertes del meta que se adapten a él.

*   **Herramienta de Composición de Equipos (Innovación):**
    *   Un "constructor" donde los usuarios pueden seleccionar campeones para ambos equipos y la herramienta analiza sinergias, counters, tipos de daño (AP/AD), y sugiere los mejores picks para completar la composición.

### c. Mapa de Navegación Básico

*   **Inicio:** Dashboard con un resumen del metajuego y acceso rápido a la búsqueda de invocador.
*   **Campeones:**
    *   Listado de Campeones
    *   Tier Lists
    *   Estadísticas Detalladas (sub-página por campeón)
*   **Rankings:**
    *   Mejores Jugadores (por región)
    *   Rankings de Maestría de Campeones
*   **Herramientas:**
    *   Análisis de Composición de Equipos
*   **Perfil de Invocador (al buscar un nombre):**
    *   Dashboard Personalizado
    *   Historial de Partidas
    *   Estadísticas Detalladas

### d. Mejoras y Diferenciadores Clave

1.  **Insights Accionables:** No solo mostrar datos, sino interpretarlos para el usuario.
2.  **Personalización:** Adaptar la información (Tier Lists, sugerencias) al perfil del jugador.
3.  **Herramientas Predictivas y de Análisis de Equipo:** Ir más allá del análisis individual.
4.  **Gamificación:** Incorporar elementos como logros y badges para aumentar el engagement.

### e. Recomendaciones de Tecnologías

*   **Front-End:**
    *   **Framework:** **React (con Next.js)** o **Vue (con Nuxt.js)**. Next.js es ideal por su renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG), lo que mejora el SEO y el rendimiento inicial.
    *   **Lenguaje:** **TypeScript** para un código más robusto y escalable.
    *   **Estilos:** **Tailwind CSS** para un desarrollo rápido y personalizable. **Styled-Components** si prefieres CSS-in-JS.
    *   **Visualización de Datos:** **D3.js** o **Chart.js** para gráficos interactivos.

*   **Back-End:**
    *   **Lenguaje:** **Node.js (con TypeScript)** o **Python**. Node.js es excelente para aplicaciones I/O intensivas como esta.
    *   **Framework:** **Express.js** o **NestJS** (para Node.js). NestJS ofrece una arquitectura más estructurada y escalable. **FastAPI** si se elige Python.
    *   **Integración con API de Riot:** Usar una librería cliente ya existente para la API de Riot (ej. `riot-lol-api` para Node.js) para simplificar las peticiones y el manejo de rate limits.

*   **Base de Datos:**
    *   **Primaria:** **PostgreSQL**. Es robusta, escalable y excelente para manejar datos relacionales (jugadores, partidas, campeones).
    *   **Caché:** **Redis**. Fundamental para cachear respuestas de la API de Riot y datos pre-calculados, reduciendo la latencia y evitando exceder los rate limits.

### f. Presentación de Datos y UX

*   **Jerarquía Visual Clara:** Lo más importante debe ser lo más grande y visible.
*   **Diseño "Mobile-First":** Diseñar primero para dispositivos móviles y luego escalar a escritorio.
*   **Interactividad:** Permitir al usuario filtrar, ordenar y explorar los datos. Los gráficos deben tener tooltips con información detallada al pasar el ratón.
*   **Consistencia:** Usar una paleta de colores, tipografía e iconografía consistentes en todo el sitio.

### g. Consideraciones Legales y de Privacidad

*   **API de Riot:** Leer y cumplir estrictamente los [Términos de Servicio de la API de Riot](https://developer.riotgames.com/policies/general).
*   **Aviso Legal:** Incluir un aviso visible que indique que el sitio no está afiliado ni respaldado por Riot Games.
*   **Privacidad de Datos:** Ser transparente sobre qué datos se almacenan (IDs de invocador, historial de partidas, etc.). Crear una página de Política de Privacidad. No almacenar datos personales sensibles.

---

## 2. Definición del MVP (Producto Mínimo Viable)

### a. Funcionalidades Esenciales para el Lanzamiento

1.  **Búsqueda y Perfil de Invocador Básico:**
    *   Mostrar rango actual, historial de partidas (últimas 20), y estadísticas básicas (KDA, win rate) por campeón jugado recientemente.
2.  **Listado de Campeones:**
    *   Página con todos los campeones.
    *   Página de detalle por campeón con estadísticas clave (win rate, pick rate, ban rate) y las builds y runas más populares.
3.  **Tier List General:**
    *   Una única Tier List para el parche actual, basada en datos agregados.
4.  **Infraestructura de Recolección de Datos:**
    *   Un script de back-end que obtenga datos de la API de Riot y los almacene en la base de datos.

### b. Iteración y Escalado Post-MVP

*   **Iteración 1 (Mes 1-2):** Implementar el **Perfil de Invocador 2.0** con las "Tarjetas de Insight" y el análisis de tendencias.
*   **Iteración 2 (Mes 3-4):** Desarrollar las **Tier Lists Dinámicas y Personalizadas**.
*   **Iteración 3 (Mes 5-6):** Construir la **Herramienta de Composición de Equipos**.
*   **Continuo:** Mejorar la UX, añadir más filtros, expandir a otros modos de juego (ARAM, Arena).

---

## 3. Planificación y Organización

### a. Estructura de Trabajo (Metodología Ágil - Scrum)

*   **Sprints:** Ciclos de desarrollo de 2 semanas.
*   **Ceremonias:**
    *   **Sprint Planning:** Al inicio de cada sprint, definir las tareas a realizar.
    *   **Daily Standup:** Reunión diaria de 15 minutos para sincronizar.
    *   **Sprint Review:** Al final del sprint, demostrar lo que se ha construido.
    *   **Sprint Retrospective:** Reflexionar sobre qué se puede mejorar en el próximo sprint.

### b. Herramientas de Gestión

*   **Gestión de Tareas:** **Trello**, **Jira** o **Asana**.
*   **Control de Versiones:** **Git**, con repositorios en **GitHub** o **GitLab**.
*   **Comunicación:** **Discord** o **Slack**.

---

## 4. Diseño y Arquitectura

### a. Diseño Visual y Arquitectura de la Información

*   **Inspiración:** Analizar no solo League of Graphs, sino también sitios de análisis de otros juegos (ej. Dotabuff, Valorant Tracker) y aplicaciones de finanzas o deportes (que son excelentes en visualización de datos).
*   **Wireframes y Mockups:** Usar herramientas como **Figma** o **Sketch** para diseñar la interfaz antes de escribir una sola línea de código.

### b. Diseño Responsive y Accesibilidad

*   **Responsive:** Usar Flexbox y Grid en CSS para crear layouts fluidos. Probar en múltiples tamaños de pantalla.
*   **Accesibilidad (a11y):**
    *   Usar HTML semántico (`<nav>`, `<main>`, `<article>`).
    *   Asegurar un buen contraste de colores.
    *   Añadir atributos `alt` a las imágenes y `aria-label` a los iconos.

---

## 5. Desarrollo e Implementación

### a. Pasos Iniciales

1.  **Registrar Producto en el Portal de Desarrolladores de Riot** para obtener una clave de API.
2.  **Configurar el Repositorio en GitHub:** Crear ramas `main` y `develop`.
3.  **Inicializar el Proyecto (Next.js):** `npx create-next-app@latest --typescript`.
4.  **Configurar el Back-End:** Inicializar un proyecto de Node.js/Express o NestJS.
5.  **Configurar la Base de Datos y el Caché.**

### b. Integración con la API de Riot

*   **Manejo de Rate Limits:** Es el mayor desafío. Implementar un sistema de cola (usando Redis) para espaciar las peticiones a la API y no exceder los límites.
*   **Almacenamiento de Datos:** No pedir los mismos datos dos veces. Una vez que se obtiene el historial de una partida, guardarlo en la base de datos para futuros análisis.
*   **Scripts de Actualización:** Crear scripts que se ejecuten periódicamente (cron jobs) para actualizar los datos de los jugadores activos y las estadísticas globales de los campeones.

### c. Buenas Prácticas

*   **Variables de Entorno:** Guardar claves de API y credenciales de la base de datos en un archivo `.env` y nunca subirlas al repositorio.
*   **Testing:** Escribir tests unitarios para la lógica de negocio (cálculos de estadísticas) y tests de integración para las rutas de la API.
*   **Linting y Formateo:** Usar **ESLint** y **Prettier** para mantener un código limpio y consistente.

---

## 6. Lanzamiento y Mejora Continua

### a. Estrategias de Lanzamiento

*   **Beta Cerrada:** Invitar a un grupo pequeño de jugadores a probar el sitio (MVP) y dar feedback.
*   **Lanzamiento en Comunidades:** Anunciar el lanzamiento en subreddits como `r/leagueoflegends`, foros y servidores de Discord.
*   **Creación de Contenido:** Escribir artículos de blog o crear infografías interesantes basadas en los datos del sitio para atraer usuarios ("Análisis del metajuego del Parche 14.12").

### b. Recopilación de Feedback

*   **Botón de Feedback:** Un botón simple en el sitio para que los usuarios puedan reportar bugs o sugerir mejoras.
*   **Encuestas:** Realizar encuestas periódicas para entender las necesidades de los usuarios.
*   **Analíticas Web:** Usar herramientas como **Google Analytics** o **Plausible** para entender cómo los usuarios interactúan con el sitio.

### c. Ideas para el Futuro

*   **Análisis de Video (muy avanzado):** Permitir a los usuarios subir sus repeticiones y usar machine learning para analizar su posicionamiento, uso de habilidades, etc.
*   **Integración con Discord:** Crear un bot de Discord que permita a los usuarios consultar sus estadísticas directamente desde su servidor.
*   **Expansión a otros juegos de Riot:** Reutilizar la arquitectura para crear versiones del sitio para *Valorant* o *Teamfight Tactics*.
