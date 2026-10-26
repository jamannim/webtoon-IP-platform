# 05. 사용자 흐름 및 핵심 여정 (User Flow)

## 1. 사용자 유형 (User Personas)
1. **일반 팬 (FAN / USER)**:
   - 좋아하는 웹툰의 공식 에셋을 활용해 세상에 하나뿐인 포토카드나 엽서를 직접 디자인하고, 근처 편의점 키오스크에서 즉시 출력하거나 택배로 수령하고자 함.
2. **웹툰 작가 / 크리에이터 (CREATOR)**:
   - 본인 IP의 라이선스 현황과 팬들의 굿즈 제작량, 발생한 판매 로열티 정산 금액을 확인하고자 함.
3. **플랫폼 총괄 관리자 (ADMIN)**:
   - 공식 라이선스 계약 기간, 상품 규격 및 단가, 전체 주문 및 배송 상태, 키오스크 출력 로그를 모니터링하고 제어함.

---

## 2. 핵심 사용자 여정 (User Journeys)

### 2.1 여정 A: 웹툰 탐색부터 키오스크 즉시 출력까지
```mermaid
flowchart TD
    Start(["메인 접속"]) --> StoreBrowse["웹툰 IP 스토어 둘러보기"]
    StoreBrowse --> SelectIP["'스텔라 나이트' 작품 선택"]
    SelectIP --> ChooseProduct["'포토카드' 상품 선택 & '제작하기' 클릭"]
    ChooseProduct --> EditorScreen["굿즈 에디터 진입"]
    
    subgraph Editor ["캔버스 커스텀"]
        AddChar["레이 성기사 공식 일러스트 배치"]
        AddSticker["스파클 스티커 & 홀로그램 엣지 추가"]
        AddText["원하는 대사/문구 타이핑"]
        CheckDPI["300DPI 인쇄 품질 및 안전선 확인"]
    end
    
    EditorScreen --> Editor
    Editor --> SaveAndOrder["'주문하기' 클릭 (최종 파일 자동 렌더링)"]
    SaveAndOrder --> CheckoutScreen["주문서 작성 (/checkout)"]
    CheckoutScreen --> SelectKiosk["수령 방식: '오프라인 키오스크 즉시 출력' 선택"]
    SelectKiosk --> SelectPaper["옵션: '스파클링 홀로그램' 코팅 선택"]
    SelectPaper --> PayModal["가상 결제창 (토스페이/카카오페이) 승인"]
    PayModal --> CompleteScreen["주문 완료 & 7자리 인쇄 코드 발급 (예: 748-2918)"]
    CompleteScreen --> OpenKioskSim["'키오스크 시뮬레이터' 실행"]
    OpenKioskSim --> KioskPad["키패드에 7자리 번호 터치 입력"]
    KioskPad --> KioskPrintAnim["실시간 출력 공정 진행 & 수령 완료"]
```

### 2.2 여정 B: 다이어리 스티커팩 디자인 및 택배 배송 수령
```mermaid
flowchart TD
    StartB(["에디터 직접 진입"]) --> SelectStickerPack["상품: 다이어리 스티커팩 선택"]
    SelectStickerPack --> DesignStickers["달묘의 다락방 스티커 자유 배치"]
    DesignStickers --> TempSave["'내 보관함'에 임시 저장"]
    TempSave --> MyPage["마이페이지에서 보관된 프로젝트 재진입 확인"]
    MyPage --> CheckoutB["주문서 작성 (/checkout)"]
    CheckoutB --> SelectDelivery["수령 방식: '택배 배송' 선택"]
    SelectDelivery --> EnterAddress["수령인, 연락처, 배송지 주소 입력"]
    EnterAddress --> PayDelivery["배송비(3,000원) 포함 결제 완료"]
    PayDelivery --> AdminProduce["관리자가 '제작중' -> '발송완료(송장등록)' 처리"]
    AdminProduce --> TrackShipment["마이페이지에서 실시간 택배 배송조회"]
```

### 2.3 여정 C: 운영자의 IP 라이선스 관리 및 판매 정산
```mermaid
flowchart TD
    AdminLogin(["관리자 대시보드 진입 (/admin)"]) --> ViewStats["일일 매출, 주문 건수, 활성 IP 현황 확인"]
    ViewStats --> ManageLicenses["라이선스 관리 탭 이동"]
    ManageLicenses --> ToggleLicense["특정 IP 사용 허용 상품 범위 및 계약 갱신"]
    ViewStats --> SettlementTab["IP별 정산 대시보드 이동"]
    SettlementTab --> CalcRoyalty["기간별 판매액에 따른 작가 로열티 자동 산출 및 정산 확인"]
```
