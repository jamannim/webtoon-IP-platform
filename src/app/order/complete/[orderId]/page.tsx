'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/store';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { 
  CheckCircle2, 
  Printer, 
  Copy, 
  Check, 
  Clock, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  QrCode,
  Sparkles,
  MessageSquare,
  Gift,
  UserPlus
} from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

interface OrderCompletePageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderCompletePage({ params }: OrderCompletePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { orders, currentUser, mergeGuestOrdersToUser } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isMerged, setIsMerged] = useState(false);

  const order = orders.find((o) => o.id === resolvedParams.orderId);

  // Trigger celebration confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  if (!order) {
    return (
      <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">주문 정보를 찾을 수 없습니다.</h2>
        <Link href="/mypage" className="mt-4 inline-block">
          <Button variant="secondary">마이페이지로 이동</Button>
        </Link>
      </div>
    );
  }

  const isKiosk = order.fulfillmentType === 'KIOSK';
  const printJob = order.printJob;

  const handleCopy = () => {
    if (printJob) {
      navigator.clipboard.writeText(printJob.printCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full text-center">
      {/* Success Icon */}
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 animate-bounce">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <Badge variant="success" size="md">
        결제 완료 (테스트 모드)
      </Badge>

      <h1 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
        {isKiosk ? '키오스크 인쇄 코드가 발급되었습니다!' : '주문이 성공적으로 접수되었습니다!'}
      </h1>

      <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg mx-auto">
        주문번호: <span className="font-mono text-slate-300 font-bold">{order.orderNumber}</span>
      </p>

      {/* KIOSK CODE HIGHLIGHT CARD */}
      {isKiosk && printJob && (
        <div className="mt-8 rounded-3xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Printer className="w-48 h-48 text-indigo-400" />
          </div>

          <div className="relative z-10 space-y-4">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest block">
              7-Digit Offline Print Code
            </span>

            {/* Large 7-Digit Code Box */}
            <div className="inline-flex items-center gap-3 bg-slate-950/90 border border-indigo-500/50 rounded-2xl px-6 py-4 shadow-inner">
              <span className="font-mono text-4xl sm:text-5xl font-black text-white tracking-widest text-indigo-200">
                {printJob.printCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="코드 복사"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Countdown / Validity info */}
            <div className="flex items-center justify-center gap-2 text-xs text-amber-300 font-semibold pt-1">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>유효기간: 72시간 이내 전국 무인 키오스크에서 출력 가능</span>
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed pt-2">
              전국 편의점(CU, GS25) 제휴 키오스크 화면에서 위 7자리 코드를 입력하시면
              1분 만에 고화질 포토카드가 출력됩니다.
            </p>

            {/* Virtual Kiosk Simulator Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={`/kiosk?code=${printJob.printCode.replace(/[^0-9]/g, '')}`}>
                <Button size="lg" className="shadow-indigo-500/30">
                  <Printer className="w-5 h-5 text-indigo-200" />
                  <span>지금 키오스크 시뮬레이터로 출력하기</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY INFO CARD */}
      {!isKiosk && order.shipment && (
        <div className="mt-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-left space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Truck className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-base font-bold text-white">프리미엄 택배 배송 접수 완료</h3>
              <p className="text-xs text-slate-400">인쇄소 전문 제작 공정 후 발송됩니다 (1~2일 소요)</p>
            </div>
          </div>

          <div className="text-xs space-y-1.5 text-slate-300">
            <p>수령인: {order.shipment.recipient} ({order.shipment.phone})</p>
            <p>배송지: {order.shipment.address} {order.shipment.detailAddress}</p>
            <p>운송장 번호: <span className="font-mono text-indigo-400">{order.shipment.trackingNumber}</span></p>
          </div>
        </div>
      )}

      {/* Guest Alimtalk & Member Conversion Banner (PRD Step G-4, G-6) */}
      {order.isGuest && (
        <div className="mt-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 text-left space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">카카오 알림톡(LMS) 발송 완료</h4>
                <Badge variant="success" size="sm">전송 성공</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                수신 번호: <span className="font-mono text-slate-200 font-semibold">{order.guestPhone || '010-****-****'}</span> • 7자리 인쇄 코드 및 키오스크 위치 안내 전송됨
              </p>
            </div>
          </div>

          {!isMerged ? (
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Gift className="w-4 h-4" />
                  <span>1초 회원가입하고 이번 주문 내역 영구 보관하기</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  가입 즉시 1,000P 지급 및 마이페이지에서 72시간 내 언제든 코드를 재확인할 수 있습니다.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="shrink-0 bg-gradient-to-r from-indigo-600 to-pink-600 shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>회원가입 후 주문 연동</span>
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 text-xs text-emerald-400 font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>회원 계정 보관함으로 이번 주문 내역이 성공적으로 이관되었습니다!</span>
            </div>
          )}
        </div>
      )}

      {/* Auth Modal for Guest Conversion */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="SIGNUP"
        onSuccess={() => {
          if (order.guestPhone && currentUser) {
            mergeGuestOrdersToUser(order.guestPhone, currentUser.id, currentUser.name);
            setIsMerged(true);
          }
        }}
      />

      {/* Back to Mypage or Store */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Link href="/mypage">
          <Button variant="secondary">
            <span>마이페이지 내 주문 확인</span>
          </Button>
        </Link>
        <Link href="/store">
          <Button variant="ghost">
            <span>스토어로 돌아가기</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
