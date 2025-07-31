import { Controller, Get, Param, UseInterceptors, Query } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Dota2Service } from './dota2.service';
import { SearchPlayerDto } from './dto/search-player.dto';
import { PlayerStatsDto } from './dto/player-stats.dto';
import { PlayerWinLossDto } from './dto/player-win-loss.dto';
import { RecentMatchesDto } from './dto/recent-matches.dto';
import { HeroDto } from './dto/hero.dto';
import { MatchDetailsDto } from './dto/match-details.dto';
import { ItemDto } from './dto/item.dto';
import { AbilityDto } from './dto/ability.dto';
import { MetaHeroDto } from './dto/meta-hero.dto';

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

  @Get('heroes')
  @CacheTTL(3600000) // 1 hour
  async getHeroes(): Promise<HeroDto[]> {
    return this.dota2Service.getHeroes();
  }

  @Get('matches/:matchId')
  @CacheTTL(300000) // 5 minutes
  async getMatchDetails(@Param('matchId') matchId: number): Promise<MatchDetailsDto> {
    return this.dota2Service.getMatchDetails(matchId);
  }

  @Get('items')
  @CacheTTL(3600000) // 1 hour
  async getItems(): Promise<Record<string, ItemDto>> {
    return this.dota2Service.getItems();
  }

  @Get('heroes/:heroId/stats')
  @CacheTTL(300000) // 5 minutes
  async getHeroCompleteStats(@Param('heroId') heroId: number): Promise<any> {
    return this.dota2Service.getHeroCompleteStats(heroId);
  }

  @Get('hero-stats')
  @CacheTTL(3600000) // 1 hour
  async getHeroStats(): Promise<any[]> {
    return this.dota2Service.getHeroStats();
  }

  @Get('items/:itemId')
  @CacheTTL(3600000) // 1 hour
  async getItemById(@Param('itemId') itemId: number): Promise<ItemDto | undefined> {
    return this.dota2Service.getItemById(itemId);
  }

  @Get('abilities')
  @CacheTTL(3600000) // 1 hour
  async getAbilities(): Promise<any> {
    return this.dota2Service.getAbilities();
  }

  @Get('meta-heroes')
  @CacheTTL(3600000) // 1 hour
  async getMetaHeroes(
    @Query('lobbyType') lobbyType?: number,
    @Query('date') date?: number,
  ): Promise<MetaHeroDto[]> {
    return this.dota2Service.getMetaHeroes(lobbyType, date);
  }

  @Get('pro-players')
  @CacheTTL(3600000) // 1 hour
  async getProPlayers(): Promise<any[]> {
    return this.dota2Service.getProPlayers();
  }

  @Get('public-matches')
  @CacheTTL(300000) // 5 minutes
  async getPublicMatches(): Promise<any[]> {
    return this.dota2Service.getPublicMatches();
  }

  @Get('rankings')
  @CacheTTL(3600000) // 1 hour
  async getRankings(): Promise<any> {
    return this.dota2Service.getRankings();
  }
}
