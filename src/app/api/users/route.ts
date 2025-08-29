// app/api/users/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { email, password, role } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email và password là bắt buộc" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, role },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const { id, email, role, password } = await req.json();
  const data: any = { email, role };
  if (password) data.password = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  return NextResponse.json(user);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
