import { ArrowRight, FileText, Plus, ShieldCheck, Wallet } from 'lucide-react'
import {
  formatUGX,
  STATUS_META,
  type Application,
} from '@/lib/talenton-data'
import { Badge, Card, CardBody, SectionTitle } from '@/components/talenton/primitives'
import { StageTracker } from '@/components/talenton/stage-tracker'

export function ApplicantDashboard({
  userName,
  applications,
  onNew,
}: {
  userName: string
  applications: Application[]
  onNew: () => void
}) {
  const active = applications.filter(
    (a) => a.status === 'in_review' || a.status === 'submitted',
  ).length
  const disbursed = applications.filter((a) => a.status === 'disbursed').length
  const firstName = userName.split(' ')[0] || 'there'

  const stats = [
    { label: 'Active requests', value: String(active), icon: FileText },
    { label: 'Disbursed loans', value: String(disbursed), icon: Wallet },
    {
      label: 'Total requested',
      value: formatUGX(applications.reduce((s, a) => s + a.principal, 0)),
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting + primary CTA */}
      <Card className="overflow-hidden">
        <div className="grid gap-0 sm:grid-cols-[1fr_auto]">
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Welcome back
              </p>
              <h1 className="mt-1 font-serif text-2xl font-semibold text-foreground text-balance">
                {firstName}, ready to grow?
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
                Apply for a loan from your SACCO in a few guided steps. Track
                every request here as it moves through review.
              </p>
            </div>
            <button
              type="button"
              onClick={onNew}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Start a new application
            </button>
          </CardBody>
          <div className="hidden items-stretch sm:flex">
            <div className="flex w-px bg-border" />
            <div className="grid content-center gap-4 bg-muted/40 px-6 py-6">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <s.icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold leading-none text-foreground">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Mobile stats */}
      <div className="grid grid-cols-3 gap-3 sm:hidden">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody className="p-4">
              <s.icon className="size-4 text-primary" />
              <p className="mt-2 text-base font-semibold leading-none text-foreground">
                {s.value}
              </p>
              <p className="mt-1 text-[0.7rem] text-muted-foreground">
                {s.label}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Applications */}
      <div className="space-y-3">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Your applications
        </h2>
        {applications.length === 0 ? (
          <Card>
            <CardBody className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FileText className="size-5" />
              </span>
              <p className="text-sm text-muted-foreground">
                You have no applications yet.
              </p>
              <button
                type="button"
                onClick={onNew}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Start your first application
                <ArrowRight className="size-4" />
              </button>
            </CardBody>
          </Card>
        ) : (
          applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))
        )}
      </div>
    </div>
  )
}

function ApplicationCard({ app }: { app: Application }) {
  const meta = STATUS_META[app.status]
  const declined = app.status === 'declined'

  return (
    <Card>
      <CardBody className="space-y-5">
        <SectionTitle
          title={formatUGX(app.principal)}
          hint={app.purpose}
          aside={<Badge tone={meta.tone}>{meta.label}</Badge>}
        />

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>
            Ref <span className="font-mono text-foreground">{app.reference}</span>
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
