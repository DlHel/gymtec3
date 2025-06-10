-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "serialNumber" TEXT,
    "internalCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPERATIONAL',
    "purchaseDate" DATETIME,
    "installationDate" DATETIME,
    "cost" REAL,
    "locationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Equipment" ("brand", "cost", "createdAt", "id", "installationDate", "locationId", "model", "purchaseDate", "serialNumber", "updatedAt") SELECT "brand", "cost", "createdAt", "id", "installationDate", "locationId", "model", "purchaseDate", "serialNumber", "updatedAt" FROM "Equipment";
DROP TABLE "Equipment";
ALTER TABLE "new_Equipment" RENAME TO "Equipment";
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "Equipment"("serialNumber");
CREATE UNIQUE INDEX "Equipment_internalCode_key" ON "Equipment"("internalCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
