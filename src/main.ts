import * as moduleAlias from 'module-alias'
moduleAlias.addAliases({
  '@': __dirname,
})

import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import helmet from '@fastify/helmet'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from '@/app.module'
import { PrismaClientExceptionFilter } from '@/global/prisma-client-exception.filter'
import { TransformInterceptor } from '@/global/transform.intercepter'
import { ExceptionFilter } from '@/global/exception.filter'
import { ValidationPipe } from '@nestjs/common'
import { RequestValidationFilter } from './global/request-validation.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  const { httpAdapter } = app.get(HttpAdapterHost)

  const config = new DocumentBuilder()
    .setTitle('Nestjs')
    .setDescription('Nestjs토이')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  
  // await app.register(helmet)
  app.useGlobalPipes(new ValidationPipe({
    // disableErrorMessages: true,
  }))
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new ExceptionFilter(httpAdapter))
  app.useGlobalFilters(new RequestValidationFilter(httpAdapter))
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
  await app.listen(3000)
}
bootstrap()
