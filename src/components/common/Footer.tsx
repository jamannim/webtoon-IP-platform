import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Printer, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">TOON CANVAS</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              웹툰 공식 IP를 활용한 커스텀 디지털 굿즈 제작 및 오프라인 무인 키오스크 즉시 출력 플랫폼입니다.
              승인된 라이선스 에셋만 안전하게 사용하며, 작가님께 정당한 로열티를 정산합니다.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-medium">100% 공식 라이선스 계약 콘텐츠 보장</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3">바로가기</h4>
            <ul className="space-y-2">
              <li><Link href="/store" className="hover:text-indigo-400 transition-colors">웹툰 IP 스토어</Link></li>
              <li><Link href="/editor" className="hover:text-indigo-400 transition-colors">굿즈 커스텀 에디터</Link></li>
              <li><Link href="/kiosk" className="hover:text-indigo-400 transition-colors">키오스크 출력 시뮬레이터</Link></li>
              <li><Link href="/mypage" className="hover:text-indigo-400 transition-colors">마이페이지 (내 보관함)</Link></li>
            </ul>
          </div>

          {/* Kiosk & Support */}
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3">키오스크 & 고객지원</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Printer className="w-3.5 h-3.5 text-indigo-400" />
                <span>전국 CU/GS25 제휴 키오스크</span>
              </li>
              <li>출력 코드 유효기간: 발급 후 72시간</li>
              <li>고객센터: 1588-0000 (평일 10:00~18:00)</li>
              <li>문의: support@tooncanvas.com</li>
            </ul>
          </div>
        </div>

        {/* Legal & Notice */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 TOON CANVAS Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">이용약관</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">개인정보처리방침</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">라이선스 정책</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
