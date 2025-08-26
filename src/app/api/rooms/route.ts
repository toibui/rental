import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/invoices/:id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(params.id) },
      include: {
        roomTenants: true,
        usages: true,
        invoices: true,
      },
    });

    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    console.error("GET /rooms/[id] error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
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
