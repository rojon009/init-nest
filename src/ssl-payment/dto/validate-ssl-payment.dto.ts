import { IsString } from 'class-validator';

export class ValidateSslPaymentDto {
  @IsString()
  val_id: string;
}
