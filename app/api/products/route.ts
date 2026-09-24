import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    // Converter de volta do JSON
    const formattedProducts = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      stockByCD: JSON.parse(p.stockByCD)
    }));
    return NextResponse.json({ data: formattedProducts, success: true });
  } catch {
    return NextResponse.json({ message: 'Erro ao buscar produtos', success: false }, { status: 500 });
  }
}
