// 데모 로그인 세션. 실제 인증이 아니다: 계정은 아래 목록에 고정돼 있고, 고른 계정을 브라우저에만 기억한다.
// 실제 제품에서는 가입할 때 등록한 부서가 로그인 뒤 보이는 페이지를 정한다. 데모는 프로필 전환으로 그걸 흉내 낸다.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type Account = {
  id: string
  name: string
  dept: string
  email: string
  /** 로그인 뒤 처음 여는 화면 */
  home: string
  /** 이 계정이 열 수 있는 화면 주소 앞부분. '/'는 대시보드 한 곳만 뜻한다 */
  allow: string[]
}

/** 모든 부서가 같이 쓰는 화면 */
const SHARED = ['/agents/chat', '/agents/office']

export const ACCOUNTS: Account[] = [
  { id: 'admin', name: '시스템 관리자', dept: '시스템 관리', email: 'admin@catbooks.example', home: '/system/hosts', allow: ['/system', '/orchestrator', ...SHARED] }, // 부서 화면은 열지 않는다
  { id: 'planning', name: '기획 담당', dept: '기획팀', email: 'planning@catbooks.example', home: '/planning', allow: ['/planning', ...SHARED] },
  { id: 'dev', name: '개발 담당', dept: '개발팀', email: 'dev@catbooks.example', home: '/dev', allow: ['/dev', ...SHARED] },
  { id: 'support', name: '고객지원 담당', dept: '고객지원팀', email: 'support@catbooks.example', home: '/support', allow: ['/', '/support', '/console', '/claims', '/queue', '/reviews', '/kb', ...SHARED] },
  { id: 'marketing', name: '마케팅 담당', dept: '마케팅팀', email: 'marketing@catbooks.example', home: '/marketing', allow: ['/marketing', ...SHARED] },
  { id: 'hr', name: '인사 담당', dept: '인사팀', email: 'hr@catbooks.example', home: '/hr', allow: ['/hr', ...SHARED] },
  { id: 'ops', name: '운영 담당', dept: '운영팀', email: 'ops@catbooks.example', home: '/ops', allow: ['/ops', ...SHARED] },
  { id: 'finance', name: '재무 담당', dept: '재무팀', email: 'finance@catbooks.example', home: '/finance', allow: ['/finance', ...SHARED] },
  { id: 'data', name: '데이터분석 담당', dept: '데이터분석팀', email: 'data@catbooks.example', home: '/data', allow: ['/data', ...SHARED] },
]

export const COMPANY = { name: '캣북스', network: '192.168.10.0/24' }

export function canOpen(account: Account, path: string) {
  return account.allow.some((a) => a === '*' || (a === '/' ? path === '/' : path === a || path.startsWith(`${a}/`) || path.startsWith(`${a}?`)))
}

const KEY = 'axcellent-demo-account'
const load = (): Account | null => {
  // ?as=<계정 id> 로 열면 그 계정으로 바로 들어간다 (팀원에게 부서 화면 링크를 줄 때)
  const as = new URLSearchParams(window.location.search).get('as')
  const direct = ACCOUNTS.find((a) => a.id === as)
  if (direct) {
    save(direct.id)
    return direct
  }
  try {
    const id = localStorage.getItem(KEY)
    return ACCOUNTS.find((a) => a.id === id) ?? null
  } catch {
    return null
  }
}
const save = (id: string | null) => {
  try {
    if (id) localStorage.setItem(KEY, id)
    else localStorage.removeItem(KEY)
  } catch {
    /* 저장이 막힌 브라우저는 새로고침하면 다시 로그인한다 */
  }
}

type Session = { account: Account | null; signIn: (id: string) => Account | null; signOut: () => void }
const Ctx = createContext<Session | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(load)
  const signIn = useCallback((id: string) => {
    const next = ACCOUNTS.find((a) => a.id === id) ?? null
    setAccount(next)
    save(next?.id ?? null)
    return next
  }, [])
  const signOut = useCallback(() => {
    setAccount(null)
    save(null)
  }, [])
  const value = useMemo(() => ({ account, signIn, signOut }), [account, signIn, signOut])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSession() {
  const s = useContext(Ctx)
  if (!s) throw new Error('SessionProvider 밖에서 useSession을 불렀습니다')
  return s
}
