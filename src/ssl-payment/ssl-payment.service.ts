import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InitSslPaymentDto } from './dto/init-ssl-payment.dto';
import { InitiateSslRefundDto } from './dto/ssl-refund.dto';
import { SslPaymentInitResponse } from './dto/ssl-payment-init-response.dto';
import { SslPaymentValidationResponse } from './dto/ssl-payment-validation-response.dto';

@Injectable()
export class SslPaymentService {
  private readonly baseURL: string;
  private readonly storeId: string;
  private readonly storePasswd: string;
  private readonly initURL: string;
  private readonly validationURL: string;
  private readonly refundURL: string;
  private readonly refundQueryURL: string;
  private readonly transactionQueryURL: string;

  constructor(private readonly configService: ConfigService) {
    const isLive =
      this.configService.get<string>('SSLCOMMERZ_IS_LIVE') === 'true';
    this.baseURL = `https://${isLive ? 'securepay' : 'sandbox'}.sslcommerz.com`;
    this.storeId = this.configService.getOrThrow<string>('SSLCOMMERZ_STORE_ID');
    this.storePasswd = this.configService.getOrThrow<string>(
      'SSLCOMMERZ_STORE_PASSWD',
    );
    this.initURL = `${this.baseURL}/gwprocess/v4/api.php`;
    this.validationURL = `${this.baseURL}/validator/api/validationserverAPI.php`;
    this.refundURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php`;
    this.refundQueryURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php`;
    this.transactionQueryURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php`;
  }

  private buildInitFormData(dto: InitSslPaymentDto): FormData {
    const data: Record<string, string | number | undefined> = {
      store_id: this.storeId,
      store_passwd: this.storePasswd,
      productcategory: dto.productcategory,
      tran_id: dto.tran_id,
      total_amount: dto.total_amount,
      currency: dto.currency,
      success_url: dto.success_url,
      fail_url: dto.fail_url,
      cancel_url: dto.cancel_url,
      ipn_url: dto.ipn_url,
      multi_card_name: dto.multi_card_name,
      allowed_bin: dto.allowed_bin,
      emi_option: dto.emi_option,
      emi_max_inst_option: dto.emi_max_inst_option,
      emi_selected_inst: dto.emi_selected_inst,
      cus_name: dto.cus_name,
      cus_email: dto.cus_email,
      cus_add1: dto.cus_add1,
      cus_add2: dto.cus_add2,
      cus_city: dto.cus_city,
      cus_state: dto.cus_state,
      cus_postcode: dto.cus_postcode,
      cus_country: dto.cus_country,
      cus_phone: dto.cus_phone,
      cus_fax: dto.cus_fax,
      shipping_method: dto.shipping_method,
      num_of_item: dto.num_of_item,
      ship_name: dto.ship_name,
      ship_add1: dto.ship_add1,
      ship_add2: dto.ship_add2,
      ship_city: dto.ship_city,
      ship_state: dto.ship_state,
      ship_postcode: dto.ship_postcode,
      ship_country: dto.ship_country,
      product_name: dto.product_name,
      product_category: dto.product_category,
      product_profile: dto.product_profile,
      product_type: dto.product_type,
      product_amount: dto.product_amount,
      discount_amount: dto.discount_amount,
      convenience_fee: dto.convenience_fee,
      value_a: dto.value_a,
      value_b: dto.value_b,
      value_c: dto.value_c,
      value_d: dto.value_d,
    };
    if (dto.cart != null) {
      data.cart = JSON.stringify(dto.cart);
    }
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      form.append(key, value != null ? String(value) : '');
    }
    return form;
  }

  async init(dto: InitSslPaymentDto): Promise<SslPaymentInitResponse> {
    const form = this.buildInitFormData(dto);
    const res = await fetch(this.initURL, {
      method: 'POST',
      body: form,
    });
    return res.json() as Promise<SslPaymentInitResponse>;
  }

  async validate(valId: string): Promise<SslPaymentValidationResponse> {
    const url = `${this.validationURL}?val_id=${encodeURIComponent(valId)}&store_id=${encodeURIComponent(this.storeId)}&store_passwd=${encodeURIComponent(this.storePasswd)}&v=1&format=json`;
    const res = await fetch(url, { method: 'GET' });
    return res.json() as Promise<SslPaymentValidationResponse>;
  }

  async initiateRefund(dto: InitiateSslRefundDto): Promise<unknown> {
    const params = new URLSearchParams({
      refund_amount: String(dto.refund_amount),
      refund_remarks: dto.refund_remarks ?? '',
      bank_tran_id: dto.bank_tran_id,
      refe_id: dto.refe_id,
      store_id: this.storeId,
      store_passwd: this.storePasswd,
      v: '1',
      format: 'json',
    });
    const res = await fetch(`${this.refundURL}?${params}`, { method: 'GET' });
    return res.json();
  }

  async refundQuery(refundRefId: string): Promise<unknown> {
    const params = new URLSearchParams({
      refund_ref_id: refundRefId,
      store_id: this.storeId,
      store_passwd: this.storePasswd,
      v: '1',
      format: 'json',
    });
    const res = await fetch(`${this.refundQueryURL}?${params}`, {
      method: 'GET',
    });
    return res.json();
  }

  async transactionQueryByTransactionId(tranId: string): Promise<unknown> {
    const params = new URLSearchParams({
      tran_id: tranId,
      store_id: this.storeId,
      store_passwd: this.storePasswd,
      v: '1',
      format: 'json',
    });
    const res = await fetch(`${this.transactionQueryURL}?${params}`, {
      method: 'GET',
    });
    return res.json();
  }

  async transactionQueryBySessionId(sessionkey: string): Promise<unknown> {
    const params = new URLSearchParams({
      sessionkey,
      store_id: this.storeId,
      store_passwd: this.storePasswd,
      v: '1',
      format: 'json',
    });
    const res = await fetch(`${this.transactionQueryURL}?${params}`, {
      method: 'GET',
    });
    return res.json();
  }
}
