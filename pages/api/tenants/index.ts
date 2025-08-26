import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const tenants = await prisma.tenant.findMany();
    return res.status(200).json(tenants);
  } 
  
  if (req.method === "POST") {
    const data = req.body;
    const tenant = await prisma.tenant.create({ data });
    return res.status(201).json(tenant);
  }

  // nếu không phải GET hay POST
  return res.status(405).json({ error: "Method not allowed" });
}
