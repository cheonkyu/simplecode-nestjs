import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply } from 'fastify';

@Catch(BadRequestException)
export class RequestValidationFilter extends BaseExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply<any>>();
    console.error(exception);
    const code = exception.getStatus()
    const res : { message : string } = exception.getResponse() as any
    const { message = ['잠시 후에 다시 시도해주세요.'] } = res
    response.send({
      status: {
        code,
        message: Array.isArray(message) ? message[0] : message
      },
      data: null
    })
  }
}
