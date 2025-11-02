import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';

@Module({
  providers: [MatchingService],
  controllers: [MatchingController],
})
export class MatchingModule {}
