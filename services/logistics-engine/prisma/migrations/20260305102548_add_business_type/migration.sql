-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('FOOD', 'MART');

-- CreateEnum
CREATE TYPE "DispatchAttemptStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'MISSED');

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "type" "BusinessType" NOT NULL DEFAULT 'MART';

-- CreateTable
CREATE TABLE "DispatchAttempt" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "attemptTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "DispatchAttemptStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "DispatchAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "baseFee" DOUBLE PRECISION NOT NULL DEFAULT 2.00,
    "distanceFeeKm" DOUBLE PRECISION NOT NULL DEFAULT 0.80,
    "timeFeeMin" DOUBLE PRECISION NOT NULL DEFAULT 0.10,
    "serviceFee" DOUBLE PRECISION NOT NULL DEFAULT 1.00,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurgeZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "centerLat" DOUBLE PRECISION NOT NULL,
    "centerLng" DOUBLE PRECISION NOT NULL,
    "radiusKm" DOUBLE PRECISION NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SurgeZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagePricing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "PackagePricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookConfig" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "events" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DispatchAttempt_deliveryId_idx" ON "DispatchAttempt"("deliveryId");

-- CreateIndex
CREATE INDEX "DispatchAttempt_riderId_idx" ON "DispatchAttempt"("riderId");

-- CreateIndex
CREATE UNIQUE INDEX "PricingRule_countryCode_key" ON "PricingRule"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "PackagePricing_name_key" ON "PackagePricing"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "ApiKey_merchantId_idx" ON "ApiKey"("merchantId");

-- CreateIndex
CREATE INDEX "ApiKey_key_idx" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "WebhookConfig_merchantId_idx" ON "WebhookConfig"("merchantId");

-- AddForeignKey
ALTER TABLE "DispatchAttempt" ADD CONSTRAINT "DispatchAttempt_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchAttempt" ADD CONSTRAINT "DispatchAttempt_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookConfig" ADD CONSTRAINT "WebhookConfig_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
