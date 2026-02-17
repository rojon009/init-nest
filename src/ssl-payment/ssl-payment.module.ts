import {
  DynamicModule,
  InjectionToken,
  Module,
  OptionalFactoryDependency,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SslPaymentService } from './ssl-payment.service';
import { SslPaymentController } from './ssl-payment.controller';
import {
  SslPaymentModuleOptions,
  SSL_PAYMENT_OPTIONS,
} from './ssl-payment-options.interface';

export interface SslPaymentModuleAsyncOptions {
  useFactory: (
    ...args: unknown[]
  ) => Promise<SslPaymentModuleOptions> | SslPaymentModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

@Module({
  controllers: [SslPaymentController],
  providers: [SslPaymentService],
  exports: [SslPaymentService],
})
export class SslPaymentModule {
  static forRoot(options: SslPaymentModuleOptions): DynamicModule {
    return {
      module: SslPaymentModule,
      providers: [
        {
          provide: SSL_PAYMENT_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static forRootAsync(
    asyncOptions: SslPaymentModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: SslPaymentModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: SSL_PAYMENT_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject ?? [],
        },
      ],
    };
  }
}
