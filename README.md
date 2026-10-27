# AXcellent 데모

구조 회의용 프로토타입이에요. 백엔드 없이 프론트만으로 돌아가요.

- 저장소를 공개로 바꾸고 Settings → Pages → Source를 GitHub Actions로 두면 https://nyejin.github.io/axcellent-demo/ 에 올라가요 (`.github/workflows/pages.yml`). 비공개일 때는 로컬에서 `npm run dev`로 봐요.
- 부서 화면은 [ax-frontend](https://github.com/ax-company-hq/ax-frontend) `dashboard-web`(dev, c1eb44a)을 그대로 가져왔어요.

## 보여 주는 구조

```
┌──────────── 고객사 사내망 (폐쇄) ─────────────────────────┐
│  [DejaFix 인프라]  ← 부서 PC를 IP로 등록 (자빅스처럼)      │
│      ├─ 기획개발팀 PC  ├─ 고객지원팀 PC  ├─ 마케팅팀 PC …  │
│  [로그인] → 가입할 때 등록한 부서 페이지로 이동            │
│  [서비스 연결] ── URL·API·키 ──→ 캣북스 온라인 서점        │
└───────────────────────────────────────────────────────────┘
  우리는 서버 없이 프로그램만 제공해요. 데이터는 회사 안에만 있어요.
```

| 화면 | 주소 | 누가 보나 |
| --- | --- | --- |
| 로그인 | `/login` | 모두 |
| 부서 PC 연결 (DejaFix 인프라) | `/system/hosts` | 시스템 관리 |
| 서비스 연결 (고객사 서비스 연결부) | `/system/integrations` | 시스템 관리 |
| 부서 화면 (기획개발·고객지원·마케팅·인사·재무·데이터분석) | `/planning` 등 | 해당 부서 |
| AI 대화방·AI 오피스 | `/agents/chat`, `/agents/office` | 모든 부서 |
| 총괄 | `/orchestrator` | 시스템 관리 |

- 오른쪽 위 **프로필 전환** 드롭다운으로 부서 계정을 바꿔 가며 볼 수 있어요. 실제 제품에서는 로그인한 계정의 부서 페이지만 열려요.
- 부서 계정으로 바로 들어가는 링크: 주소 뒤에 `?as=planning`처럼 붙이면 돼요. 계정 id는 `admin`, `planning`, `support`, `marketing`, `hr`, `finance`, `data`예요.

## 데이터는 어디서 오나

- `src/mock/fixtures.json`: ax-backend 서비스들을 목 모드(`*_MOCK=1`)로 띄우고, 화면이 부르는 GET 응답을 녹화한 거예요(2026-10-27, 79개).
  - 재무 AI 자체 점검 결과는 바꿔 뒀어요. 녹화할 때 서비스끼리 연결하지 않아서 연결 실패 5개가 나왔는데, 이 항목만 "연결됨"으로 고쳤어요.
- `src/mock/install.ts`: `fetch`와 `EventSource`를 가로채서 녹화본을 돌려줘요.
  - 쓰기 요청(POST)은 성공 응답만 돌려줘요. 그래서 버튼을 눌러도 화면 데이터는 바뀌지 않아요.
- 부서 PC 연결과 서비스 연결 화면의 데이터는 브라우저(localStorage)에만 저장돼요.

## 실행

```bash
npm install
npm run dev          # http://localhost:3005
npm run build:pages  # GitHub Pages용 빌드 (dist/, 404.html 포함)
```
