/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `deviceName` on the `Merchant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "deviceId",
DROP COLUMN "deviceName";

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "autoAcceptOrders" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deliveryEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "logoUrl" TEXT;

-- CreateTable
CREATE TABLE "MerchantDevice" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceName" TEXT,
    "pushToken" TEXT,
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryAlert" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "stockLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantDailyStats" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchantDailyStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MerchantDevice_merchantId_deviceId_key" ON "MerchantDevice"("merchantId", "deviceId");

-- CreateIndex
CREATE INDEX "InventoryAlert_merchantId_idx" ON "InventoryAlert"("merchantId");

-- CreateIndex
CREATE INDEX "InventoryAlert_storeId_idx" ON "InventoryAlert"("storeId");

-- CreateIndex
CREATE INDEX "MerchantDailyStats_merchantId_idx" ON "MerchantDailyStats"("merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantDailyStats_storeId_date_key" ON "MerchantDailyStats"("storeId", "date");

-- AddForeignKey
ALTER TABLE "MerchantDevice" ADD CONSTRAINT "MerchantDevice_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAlert" ADD CONSTRAINT "InventoryAlert_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantDailyStats" ADD CONSTRAINT "MerchantDailyStats_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
