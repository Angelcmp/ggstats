import { Controller, Get, Param } from '@nestjs/common';
import { RiotApiService } from './riot-api/riot-api.service';
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
}
