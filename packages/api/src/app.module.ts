import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RiotApiModule } from './riot-api/riot-api.module';
import { RiotApiController } from './riot-api/riot-api.controller';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RiotApiModule, PrismaModule, RedisModule],
  controllers: [AppController, RiotApiController],
  providers: [AppService],
})
export class AppModule {}
