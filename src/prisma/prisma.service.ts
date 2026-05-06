import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

function parseConnectionString(url: string) {
  const connectionString = url
  
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida')
  }

  const match = connectionString.match(/^postgresql:\/\/(?:([^:]+):([^@]+)@)?([^:]+):(\d+)\/(.+)$/)
  
  if (!match) {
    return { connectionString }
  }

  const [, user, password, host, port, database] = match
  
  return {
    user: user || undefined,
    password: password || undefined,
    host,
    port: parseInt(port, 10),
    database,
  }
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const dbConfig = parseConnectionString(process.env.DATABASE_URL)
    
    const pool = new Pool({
      ...dbConfig,
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