// import { Session } from "@/entities";
// import { User } from "@/entities/user.entity";
// import { SessionController } from "@/modules/session/session.controller";
// import { SessionModel } from "@/modules/session/session.model";
// import { SessionRepository } from "@/modules/session/session.repository";
// import { SessionService } from "@/modules/session/session.service";
// import { UserModule } from "@/modules/user/user.module";
// import { sessions, validSession } from "@/utils";
// import { INestApplication } from "@nestjs/common";
// import { Test, TestingModule } from "@nestjs/testing";
// import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

describe("Session - E2E Test - Suite", () => {
    // let app: INestApplication;
    // const sessionRepository = {
    //   findAll: () => sessions,
    //   find: () => validSession,
    //   update: () => validSession,
    // };

    // const typeOrmModuleOptions: TypeOrmModuleOptions = {
    //   type: "sqlite",
    //   database: ":memory:",
    //   entities: [Session, User],
    //   synchronize: true,
    // };

    // beforeAll(async () => {
    //   const moduleRef: TestingModule = await Test.createTestingModule({
    //     imports: [
    //       // TypeOrmModule.forRoot(typeOrmModuleOptions),
    //       TypeOrmModule.forFeature([Session, User]),
    //       UserModule,
    //     ],
    //     controllers: [SessionController],
    //     providers: [SessionService, SessionRepository, SessionModel],
    //   })
    //     .overrideProvider(SessionRepository)
    //     .useValue(sessionRepository)
    //     .compile();

    //   app = moduleRef.createNestApplication();
    //   await app.init();
    // });

    it.todo("GET /session - should return an session array");

    it.todo(
        "POST /session - should create a session and return the accessToken and expire date",
    );

    it.todo(
        "POST /session/refresh - should refresh the session and return the accessToken and expire date",
    );

    it.todo(
        "POST /session/close - should close the session and return a 204 status code",
    );

    // afterAll(async () => {
    //   await app.close();
    // });
});
