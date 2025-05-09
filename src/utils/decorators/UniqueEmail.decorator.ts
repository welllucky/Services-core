import { registerDecorator, ValidationOptions } from "class-validator";
import { UniqueEmailValidator } from "../validators";

export const UniqueEmail = (validationOptions?: ValidationOptions) => {
    return (object: object, property: string) => {
      registerDecorator({
        target: object.constructor,
        propertyName: property,
        options: validationOptions,
        constraints: [],
        validator: UniqueEmailValidator,
      });
    };
  };