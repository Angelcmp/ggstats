# Changelog

## 2025-07-17

### Fixed

- Resolved `@nestjs/config` module not found error in `packages/api` by installing the dependency.
- Fixed `PrismaClient` initialization error by running `bunx prisma generate`.
- Corrected `EADDRINUSE` error by changing NestJS API port from 3001 to 3002 in `packages/api/src/main.ts`.
- Addressed `TypeError: undefined is not an object` for `AppService` and `RiotApiService` by:
  - Correcting `RiotApiService` import path in `packages/api/src/riot-api/riot-api.controller.ts`.
  - Enabling `emitDecoratorMetadata` and `experimentalDecorators` in `packages/api/tsconfig.json`.
- Implemented Redis caching logic in `packages/api/src/riot-api/riot-api.service.ts` for Riot API calls.
- Fixed Next.js frontend errors in `packages/web`:
  - Added `"use client";` directive to `src/app/page.tsx` and `src/components/SummonerSearch.tsx`.
  - Corrected `globals.css` import path in `src/app/layout.tsx`.

### Pending

- **Riot API Key Authorization Issue:** Still receiving `401 Unauthorized` or `403 Forbidden` errors when fetching summoner data from Riot API, despite key updates. Requires further investigation into API key validity, region, or potential rate limiting/IP restrictions.

## 2025-07-16

### Added

- Initial monorepo setup with Bun workspaces.
- NestJS backend in `packages/api`:
  - Core NestJS structure (AppModule, AppController, AppService).
  - Riot Games API integration using `@fightmegg/riot-api`.
  - Prisma ORM for PostgreSQL integration (with `User` model).
  - Redis integration using `ioredis` for caching and rate limiting.
  - Environment variable configuration for Riot API Key, PostgreSQL, and Redis.
- Next.js frontend in `packages/web`:
  - Scaffolded Next.js application with TypeScript, Tailwind CSS, and ESLint.
  - Cleaned up boilerplate files.
  - Implemented basic UI components (SummonerSearch).
  - Connected frontend to backend for summoner data retrieval.

## 2025-07-04

### Added

- Implement dark/light mode toggle and improve card animations.