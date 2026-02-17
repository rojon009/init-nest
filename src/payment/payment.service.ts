import { Injectable } from '@nestjs/common';
import { SslPaymentService } from 'src/ssl-payment/ssl-payment.service';
import { InitSslPaymentDto } from 'src/ssl-payment/dto/init-ssl-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly sslPaymentService: SslPaymentService) {}

  async initSslPayment(dto: InitSslPaymentDto) {
    return this.sslPaymentService.init(dto);
  }
}
