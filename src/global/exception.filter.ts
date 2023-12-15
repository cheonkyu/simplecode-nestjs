import { ArgumentsHost, Catch } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply } from 'fastify';

@Catch(Error)
export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply<any>>();
    const message = exception.message.replace(/\n/g, '');
    console.error(exception)
    response.send({
      status: {
        code: '9999',
        message
      },
      data: null
    })
  }
}
