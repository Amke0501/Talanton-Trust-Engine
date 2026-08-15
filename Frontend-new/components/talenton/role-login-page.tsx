'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FormEvent, useMemo, useState } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { demoLogin } from '@/lib/api-service'
import {
  AUTH_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  USER_EMAIL_COOKIE_NAME,
} from '@/lib/role-access'
import type { RoleType } from '@/lib/talenton-data'

/* ── per-role image config ───────────────────────────────────────── */
const ROLE_META: Record<RoleType, { title: string; image: string | null; imageAlt: string }> = {
  applicant: {
    title: 'Applicant Portal',
    image: '/applicant_login.jpg',
    imageAlt: 'Applicant at a business counter',
  },
  underwriter: {
    title: 'Underwriter Portal',
    image: null,
    imageAlt: '',
  },
  committee: {
    title: 'Committee Portal',
    image: null,
    imageAlt: '',
  },
}

export function RoleLoginPage({ role }: { role: RoleType }) {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const meta = useMemo(() => ROLE_META[role], [role])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const resolvedEmail = email || `${role}@talenton.com`
    document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; samesite=lax`
    document.cookie = `${ROLE_COOKIE_NAME}=${role}; path=/; samesite=lax`
    document.cookie = `${USER_EMAIL_COOKIE_NAME}=${encodeURIComponent(resolvedEmail)}; path=/; samesite=lax`
    router.replace(`/dashboard/${role}`)
  }

  return (
    <>
      {/* ── Keyframe animations ─────────────────────────────────── */}
      <style>{`
        @keyframes rl-imgSlide {
          from { opacity: 0; transform: translateX(-30px) scale(1.04); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
        @keyframes rl-fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rl-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .rl-img-panel  { animation: rl-imgSlide 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .rl-badge      { animation: rl-fadeUp   0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .rl-title      { animation: rl-fadeUp   0.6s  cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .rl-sub        { animation: rl-fadeUp   0.6s  cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .rl-field1     { animation: rl-fadeUp   0.6s  cubic-bezier(0.22,1,0.36,1) 0.42s both; }
        .rl-field2     { animation: rl-fadeUp   0.6s  cubic-bezier(0.22,1,0.36,1) 0.52s both; }
        .rl-btn        { animation: rl-fadeUp   0.6s  cubic-bezier(0.22,1,0.36,1) 0.62s both; }
        /* Mobile irregular shape */
        .rl-mobile-img {
          clip-path: ellipse(90% 72% at 50% 38%);
        }
      `}</style>

      <main className="min-h-screen bg-[#eaf4e5] text-[#103a27] flex flex-col lg:flex-row">

        {/* ══ LEFT — image panel (desktop only) ════════════════════ */}
        {meta.image && (
          <div className="rl-img-panel hidden lg:block lg:w-[48%] xl:w-[52%] relative overflow-hidden">
            <Image
              src={meta.image}
              alt={meta.imageAlt}
              fill
              priority
              className="object-cover object-center"
            />
            {/* Back button over image */}
            <Link
              href="/"
              className="absolute top-6 left-6 z-10 flex items-center justify-center rounded-full bg-white/70 hover:bg-white p-3 transition-colors shadow-sm backdrop-blur-sm"
              aria-label="Back"
            >
              <ArrowLeft className="size-5" strokeWidth={2.5} />
            </Link>
          </div>
        )}

        {/* ══ RIGHT — form panel ═══════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">

          {/* Mobile: back + logo header */}
          <header className="flex items-center justify-between px-6 pt-8 pb-4 lg:px-12 lg:pt-10">
            <Link
              href="/"
              className="lg:hidden flex items-center justify-center rounded-full bg-[#103a27]/8 hover:bg-[#103a27]/15 p-3 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="size-5" strokeWidth={2.5} />
            </Link>
            <div className="text-2xl font-serif font-bold text-[#103a27] ml-auto">Talanton.</div>
          </header>

          {/* Mobile decorative image — irregular clip */}
          {meta.image && (
            <div className="lg:hidden mx-6 mt-2 mb-6 h-52 relative overflow-hidden rounded-3xl">
              <Image
                src={meta.image}
                alt={meta.imageAlt}
                fill
                priority
                className="rl-mobile-img object-cover object-center"
              />
              {/* soft overlay so form is still the focus */}
              <div className="absolute inset-0 bg-[#eaf4e5]/30" />
            </div>
          )}

          {/* Form container */}
          <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-16 xl:px-24">
            <div className="w-full max-w-md">

              {/* Portal badge */}
              <div className="rl-badge mb-3">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#103a27]/60 bg-[#103a27]/8 px-3 py-1 rounded-full">
                  {meta.title}
                </span>
              </div>

              {/* Heading */}
              <h1 className="rl-title font-serif text-5xl md:text-6xl font-bold tracking-tight text-[#103a27] leading-tight">
                Welcome back
              </h1>
              <p className="rl-sub mt-3 text-base text-[#2a5040]/70">
                Sign in securely to access your workspace.
              </p>

              <form className="mt-10 space-y-6" onSubmit={handleSubmit}>

                {/* Email */}
                <label className="rl-field1 block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2a5040]/80">Email</span>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-[#103a27]/12 bg-white/80 px-5 py-4 text-base outline-none transition focus:border-[#103a27] focus:bg-white focus:ring-1 focus:ring-[#103a27] placeholder:text-[#103a27]/35"
                  />
                </label>

                {/* Password */}
                <label className="rl-field2 block space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#2a5040]/80">Password</span>
                    <Link href="#" className="text-xs font-semibold text-[#103a27]/70 hover:text-[#103a27] hover:underline transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type={showPw ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-[#103a27]/12 bg-white/80 px-5 py-4 pr-12 text-base outline-none transition focus:border-[#103a27] focus:bg-white focus:ring-1 focus:ring-[#103a27] placeholder:text-[#103a27]/35"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#103a27]/40 hover:text-[#103a27]/70 transition-colors"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </label>

                {/* Error */}
                {error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="rl-btn w-full rounded-[2.5rem] bg-[#103a27] px-8 py-5 text-lg font-semibold text-white transition hover:bg-[#124a31] active:scale-[0.98] disabled:opacity-60 cursor-pointer shadow-md mt-2"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

