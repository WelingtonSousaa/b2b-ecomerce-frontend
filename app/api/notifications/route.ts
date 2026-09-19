import { NextResponse } from 'next/server';
import { B2BNotification } from '@/types/b2b';

// In-memory notifications state for seamless B2B demo
let notificationsData: B2BNotification[] = [
  {
    id: 'notif-1',
    title: 'Pedido Faturado #PED-2026-0001',
    message: 'Nota Fiscal emitida com sucesso pela Matriz SP. Mercadoria liberada para expedição CIF.',
    type: 'ORDER_STATUS',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isRead: false,
    priority: 'HIGH',
    actionUrl: '/conta',
  },
  {
    id: 'notif-2',
    title: 'Linha de Crédito Atualizada',
    message: 'Seu limite de crédito corporativo para compras a prazo foi ampliado para R$ 150.000,00.',
    type: 'CREDIT_LIMIT',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isRead: false,
    priority: 'MEDIUM',
    actionUrl: '/conta',
  },
  {
    id: 'notif-3',
    title: 'Tabela de Preços VIP Ativada',
    message: 'Sua empresa foi vinculada à Tabela VIP Ouro com descontos de até 15% em hardwares e servidores.',
    type: 'PRICE_BOOK_UPDATE',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: false,
    priority: 'HIGH',
    actionUrl: '/produtos',
  },
  {
    id: 'notif-4',
    title: 'Estoque Reposto no CD Santa Catarina',
    message: 'Lotes de Monitores Dell e Switches corporativos já disponíveis para pronta entrega na Região Sul.',
    type: 'STOCK_ALERT',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
    priority: 'LOW',
    actionUrl: '/produtos',
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: notificationsData,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'read-all') {
      notificationsData = notificationsData.map((n) => ({ ...n, isRead: true }));
      return NextResponse.json({
        success: true,
        data: { markedCount: notificationsData.length },
      });
    }

    return NextResponse.json({ success: true, data: notificationsData });
  } catch {
    notificationsData = notificationsData.map((n) => ({ ...n, isRead: true }));
    return NextResponse.json({
      success: true,
      data: { markedCount: notificationsData.length },
    });
  }
}
