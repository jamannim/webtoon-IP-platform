'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Store, 
  Palette, 
  Printer, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MOCK_USERS } from '@/lib/mockData';
import AuthModal from '@/components/auth/AuthModal';
import { LogOut, LogIn } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { currentUser, isLoggedIn, switchUser, logout } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'LOGIN' | 'SIGNUP' | 'GUEST_LOOKUP'>('LOGIN');

  const navLinks = [
    { href: '/', label: '홈', icon: Sparkles },
    { href: '/store', label: '스토어', icon: Store },
    { href: '/editor', label: '상품', icon: Palette },
    { href: '/kiosk', label: '출력', icon: Printer },
    { href: '/mypage', label: '마이페이지', icon: User },
    { href: '/admin', label: 'ADMIN', icon: ShieldCheck, adminOnly: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-pink-200 bg-clip-text text-transparent">
                TOON CANVAS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                STUDIO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">웹툰 IP 굿즈 제작 & 키오스크 출력</p>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Auth Control & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center border border-slate-600">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block font-bold text-slate-100 leading-tight">{currentUser.name}</span>
                  <span className={`text-[10px] ${
                    currentUser.role === 'ADMIN' ? 'text-amber-400 font-semibold' :
                    currentUser.role === 'CREATOR' ? 'text-pink-400 font-semibold' : 'text-indigo-400'
                  }`}>
                    {currentUser.role === 'ADMIN' ? '운영 관리자' :
                     currentUser.role === 'CREATOR' ? '웹툰 작가' : '일반 회원'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl py-1.5 z-50 animate-fade-in">
                  <div className="px-3.5 py-2.5 border-b border-slate-700">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-indigo-300 font-semibold">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>보유 포인트: {(currentUser.points || 1000).toLocaleString()}P</span>
                    </div>
                  </div>

                  <div className="py-1 border-b border-slate-700/80">
                    <p className="px-3.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      계정 전환 (테스트 모드)
                    </p>
                    {MOCK_USERS.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 text-left text-xs transition-colors ${
                          currentUser.id === user.id ? 'bg-indigo-600/30 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-700/60'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-600 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="truncate">{user.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>로그아웃 (비회원 모드로 전환)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthDefaultTab('GUEST_LOOKUP');
                  setAuthModalOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-400" />
                <span>비회원 주문조회</span>
              </button>

              <button
                onClick={() => {
                  setAuthDefaultTab('LOGIN');
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-[0.98]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>로그인 / 가입</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {/* Auth & Guest Lookup Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
      />
    </header>
  );
}
