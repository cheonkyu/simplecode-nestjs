import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  
  constructor() {
    super({ log: [{ emit: 'event', level: 'query' }] });

    this.logger.log(`Prisma v${Prisma.prismaVersion.client}`);
    this.$on('query' as never, (e : Prisma.QueryEvent) => this.logger.debug(`${e.query} ${e.params}`));
    this.$on('error' as never, (e) => {
      console.log(e)
    })
    
    this.$use(fetchDataMiddleware());
    this.$use(softDeleteMiddleware());
  }
  
  async onModuleInit() {
    await this.$connect();
  }
}

// https://www.prisma.io/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware
export function fetchDataMiddleware<T extends Prisma.BatchPayload = Prisma.BatchPayload>(): Prisma.Middleware {
  return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<T>): Promise<T> => {
    if (
      params.action === 'findFirst'
      ||  params.action === 'findMany'
      || params.action === 'findFirstOrThrow'
      || params.action === 'findRaw'
      || params.action === 'findUnique'
      || params.action === 'findUniqueOrThrow'
    ) {
      if(params?.args?.where) {
        params.args.where.deleted = false
      } else {
        params.args = {
          where: {
            deleted: false
          }
        }
      }
    }
    const result = await next(params);
    return result;
  };
}

// export function fetchDataMiddleware1<T extends Prisma.BatchPayload = Prisma.BatchPayload>(): Prisma.Middleware {
//   return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<T>): Promise<T> => {
//     try {

//     } catch(e) {

//     }
//     if (params.model === 'User' && params.action === 'create') { {
//       const result = await next(params);
//       return result;
//     }
//   };
// }

export function softDeleteMiddleware<T extends Prisma.BatchPayload = Prisma.BatchPayload>(): Prisma.Middleware {
  return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<T>): Promise<T> => {
    if (params.action == 'delete') {
      params.action = 'update'
      params.args['data'] = { deleted: true }
    }
    if (params.action == 'deleteMany') {
      params.action = 'updateMany'
      if (params.args.data != undefined) {
        params.args.data['deleted'] = true
      } else {
        params.args['data'] = { deleted: true }
      }
    }
    const result = await next(params);
    return result;
  };
}