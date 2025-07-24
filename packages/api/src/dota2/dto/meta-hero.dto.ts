export class MetaHeroMmrStatsDto {
  pick_rate: number;
  win_rate: number;
  tier: number; // 1-4
  tier_description: string; // Alto, Bueno, Medio, Bajo
}

export class MetaHeroDto {
  id: number;
  name: string;
  img: string;
  roles: string[];
  // Stats for each MMR bracket (0-7)
  mmr_stats: {
    [key: string]: MetaHeroMmrStatsDto; // e.g., "herald": { pick_rate: ..., win_rate: ..., tier: ... }
  };
}
