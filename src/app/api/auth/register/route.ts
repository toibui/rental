import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  const hashedPassword = await hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role: role || "user" },
  });

  return NextResponse.json({ message: "User created", user });
}
