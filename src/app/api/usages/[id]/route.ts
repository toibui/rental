import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/usages/:id → Lấy 1 Usage theo id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const usage = await prisma.usage.findUnique({
      where: { id: Number(params.id) },
      include: { room: true },
    });

    if (!usage) {
      return NextResponse.json({ message: "Usage not found" }, { status: 404 });
    }

    return NextResponse.json(usage, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

// PUT /api/usages/:id → Cập nhật Usage
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { month, electricReading, waterReading } = await request.json();

    if (!month) {
      return NextResponse.json({ message: "Month is required" }, { status: 400 });
    }

    const updatedUsage = await prisma.usage.update({
      where: { id: Number(params.id) },
      data: {
        month: new Date(month),
        electricReading: Number(electricReading) || 0,
        waterReading: Number(waterReading) || 0,
      },
      include: { room: true },
    });

    return NextResponse.json(updatedUsage, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    }, { status: 500 });
  }
}

// DELETE /api/usages/:id → Xóa Usage
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.usage.delete({
      where: { id: Number(params.id) },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
