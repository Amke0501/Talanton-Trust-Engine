'use client'

import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Plus,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react'
import {
  formatUGX,
  SEED_APPLICATIONS,
  STATUS_META,
  type Application,
  type ApplicationDraft,
} from '@/lib/talenton-data'
import { ApplicationWizard } from '@/components/talenton/application-wizard'
import { FloatingNav, type NavItem } from '@/components/talenton/floating-nav'
import { Badge, Card, CardBody } from '@/components/talenton/primitives'
import { StageTracker } from '@/components/talenton/stage-tracker'

const CURRENT_USER = {
  name: 'Auma Florence',
  memberId: 'M-4511',
}

type View = 'home' | 'apply' | 'success' | 'applications' | 'settings' | 'profile' | 'application_details'

export default function DashboardPage() {
  const [applications, setApplications] =
    useState<Application[]>(SEED_APPLICATIONS)
  const [view, setView] = useState<View>('home')
  const [lastRef, setLastRef] = useState('')
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  const firstName = CURRENT_USER.name.split(' ')[0] || 'there'
  const initials = CURRENT_USER.name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const active = applications.filter(
    (a) => a.status === 'in_review' || a.status === 'submitted',
  ).length
  const disbursed = applications.filter((a) => a.status === 'disbursed').length

  function handleSubmit(draft: ApplicationDraft) {
    const ref = `LA-2026-${Math.floor(1000 + Math.random() * 8999)}X`
    const submitted: Application = {
      ...draft,
      id: crypto.randomUUID(),
      reference: ref,
      status: 'submitted',
      stage: 'verification',
      submittedOn: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      statusNote:
        'Received. A credit owner will verify your documents shortly.',
    }
    setApplications((prev) => [submitted, ...prev])
    setLastRef(ref)
    setView('success')
  }

  function handleNavigation(item: NavItem) {
    if (item === 'home') setView('home')
    else if (item === 'applications') setView('applications')
    else if (item === 'settings') setView('settings')
    else if (item === 'profile') setView('profile')
  }

  const navActive: NavItem =
    view === 'applications'
      ? 'applications'
      : view === 'settings'
        ? 'settings'
        : view === 'profile'
          ? 'profile'
          : 'home'

  const stats = [
    { label: 'Active requests', value: String(active), icon: FileText },
    { label: 'Disbursed loans', value: String(disbursed), icon: Wallet },
    {
      label: 'Total requested',
      value: formatUGX(
        applications.reduce((s, a) => s + a.principal, 0),
      ),
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="min-h-screen pt-20">
      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* ── HOME VIEW ── */}
        {view === 'home' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Combined Dark Hero */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#103a27] text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a5235]/80 via-transparent to-[#a4cc44]/10 pointer-events-none" />



              {/* Greeting + CTA */}
              <div className="relative px-8 pt-10 sm:px-12">
                <div className="flex items-center gap-2 text-sm font-medium text-white/60 mb-3">
                  <span>Good afternoon</span>
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  Welcome, {firstName}
                </h1>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60">
                  Apply for a loan from your SACCO in a few guided steps. Track
                  every request here as it moves through review.
                </p>
                <button
                  type="button"
                  onClick={() => setView('apply')}
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#a4cc44] px-6 py-3.5 text-sm font-bold text-[#103a27] shadow-lg transition-all hover:bg-[#b5d85a] hover:shadow-xl hover:translate-y-[-1px]"
                >
                  <Plus className="size-4" strokeWidth={2.5} />
                  Start a new application
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#103a27]/20 group-hover:bg-[#103a27]/30 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-[#103a27]" strokeWidth={2.5} />
                  </span>
                </button>
              </div>

              {/* Stats row inside hero */}
              <div className="relative grid grid-cols-1 gap-px sm:grid-cols-3 mt-10 bg-white/5 border-t border-white/10">
                {stats.map((s) => (
                  <div key={s.label} className="flex items-center gap-4 px-8 py-6 sm:px-12">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-[#a4cc44]">
                      <s.icon className="size-5" strokeWidth={2.5} />
                    </span>
                    <div>
                      <p className="text-xl font-bold leading-none text-white">
                        {s.value}
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications Banner Section */}
            {applications.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured Latest Application */}
                <div className="lg:col-span-2 space-y-3">
                  <h2 className="font-serif text-xl font-semibold text-foreground px-2">
                    Current Application
                  </h2>
                  <div 
                    onClick={() => {
                      setSelectedAppId(applications[0].id)
                      setView('application_details')
                    }}
                    className="group relative overflow-hidden rounded-[2rem] border border-glass-border bg-card shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#dbead5]/30 to-transparent pointer-events-none" />
                    <div className="relative p-8 sm:p-10 flex flex-col h-full justify-between gap-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#103a27]/60 mb-2">{applications[0].purpose}</p>
                          <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#103a27]">
                            {formatUGX(applications[0].principal)}
                          </h3>
                        </div>
                        <Badge tone={STATUS_META[applications[0].status].tone} className="px-4 py-1.5 text-sm">
                          {STATUS_META[applications[0].status].label}
                        </Badge>
                      </div>

                      <div>
                        <StageTracker stage={applications[0].stage} declined={applications[0].status === 'declined'} />
                        <p className="mt-4 text-sm font-medium text-[#103a27]/80">
                          {applications[0].statusNote}
                        </p>
                      </div>

                      <div className="flex items-center justify-end text-sm font-medium text-[#103a27]/60">
                        <span className="flex items-center gap-2 group-hover:text-[#103a27] transition-colors font-bold text-[#103a27]">
                          View details 
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#103a27]/10 group-hover:bg-[#a4cc44] transition-colors">
                            <ArrowRight className="size-3.5 text-[#103a27]" strokeWidth={2.5} />
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Older Applications */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="font-serif text-xl font-semibold text-foreground">
                      Previous
                    </h2>
                    {applications.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setView('applications')}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        View all
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {applications.slice(1, 4).map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setSelectedAppId(app.id)
                          setView('application_details')
                        }}
                        className="group flex flex-col justify-between rounded-2xl border border-glass-border bg-card/60 p-5 transition-all hover:bg-card hover:shadow-md cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-serif font-semibold text-[#103a27]">
                            {formatUGX(app.principal)}
                          </span>
                          <Badge tone={STATUS_META[app.status].tone} className="text-[10px] px-2 py-0.5">
                            {STATUS_META[app.status].label}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#103a27]/60 mb-3">{app.purpose}</p>
                        <div className="flex items-center justify-between text-[11px] font-medium text-[#103a27]/50">
                          <span>{app.submittedOn}</span>
                          <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#a4cc44]" />
                        </div>
                      </div>
                    ))}
                    {applications.length === 1 && (
                      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-glass-border bg-card/30 p-8 text-center h-[calc(100%-2rem)]">
                        <FileText className="size-6 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">No previous applications</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {applications.length === 0 && (
              <div className="mt-8">
                <Card>
                  <CardBody className="flex flex-col items-center gap-3 py-16 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-[#dbead5] text-[#103a27]">
                      <FileText className="size-6" />
                    </span>
                    <h2 className="font-serif text-xl font-semibold text-foreground">
                      No applications yet
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      When you apply for a loan, you will be able to track its progress here.
                    </p>
                    <button
                      type="button"
                      onClick={() => setView('apply')}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#103a27] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1a5235]"
                    >
                      <Plus className="size-4" strokeWidth={2.5} />
                      Start your first application
                    </button>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* My Documents Section */}
            <div className="mt-12 space-y-4">
              <h2 className="font-serif text-xl font-semibold text-foreground px-2">
                My Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'National ID Front', size: '2.4 MB', date: 'Mar 15, 2026' },
                  { name: 'Proof of Address', size: '1.1 MB', date: 'Mar 15, 2026' },
                  { name: 'Bank Statement (3 months)', size: '4.8 MB', date: 'Apr 02, 2026' },
                ].map((doc, idx) => (
                  <div key={idx} className="group flex items-center justify-between rounded-2xl border border-glass-border bg-card/60 p-4 transition-all hover:bg-card hover:shadow-md cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[#dbead5] text-[#103a27]">
                        <FileText className="size-4" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">PDF • {doc.size} • {doc.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-glass-border bg-card/30 p-4 text-center cursor-pointer hover:bg-card/60 transition-colors h-full min-h-[5rem]">
                  <p className="text-sm font-medium text-primary flex items-center gap-1.5">
                    <Plus className="size-4" /> Upload new
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY APPLICATIONS VIEW ── */}
        {view === 'applications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-semibold text-foreground">
                  My Applications
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  All your loan applications in one place.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView('apply')}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <Plus className="size-4" />
                New application
              </button>
            </div>
            {applications.length === 0 ? (
              <Card>
                <CardBody className="flex flex-col items-center gap-3 py-12 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <FileText className="size-5" />
                  </span>
                  <p className="text-sm text-muted-foreground">
                    No applications yet.
                  </p>
                </CardBody>
              </Card>
            ) : (
              applications.map((app) => (
                <ApplicationCard 
                  key={app.id} 
                  app={app} 
                  onClick={() => {
                    setSelectedAppId(app.id)
                    setView('application_details')
                  }}
                />
              ))
            )}
          </div>
        )}

        {/* ── SETTINGS VIEW ── */}
        {view === 'settings' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              Settings
            </h1>
            <Card>
              <CardBody className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-foreground">
                    {initials}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {CURRENT_USER.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Member {CURRENT_USER.memberId}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                  <p>
                    Account settings and preferences will be available once
                    authentication is connected. For now this is a placeholder.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* ── PROFILE VIEW ── */}
        {view === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              Profile
            </h1>
            <Card>
              <CardBody className="space-y-6">
                <div className="flex items-center gap-5">
                  <span className="flex size-16 items-center justify-center rounded-2xl bg-[#103a27] text-xl font-bold text-white">
                    {initials}
                  </span>
                  <div>
                    <p className="text-xl font-bold text-foreground">
                      {CURRENT_USER.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Member {CURRENT_USER.memberId}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                    <p className="mt-1 text-foreground">auma.florence@example.com</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</p>
                    <p className="mt-1 text-foreground">+256 772 145 220</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Member since</p>
                    <p className="mt-1 text-foreground">March 2024</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SACCO</p>
                    <p className="mt-1 text-foreground">Kampala District SACCO</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* ── APPLY VIEW ── */}
        {view === 'apply' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-foreground">
                New loan application
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete each step. Your progress is saved as you go.
              </p>
            </div>
            <ApplicationWizard
              onSubmit={handleSubmit}
              onCancel={() => setView('home')}
            />
          </div>
        )}

        {/* ── SUCCESS VIEW ── */}
        {view === 'success' && (
          <div className="mx-auto max-w-lg pt-8 animate-in fade-in zoom-in-95 duration-500">
            <Card>
              <CardBody className="flex flex-col items-center gap-4 py-12 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                  <CheckCircle2 className="size-7" />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Application submitted
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                    Your request{' '}
                    <span className="font-mono text-foreground">{lastRef}</span>{' '}
                    is now with the SACCO for verification. You can track its
                    progress from your dashboard.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView('home')}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  Back to dashboard
                </button>
              </CardBody>
            </Card>
          </div>
        )}

        {/* ── APPLICATION DETAILS VIEW ── */}
        {view === 'application_details' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(() => {
              const app = applications.find((a) => a.id === selectedAppId)
              if (!app) return null
              const meta = STATUS_META[app.status]
              const editable = app.status === 'draft' || app.status === 'in_review' || app.status === 'submitted'

              return (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setView('home')}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowRight className="size-4 rotate-180" strokeWidth={2.5} />
                      Back to dashboard
                    </button>
                    <Badge tone={meta.tone} className="px-3 py-1 text-sm">{meta.label}</Badge>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Ref {app.reference}
                    </p>
                    <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
                      {formatUGX(app.principal)}
                    </h1>
                  </div>

                  <div className="rounded-[2rem] border border-glass-border bg-card p-6 sm:p-10 shadow-lg">
                    <StageTracker stage={app.stage} declined={app.status === 'declined'} />
                    <p className="mt-6 text-sm font-medium text-muted-foreground bg-muted/50 p-4 rounded-xl">
                      {app.statusNote}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardBody className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-xl font-semibold">Details</h3>
                          {editable && <button className="p-2 hover:bg-muted rounded-full transition-colors"><FileText className="size-4" /></button>}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Purpose</p>
                            <div className="flex items-center justify-between group">
                              <p className="mt-1 text-foreground font-medium">{app.purpose}</p>
                              {editable && <span className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-primary">Edit</span>}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tenure</p>
                            <div className="flex items-center justify-between group">
                              <p className="mt-1 text-foreground font-medium">{app.tenureMonths} Months</p>
                              {editable && <span className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-primary">Edit</span>}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Submitted On</p>
                            <p className="mt-1 text-foreground font-medium">{app.submittedOn}</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-xl font-semibold">Documents</h3>
                          {editable && <button className="p-2 hover:bg-muted rounded-full transition-colors"><Plus className="size-4" /></button>}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-xl border border-border p-3 bg-white/50 hover:bg-white transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#dbead5] text-[#103a27] rounded-lg">
                                <FileText className="size-4" strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">National ID Front</p>
                                <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                              </div>
                            </div>
                            {editable && <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Update</span>}
                          </div>
                          <div className="flex items-center justify-between rounded-xl border border-border p-3 bg-white/50 hover:bg-white transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#dbead5] text-[#103a27] rounded-lg">
                                <FileText className="size-4" strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">Proof of Address</p>
                                <p className="text-xs text-muted-foreground">PDF • 1.1 MB</p>
                              </div>
                            </div>
                            {editable && <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">Update</span>}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </main>

      <footer className="pb-32">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          Talenton — risk &amp; compliance infrastructure for SACCOs. Growth
          through safety.
        </p>
      </footer>

      <FloatingNav active={navActive} onNavigate={handleNavigation} />
    </div>
  )
}

function ApplicationCard({ app, onClick }: { app: Application, onClick?: () => void }) {
  const meta = STATUS_META[app.status]
  const declined = app.status === 'declined'

  return (
    <Card 
      onClick={onClick}
      className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <CardBody className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-semibold leading-tight text-foreground">
              {formatUGX(app.principal)}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{app.purpose}</p>
          </div>
          <Badge tone={meta.tone}>{meta.label}</Badge>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>
            Ref{' '}
            <span className="font-mono text-foreground">{app.reference}</span>
          </span>
          <span>Submitted {app.submittedOn}</span>
          <span>{app.tenureMonths}-month term</span>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4">
          <StageTracker stage={app.stage} declined={declined} />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {app.statusNote}
        </p>
      </CardBody>
    </Card>
  )
}
