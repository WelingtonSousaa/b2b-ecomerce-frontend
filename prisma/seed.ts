import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpar tabelas
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  // Seed Produtos
  await prisma.product.create({
    data: {
      sku: 'SRV-001',
      name: 'Servidor Fantasma B2B',
      basePrice: 5000.0,
      description: 'MOQ: 5 | Múltiplo: 1 cx',
      categorySlug: 'servidores',
      images: JSON.stringify(['/imagem.jpeg']),
      moq: 5,
      hasVariants: false,
      stockByCD: JSON.stringify([
        { cdId: 'cd-sp', availableQuantity: 500 },
        { cdId: 'cd-sc', availableQuantity: 200 }
      ])
    }
  })

  // Seed Pedidos
  await prisma.order.create({
    data: {
      orderNumber: 'PED-2026-0001',
      status: 'APPROVED',
      payment: JSON.stringify({ type: 'BOLETO_FATURADO', termsDays: [30, 60] }),
      summary: JSON.stringify({ grandTotal: 25000.50, subtotal: 25500, discountTotal: 499.50 }),
      items: JSON.stringify([
        { quantity: 5, unitPrice: 5000, product: { name: 'Servidor Fantasma B2B', sku: 'SRV-001' } }
      ])
    }
  })

  console.log('Seed realizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
