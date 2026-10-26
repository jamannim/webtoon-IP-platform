import { NextResponse } from 'next/server';
import { MOCK_SETTLEMENTS } from '@/lib/mockData';

export async function GET() {
  const totalRevenue = MOCK_SETTLEMENTS.reduce((acc, s) => acc + s.totalRevenue, 0);
  const totalRoyalty = MOCK_SETTLEMENTS.reduce((acc, s) => acc + s.royaltyAmount, 0);

  return NextResponse.json({
    success: true,
    data: MOCK_SETTLEMENTS,
    summary: {
      totalRevenue,
      totalRoyalty,
      platformFee: totalRevenue - totalRoyalty,
      activeIPCount: MOCK_SETTLEMENTS.length,
    },
    timestamp: new Date().toISOString(),
  });
}
