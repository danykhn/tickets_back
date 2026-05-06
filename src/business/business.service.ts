import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBusinessDto } from './dto/business.dto'

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBusinessDto) {
    const existing = await this.prisma.business.findUnique({
      where: { cuit: data.cuit }
    })

    if (existing) {
      throw new BadRequestException('Ya existe un negocio con este CUIT')
    }

    return this.prisma.business.create({
      data: {
        logo: data.logo,
        businessName: data.businessName,
        legalName: data.legalName,
        cuit: data.cuit,
        ingresosBrutos: data.ingresosBrutos,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        province: data.province,
        startDate: data.startDate ? new Date(data.startDate) : null,
        taxCategory: data.taxCategory,
      }
    })
  }

  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return this.prisma.business.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' }
      })
    }

    const searchTerm = query.trim()

    return this.prisma.business.findMany({
      where: {
        OR: [
          { businessName: { contains: searchTerm, mode: 'insensitive' } },
          { legalName: { contains: searchTerm, mode: 'insensitive' } },
          { cuit: { contains: searchTerm } },
        ]
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    })
  }

  async findByCuit(cuit: string) {
    return this.prisma.business.findUnique({
      where: { cuit }
    })
  }
}