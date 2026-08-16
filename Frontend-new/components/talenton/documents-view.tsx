'use client'

import { useState, useMemo } from 'react'
import { FileText, Upload, CheckCircle2, Clock, Trash2, ShieldCheck, Download, AlertCircle } from 'lucide-react'
import { type Application, type DocumentSlot } from '@/lib/talenton-data'

export function DocumentsView({
  application,
  onUpdateDocuments,
}: {
  application: Application
  onUpdateDocuments?: (docs: DocumentSlot[]) => void
}) {
  const [selectedSlot, setSelectedSlot] = useState<string>('id')
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 'f-1',
      slotId: 'id',
      label: 'National ID / NIN',
      fileName: 'national_id_front_back.pdf',
      size: '1.2 MB',
      uploadedAt: 'Aug 04, 2026 10:15 AM',
      status: 'VERIFIED',
    },
    {
      id: 'f-2',
      slotId: 'payslip',
      label: 'Certified Payslip / Business Ledger',
      fileName: 'payslip_july_2026.pdf',
      size: '2.4 MB',
      uploadedAt: 'Aug 04, 2026 10:20 AM',
      status: 'VERIFIED',
    },
    {
      id: 'f-3',
      slotId: 'guarantor',
      label: 'Signed Guarantor Consent Letter',
      fileName: 'guarantor_consent_signed.pdf',
      size: '850 KB',
      uploadedAt: 'Aug 04, 2026 10:22 AM',
      status: 'VERIFIED',
    },
  ])

  const documentSlots = useMemo(() => {
    return application.documents || []
  }, [application])

  const pendingSlots = useMemo(() => {
    return documentSlots.filter(s => s.status !== 'VERIFIED')
  }, [documentSlots])

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    const slot = documentSlots.find(s => s.id === selectedSlot)
    if (!slot) return

    const newFile = {
      id: `f-${Date.now()}`,
      slotId: selectedSlot,
      label: slot.label,
      fileName: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toLocaleString(),
      status: 'VERIFIED',
    }

    setUploadedFiles(prev => [newFile, ...prev])

    const updatedSlots = documentSlots.map(s => {
      if (s.id === selectedSlot) {
        return { ...s, status: 'VERIFIED' as const, fileName: file.name }
      }
      return s
    })

    if (onUpdateDocuments) {
      onUpdateDocuments(updatedSlots)
    }
  }

  const handleDelete = (id: string, slotId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))

    const updatedSlots = documentSlots.map(s => {
      if (s.id === slotId) {
        return { ...s, status: 'PENDING' as const, fileName: undefined }
      }
      return s
    })

    if (onUpdateDocuments) {
      onUpdateDocuments(updatedSlots)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#103a27]">Documents Hub</h1>
        <p className="mt-1 text-sm text-[#2a5040]/70">
          Manage compliance uploads, verify legal slots, and upload required documents.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column: Upload Box & Legal Requirements */}
        <div className="space-y-6 md:col-span-7">
          {/* Upload Area Box (Dark Green) */}
          <div className="bg-[#0d2a1c] rounded-2xl border border-white/10 p-6 shadow-xl space-y-4 text-white">
            <h3 className="font-serif text-lg font-bold text-[#a4cc44]">Upload Compliance Document</h3>
            
            {/* Slot selector */}
            <div className="space-y-1.5">
              <label className="text-[0.65rem] font-bold text-gray-300 uppercase tracking-wider">Select Document Slot</label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#103a27] p-3 text-xs font-semibold text-white focus:outline-none focus:border-[#a4cc44] transition-all"
              >
                {documentSlots.map((slot) => (
                  <option key={slot.id} value={slot.id} className="bg-[#0d2a1c]">
                    {slot.label} {slot.required ? '(Required)' : '(Optional)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                dragActive 
                  ? 'border-[#a4cc44] bg-[#103a27]/50' 
                  : 'border-white/15 bg-[#103a27]/20 hover:border-white/25'
              }`}
            >
              <div className="size-12 rounded-full bg-white/10 text-[#a4cc44] flex items-center justify-center mb-3">
                <Upload className="size-6" />
              </div>
              <p className="text-xs font-bold text-white">Drag & drop files here or click to browse</p>
              <p className="text-[0.65rem] text-gray-300 mt-1">Supports PDF, PNG, JPG up to 8MB</p>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label
                htmlFor="file-upload"
                className="mt-4 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-xs font-bold text-[#0d2a1c] shadow-lg cursor-pointer transition-colors"
              >
                Choose File
              </label>
            </div>
          </div>

          {/* Legal Documents Needed (Dark Green) */}
          <div className="bg-[#0d2a1c] rounded-2xl border border-white/10 p-6 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-serif text-base font-bold text-[#a4cc44]">Required Legal Documents</h3>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#a4cc44] bg-white/10 px-2.5 py-0.5 rounded-md">
                Compliance Checklist
              </span>
            </div>
            
            <div className="space-y-3">
              {documentSlots.map((slot) => {
                const isVerified = slot.status === 'VERIFIED'
                return (
                  <div key={slot.id} className="flex items-start justify-between p-3.5 rounded-xl border border-white/5 bg-[#103a27]/40">
                    <div className="flex items-start gap-2.5">
                      <FileText className="size-4.5 text-[#a4cc44] mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-white">{slot.label}</p>
                        <p className="text-[0.65rem] text-gray-300 mt-0.5">{slot.hint}</p>
                      </div>
                    </div>
                    <div>
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[0.6rem] font-bold text-emerald-300 border border-emerald-500/20">
                          <CheckCircle2 className="size-3" />
                          VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-1 text-[0.6rem] font-bold text-amber-300 border border-amber-500/20">
                          <Clock className="size-3" />
                          PENDING UPLOAD
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Uploaded so far (Dark Green) */}
        <div className="space-y-6 md:col-span-5">
          <div className="bg-[#0d2a1c] rounded-2xl border border-white/10 p-6 shadow-xl space-y-4 min-h-[400px] flex flex-col text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-serif text-base font-bold text-[#a4cc44]">Uploaded Log</h3>
              <span className="text-[0.65rem] font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md">
                {uploadedFiles.length} Uploaded
              </span>
            </div>

            {uploadedFiles.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                <AlertCircle className="size-10 text-white/20 mb-2" />
                <p className="text-xs font-bold text-white">No documents uploaded yet</p>
                <p className="text-[0.65rem] text-gray-300 mt-0.5">Please upload files to complete compliance.</p>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-white/5 overflow-y-auto space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="pt-3 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="size-9 rounded-xl bg-white/5 text-[#a4cc44] flex items-center justify-center shrink-0">
                        <FileText className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate max-w-[150px]" title={file.fileName}>
                          {file.fileName}
                        </p>
                        <p className="text-[0.65rem] font-medium text-gray-300 mt-0.5">{file.label}</p>
                        <p className="text-[0.55rem] text-gray-400 mt-1">{file.size} • {file.uploadedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => alert(`Downloading ${file.fileName}...`)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 transition-colors"
                        title="Download file"
                      >
                        <Download className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id, file.slotId)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {pendingSlots.length > 0 && (
              <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-start gap-2 text-[0.65rem] text-amber-200 leading-relaxed">
                <AlertCircle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold">Missing Compliance Files: </span>
                  You still need to upload documents for {pendingSlots.map(s => s.label).join(', ')}.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
