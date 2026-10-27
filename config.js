// 드림국과사 설정 파일입니다. 연락처, 운영시간, 메일 설정을 이 파일 한 곳에서 바꿉니다.
// 아래 값은 모두 페이지에 공개되어도 되는 값입니다. (EmailJS Private Key는 절대 넣지 마세요.)
window.DREAM_CONFIG = {
  // ---- 학원 정보 (예시 값입니다. 실제 정보로 바꿔 주세요) ----
  PHONE: "000-0000-0000",
  ADDRESS: "학원 주소를 입력해 주세요",
  ADDRESS_DETAIL: "건물명, 층, 가까운 정류장 등을 입력해 주세요",
  HOURS_WEEKDAY: "평일 14:00 - 22:00",
  HOURS_WEEKEND: "토요일 10:00 - 18:00 / 일요일 휴무",
  KAKAO_CHANNEL_URL: "",   // 카카오톡 채널 주소(예: https://pf.kakao.com/_xxxx). 비워 두면 버튼이 숨겨집니다.

  // ---- EmailJS (상담 신청 메일) ----
  EMAILJS_PUBLIC_KEY: "",    // Account > General > Public Key
  EMAILJS_SERVICE_ID: "",    // Email Services 의 Service ID
  EMAILJS_TEMPLATE_ID: "",   // Email Templates 의 Template ID

  // 같은 브라우저에서 연속 제출을 막는 대기 시간(초)
  COOLDOWN_SECONDS: 60
};
