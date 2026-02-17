import { IsNumber, IsString, IsOptional, IsArray, Min } from 'class-validator';

/**
 * DTO for SSLCommerz payment init. Required fields per gateway docs.
 * @see https://developer.sslcommerz.com/
 */
export class InitSslPaymentDto {
  @IsString()
  productcategory: string;

  @IsString()
  tran_id: string;

  @IsNumber()
  @Min(10)
  total_amount: number;

  @IsString()
  currency: string;

  /** Override module forRoot default when provided */
  @IsOptional()
  @IsString()
  success_url?: string;

  @IsOptional()
  @IsString()
  fail_url?: string;

  @IsOptional()
  @IsString()
  cancel_url?: string;

  @IsOptional()
  @IsString()
  ipn_url?: string;

  @IsOptional()
  @IsString()
  multi_card_name?: string;

  @IsOptional()
  @IsString()
  allowed_bin?: string;

  @IsOptional()
  @IsNumber()
  emi_option?: number;

  @IsOptional()
  @IsNumber()
  emi_max_inst_option?: number;

  @IsOptional()
  @IsNumber()
  emi_selected_inst?: number;

  @IsOptional()
  @IsString()
  cus_name?: string;

  @IsOptional()
  @IsString()
  cus_email?: string;

  @IsOptional()
  @IsString()
  cus_add1?: string;

  @IsOptional()
  @IsString()
  cus_add2?: string;

  @IsOptional()
  @IsString()
  cus_city?: string;

  @IsOptional()
  @IsString()
  cus_state?: string;

  @IsOptional()
  @IsString()
  cus_postcode?: string;

  @IsOptional()
  @IsString()
  cus_country: string;

  @IsOptional()
  @IsString()
  cus_phone?: string;

  @IsOptional()
  @IsString()
  cus_fax?: string;

  @IsString()
  shipping_method: string;

  @IsOptional()
  @IsNumber()
  num_of_item?: number;

  @IsOptional()
  @IsString()
  ship_name?: string;

  @IsOptional()
  @IsString()
  ship_add1?: string;

  @IsOptional()
  @IsString()
  ship_add2?: string;

  @IsOptional()
  @IsString()
  ship_city?: string;

  @IsOptional()
  @IsString()
  ship_state?: string;

  @IsOptional()
  @IsString()
  ship_postcode?: string;

  @IsOptional()
  @IsString()
  ship_country?: string;

  @IsOptional()
  @IsString()
  product_name?: string;

  @IsOptional()
  @IsString()
  product_category?: string;

  @IsOptional()
  @IsString()
  product_profile?: string;

  @IsOptional()
  @IsString()
  product_type?: string;

  @IsOptional()
  @IsNumber()
  product_amount?: number;

  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @IsOptional()
  @IsNumber()
  convenience_fee?: number;

  @IsOptional()
  @IsArray()
  cart?: unknown[];

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
}
