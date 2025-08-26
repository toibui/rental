import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/tenants/[id]
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid tenant id" }, { status: 400 });
  }

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { roomTenants: true },
    });

    if (!tenant) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(tenant, { status: 200 });
  } catch (error) {
    console.error("GET tenant error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

// PUT /api/tenants/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid tenant id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      fullName,
      dob,
      nationalId,
      hometown,
      phone,
      email,
      temporaryResidence,
    } = body;

    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        fullName,
        dob: dob ? new Date(dob) : null,
        nationalId,
        hometown,
        phone,
        email,
        temporaryResidence,
      },
    });

    return NextResponse.json(updatedTenant, { status: 200 });
  } catch (error) {
    console.error("PUT tenant error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}

// DELETE /api/tenants/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid tenant id" }, { status: 400 });
  }

  try {
    await prisma.tenant.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE tenant error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 }
    );
  }
}
