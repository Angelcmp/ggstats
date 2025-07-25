import { HeroDto } from './hero.dto';

export class ItemPopularityDto {
  item: string;
  games_played: number;
  wins: number;
}

export class HeroCompleteStatsDto extends HeroDto {
  matchups: any[]; // Define a more specific DTO if needed
  item_popularity: ItemPopularityDto[];
}
