import { Response } from "express";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { HttpStatusTextMap } from "src/common/constants";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (!(exception instanceof HttpException)) {
      return response.status(500).json({ message: "Internal Server Error" });
    }

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error =
      typeof exceptionResponse == "object" && !exceptionResponse["error"] && !exceptionResponse["statusCode"]
        ? exceptionResponse
        : null;

    const message = error ? HttpStatusTextMap[statusCode] : exception.message;

    response.status(statusCode).json({ message, statusCode, error });
  }
}
