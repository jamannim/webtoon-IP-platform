'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  DesignProject, 
  Order, 
  WebtoonIP, 
  Product, 
  ProductTemplate, 
  DesignAsset, 
  PrintJob, 
  Settlement,
  AuditLog,
  AuditResolutionStatus,
  UserStatus,
  SocialProvider,
  FulfillmentType,
  PaymentMethod,
  CreateOrderInput,
  GuestInfo
} from '@/types';
import { 
  MOCK_USERS, 
  MOCK_WEBTOON_IPS, 
  MOCK_PRODUCTS, 
  MOCK_TEMPLATES, 
  MOCK_DESIGN_ASSETS, 
  MOCK_ORDERS, 
  MOCK_SETTLEMENTS,
  MOCK_AUDIT_LOGS
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'tooncanvas_current_user',
  PROJECTS: 'tooncanvas_projects',
  ORDERS: 'tooncanvas_orders',
  WEBTOONS: 'tooncanvas_webtoons',
  SETTLEMENTS: 'tooncanvas_settlements',
  AUDIT_LOGS: 'tooncanvas_audit_logs',
  USERS: 'tooncanvas_users',
};

// Initial design projects for immediate demo
const INITIAL_PROJECTS: DesignProject[] = [
  {
    id: 'proj-demo-1',
    userId: 'user-1',
    productId: 'prod-photocard',
    ipId: 'ip-ranker-return',
    title: '랭커의 귀환 네온 홀로그램 포토카드',
    elements: MOCK_TEMPLATES[0].defaultElements,
    background: '#0B1329',
    previewDataUrl: MOCK_TEMPLATES[0].previewUrl,
    createdAt: '2026-10-26T10:00:00Z',
    updatedAt: '2026-10-26T14:10:00Z'
  },
  {
    id: 'proj-demo-2',
    userId: 'user-1',
    productId: 'prod-photocard',
    ipId: 'ip-twin-siblings',
    title: '쌍둥이 남매 로즈 골드 에디션',
    elements: MOCK_TEMPLATES[1].defaultElements,
    background: '#831843',
    previewDataUrl: MOCK_TEMPLATES[1].previewUrl,
    createdAt: '2026-10-25T11:00:00Z',
    updatedAt: '2026-10-25T11:20:00Z'
  }
];

export function useAppStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [projects, setProjects] = useState<DesignProject[]>(INITIAL_PROJECTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [webtoons, setWebtoons] = useState<WebtoonIP[]>(MOCK_WEBTOON_IPS);
  const [settlements, setSettlements] = useState<Settlement[]>(MOCK_SETTLEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isLoaded, setIsLoaded] = useState(false);

  const isLoggedIn = currentUser !== null;

  // Initialize from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      }

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(MOCK_ORDERS));
      }

      const storedWebtoons = localStorage.getItem(STORAGE_KEYS.WEBTOONS);
      if (storedWebtoons) {
        const parsed: WebtoonIP[] = JSON.parse(storedWebtoons);
        const hasDummy = parsed.some((w) => 
          w.id === 'ip-stella-knight' || 
          w.id === 'ip-secret-greenhouse' || 
          w.id === 'ip-underdog-high' || 
          w.id === 'ip-moon-rabbit-attic'
        );
        if (hasDummy || parsed.length > 26) {
          const cleaned = parsed.filter((w) => 
            w.id !== 'ip-stella-knight' && 
            w.id !== 'ip-secret-greenhouse' && 
            w.id !== 'ip-underdog-high' && 
            w.id !== 'ip-moon-rabbit-attic'
          );
          const finalWebtoons = cleaned.length === 26 ? cleaned : MOCK_WEBTOON_IPS;
          setWebtoons(finalWebtoons);
          localStorage.setItem(STORAGE_KEYS.WEBTOONS, JSON.stringify(finalWebtoons));
        } else {
          setWebtoons(parsed);
        }
      } else {
        localStorage.setItem(STORAGE_KEYS.WEBTOONS, JSON.stringify(MOCK_WEBTOON_IPS));
      }

      const storedSettlements = localStorage.getItem(STORAGE_KEYS.SETTLEMENTS);
      if (storedSettlements) {
        const parsed = JSON.parse(storedSettlements);
        // Ensure new schema with pgFeeRate exists
        if (parsed.length > 0 && parsed[0].pgFeeRate !== undefined) {
          setSettlements(parsed);
        } else {
          setSettlements(MOCK_SETTLEMENTS);
          localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify(MOCK_SETTLEMENTS));
        }
      } else {
        localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify(MOCK_SETTLEMENTS));
      }

      const storedLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (storedLogs) {
        setAuditLogs(JSON.parse(storedLogs));
      } else {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(MOCK_AUDIT_LOGS));
      }

      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        // Ensure new users count matches or exceeds
        if (parsedUsers.length >= MOCK_USERS.length) {
          setUsers(parsedUsers);
        } else {
          setUsers(MOCK_USERS);
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
        }
      } else {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
      }
    } catch {
      // LocalStorage fallback
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Switch Role/User (데모 및 테스트용)
  const switchUser = useCallback((userId: string) => {
    const target = MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[0];
    setCurrentUser(target);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(target));
    }
  }, []);

  // 소셜 간편 로그인 (카카오, 네이버, 구글, 이메일)
  const loginBySocial = useCallback((provider: 'KAKAO' | 'NAVER' | 'GOOGLE' | 'EMAIL', emailInput?: string, nameInput?: string) => {
    const providerNameMap = {
      KAKAO: '카카오 굿즈러버',
      NAVER: '네이버 웹툰팬',
      GOOGLE: '구글 컬렉터',
      EMAIL: '이메일 회원'
    };
    const user: User = {
      id: `user-${provider.toLowerCase()}-${Date.now().toString(36)}`,
      name: nameInput || providerNameMap[provider],
      email: emailInput || `${provider.toLowerCase()}_user@example.com`,
      role: 'USER',
      avatarUrl: `https://images.unsplash.com/photo-${provider === 'KAKAO' ? '1534528741775-53994a69daeb' : '1535713875002-d1d0cf377fde'}?w=150`,
      points: 1000,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    return user;
  }, []);

  // 신규 회원가입 (1초 가입 및 1,000P 지급)
  const signup = useCallback((name: string, email: string, phone?: string) => {
    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      name,
      email,
      phone: phone || '010-0000-0000',
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      points: 1000, // 신규 가입 축하 1,000 포인트
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    }
    return newUser;
  }, []);

  // 로그아웃 (비회원/게스트 모드로 전환)
  const logout = useCallback(() => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, []);

  // Save or Update Project
  const saveProject = useCallback((project: DesignProject) => {
    setProjects(prev => {
      const exists = prev.findIndex(p => p.id === project.id);
      let next: DesignProject[];
      if (exists >= 0) {
        next = prev.map(p => p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p);
      } else {
        next = [project, ...prev];
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // Delete Project
  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => {
      const next = prev.filter(p => p.id !== projectId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // Create Order (회원 및 비회원 지원)
  const createOrder = useCallback((params: CreateOrderInput): Order => {
    const timestamp = Date.now();
    const orderId = `ord-${timestamp}`;
    const randCode = Math.floor(1000000 + Math.random() * 9000000).toString(); // 7-digit code
    const formattedPrintCode = `${randCode.slice(0, 3)}-${randCode.slice(3)}`;
    const orderNumber = `TC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randCode.slice(0, 4)}`;

    const totalAmount = params.quantity * params.unitPrice;
    const shippingFee = params.fulfillmentType === 'DELIVERY' ? 3000 : 0;
    const finalAmount = totalAmount + shippingFee;

    const printJob: PrintJob | undefined = params.fulfillmentType === 'KIOSK' ? {
      id: `pj-${timestamp}`,
      orderId,
      orderNumber,
      printCode: formattedPrintCode,
      expiresAt: new Date(timestamp + 72 * 60 * 60 * 1000).toISOString(), // 72 hours
      isPrinted: false,
      previewUrl: params.previewUrl
    } : undefined;

    const shipment = params.fulfillmentType === 'DELIVERY' && params.shippingInfo ? {
      id: `shp-${timestamp}`,
      orderId,
      recipient: params.shippingInfo.recipient,
      phone: params.shippingInfo.phone,
      address: params.shippingInfo.address,
      detailAddress: params.shippingInfo.detailAddress,
      postalCode: params.shippingInfo.postalCode,
      carrier: 'CJ대한통운',
      trackingNumber: `6849-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'PREPARING' as const
    } : undefined;

    const isGuestOrder = params.isGuest || !currentUser;
    const userId = isGuestOrder ? `GUEST-${timestamp}` : (currentUser?.id || `user-${timestamp}`);
    const userName = isGuestOrder 
      ? (params.guestInfo?.name || '비회원 고객') 
      : (currentUser?.name || '일반 회원');

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId,
      userName,
      isGuest: isGuestOrder,
      guestPhone: params.guestInfo?.phone,
      guestPassword: params.guestInfo?.password,
      fulfillmentType: params.fulfillmentType,
      itemCount: params.quantity,
      totalAmount,
      discountAmount: 0,
      shippingFee,
      finalAmount,
      status: params.fulfillmentType === 'KIOSK' ? 'READY_FOR_PICKUP' : 'PAID',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: `item-${timestamp}`,
          orderId,
          projectId: params.projectId,
          projectTitle: params.projectTitle,
          productId: params.productId,
          productName: params.productName,
          ipId: params.ipId,
          ipTitle: params.ipTitle,
          previewUrl: params.previewUrl,
          quantity: params.quantity,
          unitPrice: params.unitPrice,
          options: params.options
        }
      ],
      printJob,
      shipment,
      payment: {
        id: `pay-${timestamp}`,
        orderId,
        method: params.paymentMethod,
        amount: finalAmount,
        status: 'PAID',
        transactionId: `tx_sim_${timestamp.toString(36)}`,
        paidAt: new Date().toISOString()
      }
    };

    setOrders(prev => {
      const next = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
      }
      return next;
    });

    return newOrder;
  }, [currentUser]);

  // 비회원 주문 및 인쇄 코드 조회 (전화번호 + 간편비밀번호)
  const findGuestOrders = useCallback((phoneRaw: string, pinRaw?: string): Order[] => {
    const cleanPhone = phoneRaw.replace(/[^0-9]/g, '');
    return orders.filter(o => {
      if (!o.isGuest || !o.guestPhone) return false;
      const orderPhone = o.guestPhone.replace(/[^0-9]/g, '');
      const phoneMatch = orderPhone === cleanPhone || orderPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone);
      if (!phoneMatch) return false;
      if (pinRaw && o.guestPassword) {
        return o.guestPassword === pinRaw.trim();
      }
      return true;
    });
  }, [orders]);

  // 비회원 주문 내역을 회원 계정으로 이관 (Data Merging)
  const mergeGuestOrdersToUser = useCallback((phoneRaw: string, targetUserId: string, targetUserName: string) => {
    const cleanPhone = phoneRaw.replace(/[^0-9]/g, '');
    let mergedCount = 0;

    setOrders(prev => {
      const next = prev.map(o => {
        if (o.isGuest && o.guestPhone) {
          const orderPhone = o.guestPhone.replace(/[^0-9]/g, '');
          if (orderPhone === cleanPhone || orderPhone.endsWith(cleanPhone)) {
            mergedCount++;
            return {
              ...o,
              userId: targetUserId,
              userName: targetUserName,
              isGuest: false,
              updatedAt: new Date().toISOString()
            };
          }
        }
        return o;
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
      }
      return next;
    });

    return mergedCount;
  }, []);

  // Kiosk Simulation: Verify and Print code
  const verifyPrintCode = useCallback((codeRaw: string): { success: boolean; order?: Order; message: string } => {
    const cleaned = codeRaw.replace(/[^0-9]/g, '');
    const found = orders.find(o => {
      if (!o.printJob) return false;
      const jobClean = o.printJob.printCode.replace(/[^0-9]/g, '');
      return jobClean === cleaned;
    });

    if (!found || !found.printJob) {
      return { success: false, message: '유효하지 않거나 일치하는 인쇄 코드가 없습니다.' };
    }

    if (found.printJob.isPrinted) {
      return { 
        success: false, 
        order: found,
        message: `이미 출력이 완료된 코드입니다. (출력일시: ${found.printJob.printedAt ? new Date(found.printJob.printedAt).toLocaleString('ko-KR') : '확인됨'})` 
      };
    }

    const expireDate = new Date(found.printJob.expiresAt).getTime();
    if (Date.now() > expireDate) {
      return { success: false, message: '출력 유효기간(72시간)이 만료된 코드입니다.' };
    }

    return { success: true, order: found, message: '인쇄 코드가 정상 확인되었습니다.' };
  }, [orders]);

  // Kiosk Simulation: Complete Print
  const completeKioskPrint = useCallback((orderId: string, kioskId = 'KIOSK-SEOUL-HONGDAE-01') => {
    setOrders(prev => {
      const next = prev.map(o => {
        if (o.id === orderId && o.printJob) {
          return {
            ...o,
            status: 'PRINTED' as const,
            updatedAt: new Date().toISOString(),
            printJob: {
              ...o.printJob,
              isPrinted: true,
              printedAt: new Date().toISOString(),
              kioskId,
              kioskLocation: '홍대입구역 9번 출구 GS25 스마트키오스크 1호기'
            }
          };
        }
        return o;
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // Update Order Status (Admin)
  const updateOrderStatus = useCallback((orderId: string, status: Order['status'], trackingNumber?: string) => {
    setOrders(prev => {
      const next = prev.map(o => {
        if (o.id === orderId) {
          const updated: Order = { ...o, status, updatedAt: new Date().toISOString() };
          if (trackingNumber && updated.shipment) {
            updated.shipment = {
              ...updated.shipment,
              trackingNumber,
              status: status === 'DELIVERED' ? 'DELIVERED' : 'SHIPPED',
              shippedAt: new Date().toISOString()
            };
          }
          return updated;
        }
        return o;
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // Update IP Status (Admin)
  const updateWebtoonStatus = useCallback((ipId: string, status: WebtoonIP['status']) => {
    setWebtoons(prev => {
      const next = prev.map(w => w.id === ipId ? { ...w, status } : w);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.WEBTOONS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // 신규 웹툰 IP 라이선스 등록 (Admin)
  const addWebtoon = useCallback((newIp: WebtoonIP) => {
    setWebtoons(prev => {
      const next = [newIp, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.WEBTOONS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // 웹툰 IP 라이선스 정보 수정 (Admin)
  const updateWebtoon = useCallback((ipId: string, updatedData: Partial<WebtoonIP>) => {
    setWebtoons(prev => {
      const next = prev.map(w => w.id === ipId ? { ...w, ...updatedData } : w);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.WEBTOONS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // 웹툰 IP 라이선스 삭제 (Admin)
  const deleteWebtoon = useCallback((ipId: string) => {
    setWebtoons(prev => {
      const next = prev.filter(w => w.id !== ipId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.WEBTOONS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // 회원 상태 변경 (정상 / 일시정지)
  const updateUserStatus = useCallback((userId: string, status: UserStatus) => {
    setUsers(prev => {
      const updated = prev.map(u => u.id === userId ? { ...u, status } : u);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // 회원 포인트 지급/차감
  const adjustUserPoints = useCallback((userId: string, pointDiff: number, reason?: string) => {
    setUsers(prev => {
      const updated = prev.map(u => {
        if (u.id === userId) {
          const newPoints = Math.max(0, (u.points || 0) + pointDiff);
          return { ...u, points: newPoints };
        }
        return u;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // 운영 감사로그 조치 상태 업데이트
  const updateAuditLogStatus = useCallback((logId: string, status: AuditResolutionStatus, resolutionNote?: string) => {
    setAuditLogs(prev => {
      const updated = prev.map(log => {
        if (log.id === logId) {
          return {
            ...log,
            resolutionStatus: status,
            details: {
              ...log.details,
              actionGuide: resolutionNote || log.details.actionGuide,
              resolvedAt: new Date().toISOString(),
              resolvedBy: '관리자 (수동 조치)'
            }
          };
        }
        return log;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  return {
    isLoaded,
    currentUser,
    isLoggedIn,
    switchUser,
    loginBySocial,
    signup,
    logout,
    projects,
    saveProject,
    deleteProject,
    orders,
    createOrder,
    findGuestOrders,
    mergeGuestOrdersToUser,
    verifyPrintCode,
    completeKioskPrint,
    updateOrderStatus,
    webtoons,
    updateWebtoonStatus,
    addWebtoon,
    updateWebtoon,
    deleteWebtoon,
    settlements,
    auditLogs,
    updateAuditLogStatus,
    users,
    updateUserStatus,
    adjustUserPoints,
    products: MOCK_PRODUCTS,
    templates: MOCK_TEMPLATES,
    assets: MOCK_DESIGN_ASSETS
  };
}
