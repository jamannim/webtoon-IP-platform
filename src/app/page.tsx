'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Heart, 
  Search, 
  Palette, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import ProductCard from '@/components/common/ProductCard';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

export default function HomePage() {
  const router = useRouter();
  const { webtoons, products, verifyPrintCode } = useAppStore();
  const [quickCode, setQuickCode] = useState('');
  const [quickCodeError, setQuickCodeError] = useState<string | null>(null);
  const [quickCodeSuccess, setQuickCodeSuccess] = useState<string | null>(null);

  // Quick Kiosk Code Lookup handler
  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickCodeError(null);
    setQuickCodeSuccess(null);

    if (!quickCode.trim()) {
      setQuickCodeError('7자리 인쇄 코드를 입력해 주세요.');
      return;
    }

    const res = verifyPrintCode(quickCode);
    if (res.success && res.order) {
      setQuickCodeSuccess('확인 완료! 키오스크 출력 화면으로 이동합니다.');
      setTimeout(() => {
        router.push(`/kiosk?code=${encodeURIComponent(quickCode.replace(/[^0-9]/g, ''))}`);
      }, 700);
    } else {
      setQuickCodeError(res.message);
    }
  };

  const featuredIP = useMemo(
    () => webtoons.find((w) => w.featured && w.status === 'ACTIVE') || webtoons[0],
    [webtoons]
  );

  const displayWebtoons = useMemo(() => {
    const featured = webtoons.filter((w) => w.featured && w.status === 'ACTIVE');
    return featured.length > 0 ? featured : webtoons.slice(0, 8);
  }, [webtoons]);

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Hero Visual Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border-b border-slate-800 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                <span>K-웹툰 공식 라이선스 굿즈 스튜디오 오픈</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                최애 웹툰 캐릭터를 담아, <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  세상에 단 하나뿐인 굿즈
                </span>를 완성하세요
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                공식 승인된 고해상도 웹툰 에셋으로 포토카드·엽서·스티커를 직접 디자인하고,
                전국 무인 키오스크에서 7자리 코드로 1분 만에 즉시 출력하세요.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/editor">
                  <Button size="lg" className="w-full sm:w-auto shadow-indigo-500/30">
                    <Palette className="w-5 h-5 text-indigo-200" />
                    <span>지금 굿즈 제작하기</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>

                <Link href="/store">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <span>인기 웹툰 IP 스토어</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>공식 저작권 라이선스 보증</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>키오스크 72시간 안심 출력</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>인쇄소급 300 DPI 초고화질</span>
                </div>
              </div>
            </div>

            {/* Right Hero Card Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Glow Background effect */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-30 blur-xl animate-pulse" />

                <div className="relative rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                      실시간 인기 템플릿
                    </span>
                  </div>

                  {/* Card Sample */}
                  <div className="mt-5 aspect-[3/4] rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredIP.thumbnailUrl}
                      alt={featuredIP.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="relative z-10 flex justify-between items-start">
                      <Badge variant="purple" size="sm">
                        ★ 공식 홀로그램 포토카드
                      </Badge>
                      <span className="text-xs font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-white border border-white/10">
                        300 DPI
                      </span>
                    </div>

                    <div className="relative z-10 space-y-2">
                      <h3 className="text-xl font-black text-white">{featuredIP.title}</h3>
                      <p className="text-xs text-slate-300 line-clamp-1">{featuredIP.summary}</p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-white">1,000원~</span>
                        <Link
                          href={`/editor?ipId=${featuredIP.id}&productId=prod-photocard`}
                          className="px-3 py-1.5 rounded-lg bg-white text-slate-950 text-xs font-bold hover:bg-indigo-50 transition-colors"
                        >
                          편집 시작
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Kiosk Code Lookup Widget */}
      <section className="bg-slate-900 border-b border-slate-800 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-indigo-950/40 border border-indigo-500/30 p-4 sm:p-6 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                <Printer className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>키오스크 빠른 출력 코드 조회</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    전국 무인 키오스크 지원
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  발급받으신 7자리 인쇄 코드를 입력하시면 출력 대기 상태를 즉시 확인하고 시뮬레이터를 실행합니다.
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickLookup} className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="예: 748-2918"
                value={quickCode}
                onChange={(e) => setQuickCode(e.target.value)}
                maxLength={9}
                className="w-full sm:w-44 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono tracking-widest text-center focus:outline-none focus:border-indigo-500"
              />
              <Button type="submit" size="md" className="w-full sm:w-auto shrink-0">
                <span>조회하기</span>
              </Button>
            </form>
          </div>

          {/* Feedback messages */}
          {quickCodeError && (
            <p className="text-xs text-rose-400 font-medium text-center mt-2.5">
              ⚠️ {quickCodeError}
            </p>
          )}
          {quickCodeSuccess && (
            <p className="text-xs text-emerald-400 font-medium text-center mt-2.5">
              ✓ {quickCodeSuccess}
            </p>
          )}
        </div>
      </section>

      {/* 3. Featured Webtoon IPs */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Trending Webtoon IPs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              공식 라이선스 인기 웹툰
            </h2>
          </div>
          <Link
            href="/store"
            className="text-xs font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
          >
            <span>전체 작품 보기</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* IP Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayWebtoons.map((ip) => (
            <Link
              key={ip.id}
              href={`/store/${ip.id}`}
              className="group rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 group-hover:scale-[1.02] transition-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ip.thumbnailUrl}
                    alt={ip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="primary" size="sm">
                      {ip.genre}
                    </Badge>
                  </div>
                  {ip.featured && (
                    <div className="absolute top-2.5 right-2.5 bg-pink-600/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-bold border border-pink-400/30 flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-white" />
                      <span>메인추천</span>
                    </div>
                  )}
                  {ip.officialBadge && (
                    <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>공식인증</span>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {ip.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {ip.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] font-medium">{ip.author}</span>
                <span className="flex items-center gap-1 text-pink-400 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{(ip.likesCount / 1000).toFixed(1)}k</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Recommend Goods Product Lineup */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              제작 가능한 커스텀 굿즈 라인업
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              무인 키오스크 1분 즉시 출력부터 프리미엄 후가공 택배 배송까지, 원하는 방식으로 소장하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works (3 Steps) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <Badge variant="purple" size="md">
            쉬운 이용 방법
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
            3단계로 끝나는 웹툰 굿즈 출력
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-black text-lg flex items-center justify-center border border-indigo-500/30 mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">웹툰 & 굿즈 규격 선택</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              좋아하는 웹툰의 공식 캐릭터 에셋과 포토카드·엽서 등 원하는 굿즈 템플릿을 선택합니다.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 font-black text-lg flex items-center justify-center border border-purple-500/30 mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">WYSIWYG 자유 커스텀</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              300DPI 인쇄 가이드라인 위에서 캐릭터 배치, 홀로그램 엣지, 대사 추가 등 나만의 스타일로 편집합니다.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 font-black text-lg flex items-center justify-center border border-pink-500/30 mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">7자리 코드로 키오스크 출력</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              발급된 7자리 인쇄 코드를 가까운 편의점 무인 키오스크에 입력하면 1분 만에 실물 굿즈가 출력됩니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
