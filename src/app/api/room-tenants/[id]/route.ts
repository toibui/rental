import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/room-tenants/:id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(params.id) },
      include: {
        roomTenants: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

// PUT /api/room-tenants/:id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } } // id ở đây là RoomTenant.id
) {
  try {
    const { startDate, endDate } = await request.json();

    // Cập nhật record RoomTenant cụ thể
    const updatedRoomTenant = await prisma.roomTenant.update({
      where: { id: Number(params.id) }, // RoomTenant.id
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
      },
      include: {
        room: true,
        tenant: true,
      },
    });

    return NextResponse.json(updatedRoomTenant, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    }, { status: 500 });
  }
}

// DELETE /api/room-tenants/:id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.roomTenant.delete({
      where: { id: Number(params.id) },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
