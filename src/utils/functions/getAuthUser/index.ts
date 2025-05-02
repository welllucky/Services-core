import { Session } from "@/entities";
import { addBreadcrumb } from "@sentry/nestjs";
import { getUserByToken } from "../getUserByToken";

const getAuthToken = async (token: string, session: Session) => {
  try {
    if (!token) {
      addBreadcrumb({
        category: "auth",
        level: "warning",
        message: "No access token found",
      });
      throw new Error("No access token found");
    }

    const { accessToken, userData } = await getUserByToken(token);

    if (!session || !userData || !accessToken) {
      addBreadcrumb({
        category: "auth",
        level: "warning",
        message: "Session passed by access token not found in user database",
        data: {
          userData,
        },
      });
      throw new Error("User could not access this resource");
    }

    const isTokenValid = session.expiresAt.getTime() > Date.now();

    if (!isTokenValid) {
      addBreadcrumb({
        category: "auth",
        level: "warning",
        message: "Session passed by access token is expired",
        data: {
          session,
          actualData: Date.now(),
        },
      });

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

      throw new Error("Session expired");
    }

    const isAuthenticated = session.isActive && isTokenValid;

    return {
      accessToken,
      isAuthenticated,
      userId: String(userData?.register || ""),
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

export { getAuthToken };
