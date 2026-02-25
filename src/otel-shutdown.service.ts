import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { shutdown } from './otel';

@Injectable()
export class OtelShutdownService implements OnApplicationShutdown {
  async onApplicationShutdown(): Promise<void> {
    try {
      await shutdown();
    } catch (err) {
      console.error('OTel SDK shutdown failed:', err);
      process.exit(1);
    }
  }
}
