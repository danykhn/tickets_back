import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

// Load env vars immediately
dotenv.config()

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Use DATABASE_URL if available (recommended for production)
    let connectionString = process.env.DATABASE_URL

    // If DATABASE_URL is not provided, construct it from individual variables
    if (!connectionString) {
      const dbUser = process.env.DB_USER || 'postgres'
      const dbPassword = process.env.DB_PASSWORD || ''
      const dbHost = process.env.DB_HOST || 'localhost'
      const dbPort = process.env.DB_PORT || '5432'
      const dbName = process.env.DB_NAME || 'tickets_db'

      connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
    }

    const pool = new Pool({ connectionString })
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