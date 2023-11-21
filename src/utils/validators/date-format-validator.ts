// src/common/validators/is-date-string.validator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'isDateFormatValid', async: false })
export class IsDateStringConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    // Use Moment.js to check if the value is a valid date
    return moment(value, 'DD/MM/YYYY', true).isValid();
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid date format. Use DD/MM/YYYY format only.';
  }
}

export function IsDateFormatValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateStringConstraint,
    });
  };
}
