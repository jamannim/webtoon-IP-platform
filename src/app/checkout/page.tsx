'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { FulfillmentType, PaymentMethod } from '@/types';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import { 
  Printer, 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">주문서를 불러오는 중...</div>}>
      <CheckoutComponent />
    </Suspense>
  );
}

function CheckoutComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { projects, products, webtoons, createOrder } = useAppStore();

  const projectId = searchParams.get('projectId');
  const project = projects.find((p) => p.id === projectId) || projects[0];

  const product = products.find((p) => p.id === project?.productId) || products[0];
  const ip = webtoons.find((w) => w.id === project?.ipId) || webtoons[0];

  // Order Options State
  const [quantity, setQuantity] = useState<number>(1);
  const [paperType, setPaperType] = useState<string>('스노우지 250g');
  const [coating, setCoating] = useState<string>('스파클링 홀로그램');
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('KIOSK');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TOSSPAY');

  // Shipping Form State
  const [recipient, setRecipient] = useState<string>('김웹툰');
  const [phone, setPhone] = useState<string>('010-1234-5678');
  const [address, setAddress] = useState<string>('서울특별시 마포구 월드컵북로 400');
  const [detailAddress, setDetailAddress] = useState<string>('8층 웹툰스튜디오');
  const [postalCode, setPostalCode] = useState<string>('03925');

  // Virtual PG Modal State
  const [pgModalOpen, setPgModalOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Price Calculation
  const unitPrice = product.basePrice + (coating.includes('홀로그램') ? 200 : 0);
  const itemTotal = unitPrice * quantity;
  const shippingFee = fulfillmentType === 'DELIVERY' ? 3000 : 0;
  const finalAmount = itemTotal + shippingFee;

  const handleOpenPG = (e: React.FormEvent) => {
    e.preventDefault();
    setPgModalOpen(true);
  };

  const handleSimulatePaymentSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = createOrder({
        projectId: project.id,
        projectTitle: project.title,
        productId: product.id,
        productName: product.name,
        ipId: ip.id,
        ipTitle: ip.title,
        previewUrl: project.previewDataUrl || product.mockupUrl,
        quantity,
        unitPrice,
        options: { paperType, coating },
        fulfillmentType,
        paymentMethod,
        shippingInfo:
          fulfillmentType === 'DELIVERY'
            ? { recipient, phone, address, detailAddress, postalCode }
            : undefined,
      });

      setIsProcessing(false);
      setPgModalOpen(false);

      // Navigate to order complete page
      router.push(`/order/complete/${order.id}`);
    }, 1000);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>에디터로 돌아가기</span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white">주문 및 결제서 작성</h1>
        <p className="text-xs text-slate-400 mt-1">
          제작 옵션 및 수령 방식을 선택하고 가상 결제를 진행하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Options & Fulfillment */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Fulfillment Type Selection */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>수령 방식 선택</span>
              <Badge variant="primary" size="sm">필수</Badge>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Kiosk */}
              <button
                type="button"
                onClick={() => setFulfillmentType('KIOSK')}
                disabled={!product.kioskAvailable}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  fulfillmentType === 'KIOSK'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                } ${!product.kioskAvailable ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <Printer className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">배송비 0원</span>
                </div>
                <h4 className="text-sm font-bold text-white">키오스크 즉시 출력</h4>
                <p className="text-xs text-slate-400 mt-1">
                  7자리 인쇄 코드 발급 • 전국 CU/GS25 등 무인 키오스크에서 즉시 수령
                </p>
              </button>

              {/* Option B: Delivery */}
              <button
                type="button"
                onClick={() => setFulfillmentType('DELIVERY')}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  fulfillmentType === 'DELIVERY'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">배송비 3,000원</span>
                </div>
                <h4 className="text-sm font-bold text-white">프리미엄 택배 배송</h4>
                <p className="text-xs text-slate-400 mt-1">
                  전문 인쇄소 정밀 후가공 후 안전 포장 택배 발송 (1~2일 소요)
                </p>
              </button>
            </div>
          </div>

          {/* 2. Paper & Finish Options */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">인쇄 및 후가공 옵션</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">용지 재질</label>
                <select
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="스노우지 250g (표준 카드용)">스노우지 250g (표준 카드용, 가장 선명함)</option>
                  <option value="랑데뷰 내츄럴 240g (고급 수입지)">랑데뷰 내츄럴 240g (고급 펄 질감)</option>
                  <option value="홀로그램 페트지 (반투명/방수)">홀로그램 페트지 (반투명/방수 특수재질)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">코팅 및 후가공</label>
                <select
                  value={coating}
                  onChange={(e) => setCoating(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="스파클링 홀로그램 (+200원)">스파클링 홀로그램 (+200원, 반짝이는 별빛 효과)</option>
                  <option value="유리조각 홀로그램 (+200원)">유리조각 홀로그램 (+200원, 각도에 따른 무지개 프리즘)</option>
                  <option value="벨벳 무광코팅 (부드러운 촉감)">벨벳 무광코팅 (지문 방지, 부드러운 촉감)</option>
                  <option value="고광택 유광코팅 (선명한 색감)">고광택 유광코팅 (가장 선명한 인쇄 발색)</option>
                </select>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">출력 및 제작 수량</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">최대 20장까지 일괄 출력 가능</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Delivery Address Form (If Delivery is selected) */}
          {fulfillmentType === 'DELIVERY' && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-3">
              <h3 className="text-sm font-bold text-white">배송지 정보 입력</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">수령인</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">연락처</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">기본 주소</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white mb-2"
                />
                <input
                  type="text"
                  placeholder="상세 주소"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* 4. Payment Method */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-3">
            <h3 className="text-sm font-bold text-white">결제 수단 선택 (테스트 모드)</h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('TOSSPAY')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'TOSSPAY'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <span className="text-xs block">토스페이</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('KAKAOPAY')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'KAKAOPAY'
                    ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <span className="text-xs block">카카오페이</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'CARD'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <span className="text-xs block">신용/체크카드</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
            <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              최종 주문 요약
            </h3>

            {/* Item Thumbnail & Spec */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center p-1">
                {project.previewDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.previewDataUrl}
                    alt={project.title}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  {ip.title}
                </span>
                <h4 className="text-sm font-bold text-white">{project.title}</h4>
                <p className="text-xs text-slate-400">{product.name}</p>
                <p className="text-[11px] text-slate-500">{coating}</p>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>상품 단가 ({product.name})</span>
                <span>{unitPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>주문 수량</span>
                <span>{quantity}장</span>
              </div>
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>{itemTotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비 ({fulfillmentType === 'KIOSK' ? '키오스크 즉시 출력' : '택배'})</span>
                <span>{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">최종 결제 금액</span>
                <span className="text-2xl font-black text-white">
                  {finalAmount.toLocaleString()}원
                </span>
              </div>
              <Badge variant="success">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>안심 결제</span>
              </Badge>
            </div>

            <Button
              size="lg"
              onClick={handleOpenPG}
              className="w-full shadow-indigo-500/25"
            >
              <Lock className="w-4 h-4" />
              <span>{finalAmount.toLocaleString()}원 결제하기</span>
            </Button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              본 환경은 테스트 모드이며 실제 카드 결제 청구 없이 가상 결제창 승인 절차를 거칩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Virtual PG Simulation Modal */}
      <Modal
        isOpen={pgModalOpen}
        onClose={() => !isProcessing && setPgModalOpen(false)}
        title="전자 결제 승인 (PG 테스트 모드)"
        description="가상 결제사(토스/카카오페이) 트랜잭션 시뮬레이터입니다."
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">가맹점</span>
              <span className="font-bold text-white">TOON CANVAS 스튜디오</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">주문 상품</span>
              <span className="font-bold text-slate-200">{project.title} ({quantity}장)</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-800 text-indigo-400">
              <span>결제 요청 금액</span>
              <span>{finalAmount.toLocaleString()}원</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs leading-relaxed">
            💡 [결제 승인하기] 버튼을 클릭하면 즉시 가상 승인이 완료되고, 7자리 무인 키오스크 인쇄 코드가 발급됩니다.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setPgModalOpen(false)}
              disabled={isProcessing}
            >
              취소
            </Button>
            <Button
              onClick={handleSimulatePaymentSuccess}
              isLoading={isProcessing}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>결제 승인하기</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
