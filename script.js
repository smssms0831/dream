(function () {
  "use strict";

  var cfg = window.DREAM_CONFIG || {};
  var COOLDOWN_KEY = "dream_last_submit";

  /* ---------- config.js 값을 화면에 채우기 ---------- */
  var binds = {
    phone: cfg.PHONE || "",
    mobile: cfg.MOBILE || cfg.PHONE || "",
    address: cfg.ADDRESS || "",
    hours: cfg.HOURS || ""
  };
  Array.prototype.forEach.call(document.querySelectorAll("[data-bind]"), function (el) {
    el.textContent = binds[el.getAttribute("data-bind")] || "";
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-bind-tel]"), function (el) {
    var num = el.getAttribute("data-bind-tel") === "mobile" ? binds.mobile : binds.phone;
    el.setAttribute("href", "tel:" + num.replace(/[^\d+]/g, ""));
  });

  var kakaoBtn = document.getElementById("kakao-btn");
  if (cfg.KAKAO_CHANNEL_URL) {
    kakaoBtn.href = cfg.KAKAO_CHANNEL_URL;
    kakaoBtn.hidden = false;
  }
  var mapQuery = encodeURIComponent(cfg.MAP_QUERY || cfg.ADDRESS || "드림국과사");
  document.getElementById("naver-map").href = "https://map.naver.com/p/search/" + mapQuery;
  document.getElementById("kakao-map").href = "https://map.kakao.com/?q=" + mapQuery;
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- 모바일 메뉴 ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- 상담 신청 양식 ---------- */
  var form = document.getElementById("apply-form");
  var F = form.elements;
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("submit-btn");
  var dateInput = document.getElementById("date");

  (function setMinDate() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    dateInput.min = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  })();

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = "form-status" + (type ? " " + type : "");
  }

  function isConfigured() {
    return !!(cfg.EMAILJS_PUBLIC_KEY && cfg.EMAILJS_SERVICE_ID && cfg.EMAILJS_TEMPLATE_ID && window.emailjs);
  }

  function selectedSubjects() {
    return Array.prototype.filter.call(form.querySelectorAll('input[name="subjects"]'), function (c) { return c.checked; })
      .map(function (c) { return c.value; });
  }

  function validate() {
    var name = F["name"].value.trim();
    var digits = F["phone"].value.replace(/\D/g, "");
    var date = F["date"].value;
    var checks = [
      [F["name"], name.length >= 2, "성함을 입력해 주세요."],
      [F["phone"], digits.length >= 8 && digits.length <= 12, "연락처를 정확히 입력해 주세요."],
      [F["date"], !date || date >= dateInput.min, "상담 희망일은 오늘 이후로 선택해 주세요."]
    ];
    var first = null;
    checks.forEach(function (c) {
      c[0].classList.toggle("invalid", !c[1]);
      if (!c[1] && !first) first = c;
    });
    if (first) { setStatus(first[2], "err"); first[0].focus(); return false; }
    return true;
  }

  function cooldownLeft() {
    try {
      var last = parseInt(localStorage.getItem(COOLDOWN_KEY) || "0", 10);
      var left = last + (cfg.COOLDOWN_SECONDS || 60) * 1000 - Date.now();
      return left > 0 ? Math.ceil(left / 1000) : 0;
    } catch (e) { return 0; }
  }

  form.addEventListener("input", function (e) {
    if (e.target && e.target.classList) e.target.classList.remove("invalid");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("", "");

    // 스팸 방지: 숨김 칸이 채워져 있으면 성공처럼 보이게만 하고 보내지 않음
    if (F["website"].value) { setStatus("상담 신청이 접수되었습니다.", "ok"); return; }
    if (!validate()) return;

    var left = cooldownLeft();
    if (left > 0) { setStatus("잠시 후 다시 신청해 주세요. (" + left + "초 후 가능)", "err"); return; }

    if (!isConfigured() && !cfg.TELEGRAM_ENABLED) {
      setStatus("온라인 접수가 준비 중입니다. 죄송하지만 전화(" + (cfg.PHONE || "") + ")로 문의해 주세요.", "err");
      return;
    }

    var sentAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    var name = F["name"].value.trim();
    var phone = F["phone"].value.trim();
    var grade = F["grade"].value || "(미선택)";
    var subjects = selectedSubjects().join(", ") || "(미선택)";
    var date = F["date"].value || "(미입력)";
    var inquiry = F["inquiry"].value.trim() || "(없음)";

    // 템플릿에 개별 변수가 없어도 {{message}} 하나로 모든 내용이 보이도록 요약문을 함께 보냅니다.
    var params = {
      name: name, phone: phone, grade: grade, subjects: subjects, date: date, inquiry: inquiry,
      sent_at: sentAt, time: sentAt,
      message:
        "[드림국과사 상담 신청]\n" +
        "성함: " + name + "\n" +
        "연락처: " + phone + "\n" +
        "학년: " + grade + "\n" +
        "관심 과목: " + subjects + "\n" +
        "상담 희망일: " + date + "\n" +
        "문의 내용: " + inquiry + "\n" +
        "신청 시각: " + sentAt
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "전송 중...";

    // 텔레그램(서버 함수)과 이메일(EmailJS)을 함께 시도하고, 하나라도 성공하면 접수 완료로 처리합니다.
    var viaTelegram = cfg.TELEGRAM_ENABLED
      ? fetch("/api/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name, phone: phone, grade: grade, subjects: subjects, date: date, inquiry: inquiry, sent_at: sentAt })
        }).then(function (r) { if (!r.ok) throw new Error("telegram"); })
      : Promise.reject(new Error("off"));
    var viaEmail = isConfigured()
      ? emailjs.send(cfg.EMAILJS_SERVICE_ID, cfg.EMAILJS_TEMPLATE_ID, params, { publicKey: cfg.EMAILJS_PUBLIC_KEY })
      : Promise.reject(new Error("off"));

    var settle = function (p) { return p.then(function () { return true; }, function () { return false; }); };
    Promise.all([settle(viaTelegram), settle(viaEmail)]).then(function (res) {
      if (res[0] || res[1]) {
        try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch (err) {}
        form.reset();
        setStatus("상담 신청이 접수되었습니다. 확인 후 연락드릴게요!", "ok");
      } else {
        setStatus("전송에 실패했습니다. 잠시 후 다시 시도하시거나 전화로 문의해 주세요.", "err");
      }
      submitBtn.disabled = false;
      submitBtn.textContent = "상담 신청하기";
    });
  });
})();
