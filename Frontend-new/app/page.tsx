'use client'

import Link from 'next/link'
import { LoginModal } from '@/components/LoginModal'
import { ArrowRight, Play } from 'lucide-react'
import { ReactNode } from 'react'

function GetStartedButton() {
  return (
    <button className="rounded-[2rem] bg-[#103a27] text-white px-8 py-3.5 text-lg font-medium hover:bg-[#124a31] transition-colors flex items-center gap-3 cursor-pointer">
      Get started
      <span className="bg-white text-[#103a27] rounded-full p-1.5"><ArrowRight className="size-4" strokeWidth={2.5} /></span>
    </button>
  )
}

function LoginButton() {
  return (
    <button className="hover:text-[#103a27]/80 cursor-pointer text-base md:text-lg font-medium">Log in</button>
  )
}

export default function RootPage() {
  return (
    <div className="min-h-screen bg-[#eaf4e5] text-[#103a27] font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 w-full">
        <div className="text-3xl font-serif font-bold text-[#103a27]">Talanton.</div>
        <div className="hidden md:flex items-center gap-8 text-base font-medium rounded-full bg-[#103a27]/5 px-8 py-3">
          <Link href="#" className="hover:text-[#103a27]/80">Solution</Link>
          <span className="text-[#103a27]/30">•</span>
          <Link href="#" className="hover:text-[#103a27]/80">For SACCOs</Link>
          <span className="text-[#103a27]/30">•</span>
          <Link href="#" className="hover:text-[#103a27]/80">Partnerships</Link>
          <span className="text-[#103a27]/30">•</span>
          <Link href="#" className="hover:text-[#103a27]/80">Resources</Link>
          <span className="text-[#103a27]/30">•</span>
          <Link href="#" className="hover:text-[#103a27]/80">Contact Us</Link>
        </div>
        <div className="flex items-center gap-6 text-base font-medium">
          <LoginModal>
            <LoginButton />
          </LoginModal>
          <button className="rounded-full bg-[#103a27] text-white px-6 py-2.5 text-base font-medium hover:bg-[#124a31] transition-colors flex items-center gap-2 cursor-pointer">
            Sign up
            <span className="bg-white text-[#103a27] rounded-full p-1"><ArrowRight className="size-3" strokeWidth={2.5} /></span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center mx-auto max-w-5xl px-6 pt-12 pb-24 text-center">
        <h1 className="font-serif text-6xl md:text-8xl font-semibold leading-tight tracking-tight text-[#103a27]">
          A better way to<br/>offer credit access<br/>to your members
        </h1>
        <p className="mt-8 text-[#2a5040]/80 text-xl md:text-2xl max-w-3xl mx-auto">
          Talanton offers secure credit access to SACCO members with the lowest-risk and lowest cost to cooperatives in the market.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <LoginModal>
            <GetStartedButton />
          </LoginModal>
          
          <button className="rounded-full bg-[#103a27]/10 text-[#103a27] px-8 py-4 text-lg font-medium hover:bg-[#103a27]/20 transition-colors flex items-center gap-3 cursor-pointer">
            See how it works
            <span className="bg-[#103a27] text-white rounded-full p-1.5"><Play className="size-4 fill-white" /></span>
          </button>
        </div>
      </main>
    </div>
  )
}
