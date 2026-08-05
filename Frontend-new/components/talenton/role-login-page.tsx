'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import { demoLogin } from '@/lib/api-service'
import {
  AUTH_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  USER_EMAIL_COOKIE_NAME,
} from '@/lib/role-access'
import type { RoleType } from '@/lib/talenton-data'

const DEMO_CREDENTIALS: Record<RoleType, { email: string; password: string; title: string }> = {
  applicant: {
    email: 'applicant@talanton.demo',
    password: 'Demo123!',
    title: 'Applicant Portal',
  },
  underwriter: {
    email: 'underwriter@talanton.demo',
    password: 'Demo123!',
    title: 'Underwriter Portal',
  },
  committee: {
    email: 'committee@talanton.demo',
    password: 'Demo123!',
    title: 'Committee Portal',
  },
}

export function RoleLoginPage({ role }: { role: RoleType }) {
  const router = useRouter()
  const [email, setEmail] = useState(DEMO_CREDENTIALS[role].email)
  const [password, setPassword] = useState(DEMO_CREDENTIALS[role].password)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const pageTitle = useMemo(() => DEMO_CREDENTIALS[role].title, [role])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const result = await demoLogin({
      email,
      password,
      portalRole: role,
    })

    if (!result.success || !result.data) {
      setLoading(false)
      setError(result.message || 'Unable to sign in.')
      return
    }

    document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; samesite=lax`
    document.cookie = `${ROLE_COOKIE_NAME}=${result.data.role}; path=/; samesite=lax`
    document.cookie = `${USER_EMAIL_COOKIE_NAME}=${encodeURIComponent(result.data.email)}; path=/; samesite=lax`

    router.replace(`/dashboard/${result.data.role}`)
  }

  return (
    <main className="min-h-screen bg-[#eaf4e5] px-4 py-10 text-[#103a27] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#103a27]/15 bg-white p-6 shadow-sm sm:p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-[#6c8f79]">Talanton Demo Access</p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <p className="mt-2 text-sm text-[#2a5040]/80">Sign in using your role-specific demo account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2a5040]/80">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="w-full rounded-xl border border-[#103a27]/20 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#103a27]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2a5040]/80">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              className="w-full rounded-xl border border-[#103a27]/20 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#103a27]"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-[#a52929]/20 bg-[#fff0f0] px-3 py-2 text-sm text-[#a52929]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#103a27] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124a31] disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-[#103a27]/15 bg-[#f5faf2] p-3 text-xs text-[#2a5040]/85">
          <p className="font-semibold">Demo credentials</p>
          <p className="mt-1">Email: {DEMO_CREDENTIALS[role].email}</p>
          <p>Password: {DEMO_CREDENTIALS[role].password}</p>
        </div>

        <Link href="/" className="mt-5 inline-block text-sm font-semibold text-[#103a27] hover:underline">
          Back to role selection
        </Link>
      </div>
    </main>
  )
}
