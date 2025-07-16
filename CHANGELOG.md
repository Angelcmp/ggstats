# Changelog

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