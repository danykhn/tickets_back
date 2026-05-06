import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { BusinessModule } from './business/business.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, BusinessModule]
})
export class AppModule {}