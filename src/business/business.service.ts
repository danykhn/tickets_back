import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBusinessDto } from './dto/business.dto'

@Injectable()
export class BusinessService {
  private logger = new Logger('BusinessService')
  
  constructor(private prisma: PrismaService) {
    
  }
  

  async create(data: CreateBusinessDto) {
    console.log('====== INICIANDO CREATE ======')
    console.log('📥 Datos recibidos:', JSON.stringify(data, null, 2))
    console.log('🔍 CUIT a buscar:', data.cuit)
    
    const existing = await this.prisma.business.findUnique({
      where: { cuit: data.cuit }
    })
    
    console.log('✅ ¿Existe negocio?:', !!existing)

    if (existing) {
      console.log('⚠️ Negocio duplicado encontrado:', existing.cuit)
      throw new BadRequestException('Ya existe un negocio con este CUIT')
    }

    console.log('💾 Preparando para crear con:', {
      cuit: data.cuit,
      businessName: data.businessName,
      legalName: data.legalName,
      address: data.address
    })
    
    const result = await this.prisma.business.create({
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
        customerTaxCategory: data.customerTaxCategory,
        customerCity: data.customerCity,
        customerPostalCode: data.customerPostalCode,
        customerProvince: data.customerProvince,
      }
    })
    
    console.log('✨ Negocio creado exitosamente:', result.cuit)
    console.log('====== FIN CREATE ======')
    return result
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