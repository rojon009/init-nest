// src/otel.ts
//
// Env: OTEL_SERVICE_NAME, OTEL_EXPORTER_OTLP_ENDPOINT (traces/logs/metrics),
// OTEL_DIAG=1 (enable OTel internal diagnostics), NODE_ENV

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import {
  BatchLogRecordProcessor,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';

// Optional: enable OTel internal diagnostics when debugging
if (process.env.OTEL_DIAG === '1') {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
}

const serviceName = process.env.OTEL_SERVICE_NAME || 'nestjs-service';
const serviceVersion = process.env.npm_package_version || '0.0.0';
const environment = process.env.NODE_ENV || 'development';

const traceExporter = new OTLPTraceExporter();
const logsExporter = new OTLPLogExporter();

// Use batch processor in production for lower overhead; simple for dev/debug
const useBatchLogProcessor =
  process.env.OTEL_LOG_BATCH !== '0' && environment !== 'development';

const logRecordProcessor = useBatchLogProcessor
  ? new BatchLogRecordProcessor(logsExporter)
  : new SimpleLogRecordProcessor(logsExporter);

const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter(),
  exportIntervalMillis: 60_000,
  exportTimeoutMillis: 30_000,
});

export const otelSdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: serviceVersion,
    'deployment.environment': environment,
  }),
  traceExporter,
  contextManager: new AsyncLocalStorageContextManager(),
  logRecordProcessors: [logRecordProcessor],
  metricReaders: [metricReader],
  // To disable specific instrumentations (e.g. fs, dns), pass config: getNodeAutoInstrumentations({ '@opentelemetry/instrumentation-fs': { enabled: false } })
  instrumentations: [
    getNodeAutoInstrumentations(),
    new WinstonInstrumentation(),
  ],
});

otelSdk.start();

const SHUTDOWN_TIMEOUT_MS = 10_000;

/**
 * Shutdown the OTel SDK (flush and stop). Call from Nest lifecycle, e.g. OnApplicationShutdown.
 * Resolves after shutdown or after SHUTDOWN_TIMEOUT_MS; rejects on SDK shutdown error.
 */
export async function shutdown(): Promise<void> {
  await Promise.race([
    otelSdk.shutdown(),
    new Promise<void>((_, reject) =>
      setTimeout(
        () => reject(new Error('OTel SDK shutdown timeout')),
        SHUTDOWN_TIMEOUT_MS,
      ),
    ),
  ]);
}
