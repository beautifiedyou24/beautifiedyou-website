/** 

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { Logger } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { LOGGED_IN_USER } from "src/modules/async-storage/constants";
import { tap, catchError } from "rxjs/operators";
import mongoose from "mongoose";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  private logger = new Logger(CurrentUserInterceptor.name);

  constructor(private readonly als: AsyncLocalStorage<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    // Create a new Mongoose session for the transaction
    const session = mongoose.startSession();
    session.startTransaction();

    const store = {
      [LOGGED_IN_USER]: user ? { ...user, id: parseInt(user.sub) } : null,
      session, // Include the session in the store
    };

    return new Observable((observer) => {
      this.als.run(store, () => {
        next
          .handle()
          .pipe(
            tap(async () => {
              // Commit the transaction if everything goes well
              await session.commitTransaction();
              session.endSession();
            }),
            catchError(async (err) => {
              // Abort the transaction in case of an error
              await session.abortTransaction();
              session.endSession();
              throw err;
            }),
          )
          .subscribe({
            next: (value) => observer.next(value),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
      });
    });
  }
}

*/

// without overriding

/**
 * import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { LOGGED_IN_USER } from 'src/modules/async-storage/constants';
import mongoose from 'mongoose';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  private logger = new Logger(CurrentUserInterceptor.name);

  constructor(private readonly als: AsyncLocalStorage<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    // Create a new Mongoose session for the transaction
    const session = mongoose.startSession();
    session.startTransaction();

    const currentStore = this.als.getStore() || {};
    const updatedStore = {
      ...currentStore,
      [LOGGED_IN_USER]: user ? { ...user, id: parseInt(user.sub) } : null,
      session,
    };

    return new Observable((observer) => {
      this.als.run(updatedStore, () => {
        next.handle().pipe(
          tap(async () => {
            await session.commitTransaction();
            session.endSession();
          }),
          catchError(async (err) => {
            await session.abortTransaction();
            session.endSession();
            throw err;
          })
        ).subscribe({
          next: (value) => observer.next(value),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      });
    });
  }
}

 */
