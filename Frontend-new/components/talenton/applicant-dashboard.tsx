import { ArrowRight, FileText, Plus, ShieldCheck, Wallet, CheckCircle2, Clock, FileCheck, ChevronRight, Check } from 'lucide-react'
import {
  formatUGX,
  STATUS_META,
  type Application,
} from '@/lib/talenton-data'
import { Badge, Card, CardBody } from '@/components/talenton/primitives'

export function ApplicantDashboard({
  userName,
  applications,
  onNew,
}: {
  userName: string
  applications: Application[]
  onNew: () => void
}) {
  const firstName = userName.split(' ')[0] || 'there'

  // Calculations for cards
  const approvedOrDisbursed = applications.filter(
    (a) => a.status === 'approved' || a.status === 'disbursed'
  )
  const totalBorrowed = approvedOrDisbursed.reduce((s, a) => s + a.principal, 0)

  const pendingApplications = applications.filter(
    (a) => a.status === 'submitted' || a.status === 'in_review' || a.status === 'draft'
  )

  const approvedApplications = applications.filter(
    (a) => a.status === 'approved' || a.status === 'disbursed'
  )

  // Document summary (from first application or active draft)
  const latestApp = applications[0]
  const documents = latestApp?.documents || []
  const uploadedDocs = documents.filter((d) => d.status === 'VERIFIED')

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-[#0d2a1c] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 flex items-center justify-center pointer-events-none">
          <ShieldCheck className="size-48" />
        </div>
        <div className="relative z-10 max-w-xl space-y-4">
          <p className="text-[0.7rem] font-bold uppercase tracking-widest text-[#a4cc44]">WELCOME BACK</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">Hello {firstName}, ready to grow?</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Apply for credit from your SACCO in a few guided steps. Track your requests and manage compliance uploads below.
          </p>
          <button
            type="button"
            onClick={onNew}
            className="inline-flex items-center gap-2 rounded-full bg-[#a4cc44] text-[#0d2a1c] px-5 py-2.5 text-xs font-bold shadow-lg hover:bg-[#b5dc55] transition-all cursor-pointer"
          >
            <Plus className="size-3.5" />
            Start a new application
          </button>
        </div>
      </div>

      {/* Grid of Key Info Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Card 1: Borrowed Thus Far */}
        <Card className="border border-[#103a27]/10 shadow-sm hover:shadow-md transition-all">
          <CardBody className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#eaf4e5] text-[#103a27]">
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21" />
                  </svg>
                </span>
                <span className="text-xs font-bold text-gray-700">Borrowed Thus Far</span>
              </div>
            </div>
            <div className="relative">
              <p className="text-2xl font-extrabold text-[#103a27] font-sans">UGX {totalBorrowed.toLocaleString()}</p>
              <p className="text-[0.65rem] text-muted-foreground mt-1">Across approved or active disbursed loans</p>
              {/* background chart graphic */}
              <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
                <svg width="60" height="24" viewBox="0 0 60 24" fill="none" stroke="#103a27" strokeWidth="2">
                  <path d="M0 20 L15 15 L30 18 L45 8 L60 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 2: Documents Uploaded */}
        <Card className="border border-[#103a27]/10 shadow-sm hover:shadow-md transition-all">
          <CardBody className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#eaf4e5] text-[#103a27]">
                  <FileText className="size-4" />
                </span>
                <span className="text-xs font-bold text-gray-700">Documents Uploaded</span>
              </div>
              <ChevronRight className="size-4 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#103a27]">{uploadedDocs.length} / {documents.length || 4} Cleared</p>
              <div className="mt-2 space-y-1">
                {documents.map((d) => (
                  <div key={d.id} className="flex items-center gap-1.5 text-[0.65rem] text-[#2a5040]/80">
                    <span className={`size-1.5 rounded-full ${d.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="truncate max-w-[200px] font-medium">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 3: Loans Status Summary */}
        <Card className="border border-[#103a27]/10 shadow-sm hover:shadow-md transition-all">
          <CardBody className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#eaf4e5] text-[#103a27]">
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                  </svg>
                </span>
                <span className="text-xs font-bold text-gray-700">Loans Status Summary</span>
              </div>
              <ChevronRight className="size-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-amber-50/50 rounded-xl p-2.5 border border-amber-100/50 flex items-center justify-center gap-2">
                <Clock className="size-4 text-amber-600" />
                <div className="text-left">
                  <p className="text-base font-extrabold text-amber-900 leading-none">{pendingApplications.length}</p>
                  <p className="text-[0.6rem] font-bold text-amber-700 uppercase tracking-wider mt-0.5">Pending</p>
                </div>
              </div>
              <div className="bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-100/50 flex items-center justify-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <div className="text-left">
                  <p className="text-base font-extrabold text-emerald-900 leading-none">{approvedApplications.length}</p>
                  <p className="text-[0.6rem] font-bold text-emerald-700 uppercase tracking-wider mt-0.5">Approved</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Sections: Pending & Approved Loans */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Pending Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4.5 text-amber-600" />
              <h3 className="font-serif text-lg font-bold text-[#103a27]">Pending Requests</h3>
            </div>
            <button className="text-xs font-bold text-[#103a27] hover:underline">View all</button>
          </div>

          {pendingApplications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-muted-foreground">
              No pending loan applications found.
            </div>
          ) : (
            pendingApplications.map((app) => (
              <div key={app.id} className="rounded-2xl border border-[#103a27]/10 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-mono">{app.reference}</p>
                    <h4 className="text-xl font-bold text-[#103a27] font-sans mt-0.5">UGX {app.principal.toLocaleString()}</h4>
                  </div>
                  <Badge tone="warning">In review</Badge>
                </div>
                <div className="text-xs text-[#2a5040]/70 flex justify-between">
                  <span>Purpose: <strong>{app.purpose}</strong></span>
                  <span>Tenure: <strong>{app.tenureMonths} Months</strong></span>
                </div>

                {/* Styled stage tracker timeline */}
                <div className="pt-2">
                  <div className="relative flex items-center justify-between">
                    {/* line background */}
                    <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-gray-100 z-0" />
                    
                    {[
                      { step: 1, label: '1. Draft', done: true, caption: 'Application saved' },
                      { step: 2, label: '2. Verification', active: true, caption: 'Documents checked' },
                      { step: 3, label: '3. Underwriting Audit', caption: 'Risk officer review' },
                      { step: 4, label: '4. Committee Vote', caption: 'Board authorization' },
                      { step: 5, label: '5. Disbursed', caption: 'Funds released' },
                    ].map((item, idx) => {
                      const isDone = item.done
                      const isActive = item.active
                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                          <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone 
                              ? 'bg-[#103a27] text-white' 
                              : isActive 
                                ? 'bg-white border-2 border-[#103a27] text-[#103a27]' 
                                : 'bg-white border border-gray-200 text-gray-400'
                          }`}>
                            {isDone ? <Check className="size-3.5" strokeWidth={3} /> : item.step}
                          </div>
                          <span className="text-[0.65rem] font-bold text-[#103a27] mt-1.5">{item.label}</span>
                          <span className="text-[0.55rem] text-muted-foreground leading-tight mt-0.5 hidden sm:block max-w-[80px]">{item.caption}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 flex justify-center">
                  <button className="w-full py-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-xs font-bold text-[#103a27] flex items-center justify-center gap-1.5 transition-colors">
                    View request details
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Approved Loans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4.5 text-emerald-600" />
              <h3 className="font-serif text-lg font-bold text-[#103a27]">Approved Loans</h3>
            </div>
            <button className="text-xs font-bold text-[#103a27] hover:underline">View all</button>
          </div>

          {approvedApplications.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[300px]">
              <div className="size-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <FileCheck className="size-8" />
              </div>
              <h4 className="text-sm font-bold text-[#103a27] mb-1">No approved loan applications found yet.</h4>
              <p className="text-xs text-muted-foreground max-w-[240px]">Once approved, your loans will appear here.</p>
            </div>
          ) : (
            approvedApplications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm space-y-4 transition-all hover:bg-emerald-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-700/85 font-mono font-bold">{app.reference}</p>
                    <h4 className="text-xl font-bold text-[#103a27] font-sans mt-0.5">UGX {app.principal.toLocaleString()}</h4>
                  </div>
                  <span className="rounded-full bg-[#103a27] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    APPROVED
                  </span>
                </div>
                <div className="text-xs text-[#2a5040]/80 flex justify-between">
                  <span>Purpose: <strong>{app.purpose}</strong></span>
                  <span>Disbursed: <strong>{app.submittedOn}</strong></span>
                </div>
                <p className="text-xs text-[#103a27] italic font-medium">
                  {app.statusNote || 'Your funds have been disbursed to your cooperative account.'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
