import { Session } from "@/entities";
import { getAuthInformation } from ".";
import { getUserDataByToken } from "../getUserDataByToken";

jest.mock("../getUserDataByToken");

const mockToken = "valid-token";
const invalidObject = { accessToken: "", isAuthenticated: false, userId: "" };

describe("Get Auth Information - Unit Test - Suite", () => {
    it("should return authenticated user data when token and session are valid", async () => {
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() + 3600000),
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: mockUserData,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(result).toEqual({
            accessToken: mockToken,
            isAuthenticated: true,
            userId: "456",
            sessionId: "123",
        });
    });

    it("should return unauthenticated response when token is empty", async () => {
        const mockSession = {
            id: "123",
            expiresAt: new Date(),
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const result = await getAuthInformation("", mockSession);

        expect(result).toEqual(invalidObject);
    });

    it("should maintain active session status when session is within expiry date", async () => {
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() + 3600000), // 1 hour in the future
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: mockUserData,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(result).toEqual({
            accessToken: mockToken,
            isAuthenticated: true,
            userId: "456",
            sessionId: "123",
        });
        expect(mockSession.isActive).toBe(true);
        expect(mockSession.save).not.toHaveBeenCalled();
    });

    it("should return authenticated user data when token and session are valid", async () => {
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() + 3600000),
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: mockUserData,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(result).toEqual({
            accessToken: mockToken,
            isAuthenticated: true,
            userId: "456",
            sessionId: "123",
        });
    });

    it("should return complete authentication object when token and session are valid", async () => {
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() + 3600000),
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: mockUserData,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(result).toEqual({
            accessToken: mockToken,
            isAuthenticated: true,
            userId: "456",
            sessionId: "123",
        });
    });

    it("should mark session as inactive and return unauthenticated when session is expired", async () => {
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() - 3600000), // expired session
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: mockUserData,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(mockSession.isActive).toBe(false);
        expect(mockSession.save).toHaveBeenCalled();
        expect(result).toEqual({
            ...invalidObject,
            accessToken: mockToken,
            sessionId: mockSession.id,
        });
    });

    it("should return null for accessToken and userId when session does not exist", async () => {
        const mockSession = null;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: mockUserData,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(result).toStrictEqual(invalidObject);
    });

    it("should return unauthenticated response when session exists but user data is invalid", async () => {
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() + 3600000),
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: null,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(result).toEqual(invalidObject);
    });

    it("should return unauthenticated response when token format is invalid", async () => {
        const invalidToken = "invalid-token-format";
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() + 3600000),
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: null,
            userData: null,
        });

        const result = await getAuthInformation(invalidToken, mockSession);

        expect(result).toEqual(invalidObject);
    });

    it("should update isActive to false and save when session is expired", async () => {
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() - 3600000), // expired session
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: mockUserData,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(result).toEqual({
            ...invalidObject,
            accessToken: mockToken,
            sessionId: mockSession.id,
        });
    });

    it("should return unauthenticated response when an error occurs", async () => {
        const mockToken = "invalid-token";
        const mockSession = null;

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: null,
            userData: null,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(result).toEqual(invalidObject);
    });

    it("should persist session state changes when token is expired", async () => {
        const mockToken = "expired-token";
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() - 3600000), // expired session
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: mockUserData,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(mockSession.isActive).toBe(false);
        expect(mockSession.save).toHaveBeenCalled();
        expect(result.isAuthenticated).toEqual(false);
    });

    it("should mark session as inactive and return unauthenticated when session expires at current timestamp", async () => {
        const currentTime = Date.now();
        const mockSession = {
            id: "123",
            expiresAt: new Date(currentTime),
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockToken,
            userData: mockUserData,
        });

        const result = await getAuthInformation(mockToken, mockSession);

        expect(mockSession.isActive).toBe(false);
        expect(mockSession.save).toHaveBeenCalled();
        expect(result).toEqual({
            ...invalidObject,
            accessToken: mockToken,
            sessionId: mockSession.id,
        });
    });

    it("should handle token with and without Bearer prefix correctly", async () => {
        const mockTokenWithBearer = "Bearer valid-token";
        const mockTokenWithoutBearer = "valid-token";
        const mockSession = {
            id: "123",
            expiresAt: new Date(Date.now() + 3600000),
            isActive: true,
            save: jest.fn(),
        } as unknown as Session;

        const mockUserData = {
            register: "456",
        };

        (getUserDataByToken as jest.Mock).mockReturnValue({
            accessToken: mockTokenWithoutBearer,
            userData: mockUserData,
        });

        const resultWithBearer = await getAuthInformation(
            mockTokenWithBearer,
            mockSession,
        );
        const resultWithoutBearer = await getAuthInformation(
            mockTokenWithoutBearer,
            mockSession,
        );

        expect(resultWithBearer).toEqual({
            accessToken: mockTokenWithoutBearer,
            isAuthenticated: true,
            userId: "456",
            sessionId: "123",
        });

        expect(resultWithoutBearer).toEqual({
            accessToken: mockTokenWithoutBearer,
            isAuthenticated: true,
            userId: "456",
            sessionId: "123",
        });
    });
});
