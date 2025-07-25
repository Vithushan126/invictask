import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exception.getError();

    // error can be object or string
    let message = 'Internal server error';

    if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      // Look for message inside error object
      if ('message' in error) {
        // message can be string or string[]
        if (typeof error.message === 'string') {
          message = error.message;
        } else if (Array.isArray(error.message)) {
          message = error.message.join(', ');
        }
      } else if ('error' in error) {
        message = typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
      }
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      error: message,
    });
  }
}
