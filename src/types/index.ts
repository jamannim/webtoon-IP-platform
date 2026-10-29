// WEBTOON GOODS PLATFORM (TOON CANVAS) Type Definitions

export type Role = 'USER' | 'CREATOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';
export type SocialProvider = 'KAKAO' | 'NAVER' | 'GOOGLE' | 'EMAIL';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string;
  phone?: string;
  points?: number;
  status?: UserStatus;
  provider?: SocialProvider;
  totalOrdersCount?: number;
  totalSpendAmount?: number;
  lastLoginAt?: string;
  mergedGuestOrdersCount?: number;
  createdAt: string;
}

export type WebtoonStatus = 'ACTIVE' | 'UPCOMING' | 'EXPIRED';

export type WebtoonGenre = 
  | '로맨스 판타지' 
  | 'SF 액션' 
  | '학원 액션' 
  | '힐링 일상' 
  | '무협/판타지'
  | '현대 판타지'
  | '드라마';

export interface WebtoonIP {
  id: string;
  title: string;
  author: string;
  genre: WebtoonGenre;
  description: string;
  summary: string;
  bannerUrl: string;
  thumbnailUrl: string;
  characterAssetUrl?: string; // 3번째 이미지: 캐릭터/굿즈 일러스트
  additionalImages?: string[]; // 다중 등록된 이미지 목록
  status: WebtoonStatus;
  officialBadge: boolean;
  featured: boolean;
  charactersCount?: number;
  likesCount: number;
  releaseYear: number;
}

export interface Character {
  id: string;
  ipId: string;
  name: string;
  role: string;
  description: string;
  avatarUrl: string;
  tags: string[];
}

export interface License {
  id: string;
  ipId: string;
  licenseNumber: string;
  holderName: string;
  startDate: string;
  endDate: string;
  royaltyRate: number; // e.g., 0.15 for 15%
  allowedProducts: string[];
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export type ProductCategory = 'PHOTOCARD' | 'POSTCARD' | 'STICKER' | 'ACRYLIC';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  widthMm: number;
  heightMm: number;
  bleedMm: number; // 재단 여백 (보통 2mm)
  safeMarginMm: number; // 안전 여백 (보통 3mm)
  dpi: number; // 기본 300 DPI
  basePrice: number;
  kioskAvailable: boolean; // 키오스크 출력 지원 여부
  deliveryAvailable: boolean; // 택배 배송 지원 여부
  mockupUrl: string;
  specs: {
    paperRecommendation: string;
    finishOptions: string[];
    turnaroundTime: string;
  };
}

export type CanvasElementType = 'image' | 'sticker' | 'text' | 'frame';

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  // Image / Sticker / Frame fields
  src?: string;
  name?: string;
  // Text fields
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'bold' | '900';
  backgroundColor?: string;
}

export interface ProductTemplate {
  id: string;
  productId: string;
  ipId: string;
  name: string;
  previewUrl: string;
  frameType: string;
  defaultElements: CanvasElement[];
}

export type AssetCategory = 'CHARACTER' | 'STICKER' | 'FRAME' | 'BACKGROUND' | 'SPEECH_BUBBLE';

export interface DesignAsset {
  id: string;
  ipId: string;
  characterId?: string;
  name: string;
  type: AssetCategory;
  assetUrl: string;
  tags: string[];
}

export interface DesignProject {
  id: string;
  userId: string;
  productId: string;
  ipId: string;
  title: string;
  elements: CanvasElement[];
  background: string;
  previewDataUrl?: string;
  printFileDataUrl?: string;
  updatedAt: string;
  createdAt: string;
}

export type FulfillmentType = 'KIOSK' | 'DELIVERY';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PRODUCING'
  | 'READY_FOR_PICKUP'
  | 'PRINTED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId: string;
  projectId: string;
  projectTitle: string;
  productId: string;
  productName: string;
  ipId: string;
  ipTitle: string;
  previewUrl: string;
  quantity: number;
  unitPrice: number;
  options: {
    paperType: string;
    coating: string;
  };
}

export interface GuestInfo {
  phone: string;
  password?: string; // 4자리 간편 비밀번호
  name?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  isGuest?: boolean;
  guestPhone?: string;
  guestPassword?: string;
  fulfillmentType: FulfillmentType;
  items: OrderItem[];
  itemCount: number;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  // Specific fulfillment metadata
  printJob?: PrintJob;
  shipment?: Shipment;
  payment?: Payment;
}

export interface CreateOrderInput {
  projectId: string;
  projectTitle: string;
  productId: string;
  productName: string;
  ipId: string;
  ipTitle: string;
  previewUrl: string;
  quantity: number;
  unitPrice: number;
  options: {
    paperType: string;
    coating: string;
  };
  fulfillmentType: FulfillmentType;
  paymentMethod: PaymentMethod;
  shippingInfo?: {
    recipient: string;
    phone: string;
    address: string;
    detailAddress: string;
    postalCode: string;
  };
  isGuest?: boolean;
  guestInfo?: GuestInfo;
}

export type PaymentMethod = 'TOSSPAY' | 'KAKAOPAY' | 'NAVERPAY' | 'CARD' | 'KIOSK_ON_SITE';

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: 'PAID' | 'FAILED' | 'CANCELLED';
  transactionId: string;
  paidAt: string;
}

export interface PrintJob {
  id: string;
  orderId: string;
  orderNumber: string;
  printCode: string; // 7-digit numeric code e.g. "492-8172" or "4928172"
  expiresAt: string; // 72 hours from issuance
  isPrinted: boolean;
  printedAt?: string;
  kioskId?: string;
  kioskLocation?: string;
  previewUrl: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  recipient: string;
  phone: string;
  address: string;
  detailAddress: string;
  postalCode: string;
  carrier: string;
  trackingNumber?: string;
  status: 'PREPARING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED';
  shippedAt?: string;
}

export interface Settlement {
  id: string;
  ipId: string;
  ipTitle: string;
  period: string; // e.g. "2026년 10월"
  totalOrders: number;
  totalRevenue: number;
  pgFeeRate: number; // e.g. 0.033 (3.3%)
  pgFeeAmount: number; // totalRevenue * pgFeeRate
  netRevenue: number; // totalRevenue - pgFeeAmount (PG 수수료 차감 순매출)
  royaltyCalculationBasis: 'NET_REVENUE' | 'GROSS_REVENUE'; // 로열티 산출 기준 (기본: NET_REVENUE)
  royaltyRate: number; // e.g. 0.15 (15%)
  royaltyAmount: number; // netRevenue * royaltyRate
  status: 'PENDING' | 'CONFIRMED' | 'PAID';
  settledAt?: string;
}

// 운영 감사로그 (Audit Log) 타입 정의
export type AuditLogCategory = 'PAYMENT' | 'KIOSK' | 'LICENSE' | 'AUTH' | 'SYSTEM';
export type AuditLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
export type AuditResolutionStatus = 'RESOLVED' | 'INVESTIGATING' | 'ACTION_REQUIRED' | 'AUTO_RECOVERED';

export interface AuditLog {
  id: string;
  timestamp: string; // ISO 8601
  category: AuditLogCategory;
  level: AuditLogLevel;
  actionCode: string; // e.g. KIOSK_PAPER_JAM, PAYMENT_PG_ERROR, LICENSE_UPDATED, ADMIN_LOGIN_FAIL
  summary: string; // 한국어 요약 설명
  actor: {
    id: string;
    name: string;
    role: 'ADMIN' | 'SYSTEM' | 'KIOSK' | 'USER' | 'GUEST';
    ipAddress?: string;
    userAgent?: string;
  };
  target?: {
    type: 'ORDER' | 'KIOSK' | 'IP' | 'USER' | 'SETTLEMENT';
    id: string;
    name?: string;
  };
  resolutionStatus: AuditResolutionStatus;
  details: {
    errorCode?: string;
    errorMessage?: string;
    kioskId?: string;
    kioskLocation?: string;
    hardwarePart?: string; // e.g. "포토 프린터 트레이 1", "다이컷 커터"
    pgProvider?: string; // e.g. "토스페이먼츠", "카카오페이"
    payload?: Record<string, unknown>;
    actionGuide?: string; // 현장/운영자 대응 가이드
    resolvedAt?: string;
    resolvedBy?: string;
  };
}
