import { Controller, Get, Param } from '@nestjs/common';
import { Dota2Service } from './dota2.service';

@Controller('dota2')
export class Dota2Controller {
  constructor(private readonly dota2Service: Dota2Service) {}

  @Get('search/:playerName')
  async searchPlayer(@Param('playerName') playerName: string) {
    return this.dota2Service.searchPlayer(playerName);
  }

  @Get('player/:accountId')
  async getPlayerStats(@Param('accountId') accountId: number) {
    return this.dota2Service.getPlayerStats(accountId);
  }

  @Get('player/:accountId/winloss')
  async getPlayerWinLoss(@Param('accountId') accountId: number) {
    return this.dota2Service.getPlayerWinLoss(accountId);
  }
}
