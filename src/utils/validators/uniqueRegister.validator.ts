import { UserRepository } from "@/repositories/user.repository";
import { Injectable } from "@nestjs/common";
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

@Injectable()
@ValidatorConstraint({ async: true, name: "uniqueRegister" })
export class UniqueRegisterValidator implements ValidatorConstraintInterface {
    constructor(private readonly userRepository: UserRepository) {}
    async validate(value: string): Promise<boolean> {
        const user = await this.userRepository.findByRegister(value);

        return !user;
    }

    defaultMessage?(): string {
        return "Register already exists, please try logging in";
    }
}
