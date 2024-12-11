import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  autoSessionTracking: true,

  debug: process.env.HOST_ENV === "development",

  enabled: true,

  release: process.env.VERSION,

  environment: process.env.HOST_ENV,

  sendDefaultPii: true,

  integrations: [nodeProfilingIntegration()],

  tracesSampleRate: 1.0,

  profilesSampleRate: 1.0,
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
Sentry.profiler.startProfiler();

// Starts a transaction that will also be profiled
Sentry.startSpan(
  {
    name: "My First Transaction",
  },
  () => {
    // the code executing inside the transaction will be wrapped in a span and profiled
  },
);

// Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// your application until the process exits or stopProfiling is called.

Sentry.profiler.stopProfiler();
