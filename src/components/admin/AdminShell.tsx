import { Link } from "@/lib/nav";
import { usePathname } from "@/lib/nav";
import { useState, type ReactNode } from "react";
import { AccountSwitcher } from "@/demo/AccountSwitcher";
import { COMPANY, canOpen, useSession } from "@/demo/session";
import { IconAgents, IconBell, IconBolt, IconBox, IconChart, IconCode, IconDashboard, IconGear, IconLayout, IconMegaphone, IconOffice, IconPlan, IconSearch, IconShield, IconUsers } from "../icons";
import { UiStyleToggle, useUiStyle } from "@/demo/uiStyle";
import { IconUser } from "../icons";

const NAV = [
  { href: "/", label: "대시보드", Icon: IconDashboard },
  { href: "/orchestrator", label: "총괄", Icon: IconBolt },
  { href: "/finance", label: "재무 AI", Icon: IconShield },
  { href: "/data", label: "데이터분석 AI", Icon: IconChart },
  { href: "/hr", label: "인사 AI", Icon: IconUsers },
  { href: "/ops", label: "운영 AI", Icon: IconGear },
  { href: "/marketing", label: "마케팅 AI", Icon: IconMegaphone },
  { href: "/planning", label: "기획 AI", Icon: IconPlan },
  { href: "/dev", label: "개발 AI", Icon: IconCode },
  { href: "/infra", label: "인프라 AI", Icon: IconBox },
  { href: "/agents/chat", label: "AI 대화방", Icon: IconAgents },
  { href: "/support", label: "고객지원 AI", Icon: IconUser },
  { href: "/agents/office", label: "AI 오피스", Icon: IconOffice },
  // 데모에서 더한 시스템 관리 화면 (관리자 계정만)
  { href: "/system/integrations", label: "서비스 연결", Icon: IconLayout },
];

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path.startsWith(href));

function LogoMark() {
  return (
    <img src={`${import.meta.env.BASE_URL}logo.png`} width={34} height={34} alt="" aria-hidden="true" />
  );
}

/** Agent console frame: left icon rail + underline tabs, filling the whole window. */
export function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { account } = useSession();
  const nav = NAV.filter(({ href }) => account && canOpen(account, href));
  const home = account?.home ?? "/";
  const ui = useUiStyle();
  if (ui === "common") return <CommonShell nav={nav} home={home}>{children}</CommonShell>;

  return (
    <div className="flex h-screen overflow-hidden bg-app text-ink-900">
      <div className="flex min-w-0 flex-1 overflow-hidden bg-app">
        <nav className="flex w-[76px] shrink-0 flex-col items-center gap-2 border-r border-ink-100 py-6" aria-label="주 메뉴">
          <Link href={home} className="mb-6" aria-label="내 부서 홈"><LogoMark /></Link>
          {nav.map(({ href, label, Icon }) => {
            const on = isActive(path, href);
            return (
              <Link key={href} href={href} title={label} aria-label={label} aria-current={on ? "page" : undefined}
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition ${on ? "text-brand-600" : "text-ink-500 hover:bg-ink-100 hover:text-ink-900"}`}>
                {on && <span className="absolute -left-[16px] h-6 w-1 rounded-r bg-accent" />}
                <Icon size={20} />
              </Link>
            );
          })}
          <div className="mt-auto flex flex-col items-center gap-3"><UiStyleToggle /></div>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[72px] shrink-0 items-center gap-6 px-8">
            <span className="mr-2 shrink-0 text-[15px] font-semibold tracking-tight">AXcellent <span className="font-normal text-ink-500">with</span> {COMPANY.name}</span>
            <div className="flex min-w-0 flex-1 items-center gap-6 overflow-x-auto py-1 scroll-thin">
            {nav.map(({ href, label }) => {
              const on = isActive(path, href);
              return (
                <Link key={href} href={href} aria-current={on ? "page" : undefined}
                  className={`relative shrink-0 py-2 text-sm transition ${on ? "font-semibold text-ink-900" : "text-ink-500 hover:text-ink-900"}`}>
                  {label}
                  {on && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded bg-ink-900" />}
                </Link>
              );
            })}
            </div>
            <div className="flex shrink-0 items-center gap-4 text-ink-700">
              {account && canOpen(account, "/console") && <Link href="/console" title="문의 찾기" aria-label="문의 찾기"><IconSearch size={20} /></Link>}
              <IconBell size={20} />
              <span className="chip hidden bg-emerald-50 text-emerald-700 2xl:inline-flex" title="사내망에서만 열리고 외부 접근은 막혀 있습니다">사내망 {COMPANY.network}</span>
              <AccountSwitcher />
            </div>
          </header>
          <main className="relative min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 화면 스타일 '공통'
// DejaFix common-frontend AppShell 모양: 어두운 보라 사이드바(접기) + 흰 상단바.
// common-frontend CSS는 .btn·.card 같은 이름이 업무 화면과 겹쳐서, 틀만 같은 값으로 다시 그렸다 (vendor/common-frontend/src/styles/shell.css).
const SIDE_KEY = "axcellent-demo-side";
const readSide = () => {
  try { return localStorage.getItem(SIDE_KEY) === "collapsed"; } catch { return false; }
};

function CommonShell({ nav, home, children }: { nav: typeof NAV; home: string; children: ReactNode }) {
  const path = usePathname();
  const { account } = useSession();
  const [collapsed, setCollapsed] = useState(readSide);
  const toggle = () => setCollapsed((v) => {
    try { localStorage.setItem(SIDE_KEY, v ? "open" : "collapsed"); } catch { /* 저장이 막혀도 화면은 동작한다 */ }
    return !v;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-app text-ink-900">
      <aside className={`flex shrink-0 flex-col overflow-y-auto bg-[#1d1d3a] pb-3 text-[#e4e4f4] ${collapsed ? "w-16" : "w-[248px]"}`}>
        <div className={`mb-2 flex h-[60px] shrink-0 items-center gap-3 border-b border-white/10 ${collapsed ? "justify-center" : "px-3.5"}`}>
          <button type="button" onClick={toggle} aria-label={collapsed ? "메뉴 펼치기" : "메뉴 접기"} aria-expanded={!collapsed}
            className="grid h-9 w-9 shrink-0 place-items-center hover:bg-white/10">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {!collapsed && (
            <Link href={home} className="-ml-2 flex items-center gap-3" aria-label="내 부서 홈">
              <img src={`${import.meta.env.BASE_URL}axcellent-wordmark.png`} alt="AXcellent" className="h-7 w-auto" />
            </Link>
          )}
        </div>
        {nav.map(({ href, label, Icon }) => {
          const on = isActive(path, href);
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined} aria-label={label} aria-current={on ? "page" : undefined}
              className={`flex items-center gap-3.5 py-[13px] text-sm font-semibold transition ${collapsed ? "justify-center" : "px-[18px]"} ${on ? "bg-[#5b5bd6] text-white" : "hover:bg-white/10"}`}>
              <Icon size={18} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-ink-300 bg-surface px-8">
          <span className="shrink-0 text-[15px] font-semibold">AXcellent <span className="font-normal text-ink-500">with</span> {COMPANY.name}</span>
          <span className="chip hidden bg-emerald-50 text-emerald-700 xl:inline-flex" title="사내망에서만 열리고 외부 접근은 막혀 있습니다">사내망 {COMPANY.network}</span>
          <div className="flex-1" />
          <div className="flex shrink-0 items-center gap-4 text-ink-700">
            {account && canOpen(account, "/console") && <Link href="/console" title="문의 찾기" aria-label="문의 찾기"><IconSearch size={20} /></Link>}
            <IconBell size={20} />
            <UiStyleToggle horizontal />
            <AccountSwitcher />
          </div>
        </header>
        <main className="relative min-h-0 flex-1 overflow-y-auto pt-6">{children}</main>
      </div>
    </div>
  );
}
