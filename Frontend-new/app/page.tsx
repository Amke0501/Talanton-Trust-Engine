import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#eaf4e5] text-[#103a27] font-sans selection:bg-[#103a27] selection:text-[#eaf4e5]">
      {/* Navigation */}
      <nav className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight">
            Talenton<span className="text-[#a4cc44]">.</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 px-8 py-3 rounded-full bg-[#dbead5] text-sm font-medium">
          <Link href="#" className="hover:text-black transition-colors">Solution</Link>
          <span className="w-1 h-1 rounded-full bg-black/20" />
          <Link href="#" className="hover:text-black transition-colors">For SACCOs</Link>
          <span className="w-1 h-1 rounded-full bg-black/20" />
          <Link href="#" className="hover:text-black transition-colors">Partnerships</Link>
          <span className="w-1 h-1 rounded-full bg-black/20" />
          <Link href="#" className="hover:text-black transition-colors">Resources</Link>
          <span className="w-1 h-1 rounded-full bg-black/20" />
          <Link href="#" className="hover:text-black transition-colors">Contact Us</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold hover:text-black transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="group flex items-center gap-2 bg-[#2a5040] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1f3d30] transition-colors"
          >
            Sign up
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#2a5040] group-hover:scale-105 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center justify-center min-h-[85vh]">
        <h1 className="font-serif text-[4rem] sm:text-[5.5rem] leading-[1.05] tracking-tight text-[#103a27] text-balance max-w-4xl mx-auto">
          A better way to offer credit access to your members
        </h1>
        
        <p className="mt-8 text-lg sm:text-xl text-[#2a5040]/80 max-w-2xl mx-auto leading-relaxed">
          Talenton offers secure credit access to SACCO members with the lowest-risk
          and lowest cost to cooperatives in the market.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/signup"
            className="group flex items-center gap-3 bg-[#2a5040] text-white px-6 py-3.5 rounded-full text-base font-semibold hover:bg-[#1f3d30] transition-colors"
          >
            Get started
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#2a5040] group-hover:scale-105 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          
          <button
            type="button"
            className="group flex items-center gap-3 bg-[#dbead5] text-[#103a27] px-6 py-3.5 rounded-full text-base font-semibold hover:bg-[#c9dfc0] transition-colors"
          >
            See how it works
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#103a27] text-white group-hover:scale-105 transition-transform">
              <Play className="w-3 h-3 fill-white" />
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}
