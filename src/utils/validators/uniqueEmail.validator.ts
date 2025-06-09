import { UserRepository } from "@/repositories/user.repository";
import { Injectable } from "@nestjs/common";
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

@Injectable()
@ValidatorConstraint({ async: true, name: "uniqueEmail" })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
    constructor(private readonly userRepository: UserRepository) {}
    async validate(value: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(value);

        return !user;
    }

    defaultMessage?(): string {
        return "Email already exists, please choose another one";
    }
}
