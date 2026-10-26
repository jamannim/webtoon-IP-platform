import { NextResponse } from 'next/server';
import { Order } from '@/types';
import { MOCK_ORDERS } from '@/lib/mockData';

let serverOrders: Order[] = [...MOCK_ORDERS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const filtered = userId ? serverOrders.filter((o) => o.userId === userId) : serverOrders;

  return NextResponse.json({
    success: true,
    data: filtered,
    count: filtered.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Order;

    if (!body.userId || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: '유효한 주문 항목이 없습니다.' },
        { status: 400 }
      );
    }

    serverOrders.unshift(body);

    return NextResponse.json({
      success: true,
      data: body,
      message: '주문이 접수되었습니다.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: '주문 처리 중 오류가 발생했습니다.' },
      { status: 400 }
    );
  }
}
