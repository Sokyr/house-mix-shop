-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "delivery" TEXT NOT NULL,
    "payment" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "products" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Нове',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
