import { create } from 'zustand'
import type { Deal, AIInsight, AIRecommendedAction, Contact, Message, Activity } from '@/types'
import { deals as mockDeals, insights as mockInsights, actions as mockActions, activities as mockActivities, priyaMessages } from '@/data/mockData'

interface DealState {
  deals: Deal[]
  activeDeal: Deal | null
  setActiveDeal: (deal: Deal) => void
  addDeal: (deal: Deal) => void
  updateDealScore: (id: string, score: number) => void
  unstickDeal: (id: string) => void
  updateContactStatus: (dealId: string, contactId: string, status: string) => void
}

export const useDealStore = create<DealState>((set) => ({
  deals: mockDeals,
  activeDeal: null,
  setActiveDeal: (deal) => set({ activeDeal: deal }),
  addDeal: (deal) => set((s) => ({ deals: [deal, ...s.deals] })),
  updateDealScore: (id, score) =>
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === id ? { ...d, health_score_prev: d.health_score, health_score: score } : d
      ),
      activeDeal: state.activeDeal?.id === id
        ? { ...state.activeDeal, health_score_prev: state.activeDeal.health_score, health_score: score }
        : state.activeDeal,
    })),
  unstickDeal: (id) =>
    set((s) => ({
      deals: s.deals.map((d) =>
        d.id === id ? { ...d, is_stuck: false, stuck_reason: undefined } : d
      ),
      activeDeal: s.activeDeal?.id === id
        ? { ...s.activeDeal, is_stuck: false, stuck_reason: undefined }
        : s.activeDeal,
    })),
  updateContactStatus: (_dealId, _contactId, _status) => set({}),
}))

interface AIState {
  insights: AIInsight[]
  actions: AIRecommendedAction[]
  isLoadingInsights: boolean
  isGeneratingMessage: boolean
  draftedMessage: string
  setInsights: (insights: AIInsight[]) => void
  addInsight: (insight: AIInsight) => void
  dismissInsight: (id: string) => void
  setActions: (actions: AIRecommendedAction[]) => void
  completeAction: (id: string) => void
  setDraftedMessage: (text: string) => void
  setLoadingInsights: (v: boolean) => void
  setGeneratingMessage: (v: boolean) => void
  updatePostBreakthrough: () => void
}

export const useAIStore = create<AIState>((set) => ({
  insights: mockInsights,
  actions: mockActions,
  isLoadingInsights: false,
  isGeneratingMessage: false,
  draftedMessage: '',
  setInsights: (insights) => set({ insights }),
  addInsight: (insight) => set((s) => ({ insights: [...s.insights, insight] })),
  dismissInsight: (id) => set((s) => ({ insights: s.insights.filter((i) => i.id !== id) })),
  setActions: (actions) => set({ actions }),
  completeAction: (id) =>
    set((s) => ({ actions: s.actions.map((a) => a.id === id ? { ...a, is_completed: true } : a) })),
  setDraftedMessage: (text) => set({ draftedMessage: text }),
  setLoadingInsights: (v) => set({ isLoadingInsights: v }),
  setGeneratingMessage: (v) => set({ isGeneratingMessage: v }),
  updatePostBreakthrough: () =>
    set({
      insights: [
        { id: 'ins-post1', deal_id: 'abc-corp-deal-001', category: 'opportunity', title: 'CFO approved budget — deal unblocked!', body: 'Rahul Mehta confirmed budget approval via Priya. This removes the primary financial blocker. Deal now 90% likely to close.', confidence: 96, model_used: 'groq/llama-3.3-70b-versatile', is_dismissed: false, is_actioned: false, generated_at: new Date().toISOString() },
        { id: 'ins-post2', deal_id: 'abc-corp-deal-001', category: 'compliance', title: 'DPDP compliance still needed for IT Security', body: 'IT Security lead Neha Kapoor is the last remaining blocker. DPDP doc must be sent today to close this week.', confidence: 95, model_used: 'groq/llama-3.3-70b-versatile', is_dismissed: false, is_actioned: false, generated_at: new Date().toISOString() },
        { id: 'ins-post3', deal_id: 'abc-corp-deal-001', category: 'timeline', title: 'Close this week if DPDP sent today', body: 'Based on deal velocity and stakeholder engagement, closing is achievable by Friday if compliance docs are sent immediately.', confidence: 81, model_used: 'groq/llama-3.3-70b-versatile', is_dismissed: false, is_actioned: false, generated_at: new Date().toISOString() },
      ],
      actions: [
        { id: 'post-action1', deal_id: 'abc-corp-deal-001', priority: 'critical' as const, title: 'Book ROI call with CFO Rahul', description: 'Priya confirmed CFO approved. Book a 30-min call with Rahul to thank him and align on implementation timeline.', action_type: 'book_meeting', target_contact_id: 'c002', is_completed: false, target_contact: { id: 'c002', full_name: 'Rahul Mehta', job_title: 'CFO', company_name: 'ABC Corp', email: 'rahul.mehta@abccorp.com' } },
        { id: 'post-action2', deal_id: 'abc-corp-deal-001', priority: 'critical' as const, title: 'Send DPDP compliance to all 3 stakeholders', description: 'Send DPDP_compliance_doc.pdf to Priya, Rahul, and IT Security to clear final blocker.', action_type: 'send_doc', target_contact_id: 'c005', is_completed: false, target_contact: { id: 'c005', full_name: 'Neha Kapoor', job_title: 'IT Security Lead', company_name: 'ABC Corp' } },
      ],
    }),
}))

interface UIState {
  whatsAppModalOpen: boolean
  whatsAppTarget: Contact | null
  sendDocModalOpen: boolean
  sendDocActionId: string | null
  openWhatsAppModal: (contact: Contact) => void
  closeWhatsAppModal: () => void
  openSendDocModal: (actionId: string) => void
  closeSendDocModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  whatsAppModalOpen: false,
  whatsAppTarget: null,
  sendDocModalOpen: false,
  sendDocActionId: null,
  openWhatsAppModal: (contact) => set({ whatsAppModalOpen: true, whatsAppTarget: contact }),
  closeWhatsAppModal: () => set({ whatsAppModalOpen: false, whatsAppTarget: null }),
  openSendDocModal: (actionId) => set({ sendDocModalOpen: true, sendDocActionId: actionId }),
  closeSendDocModal: () => set({ sendDocModalOpen: false, sendDocActionId: null }),
}))

interface MessageState {
  messages: Message[]
  isSending: boolean
  appendMessage: (msg: Message) => void
  setSending: (v: boolean) => void
  initPriyaConversation: () => void
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  isSending: false,
  appendMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setSending: (v) => set({ isSending: v }),
  initPriyaConversation: () =>
    set({
      messages: priyaMessages.map((m, i) => ({
        id: `pm-${i}`,
        deal_id: 'abc-corp-deal-001',
        contact_id: 'c003',
        channel: 'whatsapp' as const,
        direction: m.direction,
        status: 'read' as const,
        body: m.body,
        ai_drafted: false,
        sent_at: m.sent_at,
      })),
    }),
}))

interface ActivityState {
  activities: Activity[]
  addActivity: (a: Activity) => void
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: mockActivities,
  addActivity: (a) => set((s) => ({ activities: [a, ...s.activities] })),
}))
