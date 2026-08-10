import {
  type Application,
  type ApplicantType,
  type CreditPassportMember,
  INITIAL_APPLICATION,
  type RoleType,
  SEED_PASSPORT_MEMBERS,
} from './talenton-data'

function resolveApiBaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.replace(/\/+$/, '')

  try {
    const parsed = new URL(trimmed)
    const path = parsed.pathname.replace(/\/+$/, '')

    if (path === '' || path === '/') {
      parsed.pathname = '/api'
      return parsed.toString().replace(/\/+$/, '')
    }

    return trimmed
  } catch {
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
  }
}

const API_BASE_URL = resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5195/api')

function getDemoLoginApiCandidates(): string[] {
  const candidates = [API_BASE_URL]

  // Keep demo auth usable in local runs even when NEXT_PUBLIC_API_URL points to a deployed API.
  if (!API_BASE_URL.includes('localhost:5195')) {
    candidates.push('http://localhost:5195/api')
  }

  return candidates
}

export async function fetchApplications(): Promise<Application[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/loanapplications`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          ...INITIAL_APPLICATION,
          id: item.id || INITIAL_APPLICATION.id,
          reference: item.reference || INITIAL_APPLICATION.reference,
          fullName: item.applicantName || INITIAL_APPLICATION.fullName,
          memberId: item.memberId || INITIAL_APPLICATION.memberId,
          principal: item.principal || INITIAL_APPLICATION.principal,
          purpose: item.purpose || INITIAL_APPLICATION.purpose,
          savingsBalance: item.savingsBalance || INITIAL_APPLICATION.savingsBalance,
          monthlyIncome: item.monthlyIncome || INITIAL_APPLICATION.monthlyIncome,
          monthlyDebt: item.monthlyDebt || INITIAL_APPLICATION.monthlyDebt,
          multiplier: item.multiplier || INITIAL_APPLICATION.multiplier,
          tenureMonths: item.tenureMonths || INITIAL_APPLICATION.tenureMonths,
          status: item.status || INITIAL_APPLICATION.status,
          stage: item.stage || INITIAL_APPLICATION.stage,
          dtiNetRatio: item.dtiNetRatio ?? INITIAL_APPLICATION.dtiNetRatio,
          netTakeHome: item.netTakeHome ?? INITIAL_APPLICATION.netTakeHome,
          guardrailDepositMultiplierPassed: item.guardrailDepositMultiplierPassed ?? false,
          guardrailOneThirdPayPassed: item.guardrailOneThirdPayPassed ?? false,
          guardrailGuarantorPassed: item.guardrailGuarantorPassed ?? true,
          verdict: item.verdict || INITIAL_APPLICATION.verdict,
        }))
      }
    }
  } catch (err) {
    console.warn('Backend API connection failed, using local memory state.', err)
  }
  return [INITIAL_APPLICATION]
}

export type CreateLoanApplicationPayload = {
  applicantName: string
  memberId: string
  applicantType: string
  principal: number
  purpose: string
  tenureMonths: number
  savingsBalance: number
  monthlyIncome: number
  monthlyDebt: number
  multiplier: number
}

export async function createLoanApplication(
  payload: CreateLoanApplicationPayload
): Promise<{ success: boolean; data?: Application; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/loanapplications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    let body: any = null
    try {
      body = text ? JSON.parse(text) : null
    } catch {
      body = null
    }

    if (!res.ok) {
      const errorMsg = body?.message || body?.title || `HTTP error ${res.status}: Unable to submit application.`
      console.error('Failed to create loan application:', errorMsg)
      return { success: false, error: errorMsg }
    }

    const createdApp: Application = {
      ...INITIAL_APPLICATION,
      id: body.id || INITIAL_APPLICATION.id,
      reference: body.reference || INITIAL_APPLICATION.reference,
      fullName: body.applicantName || payload.applicantName,
      memberId: body.memberId || payload.memberId,
      applicantType: (body.applicantType as ApplicantType) || (payload.applicantType as ApplicantType) || 'cooperative',
      principal: body.principal || payload.principal,
      purpose: body.purpose || payload.purpose,
      tenureMonths: body.tenureMonths || payload.tenureMonths,
      savingsBalance: body.savingsBalance || payload.savingsBalance,
      monthlyIncome: body.monthlyIncome || payload.monthlyIncome,
      monthlyDebt: body.monthlyDebt || payload.monthlyDebt,
      multiplier: body.multiplier || payload.multiplier,
      status: (body.status?.toLowerCase() as any) || 'submitted',
      stage: (body.stage?.toLowerCase() as any) || 'verification',
      submittedOn: body.submittedOn || 'Just now',
      statusNote: body.statusNote || 'Application submitted. Verification in progress.',
    }

    return { success: true, data: createdApp }
  } catch (err: any) {
    console.error('Network or server error during createLoanApplication:', err)
    return {
      success: false,
      error: 'Unable to submit your application. Please check your connection and try again.',
    }
  }
}

export async function fetchCreditPassportMembers(): Promise<CreditPassportMember[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/creditpassport`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        return data
      }
    }
  } catch (err) {
    console.warn('Backend API connection failed for CreditPassport, using local memory state.', err)
  }
  return SEED_PASSPORT_MEMBERS
}

export async function updateUnderwritingOverride(
  reference: string,
  payload: {
    applicantType: string
    multiplier: number
    tenureMonths: number
    requestedPrincipal: number
    savingsBalance: number
    basicMonthlyPay: number
    monthlyDeductions: number
  }
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/loanapplications/${reference}/underwrite`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch (err) {
    console.warn('Failed to update underwriting via API.', err)
    return false
  }
}

export async function castCommitteeVote(
  reference: string,
  payload: { memberRole: string; vote: 'APPROVE' | 'REJECT' | 'ABSTAIN' }
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/loanapplications/${reference}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch (err) {
    console.warn('Failed to cast vote via API.', err)
    return false
  }
}

export type DemoLoginPayload = {
  email: string
  password: string
  portalRole: RoleType
}

export type DemoLoginResponse = {
  email: string
  fullName: string
  role: RoleType
}

export async function demoLogin(payload: DemoLoginPayload): Promise<{
  success: boolean
  data?: DemoLoginResponse
  message?: string
}> {
  const candidates = getDemoLoginApiCandidates()
  let lastErrorMessage = 'Unable to connect to the server. Please try again.'

  for (const baseUrl of candidates) {
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          portalRole: payload.portalRole,
        }),
      })

      const text = await res.text()
      let body: any = null

      try {
        body = text ? JSON.parse(text) : null
      } catch {
        body = null
      }

      if (!res.ok) {
        if (res.status === 404 && baseUrl !== candidates[candidates.length - 1]) {
          continue
        }

        return {
          success: false,
          message: body?.message || 'Unable to sign in. Please try again.',
        }
      }

      return {
        success: true,
        data: {
          email: body.email,
          fullName: body.fullName,
          role: body.role,
        },
      }
    } catch (err) {
      console.warn(`Login request failed for ${baseUrl}.`, err)
      lastErrorMessage = 'Unable to connect to the server. Please try again.'
    }
  }

  return {
    success: false,
    message: lastErrorMessage,
  }
}
