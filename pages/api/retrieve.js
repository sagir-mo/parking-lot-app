import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { licensePlate } = req.body;

  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        licensePlate,
      },
      include: {
        tickets: true,
      },
    });

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const latestTicket = vehicle.tickets[vehicle.tickets.length - 1];

    const updatedTicket = await prisma.parkingTicket.update({
      where: {
        id: latestTicket.id,
      },
      data: {
        exitTime: new Date(),
      },
    });

    const updatedSpot = await prisma.parkingSpot.update({
      where: {
        id: updatedTicket.spotId,
      },
      data: {
        isOccupied: false,
      },
    });

    res.status(200).json({ message: "Vehicle retrieved successfully" });
  } catch (error) {
    console.error("Error retrieving vehicle:", error);
    res.status(500).json({ error: "Failed to retrieve vehicle" });
  }
}
