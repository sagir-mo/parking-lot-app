import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getNextAvailableSpot = async () => {
  const spot = await prisma.parkingSpot.findFirst({
    where: { isOccupied: false },
    orderBy: { spotNumber: "asc" },
  });
  return spot;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { spotId: providedSpotId } = req.query;
    const { licensePlate, ownerName, ownerContact } = req.body;

    let spotId = providedSpotId;

    if (!spotId) {
      const nextSpot = await getNextAvailableSpot();
      if (!nextSpot) {
        return res.status(404).json({ error: "No available parking spots" });
      }
      spotId = nextSpot.id;
    }

    const owner = await prisma.owner.upsert({
      where: { name: ownerName },
      update: { contact: ownerContact },
      create: { name: ownerName, contact: ownerContact },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        licensePlate,
        ownerId: owner.id,
        tickets: {
          create: {
            spot: {
              connect: { id: parseInt(spotId) },
            },
          },
        },
      },
    });

    await prisma.parkingSpot.update({
      where: { id: parseInt(spotId) },
      data: { isOccupied: true },
    });

    res.status(200).json({ message: "Vehicle parked successfully", spotId });
  } catch (error) {
    console.error("Error parking vehicle:", error);
    res.status(500).json({ error: "Failed to park vehicle" });
  }
}
