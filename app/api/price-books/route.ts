import { NextResponse } from 'next/server';
import { PriceBook } from '@/types/b2b';

const mockPriceBooks: PriceBook[] = [
  {
    id: 'pb-ouro-2026',
    name: 'Tabela Contratual VIP Ouro',
    code: 'VIP-OURO-2026',
    description: 'Preços reduzidos homologados para clientes corporativos com faturamento em até 3x (28/56/84 dias).',
    isActive: true,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    assignedCnpjs: ['12345678000190', '12.345.678/0001-90', '00000000000100'],
    targetRegionUF: ['SP', 'RJ', 'SC', 'MG', 'PR'],
    items: [
      {
        sku: 'NTB-DELL-LAT7420',
        productName: 'Notebook Dell Latitude 7420 14" i7 16GB 512GB SSD',
        customPrice: 7200.00,
        discountPercentageFromBase: 4.0,
      },
      {
        sku: 'MON-DELL-P2422H',
        productName: 'Monitor Dell 24" P2422H IPS Full HD',
        customPrice: 1100.00,
        discountPercentageFromBase: 8.3,
      },
      {
        sku: 'SRV-HP-DL380',
        productName: 'Servidor HP ProLiant DL380 Gen10',
        customPrice: 24000.00,
        discountPercentageFromBase: 4.0,
      },
    ],
  },
  {
    id: 'pb-atacado-br',
    name: 'Tabela Atacado Corporativo Brasil',
    code: 'ATACADO-BR',
    description: 'Tabela de fornecimento para grandes distribuidores e integradores de TI.',
    isActive: true,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    assignedCnpjs: ['*'],
    targetRegionUF: ['SP', 'RJ', 'MG', 'BA', 'AM', 'SC', 'RS'],
    items: [
      {
        sku: 'NTB-DELL-LAT7420',
        productName: 'Notebook Dell Latitude 7420 14" i7 16GB 512GB SSD',
        customPrice: 6900.00,
        minMoqOverride: 20,
        discountPercentageFromBase: 8.0,
      },
      {
        sku: 'MON-DELL-P2422H',
        productName: 'Monitor Dell 24" P2422H IPS Full HD',
        customPrice: 1000.00,
        minMoqOverride: 50,
        discountPercentageFromBase: 16.6,
      },
    ],
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cnpj = searchParams.get('cnpj');

  if (cnpj) {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const filtered = mockPriceBooks.filter(
      (pb) =>
        pb.assignedCnpjs.includes('*') ||
        pb.assignedCnpjs.some((c) => c.replace(/\D/g, '') === cleanCnpj)
    );
    return NextResponse.json({
      success: true,
      data: filtered.length > 0 ? filtered : [mockPriceBooks[0]],
    });
  }

  return NextResponse.json({
    success: true,
    data: mockPriceBooks,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBook: PriceBook = {
      id: `pb-${Date.now()}`,
      name: body.name || 'Nova Tabela de Preços',
      code: body.code || `CODE-${Date.now()}`,
      description: body.description || '',
      isActive: true,
      validFrom: body.validFrom || new Date().toISOString(),
      validTo: body.validTo || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      assignedCnpjs: body.assignedCnpjs || [],
      items: body.items || [],
    };
    return NextResponse.json({
      success: true,
      data: newBook,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro ao processar criação de tabela' },
      { status: 400 }
    );
  }
}
