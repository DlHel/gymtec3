/*
  Warnings:

  - You are about to drop the `SLA` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "SLA_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SLA";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ServiceLevelAgreement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "responseTimeHours" INTEGER NOT NULL,
    "resolutionTimeHours" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contractNumber" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "clientId" TEXT NOT NULL,
    "slaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Contract_slaId_fkey" FOREIGN KEY ("slaId") REFERENCES "ServiceLevelAgreement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Contract" ("clientId", "contractNumber", "createdAt", "endDate", "id", "notes", "slaId", "startDate", "status", "type", "updatedAt") SELECT "clientId", "contractNumber", "createdAt", "endDate", "id", "notes", "slaId", "startDate", "status", "type", "updatedAt" FROM "Contract";
DROP TABLE "Contract";
ALTER TABLE "new_Contract" RENAME TO "Contract";
CREATE UNIQUE INDEX "Contract_contractNumber_key" ON "Contract"("contractNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ServiceLevelAgreement_name_key" ON "ServiceLevelAgreement"("name");
