import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, PoolConfig } from 'pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const poolConfig: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
    }
    
    if (process.env.DB_USER) {
      poolConfig.user = process.env.DB_USER
      poolConfig.password = process.env.DB_PASSWORD
    }
    
    const pool = new Pool(poolConfig)
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