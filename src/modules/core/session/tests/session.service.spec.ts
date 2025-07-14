// Mock UserModel at module level
const mockUserModel = {
    init: jest.fn(),
    getData: jest.fn(),
    exists: jest.fn(),
    Register: jest.fn(),
    Role: jest.fn(),
    Email: jest.fn(),
};

jest.mock("@/models", () => ({
    SessionModel: jest.fn(),
    UserModel: jest.fn(() => mockUserModel),
}));

// Import the mocked UserModel
import { UserModel } from "@/models";

import { SessionService } from "@/modules/shared/session";
import { UserWithSession } from "@/typing";
import {
  AUTH_SECRET_MOCK,
  user,
} from "@/utils";
import { Test, TestingModule } from "@nestjs/testing";
import { SessionRepository } from "../../../../repositories/session.repository";
import { UserRepository } from "../../../../repositories/user.repository";
import { mockedSessionData } from "./utils";

describe.skip("Session Service - Unit Test - Suite", () => {
    let repository: SessionRepository;
    let service: SessionService;
    const compareMock = jest.fn();

    beforeEach(async () => {
        jest.replaceProperty(process, "env", {
            AUTH_SECRET: AUTH_SECRET_MOCK,
        });

        jest.mock("bcryptjs", () => {
            return {
                compareSync: compareMock.mockReturnValue(true),
            };
        });
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                SessionService,
                {
                    provide: UserModel,
                    useValue: mockUserModel,
                },
                {
                    provide: SessionRepository,
                    useValue: {
                        find: jest.fn(),
                        findAll: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: UserRepository,
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        save: jest.fn(),
                        findByEmail: jest.fn(),
                        findByRegister: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = moduleRef.get(SessionRepository);
        service = moduleRef.get(SessionService);
    });

    describe("Find Method - Suite", () => {
        it("should throw an error if userId is not provided", async () => {
            await expect(service.find("")).rejects.toThrow(
                "UserId was not provided, please inform the user id.",
            );
        });

        it("Should call the repository find method", async () => {
            const findRepositoryMethod = jest
                .spyOn(repository, "find")
                .mockResolvedValue({
                    ...mockedSessionData(),
                });

            await service.find("1");

            expect(findRepositoryMethod).toHaveBeenCalledTimes(1);
        });

        it("should throw an error if find repository method returns null", async () => {
            jest.spyOn(repository, "find").mockResolvedValue(null);

            await expect(service.find("1")).rejects.toThrow(
                "Session not found",
            );
        });

        it("should return a empty objet if find repository method returns null and safe property is true", async () => {
            jest.spyOn(repository, "find").mockResolvedValue(null);

            expect(
                await service.find("1", undefined, undefined, true),
            ).toStrictEqual({
                createdAt: undefined,
                expiresAt: undefined,
                id: undefined,
                isActive: undefined,
                userId: undefined,
            });
        });

        it("should return a session by user id", async () => {
            const session = mockedSessionData();
            jest.spyOn(repository, "find").mockResolvedValue(session);

            expect(await service.find("1")).toStrictEqual({
                createdAt: session.createdAt,
                expiresAt: session.expiresAt,
                id: session.id,
                isActive: session.isActive,
                userId: session.user.register,
            });
        });

        it("should call the find repository method with status property with 'active' by default", async () => {
            const findRepositoryMethod = jest
                .spyOn(repository, "find")
                .mockResolvedValue(mockedSessionData());

            await service.find("1");

            expect(findRepositoryMethod).toHaveBeenCalledWith(
                "1",
                undefined,
                "active",
            );
        });

        it("should call the find repository method with status property with 'inactive'", async () => {
            const findRepositoryMethod = jest
                .spyOn(repository, "find")
                .mockResolvedValue(mockedSessionData());

            await service.find("1", undefined, "inactive");

            expect(findRepositoryMethod).toHaveBeenCalledWith(
                "1",
                undefined,
                "inactive",
            );
        });

        it("should call the find repository method with status property with 'all'", async () => {
            const findRepositoryMethod = jest
                .spyOn(repository, "find")
                .mockResolvedValue(mockedSessionData());

            await service.find("1", undefined, "all");

            expect(findRepositoryMethod).toHaveBeenCalledWith(
                "1",
                undefined,
                "all",
            );
        });

        it("should call the find repository method with session id", async () => {
            const findRepositoryMethod = jest
                .spyOn(repository, "find")
                .mockResolvedValue(mockedSessionData());

            await service.find("1", "24");

            expect(findRepositoryMethod).toHaveBeenCalledWith(
                "1",
                "24",
                "active",
            );
        });
    });

    describe("Find All Method - Suite", () => {
        it("Should call find service method", async () => {
            const findMethod = jest
                .spyOn(service, "find")
                .mockResolvedValue(mockedSessionData());

            await service.findAll(
                {...user } as unknown as UserWithSession,
                { index: undefined, page: undefined },
                undefined,
                true,
            );

            expect(findMethod).toHaveBeenCalledTimes(1);
        });

        it("Should throw error if actual session is not found", async () => {
            jest.spyOn(service, "find").mockResolvedValue({});

            await expect(
                service.findAll(
                    {...user } as unknown as UserWithSession,
                    { index: undefined, page: undefined },
                    undefined,
                    true,
                ),
            ).rejects.toThrow("User could not access this resource");
        });

        it("Should throw error if actual session is not active", async () => {
            jest.spyOn(service, "find").mockResolvedValue(
                mockedSessionData(false),
            );

            await expect(
                service.findAll(
                     {...user } as unknown as UserWithSession,
                    { index: undefined, page: undefined },
                    undefined,
                    true,
                ),
            ).rejects.toThrow("User could not access this resource");
        });

        it("Should throw error if sessions are not found and safe property is false", async () => {
            jest.spyOn(service, "find").mockResolvedValue(mockedSessionData());

            await expect(service.findAll( {...user } as unknown as UserWithSession,)).rejects.toThrow(
                "Sessions not found",
            );
        });

        it("Should return undefined if sessions are not found and safe property is true", async () => {
            jest.spyOn(service, "find").mockResolvedValue(mockedSessionData());

            expect(
                await service.findAll(
                     {...user } as unknown as UserWithSession,
                    { index: undefined, page: undefined },
                    undefined,
                    true,
                ),
            ).toStrictEqual({ data: undefined, message: "0 session(s) found" });
        });

        it("Should return sessions", async () => {
            const sessionList = [mockedSessionData()];
            jest.spyOn(service, "find").mockResolvedValue(mockedSessionData());
            jest.spyOn(service, "findAll").mockResolvedValue({
                data: sessionList,
                message: `${sessionList.length} sessions found`,
            });

            expect(await service.findAll( {...user } as unknown as UserWithSession,)).toStrictEqual({
                data: sessionList,
                message: `${sessionList.length} sessions found`,
            });
        });
    });

    describe("Close Method - Suite", () => {
        it("Should throw error if user id is not provided", async () => {
            jest.spyOn(repository, "find").mockResolvedValue(null);

            await expect(
                service.close( {...user, register: "" } as unknown as UserWithSession,),
            ).rejects.toThrow(
                "User not found or not exists, please check the credentials.",
            );
        });

        it("Should throw error if actual session is not found", async () => {
            jest.spyOn(repository, "find").mockResolvedValue(null);

            await expect(service.close( {...user } as unknown as UserWithSession,)).rejects.toThrow(
                "Active session not found",
            );
        });

        it("Should return a response with status code 400 if session is not valid", async () => {
            const session = mockedSessionData(false);
            jest.spyOn(repository, "find").mockResolvedValue(session);
            jest.spyOn(repository, "update").mockResolvedValue({
                affected: 1,
                raw: null,
                generatedMaps: [{}],
            });

            await expect(service.close( {...user } as unknown as UserWithSession,)).rejects.toThrow(
                "Session not valid or not exists",
            );
        });

        it("Should throw error if session is not updated", async () => {
            const session = mockedSessionData();
            jest.spyOn(repository, "find").mockResolvedValue(session);
            jest.spyOn(repository, "update").mockResolvedValue({
                affected: 0,
                raw: null,
                generatedMaps: [],
            });

            await expect(service.close( {...user } as unknown as UserWithSession,)).rejects.toThrow(
                "Occurred an error while updating the session, please try again later",
            );
        });

        it("Should return a response with status code 204 if session is updated", async () => {
            const session = mockedSessionData();
            jest.spyOn(repository, "find").mockResolvedValue(session);
            jest.spyOn(repository, "update").mockResolvedValue({
                affected: 1,
                raw: null,
                generatedMaps: [{}],
            });

            expect((await service.close( {...user } as unknown as UserWithSession,)).statusCode).toBe(
                204,
            );
        });
    });

    // describe("Create Method - Suite", () => {
    //     it("Should throw error if email is not provided", async () => {
    //         await expect(
    //             service.create({
    //                 email: "",
    //                 password: credentials.password,
    //             }),
    //         ).rejects.toThrow("Email is empty. Please fill all fields.");
    //     });

    //     it("Should throw error if password is not provided", async () => {
    //         await expect(
    //             service.create({
    //                 email: credentials.email,
    //                 password: "",
    //             }),
    //         ).rejects.toThrow("Password is empty. Please fill all fields.");
    //     });

    //     it.failing("Should call init user model method", async () => {
    //         const initUserModelMethod = jest
    //             .spyOn(userModel, "init")
    //             .mockImplementation(() => Promise.resolve(mockedUser));
    //         jest.spyOn(userModel, "getData").mockImplementation(
    //             () => mockedUser,
    //         );
    //         jest.spyOn(sessionModel, "createAccessToken").mockResolvedValue({
    //             accessToken:  {...user } as unknown as UserWithSession,,
    //             expiresAt: new Date(),
    //         });

    //         await service.create(credentials);

    //         expect(initUserModelMethod).toHaveBeenCalledTimes(1);
    //     });

    //     it("Should throw error if user not exists", async () => {
    //         jest.spyOn(userModel, "getData").mockImplementation(() => null);
    //         jest.spyOn(sessionModel, "createAccessToken").mockResolvedValue({
    //             accessToken:  {...user } as unknown as UserWithSession,,
    //             expiresAt: new Date(),
    //         });
    //         jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);

    //         await expect(service.create(credentials)).rejects.toThrow(
    //             "User not found",
    //         );
    //     });

    //     it.failing("Should call repository find method", async () => {
    //         const session = mockedSessionData();
    //         jest.spyOn(userModel, "getData").mockImplementation(
    //             () => mockedUser,
    //         );
    //         jest.spyOn(sessionModel, "createAccessToken").mockResolvedValue({
    //             accessToken:  {...user } as unknown as UserWithSession,,
    //             expiresAt: new Date(),
    //         });
    //         jest.spyOn(repository, "update").mockResolvedValue({
    //             affected: 1,
    //             raw: null,
    //             generatedMaps: [{}],
    //         });
    //         jest.spyOn(userRepository, "findByEmail").mockResolvedValue(
    //             mockedUser,
    //         );

    //         const findRepositoryMethod = jest
    //             .spyOn(repository, "find")
    //             .mockResolvedValue(session);

    //         await service.create(credentials);

    //         expect(findRepositoryMethod).toHaveBeenCalled();
    //     });

    //     it.failing("Should close a session active if it exists", async () => {
    //         const session = mockedSessionData();
    //         jest.spyOn(userModel, "getData").mockImplementation(
    //             () => mockedUser,
    //         );
    //         jest.spyOn(sessionModel, "createAccessToken").mockResolvedValue({
    //             accessToken:  {...user } as unknown as UserWithSession,,
    //             expiresAt: new Date(),
    //         });
    //         const updateSessionMethod = jest
    //             .spyOn(repository, "update")
    //             .mockResolvedValue({
    //                 affected: 1,
    //                 raw: null,
    //                 generatedMaps: [{}],
    //             });
    //         jest.spyOn(repository, "find").mockResolvedValue(session);
    //         jest.spyOn(userRepository, "findByEmail").mockResolvedValue(
    //             mockedUser,
    //         );

    //         await service.create(credentials);

    //         expect(updateSessionMethod).toHaveBeenCalledWith(
    //             {
    //                 isActive: false,
    //             },
    //             session.id,
    //             mockedUser.id,
    //         );
    //     });

    //     it("Should throw error if occurred a error to close the active user session", async () => {
    //         const session = mockedSessionData();
    //         jest.spyOn(userModel, "getData").mockImplementation(
    //             () => mockedUser,
    //         );
    //         jest.spyOn(sessionModel, "createAccessToken").mockResolvedValue({
    //             accessToken:  {...user } as unknown as UserWithSession,,
    //             expiresAt: new Date(),
    //         });
    //         jest.spyOn(repository, "update").mockResolvedValue({
    //             affected: 0,
    //             raw: null,
    //             generatedMaps: [],
    //         });
    //         jest.spyOn(repository, "find").mockResolvedValue(session);
    //         jest.spyOn(userRepository, "findByEmail").mockResolvedValue(
    //             mockedUser,
    //         );

    //         await expect(service.create(credentials)).rejects.toThrow(
    //             "Exist a session already active and could not be closed. Please try again later",
    //         );
    //     });

    //     it.failing(
    //         "Should create the access token if user is authenticated",
    //         async () => {
    //             const session = mockedSessionData();
    //             jest.spyOn(userModel, "getData").mockImplementation(
    //                 () => mockedUser,
    //             );
    //             jest.spyOn(sessionModel, "createAccessToken").mockResolvedValue(
    //                 {
    //                     accessToken:  {...user } as unknown as UserWithSession,,
    //                     expiresAt: new Date(),
    //                 },
    //             );
    //             jest.spyOn(repository, "update").mockResolvedValue({
    //                 affected: 1,
    //                 raw: null,
    //                 generatedMaps: [{}],
    //             });
    //             jest.spyOn(repository, "find").mockResolvedValue(session);
    //             jest.spyOn(userRepository, "findByEmail").mockResolvedValue(
    //                 mockedUser,
    //             );

    //             const result = await service.create(credentials);

    //             expect(JSON.stringify(result)).toBe(
    //                 `{"message":"Session created","data":{"token":"${ {...user } as unknown as UserWithSession,}","expiresAt":"${new Date().toISOString()}"}}`,
    //             );
    //         },
    //     );
    // });
});
