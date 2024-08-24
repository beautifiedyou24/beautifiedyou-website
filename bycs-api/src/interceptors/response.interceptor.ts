import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Reflector } from "@nestjs/core";
import { HttpStatusTextMap } from "@common/constants";
import { RESPONSE_MESSAGE_DECORATOR } from "@decorators/response-message.decorator";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = this.reflector.get(RESPONSE_MESSAGE_DECORATOR, context.getHandler());
    const { message = HttpStatusTextMap[HttpStatus.OK], statusCode = HttpStatus.OK } = metadata || {};

    return next.handle().pipe(
      map((data) => {
        return { message, statusCode, data };
      }),
    );
  }
}
