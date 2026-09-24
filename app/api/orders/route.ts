import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany();
    // Converter de volta do JSON
    const formattedOrders = orders.map((o) => ({
      ...o,
      payment: JSON.parse(o.payment),
      summary: JSON.parse(o.summary),
      items: JSON.parse(o.items)
    }));
    return NextResponse.json({ data: formattedOrders, success: true });
  } catch {
    return NextResponse.json({ message: 'Erro ao buscar pedidos', success: false }, { status: 500 });
  }
}
