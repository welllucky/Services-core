import { Session } from "@/database/entities";
import { addBreadcrumb } from "@sentry/nestjs";

export const checkSessionValidation = (session: Session) => {
    if (!session) {
        return {
            isValid: false,
            message: "Session not provided",
        };
    }

    const isSessionValid = session.expiresAt.getTime() > Date.now();

    if (isSessionValid && session.isActive) {
        return {
            isValid: true,
            message: "Session is valid",
        };
    }

    if (!isSessionValid) {
        addBreadcrumb({
            category: "auth",
            level: "warning",
            message: "Session passed by access token is expired",
            data: {
                session,
                actualData: Date.now(),
            },
        });
    }

    if (session.isActive) {
        session.isActive = false;
        session.save();

        addBreadcrumb({
            category: "auth",
            level: "log",
            message: `Session ${session.id} was closed`,
            data: {
                session,
                actualData: Date.now(),
            },
        });
    }

    return {
        isValid: false,
        message: "Session expired",
    };
};
