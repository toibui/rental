// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // bạn có thể bỏ nếu không muốn log SQL
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
