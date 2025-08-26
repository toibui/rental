import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/room-tenants  → Lấy toàn bộ room-tenants
export async function GET() {
  try {
    const rts = await prisma.roomTenant.findMany({
      include: {
        room: true,
        tenant: true,
      },
    });
    return NextResponse.json(rts, { status: 200 });
  } catch (error) {
    console.error("GET /room-tenants error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

// POST /api/room-tenants  → Tạo room-tenant mới
export async function POST(request: Request) {
  try {
    const { roomId, tenantId, startDate, endDate } = await request.json();

    const rt = await prisma.roomTenant.create({
      data: {
        roomId: Number(roomId),
        tenantId: Number(tenantId),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        room: true,
        tenant: true,
      },
    });

    return NextResponse.json(rt, { status: 201 });
  } catch (error) {
    console.error("POST /room-tenants error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
