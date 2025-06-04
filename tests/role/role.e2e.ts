import { RoleController } from "@/modules/backoffice/role/role.controller";
import { RoleService } from "@/modules/backoffice/role/role.service";
import { UserRepository } from "@/modules/core/user/user.repository";
import { RolesSchema } from "@/typing";
import { getUserDataByToken, user } from "@/utils";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";

const mockedUser = {
    ...user,
    register: "242424",
    role: "admin",
};
const userRepository = {
    updateRole: jest.fn(),
    findByRegister: jest.fn(),
    findByEmail: jest.fn(),
};

jest.mock("@/utils/functions/getUserDataByToken");

describe("Role - E2E Test - Suite", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [RoleController],
            providers: [
                RoleService,
                {
                    provide: UserRepository,
                    useValue: userRepository,
                },
            ],
        }).compile();

        app = moduleRef.createNestApplication();

        (getUserDataByToken as jest.Mock).mockReturnValue({
            userData: mockedUser,
            accessToken: "valid_token",
        });

        await app.init();
    });

    it("GET /roles - should return all roles", () => {
        return request(app.getHttpServer())
            .get("/roles")
            .expect(200)
            .expect(Object.values(RolesSchema.Values));
    });
    it("PUT /roles/change/:user/:newRole - should change the role", async () => {
        jest.spyOn(userRepository, "findByRegister").mockReturnValueOnce({
            ...mockedUser,
        });
        jest.spyOn(userRepository, "findByRegister").mockReturnValueOnce({
            ...mockedUser,
            role: "user",
        });
        jest.spyOn(userRepository, "updateRole").mockResolvedValue({
            affected: 1,
            raw: [],
            generatedMaps: [],
        });


        return request(app.getHttpServer())
            .put("/roles/change/111111/admin")
            .set("Authorization", "Bearer valid_token")
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual({
                    message: "User role changed with success!",
                });
            });
    });
    it("PUT /roles/change/:user/:newRole - should throw error if user not found", async () => {
        jest.spyOn(userRepository, "findByRegister").mockResolvedValue(null);

        return request(app.getHttpServer())
            .put("/roles/change/111111/admin")
            .set("Authorization", "Bearer valid_token")
            .expect(404)
            .then((res) => {
                expect(res.body).toEqual({
                    message: "User not found",
                    error: "Not Found",
                    statusCode: 404,
                });
            });
    });
    it("PUT /roles/change/:user/:newRole - should throw error if role is invalid", async () => {
        jest.spyOn(userRepository, "findByRegister").mockResolvedValue({
            ...mockedUser,
        });
        jest.spyOn(userRepository, "updateRole").mockResolvedValue({
            affected: 0,
            raw: [],
            generatedMaps: [],
        });

        return request(app.getHttpServer())
            .put("/roles/change/111111/owner")
            .set("Authorization", "Bearer valid_token")
            .expect(400)
            .then((res) => {
                expect(res.body).toEqual({
                    message: "'owner' is not a valid role",
                    error: "Bad Request",
                    statusCode: 400,
                });
            });
    });
    it("PUT /roles/change/:user/:newRole - should throw error if user is not allowed", async () => {
        jest.spyOn(userRepository, "findByRegister").mockReturnValueOnce({
            ...mockedUser,
            role: "user",
        });
        jest.spyOn(userRepository, "findByRegister").mockReturnValueOnce({
            ...mockedUser,
            role: "user",
        });
        jest.spyOn(userRepository, "updateRole").mockResolvedValue({
            affected: 0,
            raw: [],
            generatedMaps: [],
        });

        return request(app.getHttpServer())
            .put("/roles/change/111111/admin")
            .set("Authorization", "Bearer valid_token")
            .expect(403)
            .then((res) => {
                expect(res.body).toEqual({
                    message: "Forbidden",
                    statusCode: 403,
                });
            });
    });
    it("PUT /roles/change/:user/:newRole - should throw error if user is trying to change their own role", async () => {
            jest.spyOn(userRepository, "findByRegister").mockResolvedValue({
                ...mockedUser,
            });
            jest.spyOn(userRepository, "updateRole").mockResolvedValue({
                affected: 0,
                raw: [],
                generatedMaps: [],
            });

            return request(app.getHttpServer())
                .put("/roles/change/242424/admin")
                .set("Authorization", "Bearer valid_token")
                .expect(403)
                .then((res) => {
                    expect(res.body).toEqual({
                        message: "You can't change your own role",
                        error: "Forbidden",
                        statusCode: 403,
                    });
                });
        }
    );
    it("PUT /roles/change/:user/:newRole - should throw internal error if role update fails", async () => {
        jest.spyOn(userRepository, "findByRegister").mockReturnValueOnce({
            ...mockedUser,
        });
        jest.spyOn(userRepository, "findByRegister").mockReturnValueOnce({
            ...mockedUser,
            role: "user",
        });
        jest.spyOn(userRepository, "updateRole").mockResolvedValue({
            affected: 0,
            raw: [],
            generatedMaps: [],
        });

        return request(app.getHttpServer())
            .put("/roles/change/111111/admin")
            .set("Authorization", "Bearer valid_token")
            .expect(500)
            .then((res) => {
                expect(res.body).toEqual({
                    message: "Error on update user role.",
                    error: "Internal Server Error",
                    statusCode: 500,
                });
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
