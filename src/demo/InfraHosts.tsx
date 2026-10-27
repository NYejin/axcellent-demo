import { useState, type FormEvent } from 'react'
import { ago } from '@/lib/format'
import { COMPANY } from './session'
import { DEPTS, newId, now, privateIp, useHosts, type Host } from './store'

// DejaFix 인프라: 자빅스처럼 부서 PC를 IP로 등록해 연결한다. 사내망 주소만 받아서 시스템이 회사 밖으로 열리지 않는다.
const STATUS: Record<Host['status'], { label: string; tone: string; dot: string }> = {
  online: { label: '연결됨', tone: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  offline: { label: '응답 없음', tone: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
  pending: { label: '연결 확인 중', tone: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
}

export default function InfraHosts() {
  const [hosts, setHosts] = useHosts()
  const [form, setForm] = useState({ dept: DEPTS[0], hostname: '', ip: '' })
  const [error, setError] = useState<string | null>(null)

  const online = hosts.filter((h) => h.status === 'online').length
  const update = (id: string, patch: Partial<Host>) => setHosts((list) => list.map((h) => (h.id === id ? { ...h, ...patch } : h)))
  const check = (h: Host) => {
    update(h.id, { status: 'pending' })
    setTimeout(() => update(h.id, { status: 'online', lastSeen: now() }), 900)
  }

  const add = (e: FormEvent) => {
    e.preventDefault()
    if (!form.hostname.trim()) return setError('PC 이름을 입력하세요.')
    if (!privateIp(form.ip)) return setError('사내망 IP만 등록할 수 있습니다 (10.x, 172.16~31.x, 192.168.x).')
    if (hosts.some((h) => h.ip === form.ip.trim())) return setError('이미 등록된 IP입니다.')
    const h: Host = { id: newId(), dept: form.dept, hostname: form.hostname.trim(), ip: form.ip.trim(), status: 'pending', agent: '설치 확인 중', lastSeen: now() }
    setHosts((list) => [...list, h])
    setError(null)
    setForm({ ...form, hostname: '', ip: '' })
    setTimeout(() => update(h.id, { status: 'online', agent: `${form.dept.replace(/팀$/, '')} AI 0.9`, lastSeen: now() }), 1200)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-8 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-500">DejaFix 인프라</p>
          <h1 className="text-2xl font-semibold">부서 PC 연결</h1>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="chip bg-ink-100 text-ink-700">사내망 {COMPANY.network}</span>
          <span className="chip bg-emerald-50 text-emerald-700">외부 접근 차단</span>
          <span className="chip bg-brand-50 text-brand-700">연결 {online}/{hosts.length}대</span>
        </div>
      </header>

      <section className="card p-6">
        <div className="flex flex-col items-center gap-5">
          <div className="rounded-2xl bg-brand-600 px-6 py-3 text-center text-white">
            <p className="font-semibold">DejaFix</p>
            <p className="text-xs text-white/70">{COMPANY.name} 사내 서버</p>
          </div>
          <div className="h-5 w-px bg-ink-300" aria-hidden="true" />
          <ul className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {hosts.map((h) => (
              <li key={h.id} className="rounded-2xl border border-ink-100 bg-app p-3 text-sm">
                <p className="flex items-center gap-1.5 font-medium">
                  <span className={`h-2 w-2 rounded-full ${STATUS[h.status].dot}`} aria-hidden="true" />
                  {h.dept}
                </p>
                <p className="mt-1 font-mono text-xs text-ink-500">{h.ip}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-app text-left text-xs text-ink-500">
            <tr>
              <th className="px-6 py-3 font-medium">부서</th>
              <th className="px-3 py-3 font-medium">PC 이름</th>
              <th className="px-3 py-3 font-medium">IP</th>
              <th className="px-3 py-3 font-medium">부서 AI</th>
              <th className="px-3 py-3 font-medium">상태</th>
              <th className="px-3 py-3 font-medium">마지막 응답</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {hosts.map((h) => (
              <tr key={h.id} className="border-t border-ink-100">
                <td className="px-6 py-3 font-medium">{h.dept}</td>
                <td className="px-3 py-3">{h.hostname}</td>
                <td className="px-3 py-3 font-mono text-xs">{h.ip}</td>
                <td className="px-3 py-3 text-ink-700">{h.agent}</td>
                <td className="px-3 py-3"><span className={`chip ${STATUS[h.status].tone}`}>{STATUS[h.status].label}</span></td>
                <td className="px-3 py-3 text-ink-500">{ago(h.lastSeen)}</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button type="button" className="btn-quiet" onClick={() => check(h)}>연결 확인</button>
                    <button type="button" className="btn-quiet" onClick={() => setHosts((list) => list.filter((x) => x.id !== h.id))}>해제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card p-6">
        <h2 className="card-title">PC 추가</h2>
        <form onSubmit={add} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <select className="field" value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} aria-label="부서">
            {DEPTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <input className="field" placeholder="PC 이름 (예: mkt-pc-02)" value={form.hostname} onChange={(e) => setForm({ ...form, hostname: e.target.value })} aria-label="PC 이름" />
          <input className="field font-mono" placeholder="사내 IP (예: 192.168.10.42)" value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} aria-label="IP" />
          <button className="btn-primary">연결</button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>
    </div>
  )
}
