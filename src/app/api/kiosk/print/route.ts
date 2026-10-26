import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, kioskId } = (await request.json()) as {
      orderId: string;
      kioskId?: string;
    };

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'orderId가 필요합니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '키오스크 출력이 완료되었습니다.',
      data: {
        orderId,
        kioskId: kioskId || 'KIOSK-SEOUL-HONGDAE-01',
        printedAt: new Date().toISOString(),
        status: 'PRINTED',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: '출력 완료 처리 실패' },
      { status: 500 }
    );
  }
}
