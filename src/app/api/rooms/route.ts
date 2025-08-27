import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/invoices/:id
export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("API /tenants GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/rooms → tạo room mới
export async function POST(request: Request) {
  try {
    const { roomName, price } = await request.json();

    if (!roomName || price == null) {
      return NextResponse.json({ message: "roomName và price là bắt buộc" }, { status: 400 });
    }

    const room = await prisma.room.create({
      data: {
        roomName,
        price: Number(price),
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("POST /rooms error:", error);
    return NextResponse.json(
      { message: "Server error", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
