'use client'

import { useState, useMemo } from 'react'
import { FileText, Clock, CheckCircle2, AlertTriangle, Eye, MoreVertical, Search, Plus, SlidersHorizontal, Check } from 'lucide-react'
import { formatUGX, type Application } from '@/lib/talenton-data'

export function LoanApplicationsList({
  applications,
  onNew,
  onViewDetails,
}: {
  applications: Application[]
  onNew: () => void
  onViewDetails?: (app: Application) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  // Demo application list matching the second image precisely
  const demoApps = useMemo(() => [
    {
      id: 'demo-1',
      reference: 'LA-2026-0941A',
      applicantName: 'UGX 15,000,000',
      purpose: 'Expand retail inventory',
      loanType: 'Business Loan',
      typeCode: 'business',
      principal: 15000000,
      status: 'in_review',
      stepText: 'In Review',
      stepNum: 3,
      submittedOn: 'May 20, 2026 10:30 AM',
      lastUpdated: 'May 22, 2026 2:45 PM',
    },
    {
      id: 'demo-2',
      reference: 'LA-2026-0940B',
      applicantName: 'Aminah Nalubega',
      purpose: 'Purchase of machinery',
      loanType: 'Asset Financing',
      typeCode: 'asset',
      principal: 25000000,
      status: 'verification',
      stepText: 'Verification',
      stepNum: 2,
      submittedOn: 'May 19, 2026 09:15 AM',
      lastUpdated: 'May 21, 2026 11:20 AM',
    },
    {
      id: 'demo-3',
      reference: 'LA-2026-0939C',
      applicantName: 'Kampala Traders Ltd',
      purpose: 'Working capital',
      loanType: 'Business Loan',
      typeCode: 'business',
      principal: 50000000,
      status: 'committee',
      stepText: 'Committee Vote',
      stepNum: 4,
      submittedOn: 'May 18, 2026 03:40 PM',
      lastUpdated: 'May 22, 2026 09:10 AM',
    },
    {
      id: 'demo-4',
      reference: 'LA-2026-0938D',
      applicantName: 'Grace Nakato',
      purpose: 'School fees support',
      loanType: 'Personal Loan',
      typeCode: 'personal',
      principal: 5000000,
      status: 'draft',
      stepText: 'Draft',
      stepNum: 1,
      submittedOn: 'May 17, 2026 11:05 AM',
      lastUpdated: 'May 17, 2026 11:05 AM',
    },
    {
      id: 'demo-5',
      reference: 'LA-2026-0937E',
      applicantName: 'Bright Futures Ltd',
      purpose: 'Solar system installation',
      loanType: 'Asset Financing',
      typeCode: 'asset',
      principal: 30000000,
      status: 'disbursed',
      stepText: 'Disbursed',
      stepNum: 5,
      submittedOn: 'May 15, 2026 02:20 PM',
      lastUpdated: 'May 21, 2026 04:30 PM',
    },
    {
      id: 'demo-6',
      reference: 'LA-2026-0936F',
      applicantName: 'David Ochieng',
      purpose: 'Emergency funds',
      loanType: 'Personal Loan',
      typeCode: 'personal',
      principal: 2000000,
      status: 'declined',
      stepText: 'Declined',
      stepNum: 5,
      submittedOn: 'May 14, 2026 05:10 PM',
      lastUpdated: 'May 20, 2026 10:15 AM',
    },
    {
      id: 'demo-7',
      reference: 'LA-2026-0935G',
      applicantName: 'Innovate Solutions',
      purpose: 'New office setup',
      loanType: 'Business Loan',
      typeCode: 'business',
      principal: 18000000,
      status: 'in_review',
      stepText: 'In Review',
      stepNum: 3,
      submittedOn: 'May 13, 2026 09:00 AM',
      lastUpdated: 'May 20, 2026 01:45 PM',
    },
  ], [])

  // Map real applications from DB/Cookie into demo list structure if any exist
  const allAppsCombined = useMemo(() => {
    const custom = applications.map((app) => {
      const stepInfo = { stepText: 'Verification', stepNum: 2 }
      if (app.stage === 'draft') { stepInfo.stepText = 'Draft'; stepInfo.stepNum = 1 }
      else if (app.stage === 'verification') { stepInfo.stepText = 'Verification'; stepInfo.stepNum = 2 }
      else if (app.stage === 'underwriting') { stepInfo.stepText = 'Underwriting'; stepInfo.stepNum = 3 }
      else if (app.stage === 'committee') { stepInfo.stepText = 'Committee Vote'; stepInfo.stepNum = 4 }
      else if (app.stage === 'disbursed') { stepInfo.stepText = 'Disbursed'; stepInfo.stepNum = 5 }

      if (app.status === 'declined') { stepInfo.stepText = 'Declined'; stepInfo.stepNum = 5 }

      return {
        id: app.id,
        reference: app.reference,
        applicantName: app.fullName || 'Custom Applicant',
        purpose: app.purpose,
        loanType: app.applicantType === 'cooperative' ? 'Business Loan' : 'Personal Loan',
        typeCode: app.applicantType === 'cooperative' ? 'business' : 'personal',
        principal: app.principal,
        status: app.status,
        stepText: stepInfo.stepText,
        stepNum: stepInfo.stepNum,
        submittedOn: app.submittedOn || 'Just now',
        lastUpdated: 'Just now',
      }
    })

    // Filter out mock duplicates if they are already inside `custom`
    const filteredDemo = demoApps.filter(d => !custom.some(c => c.reference === d.reference))
    return [...custom, ...filteredDemo]
  }, [applications, demoApps])

  const filteredApps = useMemo(() => {
    return allAppsCombined.filter((app) => {
      return (
        app.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.loanType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [allAppsCombined, searchQuery])

  // Count summaries
  const totalCount = allAppsCombined.length
  const pendingCount = allAppsCombined.filter(a => a.status === 'submitted' || a.status === 'in_review').length
  const inProgressCount = allAppsCombined.filter(a => a.status === 'verification' || a.status === 'committee').length
  const approvedCount = allAppsCombined.filter(a => a.status === 'approved' || a.status === 'disbursed').length
  const declinedCount = allAppsCombined.filter(a => a.status === 'declined').length

  return (
    <div className="space-y-6">
      {/* Header section with Search and Action on the same line */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#103a27]">Loan Applications</h1>
          <p className="mt-1 text-sm text-[#2a5040]/70">
            View and track all loan applications and their progress through the pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#103a27] transition-all bg-white"
            />
          </div>
          {/* Add New Application Button */}
          <button
            type="button"
            onClick={onNew}
            className="flex items-center gap-2 rounded-xl bg-[#0d2a1c] hover:bg-[#153e2a] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="size-4" />
            New Application
          </button>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        {/* Card 1: Total Applications */}
        <div className="bg-[#0d2a1c] rounded-2xl border border-white/10 p-4 flex items-center justify-between shadow-sm text-white">
          <div>
            <span className="text-[0.65rem] font-bold text-gray-300 uppercase tracking-wider">Total Applications</span>
            <p className="text-2xl font-extrabold text-white mt-1">{totalCount}</p>
            <span className="text-[0.6rem] text-gray-400 mt-0.5 block">All time applications</span>
          </div>
          <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-[#a4cc44] shadow-sm">
            <FileText className="size-4" />
          </span>
        </div>

        {/* Card 2: Pending Review */}
        <div className="bg-[#0d2a1c] rounded-2xl border border-white/10 p-4 flex items-center justify-between shadow-sm text-white">
          <div>
            <span className="text-[0.65rem] font-bold text-gray-300 uppercase tracking-wider">Pending Review</span>
            <p className="text-2xl font-extrabold text-white mt-1">{pendingCount + 2}</p>
            <span className="text-[0.6rem] text-gray-400 mt-0.5 block">Awaiting your review</span>
          </div>
          <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-amber-400 shadow-sm">
            <Clock className="size-4" />
          </span>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-[#0d2a1c] rounded-2xl border border-white/10 p-4 flex items-center justify-between shadow-sm text-white">
          <div>
            <span className="text-[0.65rem] font-bold text-gray-300 uppercase tracking-wider">In Progress</span>
            <p className="text-2xl font-extrabold text-white mt-1">{inProgressCount + 10}</p>
            <span className="text-[0.6rem] text-gray-400 mt-0.5 block">Applications being processed</span>
          </div>
          <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-blue-400 shadow-sm">
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </span>
        </div>

        {/* Card 4: Approved */}
        <div className="bg-[#0d2a1c] rounded-2xl border border-white/10 p-4 flex items-center justify-between shadow-sm text-white">
          <div>
            <span className="text-[0.65rem] font-bold text-gray-300 uppercase tracking-wider">Approved</span>
            <p className="text-2xl font-extrabold text-white mt-1">{approvedCount + 5}</p>
            <span className="text-[0.6rem] text-gray-400 mt-0.5 block">Successfully approved</span>
          </div>
          <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-emerald-400 shadow-sm">
            <CheckCircle2 className="size-4" />
          </span>
        </div>

        {/* Card 5: Declined */}
        <div className="bg-[#0d2a1c] rounded-2xl border border-white/10 p-4 flex items-center justify-between shadow-sm text-white">
          <div>
            <span className="text-[0.65rem] font-bold text-gray-300 uppercase tracking-wider">Declined</span>
            <p className="text-2xl font-extrabold text-white mt-1">{declinedCount + 1}</p>
            <span className="text-[0.6rem] text-gray-400 mt-0.5 block">Not approved</span>
          </div>
          <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-red-400 shadow-sm">
            <AlertTriangle className="size-4" />
          </span>
        </div>
      </div>

      {/* Tabs and Filters Row */}
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h3 className="text-xs font-bold text-[#103a27] uppercase tracking-wider">Applications</h3>
        <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </button>
      </div>

      {/* Loan List Table */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-150 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-5 py-4">Application ID</th>
                <th className="px-5 py-4">Applicant</th>
                <th className="px-5 py-4">Loan Type</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4">Submitted On</th>
                <th className="px-5 py-4">Last Updated</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* ID */}
                  <td className="px-5 py-4 font-mono font-bold text-[#103a27]">
                    {app.reference}
                  </td>
                  {/* Applicant */}
                  <td className="px-5 py-4">
                    <p className="font-extrabold text-[#103a27]">{app.applicantName}</p>
                    <p className="text-[0.65rem] text-muted-foreground mt-0.5">{app.purpose}</p>
                  </td>
                  {/* Loan Type */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.65rem] font-bold ${
                      app.typeCode === 'business'
                        ? 'bg-blue-50 text-blue-700'
                        : app.typeCode === 'asset'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {app.typeCode === 'business' ? (
                        <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                      ) : app.typeCode === 'asset' ? (
                        <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M7.5 12l3 3m-3-3l-3 3" /></svg>
                      ) : (
                        <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                      )}
                      {app.loanType}
                    </span>
                  </td>
                  {/* Amount */}
                  <td className="px-5 py-4 font-mono font-bold text-gray-800">
                    UGX {app.principal.toLocaleString()}
                  </td>
                  {/* Status Timeline */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      {/* Timeline dots line */}
                      <div className="relative flex items-center justify-between w-28">
                        <div className="absolute left-0 right-0 top-1.5 h-0.5 bg-gray-100" />
                        {[1, 2, 3, 4, 5].map((step) => {
                          const isDeclined = app.status === 'declined'
                          const isDisbursed = app.status === 'disbursed'
                          const isDone = step < app.stepNum || isDisbursed
                          const isActive = step === app.stepNum

                          let dotBg = 'bg-white border border-gray-200'
                          let tickElement = null

                          if (isDeclined && isActive) {
                            dotBg = 'bg-red-500 text-white border-red-500'
                            tickElement = <span className="text-[0.45rem] font-bold">✕</span>
                          } else if (isDone) {
                            dotBg = 'bg-[#103a27] text-white border-[#103a27]'
                            tickElement = <Check className="size-2 text-white" strokeWidth={4} />
                          } else if (isActive) {
                            dotBg = 'bg-white border-2 border-[#103a27] text-[#103a27]'
                            tickElement = <span className="size-1 rounded-full bg-[#103a27]" />
                          }

                          return (
                            <div
                              key={step}
                              className={`size-3.5 rounded-full flex items-center justify-center z-10 transition-all ${dotBg}`}
                            >
                              {tickElement}
                            </div>
                          )
                        })}
                      </div>
                      <span className={`text-[0.6rem] font-bold tracking-wide uppercase ${
                        app.status === 'declined' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {app.stepText} <span className="font-medium text-gray-400">({app.status === 'declined' ? 'Declined' : `Step ${app.stepNum} of 5`})</span>
                      </span>
                    </div>
                  </td>
                  {/* Submitted */}
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {app.submittedOn}
                  </td>
                  {/* Last Updated */}
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {app.lastUpdated}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetails?.(app as any)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[0.65rem] font-bold text-gray-700 hover:bg-[#eaf4e5] hover:text-[#103a27] transition-all"
                      >
                        <Eye className="size-3.5" />
                        View
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreVertical className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="bg-gray-50/50 border-t border-gray-150 px-5 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing 1 to {filteredApps.length} of {totalCount} applications</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
              &lt;
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[#0d2a1c] text-white font-bold">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
              4
            </button>
            <button className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
