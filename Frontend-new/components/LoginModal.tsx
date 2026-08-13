'use client'

import { ArrowRight, FileSearch, Landmark, UserRound, X } from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { ReactNode, useState, useEffect } from 'react'

export function LoginModal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const portals = [
    {
      title: 'Applicant',
      href: '/login/applicant',
    },
    {
      title: 'Underwriter',
      href: '/login/underwriter',
    },
    {
      title: 'Committee',
      href: '/login/committee',
    },
  ]

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-xl border-none !ring-0 bg-transparent shadow-none p-0">
        <DialogClose className="absolute -top-12 right-0 md:-right-12 rounded-full bg-white/50 p-2 text-[#103a27] hover:bg-white/80 transition-colors focus:outline-none">
          <X className="size-6" strokeWidth={2.5} />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className="mb-10 mt-4 text-center">
          <DialogTitle className="font-serif text-5xl md:text-6xl font-bold text-[#103a27]">Who are you logging in as ....</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 items-center w-full">
          {portals.map((portal) => (
            <Link
              key={portal.href}
              href={portal.href}
              className="relative flex w-full max-w-sm items-center justify-center rounded-[3rem] bg-[#103a27] py-6 px-6 transition-all hover:bg-[#124a31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label={`Access ${portal.title}`}
            >
              <span className="text-3xl font-medium text-white">{portal.title}</span>
              <span className="absolute right-4 flex items-center justify-center bg-white text-[#103a27] rounded-full p-2.5 transition-transform group-hover:translate-x-1" aria-hidden>
                <ArrowRight className="size-6" strokeWidth={2.5} />
              </span>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
