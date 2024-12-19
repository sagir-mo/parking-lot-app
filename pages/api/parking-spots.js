import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const parkingSpots = await prisma.parkingSpot.findMany({
    where: {
      isOccupied: false,
    },
  });

  res.status(200).json(parkingSpots);
}
