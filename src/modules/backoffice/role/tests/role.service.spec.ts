import { User } from "@/database/entities";
import { UserRepository } from "@/modules/core/user";
import { RolesSchema, UserWithSession } from "@/typing";
import { user } from "@/utils";
import { Test, TestingModule } from "@nestjs/testing";
import { RoleService } from "../role.service";

jest.mock("@/utils", () => ({
    getUserDataByToken: jest.fn().mockReturnValue({
        register: "123456",
        name: "Test User",
        email: "test@example.com",
        role: "admin"
    }),
    AUTH_SECRET_MOCK: "test-secret",
    ALLOWED_BACKOFFICE_ROLES: ["admin", "owner"],
    user: {
        register: "123456",
        name: "Test User",
        email: "test@example.com",
        role: "admin"
    },
    AllowRoles: jest.fn(() => jest.fn()),
    DeniedRoles: jest.fn(() => jest.fn()),
    IsPublic: jest.fn(() => jest.fn()),
    comparePassword: jest.fn()
}));

describe("Role Service - Unit Test - Suite", () => {
    let service: RoleService;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleService,
                {
                    provide: UserRepository,
                    useValue: {
                        updateRole: jest.fn(),
                        findByRegister: jest.fn(),
                        findByEmail: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<RoleService>(RoleService);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe("Get Roles Method - Suite", () => {
        it("Should return all roles", async () => {
            const result = await service.getRoles();
            expect(result).toEqual(Object.values(RolesSchema.Values));
        });

        it("Should not return a empty array", async () => {
            const result = await service.getRoles();

            expect(result).not.toHaveLength(0);
        });
    });

    describe("Change role Method - Suite", () => {
        it("Should throw error if user not found", async () => {
            // Mock for the actual user (from token) - should return admin user
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "admin",
            } as unknown as User);

            // Mock for the target user - should return null (user not found)
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce(null);

            await expect(
                service.changeRole(user as unknown as UserWithSession, "242424", "admin"),
            ).rejects.toThrow("User not found");
        });

        it("Should throw error if user is trying to change their own role", async () => {
            // Mock for the actual user (from token) - should return admin user
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "admin",
            } as unknown as User);

            // Mock for the target user - should return the same user (trying to change own role)
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "admin",
            } as unknown as User);

            await expect(
                service.changeRole(user as unknown as UserWithSession, user.register, "manager"),
            ).rejects.toThrow("You can't change your own role");
        });

        it("Should call user repository updateRole method", async () => {
            // Mock for the actual user (from token) - should return admin user
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "admin",
            } as unknown as User);

            // Mock for the target user - should return different user
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                register: "242424",
                role: "user",
            } as unknown as User);

            const updateRoleMethod = jest
                .spyOn(userRepository, "updateRole")
                .mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

            await service.changeRole(user as unknown as UserWithSession, "242424", "admin");
            expect(updateRoleMethod).toHaveBeenCalled();
        });

        it("Should return a success message", async () => {
            // Mock for the actual user (from token) - should return admin user
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "admin",
            } as unknown as User);

            // Mock for the target user - should return different user
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                register: "242424",
                role: "user",
            } as unknown as User);

            jest.spyOn(userRepository, "updateRole").mockResolvedValue({
                affected: 1,
                raw: [],
                generatedMaps: [],
            });

            const result = await service.changeRole(
                user as unknown as UserWithSession,
                "242424",
                "admin",
            );

            expect(result).toEqual({
                message: "User role changed with success!",
            });
        });

        it("Should throw http exception if role was not updated", async () => {
            // Mock for the actual user (from token) - should return admin user
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "admin",
            } as unknown as User);

            // Mock for the target user - should return different user
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                register: "242424",
                role: "user",
            } as unknown as User);

            jest.spyOn(userRepository, "updateRole").mockResolvedValue({
                affected: 0,
                raw: [],
                generatedMaps: [],
            });

            await expect(
                service.changeRole(user as unknown as UserWithSession, "242424", "admin"),
            ).rejects.toThrow("Error on update user role.");
        });
    });
});
