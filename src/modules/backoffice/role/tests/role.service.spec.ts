import { User } from "@/entities";
import { UserRepository } from "@/modules/core/user";
import { RolesSchema } from "@/typing";
import { user } from "@/utils";
import { getUserDataByToken } from "@/utils/functions/getUserDataByToken";
import { Test, TestingModule } from "@nestjs/testing";
import { RoleService } from "../role.service";

jest.mock("@/utils/functions/getUserDataByToken");

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
            (getUserDataByToken as jest.Mock).mockReturnValue({
                userData: user,
                accessToken: "valid_token",
            });

            jest.spyOn(userRepository, "findByRegister").mockResolvedValue(
                null,
            );

            jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);

            await expect(
                service.changeRole("valid_token", "242424", "admin"),
            ).rejects.toThrow("User not found");
        });

        it("Should throw error if user is trying to change their own role", async () => {
            (getUserDataByToken as jest.Mock).mockReturnValue({
                userData: user,
                accessToken: "valid_token",
            });

            jest.spyOn(userRepository, "findByRegister").mockResolvedValue({
                ...user,
                role: "admin",
            } as unknown as User);

            await expect(
                service.changeRole("valid_token", user.register, "manager"),
            ).rejects.toThrow("You can't change your own role");
        });

        it("Should call user repository updateRole method", async () => {
            (getUserDataByToken as jest.Mock).mockReturnValue({
                userData: user,
                accessToken: "valid_token",
            });

            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "admin",
            } as unknown as User);

            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "user",
            } as unknown as User);

            const updateRoleMethod = jest
                .spyOn(userRepository, "updateRole")
                .mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });
            await service.changeRole("valid_token", "242424", "admin");
            expect(updateRoleMethod).toHaveBeenCalled();
        });

        it("Should return a success message", async () => {
            (getUserDataByToken as jest.Mock).mockReturnValue({
                userData: user,
                accessToken: "valid_token",
            });

            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "admin",
            } as unknown as User);
            jest.spyOn(userRepository, "findByRegister").mockResolvedValueOnce({
                ...user,
                role: "user",
            } as unknown as User);

            jest.spyOn(userRepository, "updateRole").mockResolvedValue({
                affected: 1,
                raw: [],
                generatedMaps: [],
            });

            const result = await service.changeRole(
                "valid_token",
                "242424",
                "admin",
            );

            expect(result).toEqual({
                message: "User role changed with success!",
            });
        });

        it("Should throw http exception if role was not updated", async () => {
            (getUserDataByToken as jest.Mock).mockReturnValue({
                userData: user,
                accessToken: "valid_token",
            });

            jest.spyOn(userRepository, "findByRegister").mockResolvedValue({
                ...user,
                role: "user",
            } as unknown as User);

            jest.spyOn(userRepository, "updateRole").mockResolvedValue({
                affected: 0,
                raw: [],
                generatedMaps: [],
            });

            await expect(
                service.changeRole("valid_token", "242424", "admin"),
            ).rejects.toThrow("Forbidden");
        });
    });
});
