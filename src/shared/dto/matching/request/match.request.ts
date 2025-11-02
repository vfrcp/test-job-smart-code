import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { BookingDto } from '../entity/booking.dto';
import { Type } from 'class-transformer';
import { ClaimDto } from '../entity/claim.dto';

export class MatchRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingDto)
  @ArrayMinSize(0)
  bookings: BookingDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClaimDto)
  @ArrayMinSize(0)
  claims: ClaimDto[];
}
