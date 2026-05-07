import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common'
import { BusinessService } from './business.service'
import { CreateBusinessDto, SearchBusinessDto } from './dto/business.dto'

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    console.log('🔔 [CONTROLLER] POST /business recibido')
    console.log('📦 Body recibido:', JSON.stringify(createBusinessDto, null, 2))
    return this.businessService.create(createBusinessDto)
  }

  @Get('search')
  search(@Query() searchBusinessDto: SearchBusinessDto) {
    return this.businessService.search(searchBusinessDto.q)
  }

  @Get(':cuit')
  findByCuit(@Param('cuit') cuit: string) {
    return this.businessService.findByCuit(cuit)
  }
}