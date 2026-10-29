import { NextResponse } from 'next/server';
import { MOCK_SETTLEMENTS } from '@/lib/mockData';

export async function GET() {
  const totalGrossRevenue = MOCK_SETTLEMENTS.reduce((acc, s) => acc + s.totalRevenue, 0);
  const totalPgFee = MOCK_SETTLEMENTS.reduce((acc, s) => acc + s.pgFeeAmount, 0);
  const totalNetRevenue = MOCK_SETTLEMENTS.reduce((acc, s) => acc + s.netRevenue, 0);
  const totalRoyalty = MOCK_SETTLEMENTS.reduce((acc, s) => acc + s.royaltyAmount, 0);
  const platformNetProfit = totalNetRevenue - totalRoyalty;

  return NextResponse.json({
    success: true,
    data: MOCK_SETTLEMENTS,
    summary: {
      totalGrossRevenue,
      totalPgFee,
      averagePgFeeRate: '3.3%',
      totalNetRevenue,
      totalRoyalty,
      platformNetProfit,
      settlementCount: MOCK_SETTLEMENTS.length,
    },
    timestamp: new Date().toISOString(),
  });
}
