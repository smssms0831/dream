// Cloudflare Pages Function: 상담 신청 내용을 텔레그램으로 전달합니다.
// 봇 토큰은 Cloudflare 설정(환경 변수)에만 저장되며 사이트 코드에는 들어가지 않습니다.
const clip = (v, n) => String(v == null ? "" : v).replace(/\r/g, "").trim().slice(0, n);
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });

export async function onRequestPost({ request, env }) {
  // 같은 사이트에서 보낸 요청만 허용
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) return json({ ok: false }, 403);

  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return json({ ok: false, error: "not_configured" }, 500);

  let d;
  try { d = await request.json(); } catch (e) { return json({ ok: false }, 400); }

  const name = clip(d.name, 40);
  const phone = clip(d.phone, 30);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 8) return json({ ok: false, error: "invalid" }, 400);

  const text =
    "📩 [드림국과사 상담 신청]\n" +
    "성함: " + name + "\n" +
    "연락처: " + phone + "\n" +
    "학년: " + clip(d.grade, 40) + "\n" +
    "관심 과목: " + clip(d.subjects, 80) + "\n" +
    "상담 희망일: " + clip(d.date, 20) + "\n" +
    "문의 내용: " + clip(d.inquiry, 1000) + "\n" +
    "신청 시각: " + clip(d.sent_at, 40);

  const r = await fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
  });
  return r.ok ? json({ ok: true }) : json({ ok: false, error: "telegram" }, 502);
}
