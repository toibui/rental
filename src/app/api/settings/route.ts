import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/settings → Lấy toàn bộ settings
export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("GET /settings error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

// POST /api/settings → Tạo setting mới
export async function POST(request: Request) {
  try {
    const { electricPrice, waterPrice } = await request.json();

    const setting = await prisma.setting.create({
      data: {
        electricPrice: Number(electricPrice),
        waterPrice: Number(waterPrice),
      },
    });

    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    console.error("POST /settings error:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
