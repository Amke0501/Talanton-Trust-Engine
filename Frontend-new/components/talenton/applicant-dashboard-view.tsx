'use client'

import { useState } from 'react'
import { CheckCircle2, FileCode, FileText, Send, Sparkles, AlertTriangle } from 'lucide-react'
import {
  formatUGX,
  makeDocumentSlots,
  savingsCap,
  type Application,
  type ApplicantType,
  type DocumentSlot,
} from '@/lib/talenton-data'
import { Card, CardBody } from '@/components/talenton/primitives'

export function ApplicantDashboardView({
  application,
  onUpdateApplication,
  onSubmitToUnderwriter,
}: {
  application: Application
  onUpdateApplication: (updated: Partial<Application>) => void
  onSubmitToUnderwriter: () => void
}) {
  const [classification, setClassification] = useState<ApplicantType>(application.applicantType || 'individual')
  const [multiplier, setMultiplier] = useState<number>(application.multiplier || 3)
  const [principal, setPrincipal] = useState<number>(application.principal || 15_000_000)
  const [savings, setSavings] = useState<number>(application.savingsBalance || 4_000_000)
  const [monthlyPay, setMonthlyPay] = useState<number>(application.monthlyIncome || 2_500_000)
  const [monthlyDebt, setMonthlyDebt] = useState<number>(application.monthlyDebt || 500_000)
  const [tenure, setTenure] = useState<number>(application.tenureMonths || 12)
  const [documents, setDocuments] = useState<DocumentSlot[]>(application.documents || makeDocumentSlots('individual'))

  const calculatedCap = savingsCap(savings, multiplier)
  const clearedCount = documents.filter((d) => d.status === 'VERIFIED').length

  function handleFieldChange(field: string, val: any) {
    if (field === 'classification') {
      setClassification(val)
      setDocuments(makeDocumentSlots(val))
      onUpdateApplication({ applicantType: val, documents: makeDocumentSlots(val) })
    } else if (field === 'multiplier') {
      setMultiplier(val)
      onUpdateApplication({ multiplier: val })
    } else if (field === 'principal') {
      setPrincipal(Number(val) || 0)
      onUpdateApplication({ principal: Number(val) || 0 })
    } else if (field === 'savings') {
      setSavings(Number(val) || 0)
      onUpdateApplication({ savingsBalance: Number(val) || 0 })
    } else if (field === 'monthlyPay') {
      setMonthlyPay(Number(val) || 0)
      onUpdateApplication({ monthlyIncome: Number(val) || 0 })
    } else if (field === 'monthlyDebt') {
      setMonthlyDebt(Number(val) || 0)
      onUpdateApplication({ monthlyDebt: Number(val) || 0 })
    } else if (field === 'tenure') {
      setTenure(Number(val) || 0)
      onUpdateApplication({ tenureMonths: Number(val) || 0 })
    }
  }

  function handleOCRSimulate(preset: 'salary' | 'sme' | 'high_risk') {
    if (preset === 'salary') {
      setMonthlyPay(4_000_000)
      setMonthlyDebt(500_000)
      setSavings(4_000_000)
      setPrincipal(12_000_000)
      onUpdateApplication({ monthlyIncome: 4_000_000, monthlyDebt: 500_000, savingsBalance: 4_000_000, principal: 12_000_000 })
    } else if (preset === 'sme') {
      setClassification('cooperative')
      setMonthlyPay(8_500_000)
      setMonthlyDebt(1_200_000)
      setSavings(15_000_000)
      setPrincipal(42_000_000)
      setDocuments(makeDocumentSlots('cooperative'))
      onUpdateApplication({ applicantType: 'cooperative', monthlyIncome: 8_500_000, monthlyDebt: 1_200_000, savingsBalance: 15_000_000, principal: 42_000_000, documents: makeDocumentSlots('cooperative') })
    } else if (preset === 'high_risk') {
      setMonthlyPay(2_500_000)
      setMonthlyDebt(1_800_000)
      setPrincipal(18_000_000)
      onUpdateApplication({ monthlyIncome: 2_500_000, monthlyDebt: 1_800_000, principal: 18_000_000 })
    }
  }

  function toggleDocumentStatus(docId: string) {
    const updated = documents.map((d) => {
      if (d.id === docId) {
        const nextStatus = d.status === 'VERIFIED' ? 'PENDING' : 'VERIFIED'
        return { ...d, status: nextStatus as any }
      }
      return d
    })
    setDocuments(updated)
    onUpdateApplication({ documents: updated })
  }

  function handleSubmit() {
    const issues: string[] = []
    if (savings <= 0) issues.push('Savings balance must be greater than 0')
    if (principal <= 0) issues.push('Loan principal must be greater than 0')
    if (monthlyPay <= 0) issues.push('Monthly income / net pay must be greater than 0')
    const mandatoryUncleared = documents.filter((d) => d.required && d.status !== 'VERIFIED')
    if (mandatoryUncleared.length > 0) {
      issues.push(`${mandatoryUncleared.length} mandatory document(s) not yet verified: ${mandatoryUncleared.map(d => d.label).join(', ')}`)
    }
    if (issues.length > 0) {
      alert('Cannot submit — please fix the following:\n\n• ' + issues.join('\n• '))
      return
    }
    onSubmitToUnderwriter()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* LEFT COLUMN: Entry Form & OCR Extractor */}
      <div className="space-y-6 lg:col-span-7">
        {/* Direct Applicant Entry */}
        <Card>
          <CardBody className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <FileText className="size-5 text-[#103a27]" />
              <h3 className="font-serif text-lg font-bold text-[#103a27]">
                1. Direct Applicant Entry
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  BORROWER CLASSIFICATION
                </label>
                <select
                  value={classification}
                  onChange={(e) => handleFieldChange('classification', e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm font-semibold text-foreground shadow-sm focus:border-[#103a27] focus:outline-none"
                >
                  <option value="individual">BOSA Member (Savings Anchor)</option>
                  <option value="cooperative">Cooperative / SME</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  DESIRED CAPITAL MULTIPLIER
                </label>
                <select
                  value={multiplier}
                  onChange={(e) => handleFieldChange('multiplier', Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm font-semibold text-foreground shadow-sm focus:border-[#103a27] focus:outline-none"
                >
                  <option value={2}>2x Savings Balance</option>
                  <option value={3}>3x Savings Balance</option>
                  <option value={4}>4x Savings Balance</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                REQUESTED LOAN PRINCIPAL (UGX)
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => handleFieldChange('principal', e.target.value)}
                className="w-full rounded-xl border border-border bg-white p-3 text-base font-bold text-[#103a27] shadow-sm focus:border-[#103a27] focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  CURRENT MEMBER SAVINGS BALANCE (UGX)
                </label>
                <input
                  type="number"
                  value={savings}
                  onChange={(e) => handleFieldChange('savings', e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm font-bold text-foreground shadow-sm focus:border-[#103a27] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  CERTIFIED MONTHLY REVENUE / NET PAY (UGX)
                </label>
                <input
                  type="number"
                  value={monthlyPay}
                  onChange={(e) => handleFieldChange('monthlyPay', e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm font-bold text-foreground shadow-sm focus:border-[#103a27] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  EXISTING MONTHLY DEBT DEDUCTIONS (UGX)
                </label>
                <input
                  type="number"
                  value={monthlyDebt}
                  onChange={(e) => handleFieldChange('monthlyDebt', e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm font-bold text-foreground shadow-sm focus:border-[#103a27] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  AMORTIZATION TENURE (MONTHS)
                </label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => handleFieldChange('tenure', e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm font-bold text-foreground shadow-sm focus:border-[#103a27] focus:outline-none"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* OCR Statement Extraction Simulator */}
        <Card className="border border-emerald-500/20 bg-emerald-950/5">
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-600" />
                <h4 className="font-serif text-sm font-bold text-[#103a27]">
                  OCR Statement Extraction
                </h4>
              </div>
              <span className="text-[0.65rem] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                AI Document Extraction
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Don't want to type finances manually? Choose a sample file to parse payslips and bank balances instantly.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => handleOCRSimulate('salary')}
                className="flex flex-col text-left rounded-xl border border-border bg-white p-3 shadow-sm hover:border-[#103a27] transition-all hover:bg-[#eaf4e5]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#103a27]">Salary Slip</span>
                  <FileText className="size-3.5 text-muted-foreground" />
                </div>
                <span className="mt-1 text-[0.65rem] text-muted-foreground">
                  Simulate parsing high payroll data
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleOCRSimulate('sme')}
                className="flex flex-col text-left rounded-xl border border-border bg-white p-3 shadow-sm hover:border-[#103a27] transition-all hover:bg-[#eaf4e5]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#103a27]">SME Statements</span>
                  <FileCode className="size-3.5 text-muted-foreground" />
                </div>
                <span className="mt-1 text-[0.65rem] text-muted-foreground">
                  Simulate parsing business flows
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleOCRSimulate('high_risk')}
                className="flex flex-col text-left rounded-xl border border-border bg-white p-3 shadow-sm hover:border-amber-500 transition-all hover:bg-amber-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">High Risk Profile</span>
                  <AlertTriangle className="size-3.5 text-amber-600" />
                </div>
                <span className="mt-1 text-[0.65rem] text-amber-800/80">
                  Simulate poor DTI ratios
                </span>
              </button>
            </div>
            <p className="text-[0.65rem] text-muted-foreground text-right">
              Powered by Talanton OCR Core API. Max file payload size: 8MB.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* RIGHT COLUMN: Checklist, BOSA Cap & Submit CTA */}
      <div className="space-y-6 lg:col-span-5">
        {/* Document Clearance Checklist */}
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif text-sm font-bold text-[#103a27]">
                Document Clearance Checklist
              </h3>
              <span className="rounded-full bg-[#103a27]/10 px-2.5 py-0.5 text-xs font-bold text-[#103a27]">
                {clearedCount} / {documents.length} Cleared
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Verify required local compliance uploads. All mandatory slots must be cleared to pass underwriting.
            </p>

            <div className="space-y-3">
              {documents.map((doc) => {
                const isVerified = doc.status === 'VERIFIED'
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileText className="size-4 shrink-0 text-[#103a27] mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-foreground">{doc.label}</p>
                        <p className="text-[0.65rem] text-muted-foreground">{doc.hint}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDocumentStatus(doc.id)}
                      className="shrink-0"
                    >
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-[0.65rem] font-bold text-emerald-800">
                          <CheckCircle2 className="size-3" />
                          VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-[0.65rem] font-bold text-amber-800 hover:bg-amber-200 transition-colors">
                          PENDING — UPLOAD NOW
                        </span>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>

        {/* BOSA Cap Estimate Box */}
        <div className="rounded-2xl bg-[#0d2a1c] p-6 text-white shadow-lg space-y-2 border border-white/10">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#a4cc44]">
            <span>BOSA CAP ESTIMATE</span>
            <span className="font-mono text-lg text-white font-bold">{formatUGX(calculatedCap)}</span>
          </div>
          <p className="text-xs text-white/70">
            Based on your savings anchor and selected multiplier.
          </p>
        </div>

        {/* Submit to Underwriter Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-[#103a27] py-4 text-sm font-bold text-white shadow-xl hover:bg-[#1a5235] transition-all hover:scale-[1.01]"
        >
          <Send className="size-4" />
          Submit to Underwriter
        </button>
      </div>
    </div>
  )
}
