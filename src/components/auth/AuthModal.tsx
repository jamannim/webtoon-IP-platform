'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Order } from '@/types';
import { 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  Smartphone, 
  Lock, 
  User, 
  Mail, 
  Check, 
  ArrowRight,
  ExternalLink,
  Copy,
  Clock,
  Gift
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'LOGIN' | 'SIGNUP' | 'GUEST_LOOKUP';
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'LOGIN',
  onSuccess
}: AuthModalProps) {
  const { loginBySocial, signup, findGuestOrders, mergeGuestOrdersToUser } = useAppStore();

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP' | 'GUEST_LOOKUP'>(defaultTab);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Guest Lookup State
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupPin, setLookupPin] = useState('');
  const [lookupResults, setLookupResults] = useState<Order[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [mergeSuccessMsg, setMergeSuccessMsg] = useState<string | null>(null);

  // Social Login Handler
  const handleSocialLogin = (provider: 'KAKAO' | 'NAVER' | 'GOOGLE') => {
    loginBySocial(provider);
    onClose();
    if (onSuccess) onSuccess();
  };

  // Email Login Handler
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      alert('이메일을 입력해 주세요.');
      return;
    }
    loginBySocial('EMAIL', loginEmail, loginEmail.split('@')[0]);
    onClose();
    if (onSuccess) onSuccess();
  };

  // Signup Handler
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail) {
      alert('이름과 이메일을 모두 입력해 주세요.');
      return;
    }
    if (!agreeTerms) {
      alert('필수 이용약관에 동의해 주세요.');
      return;
    }
    signup(signupName, signupEmail, signupPhone);
    alert('회원가입이 완료되었습니다! 신규 가입 축하 1,000P가 지급되었습니다.');
    onClose();
    if (onSuccess) onSuccess();
  };

  // Guest Order Search Handler
  const handleLookupGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone) {
      alert('주문 시 입력했던 휴대폰 번호를 입력해 주세요.');
      return;
    }
    const found = findGuestOrders(lookupPhone, lookupPin);
    setLookupResults(found);
    setHasSearched(true);
  };

  // Copy Code Helper
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Merge Guest Order to new account
  const handleMergeToMember = (order: Order) => {
    const user = signup(order.userName || '비회원전환회원', `${order.guestPhone?.replace(/[^0-9]/g, '') || 'guest'}@tooncanvas.com`, order.guestPhone);
    mergeGuestOrdersToUser(order.guestPhone || '', user.id, user.name);
    setMergeSuccessMsg('주문 내역이 신규 회원 보관함으로 성공적으로 이관되었습니다!');
    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        activeTab === 'LOGIN' 
          ? '로그인' 
          : activeTab === 'SIGNUP' 
          ? '1초 간편 회원가입' 
          : '비회원 주문 & 키오스크 코드 조회'
      }
      
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setActiveTab('LOGIN'); setLookupResults(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('SIGNUP'); setLookupResults(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'SIGNUP'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>회원가입</span>
            <span className="text-[10px] px-1 py-0.2 bg-pink-500/30 text-pink-300 rounded font-semibold">+1,000P</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('GUEST_LOOKUP'); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'GUEST_LOOKUP'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Printer className="w-3 h-3" />
            <span>비회원 조회</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {activeTab === 'LOGIN' && (
          <div className="space-y-4">
            {/* Social 1-Click Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSocialLogin('KAKAO')}
                className="w-full py-3 px-4 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.477 2 10.771c0 2.766 1.83 5.19 4.6 6.55L5.5 21l4.25-2.834c.73.1 1.48.154 2.25.154 5.523 0 10-3.477 10-7.771C22 6.477 17.523 3 12 3z" />
                </svg>
                <span>카카오 1초 로그인</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('NAVER')}
                className="w-full py-3 px-4 rounded-xl bg-[#03C75A] hover:bg-[#02B350] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
              >
                <span className="font-black text-base">N</span>
                <span>네이버로 시작하기</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('GOOGLE')}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google 계정으로 로그인</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800" />
              <span className="flex-shrink mx-3 text-slate-500 text-xs">또는 이메일 로그인</span>
              <div className="flex-grow border-t border-slate-800" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">이메일 주소</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <Button type="submit" className="w-full" >
                이메일로 로그인
              </Button>
            </form>
          </div>
        )}

        {/* TAB 2: SIGNUP */}
        {activeTab === 'SIGNUP' && (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Benefit banner */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 border border-indigo-500/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">첫 가입 웰컴 혜택</span>
                <span className="text-slate-300 text-[11px]">무료 포토카드 1매 쿠폰 + 1,000P 즉시 지급</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">이름 또는 닉네임 *</label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="예: 굿즈마스터"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">이메일 주소 *</label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">휴대폰 번호 (선택 / 알림톡 수신용)</label>
              <input
                type="tel"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>
                  [필수] 만 14세 이상이며, 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full" >
              1초 회원가입 완료하고 혜택받기
            </Button>
          </form>
        )}

        {/* TAB 3: GUEST LOOKUP */}
        {activeTab === 'GUEST_LOOKUP' && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-200 block mb-0.5">비회원 주문 조회 및 코드 재발급</span>
              주문 시 입력하셨던 휴대폰 번호와 간편 비밀번호 4자리를 입력하시면 7자리 키오스크 출력 코드를 바로 확인하실 수 있습니다.
            </div>

            <form onSubmit={handleLookupGuest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">주문자 휴대폰 번호 *</label>
                <input
                  type="tel"
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  placeholder="01012345678 또는 010-1234-5678"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">주문 시 설정한 간편 비밀번호 (숫자 4자리)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={lookupPin}
                  onChange={(e) => setLookupPin(e.target.value)}
                  placeholder="1234 (미설정 시 생략 가능)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono tracking-widest"
                />
              </div>

              <Button type="submit" className="w-full" >
                인쇄 코드 및 주문 내역 조회
              </Button>
            </form>

            {/* Merge Success Alert */}
            {mergeSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 font-semibold text-center animate-fade-in">
                {mergeSuccessMsg}
              </div>
            )}

            {/* Lookup Results */}
            {hasSearched && (
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">
                  조회 결과 ({lookupResults?.length || 0}건)
                </span>

                {lookupResults && lookupResults.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {lookupResults.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-400">{order.orderNumber}</span>
                          <Badge variant={order.printJob?.isPrinted ? 'slate' : 'success'} size="sm">
                            {order.printJob?.isPrinted ? '출력 완료' : '출력 대기중'}
                          </Badge>
                        </div>

                        {order.printJob && (
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 block">키오스크 7자리 인쇄 코드</span>
                              <span className="text-base font-black text-amber-400 font-mono tracking-wider">
                                {order.printJob.printCode}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleCopy(order.printJob?.printCode || '')}
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedCode === order.printJob.printCode ? '복사됨' : '복사'}</span>
                            </Button>
                          </div>
                        )}

                        <div className="text-[11px] text-slate-300 flex items-center justify-between">
                          <span>{order.items[0]?.projectTitle || '웹툰 굿즈'}</span>
                          <span className="font-bold text-white">{order.finalAmount.toLocaleString()}원</span>
                        </div>

                        {/* Convert to Member Button */}
                        <button
                          type="button"
                          onClick={() => handleMergeToMember(order)}
                          className="w-full py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-[11px] font-bold text-indigo-300 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>이 주문을 회원 보관함으로 이관하기</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/50 text-center text-xs text-slate-500">
                    일치하는 비회원 주문 내역이 없습니다. 휴대폰 번호를 다시 확인해 주세요.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
