// Talenton — shared types and mock data for the applicant experience.
// Backend (Neon + auth) will replace this layer later; for now everything
// lives in memory so the page-by-page flow can be validated end to end.

export type ApplicantType = 'individual' | 'cooperative'

export type StageKey =
  | 'draft'
  | 'verification'
  | 'underwriting'
  | 'committee'
  | 'disbursed'

export const STAGES: { key: StageKey; label: string; caption: string }[] = [
  { key: 'draft', label: 'Draft', caption: 'You are preparing this request' },
  {
    key: 'verification',
    label: 'Verification',
    caption: 'Documents are being checked',
  },
  {
    key: 'underwriting',
    label: 'Underwriting',
    caption: 'A credit owner is reviewing',
  },
  {
    key: 'committee',
    label: 'Committee vote',
    caption: 'Board members are voting',
  },
  { key: 'disbursed', label: 'Disbursed', caption: 'Funds released to you' },
]

// Statuses the applicant is allowed to see. Underwriting internals
// (guardrail checks, override inputs, quorum math) are intentionally excluded.
export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'declined'
  | 'disbursed'

export interface DocumentSlot {
  id: string
  label: string
  hint: string
  required: boolean
  fileName?: string
}

export interface Guarantor {
  id: string
  name: string
  memberId: string
  pledgedShares: number
}

export interface ApplicationDraft {
  // profile
  applicantType: ApplicantType
  fullName: string
  memberId: string
  phone: string
  email: string
  savingsBalance: number
  // loan
  principal: number
  purpose: string
  tenureMonths: number
  monthlyIncome: number
  monthlyDebt: number
  multiplier: number
  // supporting
  documents: DocumentSlot[]
  guarantors: Guarantor[]
}

export interface Application extends ApplicationDraft {
  id: string
  reference: string
  status: ApplicationStatus
  stage: StageKey
  submittedOn: string
  // Applicant-safe messaging only — no underwriting detail.
  statusNote: string
}

export const CLASSIFICATION_LABEL: Record<ApplicantType, string> = {
  individual: 'Individual member (savings anchor)',
  cooperative: 'Cooperative / SME',
}

export function makeDocumentSlots(type: ApplicantType): DocumentSlot[] {
  const shared: DocumentSlot[] = [
    {
      id: 'id',
      label: 'National ID / NIN',
      hint: 'Government-issued identification for KYC.',
      required: true,
    },
    {
      id: 'guarantor',
      label: 'Signed guarantor consent',
      hint: 'Confirms your guarantors have agreed to back the loan.',
      required: true,
    },
    {
      id: 'tax',
      label: 'Tax clearance (URA / KRA)',
      hint: 'Recent statutory filing. Optional but speeds up review.',
      required: false,
    },
  ]

  if (type === 'individual') {
    return [
      shared[0],
      {
        id: 'payslip',
        label: 'Certified payslip',
        hint: 'Last 3 months of pay to confirm your income.',
        required: true,
      },
      shared[1],
      shared[2],
    ]
  }

  return [
    shared[0],
    {
      id: 'registration',
      label: 'Business registration',
      hint: 'Certificate of incorporation or cooperative registration.',
      required: true,
    },
    {
      id: 'ledger',
      label: 'Business ledger / bank statements',
      hint: 'Last 6 months of cash-flow records.',
      required: true,
    },
    shared[1],
    shared[2],
  ]
}

export function emptyDraft(): ApplicationDraft {
  return {
    applicantType: 'individual',
    fullName: '',
    memberId: '',
    phone: '',
    email: '',
    savingsBalance: 0,
    principal: 0,
    purpose: '',
    tenureMonths: 12,
    monthlyIncome: 0,
    monthlyDebt: 0,
    multiplier: 3,
    documents: makeDocumentSlots('individual'),
    guarantors: [],
  }
}

// A couple of previously-submitted applications so the dashboard isn't empty.
export const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-0899d',
    reference: 'LA-2026-0899D',
    applicantType: 'individual',
    fullName: 'Auma Florence',
    memberId: 'M-4511',
    phone: '+256 772 145 220',
    email: 'auma.florence@example.com',
    savingsBalance: 3_100_000,
    principal: 6_500_000,
    purpose: 'Expand tailoring workshop with two new machines.',
    tenureMonths: 8,
    monthlyIncome: 1_900_000,
    monthlyDebt: 210_000,
    multiplier: 3,
    documents: makeDocumentSlots('individual'),
    guarantors: [],
    status: 'in_review',
    stage: 'underwriting',
    submittedOn: 'Jul 28, 2026',
    statusNote: 'A credit owner is reviewing your documents.',
  },
  {
    id: 'app-0912c',
    reference: 'LA-2025-0912C',
    applicantType: 'individual',
    fullName: 'Auma Florence',
    memberId: 'M-4511',
    phone: '+256 772 145 220',
    email: 'auma.florence@example.com',
    savingsBalance: 3_100_000,
    principal: 4_000_000,
    purpose: 'Bulk fabric purchase ahead of festive season.',
    tenureMonths: 6,
    monthlyIncome: 1_900_000,
    monthlyDebt: 180_000,
    multiplier: 3,
    documents: makeDocumentSlots('individual'),
    guarantors: [],
    status: 'disbursed',
    stage: 'disbursed',
    submittedOn: 'May 12, 2026',
    statusNote: 'Approved and disbursed. Repayment is on schedule.',
  },
]

export function formatUGX(value: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export function stageIndex(stage: StageKey): number {
  return STAGES.findIndex((s) => s.key === stage)
}

// The applicant's borrowing ceiling from their savings anchor.
export function savingsCap(savings: number, multiplier: number): number {
  return Math.round(savings * multiplier)
}

// Applicant-friendly status metadata (label + tone token).
export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; tone: 'muted' | 'warning' | 'primary' | 'destructive' | 'success' }
> = {
  draft: { label: 'Draft', tone: 'muted' },
  submitted: { label: 'Submitted', tone: 'warning' },
  in_review: { label: 'In review', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  declined: { label: 'Declined', tone: 'destructive' },
  disbursed: { label: 'Disbursed', tone: 'success' },
}
