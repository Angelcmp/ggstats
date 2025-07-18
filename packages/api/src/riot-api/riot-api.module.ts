import { Module } from '@nestjs/common';
import { RiotApiService } from './riot-api.service';
import { RiotApiController } from './riot-api.controller';

@Module({
  controllers: [RiotApiController],
  providers: [RiotApiService],
  exports: [RiotApiService],
})
export class RiotApiModule {}
