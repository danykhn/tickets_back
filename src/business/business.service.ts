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
    console.log('🔍 CUIT del negocio a buscar:', data.cuit)
    console.log('🔍 CUIT del cliente (si existe):', data.customerCuit)
    
    // Validar si existe un negocio con el mismo CUIT
    const existing = await this.prisma.business.findUnique({
      where: { cuit: data.cuit }
    })
    
    console.log('✅ ¿Existe negocio con este CUIT?:', !!existing)

    // Si ya existe, actualizar los datos (especialmente datos del cliente)
    if (existing) {
      console.log('📝 Negocio ya existe, actualizando datos...')
      
      // Si hay customerCuit, verificar si existe pero NO lanzar excepción si no existe
      if (data.customerCuit) {
        const existingCustomer = await this.prisma.business.findUnique({
          where: { cuit: data.customerCuit }
        })
        console.log('ℹ️ ¿Existe cliente con este CUIT?:', !!existingCustomer)
        console.log('ℹ️ Nota: Se permite actualizar aunque el cliente no exista aún')
      }

      console.log('💾 Actualizando negocio con:', {
        cuit: data.cuit,
        businessName: data.businessName,
        legalName: data.legalName,
        address: data.address,
        customerName: data.customerName,
        customerLastName: data.customerLastName,
        customerCuit: data.customerCuit,
        customerAddress: data.customerAddress
      })

      const result = await this.prisma.business.update({
        where: { cuit: data.cuit },
        data: {
          logo: data.logo,
          businessName: data.businessName,
          legalName: data.legalName,
          ingresosBrutos: data.ingresosBrutos,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          province: data.province,
          startDate: data.startDate ? new Date(data.startDate) : null,
          taxCategory: data.taxCategory,
          customerName: data.customerName,
          customerLastName: data.customerLastName,
          customerCuit: data.customerCuit,
          customerAddress: data.customerAddress,
          customerTaxCategory: data.customerTaxCategory,
          customerCity: data.customerCity,
          customerPostalCode: data.customerPostalCode,
          customerProvince: data.customerProvince,
        }
      })

      console.log('✨ Negocio actualizado exitosamente:', result.cuit)
      console.log('====== FIN CREATE (UPDATE) ======')
      return result
    }

    // Si no existe, crear uno nuevo
    console.log('💾 Preparando para crear con:', {
      cuit: data.cuit,
      businessName: data.businessName,
      legalName: data.legalName,
      address: data.address,
      customerName: data.customerName,
      customerLastName: data.customerLastName,
      customerCuit: data.customerCuit,
      customerAddress: data.customerAddress
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
        customerName: data.customerName,
        customerLastName: data.customerLastName,
        customerCuit: data.customerCuit,
        customerAddress: data.customerAddress,
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