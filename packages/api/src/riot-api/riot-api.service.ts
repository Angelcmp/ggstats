import { Injectable } from '@nestjs/common';
import { RiotAPI, PlatformId } from '@fightmegg/riot-api';

@Injectable()
export class RiotApiService {
  private readonly riotAPI: RiotAPI;

  constructor() {
    this.riotAPI = new RiotAPI(process.env.RIOT_API_KEY);
  }

  async getSummonerByName(summonerName: string, region: PlatformId) {
    try {
      const summoner = await this.riotAPI.summoner.getBySummonerName({
        region,
        summonerName,
      });
      return summoner;
    } catch (error) {
      console.error('Error fetching summoner:', error);
      throw error;
    }
  }
}
