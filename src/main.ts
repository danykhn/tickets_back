import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }))

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,  
  })
  
  app.setGlobalPrefix('api')
  
  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') || 3000
  
  await app.listen(port)
  console.log('Application is running on: http://localhost:' + port)
}
bootstrap()