import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const setting = await prisma.setting.findUnique({ where: { id } });
  if (!setting) return NextResponse.json({ message: "Setting not found" }, { status: 404 });
  return NextResponse.json(setting);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { electricPrice, waterPrice } = await request.json();
  const updatedSetting = await prisma.setting.update({
    where: { id },
    data: {
      electricPrice: Number(electricPrice),
      waterPrice: Number(waterPrice),
    },
  });
  return NextResponse.json(updatedSetting);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.setting.delete({ where: { id } });
  return NextResponse.json({}, { status: 204 });
}
