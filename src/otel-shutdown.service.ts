import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { shutdown } from './otel';

@Injectable()
export class OtelShutdownService implements OnApplicationShutdown {
  private readonly logger = new Logger(OtelShutdownService.name);

  async onApplicationShutdown(): Promise<void> {
    try {
      await shutdown();
    } catch (err) {
      this.logger.error('OTel SDK shutdown failed', err);
    }
  }
}
