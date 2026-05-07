-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "logo" TEXT,
    "businessName" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "ingresosBrutos" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "province" TEXT,
    "startDate" TIMESTAMP(3),
    "taxCategory" TEXT,
    "customerTaxCategory" TEXT,
    "customerCity" TEXT,
    "customerPostalCode" TEXT,
    "customerProvince" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_cuit_key" ON "Business"("cuit");

-- CreateIndex
CREATE INDEX "Business_businessName_idx" ON "Business"("businessName");

-- CreateIndex
CREATE INDEX "Business_legalName_idx" ON "Business"("legalName");

-- CreateIndex
CREATE INDEX "Business_cuit_idx" ON "Business"("cuit");
