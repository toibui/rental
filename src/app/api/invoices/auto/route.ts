import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { roomId, month, status } = await request.json();

    if (!roomId || !month) {
      return NextResponse.json({ message: "Phòng và tháng là bắt buộc" }, { status: 400 });
    }

    // Chuyển month sang Date
    const currentMonth = new Date(month + "-01");
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);

    const startOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startOfNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

    const startOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
    const startOfNextPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1);

    // 1. Lấy Usage tháng hiện tại và tháng trước
    const currentUsage = await prisma.usage.findFirst({
      where: {
        roomId: Number(roomId),
        month: { gte: startOfCurrentMonth, lt: startOfNextMonth },
      },
    });

    if (!currentUsage) {
      return NextResponse.json({ message: "Chưa có Usage cho tháng hiện tại" }, { status: 400 });
    }

    const prevUsage = await prisma.usage.findFirst({
      where: {
        roomId: Number(roomId),
        month: { gte: startOfPrevMonth, lt: startOfNextPrevMonth },
      },
    });

    // 2. Lấy giá điện, nước từ bảng setting
    const setting = await prisma.setting.findFirst();
    if (!setting) {
      return NextResponse.json({ message: "Chưa có setting để tính giá" }, { status: 400 });
    }
    const electricPrice = setting.electricPrice;
    const waterPrice = setting.waterPrice;

    // 3. Tính tiền điện, nước
    const electricCost = (currentUsage.electricReading - (prevUsage?.electricReading || 0)) * electricPrice;
    const waterCost = (currentUsage.waterReading - (prevUsage?.waterReading || 0)) * waterPrice;

    // 4. Lấy roomPrice từ Room
    const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
    const roomPrice = room?.price || 0;

    const total = roomPrice + electricCost + waterCost;

    // 5. Tạo invoice
    const invoice = await prisma.invoice.create({
      data: {
        roomId: Number(roomId),
        month: currentMonth,
        roomPrice,
        electricCost,
        waterCost,
        total,
        status: status || "UNPAID",
      },
      include: { room: true },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("POST /invoices/auto error:", error);
    return NextResponse.json(
      { message: "Server error", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
