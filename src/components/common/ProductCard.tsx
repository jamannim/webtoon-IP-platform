import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import Badge from './Badge';
import { Printer, Truck, Sparkles, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  selectedIpId?: string;
}

export default function ProductCard({ product, selectedIpId }: ProductCardProps) {
  const editorUrl = selectedIpId
    ? `/editor?productId=${product.id}&ipId=${selectedIpId}`
    : `/editor?productId=${product.id}`;

  return (
    <div className="group rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between">
      <div>
        {/* Mockup Preview Area */}
        <div className="relative aspect-[4/5] rounded-xl bg-slate-950/80 border border-slate-800/80 p-4 flex items-center justify-center overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.mockupUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain drop-shadow-md"
          />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.kioskAvailable && (
              <Badge variant="success" size="sm">
                <Printer className="w-3 h-3" />
                <span>키오스크 즉시 출력</span>
              </Badge>
            )}
            {product.deliveryAvailable && (
              <Badge variant="purple" size="sm">
                <Truck className="w-3 h-3" />
                <span>택배 배송</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Title and Specs */}
        <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
          {product.name}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            {product.widthMm} x {product.heightMm} mm
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            {product.dpi} DPI 초고해상도
          </span>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block">제작 시작가</span>
          <span className="text-lg font-black text-white">
            {product.basePrice.toLocaleString()}원~
          </span>
        </div>

        <Link
          href={editorUrl}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all group-hover:gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>제작하기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
