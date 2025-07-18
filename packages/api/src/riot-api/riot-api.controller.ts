import { Controller, Get, Param } from '@nestjs/common';
import { RiotApiService } from './riot-api.service';
import { PlatformId } from '@fightmegg/riot-api';

@Controller('riot-api')
export class RiotApiController {
  constructor(private readonly riotApiService: RiotApiService) {}

  @Get('summoner/:region/:summonerName')
  async getSummoner(
    @Param('region') region: PlatformId,
    @Param('summonerName') summonerName: string,
  ) {
    return this.riotApiService.getSummonerByName(summonerName, region);
  }

  @Get('champion-rotations/:region')
  async getChampionRotations(
    @Param('region') region: PlatformId,
  ) {
    return this.riotApiService.getChampionRotations(region);
  }

  @Get('valorant/matchlist/:region/:gameName/:tagLine')
  async getValorantMatchlist(
    @Param('region') region: PlatformId,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
  ) {
    return this.riotApiService.getValorantMatchlistByRiotId(gameName, tagLine, region);
  }
}
