import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RiotApiModule } from './riot-api/riot-api.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { Dota2Module } from './dota2/dota2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 600000, // 10 minutes
    }),
    RiotApiModule,
    PrismaModule,
    RedisModule,
    Dota2Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
