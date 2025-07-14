# ggstats

Tu centro de estadísticas de juegos.

## Descripción

**ggstats** es una página web que ofrece estadísticas, análisis y noticias sobre videojuegos, con un diseño moderno, responsivo y soporte para modo claro/oscuro. Incluye animaciones y una experiencia de usuario atractiva.

## Estructura del Proyecto

```
/
├── index.html      # Página principal con la estructura y contenido del sitio
├── style.css       # Hojas de estilo para el diseño, temas y animaciones
├── script.js       # Lógica de interacción, animaciones y modo claro/oscuro
├── CHANGELOG.md    # Historial de cambios del proyecto
```

## Descripción de Archivos

### index.html
- Estructura principal del sitio web.
- Incluye:
  - Encabezado con logo, navegación y botón de cambio de tema.
  - Sección principal (hero) con bienvenida y botón de acción.
  - Sección de noticias con tarjetas de novedades.
  - Sección de estadísticas destacadas.
  - Pie de página con enlaces a redes sociales.
- Carga los estilos desde `style.css` y la lógica desde `script.js`.

### style.css
- Define variables CSS para colores, sombras y estilos generales.
- Soporte para modo claro y oscuro mediante clases (`light-mode`, `dark-mode`).
- Estilos responsivos para dispositivos móviles.
- Animaciones para la aparición de tarjetas (noticias y estadísticas).
- Personalización de botones, navegación y footer.

### script.js
- Añade animaciones a las tarjetas usando Intersection Observer.
- Implementa el cambio de tema (claro/oscuro) con almacenamiento de preferencia en `localStorage`.
- Cambia el ícono del botón de tema según el modo activo.
- Lógica ejecutada al cargar el DOM.

## Tecnologías y Librerías Utilizadas
- **HTML5** y **CSS3**
- **JavaScript** (ES6+)
- [Google Fonts: Roboto](https://fonts.google.com/specimen/Roboto)
- [Font Awesome](https://fontawesome.com/) para íconos sociales y de tema

## Instrucciones de Uso
1. Clona o descarga el repositorio.
2. Abre `index.html` en tu navegador web.
3. El sitio es completamente estático, no requiere backend ni instalación adicional.

## Personalización
- Puedes modificar las secciones de noticias y estadísticas directamente en `index.html`.
- Los estilos y colores pueden ajustarse en `style.css`.
- Para agregar nuevas animaciones o lógica, edita `script.js`.

## Créditos
- Desarrollado por el equipo de ggstats.

---

© 2024 ggstats. Todos los derechos reservados.
