import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Dota2Service {
  private readonly OPENDOTA_API_BASE_URL = 'https://api.opendota.com/api';

  constructor(private configService: ConfigService) {}

  async searchPlayer(playerName: string): Promise<any> {
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

  async getPlayerStats(accountId: number): Promise<any> {
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

  async getPlayerWinLoss(accountId: number): Promise<any> {
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
}
