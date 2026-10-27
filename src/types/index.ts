// WEBTOON GOODS PLATFORM (TOON CANVAS) Type Definitions

export type Role = 'USER' | 'CREATOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string;
  phone?: string;
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
  status: WebtoonStatus;
  officialBadge: boolean;
  featured: boolean;
  charactersCount: number;
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

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
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
  period: string; // e.g. "2026-10"
  totalOrders: number;
  totalRevenue: number;
  royaltyRate: number; // e.g. 0.15
  royaltyAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PAID';
  settledAt?: string;
}
