# 10. REST API 명세서 (API Specification)

## 1. 개요 및 공통 규격
- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **응답 포맷**:
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null,
    "timestamp": "2026-10-26T15:20:00Z"
  }
  ```

---

## 2. 주요 엔드포인트 목록

### 2.1 디자인 프로젝트 API
- **`GET /api/projects`**: 현재 사용자의 디자인 프로젝트 목록 조회
  - Query: `userId` (선택)
  - Response: `DesignProject[]`
- **`POST /api/projects`**: 신규 프로젝트 임시 저장 또는 업데이트
  - Request Body: `{ id?, productId, ipId, title, elements, background, previewDataUrl }`
  - Response: `{ success: true, project: DesignProject }`
- **`DELETE /api/projects/:id`**: 특정 프로젝트 삭제

### 2.2 주문 및 결제 API
- **`POST /api/orders`**: 주문 접수 및 가상 결제 승인
  - Request Body:
    ```json
    {
      "projectId": "proj-demo-1",
      "fulfillmentType": "KIOSK",
      "quantity": 2,
      "options": { "paperType": "스노우지 250g", "coating": "스파클링 홀로그램" },
      "paymentMethod": "TOSSPAY",
      "shippingInfo": null
    }
    ```
  - Response: `{ success: true, order: Order, printJob: PrintJob }`
- **`GET /api/orders/:id`**: 주문 상세 및 진행 상태 조회

### 2.3 키오스크 통신 API
- **`POST /api/kiosk/verify`**: 7자리 인쇄 코드 검증
  - Request Body: `{ "printCode": "748-2918" }`
  - Response:
    - 200 OK: `{ "valid": true, "order": Order, "previewUrl": "data:image/..." }`
    - 400 Bad Request: `{ "valid": false, "message": "유효하지 않거나 만료된 코드입니다." }`
    - 409 Conflict: `{ "valid": false, "message": "이미 출력이 완료된 코드입니다." }`
- **`POST /api/kiosk/print`**: 키오스크 출력 완료 처리
  - Request Body: `{ "orderId": "ord-...", "kioskId": "KIOSK-SEOUL-HONGDAE-01" }`
  - Response: `{ "success": true, "printedAt": "2026-10-26T..." }`

### 2.4 관리자 백오피스 API
- **`GET /api/admin/stats`**: 전체 판매량, 매출 통계, 키오스크 출력률 조회
- **`PATCH /api/admin/orders/:id`**: 주문 및 배송 상태 갱신 (예: 운송장 번호 등록)
- **`PATCH /api/admin/licenses/:id`**: IP 라이선스 활성/비활성 제어
- **`GET /api/admin/settlements`**: IP별 판매액 및 로열티 정산 데이터 조회
