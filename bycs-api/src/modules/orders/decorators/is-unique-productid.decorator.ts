import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ async: false })
@ValidatorConstraint({ async: false })
export class UniqueProductIdsConstraint implements ValidatorConstraintInterface {
  validate(items: any[]) {
    const productIdColorPairs = items.map((item) => `${item.productId}-${item.color}`);
    return productIdColorPairs.length === new Set(productIdColorPairs).size;
  }

  defaultMessage() {
    return "Each product and color combination must be unique within the order items";
  }
}

export function IsUniqueProductId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueProductIdsConstraint,
    });
  };
}
