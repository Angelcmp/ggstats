# Metodología de Trabajo — SST v3 Monorepo Project

Este documento resume la metodología y convenciones para trabajar en un monorepo SST v3 con TypeScript y bun workspaces.

## Estructura del Proyecto

- `packages/` — Contiene todos los paquetes del workspace (functions, core, web, etc.)
- `infra/` — Definiciones de infraestructura separadas por servicio (storage.ts, api.ts, web.ts)
- `sst.config.ts` — Configuración principal de SST con imports dinámicos

## Estándares de Código

- Utilizar TypeScript con modo estricto habilitado
- El código compartido debe ir en `packages/core/` y exportarse correctamente
- Las funciones deben ubicarse en `packages/functions/`
- La infraestructura debe dividirse en archivos lógicos dentro de `infra/`

## Convenciones del Monorepo

- Importar módulos compartidos usando los nombres de workspace: `@my-app/core/example`

---

Este archivo sirve como referencia rápida para mantener la coherencia y calidad en el desarrollo del proyecto.