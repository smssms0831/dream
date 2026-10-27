// 드림국과사 설정 파일입니다. 연락처, 운영시간, 메일 설정을 이 파일 한 곳에서 바꿉니다.
// 아래 값은 모두 페이지에 공개되어도 되는 값입니다. (EmailJS Private Key는 절대 넣지 마세요.)
window.DREAM_CONFIG = {
  // ---- 학원 정보 ----
  PHONE: "063-451-1278",                       // 학원 대표 전화 (전화 상담, 오시는 길, 하단)
  MOBILE: "010-6294-4296",                     // 맨 위 메뉴줄의 전화 버튼
  ADDRESS: "전북특별자치도 군산시 미장안길 11, 202호",
  MAP_QUERY: "전북특별자치도 군산시 미장안길 11",  // 지도 검색에 쓰는 주소(호수 제외)
  HOURS: "평일 · 토요일 · 일요일 10:00 - 21:00",
  KAKAO_CHANNEL_URL: "",   // 카카오톡 채널 주소(예: https://pf.kakao.com/_xxxx). 비워 두면 버튼이 숨겨집니다.

  // ---- EmailJS (상담 신청 메일) ----
  EMAILJS_PUBLIC_KEY: "",    // Account > General > Public Key
  EMAILJS_SERVICE_ID: "",    // Email Services 의 Service ID
  EMAILJS_TEMPLATE_ID: "",   // Email Templates 의 Template ID

  // 같은 브라우저에서 연속 제출을 막는 대기 시간(초)
  COOLDOWN_SECONDS: 60
};
