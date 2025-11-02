import { Injectable } from '@nestjs/common';
import { MatchResponse } from 'src/shared/dto/matching/response/match.response';
import { Booking } from 'src/shared/interface/entity/booking';
import { Claim } from 'src/shared/interface/entity/claim';
import { TestMap } from 'src/matching/interface/test-map';
import { PotentialMatch } from './interface/potential-match';

@Injectable()
export class MatchingService {
  // THIS IS STUB DATA
  private readonly testsMap: TestMap[] = [
    { bookingTestId: 'test_1', claimTestId: 'medical_service_1' },
    { bookingTestId: 'test_2', claimTestId: 'medical_service_2' },
  ];

  match(bookings: Booking[], claims: Claim[]): MatchResponse[] {
    const bookingIndex = this.buildBookingIndex(bookings);

    const testMapDict = new Map<string, string>();
    this.testsMap.forEach((tm) => {
      testMapDict.set(tm.claimTestId, tm.bookingTestId);
    });

    const allPotentialMatches: PotentialMatch[] = [];

    for (const claim of claims) {
      const key = this.getIndexKey(claim.patient, claim.bookingDate);
      const candidateBookings = bookingIndex.get(key) || [];

      for (const booking of candidateBookings) {
        const { score, mismatches } = this.calculateMatch(
          booking,
          claim,
          testMapDict,
        );

        allPotentialMatches.push({
          claim,
          booking,
          score,
          mismatches,
        });
      }
    }

    allPotentialMatches.sort((a, b) => b.score - a.score);

    const results: MatchResponse[] = [];
    const usedClaimIds = new Set<string>();
    const usedBookingIds = new Set<string>();

    for (const match of allPotentialMatches) {
      if (
        usedClaimIds.has(match.claim.id) ||
        usedBookingIds.has(match.booking.id)
      ) {
        continue;
      }

      results.push({
        claim: match.claim.id,
        booking: match.booking.id,
        mismatch: match.mismatches,
      });

      usedClaimIds.add(match.claim.id);
      usedBookingIds.add(match.booking.id);
    }

    return results;
  }

  private buildBookingIndex(bookings: Booking[]): Map<string, Booking[]> {
    const index = new Map<string, Booking[]>();

    for (const booking of bookings) {
      const key = this.getIndexKey(booking.patient, booking.reservationDate);

      if (!index.has(key)) {
        index.set(key, []);
      }
      index.get(key)!.push(booking);
    }

    return index;
  }

  private getIndexKey(patient: string, dateString: string): string {
    const date = new Date(dateString);
    const dateOnly = date.toISOString().split('T')[0];
    return `${patient}_${dateOnly}`;
  }

  private calculateMatch(
    booking: Booking,
    claim: Claim,
    testMapDict: Map<string, string>,
  ): { score: number; mismatches: string[] } {
    let score = 0;
    const mismatches: string[] = [];

    const bookingDate = new Date(booking.reservationDate);
    const claimDate = new Date(claim.bookingDate);

    const bookingTime = `${bookingDate.getUTCHours()}:${bookingDate.getUTCMinutes()}`;
    const claimTime = `${claimDate.getUTCHours()}:${claimDate.getUTCMinutes()}`;

    if (bookingTime === claimTime) {
      score++;
    } else {
      mismatches.push('time');
    }

    const expectedBookingTestId = testMapDict.get(claim.medicalServiceCode);
    if (!expectedBookingTestId) {
      mismatches.push('unknown_medical_service');
    } else if (expectedBookingTestId === booking.test) {
      score++;
    } else {
      mismatches.push('test');
    }

    if (booking.insurance === claim.insurance) {
      score += 1;
    } else {
      mismatches.push('insurance');
    }

    return { score, mismatches };
  }
}
