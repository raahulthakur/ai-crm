import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCheck, ArrowRight, TrendingUp, Zap } from 'lucide-react'
import { useMessageStore, useDealStore, useAIStore, useActivityStore } from '@/store'
import { Avatar } from '@/components/shared/Avatar'
import { ScoreRing } from '@/components/split-view/ScoreRing'
import { AIInsightsPanel } from '@/components/deal-room/AIInsightsPanel'
import { RecommendedActions } from '@/components/deal-room/RecommendedActions'
import { DEAL_ID, contacts } from '@/data/mockData'

const PRIYA = contacts[2]

const PRIYA_REPLY = "Actually yes! Great news - Rahul approved the budget yesterday! 🎉\n\nJust need to send DPDP compliance to IT Security and we're good to go.\n\nCan you send that today?"

export function SplitViewPage() {
  const { messages, appendMessage } = useMessageStore()
  const { updateDealScore, unstickDeal, activeDeal, deals, setActiveDeal } = useDealStore()
  const { updatePostBreakthrough } = useAIStore()
  const { addActivity } = useActivityStore()
  const navigate = useNavigate()

  const [isTyping, setIsTyping] = useState(false)
  const [breakthrough, setBreakthrough] = useState(false)
  const [scoreFrom, setScoreFrom] = useState(68)
  const [scoreTo, setScoreTo] = useState(68)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeDeal) {
      const d = deals.find((d) => d.id === DEAL_ID)
      if (d) setActiveDeal(d)
    }
  }, [])

  // Simulate Priya's reply after 3 seconds
  useEffect(() => {
    const t1 = setTimeout(() => setIsTyping(true), 2500)
    const t2 = setTimeout(() => {
      setIsTyping(false)
      appendMessage({
        id: `msg-priya-reply`,
        deal_id: DEAL_ID,
        contact_id: PRIYA.id,
        channel: 'whatsapp',
        direction: 'inbound',
        status: 'read',
        body: PRIYA_REPLY,
        ai_drafted: false,
        sent_at: new Date().toISOString(),
        contact: PRIYA,
      })
      // Trigger breakthrough
      setTimeout(() => {
        setScoreFrom(68)
        setScoreTo(90)
        setBreakthrough(true)
        updateDealScore(DEAL_ID, 90)
        unstickDeal(DEAL_ID)
        updatePostBreakthrough()
        addActivity({
          id: `act-score-update-${Date.now()}`,
          deal_id: DEAL_ID,
          type: 'score_updated',
          title: 'AI health score updated: 68% → 90%',
          description: 'CFO budget approved via Priya — primary financial blocker removed',
          occurred_at: new Date().toISOString(),
          created_by: 'ai_system',
          metadata: { score_before: 68, score_after: 90 },
        })
        addActivity({
          id: `act-wa-received-${Date.now()}`,
          deal_id: DEAL_ID,
          contact_id: PRIYA.id,
          type: 'whatsapp_received',
          title: 'Priya: CFO approved budget!',
          description: '"Rahul approved the budget yesterday! Just need DPDP compliance for IT Security."',
          occurred_at: new Date().toISOString(),
          created_by: PRIYA.email,
          contact: PRIYA,
        })
      }, 500)
    }, 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex h-full overflow-hidden">
      {/* LEFT: WhatsApp conversation */}
      <div className="flex w-1/2 flex-col border-r border-gray-200">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-gray-200 bg-[#075E54] px-4 py-3">
          <Avatar name={PRIYA.full_name} size="lg" />
          <div>
            <p className="text-sm font-semibold text-white">{PRIYA.full_name}</p>
            <p className="text-xs text-green-200">{PRIYA.job_title} · ABC Corp</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-[#ECE5DD] p-4 space-y-2">
          {messages.map((msg) => {
            const isOut = msg.direction === 'outbound'
            return (
              <div key={msg.id} className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                {!isOut && (
                  <Avatar name={PRIYA.full_name} size="sm" className="mr-2 mt-1 shrink-0" />
                )}
                <div className={`max-w-[75%] px-3 py-2 shadow-sm ${isOut ? 'chat-bubble-out' : 'chat-bubble-in'}`}>
                  <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{msg.body}</p>
                  <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] text-gray-400`}>
                    <span>{new Date(msg.sent_at ?? '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isOut && <CheckCheck className="h-3 w-3 text-blue-500" />}
                  </div>
                </div>
              </div>
            )
          })}

          {isTyping && (
            <div className="flex items-center gap-2">
              <Avatar name={PRIYA.full_name} size="sm" className="shrink-0" />
              <div className="chat-bubble-in px-4 py-3">
                <div className="flex gap-1">
                  <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* RIGHT: Deal score panel */}
      <div className="flex w-1/2 flex-col overflow-y-auto bg-white">
        <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">ABC Corp · Live Deal Update</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Score ring */}
          <div className={`rounded-xl border p-5 text-center transition-all ${breakthrough ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
            {breakthrough && (
              <div className="mb-3 flex items-center justify-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700 animate-bounce-in">
                <Zap className="h-4 w-4" /> BREAKTHROUGH DETECTED
              </div>
            )}
            <div className="flex items-center justify-center gap-6">
              <ScoreRing from={scoreFrom} to={scoreTo} size={120} />
              {breakthrough && (
                <div className="text-left animate-fade-in">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-semibold">+22 points</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">in last 5 minutes</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-gray-700">CFO approved budget</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span className="text-gray-700">DPDP compliance pending</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {!breakthrough && (
              <p className="mt-3 text-xs text-gray-500">Analyzing response...</p>
            )}
          </div>

          {/* Post-breakthrough actions */}
          {breakthrough && (
            <div className="animate-fade-in space-y-4">
              <AIInsightsPanel />
              <div className="border-t border-gray-100 pt-4">
                <RecommendedActions />
              </div>
              <button onClick={() => navigate(`/deals/${DEAL_ID}/victory`)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                View Updated Deal Room <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
