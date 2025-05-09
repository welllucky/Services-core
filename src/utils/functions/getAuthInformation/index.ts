import { Session } from "@/entities";
import { addBreadcrumb } from "@sentry/nestjs";
import { checkSessionValidation } from "../checkSessionValidation";
import { getUserDataByToken } from "../getUserDataByToken";

const getAuthInformation = async (token: string, session: Session) => {
    try {
        if (!token) {
            addBreadcrumb({
                category: "auth",
                level: "warning",
                message: "No access token found",
            });
            throw new Error("No access token found");
        }

        const { accessToken, userData } = getUserDataByToken(token);

        if (!session || !userData || !accessToken) {
            addBreadcrumb({
                category: "auth",
                level: "warning",
                message:
                    "Session passed by access token not found in user database",
                data: {
                    userData,
                },
            });
            throw new Error("User could not access this resource");
        }

        const { isValid } = checkSessionValidation(session);

        return {
            accessToken,
            isAuthenticated: isValid,
            userId: isValid ? String(userData?.register || "") : "",
            sessionId: String(session?.id),
        };
    } catch {
        return {
            accessToken: "",
            isAuthenticated: false,
            userId: "",
        };
    }
};

export { getAuthInformation };
