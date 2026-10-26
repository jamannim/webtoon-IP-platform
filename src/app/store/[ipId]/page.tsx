import React, { Suspense } from 'react';
import Link from 'next/link';
import { MOCK_WEBTOON_IPS, MOCK_CHARACTERS } from '@/lib/mockData';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import ProductCard from '@/components/common/ProductCard';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Heart, 
  Palette, 
  Sparkles, 
  Calendar,
  Users
} from 'lucide-react';

export function generateStaticParams() {
  return MOCK_WEBTOON_IPS.map((ip) => ({
    ipId: ip.id,
  }));
}

interface StoreDetailPageProps {
  params: Promise<{ ipId: string }>;
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const { ipId } = await params;
  const ip = MOCK_WEBTOON_IPS.find((w) => w.id === ipId);

  if (!ip) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">작품을 찾을 수 없습니다.</h2>
        <p className="text-sm text-slate-400 mt-2">존재하지 않거나 라이선스가 만료된 작품입니다.</p>
        <Link href="/store" className="mt-6 inline-block">
          <Button variant="secondary">스토어로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const characters = MOCK_CHARACTERS.filter((c) => c.ipId === ip.id);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back button */}
      <Link
        href="/store"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>스토어 목록으로 돌아가기</span>
      </Link>

      {/* Hero Visual Area */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 overflow-hidden mb-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Thumbnail */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-56 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ip.thumbnailUrl}
                alt={ip.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">{ip.genre}</Badge>
              {ip.officialBadge && (
                <Badge variant="success">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>공식 라이선스 계약 완료</span>
                </Badge>
              )}
              <span className="text-xs text-slate-400 flex items-center gap-1 ml-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{ip.releaseYear}년 연재</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {ip.title}
            </h1>

            <p className="text-sm font-semibold text-indigo-300">
              글 / 그림: {ip.author}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {ip.description}
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-pink-400 font-bold">
                <Heart className="w-4 h-4 fill-current" />
                <span>관심 작품 {(ip.likesCount).toLocaleString()}명</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>공식 캐릭터 {characters.length}종 등록</span>
              </span>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link href={`/editor?ipId=${ip.id}`}>
                <Button size="lg" className="shadow-indigo-500/30">
                  <Palette className="w-5 h-5 text-indigo-200" />
                  <span>이 작품으로 굿즈 만들기</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Characters Section */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">공식 캐릭터 목록</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <div
              key={char.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex items-start gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={char.avatarUrl}
                  alt={char.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-base font-bold text-white truncate">{char.name}</h3>
                  <span className="text-[11px] font-semibold text-indigo-400 shrink-0">
                    {char.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {char.description}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {char.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
