-- CreateTable
CREATE TABLE "ParkingLot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ParkingSpot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spotNumber" INTEGER NOT NULL,
    "isOccupied" BOOLEAN NOT NULL DEFAULT false,
    "lotId" INTEGER NOT NULL,
    CONSTRAINT "ParkingSpot_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "ParkingLot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contact" TEXT
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "licensePlate" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParkingTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spotId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "entryTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitTime" DATETIME,
    CONSTRAINT "ParkingTicket_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "ParkingSpot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParkingTicket_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");
