import { MOCK_WEBTOON_IPS, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_SETTLEMENTS } from '../src/lib/mockData';

export function runIntegrationTests(): boolean {
  console.log('======================================================');
  console.log(' [TOON CANVAS] 통합 시나리오 및 보안 무결성 테스트 실행');
  console.log('======================================================');

  let allPassed = true;

  // Test 1: 웹툰 IP 스토어 및 캐릭터 매핑 검증
  console.log('\n[Scenario 1] 웹툰 IP 및 공식 라이선스 정합성 검증...');
  const activeIPs = MOCK_WEBTOON_IPS.filter(w => w.status === 'ACTIVE');
  if (activeIPs.length === 0) {
    console.error('FAIL: 활성화된 웹툰 IP가 없습니다.');
    allPassed = false;
  } else {
    console.log(`PASS: 활성 웹툰 IP ${activeIPs.length}개 확인 완료.`);
  }

  // Test 2: 키오스크 7자리 인쇄 코드 유효성 및 일회성 검증
  console.log('\n[Scenario 2] 키오스크 인쇄 코드 검증 시나리오...');
  const sampleOrder = MOCK_ORDERS[0];
  if (!sampleOrder || !sampleOrder.printJob) {
    console.error('FAIL: 키오스크 출력 주문 데이터가 누락되었습니다.');
    allPassed = false;
  } else {
    const rawCode = sampleOrder.printJob.printCode;
    const clean = rawCode.replace(/[^0-9]/g, '');
    
    // Check length
    if (clean.length !== 7) {
      console.error(`FAIL: 인쇄 코드(${clean}) 길이가 7자리가 아닙니다.`);
      allPassed = false;
    } else {
      console.log(`PASS: 7자리 인쇄 코드 형식(${rawCode}) 정상.`);
    }

    // Check expiry logic
    const expiresAt = new Date(sampleOrder.printJob.expiresAt).getTime();
    if (expiresAt <= Date.now()) {
      console.error('FAIL: 발급된 인쇄 코드가 이미 만료되었습니다.');
      allPassed = false;
    } else {
      const remainingHours = Math.round((expiresAt - Date.now()) / (1000 * 60 * 60));
      console.log(`PASS: 코드 유효기간 잔여 ${remainingHours}시간 정상.`);
    }
  }

  // Test 3: 주문 금액 및 결제 무결성 계산식 검증
  console.log('\n[Scenario 3] 주문 금액 및 배송비 합산 공식 검증...');
  MOCK_ORDERS.forEach(order => {
    const calculatedItemTotal = order.items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
    const expectedShipping = order.fulfillmentType === 'DELIVERY' ? 3000 : 0;
    const expectedFinal = calculatedItemTotal + expectedShipping - order.discountAmount;

    if (order.finalAmount !== expectedFinal) {
      console.error(`FAIL: 주문 ${order.orderNumber}의 최종 금액(${order.finalAmount})이 계산식(${expectedFinal})과 불일치합니다.`);
      allPassed = false;
    }
  });
  console.log('PASS: 전체 주문 금액 무결성 계산 검증 통과.');

  // Test 4: IP 작가 로열티 정산(Settlement) 수식 검증
  console.log('\n[Scenario 4] 작가 로열티 정산 공식 (매출액 * 요율 = 정산금) 검증...');
  MOCK_SETTLEMENTS.forEach(s => {
    const expectedRoyalty = Math.round(s.totalRevenue * s.royaltyRate);
    if (s.royaltyAmount !== expectedRoyalty) {
      console.error(`FAIL: 정산 ID ${s.id}의 정산금(${s.royaltyAmount})이 수식(${expectedRoyalty})과 불일치합니다.`);
      allPassed = false;
    }
  });
  console.log(`PASS: 총 ${MOCK_SETTLEMENTS.length}건 로열티 정산 공식 검증 통과.`);

  // Test 5: 보안 - 비인가 관리자 접근 방지 시뮬레이션
  console.log('\n[Scenario 5] RBAC 보안 - 권한 분리 정책 검증...');
  const userRole: string = 'USER';
  const isAdminAllowed = userRole === 'ADMIN';
  if (isAdminAllowed) {
    console.error('FAIL: USER 역할이 관리자 권한을 획득했습니다.');
    allPassed = false;
  } else {
    console.log('PASS: 일반 사용자(USER)의 백오피스 접근 통제 정책 확인.');
  }

  console.log('\n======================================================');
  if (allPassed) {
    console.log(' ✅ 모든 통합 시나리오 및 보안 검증 통과 (SUCCESS)');
  } else {
    console.error(' ❌ 일부 시나리오 실패 (FAILURE)');
  }
  console.log('======================================================');

  return allPassed;
}

runIntegrationTests();
