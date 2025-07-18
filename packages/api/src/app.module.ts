import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RiotApiModule } from './riot-api/riot-api.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';

import { Dota2Module } from './dota2/dota2.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RiotApiModule, PrismaModule, RedisModule, Dota2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
