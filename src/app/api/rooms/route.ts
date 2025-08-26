import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/rooms → lấy tất cả rooms
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: { roomTenants: true }, // có thể bỏ nếu không cần
    });
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("GET /rooms error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

// POST /api/rooms → tạo room mới
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.roomName || !body.price) {
      return NextResponse.json(
        { message: "roomName và price là bắt buộc" },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: {
        roomName: body.roomName,
        price: Number(body.price),
        usages: body.usages ?? "",
        invoices: body.invoices ?? "",
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("POST /rooms error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
