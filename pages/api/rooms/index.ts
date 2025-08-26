import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const rooms = await prisma.room.findMany();
    return res.status(200).json(rooms);
  } 
  
  if (req.method === "POST") {
    const data = req.body;
    const room = await prisma.room.create({ data });
    return res.status(201).json(room);
  }

  // nếu không phải GET hay POST
  return res.status(405).json({ error: "Method not allowed" });
}
