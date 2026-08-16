'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  fetchApplications,
  createLoanApplication,
  castCommitteeVote as apiCastVote,
} from '@/lib/api-service'
import {
  INITIAL_APPLICATION,
  type Application,
  type RoleType,
} from '@/lib/talenton-data'
import { ApplicantDashboardView } from '@/components/talenton/applicant-dashboard-view'
import { ApplicantDashboard } from '@/components/talenton/applicant-dashboard'
import { LoanApplicationsList } from '@/components/talenton/loan-applications-list'
import { DocumentsView } from '@/components/talenton/documents-view'
import { ApplicantSidebar, type SidebarSection } from '@/components/talenton/applicant-sidebar'
import { CommitteeDashboardView } from '@/components/talenton/committee-dashboard-view'
import { FloatingNav, type NavItem } from '@/components/talenton/floating-nav'
import { RoleHeader } from '@/components/talenton/role-header'
import { UnderwriterDashboardView } from '@/components/talenton/underwriter-dashboard-view'
import { UnderwriterHomeView } from '@/components/talenton/underwriter-home-view'
import { UnderwriterLoansList } from '@/components/talenton/underwriter-loans-list'
import { UnderwriterSidebar } from '@/components/talenton/underwriter-sidebar'
import { CommitteeSidebar } from '@/components/talenton/committee-sidebar'
import { CommitteeHomeView } from '@/components/talenton/committee-home-view'
import { CommitteeLoansList } from '@/components/talenton/committee-loans-list'
import { CreditPassportPanel } from '@/components/talenton/credit-passport-panel'
import { USER_EMAIL_COOKIE_NAME } from '@/lib/role-access'

export function DashboardRolePage({ role }: { role: RoleType }) {
  const [application, setApplication] = useState<Application>(INITIAL_APPLICATION)
  const [applications, setApplications] = useState<Application[]>([INITIAL_APPLICATION])
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<SidebarSection>('applicant-dashboard')
  const [activeNav, setActiveNav] = useState<NavItem>('home')
  const [activeUnderwriterAudit, setActiveUnderwriterAudit] = useState<boolean>(false)
  const [activeCommitteeReview, setActiveCommitteeReview] = useState<boolean>(false)
  const [userName, setUserName] = useState('Amina K.')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const apps = await fetchApplications()
      if (apps && apps.length > 0) {
        setApplication(apps[0])
        setApplications(apps)
      }
      setLoading(false)
    }
    loadData()

    // Read user name from cookie
    const raw = document.cookie
      .split('; ')
      .find((r) => r.startsWith(USER_EMAIL_COOKIE_NAME + '='))
    if (raw) {
      const email = decodeURIComponent(raw.split('=')[1] || '')
      const name = email.split('@')[0].replace(/[._]/g, ' ')
      if (name) setUserName(name.charAt(0).toUpperCase() + name.slice(1))
    }
  }, [])

  function handleUpdateApplication(updated: Partial<Application>) {
    setApplication((prev) => ({ ...prev, ...updated }))
  }

  async function handleSubmitToUnderwriter() {
    setLoading(true)
    const result = await createLoanApplication({
      applicantName: application.fullName || 'Amara Trading Ltd',
      memberId: application.memberId || 'APP-TEST-001',
      applicantType: application.applicantType || 'cooperative',
      principal: application.principal || 5000000,
      purpose: application.purpose || 'Working Capital',
      tenureMonths: application.tenureMonths || 12,
      savingsBalance: application.savingsBalance || 2000000,
      monthlyIncome: application.monthlyIncome || 1500000,
      monthlyDebt: application.monthlyDebt || 300000,
      multiplier: application.multiplier || 3.0,
    })

    setLoading(false)

    if (result.success && result.data) {
      alert(`Application ${result.data.reference} submitted successfully! Status: ${result.data.status.toUpperCase()}`)
      const updatedApps = await fetchApplications()
      if (updatedApps && updatedApps.length > 0) {
        setApplication(updatedApps[0])
      }
    } else {
      alert(`Unable to submit your application: ${result.error || 'Please try again.'}`)
    }
  }

  async function handleRouteToCommittee() {
    alert('File routed to Committee Board successfully.')
  }

  async function handleCastVote(memberRole: string, vote: 'APPROVE' | 'REJECT' | 'ABSTAIN') {
    const updatedVotes = (application.committeeVotes || []).map((v) =>
      v.role === memberRole ? { ...v, vote } : v
    )
    setApplication((prev) => ({ ...prev, committeeVotes: updatedVotes }))
    await apiCastVote(application.reference, { memberRole, vote })
  }

  function handleNavNavigate(item: NavItem) {
    if (item === 'profile' && role !== 'applicant') {
      const passportSection = document.getElementById('credit-passport-section')
      if (passportSection) {
        passportSection.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    setActiveNav(item)
    setActiveUnderwriterAudit(false)
    setActiveCommitteeReview(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const roleTitles: Record<RoleType, { title: string; subtitle: string }> = {
    applicant: {
      title: 'Applicant Request Pipeline',
      subtitle: 'Track, verify and manage borrower requests from submission to disbursement.',
    },
    underwriter: {
      title: 'Trust Audit',
      subtitle: 'Analyze policy validation metrics, override values, verify guarantor coverage, and route files.',
    },
    committee: {
      title: 'Committee Authorization Board',
      subtitle: 'SACCO board coordinates digital votes, verifies quorum approvals, and signs off assets.',
    },
  }

  const navConfig = useMemo(() => {
    if (role === 'applicant') {
      return {
        active: 'home' as NavItem,
        allowedItems: ['home', 'applications', 'profile'] as NavItem[],
        labels: {
          home: 'Applicant Dashboard',
          applications: 'Loan Applications',
          profile: 'Profile',
        },
      }
    }

    if (role === 'underwriter') {
      return {
        active: activeNav,
        allowedItems: ['home', 'applications', 'creditors', 'profile'] as NavItem[],
        labels: {
          home: 'Dashboard',
          applications: 'Loan Reviews',
          creditors: 'Creditors',
          profile: 'Credit Passport',
        },
      }
    }

    return {
      active: activeNav,
      allowedItems: ['home', 'applications', 'creditors'] as NavItem[],
      labels: {
        home: 'Dashboard',
        applications: 'Loan Reviews',
        creditors: 'Credit Passport',
      },
    }
  }, [role, activeNav])

  /* ── Applicant: sidebar + clean page layout ────────── */
  if (role === 'applicant') {
    if (activeSection === 'pipeline') {
      return (
        <ApplicantDashboardView
          application={application}
          onUpdateApplication={handleUpdateApplication}
          onSubmitToUnderwriter={handleSubmitToUnderwriter}
          onClose={() => setActiveSection('applicant-dashboard')}
        />
      )
    }

    return (
      <div className="flex min-h-screen text-foreground font-sans">
        <ApplicantSidebar
          active={activeSection}
          userName={userName}
          onNavigate={setActiveSection}
        />

        {/* Main content — white background */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f4f5f4]">

          {/* Main content area */}
          <main className="flex-1 px-6 pt-6 pb-10">
            {activeSection === 'applicant-dashboard' ? (
              <ApplicantDashboard
                userName={userName}
                applications={applications}
                onNew={() => setActiveSection('pipeline')}
              />
            ) : activeSection === 'loan-applications' ? (
              <LoanApplicationsList
                applications={applications}
                onNew={() => setActiveSection('pipeline')}
              />
            ) : activeSection === 'documents' ? (
              <DocumentsView
                application={application}
                onUpdateDocuments={(docs) => handleUpdateApplication({ documents: docs })}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-150 p-8 text-center text-sm text-muted-foreground shadow-sm">
                <p className="font-semibold text-[#103a27] text-base mb-1">Section Coming Soon</p>
                This part of the workspace is currently under development.
              </div>
            )}
            {loading && (
              <p className="mt-4 text-sm text-muted-foreground">Loading latest application data...</p>
            )}
          </main>
        </div>
      </div>
    )
  }

  /* ── Underwriter / Committee: Layouts ──── */
  if (role === 'underwriter') {
    return (
      <div className="flex min-h-screen text-foreground font-sans">
        <UnderwriterSidebar
          active={activeNav}
          userName={userName}
          onNavigate={handleNavNavigate}
        />
        <div className="flex-1 flex flex-col min-w-0 bg-[#f4f5f4]">
          <main className="flex-1 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6 pb-10 overflow-y-auto max-h-screen">
            {activeNav === 'home' && !activeUnderwriterAudit && (
              <UnderwriterHomeView 
                applications={applications} 
                onNavigateToApplications={() => setActiveNav('applications')} 
              />
            )}
            {activeNav === 'applications' && !activeUnderwriterAudit && (
              <UnderwriterLoansList 
                applications={applications} 
                onSelectApplication={(app) => {
                  setApplication(app)
                  setActiveUnderwriterAudit(true)
                }} 
              />
            )}
            {activeNav === 'creditors' && !activeUnderwriterAudit && (
              <div className="pt-2">
                <CreditPassportPanel />
              </div>
            )}
            {activeUnderwriterAudit && (
              <UnderwriterDashboardView
                application={application}
                onUpdateApplication={handleUpdateApplication}
                onRouteToCommittee={handleRouteToCommittee}
              />
            )}
            {loading && (
              <p className="mt-4 text-sm text-muted-foreground">Loading latest application data...</p>
            )}
          </main>
        </div>
      </div>
    )
  }

  // Committee Layout
  if (role === 'committee') {
    return (
      <div className="flex min-h-screen text-foreground font-sans">
        <CommitteeSidebar
          active={activeNav}
          userName={userName}
          onNavigate={handleNavNavigate}
        />
        <div className="flex-1 flex flex-col min-w-0 bg-[#f4f5f4]">
          <main className="flex-1 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6 pb-10 overflow-y-auto max-h-screen">
            {activeNav === 'home' && !activeCommitteeReview && (
              <CommitteeHomeView
                applications={applications}
                onNavigateToApplications={() => {
                  setActiveNav('applications')
                  setActiveCommitteeReview(false)
                }}
                onSelectApplication={(app) => {
                  setApplication(app)
                  setActiveNav('applications')
                  setActiveCommitteeReview(true)
                }}
              />
            )}
            {activeNav === 'applications' && !activeCommitteeReview && (
              <CommitteeLoansList
                applications={applications}
                onSelectApplication={(app) => {
                  setApplication(app)
                  setActiveCommitteeReview(true)
                }}
              />
            )}
            {activeNav === 'creditors' && !activeCommitteeReview && (
              <div className="pt-2">
                <CreditPassportPanel />
              </div>
            )}
            {activeCommitteeReview && (
              <CommitteeDashboardView
                application={application}
                onCastVote={handleCastVote}
                onBack={() => setActiveCommitteeReview(false)}
              />
            )}
            {loading && (
              <p className="mt-4 text-sm text-muted-foreground">Loading latest application data...</p>
            )}
          </main>
        </div>
      </div>
    )
  }

  // Fallback for any unknown roles
  return (
    <div className="min-h-screen bg-[#eaf4e5] pb-24 text-foreground font-sans flex items-center justify-center">
      <p className="text-xl font-medium text-[#103a27]">Role view not found.</p>
    </div>
  )
}
