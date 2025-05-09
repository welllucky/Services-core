import { registerDecorator, ValidationOptions } from "class-validator";
import { UniqueRegisterValidator } from "../validators";

export const UniqueRegister = (validationOptions?: ValidationOptions) => {
    return (object: object, property: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: property,
            options: validationOptions,
            constraints: [],
            validator: UniqueRegisterValidator,
        });
    };
};
