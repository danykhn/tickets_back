import { IsString, IsOptional, IsDateString } from 'class-validator'

export class CreateBusinessDto {
  @IsString()
  @IsOptional()
  logo?: string

  @IsString()
  businessName: string

  @IsString()
  legalName: string

  @IsString()
  cuit: string

  @IsString()
  @IsOptional()
  ingresosBrutos?: string

  @IsString()
  @IsOptional()
  address?: string

  @IsString()
  @IsOptional()
  city?: string

  @IsString()
  @IsOptional()
  postalCode?: string

  @IsString()
  @IsOptional()
  province?: string

  @IsDateString()
  @IsOptional()
  startDate?: string

  @IsString()
  @IsOptional()
  taxCategory?: string

  // Customer info
  @IsString()
  @IsOptional()
  customerName?: string

  @IsString()
  @IsOptional()
  customerLastName?: string

  @IsString()
  @IsOptional()
  customerCuit?: string

  @IsString()
  @IsOptional()
  customerAddress?: string

  @IsString()
  @IsOptional()
  customerTaxCategory?: string

  @IsString()
  @IsOptional()
  customerCity?: string

  @IsString()
  @IsOptional()
  customerPostalCode?: string

  @IsString()
  @IsOptional()
  customerProvince?: string
}

export class SearchBusinessDto {
  @IsString()
  q: string
}