import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchPlayerDto } from './dto/search-player.dto';
import { PlayerStatsDto } from './dto/player-stats.dto';
import { PlayerWinLossDto } from './dto/player-win-loss.dto';
import { RecentMatchesDto } from './dto/recent-matches.dto';
import { HeroDto } from './dto/hero.dto';
import { MatchDetailsDto } from './dto/match-details.dto';
import { ItemDto } from './dto/item.dto';
import { AbilityDto } from './dto/ability.dto';
import { MetaHeroDto } from './dto/meta-hero.dto';
import { HeroCompleteStatsDto } from './dto/hero-complete-stats.dto';

@Injectable()
export class Dota2Service {
  private readonly OPENDOTA_API_BASE_URL = 'https://api.opendota.com/api';

  constructor(private configService: ConfigService) {}

  async searchPlayer(playerName: string): Promise<SearchPlayerDto[]> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/search?q=${playerName}`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('[Dota2Service] Error searching player:', error);
      throw error;
    }
  }

  async getPlayerStats(accountId: number): Promise<PlayerStatsDto> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/players/${accountId}`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('[Dota2Service] Error fetching player stats:', error);
      throw error;
    }
  }

  async getPlayerWinLoss(accountId: number): Promise<PlayerWinLossDto> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/players/${accountId}/wl`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('[Dota2Service] Error fetching player win/loss:', error);
      throw error;
    }
  }

  async getPlayerRecentMatches(accountId: number): Promise<RecentMatchesDto[]> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/players/${accountId}/recentMatches`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('[Dota2Service] Error fetching player recent matches:', error);
      throw error;
    }
  }

  async getHeroes(): Promise<HeroDto[]> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/heroes`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('[Dota2Service] Error fetching heroes:', error);
      throw error;
    }
  }

  async getMatchDetails(matchId: number): Promise<MatchDetailsDto> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/matches/${matchId}`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('[Dota2Service] Error fetching match details:', error);
      throw error;
    }
  }

  async getItems(): Promise<Record<string, ItemDto>> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/constants/items`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('[Dota2Service] Error fetching items:', error);
      throw error;
    }
  }

  async getHeroStats(lobbyType?: number, date?: number): Promise<any[]> {
    try {
      let url = `${this.OPENDOTA_API_BASE_URL}/heroStats`;
      const params = new URLSearchParams();
      if (lobbyType !== undefined) {
        params.append('lobby_type', lobbyType.toString());
      }
      if (date !== undefined) {
        params.append('date', date.toString());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('[Dota2Service] Error fetching hero stats:', error);
      throw error;
    }
  }

  async getHeroCompleteStats(heroId: number): Promise<HeroCompleteStatsDto> {
    try {
      const [heroStatsResponse, matchupsResponse, itemPopularityResponse] = await Promise.all([
        fetch(`${this.OPENDOTA_API_BASE_URL}/heroStats`),
        fetch(`${this.OPENDOTA_API_BASE_URL}/heroes/${heroId}/matchups`),
        fetch(`${this.OPENDOTA_API_BASE_URL}/heroes/${heroId}/itemPopularity`),
      ]);

      if (!heroStatsResponse.ok) {
        throw new Error(`OpenDota API Error (heroStats): ${heroStatsResponse.status} - ${heroStatsResponse.statusText}`);
      }
      if (!matchupsResponse.ok) {
        throw new Error(`OpenDota API Error (matchups): ${matchupsResponse.status} - ${matchupsResponse.statusText}`);
      }
      if (!itemPopularityResponse.ok) {
        throw new Error(`OpenDota API Error (itemPopularity): ${itemPopularityResponse.status} - ${itemPopularityResponse.statusText}`);
      }

      const allHeroStats: any[] = await heroStatsResponse.json();
      const matchups: any[] = await matchupsResponse.json();
      const itemPopularity: any[] = await itemPopularityResponse.json();

      const heroSpecificStats = allHeroStats.find(stat => stat.id === Number(heroId));

      if (!heroSpecificStats) {
        throw new Error(`Hero with ID ${heroId} not found in heroStats`);
      }

      return {
        ...heroSpecificStats,
        matchups,
        item_popularity: itemPopularity,
      };
    } catch (error) {
      console.error(`[Dota2Service] Error fetching complete hero stats for ID ${heroId}:`, error);
      throw error;
    }
  }

  async getHeroItemPopularity(heroId: number): Promise<any> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/heroes/${heroId}/itemPopularity`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(`[Dota2Service] Error fetching item popularity for hero ID ${heroId}:`, error);
      throw error;
    }
  }

  async getItemById(itemId: number): Promise<ItemDto | undefined> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/constants/items`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      const items: Record<string, ItemDto> = await response.json();
      // Find the item by its ID
      const foundItem = Object.values(items).find(item => item.id === Number(itemId));
      return foundItem;
    } catch (error) {
      console.error('[Dota2Service] Error fetching item by ID:', error);
      throw error;
    }
  }

  async getAbilities(): Promise<Record<number, AbilityDto>> {
    try {
      const [abilitiesResponse, heroesResponse] = await Promise.all([
        fetch(`${this.OPENDOTA_API_BASE_URL}/constants/abilities`),
        fetch(`${this.OPENDOTA_API_BASE_URL}/heroes`),
      ]);

      if (!abilitiesResponse.ok) {
        throw new Error(`OpenDota API Error (abilities): ${abilitiesResponse.status} - ${abilitiesResponse.statusText}`);
      }
      if (!heroesResponse.ok) {
        throw new Error(`OpenDota API Error (heroes): ${heroesResponse.status} - ${heroesResponse.statusText}`);
      }

      const abilitiesByName: Record<string, any> = await abilitiesResponse.json();
      const heroes: any[] = await heroesResponse.json();

      const abilitiesById: Record<number, AbilityDto> = {};

      heroes.forEach(hero => {
        if (hero.abilities) {
          hero.abilities.forEach((ability: any) => {
            if (ability.id && ability.name && abilitiesByName[ability.name]) {
              abilitiesById[ability.id] = {
                id: ability.id,
                name: ability.name,
                localized_name: abilitiesByName[ability.name].dname || ability.name,
                img: abilitiesByName[ability.name].img,
                dname: abilitiesByName[ability.name].dname,
              };
            }
          });
        }
      });

      return abilitiesById;
    } catch (error) {
      console.error('[Dota2Service] Error fetching and processing abilities:', error);
      throw error;
    }
  }

  async getMetaHeroes(lobbyType?: number, date?: number): Promise<MetaHeroDto[]> {
    try {
      const heroStats = await this.getHeroStats(lobbyType, date);

      const mmrBrackets = [
        { key: '1', name: 'Herald' },
        { key: '2', name: 'Guardian' },
        { key: '3', name: 'Crusader' },
        { key: '4', name: 'Archon' },
        { key: '5', name: 'Legend' },
        { key: '6', name: 'Ancient' },
        { key: '7', name: 'Divine' },
        { key: '8', name: 'Immortal' },
      ];

      const metaHeroes: MetaHeroDto[] = heroStats.map(hero => {
        const mmr_stats: { [key: string]: any } = {};

        mmrBrackets.forEach(bracket => {
          const totalPicksInBracket = heroStats.reduce((sum, h) => sum + (h[`${bracket.key}_pick`] || 0), 0);
          const pick_count = hero[`${bracket.key}_pick`] || 0;
          const win_count = hero[`${bracket.key}_win`] || 0;

          const pick_rate = totalPicksInBracket > 0 ? (pick_count * 1000) / totalPicksInBracket : 0;
          const win_rate = pick_count > 0 ? (win_count / pick_count) * 100 : 0;

          let tier: number;
          let tier_description: string;

          // Adjust these thresholds based on actual data distribution for each MMR bracket
          if (pick_rate > 10 && win_rate > 52) {
            tier = 1; // Alto
            tier_description = 'Alto';
          } else if (pick_rate > 5 && win_rate > 50) {
            tier = 2; // Bueno
            tier_description = 'Bueno';
          } else if (pick_rate > 2 && win_rate > 48) {
            tier = 3; // Medio
            tier_description = 'Medio';
          } else {
            tier = 4; // Bajo
            tier_description = 'Bajo';
          }

          mmr_stats[bracket.name.toLowerCase()] = {
            pick_rate: parseFloat(pick_rate.toFixed(2)),
            win_rate: parseFloat(win_rate.toFixed(2)),
            tier,
            tier_description,
          };
        });

        return {
          id: hero.id,
          name: hero.localized_name,
          img: `https://cdn.dota2.com${hero.img}`,
          roles: hero.roles, // Añadir la propiedad roles
          mmr_stats,
        };
      });

      // For now, we'll return all heroes. Frontend will filter by selected MMR.
      return metaHeroes;

    } catch (error) {
      console.error('[Dota2Service] Error fetching meta heroes:', error);
      throw error;
    }
  }
}
