import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class InitiateSslRefundDto {
  @IsNumber()
  @Min(0)
  refund_amount: number;

  @IsOptional()
  @IsString()
  refund_remarks?: string;

  @IsString()
  bank_tran_id: string;

  @IsString()
  refe_id: string;
}

export class RefundQueryDto {
  @IsString()
  refund_ref_id: string;
}
