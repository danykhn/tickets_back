import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const dbUser = process.env.DB_USER || 'postgres'
    const dbPassword = process.env.DB_PASSWORD || ''
    const dbHost = process.env.DB_HOST || 'localhost'
    const dbPort = parseInt(process.env.DB_PORT || '5432', 10)
    const dbName = process.env.DB_NAME || 'tickets_db'

    const pool = new Pool({
      user: dbUser,
      password: dbPassword,
      host: dbHost,
      port: dbPort,
      database: dbName,
    })

    const adapter = new PrismaPg(pool)
    super({ adapter })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}