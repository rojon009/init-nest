import { Controller, Get, Logger } from '@nestjs/common';
import { AppService, OtelDemoResult } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @Get()
  getHello(): string {
    this.logger.log('getHello from controller');
    return this.appService.getHello();
  }

  @Get('otel-demo')
  async otelDemo(): Promise<OtelDemoResult & { timestamp: string }> {
    this.logger.log('Incoming OTel demo request', {
      route: '/otel-demo',
    });

    try {
      const result = await this.appService.runOtelDemo();

      this.logger.log('OTel demo response', {
        route: '/otel-demo',
        success: result.success,
        correlationId: result.correlationId,
      });

      return {
        ...result,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const error = err as Error;
      this.logger.error('OTel demo request failed', error.stack);
      throw err;
    }
  }
}
