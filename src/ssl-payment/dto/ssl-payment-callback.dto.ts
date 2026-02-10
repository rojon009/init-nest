import { IsString, IsOptional } from 'class-validator';

/**
 * SSLCommerz callback payload sent to success, fail, cancel, and IPN endpoints.
 * - Success / IPN: status "VALID", val_id present; subscription_id may be undefined.
 * - Fail: status "FAILED", error set, val_id absent.
 * - Cancel: status "CANCELLED", error e.g. "Cancelled by User", val_id absent; bank_tran_id and card_* often empty/absent.
 * @see https://developer.sslcommerz.com/
 */
export class SslPaymentCallbackDto {
  @IsString()
  tran_id: string;

  /** Present on success; absent on fail/cancel. */
  @IsOptional()
  @IsString()
  val_id?: string;

  @IsString()
  amount: string;

  @IsOptional()
  @IsString()
  card_type?: string;

  @IsOptional()
  @IsString()
  store_amount?: string;

  @IsOptional()
  @IsString()
  card_no?: string;

  @IsOptional()
  @IsString()
  bank_tran_id?: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  tran_date?: string;

  @IsOptional()
  @IsString()
  error?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  card_issuer?: string;

  @IsOptional()
  @IsString()
  card_brand?: string;

  @IsOptional()
  @IsString()
  card_sub_brand?: string;

  @IsOptional()
  @IsString()
  card_issuer_country?: string;

  @IsOptional()
  @IsString()
  card_issuer_country_code?: string;

  @IsOptional()
  @IsString()
  store_id?: string;

  @IsOptional()
  @IsString()
  verify_sign?: string;

  @IsOptional()
  @IsString()
  verify_key?: string;

  @IsOptional()
  @IsString()
  verify_sign_sha2?: string;

  @IsOptional()
  @IsString()
  currency_type?: string;

  @IsOptional()
  @IsString()
  currency_amount?: string;

  @IsOptional()
  @IsString()
  currency_rate?: string;

  @IsOptional()
  @IsString()
  base_fair?: string;

  @IsOptional()
  @IsString()
  value_a?: string;

  @IsOptional()
  @IsString()
  value_b?: string;

  @IsOptional()
  @IsString()
  value_c?: string;

  @IsOptional()
  @IsString()
  value_d?: string;

  @IsOptional()
  @IsString()
  subscription_id?: string;

  @IsOptional()
  @IsString()
  risk_level?: string;

  @IsOptional()
  @IsString()
  risk_title?: string;
}
