-- CreateEnum
CREATE TYPE "AcceptanceMode" AS ENUM ('MANUAL', 'AUTO');

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "acceptanceMode" "AcceptanceMode" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "escalationEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "escalationRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "slaBreachMinutes" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "slaWarningMinutes" INTEGER NOT NULL DEFAULT 10;
