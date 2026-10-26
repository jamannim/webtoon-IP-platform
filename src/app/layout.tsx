import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'TOON CANVAS | 웹툰 공식 IP 굿즈 제작 & 키오스크 출력 스튜디오',
  description: '웹툰 공식 라이선스 캐릭터 에셋으로 나만의 포토카드, 엽서, 스티커를 디자인하고 전국 편의점 무인 키오스크에서 7자리 인쇄 코드로 즉시 출력하세요.',
  keywords: ['웹툰굿즈', '포토카드', '프린팅박스', '키오스크출력', '웹툰IP', '스마트인쇄', '캐릭터굿즈'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        <Suspense fallback={<div className="h-16 bg-slate-900 border-b border-slate-800" />}>
          <Header />
        </Suspense>
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">페이지 로딩 중...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
