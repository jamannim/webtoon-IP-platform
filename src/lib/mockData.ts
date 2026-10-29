import { WebtoonIP, Character, License, Product, ProductTemplate, DesignAsset, User, Order, Settlement, AuditLog } from '@/types';

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
    points: 2400,
    status: 'ACTIVE',
    provider: 'KAKAO',
    totalOrdersCount: 8,
    totalSpendAmount: 64000,
    mergedGuestOrdersCount: 2,
    lastLoginAt: '2026-10-29T09:30:00Z',
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
    points: 12000,
    status: 'ACTIVE',
    provider: 'EMAIL',
    totalOrdersCount: 15,
    totalSpendAmount: 180000,
    lastLoginAt: '2026-10-28T16:00:00Z',
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
    points: 99999,
    status: 'ACTIVE',
    provider: 'EMAIL',
    totalOrdersCount: 0,
    totalSpendAmount: 0,
    lastLoginAt: '2026-10-29T10:00:00Z',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    email: 'nayoung@naver.com',
    name: '이나영 (화산귀환 진심팬)',
    role: 'USER',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#10B981"/>
        <circle cx="50" cy="40" r="20" fill="#FFFFFF"/>
        <path d="M 20 85 C 25 65, 75 65, 80 85 Z" fill="#FFFFFF"/>
      </svg>
    `),
    phone: '010-3344-5566',
    points: 1500,
    status: 'ACTIVE',
    provider: 'NAVER',
    totalOrdersCount: 5,
    totalSpendAmount: 42000,
    lastLoginAt: '2026-10-29T08:15:00Z',
    createdAt: '2026-02-10T11:20:00Z'
  },
  {
    id: 'user-3',
    email: 'photocard.park@gmail.com',
    name: '박성진 (포카수집가)',
    role: 'USER',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#3B82F6"/>
        <circle cx="50" cy="40" r="20" fill="#FFFFFF"/>
        <path d="M 20 85 C 25 65, 75 65, 80 85 Z" fill="#FFFFFF"/>
      </svg>
    `),
    phone: '010-7788-9900',
    points: 800,
    status: 'ACTIVE',
    provider: 'GOOGLE',
    totalOrdersCount: 12,
    totalSpendAmount: 116000,
    lastLoginAt: '2026-10-28T22:40:00Z',
    createdAt: '2026-03-01T14:00:00Z'
  },
  {
    id: 'user-4',
    email: 'jimin_c@kakao.com',
    name: '최지민 (신규가입자)',
    role: 'USER',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#F59E0B"/>
        <circle cx="50" cy="40" r="20" fill="#FFFFFF"/>
        <path d="M 20 85 C 25 65, 75 65, 80 85 Z" fill="#FFFFFF"/>
      </svg>
    `),
    phone: '010-5566-7788',
    points: 1000,
    status: 'ACTIVE',
    provider: 'KAKAO',
    totalOrdersCount: 1,
    totalSpendAmount: 9000,
    lastLoginAt: '2026-10-29T07:10:00Z',
    createdAt: '2026-10-28T18:20:00Z'
  },
  {
    id: 'user-5',
    email: 'haneul.sky@naver.com',
    name: '정하늘 (비회원 이관회원)',
    role: 'USER',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#06B6D4"/>
        <circle cx="50" cy="40" r="20" fill="#FFFFFF"/>
        <path d="M 20 85 C 25 65, 75 65, 80 85 Z" fill="#FFFFFF"/>
      </svg>
    `),
    phone: '010-9988-7766',
    points: 1100,
    status: 'ACTIVE',
    provider: 'NAVER',
    totalOrdersCount: 3,
    totalSpendAmount: 27000,
    mergedGuestOrdersCount: 1,
    lastLoginAt: '2026-10-29T02:00:00Z',
    createdAt: '2026-10-27T12:00:00Z'
  },
  {
    id: 'user-6',
    email: 'suspicious@fake.net',
    name: '강민우 (부정이용 의심)',
    role: 'USER',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#EF4444"/>
        <circle cx="50" cy="40" r="20" fill="#FFFFFF"/>
        <path d="M 20 85 C 25 65, 75 65, 80 85 Z" fill="#FFFFFF"/>
      </svg>
    `),
    phone: '010-0000-1111',
    points: 0,
    status: 'SUSPENDED',
    provider: 'EMAIL',
    totalOrdersCount: 2,
    totalSpendAmount: 18000,
    lastLoginAt: '2026-10-25T13:12:00Z',
    createdAt: '2026-10-24T09:00:00Z'
  },
  {
    id: 'user-7',
    email: 'seoa.yoon@kakao.com',
    name: '윤서아 (나혼렙 매니아)',
    role: 'USER',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#8B5CF6"/>
        <circle cx="50" cy="40" r="20" fill="#FFFFFF"/>
        <path d="M 20 85 C 25 65, 75 65, 80 85 Z" fill="#FFFFFF"/>
      </svg>
    `),
    phone: '010-2233-4455',
    points: 3500,
    status: 'ACTIVE',
    provider: 'KAKAO',
    totalOrdersCount: 9,
    totalSpendAmount: 78000,
    lastLoginAt: '2026-10-29T09:45:00Z',
    createdAt: '2026-04-12T16:30:00Z'
  },
  {
    id: 'user-8',
    email: 'doyun.kiosk@gmail.com',
    name: '한도윤 (키오스크 러버)',
    role: 'USER',
    avatarUrl: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r="50" fill="#14B8A6"/>
        <circle cx="50" cy="40" r="20" fill="#FFFFFF"/>
        <path d="M 20 85 C 25 65, 75 65, 80 85 Z" fill="#FFFFFF"/>
      </svg>
    `),
    phone: '010-6677-8899',
    points: 2000,
    status: 'ACTIVE',
    provider: 'GOOGLE',
    totalOrdersCount: 6,
    totalSpendAmount: 48000,
    lastLoginAt: '2026-10-29T08:50:00Z',
    createdAt: '2026-05-18T10:15:00Z'
  }
];

export const MOCK_WEBTOON_IPS: WebtoonIP[] = [
  {
    id: 'ip-ranker-return',
    title: '랭커의 귀환',
    author: '영비타 / 박영석',
    genre: '현대 판타지',
    description: '가상현실 게임 아레나의 최강 랭커 밀리, 모든 것을 잃고 밑바닥에서 다시 시작하는 통쾌한 랭커의 귀환기!',
    summary: '누적 1.2억 뷰 신화! 아레나 랭킹 1위의 귀환과 쾌감 넘치는 성장 액션',
    thumbnailUrl: '/images/webtoons/ranker-return.webp',
    bannerUrl: '/images/webtoons/ranker-return.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 4,
    likesCount: 98000,
    releaseYear: 2021,
  },
  {
    id: 'ip-twin-siblings',
    title: '쌍둥이 남매의 뉴라이프',
    author: '피다 / 조아라',
    genre: '로맨스 판타지',
    description: '비극적인 삶을 마감하고 버림받은 황실의 쌍둥이로 태어난 아리엔과 알렉센, 서로를 지키며 성장하는 따스한 황실 힐링기',
    summary: '카카오페이지 로판 대작! 서로가 유일한 세상이었던 쌍둥이 남매의 치유와 모험',
    thumbnailUrl: '/images/webtoons/twin-siblings.webp',
    bannerUrl: '/images/webtoons/twin-siblings.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 87000,
    releaseYear: 2020,
  },
  {
    id: 'ip-daily-life',
    title: '일상생활 가능하세요?',
    author: '뱁새',
    genre: '힐링 일상',
    description: '덕질에 살고 덕질에 죽는 진성 덕후들의 현실 200% 공감 유쾌 발랄 일상 코미디',
    summary: '덕후라면 무조건 무릎을 탁 칠 리얼 공감 스토리와 캐릭터들의 귀여운 티키타카',
    thumbnailUrl: '/images/webtoons/daily-life.webp',
    bannerUrl: '/images/webtoons/daily-life.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 42000,
    releaseYear: 2022,
  },
  {
    id: 'ip-archmage-4000',
    title: '4000년만에 귀환한 대마도사',
    author: '낙하산 / 바나나 / 김덕용',
    genre: '무협/판타지',
    description: '반신 데미갓에게 봉인당했던 9클래스 대마도사 루카스 트로우맨, 4000년 후 최악의 낙제생 프레이의 몸으로 부활하다!',
    summary: '밀리언셀러 판타지! 데미갓을 향한 대마도사의 통쾌한 마법 복수극',
    thumbnailUrl: '/images/webtoons/archmage-4000.webp',
    bannerUrl: '/images/webtoons/archmage-4000.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 4,
    likesCount: 115000,
    releaseYear: 2020,
  },
  {
    id: 'ip-pendragon',
    title: '백룡공작 팬드래건',
    author: '유경원 / 구지 / 김형석',
    genre: '무협/판타지',
    description: '멸망 직전의 팬드래건 공작가와 백룡의 계약자 레이븐 발트, 가문의 영광을 되찾기 위한 전설적인 기사 서사시',
    summary: '압도적인 작화와 세계관! 백룡과 함께 전장을 누비는 공작의 전설',
    thumbnailUrl: '/images/webtoons/pendragon.webp',
    bannerUrl: '/images/webtoons/pendragon.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 76000,
    releaseYear: 2021,
  },
  {
    id: 'ip-worn-and-torn-newbie',
    title: '닳고닳은 뉴비',
    author: '수수 / 호박묵',
    genre: '현대 판타지',
    description: '가상현실 망겜에 15년을 바치고 파멸했던 이어진, 게임 오픈 베타 첫날로 회귀해 모든 히든 피스를 독식한다!',
    summary: '15년 썩은물이 뉴비 코스프레하고 서버를 씹어먹는 통쾌한 먼치킨 판타지',
    thumbnailUrl: '/images/webtoons/worn-and-torn-newbie.webp',
    bannerUrl: '/images/webtoons/worn-and-torn-newbie.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 68000,
    releaseYear: 2020,
  },
  {
    id: 'ip-daisy',
    title: '데이지 - 공작의 혼약자가 되는 법',
    author: '리사벨 / W / YUZU',
    genre: '로맨스 판타지',
    description: '배신과 비참한 죽음 끝에 과거로 회귀한 데이지, 냉혹한 킬리언 실베스턴 공작에게 3년 계약 약혼을 제안하다!',
    summary: '자립을 꿈꾸는 똑똑한 여주와 차가운 공작의 설레는 계약 로맨스',
    thumbnailUrl: '/images/webtoons/daisy.jpg',
    bannerUrl: '/images/webtoons/daisy.jpg',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 54000,
    releaseYear: 2020,
  },
  {
    id: 'ip-tomb-raider-king',
    title: '도굴왕',
    author: '산지직송 / 윤솔 / REDICE STUDIO',
    genre: '현대 판타지',
    description: '세상에 출현한 신의 무덤과 유물들, 배신당해 죽었던 도굴꾼 서주헌이 과거로 돌아와 모든 유물을 독점 도굴한다!',
    summary: '사이다 패왕 서주헌의 유물 독점기! 글로벌 누적 수억 뷰의 검증된 대작',
    thumbnailUrl: '/images/webtoons/tomb-raider-king.webp',
    bannerUrl: '/images/webtoons/tomb-raider-king.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 4,
    likesCount: 140000,
    releaseYear: 2019,
  },
  {
    id: 'ip-disaster-class-hero',
    title: '재앙급 영웅님이 귀환하셨다',
    author: '산지직송 / 이범 / REDICE STUDIO',
    genre: '현대 판타지',
    description: '인류를 구원했으나 동료 12영웅에게 배신당해 악마의 탑에 갇혔던 성투사 이건, 20년 만에 탈출하여 배신자들을 응징한다!',
    summary: '레드아이스 스튜디오 제작! 배신자 영웅들을 쓸어버리는 이건의 사이다 귀환',
    thumbnailUrl: '/images/webtoons/disaster-class-hero.webp',
    bannerUrl: '/images/webtoons/disaster-class-hero.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 92000,
    releaseYear: 2021,
  },
  {
    id: 'ip-iron-blooded-hound',
    title: '철혈검가 사냥개의 회귀',
    author: '설기 / 김수호',
    genre: '무협/판타지',
    description: '바스커빌 검가의 사냥개로 충성을 바쳤으나 토사구팽당해 단두대에서 목이 잘린 비키르, 갓난아기로 회귀해 주인을 물어뜯을 칼날을 간다!',
    summary: '냉혹하고 철저한 복수극! 바스커빌 가문의 운명을 뒤흔드는 사냥개의 귀환',
    thumbnailUrl: '/images/webtoons/iron-blooded-hound.webp',
    bannerUrl: '/images/webtoons/iron-blooded-hound.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 4,
    likesCount: 108000,
    releaseYear: 2023,
  },
  {
    id: 'ip-solo-leveling',
    title: '나 혼자만 레벨업',
    author: '추공 / DUBU(REDICE STUDIO)',
    genre: '현대 판타지',
    description: '인류 최약 병기로 불리던 E급 헌터 성진우, 이중 던전의 시련 끝에 나에게만 퀘스트 창이 보이기 시작했다!',
    summary: '전 세계 143억 뷰의 전설! K-웹툰 글로벌 신화의 주인공 성진우의 각성 서사',
    thumbnailUrl: '/images/webtoons/solo-leveling.webp',
    bannerUrl: '/images/webtoons/solo-leveling.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 5,
    likesCount: 350000,
    releaseYear: 2018,
  },
  {
    id: 'ip-duchess-50-tea-recipes',
    title: '공작부인의 50가지 티 레시피',
    author: '이지하 / 조효은',
    genre: '로맨스 판타지',
    description: '소심해서 무시당하던 공작부인 클로에에 빙의한 현대 직장인 박하진, 좋아하는 홍차를 무기로 제국 귀족들의 마음을 사로잡다!',
    summary: '따뜻한 차 한 잔으로 차가운 공작과 사교계를 녹이는 우아한 힐링 로맨스',
    thumbnailUrl: '/images/webtoons/duchess-50-tea-recipes.webp',
    bannerUrl: '/images/webtoons/duchess-50-tea-recipes.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 62000,
    releaseYear: 2019,
  },
  {
    id: 'ip-second-life-ranker',
    title: '두 번 사는 랭커',
    author: '사도연 / 농농',
    genre: '무협/판타지',
    description: '수년 전 사라졌던 쌍둥이 동생의 유품인 회중시계 속에 남겨진 기록. 동생을 배신한 자들을 처단하기 위해 연우는 태양의 탑을 오른다!',
    summary: '동생의 복수를 위해 탑을 지배하는 랭커 연우의 숨 막히는 복수 판타지',
    thumbnailUrl: '/images/webtoons/second-life-ranker.webp',
    bannerUrl: '/images/webtoons/second-life-ranker.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 4,
    likesCount: 125000,
    releaseYear: 2019,
  },
  {
    id: 'ip-volcanic-reincarnation',
    title: '화산전생',
    author: '정준 / 패왕',
    genre: '무협/판타지',
    description: '전란의 시대를 간신히 살아남아 후회 속에서 눈을 감은 화산파 장로 주서천, 소년 시절로 환생하여 피바람이 불 무림의 미래를 바꾼다!',
    summary: '정통 무협 환생물의 정점! 화산의 비검으로 전란을 잠재우는 주서천의 일대기',
    thumbnailUrl: '/images/webtoons/volcanic-reincarnation.webp',
    bannerUrl: '/images/webtoons/volcanic-reincarnation.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 71000,
    releaseYear: 2017,
  },
  {
    id: 'ip-magic-sword-king',
    title: '마검왕',
    author: '나민석 / 조민수',
    genre: '무협/판타지',
    description: '현대에서 평범하게 살던 고교생 이현재, 우연히 얻은 낡은 반지로 인해 무림의 세계로 넘어가 마검의 주인이 되다!',
    summary: '현대와 무림을 오가는 스케일 큰 이계 진입 무협의 교과서적 명작',
    thumbnailUrl: '/images/webtoons/magic-sword-king.webp',
    bannerUrl: '/images/webtoons/magic-sword-king.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 48000,
    releaseYear: 2014,
  },
  {
    id: 'ip-spirit-king-elqueeness',
    title: '정령왕 엘퀴네스',
    author: '이환 / 드림툰',
    genre: '무협/판타지',
    description: '불우하게 살다 억울한 사고로 사망한 한국 소년 강지훈, 이계의 최고위 물의 정령왕 엘퀴네스로 각성하여 가족과 동료를 만나다!',
    summary: '대한민국 판타지의 영원한 레전드! 물의 정령왕 엘퀴네스의 따스하고 웅장한 여정',
    thumbnailUrl: '/images/webtoons/spirit-king-elqueeness.webp',
    bannerUrl: '/images/webtoons/spirit-king-elqueeness.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 4,
    likesCount: 95000,
    releaseYear: 2017,
  },
  {
    id: 'ip-broken-constellation',
    title: '부서진 성좌의 회귀',
    author: '사도연 / 슬리피-C',
    genre: '무협/판타지',
    description: '신들의 신성한 황혼을 이끌다 나락에 빠져 신격을 잃은 성좌 이창선, 다시 밑바닥 인간 플레이어로 강림해 신좌를 되찾는다!',
    summary: '신들의 황혼 이창선의 거침없는 신좌 탈환기! 감각적인 연출과 파괴적인 액션',
    thumbnailUrl: '/images/webtoons/broken-constellation.webp',
    bannerUrl: '/images/webtoons/broken-constellation.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 88000,
    releaseYear: 2021,
  },
  {
    id: 'ip-marriage-business',
    title: '결혼 장사',
    author: 'KEN / 앤트스튜디오',
    genre: '로맨스 판타지',
    description: '사치스럽고 차가운 악처로 살다 비참하게 목숨을 잃은 비앙카, 18세로 회귀하여 무뚝뚝하지만 다정한 남편 자카리와 새로운 영지 생활을 시작한다!',
    summary: '압도적인 작화와 탄탄한 서사! 회귀 후 진정한 부부로 거듭나는 비앙카와 자카리의 로맨스',
    thumbnailUrl: '/images/webtoons/marriage-business.png',
    bannerUrl: '/images/webtoons/marriage-business.png',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 4,
    likesCount: 165000,
    releaseYear: 2022,
  },
  {
    id: 'ip-villainess-hourglass',
    title: '악녀는 모래시계를 되돌린다',
    author: '산소비 / 앤트스튜디오',
    genre: '로맨스 판타지',
    description: '의붓동생 미엘르의 계략에 빠져 처형당한 아리아, 신비한 모래시계의 힘으로 과거로 회귀하여 진정한 악녀가 되어 복수를 집행한다!',
    summary: '로판 복수극의 정수! 시간을 되돌리는 모래시계와 아리아의 치밀하고 아름다운 계략',
    thumbnailUrl: '/images/webtoons/villainess-hourglass.webp',
    bannerUrl: '/images/webtoons/villainess-hourglass.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 4,
    likesCount: 130000,
    releaseYear: 2020,
  },
  {
    id: 'ip-dungeon-reset',
    title: '던전 리셋',
    author: '다울 / 원트',
    genre: '현대 판타지',
    description: '한번 플레이하면 목숨을 걸어야 하는 던전 세계. 함정에 빠져 죽을 뻔한 순간 던전이 리셋되며 시스템의 오류로 살아남은 정다운의 유유자적 생존기!',
    summary: '흙 파고 함정 해체하고 던전을 집처럼 리모델링하는 정다운의 힐링 던전 라이프',
    thumbnailUrl: '/images/webtoons/dungeon-reset.webp',
    bannerUrl: '/images/webtoons/dungeon-reset.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 84000,
    releaseYear: 2020,
  },
  {
    id: 'ip-skeleton-soldier',
    title: '해골병사는 던전을 지키지 못했다',
    author: '소소리 / 앤트스튜디오',
    genre: '무협/판타지',
    description: '주인을 지키지 못하고 부서졌던 최하위 잡몹 해골병사, 기억을 간직한 채 20년 전 던전에서 되살아나 운명에 맞서 싸운다!',
    summary: '루프할 때마다 강해지는 뼈다귀의 눈물겨운 주인 지키기 대모험',
    thumbnailUrl: '/images/webtoons/skeleton-soldier.webp',
    bannerUrl: '/images/webtoons/skeleton-soldier.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 65000,
    releaseYear: 2018,
  },
  {
    id: 'ip-reincarnator',
    title: '전생자',
    author: '나민석 / SG',
    genre: '현대 판타지',
    description: '세상이 멸망하던 날, 유일하게 과거로 전생할 기회를 얻은 강태석. 1997년 IMF 외환위기 직전으로 돌아가 자본과 시스템으로 세계를 구원한다!',
    summary: '금융 경제와 레이드 판타지의 절묘한 결합! 전설의 1세대 회귀 레이드물',
    thumbnailUrl: '/images/webtoons/reincarnator.webp',
    bannerUrl: '/images/webtoons/reincarnator.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 59000,
    releaseYear: 2020,
  },
  {
    id: 'ip-god-webnovel',
    title: '신이 쓰는 웹소설',
    author: '나민채 / 넥스트레벨스튜디오',
    genre: '현대 판타지',
    description: '소설 속에 빙의했는데 설정도 줄거리도 아무것도 없다?! 신이 즉흥적으로 실시간 집필하는 기상천외한 소설 속에서 주인공 이환의 생존기!',
    summary: '나민채 작가의 메타픽션 명작! 신의 변덕과 설정 붕괴에 맞서는 이환의 유쾌한 판타지',
    thumbnailUrl: '/images/webtoons/god-webnovel.webp',
    bannerUrl: '/images/webtoons/god-webnovel.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 47000,
    releaseYear: 2023,
  },
  {
    id: 'ip-blacksmith-jig',
    title: '대장장이 지그',
    author: '갈치 / 박성진',
    genre: '현대 판타지',
    description: '가상현실 게임 배틀로드에서 광부로 시작해 최고봉 신화급 대장장이로 거듭난 지그, 그의 망치질 한 번에 대륙의 전황이 뒤바뀐다!',
    summary: '두드리고 벼릴 때마다 터지는 쾌감! 장인 정신 가득한 생산직 먼치킨의 전설',
    thumbnailUrl: '/images/webtoons/blacksmith-jig.webp',
    bannerUrl: '/images/webtoons/blacksmith-jig.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 39000,
    releaseYear: 2021,
  },
  {
    id: 'ip-drama',
    title: '드라마 (D.P 개의 날)',
    author: '김보통',
    genre: '드라마',
    description: '군무이탈체포조 D.P. 안준호와 한호열, 탈영할 수밖에 없었던 청춘들의 아픈 사연을 쫓으며 마주하는 현실의 먹먹한 기록',
    summary: '넷플릭스 오리지널 드라마 D.P. 원작! 대한민국 사회를 뒤흔든 김보통 작가의 휴먼 드라마',
    thumbnailUrl: '/images/webtoons/drama.webp',
    bannerUrl: '/images/webtoons/drama.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: false,
    charactersCount: 3,
    likesCount: 52000,
    releaseYear: 2015,
  },
  {
    id: 'ip-villainess-blind-date',
    title: '악녀의 맞선남이 너무 완벽하다',
    author: '차소희 / 하스민',
    genre: '로맨스 판타지',
    description: '시한부 악녀 엘레나로 빙의해 파혼당하려 나간 맞선 자리, 그런데 상대 맞선남이 완벽한 제국 제일의 공작님이라고?!',
    summary: '파혼하려다 제국 최고 완벽남에게 코 꿰여버린 악녀의 유쾌 달달 착각 로맨스',
    thumbnailUrl: '/images/webtoons/villainess-blind-date.webp',
    bannerUrl: '/images/webtoons/villainess-blind-date.webp',
    status: 'ACTIVE',
    officialBadge: true,
    featured: true,
    charactersCount: 3,
    likesCount: 78000,
    releaseYear: 2023
  }
];

export const MOCK_CHARACTERS: Character[] = [
  // stella knight
  {
    id: 'char-ray',
    ipId: 'ip-ranker-return',
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
    ipId: 'ip-ranker-return',
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
    ipId: 'ip-twin-siblings',
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
    ipId: 'ip-twin-siblings',
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
    ipId: 'ip-archmage-4000',
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
    ipId: 'ip-daily-life',
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

// 26개 전체 웹툰 IP 공식 대표 일러스트 에셋 매핑 (포토카드 캔버스 탑재용)
const WEBTOON_COVER_ASSETS: DesignAsset[] = MOCK_WEBTOON_IPS.map((ip) => ({
  id: 'asset-' + ip.id + '-cover',
  ipId: ip.id,
  name: ip.title + ' 공식 대표 일러스트',
  type: 'CHARACTER' as const,
  assetUrl: ip.thumbnailUrl,
  tags: [ip.genre, ip.title, '대표원화', '포토카드', '공식']
}));

export const MOCK_DESIGN_ASSETS: DesignAsset[] = [
  ...WEBTOON_COVER_ASSETS,
  // Characters
  {
    id: 'asset-ray-figure',
    ipId: 'ip-ranker-return',
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
    ipId: 'ip-twin-siblings',
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
    ipId: 'ip-daily-life',
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
    ipId: 'ip-ranker-return',
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
    ipId: 'ip-twin-siblings',
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
    ipId: 'ip-archmage-4000',
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
    ipId: 'ip-ranker-return',
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
    ipId: 'ip-ranker-return',
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
    ipId: 'ip-archmage-4000',
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
    ipId: 'ip-ranker-return',
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
    ipId: 'ip-twin-siblings',
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
    ipId: 'ip-archmage-4000',
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
    ipId: 'ip-daily-life',
    licenseNumber: 'TOON-LIC-2025-0920',
    holderName: '솜사탕공방',
    startDate: '2025-09-01',
    endDate: '2027-08-31',
    royaltyRate: 0.15,
    allowedProducts: ['PHOTOCARD', 'POSTCARD', 'STICKER'],
    status: 'ACTIVE'
  }
];

// 26개 전체 웹툰 IP 포토카드 출력 규격(55x85mm, 340x525px) 기본 템플릿 매핑 (텍스트 박스 없이 순수 원화 일러스트 풀블리드 탑재)
const WEBTOON_PHOTOCARD_TEMPLATES: ProductTemplate[] = MOCK_WEBTOON_IPS.map((ip) => ({
  id: 'tpl-' + ip.id + '-photocard',
  productId: 'prod-photocard',
  ipId: ip.id,
  name: ip.title + ' 공식 포토카드',
  previewUrl: ip.thumbnailUrl,
  frameType: 'HOLOGRAM_EDGES',
  defaultElements: [
    {
      id: 'el-img-' + ip.id,
      type: 'image',
      src: ip.thumbnailUrl,
      name: ip.title + ' 원화 일러스트',
      x: 0,
      y: 0,
      width: 340,
      height: 525,
      rotation: 0,
      zIndex: 1,
      opacity: 1
    }
  ]
}));

export const MOCK_TEMPLATES: ProductTemplate[] = [
  ...WEBTOON_PHOTOCARD_TEMPLATES,
  {
    id: 'tpl-stella-classic',
    productId: 'prod-photocard',
    ipId: 'ip-ranker-return',
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
      }
    ]
  },
  {
    id: 'tpl-greenhouse-rose',
    productId: 'prod-photocard',
    ipId: 'ip-twin-siblings',
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
        projectTitle: '랭커의 귀환 홀로그램 포카',
        productId: 'prod-photocard',
        productName: '포토카드 (Photo Card)',
        ipId: 'ip-ranker-return',
        ipTitle: '랭커의 귀환',
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
        projectTitle: '비일상활 다이어리 스티커팩',
        productId: 'prod-sticker',
        productName: '다이어리 스티커팩 (Sticker Sheet)',
        ipId: 'ip-daily-life',
        ipTitle: '4000년만에 귀환한 대마도사',
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
    ipId: 'ip-ranker-return',
    ipTitle: '랭커의 귀환',
    period: '2026년 10월',
    totalOrders: 1420,
    totalRevenue: 2840000,
    pgFeeRate: 0.033,
    pgFeeAmount: 93720,
    netRevenue: 2746280,
    royaltyCalculationBasis: 'NET_REVENUE',
    royaltyRate: 0.15,
    royaltyAmount: 411942,
    status: 'CONFIRMED',
    settledAt: '2026-10-25T18:00:00Z'
  },
  {
    id: 'set-202610-02',
    ipId: 'ip-twin-siblings',
    ipTitle: '쌍둥이 남매의 뉴라이프',
    period: '2026년 10월',
    totalOrders: 2190,
    totalRevenue: 4380000,
    pgFeeRate: 0.033,
    pgFeeAmount: 144540,
    netRevenue: 4235460,
    royaltyCalculationBasis: 'NET_REVENUE',
    royaltyRate: 0.18,
    royaltyAmount: 762383,
    status: 'CONFIRMED',
    settledAt: '2026-10-25T18:00:00Z'
  },
  {
    id: 'set-202610-03',
    ipId: 'ip-archmage-4000',
    ipTitle: '비일상활 하실래?',
    period: '2026년 10월',
    totalOrders: 850,
    totalRevenue: 1700000,
    pgFeeRate: 0.033,
    pgFeeAmount: 56100,
    netRevenue: 1643900,
    royaltyCalculationBasis: 'NET_REVENUE',
    royaltyRate: 0.12,
    royaltyAmount: 197268,
    status: 'PENDING'
  },
  {
    id: 'set-202610-04',
    ipId: 'ip-daily-life',
    ipTitle: '4000년만에 귀환한 대마도사',
    period: '2026년 10월',
    totalOrders: 1980,
    totalRevenue: 3960000,
    pgFeeRate: 0.033,
    pgFeeAmount: 130680,
    netRevenue: 3829320,
    royaltyCalculationBasis: 'NET_REVENUE',
    royaltyRate: 0.15,
    royaltyAmount: 574398,
    status: 'PENDING'
  },
  {
    id: 'set-202610-05',
    ipId: 'ip-hwashan',
    ipTitle: '화산귀환',
    period: '2026년 10월',
    totalOrders: 2800,
    totalRevenue: 5600000,
    pgFeeRate: 0.033,
    pgFeeAmount: 184800,
    netRevenue: 5415200,
    royaltyCalculationBasis: 'NET_REVENUE',
    royaltyRate: 0.20,
    royaltyAmount: 1083040,
    status: 'CONFIRMED',
    settledAt: '2026-10-25T18:00:00Z'
  },
  {
    id: 'set-202610-06',
    ipId: 'ip-solo-leveling',
    ipTitle: '나 혼자만 레벨업',
    period: '2026년 10월',
    totalOrders: 3400,
    totalRevenue: 6800000,
    pgFeeRate: 0.033,
    pgFeeAmount: 224400,
    netRevenue: 6575600,
    royaltyCalculationBasis: 'NET_REVENUE',
    royaltyRate: 0.20,
    royaltyAmount: 1315120,
    status: 'CONFIRMED',
    settledAt: '2026-10-25T18:00:00Z'
  },
  {
    id: 'set-202610-07',
    ipId: 'ip-remarried-empress',
    ipTitle: '재혼 황후',
    period: '2026년 10월',
    totalOrders: 1620,
    totalRevenue: 3240000,
    pgFeeRate: 0.033,
    pgFeeAmount: 106920,
    netRevenue: 3133080,
    royaltyCalculationBasis: 'NET_REVENUE',
    royaltyRate: 0.16,
    royaltyAmount: 501293,
    status: 'PENDING'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-20261028-001',
    timestamp: '2026-10-28T14:48:12Z',
    category: 'KIOSK',
    level: 'ERROR',
    actionCode: 'KIOSK_PAPER_JAM',
    summary: '홍대입구역 GS25 1호기 트레이 1 포토카드 용지 걸림으로 인쇄 자동 일시정지',
    actor: {
      id: 'kiosk-hd-01',
      name: '홍대입구역 1호기',
      role: 'KIOSK',
      ipAddress: '211.234.110.15'
    },
    target: {
      type: 'KIOSK',
      id: 'kiosk-hd-01',
      name: '홍대입구역 GS25 1호기 (서울 마포구)'
    },
    resolutionStatus: 'ACTION_REQUIRED',
    details: {
      errorCode: 'ERR_PRINTER_JAM_TRAY1',
      errorMessage: 'Photo paper transport roller sensor 1 timeout during feed cycle.',
      hardwarePart: '포토 프린터 트레이 1 (롤러 피딩부)',
      kioskId: 'kiosk-hd-01',
      kioskLocation: '서울 마포구 양화로 160 GS25 홍대입구역점',
      actionGuide: '키오스크 전면 도어를 키로 열고, 트레이 1 롤러 사이에 물린 55x85mm 포토카드를 조심스럽게 제거한 후 패널의 [센서 리셋] 버튼을 눌러주세요.',
      payload: {
        tray: 1,
        paperType: '55x85mm 포토카드 (유광 코팅)',
        currentPrintCode: '492-8172',
        rollerRpm: 0,
        sensorStatus: 'BLOCKED'
      }
    }
  },
  {
    id: 'log-20261028-002',
    timestamp: '2026-10-28T14:41:05Z',
    category: 'PAYMENT',
    level: 'ERROR',
    actionCode: 'PAYMENT_AUTH_FAILED',
    summary: '비회원 주문 토스페이먼츠 승인 실패 (한도 초과: EXCEED_MAX_DAILY_PAYMENT)',
    actor: {
      id: 'guest-session-982',
      name: '비회원 (010-8888-****)',
      role: 'GUEST',
      ipAddress: '121.134.45.89',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)'
    },
    target: {
      type: 'ORDER',
      id: 'ord-20261028-fail01',
      name: 'ORD-20261028-0092'
    },
    resolutionStatus: 'RESOLVED',
    details: {
      errorCode: 'PG_ERR_LIMIT_EXCEEDED',
      errorMessage: '사용자 카드의 일일 간편결제 승인 한도가 초과되었습니다.',
      pgProvider: '토스페이먼츠',
      actionGuide: '결제 실패 안내 팝업 노출 및 대체 결제 수단(카카오페이 / 신용카드 일반결제)으로 결제 재시도 권유.',
      payload: {
        requestedAmount: 9000,
        currency: 'KRW',
        paymentMethod: 'TOSSPAY',
        pgResponseCode: 'EXCEED_MAX_DAILY_PAYMENT',
        pgTid: 'toss_20261028144105_fail'
      },
      resolvedAt: '2026-10-28T14:42:00Z',
      resolvedBy: 'SYSTEM_FALLBACK_ROUTER'
    }
  },
  {
    id: 'log-20261028-003',
    timestamp: '2026-10-28T14:30:20Z',
    category: 'KIOSK',
    level: 'WARN',
    actionCode: 'KIOSK_CONSUMABLE_LOW',
    summary: '강남역 CU 2호기 승화형 열전사 잉크 리본 잔량 부족 경고 (잔여 18매)',
    actor: {
      id: 'kiosk-gn-02',
      name: '강남역 2호기',
      role: 'KIOSK',
      ipAddress: '211.234.112.44'
    },
    target: {
      type: 'KIOSK',
      id: 'kiosk-gn-02',
      name: '강남역 CU 2호기 (서울 강남구)'
    },
    resolutionStatus: 'INVESTIGATING',
    details: {
      errorCode: 'WARN_INK_RIBBON_5PCT',
      errorMessage: 'Sublimation ribbon capacity dropped below 5% threshold.',
      hardwarePart: 'YMCKO 500매 승화형 전사 리본',
      kioskId: 'kiosk-gn-02',
      kioskLocation: '서울 강남구 강남대로 390 신분당선 강남역 지하 2층',
      actionGuide: '강남 권역 담당 물류 기사에게 예비 잉크 리본 2세트 교체 티켓(#TKT-8841) 자동 전달됨. 3시간 이내 교체 예정.',
      payload: {
        currentRibbonPrints: 482,
        maxRibbonPrints: 500,
        percentRemaining: 3.6,
        ticketId: 'TKT-8841'
      }
    }
  },
  {
    id: 'log-20261028-004',
    timestamp: '2026-10-28T13:55:00Z',
    category: 'LICENSE',
    level: 'INFO',
    actionCode: 'LICENSE_RATE_UPDATED',
    summary: '랭커의 귀환 원작사 재계약으로 로열티 요율 변경 (12% -> 15%)',
    actor: {
      id: 'user-admin',
      name: '김총괄 (관리자)',
      role: 'ADMIN',
      ipAddress: '175.209.12.88'
    },
    target: {
      type: 'IP',
      id: 'ip-ranker-return',
      name: '랭커의 귀환'
    },
    resolutionStatus: 'RESOLVED',
    details: {
      actionGuide: '신규 로열티 요율(15%)이 2026년 10월 정산 마감 주기부터 정상 적용되며, 홀로그램 공식 에셋 3종이 에디터에 공개되었습니다.',
      payload: {
        previousRate: 0.12,
        newRate: 0.15,
        newAssetsAdded: ['은하 십자 엠블럼', '성기사 레이 홀로그램', '오로라 샤인 프레임'],
        contractDocumentNumber: 'LCN-2026-STELLA-V2',
        effectiveFrom: '2026-10-01'
      },
      resolvedAt: '2026-10-28T13:55:00Z',
      resolvedBy: '김총괄 (ADMIN)'
    }
  },
  {
    id: 'log-20261028-005',
    timestamp: '2026-10-28T13:12:44Z',
    category: 'AUTH',
    level: 'WARN',
    actionCode: 'AUTH_SUSPICIOUS_LOGIN',
    summary: '미인가 해외 IP (198.51.100.23)에서 관리자 로그인 연속 5회 실패로 IP 임시 차단',
    actor: {
      id: 'unknown-remote-client',
      name: '미식별 외부 접속자',
      role: 'USER',
      ipAddress: '198.51.100.23',
      userAgent: 'python-requests/2.31.0'
    },
    target: {
      type: 'USER',
      id: 'user-admin',
      name: '플랫폼 관리자 계정 보호'
    },
    resolutionStatus: 'RESOLVED',
    details: {
      errorCode: 'SEC_BLOCK_BRUTEFORCE',
      errorMessage: 'Consecutive failed login attempts exceeded threshold (5/5).',
      actionGuide: 'WAF 보안 정책에 따라 해당 IP 대역(/24)이 24시간 동안 접근 차단 처리되었으며 보안 감사 로그에 영구 기록되었습니다.',
      payload: {
        attemptCount: 5,
        targetEndpoint: '/api/admin/login',
        countryCode: 'NL',
        banDurationSeconds: 86400
      },
      resolvedAt: '2026-10-28T13:13:00Z',
      resolvedBy: 'CLOUD_SHIELD_WAF'
    }
  },
  {
    id: 'log-20261028-006',
    timestamp: '2026-10-28T12:05:11Z',
    category: 'KIOSK',
    level: 'INFO',
    actionCode: 'KIOSK_PRINT_SUCCESS',
    summary: '잠실 롯데월드몰 3호기: 7자리 인쇄코드(819-2041) 55x85mm 포토카드 2매 정상 출력',
    actor: {
      id: 'kiosk-js-03',
      name: '잠실 롯데월드몰 3호기',
      role: 'KIOSK',
      ipAddress: '211.234.115.8'
    },
    target: {
      type: 'ORDER',
      id: 'ord-20261026-0002',
      name: 'ORD-20261026-0002'
    },
    resolutionStatus: 'RESOLVED',
    details: {
      kioskId: 'kiosk-js-03',
      kioskLocation: '서울 송파구 올림픽로 300 롯데월드몰 지하 1층 아트리움',
      payload: {
        printCode: '819-2041',
        printDurationSec: 41.5,
        paperCutToleranceMm: 0.08,
        thermalHeadTempC: 62.4,
        isDualSided: true
      }
    }
  },
  {
    id: 'log-20261028-007',
    timestamp: '2026-10-28T11:20:00Z',
    category: 'PAYMENT',
    level: 'INFO',
    actionCode: 'PAYMENT_CONFIRMED',
    summary: '카카오페이 18,000원 결제 완료 및 PG 수수료 3.3%(594원) 자동 분개 처리',
    actor: {
      id: 'user-1',
      name: '김웹툰 (굿즈러버)',
      role: 'USER',
      ipAddress: '121.134.45.89'
    },
    target: {
      type: 'ORDER',
      id: 'ord-20261026-0001',
      name: 'ORD-20261026-0001'
    },
    resolutionStatus: 'RESOLVED',
    details: {
      pgProvider: '카카오페이',
      payload: {
        orderNumber: 'ORD-20261026-0001',
        grossAmount: 18000,
        pgFeeRate: 0.033,
        pgFeeAmount: 594,
        netRevenue: 17406,
        transactionId: 'TXN-KAKAOPAY-20261026001',
        approvedAt: '2026-10-28T11:20:00Z'
      }
    }
  },
  {
    id: 'log-20261028-008',
    timestamp: '2026-10-28T10:15:30Z',
    category: 'KIOSK',
    level: 'WARN',
    actionCode: 'KIOSK_EXPIRY_NOTIFICATION',
    summary: '비회원 7자리 인쇄코드(339-1092) 72시간 만료 임박(잔여 1시간) 알림톡 자동 발송',
    actor: {
      id: 'system-cron',
      name: '정기 알림 데몬',
      role: 'SYSTEM'
    },
    target: {
      type: 'ORDER',
      id: 'ord-20261025-0088',
      name: 'ORD-20261025-0088'
    },
    resolutionStatus: 'AUTO_RECOVERED',
    details: {
      actionGuide: '유효기간(72시간) 초과 시 인쇄코드는 즉시 폐기되며 미출력 자동 결제 취소/환불 절차로 연결됩니다.',
      payload: {
        printCode: '339-1092',
        recipientPhone: '010-9876-****',
        issuedAt: '2026-10-25T11:15:30Z',
        expiresAt: '2026-10-28T11:15:30Z',
        messageStatus: 'KAKAO_ALIMTALK_SENT'
      }
    }
  },
  {
    id: 'log-20261028-009',
    timestamp: '2026-10-28T09:00:00Z',
    category: 'SYSTEM',
    level: 'INFO',
    actionCode: 'SETTLEMENT_BATCH_COMPLETED',
    summary: '2026년 10월 주간 작가 로열티 정산 배치 완료 (7개 IP, 총매출 28,520,000원, PG수수료 차감)',
    actor: {
      id: 'settlement-engine',
      name: '정산 결제 엔진',
      role: 'SYSTEM'
    },
    target: {
      type: 'SETTLEMENT',
      id: 'settle-202610-w4',
      name: '2026년 10월 4주차 주간 정산'
    },
    resolutionStatus: 'RESOLVED',
    details: {
      payload: {
        totalGrossRevenue: 28520000,
        totalPgFee: 941160,
        totalNetRevenue: 27578840,
        totalRoyaltyAmount: 4845244,
        platformGrossMargin: 22733596,
        ipCount: 7,
        executionDurationMs: 840
      }
    }
  },
  {
    id: 'log-20261028-010',
    timestamp: '2026-10-28T08:30:15Z',
    category: 'AUTH',
    level: 'INFO',
    actionCode: 'ORDER_MERGED_TO_MEMBER',
    summary: '비회원 주문(ORD-20261026-0003)의 정회원 계정(김웹툰) 내역 안전 이관 및 포인트 적립',
    actor: {
      id: 'user-1',
      name: '김웹툰 (굿즈러버)',
      role: 'USER',
      ipAddress: '121.134.45.89'
    },
    target: {
      type: 'ORDER',
      id: 'ord-20261026-0003',
      name: 'ORD-20261026-0003'
    },
    resolutionStatus: 'RESOLVED',
    details: {
      actionGuide: '휴대폰 번호(010-1234-5678) 본인인증을 통과하여 비회원 주문이 정회원 계정 주문 히스토리로 정상 병합되었습니다.',
      payload: {
        guestPhone: '010-1234-5678',
        targetUserId: 'user-1',
        bonusPointsGranted: 100
      }
    }
  },
  {
    id: 'log-20261028-011',
    timestamp: '2026-10-28T07:14:02Z',
    category: 'KIOSK',
    level: 'CRITICAL',
    actionCode: 'KIOSK_CUTTER_BLADE_FAULT',
    summary: '부산 서면 삼정타워점 2호기: 다이컷 커터 칼날 마모 임계치 초과 및 자동 안전 락',
    actor: {
      id: 'kiosk-bs-02',
      name: '부산 서면 2호기',
      role: 'KIOSK',
      ipAddress: '211.234.120.30'
    },
    target: {
      type: 'KIOSK',
      id: 'kiosk-bs-02',
      name: '부산 서면 삼정타워점 2호기 (부산 진구)'
    },
    resolutionStatus: 'ACTION_REQUIRED',
    details: {
      errorCode: 'CRIT_CUTTER_BLADE_WEAR',
      errorMessage: 'Rotary die-cut blade cumulative cut cycle exceeded safety limit (50,000 cuts).',
      hardwarePart: 'R4 다이컷 원형 로터리 커터 블레이드',
      kioskId: 'kiosk-bs-02',
      kioskLocation: '부산 부산진구 중앙대로 672 삼정타워 1층',
      actionGuide: '칼날 모듈 교체 전까지 해당 키오스크의 신규 포토카드 발권이 자동 중지되었습니다. 긴급 부품 교체 기사 출동 필요.',
      payload: {
        cutCount: 50124,
        maxSafeCutCount: 50000,
        cutterMotorCurrentMa: 850,
        safetyInterlockActive: true
      }
    }
  }
];
