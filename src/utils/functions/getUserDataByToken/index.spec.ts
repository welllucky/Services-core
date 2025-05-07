import { IUser } from "@/typing";
import { verify } from "jsonwebtoken";
import { getUserDataByToken } from ".";

jest.mock("jsonwebtoken");

describe("Get User Data By Token - Unit Test - Suite", () => {
  const mockUser = { id: "123", name: "Test User" };
  const mockAuthSecret = "test-secret";
  beforeEach(() => {
    (verify as jest.Mock).mockReturnValue(mockUser);
    jest.replaceProperty(process, "env", {
      AUTH_SECRET: mockAuthSecret,
    });
  });

  it("should return user data and access token when valid Bearer token provided", async () => {
    const mockToken = "Bearer abc123";

    const result = await getUserDataByToken(mockToken);

    expect(verify).toHaveBeenCalledWith("abc123", mockAuthSecret, {
      algorithms: ["HS256"],
    });
    expect(result).toEqual({
      userData: mockUser,
      accessToken: "abc123",
    });
  });

  it("should return null values when empty token provided", async () => {
    const emptyToken = "";

    const result = await getUserDataByToken(emptyToken);

    expect(result).toEqual({
      userData: null,
      accessToken: null,
    });
  });

  it("should return user data and access token when valid token without Bearer prefix is provided", async () => {
    const mockUser = { id: "123", name: "Test User" };
    const mockToken = "abc123";

    (verify as jest.Mock).mockReturnValue(mockUser);

    const result = await getUserDataByToken(mockToken);

    expect(verify).toHaveBeenCalledWith("abc123", mockAuthSecret, {
      algorithms: ["HS256"],
    });
    expect(result).toEqual({
      userData: mockUser,
      accessToken: "abc123",
    });
  });

  it("should return user data and access token when valid Bearer token is provided", async () => {
    const mockUser = { id: "123", name: "Test User" };
    const mockToken = "Bearer abc123";

    (verify as jest.Mock).mockReturnValue(mockUser);

    const result = await getUserDataByToken(mockToken);

    expect(verify).toHaveBeenCalledWith("abc123", mockAuthSecret, {
      algorithms: ["HS256"],
    });
    expect(result).toEqual({
      userData: mockUser,
      accessToken: "abc123",
    });
  });

  it("should cast token payload to IUser type when valid token is provided", async () => {
    const mockUser: IUser = { register: "123", name: "Test User" };
    const mockToken = "Bearer abc123";

    (verify as jest.Mock).mockReturnValue(mockUser);

    const result = await getUserDataByToken(mockToken);

    expect(verify).toHaveBeenCalledWith("abc123", mockAuthSecret, {
      algorithms: ["HS256"],
    });
    expect(result.userData).toEqual(mockUser);
  });

  it("should use empty string as authToken when AUTH_SECRET is missing", async () => {
    const mockUser = { id: "123", name: "Test User" };
    const mockToken = "Bearer abc123";

    delete process.env.AUTH_SECRET;

    (verify as jest.Mock).mockReturnValue(mockUser);

    const result = await getUserDataByToken(mockToken);

    expect(verify).toHaveBeenCalledWith("abc123", "", {
      algorithms: ["HS256"],
    });
    expect(result).toEqual({
      userData: mockUser,
      accessToken: "abc123",
    });
  });

  it("should return null for userData and accessToken when token is invalid", async () => {
    const mockToken = "Bearer invalidToken";

    (verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const result = await getUserDataByToken(mockToken);

    expect(result).toEqual({
      userData: null,
      accessToken: null,
    });
  });

  it("should return null for userData and accessToken when token is undefined", async () => {
    const result = await getUserDataByToken(undefined);
    expect(result).toEqual({
      userData: null,
      accessToken: null,
    });
  });

  it("should throw an error when token is malformed", async () => {
    const malformedToken = "Bearer malformedToken";

    (verify as jest.Mock).mockImplementation(() => {
      throw new Error("Token verification failed");
    });

    const result = await getUserDataByToken(malformedToken);

    expect(result).toEqual({
      userData: null,
      accessToken: null,
    });
  });

  it("should throw error when token algorithm is invalid", async () => {
    const mockToken = "Bearer invalidToken";

    (verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid algorithm");
    });

    const result = await getUserDataByToken(mockToken);

    expect(result).toEqual({
      userData: null,
      accessToken: null,
    });
  });

  it("should return null userData and accessToken when token is expired", async () => {
    const mockToken = "Bearer expiredToken";

    (verify as jest.Mock).mockImplementation(() => {
      throw new Error("TokenExpiredError");
    });

    const result = await getUserDataByToken(mockToken);

    expect(verify).toHaveBeenCalledWith("expiredToken", mockAuthSecret, {
      algorithms: ["HS256"],
    });
    expect(result).toEqual({
      userData: null,
      accessToken: null,
    });
  });
});
