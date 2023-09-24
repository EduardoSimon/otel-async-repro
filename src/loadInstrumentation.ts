/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { Resource } from "@opentelemetry/resources";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

const provider = new WebTracerProvider({
  resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "demo-async"
  }),
});
if (import.meta.env.DEV) {
  console.log("Set traces exporter to console.")
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
} else {
  console.log("Set traces exporter to external OTLP collector.")
  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new OTLPTraceExporter({url: '/v1/traces'})
    )
  );
}

provider.register({
  contextManager: new ZoneContextManager(),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [new FetchInstrumentation()],
});

export { provider };
