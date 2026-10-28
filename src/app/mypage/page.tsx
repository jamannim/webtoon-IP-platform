'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  FolderHeart, 
  Package, 
  Printer, 
  Trash2, 
  Palette, 
  ExternalLink, 
  Truck, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  LogIn,
  UserPlus,
  Sparkles,
  Smartphone,
  Lock
} from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';

export default function MyPage() {
  const router = useRouter();
  const { 
    currentUser, 
    isLoggedIn,
    projects, 
    deleteProject, 
    orders, 
    updateOrderStatus,
    findGuestOrders,
    mergeGuestOrdersToUser
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'ORDERS' | 'GUEST_LOOKUP'>('PROJECTS');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'LOGIN' | 'SIGNUP' | 'GUEST_LOOKUP'>('LOGIN');

  // Guest lookup inline state
  const [guestPhoneInput, setGuestPhoneInput] = useState('');
  const [guestPinInput, setGuestPinInput] = useState('');
  const [guestResults, setGuestResults] = useState<typeof orders | null>(null);
  const [mergeAlert, setMergeAlert] = useState<string | null>(null);

  // Refund Modal State
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('단순 변심 또는 재편집 희망');

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // User-filtered projects and orders
  const myProjects = currentUser ? projects.filter((p) => p.userId === currentUser.id) : [];
  const myOrders = currentUser ? orders.filter((o) => o.userId === currentUser.id) : [];

  const handleInlineGuestSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPhoneInput) {
      alert('휴대폰 번호를 입력해 주세요.');
      return;
    }
    const found = findGuestOrders(guestPhoneInput, guestPinInput);
    setGuestResults(found);
  };

  const handleMergeToCurrent = (order: typeof orders[0]) => {
    if (!currentUser) {
      setAuthDefaultTab('SIGNUP');
      setAuthModalOpen(true);
      return;
    }
    mergeGuestOrdersToUser(order.guestPhone || guestPhoneInput, currentUser.id, currentUser.name);
    setMergeAlert('주문 내역이 현재 회원 보관함으로 성공적으로 이관되었습니다!');
    setTimeout(() => setMergeAlert(null), 3000);
  };

  const handleRefundSubmit = () => {
    if (selectedOrderForRefund) {
      updateOrderStatus(selectedOrderForRefund, 'REFUNDED');
      setRefundModalOpen(false);
      setSelectedOrderForRefund(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Not logged in hero card */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-slate-800 p-8 text-center space-y-4 mb-10 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">로그인이 필요한 서비스입니다</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            로그인하시면 나만의 웹툰 포토카드 디자인을 클라우드에 영구 보관하고, 실시간 키오스크 출력 코드를 관리하실 수 있습니다.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => { setAuthDefaultTab('LOGIN'); setAuthModalOpen(true); }}
              className="bg-indigo-600 shadow-indigo-500/30"
            >
              <LogIn className="w-4 h-4" />
              <span>1초 간편 로그인</span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => { setAuthDefaultTab('SIGNUP'); setAuthModalOpen(true); }}
            >
              <UserPlus className="w-4 h-4" />
              <span>회원가입 (+1,000P)</span>
            </Button>
          </div>
        </div>

        {/* Inline Guest Order Lookup Section */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Printer className="w-6 h-6 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-white">비회원 주문 및 인쇄 코드 즉시 조회</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                비회원으로 주문하셨던 휴대폰 번호와 간편 비밀번호 4자리를 입력하세요.
              </p>
            </div>
          </div>

          <form onSubmit={handleInlineGuestSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-400 mb-1">휴대폰 번호 *</label>
              <input
                type="tel"
                value={guestPhoneInput}
                onChange={(e) => setGuestPhoneInput(e.target.value)}
                placeholder="01012345678"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1">간편 비밀번호 (4자리)</label>
              <input
                type="password"
                maxLength={4}
                value={guestPinInput}
                onChange={(e) => setGuestPinInput(e.target.value)}
                placeholder="1234"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono tracking-widest"
              />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" className="w-full">
                조회하기
              </Button>
            </div>
          </form>

          {/* Results */}
          {guestResults !== null && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                조회된 비회원 주문 ({guestResults.length}건)
              </span>

              {guestResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {guestResults.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="space-y-1 text-left w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-400">{order.orderNumber}</span>
                          <Badge variant={order.printJob?.isPrinted ? 'slate' : 'success'}>
                            {order.printJob?.isPrinted ? '출력 완료' : '키오스크 출력 대기중'}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-white">{order.items[0]?.projectTitle || '웹툰 굿즈'}</h4>
                        {order.printJob && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-slate-400">7자리 인쇄 코드:</span>
                            <span className="font-mono text-lg font-black text-amber-400">{order.printJob.printCode}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link href={`/kiosk?code=${order.printJob?.printCode.replace(/[^0-9]/g, '')}`}>
                          <Button size="sm">
                            <Printer className="w-3.5 h-3.5" />
                            <span>키오스크 시뮬레이터</span>
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setAuthDefaultTab('SIGNUP');
                            setAuthModalOpen(true);
                          }}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>회원 이관</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950/50 text-center text-xs text-slate-500">
                  해당 번호로 접수된 비회원 주문 내역이 없습니다.
                </div>
              )}
            </div>
          )}
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authDefaultTab}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* User Profile Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 bg-slate-800 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
              <Badge variant={currentUser.role === 'ADMIN' ? 'warning' : currentUser.role === 'CREATOR' ? 'purple' : 'primary'}>
                {currentUser.role === 'ADMIN' ? '운영 관리자' : currentUser.role === 'CREATOR' ? '웹툰 작가' : '굿즈 팬'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentUser.email}</p>
          </div>
        </div>

        {/* Quick summary numbers */}
        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-8 text-center">
          <div>
            <span className="text-xs text-slate-400 block">저장된 디자인</span>
            <span className="text-xl font-black text-white">{myProjects.length}개</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">주문/출력 건수</span>
            <span className="text-xl font-black text-indigo-400">{myOrders.length}건</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 mb-8">
        <button
          onClick={() => setActiveTab('PROJECTS')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'PROJECTS'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FolderHeart className="w-4 h-4" />
          <span>내 디자인 보관함 ({myProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'ORDERS'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>주문 및 출력 내역 ({myOrders.length})</span>
        </button>
      </div>

      {/* Tab 1: Design Projects */}
      {activeTab === 'PROJECTS' && (
        <div>
          {myProjects.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-16 text-center">
              <FolderHeart className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">저장된 디자인 프로젝트가 없습니다.</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                에디터에서 나만의 캐릭터 포토카드와 엽서를 디자인하고 보관해 보세요.
              </p>
              <Link href="/editor">
                <Button>
                  <Palette className="w-4 h-4" />
                  <span>새 굿즈 디자인하기</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Preview box */}
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 flex items-center justify-center p-3 relative group">
                      {project.previewDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.previewDataUrl}
                          alt={project.title}
                          className="max-h-full max-w-full object-contain rounded drop-shadow-md"
                        />
                      ) : (
                        <Palette className="w-8 h-8 text-slate-700" />
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Link href={`/editor?projectId=${project.id}`}>
                          <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500">
                            이어 편집
                          </button>
                        </Link>
                      </div>
                    </div>

                    <h3 className="font-bold text-white text-base truncate">{project.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      최근 수정: {new Date(project.updatedAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="프로젝트 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <Link href={`/editor?projectId=${project.id}`}>
                        <Button variant="secondary" size="sm">
                          편집하기
                        </Button>
                      </Link>

                      <Link href={`/checkout?projectId=${project.id}`}>
                        <Button size="sm">
                          주문하기
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders & Prints */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-6">
          {myOrders.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-16 text-center">
              <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">주문 내역이 없습니다.</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                에디터에서 완성한 굿즈를 키오스크 출력 또는 택배로 주문해 보세요.
              </p>
              <Link href="/editor">
                <Button>
                  <Palette className="w-4 h-4" />
                  <span>굿즈 제작 시작하기</span>
                </Button>
              </Link>
            </div>
          ) : (
            myOrders.map((order) => {
              const isKiosk = order.fulfillmentType === 'KIOSK';
              const printJob = order.printJob;
              const shipment = order.shipment;

              if (!currentUser) {
    return (
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Not logged in hero card */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-slate-800 p-8 text-center space-y-4 mb-10 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">로그인이 필요한 서비스입니다</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            로그인하시면 나만의 웹툰 포토카드 디자인을 클라우드에 영구 보관하고, 실시간 키오스크 출력 코드를 관리하실 수 있습니다.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => { setAuthDefaultTab('LOGIN'); setAuthModalOpen(true); }}
              className="bg-indigo-600 shadow-indigo-500/30"
            >
              <LogIn className="w-4 h-4" />
              <span>1초 간편 로그인</span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => { setAuthDefaultTab('SIGNUP'); setAuthModalOpen(true); }}
            >
              <UserPlus className="w-4 h-4" />
              <span>회원가입 (+1,000P)</span>
            </Button>
          </div>
        </div>

        {/* Inline Guest Order Lookup Section */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Printer className="w-6 h-6 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-white">비회원 주문 및 인쇄 코드 즉시 조회</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                비회원으로 주문하셨던 휴대폰 번호와 간편 비밀번호 4자리를 입력하세요.
              </p>
            </div>
          </div>

          <form onSubmit={handleInlineGuestSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-400 mb-1">휴대폰 번호 *</label>
              <input
                type="tel"
                value={guestPhoneInput}
                onChange={(e) => setGuestPhoneInput(e.target.value)}
                placeholder="01012345678"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-400 mb-1">간편 비밀번호 (4자리)</label>
              <input
                type="password"
                maxLength={4}
                value={guestPinInput}
                onChange={(e) => setGuestPinInput(e.target.value)}
                placeholder="1234"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono tracking-widest"
              />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" className="w-full">
                조회하기
              </Button>
            </div>
          </form>

          {/* Results */}
          {guestResults !== null && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                조회된 비회원 주문 ({guestResults.length}건)
              </span>

              {guestResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {guestResults.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="space-y-1 text-left w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-400">{order.orderNumber}</span>
                          <Badge variant={order.printJob?.isPrinted ? 'slate' : 'success'}>
                            {order.printJob?.isPrinted ? '출력 완료' : '키오스크 출력 대기중'}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-white">{order.items[0]?.projectTitle || '웹툰 굿즈'}</h4>
                        {order.printJob && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-slate-400">7자리 인쇄 코드:</span>
                            <span className="font-mono text-lg font-black text-amber-400">{order.printJob.printCode}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link href={`/kiosk?code=${order.printJob?.printCode.replace(/[^0-9]/g, '')}`}>
                          <Button size="sm">
                            <Printer className="w-3.5 h-3.5" />
                            <span>키오스크 시뮬레이터</span>
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setAuthDefaultTab('SIGNUP');
                            setAuthModalOpen(true);
                          }}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>회원 이관</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950/50 text-center text-xs text-slate-500">
                  해당 번호로 접수된 비회원 주문 내역이 없습니다.
                </div>
              )}
            </div>
          )}
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authDefaultTab}
        />
      </div>
    );
  }

  return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col md:flex-row items-start justify-between gap-6"
                >
                  {/* Left: Order Info & Thumbnail */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center p-1">
                      {order.items[0]?.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={order.items[0].previewUrl}
                          alt={order.items[0].projectTitle}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-slate-700" />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">{order.orderNumber}</span>
                        <Badge
                          variant={
                            order.status === 'PRINTED' || order.status === 'DELIVERED'
                              ? 'success'
                              : order.status === 'REFUNDED' || order.status === 'CANCELLED'
                              ? 'danger'
                              : 'primary'
                          }
                          size="sm"
                        >
                          {order.status === 'READY_FOR_PICKUP' ? '키오스크 출력 대기' :
                           order.status === 'PRINTED' ? '키오스크 출력 완료' :
                           order.status === 'SHIPPED' ? '택배 배송중' :
                           order.status === 'DELIVERED' ? '배송 완료' :
                           order.status === 'REFUNDED' ? '환불 완료' : '주문 완료'}
                        </Badge>
                      </div>

                      <h3 className="font-bold text-white text-base">
                        {order.items[0]?.projectTitle || '커스텀 굿즈 주문'}
                      </h3>

                      <p className="text-xs text-slate-400">
                        {order.items[0]?.productName} • {order.items[0]?.options.coating} • 수량 {order.itemCount}개
                      </p>

                      <p className="text-xs text-indigo-400 font-semibold pt-1">
                        결제 금액: {order.finalAmount.toLocaleString()}원 ({order.payment?.method === 'TOSSPAY' ? '토스페이' : '카카오페이'})
                      </p>
                    </div>
                  </div>

                  {/* Right: Fulfillment Action / Kiosk Code or Tracking */}
                  <div className="w-full md:w-auto bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col items-center md:items-end justify-center gap-3 shrink-0">
                    {isKiosk && printJob && (
                      <div className="text-center md:text-right space-y-2">
                        <span className="text-[11px] text-slate-400 block font-medium">
                          7자리 무인 키오스크 인쇄 코드
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xl font-black text-indigo-300 tracking-wider bg-slate-900 px-3 py-1 rounded-lg border border-indigo-500/30">
                            {printJob.printCode}
                          </span>
                          <button
                            onClick={() => handleCopyCode(printJob.printCode)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="코드 복사"
                          >
                            {copiedCode === printJob.printCode ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {!printJob.isPrinted && order.status !== 'REFUNDED' && (
                          <div className="pt-1 flex items-center justify-end gap-2">
                            <Link href={`/kiosk?code=${printJob.printCode.replace(/[^0-9]/g, '')}`}>
                              <Button size="sm">
                                <Printer className="w-3.5 h-3.5" />
                                <span>키오스크 시뮬레이터 실행</span>
                              </Button>
                            </Link>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrderForRefund(order.id);
                                setRefundModalOpen(true);
                              }}
                            >
                              취소/환불
                            </Button>
                          </div>
                        )}

                        {printJob.isPrinted && (
                          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>출력 완료 ({new Date(printJob.printedAt!).toLocaleTimeString('ko-KR')})</span>
                          </p>
                        )}
                      </div>
                    )}

                    {!isKiosk && shipment && (
                      <div className="text-center md:text-right space-y-1.5">
                        <span className="text-[11px] text-slate-400 block font-medium">
                          택배 배송 정보 ({shipment.carrier})
                        </span>
                        <p className="font-mono text-sm font-bold text-slate-200">
                          송장: {shipment.trackingNumber || '배송 준비 중'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">
                          {shipment.address} {shipment.detailAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Refund Modal */}
      <Modal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title="주문 취소 및 환불 요청"
        description="출력 전 상태의 주문은 즉시 취소 및 결제 환불 처리가 가능합니다."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">환불 사유 선택</label>
            <select
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            >
              <option value="단순 변심 또는 재편집 희망">단순 변심 또는 재편집 희망</option>
              <option value="출력 매수 또는 옵션 잘못 선택">출력 매수 또는 옵션 잘못 선택</option>
              <option value="근처 키오스크 기기 방문 불가">근처 키오스크 기기 방문 불가</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            ⚠️ 취소 완료 시 발급된 7자리 인쇄 코드는 즉시 무효화되며 키오스크에서 출력할 수 없습니다.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setRefundModalOpen(false)}>
              닫기
            </Button>
            <Button variant="danger" onClick={handleRefundSubmit}>
              환불 확정하기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
