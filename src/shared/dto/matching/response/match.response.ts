import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class MatchResponse {
  @IsString()
  @IsNotEmpty()
  claim: string;

  @IsString()
  @IsNotEmpty()
  booking: string;

  @IsArray()
  @IsString({ each: true })
  mismatch: string[];
}
