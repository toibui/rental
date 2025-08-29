import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await compare(password, user.password);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1d" });

  return NextResponse.json({ token });
}
