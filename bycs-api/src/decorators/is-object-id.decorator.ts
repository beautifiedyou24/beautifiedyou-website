import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Types } from "mongoose";

@ValidatorConstraint({ async: false })
export class IsCustomConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, args: ValidationArguments) {
    return typeof value === "string" && Types.ObjectId.isValid(value.trim());
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a 24 character hex string`;
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCustomConstraint,
    });
  };
}
