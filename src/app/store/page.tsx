'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Search, Filter, ShieldCheck, Heart, Sparkles, ArrowRight, Scissors } from 'lucide-react';
import Badge from '@/components/common/Badge';

export default function StorePage() {
  const { webtoons } = useAppStore();
  const [selectedGenre, setSelectedGenre] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'NEWEST' | 'NAME'>('POPULAR');

  const genres = ['전체', '현대 판타지', '무협/판타지', '로맨스 판타지', 'SF 액션', '학원 액션', '힐링 일상', '드라마'];

  const filteredWebtoons = useMemo(() => {
    return webtoons
      .filter((w) => {
        const matchesGenre = selectedGenre === '전체' || w.genre === selectedGenre;
        const matchesSearch =
          w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGenre && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'POPULAR') return b.likesCount - a.likesCount;
        if (sortBy === 'NEWEST') return b.releaseYear - a.releaseYear;
        return a.title.localeCompare(b.title);
      });
  }, [webtoons, selectedGenre, searchQuery, sortBy]);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>공식 라이선스 인증 IP 스토어</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          웹툰 IP 스토어
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          제작사 및 작가와의 정식 라이선스 계약이 체결된 K-웹툰 오리지널 작품입니다.
          공식 인증 에셋으로 안심하고 굿즈를 디자인해 보세요.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Genre Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Search input & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="작품명, 작가명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'POPULAR' | 'NEWEST' | 'NAME')}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="POPULAR">인기순</option>
            <option value="NEWEST">최신 연재순</option>
            <option value="NAME">작품명 가나다순</option>
          </select>
        </div>
      </div>

      {/* Webtoon Cards Grid */}
      {filteredWebtoons.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-16 text-center">
          <p className="text-slate-400 text-sm">검색 결과와 일치하는 웹툰 IP가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredWebtoons.map((ip) => (
            <Link
              key={ip.id}
              href={`/store/${ip.id}`}
              className="group rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[55/85] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 group-hover:scale-[1.02] transition-transform shadow-lg group-hover:shadow-indigo-500/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ip.thumbnailUrl}
                    alt={ip.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Die-cut Cut Line Simulation Overlay */}
                  <div className="absolute inset-1.5 border border-amber-400/50 rounded-xl pointer-events-none" />
                  
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="primary" size="sm">
                      {ip.genre}
                    </Badge>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-bold border border-amber-500/40 flex items-center gap-1">
                      <Scissors className="w-2.5 h-2.5" />
                      <span>55x85mm 재단</span>
                    </span>

                    {ip.officialBadge && (
                      <div className="bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>공식인증</span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {ip.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {ip.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{ip.author}</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                  <span>포토카드 편집</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
