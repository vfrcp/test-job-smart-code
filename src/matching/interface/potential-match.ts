import { Booking } from 'src/shared/interface/entity/booking';
import { Claim } from 'src/shared/interface/entity/claim';

export interface PotentialMatch {
  claim: Claim;
  booking: Booking;
  score: number;
  mismatches: string[];
}
