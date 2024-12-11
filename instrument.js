const Sentry = require("@sentry/nestjs");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

import packageJson from "./package.json";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  autoSessionTracking: true,

  debug: process.env.HOST_ENV === "development",

  enabled: true,

  release: packageJson.version,

  environment: process.env.HOST_ENV,

  sendDefaultPii: true,

  integrations: [nodeProfilingIntegration()],

  tracesSampleRate: 1.0,

  profilesSampleRate: 1.0,
});
