import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";

@Injectable()
export class RequestDtoValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    value = this.trimStringPropertiesFromObject(value, 10);

    const dtoInstance = plainToInstance(metatype, value);

    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    });

    if (errors.length > 0) {
      const validationErrors = this.formatValidationErrors(errors);
      throw new BadRequestException(validationErrors);
    }

    return dtoInstance;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  public trimStringPropertiesFromObject(input: any, maxDepth: number = 10): any {
    // Trim leading and trailing spaces and replace multiple spaces with a single space
    const trim = (str: string): string => str.trim().replace(/\s+/g, " ");

    const recurTrim = (obj: any, currentDepth: number = 1) => {
      if (currentDepth > maxDepth) throw new BadRequestException(`Max depth ${maxDepth} exceeded`);

      currentDepth += 1;

      if (typeof obj === "string") {
        return trim(obj);
      } else if (Array.isArray(obj)) {
        return obj.map((value: any) => {
          return recurTrim(value, currentDepth);
        });
      } else if (typeof obj == "object" && obj != null) {
        const trimmedObj: any = {};
        Object.keys(obj).map((key) => {
          if (typeof obj[key] === "string") {
            trimmedObj[key] = trim(obj[key]);
          } else {
            trimmedObj[key] = recurTrim(obj[key], currentDepth);
          }
        });
        return trimmedObj;
      } else {
        return obj;
      }
    };

    return recurTrim(input);
  }

  private formatValidationErrors(errors: ValidationError[]): {
    [key: string]: any;
  } {
    const validationErrors: { [key: string]: any } = {};
    errors.forEach((error: ValidationError) => {
      if (error.children?.length) {
        validationErrors[error.property] = this.formatValidationErrors(error.children);
      } else {
        Object.keys(error.constraints || {}).forEach((key) => {
          if (!validationErrors[error.property]) {
            validationErrors[error.property] = error?.constraints?.[key] || "Invalid data";
          }
        });
      }
    });
    return validationErrors;
  }
}
