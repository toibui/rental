import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Lấy invoice theo id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { room: true }, // nếu muốn kèm thông tin room
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error: any) {
    console.error("GET /invoices/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Cập nhật invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await request.json();

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        roomId: body.roomId,
        // Nếu client gửi "2025-08" → convert thành ngày đầu tháng
        month: body.month ? new Date(body.month + "-01") : undefined,
        roomPrice: body.roomPrice,
        electricCost: body.electricCost,
        waterCost: body.waterCost,
        total: body.total,
        status: body.status,
      },
      include: { room: true },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error: any) {
    console.error("PUT /invoices/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// Xoá invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /invoices/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
