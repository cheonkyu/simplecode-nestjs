import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply } from 'fastify';

export type PrismaToHttpStatus = {
  [key: string]: number;
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private status: PrismaToHttpStatus = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };
  
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply<any>>();
    const message = exception.message.replace(/\n/g, '');
    const code =  exception.code
    const statusCode = this.status[code]
    if(statusCode) {
      response.status(statusCode)
      response.send({
        status: {
          code: exception.code,
          message
        },
        data: null
      })
    } else {
      response.send({
        status: {
          code: exception.code,
          message
        },
        data: null
      })
    }
  }
}
