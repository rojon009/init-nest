import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SslPaymentService } from './ssl-payment.service';

describe('SslPaymentService', () => {
  let service: SslPaymentService;

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
      providers: [
        SslPaymentService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SslPaymentService>(SslPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
