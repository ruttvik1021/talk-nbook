import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isNotEmpty,
  isString,
  registerDecorator,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'arrayElementIsObjectId', async: false })
export class ArrayElementIsObjectIdConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if (!isNotEmpty(value) || !Array.isArray(value)) {
      return false;
    }

    return value.every(
      (element) => isString(element) && Types.ObjectId.isValid(element),
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `$property must be an array where each element is a valid ObjectId`;
  }
}

export function ArrayElementIsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ArrayElementIsObjectIdConstraint,
    });
  };
}
