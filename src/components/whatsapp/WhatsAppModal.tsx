import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Edit3, X, Send, Bot, Loader2, RefreshCw } from 'lucide-react'
import { useUIStore, useAIStore, useMessageStore, useDealStore } from '@/store'
import { Avatar } from '@/components/shared/Avatar'
import { draftWhatsAppMessage } from '@/lib/groq'
import { DEAL_ID } from '@/data/mockData'

const VARIATIONS = [
  `Hi Priya,

Quick check-in - any updates from Rahul on the budget discussion? I know the team is excited to get started.

Also, IT Security mentioned needing DPDP compliance docs. I have those ready to send whenever you need.

Happy to jump on a quick call if helpful!`,

  `Hi Priya! Hope you're well.

Wanted to check where things stand with the CFO approval — any movement there? The team's enthusiasm has been great to see.

Also wanted to let you know our DPDP compliance docs are ready for IT Security whenever needed. Let me know how I can help move things forward!`,

  `Hey Priya,

Following up on the ABC Corp proposal. Has Rahul had a chance to review the budget? We're excited to get started.

Also wanted to mention — DPDP compliance documentation is all set for the IT Security team. Just say the word and I'll send it over.`,
]

export function WhatsAppModal() {
  const { whatsAppModalOpen, whatsAppTarget, closeWhatsAppModal } = useUIStore()
  const { setDraftedMessage, setGeneratingMessage, isGeneratingMessage } = useAIStore()
  const { appendMessage, initPriyaConversation } = useMessageStore()
  const { activeDeal } = useDealStore()
  const navigate = useNavigate()

  const [variationIdx, setVariationIdx] = useState(0)
  const [editedMessage, setEditedMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    if (!whatsAppModalOpen || !whatsAppTarget || !activeDeal) return
    setVariationIdx(0)
    setEditedMessage(VARIATIONS[0])
    setIsEditing(false)

    async function generate() {
      setGeneratingMessage(true)
      try {
        const msg = await draftWhatsAppMessage({
          contactName: whatsAppTarget!.full_name,
          contactRole: whatsAppTarget!.job_title ?? 'Contact',
          dealName: activeDeal!.company_name,
          arrValue: `$${(activeDeal!.arr_value / 1000).toFixed(0)}K`,
          stuckReason: activeDeal!.stuck_reason ?? 'deal stalled',
          lastActivity: '12 days ago',
        })
        if (msg) {
          setDraftedMessage(msg)
          setEditedMessage(msg)
        }
      } catch {
        /* use static variation */
      } finally {
        setGeneratingMessage(false)
      }
    }

    if (import.meta.env.VITE_GROQ_API_KEY) {
      generate()
    }
  }, [whatsAppModalOpen, whatsAppTarget?.id])

  function handleRegenerate() {
    setIsRegenerating(true)
    setTimeout(() => {
      const next = (variationIdx + 1) % VARIATIONS.length
      setVariationIdx(next)
      setEditedMessage(VARIATIONS[next])
      setIsRegenerating(false)
    }, 600)
  }

  function handleSend() {
    if (!whatsAppTarget) return
    const msg = {
      id: `msg-out-${Date.now()}`,
      deal_id: DEAL_ID,
      contact_id: whatsAppTarget.id,
      channel: 'whatsapp' as const,
      direction: 'outbound' as const,
      status: 'sent' as const,
      body: editedMessage,
      ai_drafted: true,
      sent_at: new Date().toISOString(),
    }
    initPriyaConversation()
    appendMessage(msg)
    closeWhatsAppModal()
    navigate(`/deals/${DEAL_ID}/conversation`)
  }

  if (!whatsAppModalOpen || !whatsAppTarget) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl animate-bounce-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100">
              <MessageSquare className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">AI Recommended Action</p>
              <p className="text-xs text-gray-500">WhatsApp Follow-Up</p>
            </div>
          </div>
          <button onClick={closeWhatsAppModal} className="rounded-lg p-1 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* To */}
        <div className="border-b border-gray-100 px-5 py-3">
          <p className="mb-2 text-xs font-medium text-gray-500">TO</p>
          <div className="flex items-center gap-3">
            <Avatar name={whatsAppTarget.full_name} size="lg" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{whatsAppTarget.full_name}</p>
              <p className="text-xs text-gray-500">{whatsAppTarget.job_title} · ABC Corp</p>
              <p className="text-xs text-green-600 font-medium">Champion — can nudge CFO internally</p>
            </div>
          </div>
        </div>

        {/* Draft */}
        <div className="px-5 py-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5 text-blue-500" />
              <p className="text-xs font-medium text-gray-700">AI Drafted Message</p>
              <span className="text-[10px] text-gray-400">· Variation {variationIdx + 1} of {VARIATIONS.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleRegenerate} disabled={isRegenerating || isGeneratingMessage}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50">
                <RefreshCw className={`h-3 w-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
              <button onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <Edit3 className="h-3 w-3" /> {isEditing ? 'Done' : 'Edit'}
              </button>
            </div>
          </div>

          {isGeneratingMessage || isRegenerating ? (
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              {isRegenerating ? 'Getting next variation…' : 'AI is drafting your message…'}
            </div>
          ) : isEditing ? (
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              rows={7}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
            />
          ) : (
            <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-sm text-gray-800 whitespace-pre-line leading-relaxed min-h-[120px]">
              {editedMessage}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-gray-100 px-5 py-4">
          <button onClick={closeWhatsAppModal}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Skip
          </button>
          <button onClick={handleSend} disabled={isGeneratingMessage}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
            <Send className="h-3.5 w-3.5" /> Send Now
          </button>
        </div>
      </div>
    </div>
  )
}
