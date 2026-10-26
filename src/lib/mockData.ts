import { WebtoonIP, Character, License, Product, ProductTemplate, DesignAsset, User, Order, Settlement } from '@/types';

// SVG Helper to generate clean, lightweight, crisp vector placeholder artwork
function createSvgDataUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    email: 'fan@tooncanvas.com',
    name: '김웹툰 (굿즈러버)',
    role: 'USER',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#6366F1"/>
        <circle cx="50" cy="40" r="20" fill="#FFFFFF"/>
        <path d="M 20 85 C 25 65, 75 65, 80 85 Z" fill="#FFFFFF"/>
      </svg>
    `),
    phone: '010-1234-5678',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user-creator',
    email: 'artist@stella.studio',
    name: '아스트라 작가',
    role: 'CREATOR',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#EC4899"/>
        <circle cx="50" cy="40" r="20" fill="#FFFFFF"/>
        <path d="M 20 85 C 25 65, 75 65, 80 85 Z" fill="#FFFFFF"/>
        <polygon points="50,15 54,23 63,25 56,32 58,41 50,37 42,41 44,32 37,25 46,23" fill="#FBBF24"/>
      </svg>
    `),
    phone: '010-9876-5432',
    createdAt: '2025-11-20T14:30:00Z'
  },
  {
    id: 'user-admin',
    email: 'admin@tooncanvas.com',
    name: '플랫폼 총괄 관리자',
    role: 'ADMIN',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#1E293B"/>
        <circle cx="50" cy="40" r="18" fill="#38BDF8"/>
        <path d="M 25 85 C 30 68, 70 68, 75 85 Z" fill="#38BDF8"/>
      </svg>
    `),
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const MOCK_WEBTOON_IPS: WebtoonIP[] = [
  {
    id: 'ip-stella-knight',
    title: '스텔라 나이트: 은하의 성기사',
    author: '아스트라 & 룬',
    genre: 'SF 액션',
    description: '은하 연합의 붕괴 속에서 성기사 레이가 시공간 엑스칼리버를 깨우며 펼쳐지는 우주 대서사시',
    summary: '누적 3,400만 뷰, 2026 K-웹툰 어워드 대상 후보작! 화려한 메카닉과 성기사의 은하계 모험',
    thumbnailUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <defs>
          <linearGradient id="stellaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="50%" stop-color="#1E1B4B"/>
            <stop offset="100%" stop-color="#312E81"/>
          </linearGradient>
          <linearGradient id="neonSword" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38BDF8"/>
            <stop offset="100%" stop-color="#818CF8"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#stellaGrad)"/>
        <circle cx="150" cy="140" r="70" fill="none" stroke="#38BDF8" stroke-width="3" stroke-dasharray="6,6" opacity="0.6"/>
        <polygon points="150,70 160,180 150,230 140,180" fill="url(#neonSword)"/>
        <polygon points="120,180 180,180 150,195" fill="#E0E7FF"/>
        <circle cx="70" cy="80" r="2" fill="#FFFFFF"/>
        <circle cx="230" cy="60" r="3" fill="#FFFFFF"/>
        <circle cx="250" cy="200" r="2" fill="#67E8F9"/>
        <circle cx="50" cy="240" r="2" fill="#818CF8"/>
        <text x="150" y="320" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">스텔라 나이트</text>
        <text x="150" y="350" font-family="sans-serif" font-weight="500" font-size="13" fill="#93C5FD" text-anchor="middle">STELLA KNIGHT</text>
      </svg>
    `),
    bannerUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
        <defs>
          <linearGradient id="bStella" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#020617"/>
            <stop offset="50%" stop-color="#1E1B4B"/>
            <stop offset="100%" stop-color="#0C4A6E"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="400" fill="url(#bStella)"/>
        <circle cx="950" cy="180" r="140" fill="none" stroke="#38BDF8" stroke-width="4" opacity="0.4"/>
        <polygon points="950,40 970,260 950,330 930,260" fill="#38BDF8" opacity="0.8"/>
        <text x="80" y="160" font-family="sans-serif" font-weight="900" font-size="46" fill="#FFFFFF">스텔라 나이트: 은하의 성기사</text>
        <text x="80" y="210" font-family="sans-serif" font-weight="600" font-size="20" fill="#38BDF8">공식 라이선스 디지털 굿즈 에디션 런칭</text>
        <text x="80" y="250" font-family="sans-serif" font-size="16" fill="#94A3B8">시공간 엑스칼리버 홀로그램 포토카드와 캐릭터 아크릴 스탠드를 지금 만나보세요.</text>
      </svg>
    `),
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 14200,
    releaseYear: 2024
  },
  {
    id: 'ip-secret-greenhouse',
    title: '황실의 비밀 온실과 집사들',
    author: '로잘린 C.',
    genre: '로맨스 판타지',
    description: '제국 최고 명문가의 외동딸 비올라와 온실 속 금지된 마법 식물을 지키는 수상한 집사 카시안의 로맨스',
    summary: '로판 랭킹 1위! 화려한 드레스와 앤틱한 티타임, 심쿵 보장 일러스트 대방출',
    thumbnailUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <defs>
          <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4A044E"/>
            <stop offset="50%" stop-color="#831843"/>
            <stop offset="100%" stop-color="#F43F5E"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#roseGrad)"/>
        <circle cx="150" cy="140" r="65" fill="#FDF2F8" opacity="0.3"/>
        <path d="M 150 100 C 120 70, 100 110, 150 160 C 200 110, 180 70, 150 100 Z" fill="#FB7185"/>
        <path d="M 150 160 Q 150 220 130 240 M 150 190 Q 170 180 180 190" stroke="#4ADE80" stroke-width="4" fill="none"/>
        <text x="150" y="320" font-family="sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle">황실의 비밀 온실</text>
        <text x="150" y="350" font-family="sans-serif" font-weight="500" font-size="13" fill="#FECDD3" text-anchor="middle">SECRET GREENHOUSE</text>
      </svg>
    `),
    bannerUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
        <defs>
          <linearGradient id="bRose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2E1065"/>
            <stop offset="50%" stop-color="#701A75"/>
            <stop offset="100%" stop-color="#BE185D"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="400" fill="url(#bRose)"/>
        <circle cx="950" cy="200" r="130" fill="#F43F5E" opacity="0.3"/>
        <text x="80" y="160" font-family="sans-serif" font-weight="900" font-size="46" fill="#FFFFFF">황실의 비밀 온실과 집사들</text>
        <text x="80" y="210" font-family="sans-serif" font-weight="600" font-size="20" fill="#F472B6">고급 펄지 엽서 & 앤틱 골드 프레임 한정판</text>
        <text x="80" y="250" font-family="sans-serif" font-size="16" fill="#E2E8F0">황실 온실의 우아한 일러스트를 그대로 담아낸 포토카드 세트</text>
      </svg>
    `),
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 22800,
    releaseYear: 2023
  },
  {
    id: 'ip-underdog-high',
    title: '언더독 하이: 옥상의 불사조',
    author: '강철우',
    genre: '학원 액션',
    description: '최하위 불량 고교에 전학 온 수수께끼의 복서 강태오, 그의 주먹이 학교의 서열을 다시 쓴다',
    summary: '숨 쉴 틈 없는 타격감과 우정! MZ 세대 액션 만화 1등 화제작',
    thumbnailUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <defs>
          <linearGradient id="actionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181B"/>
            <stop offset="50%" stop-color="#7C2D12"/>
            <stop offset="100%" stop-color="#EA580C"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#actionGrad)"/>
        <polygon points="150,60 190,130 165,130 200,210 135,160 155,160" fill="#FACC15"/>
        <text x="150" y="320" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">언더독 하이</text>
        <text x="150" y="350" font-family="sans-serif" font-weight="500" font-size="13" fill="#FED7AA" text-anchor="middle">UNDERDOG HIGH</text>
      </svg>
    `),
    bannerUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
        <defs>
          <linearGradient id="bAction" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#09090B"/>
            <stop offset="50%" stop-color="#431407"/>
            <stop offset="100%" stop-color="#C2410C"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="400" fill="url(#bAction)"/>
        <polygon points="980,60 1030,170 990,170 1040,280 950,200 980,200" fill="#FACC15"/>
        <text x="80" y="160" font-family="sans-serif" font-weight="900" font-size="46" fill="#FFFFFF">언더독 하이: 옥상의 불사조</text>
        <text x="80" y="210" font-family="sans-serif" font-weight="600" font-size="20" fill="#FB923C">다이나믹 웹툰 컷 스티커 & 불사조 엠블럼</text>
        <text x="80" y="250" font-family="sans-serif" font-size="16" fill="#D4D4D8">강렬한 명장면을 내 손으로 직접 조합해 포토카드에 담으세요.</text>
      </svg>
    `),
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 9700,
    releaseYear: 2025
  },
  {
    id: 'ip-moon-rabbit-attic',
    title: '달묘의 다락방 티타임',
    author: '솜사탕냥',
    genre: '힐링 일상',
    description: '달나라에서 지구로 불시착한 마법 토끼 달묘와 귀여운 동물 친구들의 따스한 베이커리 일상',
    summary: '지친 하루를 감싸안는 포근한 힐링툰, 다이어리 데코용 스티커와 투명 포카 인기 폭발',
    thumbnailUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <defs>
          <linearGradient id="healGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDF4FF"/>
            <stop offset="50%" stop-color="#EDE9FE"/>
            <stop offset="100%" stop-color="#DDD6FE"/>
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#healGrad)"/>
        <circle cx="150" cy="150" r="60" fill="#FEF08A"/>
        <!-- 토끼 귀 -->
        <ellipse cx="130" cy="95" rx="14" ry="32" fill="#FFFFFF"/>
        <ellipse cx="130" cy="95" rx="7" ry="20" fill="#FBCFE8"/>
        <ellipse cx="170" cy="95" rx="14" ry="32" fill="#FFFFFF"/>
        <ellipse cx="170" cy="95" rx="7" ry="20" fill="#FBCFE8"/>
        <!-- 얼굴 -->
        <circle cx="150" cy="155" r="45" fill="#FFFFFF"/>
        <circle cx="138" cy="150" r="4" fill="#374151"/>
        <circle cx="162" cy="150" r="4" fill="#374151"/>
        <path d="M 146 160 Q 150 164 154 160" stroke="#374151" stroke-width="2" fill="none"/>
        <ellipse cx="132" cy="162" rx="6" ry="3" fill="#FDA4AF" opacity="0.6"/>
        <ellipse cx="168" cy="162" rx="6" ry="3" fill="#FDA4AF" opacity="0.6"/>
        <text x="150" y="320" font-family="sans-serif" font-weight="900" font-size="22" fill="#4B5563" text-anchor="middle">달묘의 다락방</text>
        <text x="150" y="350" font-family="sans-serif" font-weight="500" font-size="13" fill="#8B5CF6" text-anchor="middle">MOON RABBIT TEA TIME</text>
      </svg>
    `),
    bannerUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
        <defs>
          <linearGradient id="bHeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F5F3FF"/>
            <stop offset="50%" stop-color="#DDD6FE"/>
            <stop offset="100%" stop-color="#C4B5FD"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="400" fill="url(#bHeal)"/>
        <circle cx="950" cy="180" r="100" fill="#FEF08A"/>
        <text x="80" y="160" font-family="sans-serif" font-weight="900" font-size="46" fill="#374151">달묘의 다락방 티타임</text>
        <text x="80" y="210" font-family="sans-serif" font-weight="600" font-size="20" fill="#7C3AED">폭신폭신 다이어리 스티커팩 & 투명 포토카드</text>
        <text x="80" y="250" font-family="sans-serif" font-size="16" fill="#4B5563">귀여운 달나라 토끼 파티시에와 함께하는 일상의 작은 힐링</text>
      </svg>
    `),
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 18500,
    releaseYear: 2024
  }
];

export const MOCK_CHARACTERS: Character[] = [
  // stella knight
  {
    id: 'char-ray',
    ipId: 'ip-stella-knight',
    name: '레이 아스테르',
    role: '주인공 / 성기사',
    description: '은하 연합의 유일한 성기사 서열 1위. 차갑지만 동료를 지키기 위해 검을 든다.',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="20" fill="#0F172A"/>
        <circle cx="100" cy="85" r="45" fill="#E2E8F0"/>
        <!-- 은발 머리 -->
        <path d="M 50 80 Q 100 20 150 80 Q 140 120 125 110 Q 100 65 75 110 Z" fill="#94A3B8"/>
        <!-- 눈 -->
        <ellipse cx="85" cy="85" rx="5" ry="8" fill="#38BDF8"/>
        <ellipse cx="115" cy="85" rx="5" ry="8" fill="#38BDF8"/>
        <path d="M 60 180 C 70 135 130 135 140 180 Z" fill="#1E293B"/>
        <polygon points="100,135 90,165 110,165" fill="#38BDF8"/>
      </svg>
    `),
    tags: ['성기사', '은발', '냉철', '검사']
  },
  {
    id: 'char-erica',
    ipId: 'ip-stella-knight',
    name: '에리카 AI',
    role: '항법 안드로이드',
    description: '모선 아스테리아의 두뇌. 인간의 감정을 배우기 시작한 신비로운 서포터.',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="20" fill="#1E1B4B"/>
        <circle cx="100" cy="85" r="45" fill="#FDF4FF"/>
        <path d="M 50 70 Q 100 30 150 70 Q 155 120 130 115 Q 100 70 70 115 Z" fill="#C084FC"/>
        <ellipse cx="85" cy="85" rx="6" ry="8" fill="#A855F7"/>
        <ellipse cx="115" cy="85" rx="6" ry="8" fill="#A855F7"/>
        <path d="M 60 180 C 70 135 130 135 140 180 Z" fill="#4C1D95"/>
      </svg>
    `),
    tags: ['안드로이드', '퍼플', '신비', '서포터']
  },
  // secret greenhouse
  {
    id: 'char-viola',
    ipId: 'ip-secret-greenhouse',
    name: '비올라 드 카멜리아',
    role: '영애 / 마법 식물학자',
    description: '명문 공작가의 당찬 상속녀. 온실에서 진귀한 꽃을 키우는 천재 조향사.',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="20" fill="#831843"/>
        <circle cx="100" cy="85" r="45" fill="#FFF1F2"/>
        <!-- 금발 풍성 웨이브 -->
        <path d="M 45 75 Q 100 15 155 75 Q 165 140 135 125 Q 100 60 65 125 Z" fill="#FDE047"/>
        <ellipse cx="85" cy="85" rx="5" ry="7" fill="#BE185D"/>
        <ellipse cx="115" cy="85" rx="5" ry="7" fill="#BE185D"/>
        <!-- 로즈 드레스 -->
        <path d="M 55 180 C 65 130 135 130 145 180 Z" fill="#FB7185"/>
      </svg>
    `),
    tags: ['금발', '로판여주', '당차고밝음', '장미']
  },
  {
    id: 'char-cassian',
    ipId: 'ip-secret-greenhouse',
    name: '카시안 베일',
    role: '수석 집사 / 비밀 요원',
    description: '완벽한 매너 뒤에 제국 첩보국의 비밀을 숨긴 수수께끼의 흑발 집사.',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="20" fill="#042F2E"/>
        <circle cx="100" cy="85" r="45" fill="#F8FAFC"/>
        <path d="M 50 75 Q 100 25 150 75 Q 140 110 120 100 Q 100 60 80 100 Z" fill="#0F172A"/>
        <ellipse cx="85" cy="85" rx="5" ry="7" fill="#0D9488"/>
        <ellipse cx="115" cy="85" rx="5" ry="7" fill="#0D9488"/>
        <!-- 제비꼬리 연미복 -->
        <path d="M 60 180 C 70 135 130 135 140 180 Z" fill="#0F172A"/>
        <polygon points="100,140 95,160 105,160" fill="#BE123C"/>
      </svg>
    `),
    tags: ['흑발', '집사', '정장', '녹안']
  },
  // underdog high
  {
    id: 'char-taeo',
    ipId: 'ip-underdog-high',
    name: '강태오',
    role: '주인공 / 옥상의 불사조',
    description: '불의를 보면 참지 못하는 복서. 한번 싸우면 끝까지 일어서는 불굴의 의지.',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="20" fill="#18181B"/>
        <circle cx="100" cy="85" r="45" fill="#FED7AA"/>
        <path d="M 55 75 Q 100 30 145 75 Q 135 95 110 90 Q 100 65 90 90 Z" fill="#78350F"/>
        <!-- 밴드 스티커 -->
        <rect x="80" y="80" width="16" height="5" rx="2" fill="#FFFFFF" transform="rotate(-15 88 82)"/>
        <ellipse cx="85" cy="88" rx="5" ry="6" fill="#18181B"/>
        <ellipse cx="115" cy="88" rx="5" ry="6" fill="#18181B"/>
        <!-- 후드티 -->
        <path d="M 55 180 C 65 135 135 135 145 180 Z" fill="#EA580C"/>
      </svg>
    `),
    tags: ['복서', '상처밴드', '액션', '불사조']
  },
  // moon rabbit
  {
    id: 'char-moon-rabbit',
    ipId: 'ip-moon-rabbit-attic',
    name: '달묘 (Moon Bunny)',
    role: '토끼 파티시에',
    description: '달콤한 마카롱과 따뜻한 홍차를 만드는 포근한 힐러. 말랑말랑한 귀가 매력 포인트.',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
        <rect width="200" height="200" rx="20" fill="#FAF5FF"/>
        <!-- 토끼 귀 -->
        <ellipse cx="80" cy="55" rx="14" ry="32" fill="#FFFFFF" stroke="#E9D5FF" stroke-width="2"/>
        <ellipse cx="80" cy="55" rx="7" ry="18" fill="#FBCFE8"/>
        <ellipse cx="120" cy="55" rx="14" ry="32" fill="#FFFFFF" stroke="#E9D5FF" stroke-width="2"/>
        <ellipse cx="120" cy="55" rx="7" ry="18" fill="#FBCFE8"/>
        <circle cx="100" cy="110" r="45" fill="#FFFFFF" stroke="#E9D5FF" stroke-width="2"/>
        <circle cx="88" cy="105" r="4" fill="#374151"/>
        <circle cx="112" cy="105" r="4" fill="#374151"/>
        <path d="M 96 115 Q 100 119 104 115" stroke="#374151" stroke-width="2" fill="none"/>
        <ellipse cx="80" cy="116" rx="6" ry="3" fill="#FDA4AF" opacity="0.7"/>
        <ellipse cx="120" cy="116" rx="6" ry="3" fill="#FDA4AF" opacity="0.7"/>
        <!-- 셰프 모자 -->
        <polygon points="100,60 90,75 110,75" fill="#FDE047"/>
      </svg>
    `),
    tags: ['토끼', '힐링', '파티시에', '귀여움']
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-photocard',
    name: '포토카드 (Photo Card)',
    slug: 'photocard',
    category: 'PHOTOCARD',
    description: '아이돌/웹툰 팬덤 필수 굿즈! 표준 55x85mm 규격으로 지갑이나 바인더에 쏙 들어가는 프리미엄 카드',
    widthMm: 55,
    heightMm: 85,
    bleedMm: 2, // 상하좌우 2mm 여백
    safeMarginMm: 3, // 안전영역 3mm 안쪽
    dpi: 300,
    basePrice: 1000,
    kioskAvailable: true,
    deliveryAvailable: true,
    mockupUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 340" width="220" height="340">
        <rect x="10" y="10" width="200" height="320" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
        <rect x="20" y="20" width="180" height="240" rx="8" fill="#EEF2FF"/>
        <circle cx="110" cy="120" r="40" fill="#C7D2FE"/>
        <rect x="30" y="280" width="100" height="12" rx="4" fill="#E2E8F0"/>
        <rect x="30" y="300" width="60" height="8" rx="4" fill="#F1F5F9"/>
      </svg>
    `),
    specs: {
      paperRecommendation: '스노우지 250g / 홀로그램 페트',
      finishOptions: ['기본 유광코팅', '벨벳 무광코팅', '스파클링 홀로그램', '유리조각 홀로그램'],
      turnaroundTime: '키오스크 즉시 출력(1분) / 택배 제작 1~2일'
    }
  },
  {
    id: 'prod-postcard',
    name: '일러스트 엽서 (Art Postcard)',
    slug: 'postcard',
    category: 'POSTCARD',
    description: '고화질 웹툰 일러스트를 소장하는 4x6 표준 엽서 규격(100x148mm)',
    widthMm: 100,
    heightMm: 148,
    bleedMm: 2,
    safeMarginMm: 4,
    dpi: 300,
    basePrice: 2000,
    kioskAvailable: true,
    deliveryAvailable: true,
    mockupUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 355" width="240" height="355">
        <rect x="10" y="10" width="220" height="335" rx="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="25" y="25" width="190" height="250" fill="#F8FAFC"/>
        <polygon points="120,80 160,180 80,180" fill="#CBD5E1"/>
        <rect x="25" y="295" width="120" height="12" fill="#E2E8F0"/>
      </svg>
    `),
    specs: {
      paperRecommendation: '랑데뷰 내츄럴 240g / 아르떼 300g',
      finishOptions: ['기본 무광 인쇄', '금박 엣지 후가공', '에폭시 엠보싱'],
      turnaroundTime: '키오스크 즉시 출력(2분) / 택배 제작 2일'
    }
  },
  {
    id: 'prod-sticker',
    name: '다이어리 스티커팩 (Sticker Sheet)',
    slug: 'sticker',
    category: 'STICKER',
    description: 'A6 사이즈(105x148mm)에 아기자기한 캐릭터와 엠블럼이 칼선으로 정밀 가공된 스티커',
    widthMm: 105,
    heightMm: 148,
    bleedMm: 3,
    safeMarginMm: 4,
    dpi: 300,
    basePrice: 3500,
    kioskAvailable: false, // 스티커는 칼선 공정으로 택배만 지원
    deliveryAvailable: true,
    mockupUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 350" width="250" height="350">
        <rect x="10" y="10" width="230" height="330" rx="8" fill="#FEFCE8" stroke="#FDE047" stroke-width="2"/>
        <circle cx="65" cy="70" r="30" fill="#FEF08A" stroke="#CA8A04" stroke-dasharray="4,4"/>
        <circle cx="155" cy="70" r="30" fill="#FEF08A" stroke="#CA8A04" stroke-dasharray="4,4"/>
        <rect x="35" y="130" width="70" height="70" rx="8" fill="#FBCFE8" stroke="#DB2777" stroke-dasharray="4,4"/>
        <polygon points="155,130 185,190 125,190" fill="#BAE6FD" stroke="#0284C7" stroke-dasharray="4,4"/>
      </svg>
    `),
    specs: {
      paperRecommendation: '아트지 80g / 유포지 방수 스티커',
      finishOptions: ['무광 코팅(다이어리용)', '유광 코팅(방수용)', '오로라 홀로그램'],
      turnaroundTime: '전문 칼선 가공 후 택배 발송 (2~3일)'
    }
  },
  {
    id: 'prod-acrylic',
    name: '아크릴 디오라마 키링 (Acrylic Standee)',
    slug: 'acrylic',
    category: 'ACRYLIC',
    description: '투명하고 영롱한 3mm 고강도 아크릴로 제작되는 최애 캐릭터 스탠드 및 키링',
    widthMm: 60,
    heightMm: 80,
    bleedMm: 2,
    safeMarginMm: 3,
    dpi: 300,
    basePrice: 6500,
    kioskAvailable: false,
    deliveryAvailable: true,
    mockupUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250" width="200" height="250">
        <circle cx="100" cy="30" r="10" fill="none" stroke="#94A3B8" stroke-width="4"/>
        <rect x="40" y="50" width="120" height="150" rx="20" fill="#F0FDFA" stroke="#2DD4BF" stroke-width="3" opacity="0.8"/>
        <circle cx="100" cy="110" r="35" fill="#99F6E4"/>
        <ellipse cx="100" cy="225" rx="60" ry="15" fill="#E2E8F0"/>
      </svg>
    `),
    specs: {
      paperRecommendation: '국산 3mm 양면 투명 아크릴',
      finishOptions: ['볼체인 은색', '하트형 금색 키링', '원형 자립 받침대 포함'],
      turnaroundTime: 'UV 정밀 인쇄 및 레이저 커팅 (3~4일)'
    }
  }
];

export const MOCK_DESIGN_ASSETS: DesignAsset[] = [
  // Characters
  {
    id: 'asset-ray-figure',
    ipId: 'ip-stella-knight',
    characterId: 'char-ray',
    name: '레이 - 시공검 발도 포즈',
    type: 'CHARACTER',
    assetUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <!-- 은발 레이 전신 일러스트 -->
        <circle cx="150" cy="110" r="50" fill="#E2E8F0"/>
        <path d="M 95 100 Q 150 40 205 100 Q 195 150 175 135 Q 150 85 125 135 Z" fill="#94A3B8"/>
        <ellipse cx="135" cy="110" rx="6" ry="9" fill="#38BDF8"/>
        <ellipse cx="165" cy="110" rx="6" ry="9" fill="#38BDF8"/>
        <!-- 갑주 몸통 -->
        <path d="M 110 160 L 190 160 L 175 280 L 125 280 Z" fill="#1E293B"/>
        <polygon points="150,165 140,210 160,210" fill="#38BDF8"/>
        <!-- 광선검 -->
        <polygon points="210,90 230,340 215,340 195,90" fill="#38BDF8" opacity="0.9"/>
      </svg>
    `),
    tags: ['성기사', '레이', '전신', '시공검']
  },
  {
    id: 'asset-viola-rose',
    ipId: 'ip-secret-greenhouse',
    characterId: 'char-viola',
    name: '비올라 - 찻잔을 든 우아한 미소',
    type: 'CHARACTER',
    assetUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <circle cx="150" cy="110" r="50" fill="#FFF1F2"/>
        <path d="M 85 95 Q 150 35 215 95 Q 225 170 190 150 Q 150 75 110 150 Z" fill="#FDE047"/>
        <ellipse cx="135" cy="110" rx="5" ry="8" fill="#BE185D"/>
        <ellipse cx="165" cy="110" rx="5" ry="8" fill="#BE185D"/>
        <path d="M 95 160 C 105 160 195 160 205 160 L 230 320 L 70 320 Z" fill="#FB7185"/>
        <!-- 찻잔 -->
        <ellipse cx="150" cy="220" rx="20" ry="12" fill="#FFFFFF" stroke="#F43F5E" stroke-width="3"/>
      </svg>
    `),
    tags: ['비올라', '로판', '찻잔', '드레스']
  },
  {
    id: 'asset-rabbit-chef',
    ipId: 'ip-moon-rabbit-attic',
    characterId: 'char-moon-rabbit',
    name: '달묘 - 딸기 케이크 서빙',
    type: 'CHARACTER',
    assetUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
        <!-- 토끼 귀 -->
        <ellipse cx="125" cy="70" rx="18" ry="40" fill="#FFFFFF" stroke="#DDD6FE" stroke-width="3"/>
        <ellipse cx="125" cy="70" rx="9" ry="22" fill="#FBCFE8"/>
        <ellipse cx="175" cy="70" rx="18" ry="40" fill="#FFFFFF" stroke="#DDD6FE" stroke-width="3"/>
        <ellipse cx="175" cy="70" rx="9" ry="22" fill="#FBCFE8"/>
        <!-- 얼굴 -->
        <circle cx="150" cy="140" r="55" fill="#FFFFFF" stroke="#DDD6FE" stroke-width="3"/>
        <circle cx="135" cy="135" r="5" fill="#374151"/>
        <circle cx="165" cy="135" r="5" fill="#374151"/>
        <path d="M 145 145 Q 150 150 155 145" stroke="#374151" stroke-width="3" fill="none"/>
        <ellipse cx="125" cy="148" rx="8" ry="4" fill="#FDA4AF" opacity="0.8"/>
        <ellipse cx="175" cy="148" rx="8" ry="4" fill="#FDA4AF" opacity="0.8"/>
        <!-- 몸통 & 딸기 케이크 -->
        <circle cx="150" cy="230" r="45" fill="#FFFFFF" stroke="#DDD6FE" stroke-width="3"/>
        <rect x="120" y="240" width="60" height="35" rx="6" fill="#FEE2E2" stroke="#EF4444" stroke-width="2"/>
        <circle cx="150" cy="235" r="8" fill="#DC2626"/>
      </svg>
    `),
    tags: ['달묘', '케이크', '귀여움', 'SD']
  },
  // Stickers
  {
    id: 'asset-sticker-sparkle',
    ipId: 'ip-stella-knight',
    name: '은하계 홀로그램 스파클',
    type: 'STICKER',
    assetUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" fill="#38BDF8"/>
        <circle cx="50" cy="50" r="8" fill="#FFFFFF"/>
      </svg>
    `),
    tags: ['반짝이', '별', 'SF']
  },
  {
    id: 'asset-sticker-heart-ribbon',
    ipId: 'ip-secret-greenhouse',
    name: '앤틱 로즈 리본',
    type: 'STICKER',
    assetUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="120" height="100">
        <circle cx="60" cy="40" r="15" fill="#E11D48"/>
        <path d="M 60 40 Q 20 10 15 45 Q 20 70 60 45" fill="#FB7185"/>
        <path d="M 60 40 Q 100 10 105 45 Q 100 70 60 45" fill="#FB7185"/>
        <path d="M 50 45 L 30 85 M 70 45 L 90 85" stroke="#BE123C" stroke-width="6" stroke-linecap="round"/>
      </svg>
    `),
    tags: ['리본', '하트', '로맨스']
  },
  {
    id: 'asset-sticker-best-cut',
    ipId: 'ip-underdog-high',
    name: '명장면 BEST CUT 스탬프',
    type: 'STICKER',
    assetUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="160" height="80">
        <rect x="5" y="5" width="150" height="70" rx="8" fill="#EA580C" stroke="#FACC15" stroke-width="4"/>
        <text x="80" y="35" font-family="sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle">★ BEST CUT ★</text>
        <text x="80" y="58" font-family="sans-serif" font-weight="700" font-size="12" fill="#FEF08A" text-anchor="middle">OFFICIAL SCENE</text>
      </svg>
    `),
    tags: ['스탬프', '명장면', '베스트']
  },
  // Frames
  {
    id: 'asset-frame-polaroid',
    ipId: 'ip-stella-knight',
    name: '모던 화이트 폴라로이드',
    type: 'FRAME',
    assetUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">
        <rect width="300" height="450" fill="none" stroke="#FFFFFF" stroke-width="24"/>
        <rect x="0" y="340" width="300" height="110" fill="#FFFFFF"/>
        <line x1="40" y1="390" x2="260" y2="390" stroke="#E2E8F0" stroke-width="2" stroke-dasharray="4,4"/>
      </svg>
    `),
    tags: ['폴라로이드', '화이트', '프레임']
  },
  {
    id: 'asset-frame-hologram',
    ipId: 'ip-stella-knight',
    name: '네온 홀로그램 엣지',
    type: 'FRAME',
    assetUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">
        <defs>
          <linearGradient id="holoEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38BDF8"/>
            <stop offset="50%" stop-color="#C084FC"/>
            <stop offset="100%" stop-color="#F472B6"/>
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="284" height="434" rx="14" fill="none" stroke="url(#holoEdge)" stroke-width="8"/>
        <circle cx="20" cy="20" r="4" fill="#FFFFFF"/>
        <circle cx="280" cy="20" r="4" fill="#FFFFFF"/>
        <circle cx="20" cy="430" r="4" fill="#FFFFFF"/>
        <circle cx="280" cy="430" r="4" fill="#FFFFFF"/>
      </svg>
    `),
    tags: ['홀로그램', '네온', '사이버']
  },
  // Speech Bubbles
  {
    id: 'asset-bubble-shout',
    ipId: 'ip-underdog-high',
    name: '액션 샤우트 말풍선',
    type: 'SPEECH_BUBBLE',
    assetUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="200" height="120">
        <polygon points="20,20 40,5 90,15 140,5 170,25 190,55 175,85 130,95 80,115 75,90 25,80 10,50" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
      </svg>
    `),
    tags: ['말풍선', '외침', '만화']
  }
];

export const MOCK_LICENSES: License[] = [
  {
    id: 'lic-stella',
    ipId: 'ip-stella-knight',
    licenseNumber: 'TOON-LIC-2026-0089',
    holderName: '(주)스텔라스튜디오 & 아스트라',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    royaltyRate: 0.15, // 15%
    allowedProducts: ['PHOTOCARD', 'POSTCARD', 'STICKER', 'ACRYLIC'],
    status: 'ACTIVE'
  },
  {
    id: 'lic-greenhouse',
    ipId: 'ip-secret-greenhouse',
    licenseNumber: 'TOON-LIC-2025-0412',
    holderName: '로잘린엔터테인먼트',
    startDate: '2025-06-01',
    endDate: '2026-12-31',
    royaltyRate: 0.18, // 18%
    allowedProducts: ['PHOTOCARD', 'POSTCARD', 'STICKER'],
    status: 'ACTIVE'
  },
  {
    id: 'lic-underdog',
    ipId: 'ip-underdog-high',
    licenseNumber: 'TOON-LIC-2026-0144',
    holderName: '스튜디오 강철',
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    royaltyRate: 0.12, // 12%
    allowedProducts: ['PHOTOCARD', 'POSTCARD', 'STICKER', 'ACRYLIC'],
    status: 'ACTIVE'
  },
  {
    id: 'lic-moon-rabbit',
    ipId: 'ip-moon-rabbit-attic',
    licenseNumber: 'TOON-LIC-2025-0920',
    holderName: '솜사탕공방',
    startDate: '2025-09-01',
    endDate: '2027-08-31',
    royaltyRate: 0.15,
    allowedProducts: ['PHOTOCARD', 'POSTCARD', 'STICKER'],
    status: 'ACTIVE'
  }
];

export const MOCK_TEMPLATES: ProductTemplate[] = [
  {
    id: 'tpl-stella-classic',
    productId: 'prod-photocard',
    ipId: 'ip-stella-knight',
    name: '스텔라 성기사 클래식 포토카드',
    previewUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 310" width="200" height="310">
        <rect width="200" height="310" rx="10" fill="#0B1329"/>
        <circle cx="100" cy="120" r="50" fill="#38BDF8" opacity="0.3"/>
        <text x="100" y="270" font-family="sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">RAY ASTER</text>
        <text x="100" y="285" font-family="sans-serif" font-size="9" fill="#94A3B8" text-anchor="middle">STELLA KNIGHT #01</text>
      </svg>
    `),
    frameType: 'HOLOGRAM_EDGES',
    defaultElements: [
      {
        id: 'el-bg-1',
        type: 'image',
        src: MOCK_DESIGN_ASSETS[0].assetUrl, // ray
        name: '레이 일러스트',
        x: 15,
        y: 20,
        width: 170,
        height: 220,
        rotation: 0,
        zIndex: 1,
        opacity: 1
      },
      {
        id: 'el-sparkle-1',
        type: 'sticker',
        src: MOCK_DESIGN_ASSETS[3].assetUrl, // sparkle
        name: '스파클',
        x: 130,
        y: 40,
        width: 45,
        height: 45,
        rotation: 15,
        zIndex: 2,
        opacity: 0.9
      },
      {
        id: 'el-title-1',
        type: 'text',
        text: 'RAY ASTER',
        fontFamily: 'sans-serif',
        fontSize: 16,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        x: 20,
        y: 250,
        width: 160,
        height: 25,
        rotation: 0,
        zIndex: 3,
        opacity: 1
      }
    ]
  },
  {
    id: 'tpl-greenhouse-rose',
    productId: 'prod-photocard',
    ipId: 'ip-secret-greenhouse',
    name: '황실 로즈 골드 에디션',
    previewUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 310" width="200" height="310">
        <rect width="200" height="310" rx="10" fill="#831843"/>
        <rect x="10" y="10" width="180" height="290" rx="8" fill="none" stroke="#FDE047" stroke-width="2"/>
        <text x="100" y="275" font-family="sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">VIOLA DE CAMELLIA</text>
      </svg>
    `),
    frameType: 'ROSE_GOLD',
    defaultElements: [
      {
        id: 'el-viola-1',
        type: 'image',
        src: MOCK_DESIGN_ASSETS[1].assetUrl, // viola
        name: '비올라 일러스트',
        x: 15,
        y: 25,
        width: 170,
        height: 215,
        rotation: 0,
        zIndex: 1,
        opacity: 1
      },
      {
        id: 'el-ribbon-1',
        type: 'sticker',
        src: MOCK_DESIGN_ASSETS[4].assetUrl, // ribbon
        name: '리본',
        x: 20,
        y: 30,
        width: 50,
        height: 45,
        rotation: -10,
        zIndex: 2,
        opacity: 1
      },
      {
        id: 'el-viola-text',
        type: 'text',
        text: 'Secret Greenhouse',
        fontFamily: 'serif',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FDE047',
        textAlign: 'center',
        x: 20,
        y: 255,
        width: 160,
        height: 25,
        rotation: 0,
        zIndex: 3,
        opacity: 1
      }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-20261026-001',
    orderNumber: 'TC-20261026-9481',
    userId: 'user-1',
    userName: '김웹툰 (굿즈러버)',
    fulfillmentType: 'KIOSK',
    itemCount: 2,
    totalAmount: 2000,
    discountAmount: 0,
    shippingFee: 0,
    finalAmount: 2000,
    status: 'READY_FOR_PICKUP',
    createdAt: '2026-10-26T14:10:00Z',
    updatedAt: '2026-10-26T14:12:00Z',
    items: [
      {
        id: 'item-1',
        orderId: 'ord-20261026-001',
        projectId: 'proj-demo-1',
        projectTitle: '스텔라 성기사 레이 홀로그램 포카',
        productId: 'prod-photocard',
        productName: '포토카드 (Photo Card)',
        ipId: 'ip-stella-knight',
        ipTitle: '스텔라 나이트: 은하의 성기사',
        previewUrl: MOCK_TEMPLATES[0].previewUrl,
        quantity: 2,
        unitPrice: 1000,
        options: {
          paperType: '스노우지 250g',
          coating: '스파클링 홀로그램'
        }
      }
    ],
    printJob: {
      id: 'pj-9481',
      orderId: 'ord-20261026-001',
      orderNumber: 'TC-20261026-9481',
      printCode: '748-2918',
      expiresAt: '2026-10-29T14:10:00Z', // 72시간
      isPrinted: false,
      previewUrl: MOCK_TEMPLATES[0].previewUrl
    },
    payment: {
      id: 'pay-001',
      orderId: 'ord-20261026-001',
      method: 'TOSSPAY',
      amount: 2000,
      status: 'PAID',
      transactionId: 'toss_sim_983194',
      paidAt: '2026-10-26T14:12:00Z'
    }
  },
  {
    id: 'ord-20261025-002',
    orderNumber: 'TC-20261025-4120',
    userId: 'user-1',
    userName: '김웹툰 (굿즈러버)',
    fulfillmentType: 'DELIVERY',
    itemCount: 1,
    totalAmount: 3500,
    discountAmount: 0,
    shippingFee: 3000,
    finalAmount: 6500,
    status: 'SHIPPED',
    createdAt: '2026-10-25T11:00:00Z',
    updatedAt: '2026-10-26T09:00:00Z',
    items: [
      {
        id: 'item-2',
        orderId: 'ord-20261025-002',
        projectId: 'proj-demo-2',
        projectTitle: '달묘의 다락방 스티커팩 세트',
        productId: 'prod-sticker',
        productName: '다이어리 스티커팩 (Sticker Sheet)',
        ipId: 'ip-moon-rabbit-attic',
        ipTitle: '달묘의 다락방 티타임',
        previewUrl: MOCK_WEBTOON_IPS[3].thumbnailUrl,
        quantity: 1,
        unitPrice: 3500,
        options: {
          paperType: '유포지 방수 스티커',
          coating: '무광 코팅(다이어리용)'
        }
      }
    ],
    shipment: {
      id: 'shp-002',
      orderId: 'ord-20261025-002',
      recipient: '김웹툰',
      phone: '010-1234-5678',
      address: '서울특별시 마포구 월드컵북로 400',
      detailAddress: '8층 웹툰스튜디오',
      postalCode: '03925',
      carrier: 'CJ대한통운',
      trackingNumber: '6849-1029-3841',
      status: 'SHIPPED',
      shippedAt: '2026-10-26T09:00:00Z'
    },
    payment: {
      id: 'pay-002',
      orderId: 'ord-20261025-002',
      method: 'KAKAOPAY',
      amount: 6500,
      status: 'PAID',
      transactionId: 'kakao_sim_827192',
      paidAt: '2026-10-25T11:02:00Z'
    }
  }
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 'set-202610-01',
    ipId: 'ip-stella-knight',
    ipTitle: '스텔라 나이트: 은하의 성기사',
    period: '2026년 10월',
    totalOrders: 1420,
    totalRevenue: 2840000,
    royaltyRate: 0.15,
    royaltyAmount: 426000,
    status: 'CONFIRMED'
  },
  {
    id: 'set-202610-02',
    ipId: 'ip-secret-greenhouse',
    ipTitle: '황실의 비밀 온실과 집사들',
    period: '2026년 10월',
    totalOrders: 2190,
    totalRevenue: 4380000,
    royaltyRate: 0.18,
    royaltyAmount: 788400,
    status: 'CONFIRMED'
  },
  {
    id: 'set-202610-03',
    ipId: 'ip-underdog-high',
    ipTitle: '언더독 하이: 옥상의 불사조',
    period: '2026년 10월',
    totalOrders: 850,
    totalRevenue: 1700000,
    royaltyRate: 0.12,
    royaltyAmount: 204000,
    status: 'PENDING'
  },
  {
    id: 'set-202610-04',
    ipId: 'ip-moon-rabbit-attic',
    ipTitle: '달묘의 다락방 티타임',
    period: '2026년 10월',
    totalOrders: 1980,
    totalRevenue: 3960000,
    royaltyRate: 0.15,
    royaltyAmount: 594000,
    status: 'PENDING'
  }
];
