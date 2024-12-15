import { UserRepository } from "@/modules/user/user.repository";
import { Injectable } from "@nestjs/common";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@Injectable()
@ValidatorConstraint({ async: true, name: "uniqueEmail" })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly userRepository: UserRepository) {}
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const user = await this.userRepository.findByEmail(value);

    return !user;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return "Email already exists, please choose another one";
  }
}

export const UniqueEmail = (validationOptions?: ValidationOptions) => {
  return (object: Object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: UniqueEmailValidator,
    });
  };
};
