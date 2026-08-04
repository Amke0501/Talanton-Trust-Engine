'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()

  function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#eaf4e5] text-[#103a27] font-sans flex flex-col selection:bg-[#103a27] selection:text-[#eaf4e5]">
      <nav className="p-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-full bg-[#dbead5] px-4 py-2 text-sm font-medium text-[#2a5040] hover:bg-[#cde0c5] transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to home
          <ArrowLeft className="w-3.5 h-3.5 opacity-50 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 pb-20">
        <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-10 sm:p-14">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#103a27] text-center mb-3">
              Create an account
            </h1>
            <p className="text-center text-[#2a5040]/60 text-base mb-12">
              Join Talenton to access secure credit
            </p>

            <form onSubmit={handleSignup} className="space-y-7">
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2a5040]/70">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-b-2 border-[#2a5040]/15 px-1 py-3.5 text-base focus:outline-none focus:border-[#2a5040] transition-colors placeholder:text-[#2a5040]/30"
                  placeholder="e.g. Auma Florence"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2a5040]/70">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-transparent border-b-2 border-[#2a5040]/15 px-1 py-3.5 text-base focus:outline-none focus:border-[#2a5040] transition-colors placeholder:text-[#2a5040]/30"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#2a5040]/70">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full bg-transparent border-b-2 border-[#2a5040]/15 px-1 py-3.5 text-base focus:outline-none focus:border-[#2a5040] transition-colors placeholder:text-[#2a5040]/30"
                  placeholder="Create a strong password"
                />
              </div>

              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-3 bg-[#2a5040] text-white px-6 py-4 rounded-full text-base font-semibold hover:bg-[#1f3d30] transition-colors mt-6"
              >
                Sign up
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 group-hover:bg-white/30 group-hover:scale-105 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </form>

            <p className="text-center text-sm text-[#2a5040]/60 mt-10">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[#103a27] hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
