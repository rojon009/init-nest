import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitSslPaymentDto } from 'src/ssl-payment/dto/init-ssl-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('ssl/init')
  async initSslPayment(@Body() dto: InitSslPaymentDto) {
    return this.paymentService.initSslPayment(dto);
  }
}
