import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class UrlParameterPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!Types.ObjectId.isValid(value.trim())) {
      throw new BadRequestException("url parameter must be a 24 character hex string");
    }
    return value;
  }
}
