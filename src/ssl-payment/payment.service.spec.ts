import { Test, TestingModule } from '@nestjs/testing';
import { SslPaymentService } from './ssl-payment.service';
import { SSL_PAYMENT_OPTIONS } from './ssl-payment-options.interface';

const mockOptions = {
  storeId: 'test_store',
  storePasswd: 'test_pass',
  isLive: false,
  successUrl: 'http://localhost:3000/ssl-payment/success',
  failUrl: 'http://localhost:3000/ssl-payment/fail',
  cancelUrl: 'http://localhost:3000/ssl-payment/cancel',
  ipnUrl: 'http://localhost:3000/ssl-payment/ipn',
};

describe('SslPaymentService', () => {
  let service: SslPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SslPaymentService,
        { provide: SSL_PAYMENT_OPTIONS, useValue: mockOptions },
      ],
    }).compile();

    service = module.get<SslPaymentService>(SslPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
