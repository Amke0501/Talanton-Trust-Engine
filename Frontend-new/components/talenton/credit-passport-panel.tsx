'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import {
  formatUGX,
  SEED_PASSPORT_MEMBERS,
  type CreditPassportMember,
} from '@/lib/talenton-data'
import { fetchCreditPassportMembers } from '@/lib/api-service'
import { Card, CardBody } from '@/components/talenton/primitives'

export function CreditPassportPanel({ sectionId = 'credit-passport-section' }: { sectionId?: string }) {
  const [passportMembers, setPassportMembers] = useState<CreditPassportMember[]>(SEED_PASSPORT_MEMBERS)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadPassportMembers() {
      const members = await fetchCreditPassportMembers()
      if (isMounted) {
        setPassportMembers(Array.isArray(members) && members.length > 0 ? members : SEED_PASSPORT_MEMBERS)
      }
    }

    loadPassportMembers()

    return () => {
      isMounted = false
    }
  }, [])

  const avgTrustScore =
    passportMembers.length > 0
      ? Math.round(
          passportMembers.reduce((sum, member) => sum + (Number(member.trustScore) || 0), 0) /
            passportMembers.length
        )
      : 0

  const totalRepaidToDate = passportMembers.reduce(
    (sum, member) => sum + (Number(member.totalRepaid) || 0),
    0
  )

  const filteredPassport = passportMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card id={sectionId}>
      <CardBody className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#103a27]">
              TCredit Passport
            </h3>
            <p className="text-xs text-muted-foreground">
              Verified good creditors -- repayment history visible to every credit officer in the network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#0d2a1c] px-3 py-1.5 text-white text-xs">
              <span className="text-white/60 block text-[0.6rem]">PASSPORT HOLDERS</span>
              <span className="font-bold text-[#a4cc44]">{passportMembers.length}</span>
            </div>
            <div className="rounded-xl bg-[#0d2a1c] px-3 py-1.5 text-white text-xs">
              <span className="text-white/60 block text-[0.6rem]">AVG TRUST SCORE</span>
              <span className="font-bold text-emerald-400">{avgTrustScore}/100</span>
            </div>
            <div className="rounded-xl bg-[#0d2a1c] px-3 py-1.5 text-white text-xs">
              <span className="text-white/60 block text-[0.6rem]">REPAID TO DATE</span>
              <span className="font-mono font-bold text-white">{formatUGX(totalRepaidToDate)}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by member name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-xs font-semibold focus:border-[#103a27] focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPassport.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#103a27] text-white font-bold text-xs">
                    {member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                  </span>
                  <div>
                    <p className="font-bold text-xs text-foreground">{member.name}</p>
                    <p className="text-[0.65rem] text-muted-foreground">
                      {member.memberId} • {member.classification}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold ${
                    member.tier === 'PLATINUM'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : member.tier === 'GOLD'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  {member.tier}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/30 p-2.5 text-center">
                <div>
                  <span className="text-[0.6rem] text-muted-foreground block uppercase font-bold">
                    TRUST SCORE
                  </span>
                  <span className="text-base font-bold text-emerald-700">{member.trustScore}</span>
                  <span className="text-[0.6rem] text-muted-foreground">/100</span>
                </div>
                <div>
                  <span className="text-[0.6rem] text-muted-foreground block uppercase font-bold">
                    ON-TIME RATE
                  </span>
                  <span className="text-base font-bold text-[#103a27]">{member.onTimeRatePct}%</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground text-[0.65rem]">
                  <span>Loans completed:</span>
                  <span className="font-bold text-foreground">{member.loansCompleted}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[0.65rem]">
                  <span>Total repaid:</span>
                  <span className="font-mono font-bold text-foreground">{formatUGX(member.totalRepaid)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[0.65rem]">
                  <span>Current limit:</span>
                  <span className="font-mono font-bold text-emerald-700">{formatUGX(member.currentLimit)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-[0.65rem]">
                  <span>Last loan:</span>
                  <span className="font-bold text-foreground">{member.lastLoanDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}