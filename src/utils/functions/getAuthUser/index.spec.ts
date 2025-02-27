import { Session } from "@/entities";
import { getAuthToken } from ".";
import { getUserByToken } from "../getUserByToken";

jest.mock("../getUserByToken");

const invalidObject = { accessToken: "", isAuthenticated: false, userId: "" };
const mockToken = "valid-token";

describe("Get Auth Token - Unit Test - Suite", () => {
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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: mockUserData,
    });

    const result = await getAuthToken(mockToken, mockSession);

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

    const result = await getAuthToken("", mockSession);

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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: mockUserData,
    });

    const result = await getAuthToken(mockToken, mockSession);

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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: mockUserData,
    });

    const result = await getAuthToken(mockToken, mockSession);

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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: mockUserData,
    });

    const result = await getAuthToken(mockToken, mockSession);

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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: mockUserData,
    });

    const result = await getAuthToken(mockToken, mockSession);

    expect(mockSession.isActive).toBe(false);
    expect(mockSession.save).toHaveBeenCalled();
    expect(result).toEqual(invalidObject);
  });

  it("should return null for accessToken and userId when session does not exist", async () => {
    const mockSession = null;

    const mockUserData = {
      register: "456",
    };

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: mockUserData,
    });

    const result = await getAuthToken(mockToken, mockSession);

    expect(result).toStrictEqual(invalidObject);
  });

  it("should return unauthenticated response when session exists but user data is invalid", async () => {
    const mockSession = {
      id: "123",
      expiresAt: new Date(Date.now() + 3600000),
      isActive: true,
      save: jest.fn(),
    } as unknown as Session;

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: null,
    });

    const result = await getAuthToken(mockToken, mockSession);

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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: null,
      userData: null,
    });

    const result = await getAuthToken(invalidToken, mockSession);

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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: mockUserData,
    });

    const result = await getAuthToken(mockToken, mockSession);

    expect(result).toEqual(invalidObject);
  });

  it("should return unauthenticated response when an error occurs", async () => {
    const mockToken = "invalid-token";
    const mockSession = null;

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: null,
      userData: null,
    });

    const result = await getAuthToken(mockToken, mockSession);

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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: mockUserData,
    });

    const result = await getAuthToken(mockToken, mockSession);

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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockToken,
      userData: mockUserData,
    });

    const result = await getAuthToken(mockToken, mockSession);

    expect(mockSession.isActive).toBe(false);
    expect(mockSession.save).toHaveBeenCalled();
    expect(result).toEqual(invalidObject);
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

    (getUserByToken as jest.Mock).mockReturnValue({
      accessToken: mockTokenWithoutBearer,
      userData: mockUserData,
    });

    const resultWithBearer = await getAuthToken(
      mockTokenWithBearer,
      mockSession,
    );
    const resultWithoutBearer = await getAuthToken(
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
