import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from '../role.controller';
import { RoleService } from '../role.service';

describe('RoleController', () => {
  let service: RoleService;
  let controller: RoleController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: {
            getRoles: jest.fn(),
            changeRole: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<RoleController>(RoleController);
    service = moduleRef.get<RoleService>(RoleService);
  });

  describe("Get roles", () => {
    it("should call role service getRoles method", async () => {
      const serviceMock = jest.spyOn(service, "getRoles");
      await controller.getRoles();
      expect(serviceMock).toHaveBeenCalled();
    });
  });

  describe("Put - change role", () => {
    it("should call role service changeRole method", async () => {
      const serviceMock = jest.spyOn(service, "changeRole");
      await controller.changeRole("", "user", "");
      expect(serviceMock).toHaveBeenCalled();
    });

    it("should call role service changeRole method with token, user and new role", async () => {
      const serviceMock = jest.spyOn(service, "changeRole");
      await controller.changeRole("242424", "user", "valid_token");
      expect(serviceMock).toHaveBeenCalledWith("valid_token", "242424", "user");
    });
  });
});
