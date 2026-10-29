'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  Printer, 
  TrendingUp, 
  AlertTriangle,
  Send,
  Eye,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Terminal,
  Copy,
  ExternalLink,
  Percent,
  CreditCard,
  MapPin,
  Wrench,
  Users,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Menu,
  X,
  PlusCircle,
  MinusCircle,
  Sparkles,
  Phone,
  Mail,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Plus,
  Star,
  Upload,
  Image as ImageIcon,
  Check,
  FileImage,
  RefreshCw
} from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Modal from '@/components/common/Modal';
import { 
  AuditLog, 
  AuditLogCategory, 
  AuditLogLevel, 
  AuditResolutionStatus,
  User,
  UserStatus,
  SocialProvider,
  WebtoonIP,
  WebtoonGenre,
  WebtoonStatus
} from '@/types';

type AdminTab = 'DASHBOARD' | 'IPS' | 'PRODUCTS' | 'ORDERS' | 'USERS' | 'SETTLEMENT' | 'AUDIT_LOGS';

interface NavGroup {
  groupName: string;
  items: {
    tab: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: 'primary' | 'danger' | 'warning' | 'purple';
  }[];
}

const GENRE_OPTIONS: WebtoonGenre[] = [
  '로맨스 판타지',
  'SF 액션',
  '학원 액션',
  '힐링 일상',
  '무협/판타지',
  '현대 판타지',
  '드라마'
];

const PRESET_THUMBNAILS = [
  { label: '랭커의 귀환', url: '/images/webtoons/ranker-return.webp' },
  { label: '쌍둥이 남매의 뉴라이프', url: '/images/webtoons/twin-siblings.webp' },
  { label: '4000년만에 귀환한 대마도사', url: '/images/webtoons/archmage-4000.webp' },
  { label: '나 혼자만 레벨업', url: '/images/webtoons/solo-leveling.webp' },
  { label: '화산전생', url: '/images/webtoons/volcanic-reincarnation.webp' },
  { label: '결혼 장사', url: '/images/webtoons/marriage-business.png' }
];

// Helper: Resize & convert local image file to data URL
const processImageFile = (file: File, maxWidth = 1000, maxHeight = 1000): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const format = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          resolve(canvas.toDataURL(format, 0.88));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function AdminPage() {
  const { 
    currentUser, 
    switchUser, 
    webtoons, 
    updateWebtoonStatus, 
    addWebtoon,
    updateWebtoon,
    deleteWebtoon,
    orders, 
    updateOrderStatus,
    settlements,
    auditLogs,
    updateAuditLogStatus,
    users,
    updateUserStatus,
    adjustUserPoints,
    products,
    templates
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [mobileSnbOpen, setMobileSnbOpen] = useState(false);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // Webtoon IP Management State
  const [ipModalOpen, setIpModalOpen] = useState(false);
  const [editingIp, setEditingIp] = useState<WebtoonIP | null>(null);
  const [ipSearchQuery, setIpSearchQuery] = useState('');
  const [ipGenreFilter, setIpGenreFilter] = useState<'ALL' | WebtoonGenre>('ALL');
  const [ipStatusFilter, setIpStatusFilter] = useState<'ALL' | WebtoonStatus>('ALL');
  const [ipFeaturedFilter, setIpFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'STANDARD'>('ALL');

  // Webtoon Form State (Multi-Image Support)
  const [ipForm, setIpForm] = useState({
    title: '',
    author: '',
    genre: '로맨스 판타지' as WebtoonGenre,
    description: '',
    summary: '',
    thumbnailUrl: '/images/webtoons/ranker-return.webp', // 슬롯 1: 포스터 (3:4)
    bannerUrl: '/images/webtoons/ranker-return.webp',    // 슬롯 2: 가로 배너 (16:9)
    characterAssetUrl: '',                             // 슬롯 3: 굿즈 캐릭터 컷 (PNG)
    status: 'ACTIVE' as WebtoonStatus,
    officialBadge: true,
    releaseYear: 2026
  });

  const [imageInputMode, setImageInputMode] = useState<'LOCAL_FILE' | 'URL_INPUT'>('LOCAL_FILE');
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const slot1InputRef = useRef<HTMLInputElement>(null);
  const slot2InputRef = useRef<HTMLInputElement>(null);
  const slot3InputRef = useRef<HTMLInputElement>(null);

  // Audit Logs State
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<'ALL' | AuditLogCategory>('ALL');
  const [auditLevelFilter, setAuditLevelFilter] = useState<'ALL' | AuditLogLevel>('ALL');
  const [auditStatusFilter, setAuditStatusFilter] = useState<'ALL' | AuditResolutionStatus>('ALL');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [copiedPayload, setCopiedPayload] = useState(false);

  // User Management State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userProviderFilter, setUserProviderFilter] = useState<'ALL' | SocialProvider>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<'ALL' | UserStatus>('ALL');
  const [pointDiffInput, setPointDiffInput] = useState<number>(1000);

  // Admin Auto-Authentication & URL Tab Router
  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') {
      switchUser('user-admin');
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab')?.toUpperCase();
      const validTabs: AdminTab[] = ['DASHBOARD', 'IPS', 'PRODUCTS', 'ORDERS', 'USERS', 'SETTLEMENT', 'AUDIT_LOGS'];
      if (tabParam && validTabs.includes(tabParam as AdminTab)) {
        setActiveTab(tabParam as AdminTab);
      }
    }
  }, [currentUser, switchUser]);

  const effectiveAdminName = currentUser?.role === 'ADMIN' ? currentUser.name : '김총괄 (관리자 자동인증)';

  // Summary Metrics
  const kioskOrders = orders.filter((o) => o.fulfillmentType === 'KIOSK');
  const printedOrders = kioskOrders.filter((o) => o.printJob?.isPrinted);

  // Settlement Aggregations
  const totalGrossSettlement = settlements.reduce((acc, s) => acc + s.totalRevenue, 0);
  const totalPgFeeSettlement = settlements.reduce((acc, s) => acc + s.pgFeeAmount, 0);
  const totalNetRevenueSettlement = settlements.reduce((acc, s) => acc + s.netRevenue, 0);
  const totalRoyaltySettlement = settlements.reduce((acc, s) => acc + s.royaltyAmount, 0);
  const platformProfitSettlement = totalNetRevenueSettlement - totalRoyaltySettlement;

  // Filtered Webtoons (메인 노출 필터 포함)
  const filteredWebtoons = useMemo(() => {
    return webtoons.filter((w) => {
      if (ipGenreFilter !== 'ALL' && w.genre !== ipGenreFilter) return false;
      if (ipStatusFilter !== 'ALL' && w.status !== ipStatusFilter) return false;
      if (ipFeaturedFilter === 'FEATURED' && !w.featured) return false;
      if (ipFeaturedFilter === 'STANDARD' && w.featured) return false;
      if (ipSearchQuery.trim()) {
        const q = ipSearchQuery.toLowerCase();
        const matchTitle = w.title.toLowerCase().includes(q);
        const matchAuthor = w.author.toLowerCase().includes(q);
        const matchDesc = w.description.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchDesc) return false;
      }
      return true;
    });
  }, [webtoons, ipGenreFilter, ipStatusFilter, ipFeaturedFilter, ipSearchQuery]);

  const featuredWebtoonsCount = webtoons.filter(w => w.featured).length;

  // Filtered Audit Logs
  const actionRequiredCount = auditLogs.filter(l => l.resolutionStatus === 'ACTION_REQUIRED').length;
  const criticalErrorCount = auditLogs.filter(l => l.level === 'CRITICAL' || l.level === 'ERROR').length;

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (auditCategoryFilter !== 'ALL' && log.category !== auditCategoryFilter) return false;
      if (auditLevelFilter !== 'ALL' && log.level !== auditLevelFilter) return false;
      if (auditStatusFilter !== 'ALL' && log.resolutionStatus !== auditStatusFilter) return false;
      if (auditSearchQuery.trim()) {
        const query = auditSearchQuery.toLowerCase();
        const matchSummary = log.summary.toLowerCase().includes(query);
        const matchAction = log.actionCode.toLowerCase().includes(query);
        const matchActor = log.actor.name.toLowerCase().includes(query);
        const matchKiosk = log.details.kioskId?.toLowerCase().includes(query) || log.details.kioskLocation?.toLowerCase().includes(query);
        const matchError = log.details.errorCode?.toLowerCase().includes(query);
        const matchTarget = log.target?.name?.toLowerCase().includes(query) || log.target?.id.toLowerCase().includes(query);
        if (!matchSummary && !matchAction && !matchActor && !matchKiosk && !matchError && !matchTarget) {
          return false;
        }
      }
      return true;
    });
  }, [auditLogs, auditCategoryFilter, auditLevelFilter, auditStatusFilter, auditSearchQuery]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (userProviderFilter !== 'ALL' && u.provider !== userProviderFilter) return false;
      if (userStatusFilter !== 'ALL' && u.status !== userStatusFilter) return false;
      if (userSearchQuery.trim()) {
        const q = userSearchQuery.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchPhone = u.phone?.includes(q);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }
      return true;
    });
  }, [users, userProviderFilter, userStatusFilter, userSearchQuery]);

  const activeUsersCount = users.filter(u => u.status === 'ACTIVE').length;
  const totalUserPoints = users.reduce((acc, u) => acc + (u.points || 0), 0);

  // 1. 메인 노출 토글 핸들러 (리스트 상에서 바로 원클릭 토글!)
  const handleToggleFeatured = (ip: WebtoonIP) => {
    const nextFeatured = !ip.featured;
    updateWebtoon(ip.id, { featured: nextFeatured });
  };

  // 2. 다중 이미지(2~3장) 일괄 업로드 처리 핸들러
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);
    try {
      const fileList = Array.from(files).slice(0, 3);
      const convertedUrls: string[] = [];

      for (const f of fileList) {
        const url = await processImageFile(f);
        convertedUrls.push(url);
      }

      // Slot 1: Thumbnail (1st file)
      const slot1 = convertedUrls[0] || ipForm.thumbnailUrl;
      // Slot 2: Banner (2nd file or 1st file)
      const slot2 = convertedUrls[1] || convertedUrls[0] || ipForm.bannerUrl;
      // Slot 3: Character/Asset (3rd file)
      const slot3 = convertedUrls[2] || ipForm.characterAssetUrl || '';

      setIpForm(prev => ({
        ...prev,
        thumbnailUrl: slot1,
        bannerUrl: slot2,
        characterAssetUrl: slot3
      }));

      alert(`선택하신 ${fileList.length}개의 이미지 파일(JPG/PNG)이 포스터/배너/캐릭터 슬롯에 일괄 배정되었습니다.`);
    } catch (err) {
      alert('이미지 파일 변환 중 오류가 발생했습니다.');
    } finally {
      setIsProcessingFiles(false);
      if (e.target) e.target.value = '';
    }
  };

  // 개별 슬롯 파일 업로드
  const handleSingleSlotUpload = async (slot: 1 | 2 | 3, file: File) => {
    try {
      const url = await processImageFile(file);
      if (slot === 1) {
        setIpForm(prev => ({ ...prev, thumbnailUrl: url }));
      } else if (slot === 2) {
        setIpForm(prev => ({ ...prev, bannerUrl: url }));
      } else {
        setIpForm(prev => ({ ...prev, characterAssetUrl: url }));
      }
    } catch {
      alert('파일 처리 중 오류가 발생했습니다.');
    }
  };

  // Webtoon IP Handlers (등록, 수정, 삭제)
  const openNewIpModal = () => {
    setEditingIp(null);
    setIpForm({
      title: '',
      author: '',
      genre: '로맨스 판타지',
      description: '',
      summary: '',
      thumbnailUrl: '/images/webtoons/ranker-return.webp',
      bannerUrl: '/images/webtoons/ranker-return.webp',
      characterAssetUrl: '',
      status: 'ACTIVE',
      officialBadge: true,
        releaseYear: 2026
    });
    setImageInputMode('LOCAL_FILE');
    setIpModalOpen(true);
  };

  const openEditIpModal = (ip: WebtoonIP) => {
    setEditingIp(ip);
    setIpForm({
      title: ip.title,
      author: ip.author,
      genre: ip.genre,
      description: ip.description,
      summary: ip.summary,
      thumbnailUrl: ip.thumbnailUrl,
      bannerUrl: ip.bannerUrl,
      characterAssetUrl: ip.characterAssetUrl || '',
      status: ip.status,
      officialBadge: ip.officialBadge,
      releaseYear: ip.releaseYear
    });
    setImageInputMode('LOCAL_FILE');
    setIpModalOpen(true);
  };

  const handleSaveIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipForm.title.trim()) {
      alert('작품명을 입력해 주세요.');
      return;
    }
    if (!ipForm.author.trim()) {
      alert('작가명을 입력해 주세요.');
      return;
    }

    if (editingIp) {
      updateWebtoon(editingIp.id, {
        ...ipForm,
        featured: editingIp.featured // 유지
      });
      alert(`[${ipForm.title}] 웹툰 IP 라이선스 정보가 성공적으로 수정되었습니다.`);
    } else {
      const newId = `ip-${Date.now()}`;
      const newIp: WebtoonIP = {
        id: newId,
        ...ipForm,
        featured: false, // 기본값 false, 리스트에서 바로 원클릭 ON 가능!
        likesCount: 0
      };
      addWebtoon(newIp);
      alert(`[${ipForm.title}] 신규 웹툰 IP 라이선스가 등록되었습니다.\n목록에서 바로 [⭐ 메인노출] 스위치를 켤 수 있습니다.`);
    }

    setIpModalOpen(false);
  };

  const handleDeleteIp = (ip: WebtoonIP) => {
    if (confirm(`정말 [${ip.title}] 웹툰 IP 라이선스를 삭제하시겠습니까?\n삭제 시 스토어 및 에디터에서 해당 IP가 즉시 제외됩니다.`)) {
      deleteWebtoon(ip.id);
      alert(`[${ip.title}] 웹툰 IP 라이선스가 삭제되었습니다.`);
    }
  };

  const handleTrackingUpdate = (orderId: string) => {
    const tracking = trackingInputs[orderId];
    if (!tracking) {
      alert('운송장 번호를 입력해 주세요.');
      return;
    }
    updateOrderStatus(orderId, 'SHIPPED', tracking);
    alert('송장 번호가 등록되고 발송 완료 처리되었습니다.');
  };

  const copyPayloadJson = (payload: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleResolveLog = (logId: string, status: AuditResolutionStatus) => {
    updateAuditLogStatus(logId, status);
    if (selectedLog && selectedLog.id === logId) {
      setSelectedLog({
        ...selectedLog,
        resolutionStatus: status,
        details: {
          ...selectedLog.details,
          resolvedAt: new Date().toISOString(),
          resolvedBy: `${currentUser?.name || '김총괄'} (ADMIN)`
        }
      });
    }
  };

  const handleAdjustPoints = (userId: string, diff: number) => {
    adjustUserPoints(userId, diff, '관리자 수동 지급/차감');
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({
        ...selectedUser,
        points: Math.max(0, (selectedUser.points || 0) + diff)
      });
    }
  };

  const handleToggleUserStatus = (userId: string, currentStatus: UserStatus = 'ACTIVE') => {
    const nextStatus: UserStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updateUserStatus(userId, nextStatus);
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({
        ...selectedUser,
        status: nextStatus
      });
    }
  };

  // Structured SNB Navigation Groups
  const navGroups: NavGroup[] = [
    {
      groupName: '플랫폼 개요',
      items: [
        { tab: 'DASHBOARD', label: '종합 대시보드', icon: LayoutDashboard }
      ]
    },
    {
      groupName: '카탈로그 & IP',
      items: [
        { tab: 'IPS', label: '웹툰 IP 등록·관리', icon: Layers, badge: webtoons.length, badgeColor: 'purple' },
        { tab: 'PRODUCTS', label: '상품 & 템플릿', icon: Package, badge: products.length, badgeColor: 'primary' }
      ]
    },
    {
      groupName: '주문 & 물류',
      items: [
        { tab: 'ORDERS', label: '주문·출력·배송', icon: ShoppingCart, badge: orders.length, badgeColor: 'primary' }
      ]
    },
    {
      groupName: '회원 & 고객 (신규)',
      items: [
        { tab: 'USERS', label: '회원 관리', icon: Users, badge: users.length, badgeColor: 'primary' }
      ]
    },
    {
      groupName: '정산 & 회계',
      items: [
        { tab: 'SETTLEMENT', label: 'IP 로열티 정산 (PG수수료)', icon: CreditCard }
      ]
    },
    {
      groupName: '운영 & 보안',
      items: [
        { 
          tab: 'AUDIT_LOGS', 
          label: '운영 감사로그', 
          icon: Terminal, 
          badge: actionRequiredCount > 0 ? `${actionRequiredCount}건 조치` : undefined, 
          badgeColor: 'danger' 
        }
      ]
    }
  ];

  return (
    <div className="flex-1 w-full flex flex-col lg:flex-row bg-slate-950 min-h-[calc(100vh-4rem)]">
      {/* Mobile SNB Toggle Header */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span className="font-black text-sm text-white">TOON CANVAS BACKOFFICE</span>
        </div>
        <button
          onClick={() => setMobileSnbOpen(!mobileSnbOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileSnbOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* LEFT SNB (Side Navigation Bar) */}
      <aside 
        className={`w-full lg:w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 flex flex-col shrink-0 ${
          mobileSnbOpen ? 'block' : 'hidden lg:flex'
        }`}
      >
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider leading-none">
                BACKOFFICE SYSTEM
              </div>
              <h2 className="text-sm font-black text-white mt-0.5">운영 관리 센터</h2>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="truncate">{effectiveAdminName}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.groupName} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                {group.groupName}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setMobileSnbOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        item.badgeColor === 'danger'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : item.badgeColor === 'purple'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full text-xs justify-center"
            onClick={() => switchUser('user-1')}
          >
            <span>일반 팬 모드로 전환</span>
          </Button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT VIEW */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-black text-white">종합 통계 대시보드</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  TOON CANVAS 플랫폼의 실시간 매출, 출력, 회원, 라이선스 핵심 지표입니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>누적 총 결제액 (Gross)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {totalGrossSettlement.toLocaleString()}원
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  PG 수수료 3.3% 차감 전 총액
                </span>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>키오스크 즉시 출력률</span>
                  <Printer className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {kioskOrders.length > 0
                    ? `${Math.round((printedOrders.length / kioskOrders.length) * 100)}%`
                    : '100%'}
                </div>
                <span className="text-[11px] text-indigo-400 font-semibold">
                  전국 8,420개 키오스크 실시간 가동
                </span>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>누적 가입 회원</span>
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {users.length}명
                </div>
                <span className="text-[11px] text-sky-400 font-semibold">
                  활성 계정 {activeUsersCount}명 (정상 가동)
                </span>
              </div>

              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>작가 로열티 정산 예정액</span>
                  <TrendingUp className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-black text-white">
                  {totalRoyaltySettlement.toLocaleString()}원
                </div>
                <span className="text-[11px] text-pink-400 font-semibold">
                  순매출(Net) 기준 평균 16.5%
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">최근 플랫폼 운영 감사 로그</h3>
                </div>
                <button
                  onClick={() => setActiveTab('AUDIT_LOGS')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <span>전체 감사로그 보기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3 text-xs">
                {auditLogs.slice(0, 4).map((log) => (
                  <div 
                    key={log.id} 
                    onClick={() => { setSelectedLog(log); }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={
                          log.level === 'CRITICAL' || log.level === 'ERROR' 
                            ? 'danger' 
                            : log.level === 'WARN' 
                            ? 'warning' 
                            : 'primary'
                        } 
                        size="sm"
                      >
                        {log.level}
                      </Badge>
                      <span className="text-slate-300 font-medium line-clamp-1">{log.summary}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-slate-500 font-mono text-[11px]">
                      <span>{log.actor.name}</span>
                      <span>•</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString('ko-KR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WEBTOON IP & LICENSE (웹툰 IP 등록·관리 - 메인노출 리스트 이동 및 멀티 파일 업로드 적용) */}
        {activeTab === 'IPS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-black text-white">웹툰 IP 공식 라이선스 등록·관리</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  내 컴퓨터 이미지 파일(JPG/PNG) 수동 업로드 및 메인 추천 노출 여부를 목록에서 직접 제어합니다.
                </p>
              </div>
              <Button onClick={openNewIpModal}>
                <Plus className="w-4 h-4" />
                <span>신규 웹툰 IP 등록</span>
              </Button>
            </div>

            {/* Filter Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="작품명, 작가명, 줄거리 검색..."
                  value={ipSearchQuery}
                  onChange={(e) => setIpSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* 메인 노출 필터 추가 */}
              <select
                value={ipFeaturedFilter}
                onChange={(e) => setIpFeaturedFilter(e.target.value as 'ALL' | 'FEATURED' | 'STANDARD')}
                className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-pink-300 font-bold focus:outline-none focus:border-pink-500"
              >
                <option value="ALL">전체 노출상태</option>
                <option value="FEATURED">⭐ 메인 노출작만 보기 ({featuredWebtoonsCount}개)</option>
                <option value="STANDARD">일반 목록작 ({webtoons.length - featuredWebtoonsCount}개)</option>
              </select>

              <select
                value={ipGenreFilter}
                onChange={(e) => setIpGenreFilter(e.target.value as 'ALL' | WebtoonGenre)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">전체 장르</option>
                {GENRE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <select
                value={ipStatusFilter}
                onChange={(e) => setIpStatusFilter(e.target.value as 'ALL' | WebtoonStatus)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">전체 서비스 상태</option>
                <option value="ACTIVE">제작 활성 (ACTIVE)</option>
                <option value="EXPIRED">비활성 (EXPIRED)</option>
              </select>
            </div>

            {/* IP Count Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 px-1 gap-2">
              <div>
                총 <strong className="text-white">{filteredWebtoons.length}</strong>개 IP 중{' '}
                <span className="text-pink-400 font-bold">스토어 메인 추천작 {featuredWebtoonsCount}개</span> 실시간 노출 중
              </div>
              <span className="text-[11px] text-indigo-400">
                💡 목록의 [⭐ 메인노출] 스위치를 누르면 즉시 스토어 메인에 반영됩니다.
              </span>
            </div>

            {/* IP List (메인노출 컨트롤 배치) */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden divide-y divide-slate-800">
              {filteredWebtoons.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs">
                  조건에 일치하는 웹툰 IP가 없습니다. 상단에서 [신규 웹툰 IP 등록]을 진행해 보세요.
                </div>
              ) : (
                filteredWebtoons.map((ip) => (
                  <div key={ip.id} className="p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-20 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ip.thumbnailUrl} alt={ip.title} className="w-full h-full object-cover" />
                        {ip.featured && (
                          <div className="absolute top-1 right-1 p-0.5 rounded bg-pink-600/90 text-white shadow">
                            <Star className="w-3 h-3 fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{ip.title}</h4>
                          <Badge variant="purple" size="sm">{ip.genre}</Badge>
                          <Badge variant={ip.status === 'ACTIVE' ? 'success' : 'slate'} size="sm">
                            {ip.status === 'ACTIVE' ? '제작 활성' : '비활성'}
                          </Badge>
                          {ip.officialBadge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                              공식인증
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          작가: {ip.author} • 출시: {ip.releaseYear}년 • 관심: {ip.likesCount.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xl">
                          {ip.summary || ip.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions: 메인노출 스위치 + 일시정지 + 수정 + 삭제 + 스토어 */}
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end shrink-0">
                      {/* 요청 1: 메인노출 기능 리스트 이동 구현 */}
                      <button
                        onClick={() => handleToggleFeatured(ip)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          ip.featured
                            ? 'bg-pink-500/25 text-pink-300 border border-pink-500/40 hover:bg-pink-500/35 shadow-sm shadow-pink-500/20'
                            : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-800'
                        }`}
                        title="클릭 시 스토어 메인 추천작(Featured) 노출을 즉시 전환합니다"
                      >
                        <Star className={`w-3.5 h-3.5 ${ip.featured ? 'fill-pink-400 text-pink-400' : 'text-slate-500'}`} />
                        <span>{ip.featured ? '메인노출 ON' : '메인노출 OFF'}</span>
                      </button>

                      <button
                        onClick={() =>
                          updateWebtoonStatus(ip.id, ip.status === 'ACTIVE' ? 'EXPIRED' : 'ACTIVE')
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          ip.status === 'ACTIVE'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                        }`}
                      >
                        {ip.status === 'ACTIVE' ? '일시정지' : '활성화'}
                      </button>

                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => openEditIpModal(ip)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>수정</span>
                      </Button>

                      <button
                        onClick={() => handleDeleteIp(ip)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>삭제</span>
                      </button>

                      <Link href={`/store/${ip.id}`}>
                        <Button variant="secondary" size="sm">
                          <Eye className="w-3.5 h-3.5" />
                          <span>스토어</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & TEMPLATES */}
        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-black text-white">상품 규격 & 에디터 템플릿 관리</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  55x85mm 전용 포토카드 규격, 블리드 여백(2mm), 다이컷(R4) 템플릿 사양을 관리합니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-400 font-bold">{prod.id}</span>
                    <Badge variant="purple" size="sm">키오스크 즉시 출력 지원</Badge>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{prod.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{prod.description}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1 font-mono text-slate-300">
                    <div>규격: {prod.widthMm} x {prod.heightMm} mm ({prod.dpi} DPI)</div>
                    <div>안전 여백: {prod.safeMarginMm} mm • 재단 도련: {prod.bleedMm} mm</div>
                    <div>용지 권장: {prod.specs.paperRecommendation}</div>
                    <div className="text-pink-400 font-bold">기본 판매단가: {prod.basePrice.toLocaleString()}원</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">등록된 공식 디자인 템플릿 ({templates.length}건)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {templates.map((tpl) => (
                  <div key={tpl.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="aspect-[55/85] rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tpl.previewUrl} alt={tpl.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{tpl.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">기본 요소 {tpl.defaultElements.length}개</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & LOGISTICS */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-black text-white">주문·출력·배송 통합 관리</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  키오스크 7자리 인쇄코드 상태 및 택배 운송장 등록을 처리합니다.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden divide-y divide-slate-800">
              {orders.map((order) => (
                <div key={order.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{order.orderNumber}</span>
                      <Badge variant="primary" size="sm">
                        {order.fulfillmentType === 'KIOSK' ? '키오스크 출력' : '택배 배송'}
                      </Badge>
                      <Badge
                        variant={order.status === 'PRINTED' || order.status === 'DELIVERED' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {order.status}
                      </Badge>
                      {order.isGuest && (
                        <Badge variant="slate" size="sm">비회원 주문</Badge>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {order.items[0]?.projectTitle} ({order.userName})
                    </h4>
                    <p className="text-xs text-slate-400">
                      수량: {order.itemCount}개 • 결제액: {order.finalAmount.toLocaleString()}원 •{' '}
                      {new Date(order.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>

                  <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-end">
                    {order.fulfillmentType === 'DELIVERY' && order.shipment && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          placeholder="운송장 번호 입력"
                          value={trackingInputs[order.id] ?? order.shipment.trackingNumber ?? ''}
                          onChange={(e) =>
                            setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })
                          }
                          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleTrackingUpdate(order.id)}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>송장등록</span>
                        </Button>
                      </div>
                    )}

                    {order.fulfillmentType === 'KIOSK' && order.printJob && (
                      <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                        코드: <span className="text-indigo-400 font-bold">{order.printJob.printCode}</span>{' '}
                        {order.printJob.isPrinted ? '(출력완료)' : '(출력대기)'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: USER MANAGEMENT */}
        {activeTab === 'USERS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-black text-white">회원 및 계정 관리</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  소셜 간편가입, 일반 회원, 포인트 잔액 및 비회원 주문 이관 내역을 통합 관리합니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">총 등록 회원</span>
                <div className="text-xl font-black text-white">{users.length}명</div>
                <span className="text-[11px] text-slate-500">플랫폼 전체 계정</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">정상 활동 회원</span>
                <div className="text-xl font-black text-emerald-400">{activeUsersCount}명</div>
                <span className="text-[11px] text-emerald-400/80">정지 계정: {users.length - activeUsersCount}명</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">소셜 간편가입 비중</span>
                <div className="text-xl font-black text-amber-400">
                  {Math.round((users.filter(u => u.provider !== 'EMAIL').length / users.length) * 100)}%
                </div>
                <span className="text-[11px] text-amber-400/80">카카오 / 네이버 / 구글</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400">회원 보유 포인트 합계</span>
                <div className="text-xl font-black text-indigo-400">{totalUserPoints.toLocaleString()}P</div>
                <span className="text-[11px] text-slate-500">가입축하 및 결제적립</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="회원 이름, 이메일, 전화번호 검색..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={userProviderFilter}
                onChange={(e) => setUserProviderFilter(e.target.value as 'ALL' | SocialProvider)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">전체 가입경로</option>
                <option value="KAKAO">카카오 (KAKAO)</option>
                <option value="NAVER">네이버 (NAVER)</option>
                <option value="GOOGLE">구글 (GOOGLE)</option>
                <option value="EMAIL">이메일 일반</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value as 'ALL' | UserStatus)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">전체 계정상태</option>
                <option value="ACTIVE">정상 (ACTIVE)</option>
                <option value="SUSPENDED">이용 정지 (SUSPENDED)</option>
              </select>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">회원 정보</th>
                      <th className="p-4">가입 방식</th>
                      <th className="p-4">보유 포인트</th>
                      <th className="p-4">주문 건수</th>
                      <th className="p-4">누적 결제액</th>
                      <th className="p-4">상태</th>
                      <th className="p-4">가입 일자</th>
                      <th className="p-4 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredUsers.map((u) => {
                      const isSuspended = u.status === 'SUSPENDED';
                      return (
                        <tr 
                          key={u.id} 
                          className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                          onClick={() => setSelectedUser(u)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full border border-slate-700 shrink-0" />
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {u.role === 'ADMIN' && (
                                    <Badge variant="warning" size="sm">관리자</Badge>
                                  )}
                                  {u.role === 'CREATOR' && (
                                    <Badge variant="purple" size="sm">작가</Badge>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.provider === 'KAKAO' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                              u.provider === 'NAVER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              u.provider === 'GOOGLE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {u.provider || 'EMAIL'}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-indigo-400">
                            {(u.points || 0).toLocaleString()}P
                          </td>
                          <td className="p-4 font-mono">{u.totalOrdersCount || 0}건</td>
                          <td className="p-4 font-mono font-bold text-white">
                            {(u.totalSpendAmount || 0).toLocaleString()}원
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <Badge variant={isSuspended ? 'danger' : 'success'} size="sm">
                              {isSuspended ? '이용 정지' : '정상'}
                            </Badge>
                          </td>
                          <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString('ko-KR')}
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(u);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>상세 관리</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTLEMENT DASHBOARD */}
        {activeTab === 'SETTLEMENT' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-black text-white">웹툰 IP별 판매량 및 로열티 정산 현황</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  PG 결제대행 수수료(3.3%)를 투명하게 원천 공제 후 순매출(Net) 기준으로 작가 로열티를 산출합니다.
                </p>
              </div>
              <Button size="sm" onClick={() => alert('2026년 10월 정산 원장(CSV) 다운로드가 시작되었습니다.')}>
                <FileText className="w-3.5 h-3.5" />
                <span>정산 내역 다운로드 (CSV)</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span>총 누적 결제액 (Gross)</span>
                </span>
                <div className="text-xl font-black text-white">
                  {totalGrossSettlement.toLocaleString()}원
                </div>
                <span className="text-[11px] text-slate-500 font-medium">전체 웹툰 IP 합산</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-amber-400" />
                  <span>PG사 결제 수수료 합계</span>
                </span>
                <div className="text-xl font-black text-amber-400">
                  {totalPgFeeSettlement.toLocaleString()}원
                </div>
                <span className="text-[11px] text-amber-400/80 font-medium">기본 계약 수수료율 3.3% 적용</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>수수료 차감 순매출 (Net)</span>
                </span>
                <div className="text-xl font-black text-emerald-400">
                  {totalNetRevenueSettlement.toLocaleString()}원
                </div>
                <span className="text-[11px] text-slate-400 font-medium">로열티 산출 기준 금액</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-pink-400" />
                  <span>원작사/작가 로열티 총액</span>
                </span>
                <div className="text-xl font-black text-pink-400">
                  {totalRoyaltySettlement.toLocaleString()}원
                </div>
                <span className="text-[11px] text-pink-400/80 font-medium">
                  플랫폼 잔여 순마진: {platformProfitSettlement.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                  <Info className="w-5 h-5" />
                </span>
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-white">공식 로열티 정산 산출 공식:</span>
                  <span className="text-indigo-200 ml-1.5">
                    [총 매출액] - [PG사 수수료 (3.3%)] = <strong className="text-white">[순매출액]</strong> ➔ [순매출액] × [계약 로열티율 (%)] = <strong className="text-pink-300">[최종 지급 로열티]</strong>
                  </span>
                </div>
              </div>
              <Badge variant="purple" size="sm" className="shrink-0 hidden md:inline-flex">
                투명 정산 계약 체결
              </Badge>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">정산 대상 웹툰 IP</th>
                      <th className="p-4">정산 기간</th>
                      <th className="p-4">판매량 (건수)</th>
                      <th className="p-4">총 매출액</th>
                      <th className="p-4 text-amber-400 bg-amber-500/5">PG사 수수료 (3.3%)</th>
                      <th className="p-4 text-emerald-400 bg-emerald-500/5">차감 후 순매출</th>
                      <th className="p-4">계약 로열티율</th>
                      <th className="p-4 font-black text-pink-400">지급 로열티 금액</th>
                      <th className="p-4">정산 상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {settlements.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-white">{s.ipTitle}</td>
                        <td className="p-4 font-mono text-slate-400">{s.period}</td>
                        <td className="p-4">{s.totalOrders.toLocaleString()}건</td>
                        <td className="p-4 font-mono">{s.totalRevenue.toLocaleString()}원</td>
                        <td className="p-4 font-mono text-amber-300 bg-amber-500/5">
                          <div className="font-bold">{(s.pgFeeRate * 100).toFixed(1)}%</div>
                          <div className="text-[11px] text-slate-400">({s.pgFeeAmount.toLocaleString()}원)</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400 bg-emerald-500/5">
                          {s.netRevenue.toLocaleString()}원
                        </td>
                        <td className="p-4 text-indigo-400 font-bold">
                          {(s.royaltyRate * 100).toFixed(0)}%
                          <span className="block text-[10px] text-slate-400 font-normal">순매출 기준</span>
                        </td>
                        <td className="p-4 font-mono font-black text-pink-400 text-sm">
                          {s.royaltyAmount.toLocaleString()}원
                        </td>
                        <td className="p-4">
                          <Badge variant={s.status === 'CONFIRMED' ? 'success' : 'warning'} size="sm">
                            {s.status === 'CONFIRMED' ? '정산 확정' : '정산 대기'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {activeTab === 'AUDIT_LOGS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-black text-white">운영 감사로그 (Audit Logs)</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  단말기 하드웨어 장애, 결제 승인 실패, 보안 차단 등 전사 시스템 이벤트를 실시간 모니터링합니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">전체 감사로그</span>
                  <div className="text-xl font-black text-white mt-0.5">{auditLogs.length}건</div>
                </div>
                <span className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Terminal className="w-5 h-5" />
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">현장 조치 필요</span>
                  <div className="text-xl font-black text-rose-400 mt-0.5">{actionRequiredCount}건</div>
                </div>
                <span className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">심각 장애/오류</span>
                  <div className="text-xl font-black text-amber-400 mt-0.5">{criticalErrorCount}건</div>
                </div>
                <span className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 shrink-0 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> 카테고리:
                </span>
                {[
                  { key: 'ALL', label: '전체 로그' },
                  { key: 'KIOSK', label: '키오스크 출력' },
                  { key: 'PAYMENT', label: '결제·정산' },
                  { key: 'LICENSE', label: 'IP·라이선스' },
                  { key: 'AUTH', label: '보안·인증' },
                  { key: 'SYSTEM', label: '시스템 배치' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setAuditCategoryFilter(cat.key as 'ALL' | AuditLogCategory)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      auditCategoryFilter === cat.key
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-800">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="오류 코드, 지점명, 주문번호, IP 주소 검색..."
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={auditLevelFilter}
                  onChange={(e) => setAuditLevelFilter(e.target.value as 'ALL' | AuditLogLevel)}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">전체 심각도</option>
                  <option value="CRITICAL">치명적 (CRITICAL)</option>
                  <option value="ERROR">오류 (ERROR)</option>
                  <option value="WARN">경고 (WARN)</option>
                  <option value="INFO">정보 (INFO)</option>
                </select>

                <select
                  value={auditStatusFilter}
                  onChange={(e) => setAuditStatusFilter(e.target.value as 'ALL' | AuditResolutionStatus)}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">전체 조치상태</option>
                  <option value="ACTION_REQUIRED">조치 필요</option>
                  <option value="INVESTIGATING">조사 중</option>
                  <option value="RESOLVED">해결 완료</option>
                  <option value="AUTO_RECOVERED">자동 복구</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">발생 시각</th>
                      <th className="p-4">심각도</th>
                      <th className="p-4">카테고리</th>
                      <th className="p-4">이벤트 요약</th>
                      <th className="p-4">발생 주체 / 단말</th>
                      <th className="p-4">조치 상태</th>
                      <th className="p-4 text-right">세부 이슈</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredAuditLogs.map((log) => {
                      const levelVariant = 
                        log.level === 'CRITICAL' || log.level === 'ERROR'
                          ? 'danger'
                          : log.level === 'WARN'
                          ? 'warning'
                          : 'primary';

                      const statusVariant =
                        log.resolutionStatus === 'RESOLVED' || log.resolutionStatus === 'AUTO_RECOVERED'
                          ? 'success'
                          : log.resolutionStatus === 'INVESTIGATING'
                          ? 'warning'
                          : 'danger';

                      return (
                        <tr 
                          key={log.id} 
                          className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                          onClick={() => setSelectedLog(log)}
                        >
                          <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                            <div>{new Date(log.timestamp).toLocaleTimeString('ko-KR')}</div>
                            <div className="text-[10px] text-slate-500">
                              {new Date(log.timestamp).toLocaleDateString('ko-KR')}
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <Badge variant={levelVariant} size="sm">
                              {log.level}
                            </Badge>
                          </td>
                          <td className="p-4 whitespace-nowrap font-semibold text-slate-300">
                            {log.category}
                          </td>
                          <td className="p-4 max-w-md">
                            <div className="font-bold text-white line-clamp-1">{log.summary}</div>
                            <div className="font-mono text-[10px] text-indigo-400/80">{log.actionCode}</div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="text-white font-medium">{log.actor.name}</div>
                            {log.actor.ipAddress && (
                              <div className="font-mono text-[10px] text-slate-500">{log.actor.ipAddress}</div>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <Badge variant={statusVariant} size="sm">
                              {log.resolutionStatus === 'ACTION_REQUIRED' ? '조치 필요' :
                               log.resolutionStatus === 'INVESTIGATING' ? '조사 중' :
                               log.resolutionStatus === 'AUTO_RECOVERED' ? '자동 복구' : '해결 완료'}
                            </Badge>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLog(log);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>상세보기</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: WEBTOON IP FORM MODAL (멀티 파일 업로드 2~3종 지원) */}
      {ipModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIpModalOpen(false)}
          title={editingIp ? `웹툰 IP 라이선스 정보 수정 - [${editingIp.title}]` : '신규 웹툰 IP 라이선스 정식 등록'}
          description="내 컴퓨터의 JPG, PNG 이미지를 규격에 맞게 수동 등록하거나 다중 일괄 등록할 수 있습니다."
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveIp} className="space-y-5 text-xs text-slate-300">
            {/* 기본 텍스트 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  작품명 (Title) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 나 혼자만 레벨업"
                  value={ipForm.title}
                  onChange={(e) => setIpForm({ ...ipForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  작가명 (Author) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 추공 / 장성락"
                  value={ipForm.author}
                  onChange={(e) => setIpForm({ ...ipForm, author: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  대표 장르 (Genre)
                </label>
                <select
                  value={ipForm.genre}
                  onChange={(e) => setIpForm({ ...ipForm, genre: e.target.value as WebtoonGenre })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  {GENRE_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  출시/계약 연도
                </label>
                <input
                  type="number"
                  min="2010"
                  max="2030"
                  value={ipForm.releaseYear}
                  onChange={(e) => setIpForm({ ...ipForm, releaseYear: Number(e.target.value) || 2026 })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

            </div>

            {/* 이미지 등록 모드 선택 & 멀티 업로드 컨트롤 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white text-xs">웹툰 IP 이미지 에셋 등록 (2~3종)</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('LOCAL_FILE')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      imageInputMode === 'LOCAL_FILE'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    내 컴퓨터 파일 업로드 (JPG/PNG)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('URL_INPUT')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      imageInputMode === 'URL_INPUT'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    웹 URL 직접 입력
                  </button>
                </div>
              </div>

              {/* MODE 1: 파일 직접 업로드 (일괄 및 개별 슬롯) */}
              {imageInputMode === 'LOCAL_FILE' && (
                <div className="space-y-4">
                  {/* 일괄 드래그&드롭 / 다중 파일 선택 존 */}
                  <div 
                    onClick={() => multiFileInputRef.current?.click()}
                    className="p-4 rounded-xl border-2 border-dashed border-indigo-500/40 bg-indigo-950/20 hover:bg-indigo-950/40 hover:border-indigo-500 cursor-pointer transition-all text-center space-y-1.5"
                  >
                    <input
                      ref={multiFileInputRef}
                      type="file"
                      multiple
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleMultiFileUpload}
                      className="hidden"
                    />
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-white text-xs">
                      {isProcessingFiles ? '이미지 최적화 처리 중...' : '내 컴퓨터 파일 2~3개 일괄 선택 또는 드래그'}
                    </div>
                    <p className="text-[11px] text-indigo-300">
                      순서대로 [1. 포스터 썸네일(3:4)] ➔ [2. 가로 배너(16:9)] ➔ [3. 굿즈 캐릭터(PNG)]에 자동 배정됩니다.
                    </p>
                  </div>

                  {/* 3대 이미지 슬롯 개별 확인 및 수동 교체 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Slot 1: 메인 썸네일 (포스터형 3:4) */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white">1. 메인 포스터 (3:4) <span className="text-rose-400">*</span></span>
                        <Badge variant="purple" size="sm">스토어 표지</Badge>
                      </div>
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ipForm.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        <div 
                          onClick={() => slot1InputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[11px] gap-1"
                        >
                          <Upload className="w-4 h-4" />
                          <span>파일 교체</span>
                        </div>
                      </div>
                      <input
                        ref={slot1InputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => e.target.files?.[0] && handleSingleSlotUpload(1, e.target.files[0])}
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        className="w-full text-[10px]"
                        onClick={() => slot1InputRef.current?.click()}
                      >
                        포스터 파일 선택 (JPG/PNG)
                      </Button>
                    </div>

                    {/* Slot 2: 스토어 가로 배너 (16:9) */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white">2. 가로 배너 (16:9)</span>
                        <Badge variant="primary" size="sm">상단 헤더</Badge>
                      </div>
                      <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative group mt-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ipForm.bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
                        <div 
                          onClick={() => slot2InputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[11px] gap-1"
                        >
                          <Upload className="w-4 h-4" />
                          <span>파일 교체</span>
                        </div>
                      </div>
                      <input
                        ref={slot2InputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => e.target.files?.[0] && handleSingleSlotUpload(2, e.target.files[0])}
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        className="w-full text-[10px]"
                        onClick={() => slot2InputRef.current?.click()}
                      >
                        배너 파일 선택 (JPG/PNG)
                      </Button>
                    </div>

                    {/* Slot 3: 캐릭터/굿즈 일러스트 (투명 PNG) */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white">3. 굿즈 캐릭터 컷</span>
                        <Badge variant="slate" size="sm">투명 PNG 권장</Badge>
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative group flex items-center justify-center">
                        {ipForm.characterAssetUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ipForm.characterAssetUrl} alt="Character preview" className="w-full h-full object-contain p-2" />
                            <div 
                              onClick={() => slot3InputRef.current?.click()}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[11px] gap-1"
                            >
                              <Upload className="w-4 h-4" />
                              <span>파일 교체</span>
                            </div>
                          </>
                        ) : (
                          <div 
                            onClick={() => slot3InputRef.current?.click()}
                            className="text-center p-3 cursor-pointer text-slate-500 hover:text-slate-300"
                          >
                            <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                            <span className="text-[10px] block">PNG 캐릭터 등록</span>
                          </div>
                        )}
                      </div>
                      <input
                        ref={slot3InputRef}
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => e.target.files?.[0] && handleSingleSlotUpload(3, e.target.files[0])}
                        className="hidden"
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        className="w-full text-[10px]"
                        onClick={() => slot3InputRef.current?.click()}
                      >
                        캐릭터 PNG 선택
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: 웹 URL 직접 입력 모드 */}
              {imageInputMode === 'URL_INPUT' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      메인 썸네일 포스터 URL
                    </label>
                    <input
                      type="text"
                      value={ipForm.thumbnailUrl}
                      onChange={(e) => setIpForm({ ...ipForm, thumbnailUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                      placeholder="https://... 또는 /images/webtoons/..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      상단 와이드 배너 URL
                    </label>
                    <input
                      type="text"
                      value={ipForm.bannerUrl}
                      onChange={(e) => setIpForm({ ...ipForm, bannerUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                      placeholder="https://... 또는 /images/webtoons/..."
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">포스터 빠른 프리셋:</span>
                    {PRESET_THUMBNAILS.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setIpForm({ ...ipForm, thumbnailUrl: preset.url, bannerUrl: preset.url })}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 소개 & 줄거리 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                한 줄 요약 소개 (Summary)
              </label>
              <input
                type="text"
                placeholder="예: 넷플릭스 영상화 및 누적 1억 뷰 달성 대작!"
                value={ipForm.summary}
                onChange={(e) => setIpForm({ ...ipForm, summary: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                작품 줄거리 및 계약 상세 설명
              </label>
              <textarea
                rows={3}
                placeholder="작품의 스토리 라인과 굿즈 제작 라이선스 허용 범위를 기재합니다."
                value={ipForm.description}
                onChange={(e) => setIpForm({ ...ipForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* 공식 인증 및 상태 */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ipForm.officialBadge}
                  onChange={(e) => setIpForm({ ...ipForm, officialBadge: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span className="font-bold text-white">공식 저작권 라이선스 인증 배지 부여</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">초기 서비스 상태:</span>
                <select
                  value={ipForm.status}
                  onChange={(e) => setIpForm({ ...ipForm, status: e.target.value as WebtoonStatus })}
                  className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                >
                  <option value="ACTIVE">제작 활성 (ACTIVE)</option>
                  <option value="EXPIRED">비활성 (EXPIRED)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIpModalOpen(false)}>
                취소
              </Button>
              <Button type="submit" size="sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingIp ? '수정 완료' : '라이선스 등록 완료'}</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: USER DETAIL & MANAGEMENT MODAL */}
      {selectedUser && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          title={`회원 계정 상세 관리 - ${selectedUser.name}`}
          description={`계정 식별자: ${selectedUser.id} • 가입일: ${new Date(selectedUser.createdAt).toLocaleDateString('ko-KR')}`}
          maxWidth="xl"
        >
          <div className="space-y-6 text-xs text-slate-300">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-12 h-12 rounded-full border border-slate-700" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                    <Badge variant={selectedUser.status === 'SUSPENDED' ? 'danger' : 'success'} size="sm">
                      {selectedUser.status === 'SUSPENDED' ? '이용 정지' : '정상 활동'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedUser.email}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">보유 포인트</span>
                <span className="text-xl font-black text-indigo-400">{(selectedUser.points || 0).toLocaleString()}P</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-indigo-400" /> 연락처
                </span>
                <div className="font-bold text-white">{selectedUser.phone || '미등록'}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-emerald-400" /> 가입 수단
                </span>
                <div className="font-bold text-white">{selectedUser.provider || 'EMAIL 일반가입'}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400">누적 주문 / 결제액</span>
                <div className="font-bold text-white">
                  {selectedUser.totalOrdersCount || 0}건 / {(selectedUser.totalSpendAmount || 0).toLocaleString()}원
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400">비회원 주문 이관 이력</span>
                <div className="font-bold text-indigo-300">
                  {selectedUser.mergedGuestOrdersCount ? `${selectedUser.mergedGuestOrdersCount}건 통합 이관됨` : '이관 내역 없음'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
              <h4 className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>관리자 수동 포인트 지급 및 차감</span>
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={pointDiffInput}
                  onChange={(e) => setPointDiffInput(Number(e.target.value) || 0)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="포인트 금액 입력"
                />
                <Button
                  size="sm"
                  onClick={() => handleAdjustPoints(selectedUser.id, pointDiffInput)}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+{pointDiffInput.toLocaleString()}P 지급</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAdjustPoints(selectedUser.id, -pointDiffInput)}
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  <span>-{pointDiffInput.toLocaleString()}P 차감</span>
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500">
                  {selectedUser.lastLoginAt ? `최근 로그인: ${new Date(selectedUser.lastLoginAt).toLocaleString('ko-KR')}` : '로그인 기록 없음'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleUserStatus(selectedUser.id, selectedUser.status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    selectedUser.status === 'SUSPENDED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                  }`}
                >
                  {selectedUser.status === 'SUSPENDED' ? (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>이용 정지 해제</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>계정 일시 정지</span>
                    </>
                  )}
                </button>
                <Button variant="secondary" size="sm" onClick={() => setSelectedUser(null)}>
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: AUDIT LOG DETAIL MODAL */}
      {selectedLog && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLog(null)}
          title={`운영 감사로그 세부 이슈 - [${selectedLog.actionCode}]`}
          description={`로그 고유 식별자: ${selectedLog.id}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs text-slate-300">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    selectedLog.level === 'CRITICAL' || selectedLog.level === 'ERROR'
                      ? 'danger'
                      : selectedLog.level === 'WARN'
                      ? 'warning'
                      : 'primary'
                  }
                >
                  심각도: {selectedLog.level}
                </Badge>
                <Badge variant="purple">카테고리: {selectedLog.category}</Badge>
                <Badge 
                  variant={
                    selectedLog.resolutionStatus === 'RESOLVED' || selectedLog.resolutionStatus === 'AUTO_RECOVERED'
                      ? 'success'
                      : selectedLog.resolutionStatus === 'INVESTIGATING'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  상태: {selectedLog.resolutionStatus}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-slate-400 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(selectedLog.timestamp).toLocaleString('ko-KR')}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-white">이벤트 및 장애 요약</h4>
              <p className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 leading-relaxed font-medium">
                {selectedLog.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">발생 주체 (Actor)</span>
                <div className="text-white font-bold">{selectedLog.actor.name}</div>
                <div className="font-mono text-[11px] text-slate-500">
                  역할: {selectedLog.actor.role} • IP: {selectedLog.actor.ipAddress || 'Internal'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">대상 리소스 (Target)</span>
                <div className="text-white font-bold">{selectedLog.target?.name || 'N/A'}</div>
                <div className="font-mono text-[11px] text-slate-500">
                  유형: {selectedLog.target?.type || 'SYSTEM'} • ID: {selectedLog.target?.id || 'N/A'}
                </div>
              </div>

              {selectedLog.details.errorCode && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">기술 에러 코드</span>
                  <div className="font-mono font-bold text-rose-400">{selectedLog.details.errorCode}</div>
                  {selectedLog.details.errorMessage && (
                    <div className="text-[11px] text-slate-400 font-mono">{selectedLog.details.errorMessage}</div>
                  )}
                </div>
              )}

              {selectedLog.details.kioskId && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-400" /> 키오스크 단말기 위치
                  </span>
                  <div className="text-white font-bold">{selectedLog.details.kioskId}</div>
                  <div className="text-[11px] text-slate-400">{selectedLog.details.kioskLocation}</div>
                </div>
              )}
            </div>

            {selectedLog.details.actionGuide && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" />
                  <span>현장 대응 매뉴얼 및 권장 조치 가이드</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 leading-relaxed font-medium">
                  {selectedLog.details.actionGuide}
                </div>
              </div>
            )}

            {selectedLog.details.payload && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>원시 페이로드 JSON (Raw Payload)</span>
                  </h4>
                  <button
                    onClick={() => copyPayloadJson(selectedLog.details.payload)}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedPayload ? '복사 완료!' : 'JSON 복사'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-48 scrollbar-thin">
                  {JSON.stringify(selectedLog.details.payload, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                {selectedLog.details.resolvedAt ? (
                  <span>
                    최종 처리: {new Date(selectedLog.details.resolvedAt).toLocaleString('ko-KR')} ({selectedLog.details.resolvedBy})
                  </span>
                ) : (
                  <span>실시간 현장 모니터링 중인 로그입니다.</span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {selectedLog.resolutionStatus !== 'RESOLVED' && (
                  <Button
                    size="sm"
                    onClick={() => handleResolveLog(selectedLog.id, 'RESOLVED')}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>조치 완료로 처리</span>
                  </Button>
                )}
                {selectedLog.resolutionStatus === 'ACTION_REQUIRED' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleResolveLog(selectedLog.id, 'INVESTIGATING')}
                  >
                    <span>현장 조사 중으로 변경</span>
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
