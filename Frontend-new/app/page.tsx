'use client'

import Link from 'next/link'
import { ArrowRight, FileSearch, Landmark, UserRound } from 'lucide-react'

export default function RootPage() {
  const portals = [
    {
      title: 'Applicant Portal',
      icon: UserRound,
      href: '/login/applicant',
      subtitle: 'Apply for financing, monitor application progress and manage your loan portfolio.',
    },
    {
      title: 'Underwriter Portal',
      icon: FileSearch,
      href: '/login/underwriter',
      subtitle: 'Review applications, assess credit risk and prepare lending recommendations.',
    },
    {
      title: 'Committee Portal',
      icon: Landmark,
      href: '/login/committee',
      subtitle: 'Review recommendations, evaluate lending decisions and approve applications.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#eaf4e5] px-4 py-10 text-[#103a27] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-2xl border border-[#103a27]/15 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6c8f79]">TALANTON TRUST ENGINE</p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Portal</h1>
          <p className="mt-3 max-w-2xl text-sm text-[#2a5040]/85 sm:text-base">
            Select your portal to securely access your workspace.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portals.map((portal) => (
            <Link
              key={portal.href}
              href={portal.href}
              className="group rounded-2xl border border-[#103a27]/15 bg-white p-5 shadow-sm transition-all hover:border-[#103a27]/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#103a27]/30"
              aria-label={`Access ${portal.title}`}
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#eaf4e5] text-[#103a27]" aria-hidden>
                <portal.icon className="size-5" strokeWidth={2.25} />
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight">{portal.title}</h2>
              <p className="mt-2 text-sm text-[#2a5040]/80">{portal.subtitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#103a27] px-3.5 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#124a31]">
                Access Portal
                <ArrowRight className="size-4" strokeWidth={2.5} />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
