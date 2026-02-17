import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SslPaymentModule } from '../ssl-payment/ssl-payment.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    SslPaymentModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const appBaseUrl =
          config.get<string>('APP_URL') ?? 'http://localhost:3000';

        return {
          storeId: config.getOrThrow<string>('SSLCOMMERZ_STORE_ID'),
          storePasswd: config.getOrThrow<string>('SSLCOMMERZ_STORE_PASSWD'),
          isLive: config.get<string>('SSLCOMMERZ_IS_LIVE') === 'true',
          successUrl: `${appBaseUrl}/ssl-payment/success`,
          failUrl: `${appBaseUrl}/ssl-payment/fail`,
          cancelUrl: `${appBaseUrl}/ssl-payment/cancel`,
          ipnUrl: `${appBaseUrl}/ssl-payment/ipn`,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
