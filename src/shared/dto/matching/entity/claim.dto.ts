import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ClaimDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  medicalServiceCode: string;

  @IsDateString()
  @IsNotEmpty()
  bookingDate: string;

  @IsString()
  @IsNotEmpty()
  insurance: string;

  @IsString()
  @IsNotEmpty()
  patient: string;
}
