import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply<any>>();
    const message = exception.message.replace(/\n/g, '');
    response.status(exception.getStatus())
      response.send({
        status: {
          code: exception.getStatus(),
          message
        },
        data: null
      })
  }
}
