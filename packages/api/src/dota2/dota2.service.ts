import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchPlayerDto } from './dto/search-player.dto';
import { PlayerStatsDto } from './dto/player-stats.dto';
import { PlayerWinLossDto } from './dto/player-win-loss.dto';
import { RecentMatchesDto } from './dto/recent-matches.dto';
import { HeroDto } from './dto/hero.dto';
import { MatchDetailsDto } from './dto/match-details.dto';
import { ItemDto } from './dto/item.dto';

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

  async getHeroStats(): Promise<any[]> {
    try {
      const response = await fetch(`${this.OPENDOTA_API_BASE_URL}/heroStats`);
      if (!response.ok) {
        throw new Error(`OpenDota API Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('[Dota2Service] Error fetching hero stats:', error);
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
}
