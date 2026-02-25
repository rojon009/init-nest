import { Injectable, Logger } from '@nestjs/common';
import { metrics, trace, SpanStatusCode } from '@opentelemetry/api';

const meter = metrics.getMeter('nest-init-app', '1.0.0');
const demoRequestCounter = meter.createCounter('demo_request_total', {
  description: 'Total number of demo requests',
});
const demoErrorCounter = meter.createCounter('demo_error_total', {
  description: 'Total number of failed demo requests',
});
const demoDurationHistogram = meter.createHistogram(
  'demo_request_duration_ms',
  {
    description: 'Duration of demo requests in milliseconds',
    unit: 'ms',
  },
);

export interface OtelDemoResult {
  success: boolean;
  correlationId: string;
  simulatedWorkMs: number;
  errorType?: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.log('getHello from service');
    return 'Hello World!';
  }

  async runOtelDemo(): Promise<OtelDemoResult> {
    const tracer = trace.getTracer('nest-init-app', '1.0.0');
    const correlationId = crypto.randomUUID();
    const startedAt = Date.now();

    demoRequestCounter.add(1, { 'demo.stage': 'start' });

    return tracer.startActiveSpan(
      'AppService.runOtelDemo',
      async (span): Promise<OtelDemoResult> => {
        span.setAttribute('demo.correlation_id', correlationId);
        span.addEvent('demo.started', { correlationId });

        const simulatedWorkMs = 50 + Math.floor(Math.random() * 400);
        await new Promise((resolve) => setTimeout(resolve, simulatedWorkMs));

        let errorType: string | undefined;

        try {
          const r = Math.random();

          if (r < 0.35) {
            if (r < 0.15) {
              errorType = 'TRANSIENT_BACKEND_ERROR';
              throw new Error('Random transient backend error');
            } else if (r < 0.25) {
              errorType = 'DOWNSTREAM_TIMEOUT';
              throw new Error('Random downstream timeout');
            } else {
              errorType = 'VALIDATION_FAILURE';
              throw new Error('Random validation failure');
            }
          }

          this.logger.log('OTel demo succeeded', {
            correlationId,
            simulatedWorkMs,
          });

          span.setAttribute('demo.result', 'success');
          span.addEvent('demo.succeeded', { correlationId });

          return {
            success: true,
            correlationId,
            simulatedWorkMs,
          };
        } catch (err) {
          const error = err as Error;
          const effectiveErrorType = errorType ?? 'UNKNOWN_ERROR';

          this.logger.error('OTel demo failed', error.stack, {
            correlationId,
            simulatedWorkMs,
            errorType: effectiveErrorType,
          });

          demoErrorCounter.add(1, { 'demo.error_type': effectiveErrorType });

          span.recordException(error);
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: effectiveErrorType,
          });
          span.setAttribute('demo.error_type', effectiveErrorType);

          throw error;
        } finally {
          const durationMs = Date.now() - startedAt;
          const success = !errorType;

          demoDurationHistogram.record(durationMs, {
            'demo.success': success,
          });

          span.setAttribute('demo.duration_ms', durationMs);
          span.end();
        }
      },
    );
  }
}
