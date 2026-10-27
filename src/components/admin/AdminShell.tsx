import { Link } from "@/lib/nav";
import { usePathname } from "@/lib/nav";
import type { ReactNode } from "react";
import { AccountSwitcher } from "@/demo/AccountSwitcher";
import { COMPANY, canOpen, useSession } from "@/demo/session";
import { IconAgents, IconBell, IconBolt, IconBox, IconChart, IconDashboard, IconLayout, IconMegaphone, IconOffice, IconPlan, IconSearch, IconShield, IconUsers } from "../icons";
import { ThemeToggle } from "../ThemeToggle";
import { IconUser } from "../icons";

const NAV = [
  { href: "/", label: "대시보드", Icon: IconDashboard },
  { href: "/orchestrator", label: "총괄", Icon: IconBolt },
  { href: "/finance", label: "재무 AI", Icon: IconShield },
  { href: "/data", label: "데이터분석 AI", Icon: IconChart },
  { href: "/hr", label: "인사 AI", Icon: IconUsers },
  { href: "/marketing", label: "마케팅 AI", Icon: IconMegaphone },
  { href: "/planning", label: "기획개발 AI", Icon: IconPlan },
  { href: "/agents/chat", label: "AI 대화방", Icon: IconAgents },
  { href: "/support", label: "고객지원 AI", Icon: IconUser },
  { href: "/agents/office", label: "AI 오피스", Icon: IconOffice },
  // 데모에서 더한 시스템 관리 화면 (관리자 계정만)
  { href: "/system/hosts", label: "부서 PC 연결", Icon: IconBox },
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
          <div className="mt-auto flex flex-col items-center gap-3"><ThemeToggle vertical /></div>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[72px] shrink-0 items-center gap-6 px-8">
            <span className="mr-2 shrink-0 text-[15px] font-semibold tracking-tight">AXcellent <span className="font-normal text-ink-500">· {COMPANY.name}</span></span>
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
