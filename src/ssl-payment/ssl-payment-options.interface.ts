/**
 * Options for SslPaymentModule.forRoot() / forRootAsync().
 * Callback URLs are used as defaults when not provided in init request.
 */
export interface SslPaymentModuleOptions {
  /** SSLCommerz store ID */
  storeId: string;
  /** SSLCommerz store password */
  storePasswd: string;
  /** Use live gateway (default false = sandbox) */
  isLive?: boolean;
  /** Default success callback URL (e.g. https://yourapp.com/ssl-payment/success) */
  successUrl: string;
  /** Default fail callback URL */
  failUrl: string;
  /** Default cancel callback URL */
  cancelUrl: string;
  /** Default IPN callback URL */
  ipnUrl: string;
}

export const SSL_PAYMENT_OPTIONS = 'SSL_PAYMENT_OPTIONS';
