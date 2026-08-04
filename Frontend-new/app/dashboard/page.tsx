'use client'

import { useEffect, useState } from 'react'
import {
  fetchApplications,
  castCommitteeVote as apiCastVote,
  updateUnderwritingOverride as apiUpdateUnderwriting,
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

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<RoleType>('applicant')
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
    setActiveRole('underwriter')
    alert('Application submitted successfully! Switched to Underwriter Trust Audit view.')
  }

  async function handleRouteToCommittee() {
    setActiveRole('committee')
    alert('File routed to Committee Board! Switched to Committee Authorization view.')
  }

  async function handleCastVote(role: string, vote: 'APPROVE' | 'REJECT' | 'ABSTAIN') {
    const updatedVotes = (application.committeeVotes || []).map((v) =>
      v.role === role ? { ...v, vote } : v
    )
    setApplication((prev) => ({ ...prev, committeeVotes: updatedVotes }))
    await apiCastVote(application.reference, { memberRole: role, vote })
  }

  function handleNavNavigate(item: NavItem) {
    if (item === 'home') setActiveRole('applicant')
    else if (item === 'applications') setActiveRole('underwriter')
    else if (item === 'settings') setActiveRole('committee')
  }

  const navActiveItem: NavItem =
    activeRole === 'underwriter' ? 'applications' : activeRole === 'committee' ? 'settings' : 'home'

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

  return (
    <div className="min-h-screen bg-[#eaf4e5] pb-24 text-foreground font-sans">
      {/* Top Header & Role Switcher */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <RoleHeader
          activeRole={activeRole}
          onRoleChange={(r) => setActiveRole(r)}
          currentStage={application.stage}
          fileReference={application.reference}
          title={roleTitles[activeRole].title}
          subtitle={roleTitles[activeRole].subtitle}
        />
      </div>

      {/* Main View Body */}
      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {activeRole === 'applicant' && (
          <ApplicantDashboardView
            application={application}
            onUpdateApplication={handleUpdateApplication}
            onSubmitToUnderwriter={handleSubmitToUnderwriter}
          />
        )}

        {activeRole === 'underwriter' && (
          <UnderwriterDashboardView
            application={application}
            onUpdateApplication={handleUpdateApplication}
            onRouteToCommittee={handleRouteToCommittee}
          />
        )}

        {activeRole === 'committee' && (
          <CommitteeDashboardView
            application={application}
            onCastVote={handleCastVote}
          />
        )}
      </main>

      {/* Floating Bottom Nav */}
      <FloatingNav active={navActiveItem} onNavigate={handleNavNavigate} />
    </div>
  )
}
