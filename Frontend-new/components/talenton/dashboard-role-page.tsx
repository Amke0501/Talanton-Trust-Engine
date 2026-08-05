'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  fetchApplications,
  castCommitteeVote as apiCastVote,
} from '@/lib/api-service'
import {
  INITIAL_APPLICATION,
  type Application,
  type RoleType,
} from '@/lib/talenton-data'
import { ApplicantDashboardView } from '@/components/talenton/applicant-dashboard-view'
import { CommitteeDashboardView } from '@/components/talenton/committee-dashboard-view'
import { FloatingNav, type NavItem } from '@/components/talenton/floating-nav'
import { RoleHeader } from '@/components/talenton/role-header'
import { UnderwriterDashboardView } from '@/components/talenton/underwriter-dashboard-view'

export function DashboardRolePage({ role }: { role: RoleType }) {
  const [application, setApplication] = useState<Application>(INITIAL_APPLICATION)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const apps = await fetchApplications()
      if (apps && apps.length > 0) {
        setApplication(apps[0])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  function handleUpdateApplication(updated: Partial<Application>) {
    setApplication((prev) => ({ ...prev, ...updated }))
  }

  async function handleSubmitToUnderwriter() {
    alert('Application submitted successfully. The file is now queued for underwriter review.')
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

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const roleTitles: Record<RoleType, { title: string; subtitle: string }> = {
    applicant: {
      title: 'Borrower Request Pipeline',
      subtitle: 'Configure financial variables, upload required logs, and coordinate risk authorizations.',
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
        active: 'home' as NavItem,
        allowedItems: ['home', 'applications', 'profile'] as NavItem[],
        labels: {
          home: 'Underwriter Dashboard',
          applications: 'Loan Reviews',
          profile: 'Credit Passport',
        },
      }
    }

    return {
      active: 'home' as NavItem,
      allowedItems: ['home', 'settings', 'profile'] as NavItem[],
      labels: {
        home: 'Committee Dashboard',
        settings: 'Committee Approval',
        profile: 'Credit Passport',
      },
    }
  }, [role])

  return (
    <div className="min-h-screen bg-[#eaf4e5] pb-24 text-foreground font-sans">
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
        <RoleHeader
          activeRole={role}
          currentStage={application.stage}
          fileReference={application.reference}
          title={roleTitles[role].title}
          subtitle={roleTitles[role].subtitle}
          showRoleSwitcher={false}
        />
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
        {role === 'applicant' && (
          <ApplicantDashboardView
            application={application}
            onUpdateApplication={handleUpdateApplication}
            onSubmitToUnderwriter={handleSubmitToUnderwriter}
          />
        )}

        {role === 'underwriter' && (
          <UnderwriterDashboardView
            application={application}
            onUpdateApplication={handleUpdateApplication}
            onRouteToCommittee={handleRouteToCommittee}
          />
        )}

        {role === 'committee' && (
          <CommitteeDashboardView
            application={application}
            onCastVote={handleCastVote}
          />
        )}

        {loading && (
          <p className="mt-4 text-sm text-muted-foreground">Loading latest application data...</p>
        )}
      </main>

      <FloatingNav
        active={navConfig.active}
        onNavigate={handleNavNavigate}
        allowedItems={navConfig.allowedItems}
        labelOverrides={navConfig.labels}
      />
    </div>
  )
}
