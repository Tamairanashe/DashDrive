-- Create AdminRole enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'FLEET_MANAGER', 'SUPPORT_AGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create AdminUser table
CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'SUPPORT_AGENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_email_key" ON "AdminUser"("email");

-- Create AdminGlobalConfig table
CREATE TABLE IF NOT EXISTS "AdminGlobalConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminGlobalConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AdminGlobalConfig_key_key" ON "AdminGlobalConfig"("key");

-- Create AdminAuditEntry table
CREATE TABLE IF NOT EXISTS "AdminAuditEntry" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "payload" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditEntry_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AdminAuditEntry" DROP CONSTRAINT IF EXISTS "AdminAuditEntry_adminId_fkey";
ALTER TABLE "AdminAuditEntry" ADD CONSTRAINT "AdminAuditEntry_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create AdminSystemLog table
CREATE TABLE IF NOT EXISTS "AdminSystemLog" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "context" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSystemLog_pkey" PRIMARY KEY ("id")
);
