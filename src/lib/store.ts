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
  FulfillmentType,
  PaymentMethod
} from '@/types';
import { 
  MOCK_USERS, 
  MOCK_WEBTOON_IPS, 
  MOCK_PRODUCTS, 
  MOCK_TEMPLATES, 
  MOCK_DESIGN_ASSETS, 
  MOCK_ORDERS, 
  MOCK_SETTLEMENTS 
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'tooncanvas_current_user',
  PROJECTS: 'tooncanvas_projects',
  ORDERS: 'tooncanvas_orders',
  WEBTOONS: 'tooncanvas_webtoons',
  SETTLEMENTS: 'tooncanvas_settlements',
};

// Initial design projects for immediate demo
const INITIAL_PROJECTS: DesignProject[] = [
  {
    id: 'proj-demo-1',
    userId: 'user-1',
    productId: 'prod-photocard',
    ipId: 'ip-stella-knight',
    title: '성기사 레이 네온 홀로그램 포토카드',
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
    ipId: 'ip-secret-greenhouse',
    title: '비올라 영애 로즈 골드 에디션',
    elements: MOCK_TEMPLATES[1].defaultElements,
    background: '#831843',
    previewDataUrl: MOCK_TEMPLATES[1].previewUrl,
    createdAt: '2026-10-25T11:00:00Z',
    updatedAt: '2026-10-25T11:20:00Z'
  }
];

export function useAppStore() {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [projects, setProjects] = useState<DesignProject[]>(INITIAL_PROJECTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [webtoons, setWebtoons] = useState<WebtoonIP[]>(MOCK_WEBTOON_IPS);
  const [settlements, setSettlements] = useState<Settlement[]>(MOCK_SETTLEMENTS);
  const [isLoaded, setIsLoaded] = useState(false);

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
        setWebtoons(JSON.parse(storedWebtoons));
      }

      const storedSettlements = localStorage.getItem(STORAGE_KEYS.SETTLEMENTS);
      if (storedSettlements) {
        setSettlements(JSON.parse(storedSettlements));
      }
    } catch {
      // LocalStorage fallback
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Switch Role/User
  const switchUser = useCallback((userId: string) => {
    const target = MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[0];
    setCurrentUser(target);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(target));
    }
  }, []);

  // Save or Update Project
  const saveProject = useCallback((project: DesignProject) => {
    setProjects(prev => {
      const exists = prev.findIndex(p => p.id === project.id);
      let next: DesignProject[];
      if (exists >= 0) {
        next = [...prev];
        next[exists] = { ...project, updatedAt: new Date().toISOString() };
      } else {
        next = [{ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
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

  // Create Order with Kiosk Print Code or Delivery
  const createOrder = useCallback((params: {
    projectId: string;
    projectTitle: string;
    productId: string;
    productName: string;
    ipId: string;
    ipTitle: string;
    previewUrl: string;
    quantity: number;
    unitPrice: number;
    options: { paperType: string; coating: string };
    fulfillmentType: FulfillmentType;
    paymentMethod: PaymentMethod;
    shippingInfo?: {
      recipient: string;
      phone: string;
      address: string;
      detailAddress: string;
      postalCode: string;
    };
  }): Order => {
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

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: currentUser.id,
      userName: currentUser.name,
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

  return {
    isLoaded,
    currentUser,
    switchUser,
    projects,
    saveProject,
    deleteProject,
    orders,
    createOrder,
    verifyPrintCode,
    completeKioskPrint,
    updateOrderStatus,
    webtoons,
    updateWebtoonStatus,
    settlements,
    products: MOCK_PRODUCTS,
    templates: MOCK_TEMPLATES,
    assets: MOCK_DESIGN_ASSETS
  };
}
