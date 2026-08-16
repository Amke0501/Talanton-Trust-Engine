'use client'

import { useState } from 'react'
import { CheckCircle2, FileText, Send, Sparkles, X, ChevronRight, ChevronLeft, Upload } from 'lucide-react'
import {
  formatUGX,
  makeDocumentSlots,
  savingsCap,
  type Application,
  type ApplicantType,
  type DocumentSlot,
} from '@/lib/talenton-data'

export function ApplicantDashboardView({
  application,
  onUpdateApplication,
  onSubmitToUnderwriter,
  onClose,
}: {
  application: Application
  onUpdateApplication: (updated: Partial<Application>) => void
  onSubmitToUnderwriter: () => void
  onClose?: () => void
}) {
  // Step indicator state
  const [step, setStep] = useState(1)

  // Empty fields by default for fresh applications (no default values)
  const [classification, setClassification] = useState<ApplicantType>('individual')
  const [multiplier, setMultiplier] = useState<number>(3)
  const [purpose, setPurpose] = useState<string>('')
  
  // Numerical fields initialized to empty string '' for empty placeholders
  const [principal, setPrincipal] = useState<number | ''>('')
  const [savings, setSavings] = useState<number | ''>('')
  const [monthlyPay, setMonthlyPay] = useState<number | ''>('')
  const [monthlyDebt, setMonthlyDebt] = useState<number | ''>('')
  const [tenure, setTenure] = useState<number | ''>('')
  
  const [documents, setDocuments] = useState<DocumentSlot[]>(makeDocumentSlots('individual'))

  const calculatedCap = savingsCap(Number(savings) || 0, multiplier)
  const clearedCount = documents.filter((d) => d.status === 'VERIFIED').length

  function handleFieldChange(field: string, val: any) {
    if (field === 'classification') {
      setClassification(val)
      setDocuments(makeDocumentSlots(val))
      onUpdateApplication({ applicantType: val, documents: makeDocumentSlots(val) })
    } else if (field === 'multiplier') {
      setMultiplier(val)
      onUpdateApplication({ multiplier: val })
    } else if (field === 'purpose') {
      setPurpose(val)
      onUpdateApplication({ purpose: val })
    } else if (field === 'principal') {
      const num = val === '' ? '' : Number(val)
      setPrincipal(num)
      onUpdateApplication({ principal: Number(num) || 0 })
    } else if (field === 'savings') {
      const num = val === '' ? '' : Number(val)
      setSavings(num)
      onUpdateApplication({ savingsBalance: Number(num) || 0 })
    } else if (field === 'monthlyPay') {
      const num = val === '' ? '' : Number(val)
      setMonthlyPay(num)
      onUpdateApplication({ monthlyIncome: Number(num) || 0 })
    } else if (field === 'monthlyDebt') {
      const num = val === '' ? '' : Number(val)
      setMonthlyDebt(num)
      onUpdateApplication({ monthlyDebt: Number(num) || 0 })
    } else if (field === 'tenure') {
      const num = val === '' ? '' : Number(val)
      setTenure(num)
      onUpdateApplication({ tenureMonths: Number(num) || 0 })
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
    if (!savings || Number(savings) <= 0) issues.push('Savings balance must be greater than 0')
    if (!principal || Number(principal) <= 0) issues.push('Loan principal must be greater than 0')
    if (!monthlyPay || Number(monthlyPay) <= 0) issues.push('Monthly income / net pay must be greater than 0')
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

  // Determine card background based on step
  const cardBgClass = step === 3 ? 'bg-[#0d2a1c]' : 'bg-white'
  const cardBorderClass = step === 3 ? 'border-white/10' : 'border-gray-200'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#eaf4e5] flex flex-col font-sans relative">
      
      {/* Background Faint City Skyline Drawing */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.06] pointer-events-none z-0">
        <svg viewBox="0 0 1200 200" fill="none" stroke="#103a27" strokeWidth="2.5" className="w-full h-full object-cover">
          <path d="M0,180 L80,180 L80,110 L120,110 L120,150 L160,150 L160,80 L200,80 L200,180 L250,180 L250,130 L290,130 L290,180 L350,180 L350,90 L400,90 L400,140 L430,140 L430,180 L500,180 L500,60 L540,60 L540,110 L580,110 L580,180 L620,180 L620,120 L660,120 L660,180 L720,180 L720,70 L770,70 L770,180 L830,180 L830,100 L880,100 L880,150 L910,150 L910,180 L980,180 L980,50 L1020,50 L1020,130 L1060,130 L1060,180 L1120,180 L1120,110 L1160,110 L1160,180 L1200,180" />
          <line x1="0" y1="180" x2="1200" y2="180" />
          <path d="M100,50 Q250,20 400,60 T700,30 T1000,70" strokeDasharray="5,5" />
          <path d="M150,100 Q300,70 450,110 T750,80 T1050,120" strokeDasharray="5,5" />
        </svg>
      </div>

      {/* Sticky Dark Green Header Row */}
      <div className="bg-[#0d2a1c] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md text-white">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white font-bold shadow-sm">
            T.
          </span>
          <div>
            <h2 className="font-serif text-xl font-extrabold text-white">New Credit Application</h2>
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#a4cc44]">SACCO Appraisals</p>
          </div>
        </div>

        {/* Step progress indicators in header */}
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white font-bold' : 'text-gray-400'}`}>
            <span className={`size-5 rounded-full flex items-center justify-center text-[0.65rem] ${step >= 1 ? 'bg-[#a4cc44] text-[#0d2a1c]' : 'bg-white/10'}`}>1</span>
            Profile
          </div>
          <div className="h-px w-8 bg-white/10" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white font-bold' : 'text-gray-400'}`}>
            <span className={`size-5 rounded-full flex items-center justify-center text-[0.65rem] ${step >= 2 ? 'bg-[#a4cc44] text-[#0d2a1c]' : 'bg-white/10'}`}>2</span>
            Finances
          </div>
          <div className="h-px w-8 bg-white/10" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-white font-bold' : 'text-gray-400'}`}>
            <span className={`size-5 rounded-full flex items-center justify-center text-[0.65rem] ${step >= 3 ? 'bg-[#a4cc44] text-[#0d2a1c]' : 'bg-white/10'}`}>3</span>
            Documents
          </div>
        </div>

        {/* Close Button X */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close form"
        >
          <X className="size-6" />
        </button>
      </div>

      {/* Main Centered Box Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 z-10">
        <div className={`max-w-2xl w-full rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all ${cardBgClass} ${cardBorderClass}`}>
          
          {/* Card Body - Edit blocks directly (no title headers here) */}
          <div className={`p-6 md:p-8 space-y-6 flex-1 ${cardBgClass}`}>
            
            {/* STEP 1: Profile (Edit blocks only) */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">Applicant Classification</label>
                    <select
                      value={classification}
                      onChange={(e) => handleFieldChange('classification', e.target.value)}
                      className="w-full rounded-none border-0 border-b-2 border-gray-300 bg-transparent py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#103a27] transition-all"
                    >
                      <option value="individual">BOSA Member (Savings Anchor)</option>
                      <option value="cooperative">Cooperative / SME</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">Desired Capital Multiplier</label>
                    <select
                      value={multiplier}
                      onChange={(e) => handleFieldChange('multiplier', Number(e.target.value))}
                      className="w-full rounded-none border-0 border-b-2 border-gray-300 bg-transparent py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#103a27] transition-all"
                    >
                      <option value={2}>2x Savings Balance</option>
                      <option value={3}>3x Savings Balance</option>
                      <option value={4}>4x Savings Balance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">Purpose of Financing</label>
                  <input
                    type="text"
                    placeholder="e.g. Working capital, Expand business operations"
                    value={purpose}
                    onChange={(e) => handleFieldChange('purpose', e.target.value)}
                    className="w-full rounded-none border-0 border-b-2 border-gray-300 bg-transparent py-2 text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#103a27] transition-all"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Finances (Edit blocks only) */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">Requested Loan Principal (UGX)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15,000,000"
                    value={principal}
                    onChange={(e) => handleFieldChange('principal', e.target.value)}
                    className="w-full rounded-none border-0 border-b-2 border-gray-300 bg-transparent py-2 text-lg font-bold text-gray-800 focus:outline-none focus:border-[#103a27] transition-all font-mono"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">Current Savings Balance (UGX)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4,000,000"
                      value={savings}
                      onChange={(e) => handleFieldChange('savings', e.target.value)}
                      className="w-full rounded-none border-0 border-b-2 border-gray-300 bg-transparent py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#103a27] transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">Certified Monthly Revenue (UGX)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2,500,000"
                      value={monthlyPay}
                      onChange={(e) => handleFieldChange('monthlyPay', e.target.value)}
                      className="w-full rounded-none border-0 border-b-2 border-gray-300 bg-transparent py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#103a27] transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">Monthly Debt Deductions (UGX)</label>
                    <input
                      type="number"
                      placeholder="e.g. 500,000"
                      value={monthlyDebt}
                      onChange={(e) => handleFieldChange('monthlyDebt', e.target.value)}
                      className="w-full rounded-none border-0 border-b-2 border-gray-300 bg-transparent py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#103a27] transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">Amortization Tenure (Months)</label>
                    <input
                      type="number"
                      placeholder="e.g. 12"
                      value={tenure}
                      onChange={(e) => handleFieldChange('tenure', e.target.value)}
                      className="w-full rounded-none border-0 border-b-2 border-gray-300 bg-transparent py-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-[#103a27] transition-all font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Compliance & Submission (Dark Green Layout) */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn text-white">
                
                {/* Document Slots checklist */}
                <div className="space-y-3">
                  <label className="text-[0.7rem] font-bold uppercase tracking-wider text-[#a4cc44] block mb-2">Verify Required Slots</label>
                  <div className="space-y-3">
                    {documents.map((doc) => {
                      const isVerified = doc.status === 'VERIFIED'
                      return (
                        <div key={doc.id} className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5">
                          <div className="flex items-start gap-3">
                            <FileText className="size-5 text-[#a4cc44] mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-white">{doc.label}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{doc.hint}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleDocumentStatus(doc.id)}
                            className="shrink-0 cursor-pointer text-sm"
                          >
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                                <CheckCircle2 className="size-4" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-[#a4cc44] px-3 py-1.5 text-xs font-bold text-[#0d2a1c] hover:bg-[#b5dc55] transition-colors shadow-sm">
                                <Upload className="size-3.5" />
                                Upload
                              </span>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* OCR & BOSA Estimate Combined */}
                <div className="grid gap-5 sm:grid-cols-2 pt-2">
                  {/* OCR Simulator */}
                  <div className="rounded-xl border border-white/10 p-4 space-y-3 bg-white/5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-[#a4cc44]" />
                      <h4 className="text-xs font-bold text-gray-200">OCR Statements</h4>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleOCRSimulate('salary')}
                        className="text-left w-full rounded-lg border border-white/10 bg-transparent p-2.5 hover:border-[#a4cc44] hover:bg-white/10 text-xs font-semibold text-gray-300 cursor-pointer transition-all"
                      >
                        Salary Slip
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOCRSimulate('sme')}
                        className="text-left w-full rounded-lg border border-white/10 bg-transparent p-2.5 hover:border-[#a4cc44] hover:bg-white/10 text-xs font-semibold text-gray-300 cursor-pointer transition-all"
                      >
                        SME Statement
                      </button>
                    </div>
                  </div>

                  {/* BOSA Estimate */}
                  <div className="rounded-xl border border-[#a4cc44]/30 bg-[#a4cc44]/10 p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#a4cc44] block">BOSA Cap Estimate</span>
                      <p className="text-2xl font-extrabold text-white mt-1.5 font-mono">{formatUGX(calculatedCap)}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 leading-snug">
                      Multiplier value selected in Step 1.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Centered Modal Footer Navigation Bar */}
          <div className={`border-t px-6 py-4 flex items-center justify-between ${step === 3 ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-gray-50/50'}`}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  step === 3 
                    ? 'border-white/20 text-white hover:bg-white/10' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="size-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev + 1)}
                className="flex items-center gap-1.5 rounded-xl bg-[#0d2a1c] hover:bg-[#153e2a] text-white px-5 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer ml-auto"
              >
                Next
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-xl bg-[#a4cc44] hover:bg-[#b5dc55] text-[#0d2a1c] px-6 py-2.5 text-sm font-bold shadow-md transition-all cursor-pointer ml-auto"
              >
                <Send className="size-4" />
                Submit Application
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
