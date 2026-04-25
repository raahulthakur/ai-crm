import { useRef, useState } from 'react'
import { FileText, Upload, X, Send, CheckCircle2, User } from 'lucide-react'
import { useUIStore, useAIStore } from '@/store'

interface Props {
  actionId: string
}

export function SendDocModal({ actionId }: Props) {
  const { sendDocModalOpen, closeSendDocModal } = useUIStore()
  const { completeAction } = useAIStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [extraFile, setExtraFile] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  if (!sendDocModalOpen) return null

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setExtraFile(file.name)
  }

  function handleSend() {
    setSent(true)
    setTimeout(() => {
      completeAction(actionId)
      closeSendDocModal()
      setSent(false)
      setExtraFile(null)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl animate-bounce-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100">
              <FileText className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Send DPDP Compliance Document</p>
              <p className="text-xs text-gray-500">IT Security approval required</p>
            </div>
          </div>
          <button onClick={closeSendDocModal} className="rounded-lg p-1 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Attached document */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-600">Attached Document</p>
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100">
                <FileText className="h-4 w-4 text-teal-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-gray-900">DPDP_compliance_doc.pdf</p>
                <p className="text-[10px] text-gray-500">Compliance certification · 2026</p>
              </div>
              <span className="shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-medium text-teal-700">Ready</span>
            </div>

            {/* Extra uploaded file */}
            {extraFile && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <FileText className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                <span className="text-xs text-gray-700 truncate flex-1">{extraFile}</span>
                <button onClick={() => setExtraFile(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Upload from device */}
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
            <button onClick={() => fileRef.current?.click()}
              className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700">
              <Upload className="h-3.5 w-3.5" /> Upload additional file from device
            </button>
          </div>

          {/* Recipients */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-600">Recipients</p>
            <div className="space-y-1.5">
              {[
                { name: 'Neha Kapoor', role: 'IT Security Lead', email: 'security@abccorp.com' },
              ].map((r) => (
                <div key={r.email} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-700 shrink-0">NK</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900">{r.name}</p>
                    <p className="text-[10px] text-gray-500">{r.role} · {r.email}</p>
                  </div>
                  <User className="h-3 w-3 text-gray-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-gray-100 px-5 py-4">
          <button onClick={closeSendDocModal}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSend} disabled={sent}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 transition-colors">
            {sent ? (
              <><CheckCircle2 className="h-4 w-4" /> Sending…</>
            ) : (
              <><Send className="h-3.5 w-3.5" /> Send Now</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
