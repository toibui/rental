import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/invoices → Lấy toàn bộ invoices
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const month = searchParams.get("month"); // YYYY-MM
    const status = searchParams.get("status");

    let where: any = {};
    if (roomId) where.roomId = Number(roomId);
    if (status) where.status = status;
    if (month) {
      const currentMonth = new Date(month + "-01");
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const startOfNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
      where.month = { gte: startOfMonth, lt: startOfNextMonth };
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: { room: true },
      orderBy: { month: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("GET /invoices error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

// POST /api/invoices → Tạo invoice mới
export async function POST(request: Request) {
  try {
    const { roomId, month, roomPrice, electricCost, waterCost, status } = await request.json();

    // Kiểm tra month
    if (!month) {
      return NextResponse.json({ message: "Month is required" }, { status: 400 });
    }

    const total = (Number(roomPrice) || 0) + (Number(electricCost) || 0) + (Number(waterCost) || 0);

    const invoice = await prisma.invoice.create({
      data: {
        roomId: Number(roomId),
        month: new Date(month),
        roomPrice: Number(roomPrice) || 0,
        electricCost: Number(electricCost) || 0,
        waterCost: Number(waterCost) || 0,
        total,
        status: status || "UNPAID",
      },
      include: {
        room: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("POST /invoices error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
