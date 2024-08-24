import { SetMetadata } from "@nestjs/common";

export const RESPONSE_MESSAGE_DECORATOR = "RESPONSE-MESSAGE-DECORATOR";
export const ResponseMessage = (message: string, statusCode: number) =>
  SetMetadata(RESPONSE_MESSAGE_DECORATOR, { message, statusCode });
