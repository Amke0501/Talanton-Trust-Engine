'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Minus,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  Wallet,
  XCircle,
} from 'lucide-react'
import {
  formatUGX,
  SEED_PORTFOLIO_LOANS,
  type Application,
  type BoardMemberVote,
  type PortfolioLoan,
} from '@/lib/talenton-data'
import { Card, CardBody } from '@/components/talenton/primitives'

export function CommitteeDashboardView({
  application,
  onCastVote,
  onBack,
}: {
  application: Application
  onCastVote: (memberRole: string, vote: 'APPROVE' | 'REJECT' | 'ABSTAIN') => void
  onBack?: () => void
}) {
  // Board Member Voting State
  const [boardVotes, setBoardVotes] = useState<BoardMemberVote[]>(
    application.committeeVotes || [
      { id: 'v1', name: 'Chairman', role: 'Chairperson', vote: 'APPROVE' },
      { id: 'v2', name: 'Sec. General', role: 'Risk Head', vote: 'APPROVE' },
      { id: 'v3', name: 'Mrs. Nabukenya', role: 'Credit Officer', vote: 'APPROVE' },
      { id: 'v4', name: 'Dr. Ochieng', role: 'Treasurer', vote: 'ABSTAIN' },
      { id: 'v5', name: 'Eng. Museveni', role: 'Board Member', vote: 'ABSTAIN' },
    ]
  )

  // Portfolio State
  const [portfolioLoans, setPortfolioLoans] = useState<PortfolioLoan[]>(SEED_PORTFOLIO_LOANS)
  const [portfolioFilter, setPortfolioFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'REJECTED'>('ALL')

  const approveCount = boardVotes.filter((v) => v.vote === 'APPROVE').length
  const rejectCount = boardVotes.filter((v) => v.vote === 'REJECT').length
  const abstainCount = boardVotes.filter((v) => v.vote === 'ABSTAIN' || !v.vote).length
  const isQuorumPassed = approveCount >= 4

  function handleVoteClick(role: string, vote: 'APPROVE' | 'REJECT' | 'ABSTAIN') {
    const updated = boardVotes.map((b) => (b.role === role ? { ...b, vote } : b))
    setBoardVotes(updated)
    onCastVote(role, vote)
  }

  function handleDisburse(ref: string) {
    setPortfolioLoans((prev) =>
      prev.map((l) => (l.reference === ref ? { ...l, status: 'REPAYING', isLocked: true, actionLabel: undefined } : l))
    )
    alert(`Loan ${ref} disbursed successfully!`)
  }

  function handleApproveLoan(ref: string) {
    setPortfolioLoans((prev) =>
      prev.map((l) => (l.reference === ref ? { ...l, status: 'APPROVED', actionLabel: 'Disburse' } : l))
    )
  }

  function handleRejectLoan(ref: string) {
    setPortfolioLoans((prev) =>
      prev.map((l) => (l.reference === ref ? { ...l, status: 'REJECTED', isLocked: true } : l))
    )
  }

  const filteredLoans = portfolioLoans.filter((l) => {
    if (portfolioFilter === 'ALL') return true
    if (portfolioFilter === 'PENDING') return l.status === 'PENDING'
    if (portfolioFilter === 'APPROVED') return l.status === 'APPROVED'
    if (portfolioFilter === 'ACTIVE') return l.status === 'REPAYING'
    if (portfolioFilter === 'COMPLETED') return l.status === 'COMPLETED'
    if (portfolioFilter === 'REJECTED') return l.status === 'REJECTED'
    return true
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Bar with Back Button & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-[#103a27] transition-colors"
              title="Back to applications list"
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-[#103a27]">{application.fullName}</h2>
              <span className="font-mono text-xs bg-[#0d2a1c] text-[#a4cc44] px-2.5 py-0.5 rounded-full font-bold">
                {application.reference}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Member ID: <strong className="text-gray-700">{application.memberId}</strong> &bull; Purpose: <strong className="text-gray-700">{application.purpose}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isQuorumPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isQuorumPassed ? 'Quorum Passed (Ready for Disbursal)' : 'Quorum Pending (4/5 Required)'}
          </span>
        </div>
      </div>

      {/* SECTION 1: COMMITTEE AUTHORIZATION BOARD */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Verified Underwriting Stats Freeze Card */}
        <div className="lg:col-span-4">
          <Card className="border-none shadow-sm rounded-2xl bg-white">
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <ShieldCheck className="size-5 text-[#103a27]" />
                <h3 className="font-serif text-sm font-bold text-[#103a27]">
                  Verified Underwriting Stats
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Applicant Loan</span>
                  <span className="font-mono font-bold text-[#103a27]">{formatUGX(application.principal)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">DTI Percentage</span>
                  <span className="font-bold text-[#103a27]">{application.dtiNetRatio?.toFixed(1) || '28.5'}%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Savings Multiplier</span>
                  <span className="font-bold text-[#103a27]">{application.multiplier || 3.0}x</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Audit Check Verdict</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${
                    application.verdict === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {application.verdict || 'APPROVED'}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200">
                <p className="text-[0.65rem] text-amber-900 leading-relaxed font-medium">
                  <strong>Note for Board:</strong> These stats are frozen snapshots from the underwriting audit phase. Overrides are logged with immutable audit trails.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Committee Board Sign-off Card (Who Approved What) */}
        <div className="lg:col-span-8">
          <Card className="border-none shadow-sm rounded-2xl bg-white">
            <CardBody className="p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#103a27]">
                    Committee Board Sign-off
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Cast individual votes and override decisions for this application file.
                  </p>
                </div>
                <span className="rounded-full bg-[#103a27]/10 px-3 py-1 text-xs font-bold text-[#103a27]">
                  Board Quorum: 4 / 5
                </span>
              </div>

              {/* Voting Cards Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {boardVotes.map((mem) => {
                  const isApprove = mem.vote === 'APPROVE'
                  const isReject = mem.vote === 'REJECT'
                  const isAbstain = mem.vote === 'ABSTAIN' || !mem.vote
                  return (
                    <div
                      key={mem.role}
                      className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-[#f4f5f4] p-3 text-center space-y-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#103a27]">{mem.name}</p>
                        <p className="text-[0.65rem] text-gray-500 font-medium">{mem.role}</p>
                      </div>

                      {/* Vote Buttons */}
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleVoteClick(mem.role, 'APPROVE')}
                          title="Approve loan"
                          className={`size-7 rounded-full flex items-center justify-center transition-all ${
                            isApprove ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-400 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <ThumbsUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVoteClick(mem.role, 'REJECT')}
                          title="Reject loan"
                          className={`size-7 rounded-full flex items-center justify-center transition-all ${
                            isReject ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-gray-400 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <ThumbsDown className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVoteClick(mem.role, 'ABSTAIN')}
                          title="Abstain"
                          className={`size-7 rounded-full flex items-center justify-center transition-all ${
                            isAbstain ? 'bg-slate-700 text-white shadow-md' : 'bg-white text-gray-400 hover:bg-slate-100'
                          }`}
                        >
                          <Minus className="size-3.5" />
                        </button>
                      </div>

                      <span
                        className={`text-[0.65rem] font-bold uppercase tracking-wider ${
                          isApprove ? 'text-emerald-700' : isReject ? 'text-rose-700' : 'text-slate-500'
                        }`}
                      >
                        {mem.vote || 'ABSTAINED'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Committee Quorum Outcome Tracker */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#0d2a1c] p-4 text-white">
                <div>
                  <p className="text-xs font-bold text-white">Committee Quorum Outcome Tracker</p>
                  <p className="text-[0.7rem] text-white/70 mt-0.5">
                    {approveCount} Approvals, {rejectCount} Rejections, {abstainCount} Abstentions
                  </p>
                </div>

                <span
                  className={`rounded-xl px-4 py-2 text-xs font-bold shadow-md ${
                    isQuorumPassed ? 'bg-[#a4cc44] text-[#0d2a1c]' : 'bg-rose-600 text-white'
                  }`}
                >
                  {isQuorumPassed ? 'BOARD APPROVED (QUORUM PASSED)' : 'QUORUM BLOCKED (NEED 4 APPROVALS)'}
                </span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* SECTION 2: LOAN PORTFOLIO TRACKER */}
      <Card className="border-none shadow-sm rounded-2xl bg-white">
        <CardBody className="p-6 space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#103a27]">
                Loan Portfolio Tracker
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Board-wide oversight of every loan in the pipeline — approve, disburse, and monitor repayments.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#0d2a1c] px-3.5 py-2 text-white text-xs">
                <span className="text-white/60 block text-[0.6rem]">BOOK VALUE</span>
                <span className="font-mono font-bold text-[#a4cc44]">UGX 89,000,000</span>
              </div>
              <div className="rounded-xl bg-rose-950 px-3.5 py-2 text-white text-xs border border-rose-800">
                <span className="text-rose-300 block text-[0.6rem]">ARREARS</span>
                <span className="font-mono font-bold text-rose-400">UGX 320,000</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: `All (${portfolioLoans.length})` },
              { id: 'PENDING', label: `Pending (${portfolioLoans.filter(l => l.status === 'PENDING').length})` },
              { id: 'APPROVED', label: `Approved (${portfolioLoans.filter(l => l.status === 'APPROVED').length})` },
              { id: 'ACTIVE', label: `Active (${portfolioLoans.filter(l => l.status === 'REPAYING').length})` },
              { id: 'COMPLETED', label: `Completed (${portfolioLoans.filter(l => l.status === 'COMPLETED').length})` },
              { id: 'REJECTED', label: `Rejected (${portfolioLoans.filter(l => l.status === 'REJECTED').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPortfolioFilter(tab.id as any)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  portfolioFilter === tab.id
                    ? 'bg-[#103a27] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f4f5f4] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="p-3">FILE</th>
                  <th className="p-3">BORROWER</th>
                  <th className="p-3">TYPE</th>
                  <th className="p-3">PRINCIPAL</th>
                  <th className="p-3">REPAYMENT</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredLoans.map((loan) => (
                  <tr key={loan.reference} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#103a27]">{loan.reference}</td>
                    <td className="p-3">
                      <p className="font-bold text-[#103a27]">{loan.borrowerName}</p>
                      <p className="text-[0.65rem] text-gray-500">{loan.borrowerMeta}</p>
                    </td>
                    <td className="p-3">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-[0.65rem] font-bold text-[#103a27]">
                        {loan.type}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#103a27]">{formatUGX(loan.principal)}</td>
                    <td className="p-3">
                      {loan.repaymentProgress ? (
                        <div>
                          <p className="text-xs font-semibold text-gray-800">{loan.repaymentProgress}</p>
                          {loan.dueDate && <p className="text-[0.65rem] text-gray-500">{loan.dueDate}</p>}
                          {loan.arrears && <p className="text-[0.65rem] font-bold text-rose-600">Arrears: {formatUGX(loan.arrears)}</p>}
                        </div>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${
                          loan.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : loan.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : loan.status === 'REPAYING'
                                ? 'bg-sky-100 text-sky-800'
                                : loan.status === 'COMPLETED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {loan.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApproveLoan(loan.reference)}
                            className="rounded-full bg-emerald-600 px-2.5 py-1 text-[0.65rem] font-bold text-white hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectLoan(loan.reference)}
                            className="rounded-full bg-rose-600 px-2.5 py-1 text-[0.65rem] font-bold text-white hover:bg-rose-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : loan.status === 'APPROVED' ? (
                        <button
                          type="button"
                          onClick={() => handleDisburse(loan.reference)}
                          className="rounded-full bg-[#103a27] px-3 py-1 text-[0.65rem] font-bold text-white hover:bg-[#1a5235]"
                        >
                          Disburse
                        </button>
                      ) : (
                        <span className="text-gray-400 flex items-center justify-end gap-1 text-[0.65rem]">
                          <Lock className="size-3" /> Locked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
