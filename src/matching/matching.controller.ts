import { Body, Controller, Post } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchRequest } from 'src/shared/dto/matching/request/match.request';
import { MatchResponse } from 'src/shared/dto/matching/response/match.response';

@Controller('/match')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post()
  match(@Body() body: MatchRequest): MatchResponse[] {
    return this.matchingService.match(body.bookings, body.claims);
  }
}
