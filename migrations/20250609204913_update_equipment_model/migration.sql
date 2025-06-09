/*
  Warnings:

  - Added the required column `brand` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "serialNumber" TEXT,
    "purchaseDate" DATETIME,
    "installationDate" DATETIME,
    "locationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("createdAt", "id", "locationId", "model", "serialNumber", "updatedAt", "brand") SELECT "createdAt", "id", "locationId", "model", "serialNumber", "updatedAt", "Sin marca" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "Equipment"("serialNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
