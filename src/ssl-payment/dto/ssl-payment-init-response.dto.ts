/** Gateway options by category (comma-separated gateway ids). */
export interface SslPaymentInitGw {
  visa?: string;
  master?: string;
  amex?: string;
  othercards?: string;
  internetbanking?: string;
  mobilebanking?: string;
}

/** Single payment option in desc array. */
export interface SslPaymentInitDescItem {
  name: string;
  type: string;
  logo: string;
  gw: string;
  r_flag?: string;
  redirectGatewayURL?: string;
}

/** SSLCommerz init API success response. */
export interface SslPaymentInitResponse {
  status: string;
  failedreason: string;
  sessionkey: string;
  gw: SslPaymentInitGw;
  redirectGatewayURL: string;
  directPaymentURLBank: string;
  directPaymentURLCard: string;
  directPaymentURL: string;
  redirectGatewayURLFailed: string;
  GatewayPageURL: string;
  storeBanner: string;
  storeLogo: string;
  store_name: string;
  desc: SslPaymentInitDescItem[];
  is_direct_pay_enable: string;
}
