# 드림국과사 홈페이지

서버와 DB가 없는 **정적 사이트**입니다. 상담 신청을 제출하면 EmailJS가 지정한 메일로 내용을 보냅니다. 신청 내용은 사이트에 저장되지 않고 메일로만 남습니다.

## 파일 구성

| 파일 | 역할 |
|---|---|
| `config.js` | **전화번호, 주소, 운영시간, 카카오톡 채널, EmailJS 값을 바꾸는 파일** (자주 수정) |
| `index.html` | 페이지 문구와 구성 |
| `style.css` | 색상, 글꼴, 배치 |
| `script.js` | 상담 신청 양식, 메일 발송, 모바일 메뉴 |
| `logo.svg`, `favicon.*`, `apple-touch-icon.png`, `og-image.png` | 로고, 탭 아이콘, 링크 공유 이미지 |

## 먼저 바꿔야 할 값 (config.js)

`PHONE`, `ADDRESS`, `ADDRESS_DETAIL`, `HOURS_WEEKDAY`, `HOURS_WEEKEND`은 **예시 값**입니다. 실제 정보로 바꿔야 합니다.
`KAKAO_CHANNEL_URL`에 카카오톡 채널 주소를 넣으면 "카카오톡 채널로 문의" 버튼이 나타납니다. 비워 두면 버튼이 숨겨집니다.

## 1단계. EmailJS 설정 (메일 받기)

1. emailjs.com에서 **Email Services**에 메일 서비스를 연결하고 `Service ID`를 복사합니다.
2. **Email Templates**에서 새 템플릿을 만듭니다.
   - **To Email**: 상담 신청을 받을 학원 메일 주소
   - **Subject 예시**: `[드림국과사 상담신청] {{name}}`
   - **본문**: `{{message}}` 한 줄만 넣으면 모든 내용이 들어옵니다.
     개별 항목으로 나누려면 `{{name}}`, `{{phone}}`, `{{grade}}`, `{{subjects}}`, `{{date}}`, `{{inquiry}}`, `{{sent_at}}`을 사용합니다.
   - 저장 후 `Template ID`를 복사합니다.
3. **Account > General**의 `Public Key`를 복사합니다. (Private Key는 쓰지 않습니다.)
4. `config.js`의 `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`에 붙여 넣습니다.

## 2단계. GitHub에 올리기

1. github.com에서 가입하고 새 저장소를 만듭니다. (예: `dream-site`)
2. 저장소 첫 화면의 **uploading an existing file**을 누르고, 이 폴더의 **파일 전부**(README.md 포함)를 끌어다 놓은 뒤 **Commit changes**를 누릅니다.
   파일 전부 올라갔는지 목록에서 `index.html`, `style.css`, `script.js`, `config.js`, `logo.svg`, `og-image.png` 등을 꼭 확인하세요.

## 3단계. Cloudflare Pages로 배포

1. dash.cloudflare.com에서 가입(무료)하고 로그인합니다.
2. 주소창에 아래를 붙여 넣으면 Pages 생성 화면으로 바로 갑니다.
   `https://dash.cloudflare.com/?to=/:account/pages/new/provider/github`
3. 2단계의 저장소를 선택하고 프로젝트 이름을 정합니다. 이 이름이 `이름.pages.dev` 주소가 됩니다.
4. 빌드 설정: **Framework preset은 None, Build command는 완전히 빈칸, Output directory도 빈칸**으로 두고 **Save and Deploy**를 누릅니다.
   (입력칸에 설명 문구를 그대로 적지 마세요. 비워 두는 것이 맞습니다.)

## 4단계. 링크 공유 이미지 주소 맞추기

`index.html` 상단의 `og:image` 값을 실제 주소로 바꿉니다. 카카오톡 링크 미리보기에 이미지가 나오려면 전체 주소여야 합니다.

```html
<meta property="og:image" content="https://실제주소.pages.dev/og-image.png">
```

## 5단계. 테스트

1. 배포된 주소에서 상담 신청을 직접 한 번 제출합니다.
2. 지정한 메일함에 도착하는지 확인합니다. **스팸함도 확인**하세요.
3. 정상이라면 EmailJS의 **Security** 메뉴에서 허용 도메인을 새 사이트 주소로 제한합니다.

## 이후 수정

문구나 디자인을 바꾸려면 Claude에게 요청해서 수정된 파일을 받고, GitHub 저장소에 **같은 이름으로 다시 올리면**(Add file → Upload files) 1~2분 안에 반영됩니다.
**수정 파일이 여러 개일 때는 반드시 모두 올려야 합니다.**
