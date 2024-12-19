import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getNextAvailableSpot = async () => {
  return await prisma.parkingSpot.findFirst({
    where: { isOccupied: false },
    orderBy: { spotNumber: "asc" },
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { licensePlate } = req.body;

    if (!licensePlate) {
      return res.status(400).json({ error: "License plate is required" });
    }

    const nextSpot = await getNextAvailableSpot();
    if (!nextSpot) {
      return res.status(404).json({ error: "No available parking spots" });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        licensePlate,
        tickets: {
          create: {
            spot: {
              connect: { id: nextSpot.id },
            },
          },
        },
      },
    });

    await prisma.parkingSpot.update({
      where: { id: nextSpot.id },
      data: { isOccupied: true },
    });

    res.status(200).json({
      message: "Vehicle parked successfully",
      spotId: nextSpot.id,
    });
  } catch (error) {
    console.error("Error parking vehicle:", error);
    res.status(500).json({ error: "Failed to park vehicle" });
  }
}
