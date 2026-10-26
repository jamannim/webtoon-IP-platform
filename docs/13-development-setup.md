# 13. 개발 환경 구축 및 실행 가이드 (Development Setup)

## 1. 프로젝트 개요
- **프로젝트명**: WEBTOON GOODS PLATFORM (TOON CANVAS)
- **프레임워크**: Next.js 16.4.3 (App Router), React 19.3.0
- **스타일링**: Tailwind CSS v4
- **언어**: TypeScript 5.x (Strict Typing, No `as any`)
- **주요 라이브러리**: `lucide-react`, `canvas-confetti`

---

## 2. 로컬 실행 방법

### 2.1 사전 요구사항
- Node.js v20 이상 (권장: v22 ~ v24)
- npm v10 이상

### 2.2 패키지 설치 및 개발 서버 구동
```bash
# 1. 프로젝트 디렉토리 이동
cd C:\Users\LG\.gemini\antigravity\scratch\webtoon-goods-platform

# 2. 의존성 패키지 설치
npm install

# 3. 개발 서버 구동 (기본 포트: 3000)
npm run dev

# 4. 프로덕션 빌드 및 검증
npm run build
npm run start
```

---

## 3. 디렉토리 구조 명세

```
webtoon-goods-platform/
├── docs/                     # 20종 명세서 및 분석/설계 보고서
├── src/
│   ├── app/                  # Next.js App Router 페이지
│   │   ├── layout.tsx        # 글로벌 레이아웃 (헤더/푸터)
│   │   ├── page.tsx          # 메인 랜딩 페이지
│   │   ├── store/            # 웹툰 IP 스토어 및 작품 상세
│   │   ├── editor/           # 굿즈 커스텀 캔버스 에디터
│   │   ├── checkout/         # 주문서 작성 및 가상 PG 결제
│   │   ├── order/complete/   # 7자리 인쇄코드 발급 & 완료
│   │   ├── kiosk/            # 오프라인 키오스크 터치 시뮬레이터
│   │   ├── mypage/           # 내 디자인 보관함 및 주문 내역
│   │   └── admin/            # 운영자 백오피스 대시보드
│   ├── components/           # 재사용 가능한 UI 컴포넌트
│   │   ├── common/           # Header, Footer, Badge, Button, Modal, Card
│   │   ├── editor/           # 캔버스 및 툴바 컴포넌트
│   │   └── kiosk/            # 가상 키패드 및 인쇄 애니메이션
│   ├── lib/
│   │   ├── mockData.ts       # 공식 라이선스 웹툰 4종 & 에셋
│   │   └── store.ts          # 클라이언트 상태 및 영속화 스토어
│   └── types/
│       └── index.ts          # 전체 도메인 타입 정의
├── tests/                    # 기본 및 기능 검증 테스트
└── package.json
```
