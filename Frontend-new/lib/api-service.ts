import {
  type Application,
  type CreditPassportMember,
  INITIAL_APPLICATION,
  SEED_PASSPORT_MEMBERS,
} from './talenton-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5195/api'

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
