-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Part" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "cost" REAL,
    "stock" INTEGER NOT NULL,
    "minStock" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Part" ("cost", "createdAt", "id", "minStock", "name", "sku", "stock", "updatedAt") SELECT "cost", "createdAt", "id", "minStock", "name", "sku", "stock", "updatedAt" FROM "Part";
DROP TABLE "Part";
ALTER TABLE "new_Part" RENAME TO "Part";
CREATE UNIQUE INDEX "Part_sku_key" ON "Part"("sku");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
