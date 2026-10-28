'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  Printer, 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Eye
} from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

export default function AdminPage() {
  const { 
    currentUser, 
    switchUser, 
    webtoons, 
    updateWebtoonStatus, 
    orders, 
    updateOrderStatus,
    settlements 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'IPS' | 'ORDERS' | 'SETTLEMENT'>('DASHBOARD');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // RBAC Access Control
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">관리자 전용 페이지</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          현재 계정({currentUser ? currentUser.name : '비회원'})은 일반 사용자 권한입니다.
          테스트를 위해 아래 버튼을 누르면 관리자 계정으로 즉시 전환됩니다.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={() => switchUser('user-admin')}>
            <ShieldCheck className="w-4 h-4" />
            <span>관리자 계정으로 전환</span>
          </Button>
          <Link href="/">
            <Button variant="secondary">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Summary Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.finalAmount, 0);
  const kioskOrders = orders.filter((o) => o.fulfillmentType === 'KIOSK');
  const printedOrders = kioskOrders.filter((o) => o.printJob?.isPrinted);
  const deliveryOrders = orders.filter((o) => o.fulfillmentType === 'DELIVERY');
  const totalRoyalty = settlements.reduce((acc, s) => acc + s.royaltyAmount, 0);

  const handleTrackingUpdate = (orderId: string) => {
    const tracking = trackingInputs[orderId];
    if (!tracking) {
      alert('운송장 번호를 입력해 주세요.');
      return;
    }
    updateOrderStatus(orderId, 'SHIPPED', tracking);
    alert('송장 번호가 등록되고 발송 완료 처리되었습니다.');
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              TOON CANVAS BACKOFFICE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            플랫폼 운영 및 정산 관리 센터
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="warning">
            관리자 접속 중: {currentUser ? currentUser.name : '비회원'}
          </Badge>
          <Button variant="secondary" size="sm" onClick={() => switchUser('user-1')}>
            <span>일반 팬 모드로 전환</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`px-5 py-3 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'DASHBOARD'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          종합 통계 대시보드
        </button>

        <button
          onClick={() => setActiveTab('IPS')}
          className={`px-5 py-3 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'IPS'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          웹툰 IP & 공식 라이선스 ({webtoons.length})
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`px-5 py-3 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'ORDERS'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          주문·출력·배송 관리 ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('SETTLEMENT')}
          className={`px-5 py-3 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'SETTLEMENT'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          IP별 로열티 정산 현황
        </button>
      </div>

      {/* TAB 1: DASHBOARD METRICS */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>누적 총 매출액</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {(totalRevenue + 12880000).toLocaleString()}원
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">
                전월 대비 +24.8% 성장
              </span>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>키오스크 즉시 출력률</span>
                <Printer className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {kioskOrders.length > 0
                  ? `${Math.round((printedOrders.length / kioskOrders.length) * 100)}%`
                  : '100%'}
              </div>
              <span className="text-[11px] text-indigo-400 font-semibold">
                전국 8,420개 키오스크 가동 중
              </span>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>공식 활성 웹툰 IP</span>
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {webtoons.filter((w) => w.status === 'ACTIVE').length}개 작품
              </div>
              <span className="text-[11px] text-purple-400 font-semibold">
                100% 저작권 라이선스 계약
              </span>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>작가 로열티 정산 예정액</span>
                <TrendingUp className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {totalRoyalty.toLocaleString()}원
              </div>
              <span className="text-[11px] text-pink-400 font-semibold">
                평균 정산율 15.0%
              </span>
            </div>
          </div>

          {/* Quick status feed */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
            <h3 className="text-sm font-bold text-white mb-4">최근 플랫폼 운영 감사 로그</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">
                  홍대입구역 9번 출구 GS25 키오스크 1호기: 7자리 인쇄 코드 정상 출력 완료
                </span>
                <span className="text-slate-500 font-mono">1분 전</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">
                  스텔라 나이트 홀로그램 포토카드 라이선스 갱신 및 에셋 3건 등록
                </span>
                <span className="text-slate-500 font-mono">2시간 전</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEBTOON IP & LICENSE MANAGEMENT */}
      {activeTab === 'IPS' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">공식 등록 웹툰 IP 목록</h3>
            <span className="text-xs text-slate-400">토글 시 즉시 사용자 노출 제어</span>
          </div>

          <div className="divide-y divide-slate-800">
            {webtoons.map((ip) => (
              <div key={ip.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ip.thumbnailUrl} alt={ip.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{ip.title}</h4>
                      <Badge variant={ip.status === 'ACTIVE' ? 'success' : 'slate'} size="sm">
                        {ip.status === 'ACTIVE' ? '공식 연재 및 제작 활성' : '비활성'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      작가: {ip.author} • 장르: {ip.genre} • 캐릭터: {ip.charactersCount}종
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() =>
                      updateWebtoonStatus(ip.id, ip.status === 'ACTIVE' ? 'EXPIRED' : 'ACTIVE')
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      ip.status === 'ACTIVE'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                    }`}
                  >
                    {ip.status === 'ACTIVE' ? '제작 일시정지' : '제작 활성화'}
                  </button>
                  <Link href={`/store/${ip.id}`}>
                    <Button variant="secondary" size="sm">
                      <Eye className="w-3.5 h-3.5" />
                      <span>작품 보기</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ORDER & SHIPPING MANAGEMENT */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">전체 주문 및 배송/출력 처리 현황</h3>
            </div>

            <div className="divide-y divide-slate-800">
              {orders.map((order) => (
                <div key={order.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{order.orderNumber}</span>
                      <Badge variant="primary" size="sm">
                        {order.fulfillmentType === 'KIOSK' ? '키오스크 출력' : '택배 배송'}
                      </Badge>
                      <Badge
                        variant={order.status === 'PRINTED' || order.status === 'DELIVERED' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {order.items[0]?.projectTitle} ({order.userName})
                    </h4>
                    <p className="text-xs text-slate-400">
                      수량: {order.itemCount}개 • 결제액: {order.finalAmount.toLocaleString()}원 •{' '}
                      {new Date(order.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>

                  {/* Action based on fulfillment */}
                  <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-end">
                    {order.fulfillmentType === 'DELIVERY' && order.shipment && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder="운송장 번호 입력"
                          value={trackingInputs[order.id] ?? order.shipment.trackingNumber ?? ''}
                          onChange={(e) =>
                            setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })
                          }
                          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleTrackingUpdate(order.id)}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>송장등록</span>
                        </Button>
                      </div>
                    )}

                    {order.fulfillmentType === 'KIOSK' && order.printJob && (
                      <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                        코드: <span className="text-indigo-400 font-bold">{order.printJob.printCode}</span>{' '}
                        {order.printJob.isPrinted ? '(출력완료)' : '(출력대기)'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTLEMENT DASHBOARD */}
      {activeTab === 'SETTLEMENT' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">웹툰 IP별 판매량 및 로열티 정산 테이블</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                라이선스 계약 요율에 따라 월별 정산금이 자동 산출됩니다.
              </p>
            </div>
            <Button size="sm">
              <span>정산 내역 다운로드 (CSV)</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">정산 대상 웹툰 IP</th>
                  <th className="p-4">정산 기간</th>
                  <th className="p-4">판매량 (주문건수)</th>
                  <th className="p-4">총 매출액</th>
                  <th className="p-4">계약 로열티율</th>
                  <th className="p-4">지급 로열티 금액</th>
                  <th className="p-4">정산 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white">{s.ipTitle}</td>
                    <td className="p-4 font-mono text-slate-400">{s.period}</td>
                    <td className="p-4">{s.totalOrders.toLocaleString()}건</td>
                    <td className="p-4 font-mono">{s.totalRevenue.toLocaleString()}원</td>
                    <td className="p-4 text-indigo-400 font-bold">{(s.royaltyRate * 100).toFixed(0)}%</td>
                    <td className="p-4 font-mono font-black text-pink-400">
                      {s.royaltyAmount.toLocaleString()}원
                    </td>
                    <td className="p-4">
                      <Badge variant={s.status === 'CONFIRMED' ? 'success' : 'warning'} size="sm">
                        {s.status === 'CONFIRMED' ? '정산 확정' : '정산 대기'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
