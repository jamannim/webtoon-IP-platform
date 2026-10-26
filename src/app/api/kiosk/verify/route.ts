import { NextResponse } from 'next/server';
import { MOCK_ORDERS } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const { printCode } = (await request.json()) as { printCode: string };

    if (!printCode) {
      return NextResponse.json(
        { success: false, message: '인쇄 코드가 입력되지 않았습니다.' },
        { status: 400 }
      );
    }

    const cleanInput = printCode.replace(/[^0-9]/g, '');

    const found = MOCK_ORDERS.find((o) => {
      if (!o.printJob) return false;
      return o.printJob.printCode.replace(/[^0-9]/g, '') === cleanInput;
    });

    if (!found || !found.printJob) {
      return NextResponse.json(
        { success: false, message: '일치하는 인쇄 코드를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (found.printJob.isPrinted) {
      return NextResponse.json(
        { success: false, message: '이미 출력이 완료된 일회성 코드입니다.' },
        { status: 409 }
      );
    }

    const isExpired = new Date(found.printJob.expiresAt).getTime() < Date.now();
    if (isExpired) {
      return NextResponse.json(
        { success: false, message: '출력 유효기간(72시간)이 만료된 코드입니다.' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '인쇄 코드가 정상 검증되었습니다.',
      data: {
        orderId: found.id,
        orderNumber: found.orderNumber,
        productName: found.items[0]?.productName,
        quantity: found.itemCount,
        options: found.items[0]?.options,
        previewUrl: found.printJob.previewUrl,
        expiresAt: found.printJob.expiresAt,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: '검증 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
