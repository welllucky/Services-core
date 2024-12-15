import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./CreateUser.dto";

export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, [
    "register",
    "lastConnection",
    //   "isBanned",
    //   "canCreateTicket",
    //   "canResolveTicket",
    //   "systemRole",
  ]),
) {}
