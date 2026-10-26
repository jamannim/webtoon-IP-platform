'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/store';
import { Order } from '@/types';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  RotateCcw,
  Layers,
  Check,
  Delete
} from 'lucide-react';

export default function KioskPageWrapper() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">키오스크 단말기를 연결 중...</div>}>
      <KioskComponent />
    </Suspense>
  );
}

function KioskComponent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const { verifyPrintCode, completeKioskPrint } = useAppStore();

  const [inputCode, setInputCode] = useState<string>('');
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printProgress, setPrintProgress] = useState<number>(0);
  const [printFinished, setPrintFinished] = useState<boolean>(false);

  // Initialize with query code if available
  useEffect(() => {
    if (initialCode) {
      const clean = initialCode.replace(/[^0-9]/g, '');
      setInputCode(clean);
      handleVerify(clean);
    }
  }, [initialCode]);

  // Handle keypad digit click
  const handleKeyClick = (digit: string) => {
    if (inputCode.length >= 7) return;
    const next = inputCode + digit;
    setInputCode(next);
    setErrorMessage(null);
  };

  // Handle backspace
  const handleBackspace = () => {
    setInputCode((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  // Handle clear
  const handleClear = () => {
    setInputCode('');
    setVerifiedOrder(null);
    setErrorMessage(null);
    setPrintFinished(false);
  };

  // Verify Code
  const handleVerify = (codeToTest?: string) => {
    const target = codeToTest || inputCode;
    if (target.length < 7) {
      setErrorMessage('7자리 숫자를 모두 입력해 주세요.');
      return;
    }

    const res = verifyPrintCode(target);
    if (res.success && res.order) {
      setVerifiedOrder(res.order);
      setErrorMessage(null);
    } else {
      setVerifiedOrder(null);
      setErrorMessage(res.message);
    }
  };

  // Start Printing Process (Simulation)
  const handleStartPrint = () => {
    if (!verifiedOrder) return;

    setIsPrinting(true);
    setPrintProgress(10);

    const interval = setInterval(() => {
      setPrintProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPrinting(false);
          setPrintFinished(true);
          completeKioskPrint(verifiedOrder.id, 'KIOSK-SEOUL-HONGDAE-01');

          // Trigger celebration
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.7 },
          });

          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  // Format display code: "123-4567"
  const formattedInput = inputCode.length > 3
    ? `${inputCode.slice(0, 3)}-${inputCode.slice(3)}`
    : inputCode;

  return (
    <div className="flex-1 bg-slate-950 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Terminal Frame (Realistic Kiosk Bezel) */}
        <div className="rounded-3xl bg-slate-900 border-4 border-slate-700 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Kiosk Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white tracking-tight">
                    TOON CANVAS 무인 인쇄기
                  </h1>
                  <Badge variant="success" size="sm">
                    기기 정상 작동
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  홍대입구역 9번 출구 GS25 스마트키오스크 1호기 • 300 DPI 포토프린터 탑재
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono text-indigo-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                KIOSK-ID: #8420-HD
              </span>
            </div>
          </div>

          {/* Kiosk Screen Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
            {/* Left: 7-Digit Touch Keypad */}
            <div className="md:col-span-6 space-y-4">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  인쇄 코드 7자리 입력
                </span>
                <p className="text-[11px] text-slate-500">
                  모바일 웹이나 앱에서 발급받은 번호를 터치패드로 입력하세요.
                </p>
              </div>

              {/* Code Display Monitor */}
              <div className="rounded-2xl bg-slate-950 border-2 border-slate-800 p-4 text-center shadow-inner">
                <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-indigo-300">
                  {formattedInput || '___-____'}
                </span>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Numeric Keypad Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeyClick(digit)}
                    disabled={isPrinting}
                    className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-black shadow-md border border-slate-700 active:scale-95 transition-all select-none"
                  >
                    {digit}
                  </button>
                ))}

                {/* Clear */}
                <button
                  onClick={handleClear}
                  disabled={isPrinting}
                  className="h-14 rounded-2xl bg-slate-800/60 hover:bg-rose-500/20 text-rose-400 font-bold text-sm border border-slate-700 active:scale-95 transition-all select-none"
                >
                  초기화
                </button>

                {/* 0 */}
                <button
                  onClick={() => handleKeyClick('0')}
                  disabled={isPrinting}
                  className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xl font-black shadow-md border border-slate-700 active:scale-95 transition-all select-none"
                >
                  0
                </button>

                {/* Backspace */}
                <button
                  onClick={handleBackspace}
                  disabled={isPrinting}
                  className="h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 active:scale-95 transition-all flex items-center justify-center select-none"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>

              {/* Check Code Button */}
              <Button
                size="lg"
                onClick={() => handleVerify()}
                disabled={inputCode.length !== 7 || isPrinting}
                className="w-full shadow-indigo-500/30"
              >
                <span>인쇄 코드 조회 및 검증</span>
              </Button>
            </div>

            {/* Right: Print Preview & Printing Status */}
            <div className="md:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
              {verifiedOrder ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>코드 확인 완료</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {verifiedOrder.orderNumber}
                    </span>
                  </div>

                  {/* High Quality Thumbnail Card */}
                  <div className="aspect-[4/5] max-h-56 mx-auto rounded-xl overflow-hidden bg-slate-900 border border-slate-700 p-2 flex items-center justify-center shadow-xl relative">
                    {verifiedOrder.items[0]?.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={verifiedOrder.items[0].previewUrl}
                        alt="인쇄 미리보기"
                        className="max-h-full max-w-full object-contain rounded"
                      />
                    ) : (
                      <Sparkles className="w-8 h-8 text-indigo-400" />
                    )}

                    {isPrinting && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-3" />
                        <span className="text-xs font-bold text-white">
                          고화질 인쇄 중... ({printProgress}%)
                        </span>
                        <div className="w-36 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${printProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Print Spec Details */}
                  <div className="space-y-1 text-xs text-slate-300">
                    <h3 className="font-bold text-white text-sm">
                      {verifiedOrder.items[0]?.projectTitle}
                    </h3>
                    <p className="text-slate-400">
                      규격: {verifiedOrder.items[0]?.productName} • 수량: {verifiedOrder.itemCount}장
                    </p>
                    <p className="text-slate-400">
                      후가공: {verifiedOrder.items[0]?.options.coating} ({verifiedOrder.items[0]?.options.paperType})
                    </p>
                  </div>

                  {/* Action CTA */}
                  {!printFinished && !verifiedOrder.printJob?.isPrinted ? (
                    <Button
                      size="lg"
                      onClick={handleStartPrint}
                      disabled={isPrinting}
                      className="w-full shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <Printer className="w-4 h-4" />
                      <span>실물 인쇄 시작 ({verifiedOrder.itemCount}장)</span>
                    </Button>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                      <span className="text-emerald-400 font-bold text-sm block">
                        🎉 인쇄가 완료되었습니다!
                      </span>
                      <p className="text-xs text-slate-400">
                        하단 출력구에서 갓 나온 실물 포토카드를 수령해 주세요.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                  <Printer className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-sm font-bold text-slate-400">인쇄 대기 화면</p>
                  <p className="text-xs text-slate-500 mt-1">
                    좌측 키패드에서 7자리 인쇄 코드를 입력하고 [조회]를 누르세요.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Dispenser Simulation Slot */}
          <div className="pt-6 border-t border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              DISPENSER / 인쇄물 배출구
            </span>
            <div className="h-10 rounded-xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center relative overflow-hidden">
              {printFinished && (
                <div className="animate-bounce flex items-center gap-2 text-xs font-bold text-pink-400">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>[수령 완료] 갓 출력된 웹툰 굿즈가 배출되었습니다!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
