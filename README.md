# AXcellent 데모

구조 회의용 프로토타입이에요. 백엔드 없이 프론트만으로 돌아가요.

- 저장소를 공개로 바꾸고 Settings → Pages → Source를 GitHub Actions로 두면 https://nyejin.github.io/axcellent-demo/ 에 올라가요 (`.github/workflows/pages.yml`). 비공개일 때는 로컬에서 `npm run dev`로 봐요.
- 부서 화면은 [ax-frontend](https://github.com/ax-company-hq/ax-frontend) `dashboard-web`(dev, c1eb44a)을 그대로 가져왔어요.

## 보여 주는 구조

```
┌──────────── 고객사 사내망 (폐쇄) ─────────────────────────┐
│  [DejaFix 인프라]  ← 부서 PC를 IP로 등록 (자빅스처럼)      │
│      ├─ 기획팀 PC  ├─ 개발팀 PC  ├─ 고객지원팀 PC …     │
│  [로그인] → 가입할 때 등록한 부서 페이지로 이동            │
│  [서비스 연결] ── URL·API·키 ──→ 캣북스 온라인 서점        │
└───────────────────────────────────────────────────────────┘
  우리는 서버 없이 프로그램만 제공해요. 데이터는 회사 안에만 있어요.
```

| 화면 | 주소 | 누가 보나 |
| --- | --- | --- |
| 로그인 | `/login` | 모두 |
| 인프라 AI (인프라팀 = DejaFix 서비스 화면, 메뉴는 바깥 사이드바 하위 메뉴) | `/infra`, `/infra/reports` … `/infra/hosts` | 인프라팀 |
| 서비스 연결 (고객사 서비스 연결부) | `/system/integrations` | 시스템 관리 |
| 부서 화면 (기획·개발·고객지원·마케팅·인사·운영·재무·데이터분석) | `/planning`, `/dev`, `/hr`, `/ops` 등 | 해당 부서 |
| AI 대화방·AI 오피스 | `/agents/chat`, `/agents/office` | 모든 부서 |
| 총괄 | `/orchestrator` | 시스템 관리 |

- 오른쪽 위 **프로필 전환** 드롭다운으로 부서 계정을 바꿔 가며 볼 수 있어요. 실제 제품에서는 로그인한 계정의 부서 페이지만 열려요.
- 부서 계정으로 바로 들어가는 링크: 주소 뒤에 `?as=planning`처럼 붙이면 돼요. 계정 id는 `admin`, `infra`, `planning`, `dev`, `support`, `marketing`, `hr`, `ops`, `finance`, `data`예요.
- 화면 스타일: 왼쪽 아래(공통 모드에서는 오른쪽 위) **현재/공통** 토글로 지금 업무 시스템 모양과 DejaFix common-frontend 모양(보라 사이드바)을 바꿔 봐요. 주소에 `?ui=common`을 붙여도 돼요.
- 기획·개발은 같은 기획개발 데이터를, 인사·운영은 같은 인사 데이터를 메뉴만 나눠 보여 줘요.

## 데이터는 어디서 오나

- `src/mock/fixtures.json`: ax-backend 서비스들을 목 모드(`*_MOCK=1`)로 띄우고, 화면이 부르는 GET 응답을 녹화한 거예요(2026-10-27, 79개).
  - 재무 AI 자체 점검 결과는 바꿔 뒀어요. 녹화할 때 서비스끼리 연결하지 않아서 연결 실패 5개가 나왔는데, 이 항목만 "연결됨"으로 고쳤어요.
- `src/mock/install.ts`: `fetch`와 `EventSource`를 가로채서 녹화본을 돌려줘요.
  - 쓰기 요청(POST)은 성공 응답만 돌려줘요. 그래서 버튼을 눌러도 화면 데이터는 바뀌지 않아요.
- 부서 PC 연결과 서비스 연결 화면의 데이터는 브라우저(localStorage)에만 저장돼요.

## 실행

```bash
npm install
npm run dev          # http://localhost:3090
npm run build:pages  # GitHub Pages용 빌드 (dist/, 404.html 포함)
```

## DejaFix 서비스 화면

인프라 AI 화면은 DejaFix 레포(`DejaFix/DejaFix`)의 frontend를 목 데이터 버전으로 빌드해 `public/dejafix/`에 넣은 거예요. 백엔드 없이 DejaFix 자체 목(MSW)으로 돌아가고, 데모 관리자로 바로 로그인돼요.

DejaFix 화면을 최신으로 바꾸려면:

```
node scripts/build-dejafix.mjs <DejaFix 레포 경로>   # 기본 origin/dev
```
