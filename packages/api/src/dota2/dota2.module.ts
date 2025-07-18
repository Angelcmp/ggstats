import { Module } from '@nestjs/common';
import { Dota2Service } from './dota2.service';
import { Dota2Controller } from './dota2.controller';

@Module({
  providers: [Dota2Service],
  controllers: [Dota2Controller],
  exports: [Dota2Service],
})
export class Dota2Module {}
