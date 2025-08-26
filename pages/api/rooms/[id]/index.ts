import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Invalid tenant id" });
  }

  try {
    if (req.method === "GET") {
      // Lấy 1 tenant theo id
      const room = await prisma.room.findUnique({
        where: { id: Number(id) },
        include: { roomTenants: true },
      });

      if (!room) return res.status(404).json({ message: "room not found" });
      return res.status(200).json(room);
    }

    if (req.method === "PUT") {
      // Update room
      const {
          roomName ,
          price,
          usages,
          invoices
      } = req.body;

      const updatedroom = await prisma.room.update({
        where: { id: Number(id) },
        data: {
          roomName ,
          price,
          usages,
          invoices
        },
      });

      return res.status(200).json(updatedroom);
    }

    if (req.method === "DELETE") {
      await prisma.room.delete({
        where: { id: Number(id) },
      });
      return res.status(204).end();
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
}
