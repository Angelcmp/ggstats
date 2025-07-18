import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Dota2Service } from './dota2.service';
import { SearchPlayerDto } from './dto/search-player.dto';
import { PlayerStatsDto } from './dto/player-stats.dto';
import { PlayerWinLossDto } from './dto/player-win-loss.dto';
import { RecentMatchesDto } from './dto/recent-matches.dto';

@Controller('dota2')
@UseInterceptors(CacheInterceptor)
export class Dota2Controller {
  constructor(private readonly dota2Service: Dota2Service) {}

  @Get('search/:playerName')
  @CacheTTL(300000) // 5 minutes
  async searchPlayer(@Param('playerName') playerName: string): Promise<SearchPlayerDto[]> {
    return this.dota2Service.searchPlayer(playerName);
  }

  @Get('player/:accountId')
  @CacheTTL(300000) // 5 minutes
  async getPlayerStats(@Param('accountId') accountId: number): Promise<PlayerStatsDto> {
    return this.dota2Service.getPlayerStats(accountId);
  }

  @Get('player/:accountId/winloss')
  @CacheTTL(300000) // 5 minutes
  async getPlayerWinLoss(@Param('accountId') accountId: number): Promise<PlayerWinLossDto> {
    return this.dota2Service.getPlayerWinLoss(accountId);
  }

  @Get('player/:accountId/recentMatches')
  @CacheTTL(300000) // 5 minutes
  async getPlayerRecentMatches(@Param('accountId') accountId: number): Promise<RecentMatchesDto[]> {
    return this.dota2Service.getPlayerRecentMatches(accountId);
  }
}
