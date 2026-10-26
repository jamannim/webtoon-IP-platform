import { MOCK_WEBTOON_IPS, MOCK_PRODUCTS, MOCK_LICENSES, MOCK_ORDERS } from '../src/lib/mockData';

export function runTests(): boolean {
  console.log('=== [TOON CANVAS] 기본 데이터 및 로직 무결성 테스트 실행 ===');

  let passed = true;

  // Test 1: 웹툰 IP 필수 메타데이터 검증
  console.log('[Test 1] 웹툰 IP 데이터 유효성 검증...');
  if (MOCK_WEBTOON_IPS.length < 4) {
    console.error('FAIL: 최소 4개 이상의 오리지널 웹툰 IP가 요구됩니다.');
    passed = false;
  } else {
    MOCK_WEBTOON_IPS.forEach(ip => {
      if (!ip.id || !ip.title || !ip.genre || !ip.thumbnailUrl) {
        console.error(`FAIL: IP ${ip.title}에 누락된 필수 필드가 있습니다.`);
        passed = false;
      }
    });
    console.log(`PASS: 총 ${MOCK_WEBTOON_IPS.length}개 웹툰 IP 무결성 확인 완료.`);
  }

  // Test 2: 상품 규격 및 DPI 검증
  console.log('[Test 2] 상품 규격(300 DPI, mm 단위, 안전 여백) 검증...');
  MOCK_PRODUCTS.forEach(p => {
    if (p.dpi !== 300) {
      console.error(`FAIL: 상품 ${p.name}의 DPI가 300이 아닙니다.`);
      passed = false;
    }
    if (p.bleedMm <= 0 || p.safeMarginMm <= 0) {
      console.error(`FAIL: 상품 ${p.name}의 재단/안전 여백이 올바르지 않습니다.`);
      passed = false;
    }
  });
  console.log(`PASS: 총 ${MOCK_PRODUCTS.length}개 상품 규격 및 300 DPI 준수 확인 완료.`);

  // Test 3: 7자리 인쇄 코드 포맷 검증
  console.log('[Test 3] 키오스크 7자리 인쇄 코드 포맷 검증...');
  MOCK_ORDERS.forEach(ord => {
    if (ord.printJob) {
      const codeClean = ord.printJob.printCode.replace(/[^0-9]/g, '');
      if (codeClean.length !== 7) {
        console.error(`FAIL: 인쇄 코드 ${ord.printJob.printCode}의 숫자 길이가 7자리가 아닙니다.`);
        passed = false;
      }
    }
  });
  console.log('PASS: 키오스크 7자리 난수 인쇄 코드 포맷 확인 완료.');

  // Test 4: 라이선스 로열티율 범위 검증
  console.log('[Test 4] 라이선스 로열티율 범위 (0 < rate <= 0.3) 검증...');
  MOCK_LICENSES.forEach(lic => {
    if (lic.royaltyRate <= 0 || lic.royaltyRate > 0.3) {
      console.error(`FAIL: 라이선스 ${lic.licenseNumber}의 로열티율(${lic.royaltyRate})이 비정상입니다.`);
      passed = false;
    }
  });
  console.log('PASS: 라이선스 로열티율 정상 범위 확인 완료.');

  if (passed) {
    console.log('=== 모든 기본 검증 테스트 통과 (ALL TESTS PASSED) ===');
  } else {
    console.error('=== 일부 테스트 실패 (TESTS FAILED) ===');
  }

  return passed;
}

runTests();
