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
      const tenant = await prisma.tenant.findUnique({
        where: { id: Number(id) },
        include: { roomTenants: true },
      });

      if (!tenant) return res.status(404).json({ message: "Tenant not found" });
      return res.status(200).json(tenant);
    }

    if (req.method === "PUT") {
      // Update tenant
      const {
        fullName,
        dob,
        nationalId,
        hometown,
        phone,
        email,
        temporaryResidence,
      } = req.body;

      const updatedTenant = await prisma.tenant.update({
        where: { id: Number(id) },
        data: {
          fullName,
          dob: dob ? new Date(dob) : null,
          nationalId,
          hometown,
          phone,
          email,
          temporaryResidence,
        },
      });

      return res.status(200).json(updatedTenant);
    }

    if (req.method === "DELETE") {
      await prisma.tenant.delete({
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
