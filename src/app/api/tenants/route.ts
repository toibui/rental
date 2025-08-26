// src/app/api/tenants/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/tenants → lấy tất cả tenants
export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany();
    return NextResponse.json(tenants, { status: 200 });
  } catch (error) {
    console.error("API /tenants GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/tenants → tạo tenant mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, dob, nationalId, hometown, phone, email, temporaryResidence } = body;

    if (!fullName) {
      return NextResponse.json({ error: "fullName là bắt buộc" }, { status: 400 });
    }

    const tenant = await prisma.tenant.create({
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

    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    console.error("API /tenants POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
