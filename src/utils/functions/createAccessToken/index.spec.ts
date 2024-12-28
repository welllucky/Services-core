import { verify } from "jsonwebtoken";
import { createAccessToken } from ".";

describe("Create Access Token - Unit Test - Suite", () => {
  it("should create valid JWT token with provided data, secret and expiration time", () => {
    const data = { userId: "123" };
    const secret = "test-secret";
    const expiresIn = 7;

    const token = createAccessToken(data, secret, expiresIn);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should create token when empty object provided as data", () => {
    const data = {};
    const secret = "test-secret";
    const expiresIn = 1;

    const token = createAccessToken(data, secret, expiresIn);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should return a valid JWT token with correct format and structure when given valid inputs", () => {
    const data = { userId: "123" };
    const secret = "my-secret";
    const expiresIn = 5;

    const token = createAccessToken(data, secret, expiresIn);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should set expiration time in days based on the expiresIn parameter", () => {
    const data = { userId: "123" };
    const secret = "test-secret";
    const expiresIn = 5;

    const token = createAccessToken(data, secret, expiresIn);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should sign token with HS256 algorithm and return a valid JWT", () => {
    const data = { userId: "123" };
    const secret = "test-secret";
    const expiresIn = 7;

    const token = createAccessToken(data, secret, expiresIn);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should use the provided secret key for signing the token", () => {
    const data = { userId: "123" };
    const secret = "test-secret";
    const expiresIn = 7;

    const token = createAccessToken(data, secret, expiresIn);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should decode token back to original data when valid secret is used", () => {
    const data = { userId: "123" };
    const secret = "test-secret";
    const expiresIn = 7;

    const token = createAccessToken(data, secret, expiresIn);

    const decoded = verify(token, secret);

    expect(decoded).toMatchObject(data);
  });

  it("should generate a JWT token with three parts separated by dots", () => {
    const data = { userId: "123" };
    const secret = "test-secret";
    const expiresIn = 7;

    const token = createAccessToken(data, secret, expiresIn);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should set token expiration to the specified number of days", () => {
    const data = { userId: "123" };
    const secret = "test-secret";
    const expiresIn = 5;

    const token = createAccessToken(data, secret, expiresIn);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should fail verification when using incorrect secret", () => {
    const data = { userId: "123" };
    const correctSecret = "correct-secret";
    const wrongSecret = "wrong-secret";
    const expiresIn = 7;

    const token = createAccessToken(data, correctSecret, expiresIn);

    expect(() => {
      verify(token, wrongSecret);
    }).toThrow();
  });

  it("should expire token after specified duration", () => {
    const data = { userId: "123" };
    const secret = "test-secret";
    const expiresIn = 1;

    const token = createAccessToken(data, secret, expiresIn);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);

    const decoded = verify(token, secret);

    const currentTime = Math.floor(Date.now() / 1000);
    expect(decoded["exp"]).toBeLessThanOrEqual(
      currentTime + expiresIn * 24 * 60 * 60,
    );
  });
});
