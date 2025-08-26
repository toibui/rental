import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

// Sử dụng any để bypass hoàn toàn type checking
export async function GET(request: NextRequest, context: any) {
  try {
    const resolvedParams = await context.params;
    const id = Number(resolvedParams.id);

    const roomTenant = await prisma.roomTenant.findUnique({
      where: { id },
      include: { room: true, tenant: true },
    });

    if (!roomTenant) {
      return NextResponse.json(
        { error: "Room tenant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(roomTenant);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const resolvedParams = await context.params;
    const id = Number(resolvedParams.id);
    const body = await request.json();

    const updatedRoomTenant = await prisma.roomTenant.update({
      where: { id },
      data: body,
      include: { room: true, tenant: true },
    });

    return NextResponse.json(updatedRoomTenant);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const resolvedParams = await context.params;
    const id = Number(resolvedParams.id);

    await prisma.roomTenant.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}