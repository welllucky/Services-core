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
