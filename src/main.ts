import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env file from the correct location
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

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
  const port = configService.get<number>('PORT') || 3334
  
  await app.listen(port)
  console.log('Application is running on: http://localhost:' + port)
}
bootstrap()