'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { demoLogin } from '@/lib/api-service'
import {
  AUTH_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  USER_EMAIL_COOKIE_NAME,
} from '@/lib/role-access'
import type { RoleType } from '@/lib/talenton-data'

const ROLE_PORTAL_META: Record<RoleType, { title: string }> = {
  applicant: {
    title: 'Applicant Portal',
  },
  underwriter: {
    title: 'Underwriter Portal',
  },
  committee: {
    title: 'Committee Portal',
  },
}

export function RoleLoginPage({ role }: { role: RoleType }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const pageTitle = useMemo(() => ROLE_PORTAL_META[role].title, [role])

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
    <main className="min-h-screen bg-[#eaf4e5] px-4 py-10 text-[#103a27] sm:px-6 lg:px-8 flex flex-col justify-center relative">
      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 w-full flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center justify-center rounded-full bg-[#103a27]/5 hover:bg-[#103a27]/10 p-3 transition-colors cursor-pointer" aria-label="Back to selection">
          <ArrowLeft className="size-6" strokeWidth={2.5} />
        </Link>
        <div className="text-3xl font-serif font-bold text-[#103a27]">Talanton.</div>
      </header>

      <div className="mx-auto w-full max-w-xl pb-12 mt-16">
        <div className="mb-14">
          <h1 className="font-serif text-6xl md:text-7xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="mt-4 text-lg md:text-xl text-[#2a5040]/80">Sign in securely to access your workspace.</p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <label className="block space-y-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#2a5040]/80">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-[#103a27]/10 bg-white/70 px-6 py-4.5 text-lg outline-none transition focus:border-[#103a27] focus:bg-white focus:ring-1 focus:ring-[#103a27]"
            />
          </label>

          <label className="block space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-[#2a5040]/80">Password</span>
              <Link href="#" className="text-sm font-semibold text-[#103a27] hover:underline opacity-80 hover:opacity-100">Forgot password?</Link>
            </div>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-[#103a27]/10 bg-white/70 px-6 py-4.5 text-lg outline-none transition focus:border-[#103a27] focus:bg-white focus:ring-1 focus:ring-[#103a27]"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-[#a52929]/20 bg-[#fff0f0] px-6 py-4.5 text-base text-[#a52929]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[2.5rem] bg-[#103a27] px-8 py-5 text-xl font-semibold text-white transition hover:bg-[#124a31] disabled:opacity-60 cursor-pointer shadow-md mt-4"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
