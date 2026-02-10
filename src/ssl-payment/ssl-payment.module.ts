import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SslPaymentService } from './ssl-payment.service';
import { SslPaymentController } from './ssl-payment.controller';

@Module({
  imports: [ConfigModule],
  controllers: [SslPaymentController],
  providers: [SslPaymentService],
})
export class SslPaymentModule {}
