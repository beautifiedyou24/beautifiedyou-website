import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection, ClientSession } from "mongoose";
import { catchError, Observable, tap } from "rxjs";

export class TransactionInterceptor implements NestInterceptor {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const session: ClientSession = await this.connection.startSession();
    request.mongooseSession = session;
    session.startTransaction();
    return next.handle().pipe(
      tap(async () => {
        await session.commitTransaction();
        session.endSession();
      }),
      catchError(async (error) => {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }),
    );
  }
}
