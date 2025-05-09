import { compareSync } from "bcryptjs";
import { comparePassword, encryptPassword } from ".";

describe("Encrypt Password - Unit Test - Suite", () => {
    it("should return hashed password and salt when given valid password", () => {
        const password = "mySecurePassword123";

        const result = encryptPassword(password);

        expect(result.hashedPassword).toBeDefined();
        expect(result.salt).toBeDefined();
        expect(typeof result.hashedPassword).toBe("string");
        expect(typeof result.salt).toBe("string");
        expect(result.hashedPassword.length).toBeGreaterThan(0);
        expect(result.salt.length).toBeGreaterThan(0);
    });

    it("should encrypt empty string password", () => {
        const password = "";

        const result = encryptPassword(password);

        expect(result.hashedPassword).toBeDefined();
        expect(result.salt).toBeDefined();
        expect(typeof result.hashedPassword).toBe("string");
        expect(typeof result.salt).toBe("string");
        expect(result.hashedPassword.length).toBeGreaterThan(0);
        expect(result.salt.length).toBeGreaterThan(0);
    });

    it("should return an object with hashedPassword and salt properties when a password is provided", () => {
        const password = "examplePassword123";

        const result = encryptPassword(password);

        expect(result.hashedPassword).toBeDefined();
        expect(result.salt).toBeDefined();
        expect(typeof result.hashedPassword).toBe("string");
        expect(typeof result.salt).toBe("string");
        expect(result.hashedPassword.length).toBeGreaterThan(0);
        expect(result.salt.length).toBeGreaterThan(0);
    });

    it("should generate unique salt for each password encryption", () => {
        const password1 = "password123";
        const password2 = "password456";

        const result1 = encryptPassword(password1);
        const result2 = encryptPassword(password2);

        expect(result1.salt).not.toEqual(result2.salt);
    });

    it("should generate different hashes for the same password due to different salts", () => {
        const password = "mySecurePassword123";

        const result1 = encryptPassword(password);
        const result2 = encryptPassword(password);

        expect(result1.hashedPassword).not.toEqual(result2.hashedPassword);
        expect(result1.salt).not.toEqual(result2.salt);
    });

    it("should return consistent hash length for different password lengths", () => {
        const shortPassword = "short";
        const longPassword = "thisIsAVeryLongPasswordThatExceedsNormalLength";

        const shortResult = encryptPassword(shortPassword);
        const longResult = encryptPassword(longPassword);

        expect(shortResult.hashedPassword.length).toBe(
            longResult.hashedPassword.length,
        );
    });

    it("should return hashed password and salt when given a very long password", () => {
        const longPassword = "a".repeat(1000);

        const result = encryptPassword(longPassword);

        expect(result.hashedPassword).toBeDefined();
        expect(result.salt).toBeDefined();
        expect(typeof result.hashedPassword).toBe("string");
        expect(typeof result.salt).toBe("string");
        expect(result.hashedPassword.length).toBeGreaterThan(0);
        expect(result.salt.length).toBeGreaterThan(0);
    });

    it("should return hashed password and salt when given password with special characters", () => {
        const password = "P@ssw0rd!#%&";

        const result = encryptPassword(password);

        expect(result.hashedPassword).toBeDefined();
        expect(result.salt).toBeDefined();
        expect(typeof result.hashedPassword).toBe("string");
        expect(typeof result.salt).toBe("string");
        expect(result.hashedPassword.length).toBeGreaterThan(0);
        expect(result.salt.length).toBeGreaterThan(0);
    });

    it("should return hashed password and salt when password contains only numbers", () => {
        const password = "1234567890";

        const result = encryptPassword(password);

        expect(result.hashedPassword).toBeDefined();
        expect(result.salt).toBeDefined();
        expect(typeof result.hashedPassword).toBe("string");
        expect(typeof result.salt).toBe("string");
        expect(result.hashedPassword.length).toBeGreaterThan(0);
        expect(result.salt.length).toBeGreaterThan(0);
    });

    it("should return hashed password and salt when given password with unicode characters", () => {
        const password = "P@sswørd😊123";

        const result = encryptPassword(password);

        expect(result.hashedPassword).toBeDefined();
        expect(result.salt).toBeDefined();
        expect(typeof result.hashedPassword).toBe("string");
        expect(typeof result.salt).toBe("string");
        expect(result.hashedPassword.length).toBeGreaterThan(0);
        expect(result.salt.length).toBeGreaterThan(0);
    });

    it("should throw an error when password is null or undefined", () => {
        expect(() => encryptPassword(null)).toThrow();
        expect(() => encryptPassword(undefined)).toThrow();
    });

    it("should verify hashed password using compareSync when given valid password", () => {
        const password = "mySecurePassword123";

        const result = encryptPassword(password);

        const isPasswordValid = compareSync(password, result.hashedPassword);

        expect(isPasswordValid).toBe(true);
    });
});

describe("Compare Password - Unit Test - Suite", () => {
    it("should return isValid true when password matches hash", async () => {
        const password = "test123";
        const { hashedPassword } = encryptPassword(password);

        const result = await comparePassword(password, hashedPassword);

        expect(result.isValid).toBe(true);
    });

    it("should return isValid false when password is empty", async () => {
        const password = "";
        const { hashedPassword } = encryptPassword("test123");

        const result = await comparePassword(password, hashedPassword);

        expect(result.isValid).toBe(false);
    });

    it("should return isValid false when password does not match hash", async () => {
        const password = "wrongPassword";
        const { hashedPassword } = encryptPassword("correctPassword");

        const result = await comparePassword(password, hashedPassword);

        expect(result.isValid).toBe(false);
    });

    it("should return isValid true when password matches hash", async () => {
        const password = "test123";
        const { hashedPassword } = encryptPassword(password);

        const result = await comparePassword(password, hashedPassword);

        expect(result.isValid).toBe(true);
    });

    it("should return isValid false when password does not match hash", async () => {
        const password = "wrongPassword";
        const { hashedPassword } = encryptPassword("correctPassword");

        const result = await comparePassword(password, hashedPassword);

        expect(result.isValid).toBe(false);
    });

    it("should return isValid false when hash is empty", async () => {
        const password = "test123";
        const hash = "";

        const result = await comparePassword(password, hash);

        expect(result.isValid).toBe(false);
    });

    it("should return isValid false when hash format is invalid", async () => {
        const password = "test123";
        const malformedHash = "invalidhashformat";

        const result = await comparePassword(password, malformedHash);

        expect(result.isValid).toBe(false);
    });

    it("should return isValid true when password with special Unicode characters matches hash", async () => {
        const password = "p@sswørd😊";
        const { hashedPassword } = encryptPassword(password);

        const result = await comparePassword(password, hashedPassword);

        expect(result.isValid).toBe(true);
    });

    it("should return isValid true when password with whitespace matches hash", async () => {
        const password = "  test123  ";
        const { hashedPassword } = encryptPassword(password);

        const result = await comparePassword(password.trim(), hashedPassword);

        expect(result.isValid).toBe(true);
    });

    it("should return isValid true when password matches hash at bcrypt work factor boundary", async () => {
        const password = "boundaryTest123";
        const { hashedPassword } = encryptPassword(password);

        const result = await comparePassword(password, hashedPassword);

        expect(result.isValid).toBe(true);
    });
});
