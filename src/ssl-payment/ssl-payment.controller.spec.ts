import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SslPaymentController } from './ssl-payment.controller';
import { SslPaymentService } from './ssl-payment.service';

describe('SslPaymentController', () => {
  let controller: SslPaymentController;

  const mockConfigService = {
    get: jest.fn((key: string): string | undefined => {
      const map: Record<string, string> = {
        SSLCOMMERZ_IS_LIVE: 'false',
        SSLCOMMERZ_STORE_ID: 'test_store',
        SSLCOMMERZ_STORE_PASSWD: 'test_pass',
      };
      return map[key];
    }),
    getOrThrow: jest.fn((key: string): string => {
      const map: Record<string, string> = {
        SSLCOMMERZ_STORE_ID: 'test_store',
        SSLCOMMERZ_STORE_PASSWD: 'test_pass',
      };
      if (map[key]) return map[key];
      throw new Error(`Missing config: ${key}`);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SslPaymentController],
      providers: [
        SslPaymentService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<SslPaymentController>(SslPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
