import { mockedAccessToken } from "@/utils";
import { Test, TestingModule } from "@nestjs/testing";
import { SessionController } from "../session.controller";
import { SessionService } from "../session.service";
import { credentials } from "./utils";

describe("Session Controller - Unit Test - Suite", () => {
  let service: SessionService;
  let controller: SessionController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            close: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(SessionController);
    service = moduleRef.get(SessionService);
  });

  describe("Get all sessions", () => {
    it("should call session service findAll method", async () => {
      const serviceMock = jest.spyOn(service, "findAll");
      await controller.getAll();
      expect(serviceMock).toHaveBeenCalled();
    });

    it("should call session service findAll method with status", async () => {
      const serviceMock = jest.spyOn(service, "findAll");
      await controller.getAll("inactive");
      expect(serviceMock).toHaveBeenCalledWith("inactive");
    });
  });

  describe("Post - session", () => {
    it("should call session service create method", async () => {
      const serviceMock = jest.spyOn(service, "create");
      await controller.create(credentials);
      expect(serviceMock).toHaveBeenCalled();
    });

    it("should call session service create method with credentials", async () => {
      const serviceMock = jest.spyOn(service, "create");
      await controller.create(credentials);
      expect(serviceMock).toHaveBeenCalledWith(credentials);
    });
  });

  describe("Post - close session", () => {
    it("should call session service close method", async () => {
      const serviceMock = jest.spyOn(service, "close");
      await controller.close({
        token: mockedAccessToken,
      });
      expect(serviceMock).toHaveBeenCalled();
    });

    it("should call session service close method with token", async () => {
      const serviceMock = jest.spyOn(service, "close");
      await controller.close({
        token: mockedAccessToken,
      });
      expect(serviceMock).toHaveBeenCalledWith(mockedAccessToken);
    });
  });

  describe("Post - refresh session", () => {
    it("should return not implemented", async () => {
      expect(controller.refresh()).toBe("Not implemented");
    });
  });
});
