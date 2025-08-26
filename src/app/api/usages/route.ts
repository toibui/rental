import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/usages → Lấy toàn bộ usages
export async function GET() {
  try {
    const usages = await prisma.usage.findMany({
      include: {
        room: true,
      },
    });
    return NextResponse.json(usages, { status: 200 });
  } catch (error) {
    console.error("GET /usages error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

// POST /api/usages → Tạo usage mới
export async function POST(request: Request) {
  try {
    const { roomId, month, electricReading, waterReading } = await request.json();

    // Kiểm tra month
    if (!month) {
      return NextResponse.json({ message: "Month is required" }, { status: 400 });
    }

    const usage = await prisma.usage.create({
      data: {
        roomId: Number(roomId),
        month: new Date(month), // Không dùng undefined
        electricReading: Number(electricReading) || 0,
        waterReading: Number(waterReading) || 0,
      },
      include: {
        room: true,
      },
    });

    return NextResponse.json(usage, { status: 201 });
  } catch (error) {
    console.error("POST /usages error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
