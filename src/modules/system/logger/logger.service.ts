/* eslint-disable @typescript-eslint/no-explicit-any */

import { ConsoleLogger, Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
    log(message: any, stack?: string, context?: string) {
        super.log(message, stack, context);
    }

    fatal(message: any, stack?: string, context?: string) {
        super.fatal(message, stack, context);
    }
    error(message: any, stack?: string, context?: string) {
        super.error(message, stack, context);
    }
    warn(message: any, stack?: string, context?: string) {
        super.warn(message, stack, context);
    }

    debug(message: any, context?: string): void {
        super.debug(message, context);
    }

    verbose(message: any, stack?: string, context?: string) {
        super.verbose(message, { stack, context });
    }
}
