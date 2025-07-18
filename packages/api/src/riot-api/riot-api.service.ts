import { Injectable } from '@nestjs/common';
import { RiotAPI, PlatformId } from '@fightmegg/riot-api';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service'; // Import RedisService

@Injectable()
export class RiotApiService {
  private readonly riotAPI: RiotAPI;
  private readonly riotApiKey: string;

  constructor(
    private configService: ConfigService,
    private redisService: RedisService, // Inject RedisService
  ) {
    this.riotApiKey = this.configService.get<string>('RIOT_API_KEY');
    console.log(`[RiotApiService] Using API Key: ${this.riotApiKey ? this.riotApiKey.substring(0, 5) + '...' : 'undefined'}`);
    this.riotAPI = new RiotAPI({
      key: this.riotApiKey,
    });

  }

  async getSummonerByName(summonerName: string, region: PlatformId) {
    const cacheKey = `summoner:${region}:${summonerName}`;
    const redisClient = this.redisService.getClient();

    try {
      // 1. Try to get data from Redis cache
      const cachedSummoner = await redisClient.get(cacheKey);
      if (cachedSummoner) {
        console.log(`[RiotApiService] Cache hit for ${cacheKey}`);
        return JSON.parse(cachedSummoner);
      }

      console.log(`[RiotApiService] Cache miss for ${cacheKey}, fetching from Riot API...`);
      // 2. If not in cache, fetch from Riot API
      const response = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`, {
        headers: {
          'X-Riot-Token': this.riotApiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Riot API Error: ${response.status} - ${response.statusText}`);
      }

      const summonerData = await response.json();

      // 3. Store data in Redis cache with a TTL (e.g., 5 minutes = 300 seconds)
      await redisClient.set(cacheKey, JSON.stringify(summonerData), 'EX', 300);
      console.log(`[RiotApiService] Stored ${cacheKey} in cache.`);

      return summonerData;

    } catch (error) {
      console.error('[RiotApiService] Error fetching summoner:', error);
      throw error;
    }
  }

  async getChampionRotations(region: PlatformId) {
    try {
      const rotations = await this.riotAPI.champion.getRotations({ region });
      return rotations;
    } catch (error) {
      console.error('[RiotApiService] Error fetching champion rotations:', error);
      throw error;
    }
  }

  async getValorantMatchlistByRiotId(gameName: string, tagLine: string, region: PlatformId) {
    try {
      // 1. Get PUUID from Riot ID
      const account = await this.riotAPI.account.getByRiotId({ region: region, gameName: gameName, tagLine: tagLine });
      const puuid = account.puuid;

      // 2. Get matchlist by PUUID
      const matchlist = await this.riotAPI.valMatch.getMatchlistByPUUID({ region: region, puuid: puuid });
      return matchlist;
    } catch (error) {
      console.error('[RiotApiService] Error fetching Valorant matchlist:', error);
      throw error;
    }
  }
}
