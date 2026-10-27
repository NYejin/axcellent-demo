import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'

import { ThemeProvider } from '@/components/ThemeProvider'
import { AdminShell } from '@/components/admin/AdminShell'
import AgentChat from '@/pages/AgentChat'
import AgentOffice from '@/pages/AgentOffice'
import Claims from '@/pages/Claims'
import Console from '@/pages/Console'
import Dashboard from '@/pages/Dashboard'
import Data from '@/pages/Data'
import Finance from '@/pages/Finance'
import FinanceGuide from '@/pages/FinanceGuide'
import Hr from '@/pages/Hr'
import Orchestrator from '@/pages/Orchestrator'
import Kb from '@/pages/Kb'
import Marketing from '@/pages/Marketing'
import PlanningPage from '@/planning/PlanningPage'
import Queue from '@/pages/Queue'
import Reviews from '@/pages/Reviews'
import Support from '@/pages/Support'
import InfraHosts from '@/demo/InfraHosts'
import Integrations from '@/demo/Integrations'
import LoginPage from '@/demo/LoginPage'
import { canOpen, useSession } from '@/demo/session'

export function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Guarded><Pages /></Guarded>} />
      </Routes>
    </ThemeProvider>
  )
}

/** 로그인하지 않았으면 로그인 화면으로, 내 부서가 열 수 없는 화면이면 내 부서 홈으로 보낸다 */
function Guarded({ children }: { children: ReactNode }) {
  const { account } = useSession()
  const { pathname } = useLocation()
  if (!account) return <Navigate to="/login" replace />
  if (!canOpen(account, pathname)) return <Navigate to={account.home} replace />
  return <>{children}</>
}

function Pages() {
  return (
      <AdminShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/console" element={<Console />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/kb" element={<Kb />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/finance/guide" element={<FinanceGuide />} />
          <Route path="/hr" element={<Hr />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/orchestrator" element={<Orchestrator />} />
          <Route path="/data" element={<Data />} />
          <Route path="/hr" element={<Hr />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/agents/chat" element={<AgentChat />} />
          <Route path="/agents/office" element={<AgentOffice />} />
          <Route path="/support" element={<Support />} />
          <Route path="/system/hosts" element={<InfraHosts />} />
          <Route path="/system/integrations" element={<Integrations />} />
          {/* catbooks 시절 /admin/* 주소 호환 */}
          <Route path="/admin/*" element={<LegacyAdminRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminShell>
  )
}

/** /admin/console?id=3 → /console?id=3 */
function LegacyAdminRedirect() {
  const { pathname, search } = useLocation()
  return <Navigate to={(pathname.replace(/^\/admin/, '') || '/') + search} replace />
}
