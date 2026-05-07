import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Use DATABASE_URL if available (recommended for production)
    const databaseUrl = process.env.DATABASE_URL
    
    let pool
    if (databaseUrl) {
      pool = new Pool({ connectionString: databaseUrl })
    } else {
      // Fallback to individual environment variables
      const dbUser = process.env.DB_USER || 'postgres'
      const dbPassword = process.env.DB_PASSWORD
      const dbHost = process.env.DB_HOST || 'localhost'
      const dbPort = parseInt(process.env.DB_PORT || '5432', 10)
      const dbName = process.env.DB_NAME || 'tickets_db'

      if (!dbPassword) {
        throw new Error('DB_PASSWORD environment variable is required when DATABASE_URL is not provided')
      }

      pool = new Pool({
        user: dbUser,
        password: dbPassword,
        host: dbHost,
        port: dbPort,
        database: dbName,
      })
    }

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