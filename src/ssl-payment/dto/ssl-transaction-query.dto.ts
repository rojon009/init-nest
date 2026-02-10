import { IsString } from 'class-validator';

export class SslTransactionQueryByTransactionIdDto {
  @IsString()
  tran_id: string;
}

export class SslTransactionQueryBySessionIdDto {
  @IsString()
  sessionkey: string;
}
