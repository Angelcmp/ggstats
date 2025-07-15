# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ggstats** is a static gaming statistics website built with vanilla HTML, CSS, and JavaScript. The project features a modern, responsive design for "Synapse Gaming" - a gaming analysis application with dark/light mode support and animated UI components.

## Development Commands

Since this is a static website project, there are no build tools or package managers configured. Development is straightforward:

- **Local Development**: Open `index.html` directly in a web browser
- **Live Server**: Use any static file server (e.g., VS Code Live Server extension, Python's `http.server`, or Node's `live-server`)

## Code Architecture

### Core Components
- **index.html**: Main HTML structure with semantic sections (hero, features, social proof, tier lists, CTA, footer)
- **style.css**: CSS-based design system with CSS custom properties for theming
- **script.js**: Theme toggle functionality with localStorage persistence

### Design System
- **CSS Variables**: Comprehensive theming system in `:root`, `.dark-mode`, and `.light-mode` classes
- **Responsive Design**: Mobile-first approach with breakpoints at 700px and 1024px
- **Animation Framework**: CSS transitions and hover effects for interactive elements

### Theme System
The application uses a sophisticated CSS variable-based theming system:
- Default theme: Dark mode
- Theme persistence: localStorage with 'theme' key
- Theme toggle: Animated button with emoji icons (🌚/🌞)
- Smooth transitions: All theme changes are animated

### External Dependencies
- **Google Fonts**: Montserrat (headings) and Inter (body text)
- **Font Awesome 6.4.2**: Icons for UI elements and social media
- **Assets**: Logo files, demo images, and champion cards (referenced but not included)

## File Structure Guidelines

### HTML (index.html:1-183)
- Semantic HTML5 structure
- Spanish language content
- Accessibility considerations (aria-labels, alt attributes)
- CDN-based external resources

### CSS (style.css:1-582)
- Organized in logical sections with clear comments
- CSS custom properties for consistent theming
- Mobile-responsive grid layouts
- Comprehensive button and card component styles

### JavaScript (script.js:1-46)
- DOM-ready pattern with event listeners
- Theme state management with localStorage
- Animated theme transitions using CSS classes

## Development Guidelines

### Theme Implementation
- All colors should use CSS custom properties from the design system
- New components should support both light and dark modes
- Theme transitions should be smooth and consistent

### Responsive Design
- Follow mobile-first approach
- Test components at 700px and 1024px breakpoints
- Ensure touch targets are minimum 44px for mobile

### Performance Considerations
- Minimize external dependencies
- Optimize images in `assets/` directory
- Use efficient CSS selectors and avoid deep nesting

## Content Management

### Sections Structure
1. **Navigation**: Sticky header with logo, nav links, and theme toggle
2. **Hero**: Main call-to-action with background overlay
3. **Features**: 4-card grid showcasing application capabilities
4. **How It Works**: Image/text layout explaining the process
5. **Social Proof**: Statistics counters and media logos
6. **Tier Lists**: Champion card preview section
7. **Final CTA**: Gradient background call-to-action
8. **Footer**: Multi-column layout with links and social media

### Asset Requirements
- Logo files: `assets/logo-synapse.svg`
- Demo image: `assets/demo-dashboard.png`
- Champion cards: `assets/champ1-5.png`
- Media logos: `assets/logo-ign.svg`, `assets/logo-twitch.svg`, `assets/logo-pcgamer.svg`
- Hero background: `assets/hero-bg.jpg`

## Methodology References

The project includes documentation files that provide context for development approaches:
- **agents.md**: SST v3 monorepo methodology (not applicable to this static site)
- **prompt-coding.md**: AI agent coding methodology
- **prompt.md**: AI prompt optimization techniques

These files serve as reference material but don't directly apply to the static website architecture.