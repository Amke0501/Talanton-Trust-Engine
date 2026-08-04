'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  Send,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react'
import {
  formatUGX,
  type Application,
  type Guarantor,
} from '@/lib/talenton-data'
import { Card, CardBody } from '@/components/talenton/primitives'

export function UnderwriterDashboardView({
  application,
  onUpdateApplication,
  onRouteToCommittee,
}: {
  application: Application
  onUpdateApplication: (updated: Partial<Application>) => void
  onRouteToCommittee: () => void
}) {
  const [classification, setClassification] = useState(application.applicantType || 'individual')
  const [multiplier, setMultiplier] = useState(application.multiplier || 3)
  const [tenure, setTenure] = useState(application.tenureMonths || 12)
  const [requestedCapital, setRequestedCapital] = useState(application.principal || 15_000_000)
  const [savingsBalance, setSavingsBalance] = useState(application.savingsBalance || 4_000_000)
  const [basicPay, setBasicPay] = useState(application.monthlyIncome || 2_500_000)
  const [monthlyDeductions, setMonthlyDeductions] = useState(application.monthlyDebt || 500_000)
  const [guarantors, setGuarantors] = useState<Guarantor[]>(application.guarantors || [
    { id: 'g1', name: 'Kato Joseph', memberId: 'M-1104', pledgedShares: 8_000_000, availableShares: 8_000_000 },
    { id: 'g2', name: 'Namatovu Sarah', memberId: 'M-2309', pledgedShares: 5_000_000, availableShares: 9_500_000 },
  ])

  const [showAddGuarantorModal, setShowAddGuarantorModal] = useState(false)
  const [newGName, setNewGName] = useState('')
  const [newGMemberId, setNewGMemberId] = useState('')
  const [newGPledged, setNewGPledged] = useState('')

  // Calculate live guardrails
  const maxCap = savingsBalance * multiplier
  const estMonthlyPayment = tenure > 0 ? (requestedCapital / tenure) : 0
  const residualNetPay = basicPay - monthlyDeductions - estMonthlyPayment
  const minOneThirdReq = basicPay / 3.0
  const dtiRatio = basicPay > 0 ? ((monthlyDeductions + estMonthlyPayment) / basicPay) * 100 : 82.0

  const depositMultiplierPassed = requestedCapital <= maxCap
  const oneThirdPayPassed = residualNetPay >= minOneThirdReq
  
  const totalPledged = guarantors.reduce((sum, g) => sum + g.pledgedShares, 0)
  const unsecuredExposure = Math.max(0, requestedCapital - savingsBalance)
  const guarantorCoverPassed = totalPledged >= unsecuredExposure

  const overallDeclined = !depositMultiplierPassed || !oneThirdPayPassed

  function handleAddGuarantorSubmit() {
    if (!newGName || !newGPledged) return
    const g: Guarantor = {
      id: crypto.randomUUID(),
      name: newGName,
      memberId: newGMemberId || `M-${Math.floor(1000 + Math.random() * 8999)}`,
      pledgedShares: Number(newGPledged) || 0,
      availableShares: Number(newGPledged) || 0,
    }
    const updated = [...guarantors, g]
    setGuarantors(updated)
    onUpdateApplication({ guarantors: updated })
    setNewGName('')
    setNewGMemberId('')
    setNewGPledged('')
    setShowAddGuarantorModal(false)
  }

  function handleRemoveGuarantor(id: string) {
    const updated = guarantors.filter((g) => g.id !== id)
    setGuarantors(updated)
    onUpdateApplication({ guarantors: updated })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* LEFT COLUMN: Override Inputs & Guarantor Audit */}
      <div className="space-y-6 lg:col-span-5">
        {/* Officer Override Inputs */}
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <UserCheck className="size-4 text-[#103a27]" />
              <h3 className="font-serif text-sm font-bold text-[#103a27]">
                Officer Override Inputs
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                Borrower Classification
              </label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-white p-2.5 text-xs font-semibold text-foreground focus:border-[#103a27] focus:outline-none"
              >
                <option value="individual">BOSA Member</option>
                <option value="cooperative">Cooperative / SME</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Multiplier
                </label>
                <select
                  value={multiplier}
                  onChange={(e) => setMultiplier(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs font-semibold focus:border-[#103a27] focus:outline-none"
                >
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                  <option value={4}>4x</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Tenure (Months)
                </label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs font-semibold focus:border-[#103a27] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Requested Capital (UGX)
                </label>
                <input
                  type="number"
                  value={requestedCapital}
                  onChange={(e) => setRequestedCapital(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs font-bold text-[#103a27] focus:border-[#103a27] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Savings Balance (UGX)
                </label>
                <input
                  type="number"
                  value={savingsBalance}
                  onChange={(e) => setSavingsBalance(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs font-semibold focus:border-[#103a27] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Basic Monthly Pay
                </label>
                <input
                  type="number"
                  value={basicPay}
                  onChange={(e) => setBasicPay(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs font-semibold focus:border-[#103a27] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Monthly Deductions
                </label>
                <input
                  type="number"
                  value={monthlyDeductions}
                  onChange={(e) => setMonthlyDeductions(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-white p-2.5 text-xs font-semibold focus:border-[#103a27] focus:outline-none"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Guarantor Coverage Audit */}
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#103a27]" />
                <h3 className="font-serif text-sm font-bold text-[#103a27]">
                  Guarantor Coverage Audit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddGuarantorModal(true)}
                className="flex items-center gap-1 rounded-full border border-[#103a27]/30 bg-[#eaf4e5] px-2.5 py-1 text-[0.65rem] font-bold text-[#103a27] hover:bg-[#dbead5]"
              >
                <Plus className="size-3" />
                Add Guarantor
              </button>
            </div>

            <p className="text-[0.7rem] text-muted-foreground">
              Guarantor commitments must offset the unsecured exposure gap.
            </p>

            <div className="space-y-3">
              {guarantors.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {g.name} <span className="text-muted-foreground">({g.memberId})</span>
                    </p>
                    <div className="mt-1 flex gap-4 text-[0.65rem] text-muted-foreground">
                      <span>PLEDGED (UGX): <strong className="text-[#103a27]">{g.pledgedShares.toLocaleString()}</strong></span>
                      <span>AVAILABLE SHARES: <strong className="text-emerald-700">{(g.availableShares || g.pledgedShares).toLocaleString()}</strong></span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGuarantor(g.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border space-y-1 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Unsecured Exposure:</span>
                <span className="font-mono font-bold text-[#103a27]">{formatUGX(unsecuredExposure)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Total Pledged:</span>
                <span className="font-mono font-bold text-emerald-700">{formatUGX(totalPledged)}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* RIGHT COLUMN: Guardrail Engine & Synthesis Report */}
      <div className="space-y-6 lg:col-span-7">
        {/* Underwriting Guardrail Check Engine Card */}
        <div className="rounded-2xl bg-[#071d13] p-6 text-white shadow-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-[#a4cc44]" />
              <h3 className="font-serif text-base font-bold text-white">
                Underwriting Guardrail Check Engine
              </h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                overallDeclined
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {overallDeclined ? 'DECLINED' : 'APPROVED'}
            </span>
          </div>

          {/* Key Metric Tiles */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-white/50">
                DTI NET RATIO
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-400">{dtiRatio.toFixed(1)}%</p>
              <p className="mt-1 text-[0.6rem] text-white/40">Max Statutory: 50%</p>
            </div>

            <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-white/50">
                SAVINGS MULTIPLIER
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-400">
                {(requestedCapital / savingsBalance).toFixed(2)}x
              </p>
              <p className="mt-1 text-[0.6rem] text-white/40">Allowed: 2x or 3x</p>
            </div>

            <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-white/50">
                NET TAKE-HOME
              </p>
              <p className="mt-1 text-base font-bold text-white font-mono">
                UGX {residualNetPay.toLocaleString()}
              </p>
              <p className="mt-1 text-[0.6rem] text-white/40">Statutory 1/3 Limit Check</p>
            </div>
          </div>

          {/* Policy Validation Engine Rules */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#a4cc44]">
              POLICY VALIDATION ENGINE
            </p>

            {/* Check 1 */}
            <div className="flex items-start justify-between rounded-xl bg-white/5 p-3 border border-white/5">
              <div className="flex items-start gap-2.5">
                {depositMultiplierPassed ? (
                  <CheckCircle2 className="size-4 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="size-4 text-rose-400 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">Deposit Multiplier Bound Check</p>
                  <p className="text-[0.65rem] text-white/60">
                    {depositMultiplierPassed
                      ? 'Within limit ceiling.'
                      : `Boundary breach: Requested amount exceeds the multiplier ceiling of ${formatUGX(maxCap)}.`}
                  </p>
                </div>
              </div>
              <span
                className={`text-[0.65rem] font-bold ${
                  depositMultiplierPassed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {depositMultiplierPassed ? 'Passed' : 'Failed'}
              </span>
            </div>

            {/* Check 2 */}
            <div className="flex items-start justify-between rounded-xl bg-white/5 p-3 border border-white/5">
              <div className="flex items-start gap-2.5">
                {oneThirdPayPassed ? (
                  <CheckCircle2 className="size-4 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="size-4 text-rose-400 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">One-Third Statutory Net-Pay Check</p>
                  <p className="text-[0.65rem] text-white/60">
                    {oneThirdPayPassed
                      ? 'Residual pay satisfies minimum 1/3 threshold.'
                      : `Statutory violation: Projected residual net pay (${formatUGX(residualNetPay)}) falls below the statutory 1/3 minimum.`}
                  </p>
                </div>
              </div>
              <span
                className={`text-[0.65rem] font-bold ${
                  oneThirdPayPassed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {oneThirdPayPassed ? 'Passed' : 'Failed'}
              </span>
            </div>

            {/* Check 3 */}
            <div className="flex items-start justify-between rounded-xl bg-white/5 p-3 border border-white/5">
              <div className="flex items-start gap-2.5">
                {guarantorCoverPassed ? (
                  <CheckCircle2 className="size-4 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="size-4 text-rose-400 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-bold text-white">Guarantor Exposure & Share Cover</p>
                  <p className="text-[0.65rem] text-white/60">
                    {guarantorCoverPassed
                      ? 'Social coverage cleared: pledged guarantor shares cover the uncollateralized exposure deficit.'
                      : 'Insufficient guarantor coverage.'}
                  </p>
                </div>
              </div>
              <span
                className={`text-[0.65rem] font-bold ${
                  guarantorCoverPassed ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {guarantorCoverPassed ? 'Passed' : 'Failed'}
              </span>
            </div>
          </div>
        </div>

        {/* Underwriter Synthesis Report */}
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-serif text-sm font-bold text-[#103a27]">
                Underwriter Synthesis Report
              </h3>
              <span className="text-[0.65rem] text-muted-foreground">
                Generated: August 4, 2026
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-2">
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                EXECUTIVE RISK REVIEW SUMMARY
              </p>
              <p className="text-xs font-medium leading-relaxed text-foreground">
                File <span className="font-mono font-bold text-[#103a27]">{application.reference}</span> is{' '}
                <strong className={overallDeclined ? 'text-rose-600' : 'text-emerald-700'}>
                  {overallDeclined ? 'declined' : 'recommended for approval'}
                </strong>
                . {overallDeclined ? 'BOSA multiplier breach; Payslip take-home deficit.' : 'All statutory risk guardrails satisfied.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-muted-foreground block text-[0.65rem]">Appraisal Officer:</span>
                <span className="font-semibold text-foreground">Agaba Collins (Risk Division)</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[0.65rem]">Security Signature:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> OTP Signed (Verified)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                // Flush all computed underwriting values into shared application state
                // so the Committee frozen stats panel reads live numbers, not seed data
                onUpdateApplication({
                  multiplier,
                  tenureMonths: tenure,
                  principal: requestedCapital,
                  savingsBalance,
                  monthlyIncome: basicPay,
                  monthlyDebt: monthlyDeductions,
                  basicMonthlyPay: basicPay,
                  monthlyDeductions,
                  dtiNetRatio: dtiRatio,
                  netTakeHome: residualNetPay,
                  guardrailDepositMultiplierPassed: depositMultiplierPassed,
                  guardrailOneThirdPayPassed: oneThirdPayPassed,
                  guardrailGuarantorPassed: guarantorCoverPassed,
                  verdict: overallDeclined ? 'DECLINED' : 'APPROVED',
                  guarantors,
                })
                onRouteToCommittee()
              }}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#103a27] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#1a5235] transition-all"
            >
              <Send className="size-3.5" />
              Route to Committee Board
            </button>
          </CardBody>
        </Card>
      </div>

      {/* Add Guarantor Modal */}
      {showAddGuarantorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h4 className="font-serif text-base font-bold text-[#103a27]">Add Guarantor Commitment</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Guarantor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kato Joseph"
                  value={newGName}
                  onChange={(e) => setNewGName(e.target.value)}
                  className="w-full rounded-xl border border-border p-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Member ID</label>
                <input
                  type="text"
                  placeholder="e.g. M-1104"
                  value={newGMemberId}
                  onChange={(e) => setNewGMemberId(e.target.value)}
                  className="w-full rounded-xl border border-border p-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground">Pledged Shares (UGX)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000000"
                  value={newGPledged}
                  onChange={(e) => setNewGPledged(e.target.value)}
                  className="w-full rounded-xl border border-border p-2.5 text-xs font-bold text-[#103a27] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddGuarantorModal(false)}
                className="rounded-full bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddGuarantorSubmit}
                className="rounded-full bg-[#103a27] px-4 py-2 text-xs font-bold text-white"
              >
                Add Guarantor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
