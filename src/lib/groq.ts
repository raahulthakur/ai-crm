import Groq from 'groq-sdk'
import { WHATSAPP_DRAFT_SYSTEM_PROMPT, buildWhatsAppPrompt, INSIGHTS_SYSTEM_PROMPT } from '@/config/aiPrompts'
import type { AIInsight } from '@/types'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true,
})

export async function draftWhatsAppMessage(params: {
  contactName: string
  contactRole: string
  dealName: string
  arrValue: string
  stuckReason: string
  lastActivity: string
}): Promise<string> {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    return `Hi Priya,\n\nQuick check-in - any updates from Rahul on the budget discussion? I know the team is excited to get started.\n\nAlso, IT Security mentioned needing DPDP compliance docs. I have those ready to send whenever you need.\n\nHappy to jump on a quick call if helpful!`
  }
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: WHATSAPP_DRAFT_SYSTEM_PROMPT },
      { role: 'user', content: buildWhatsAppPrompt(params) },
    ],
    max_tokens: 200,
    temperature: 0.7,
  })
  return completion.choices[0]?.message?.content ?? ''
}

export async function generateDealInsights(dealContext: {
  name: string
  stage: string
  health_score: number
  days_in_stage: number
  stuck_reason?: string
  contacts: Array<{ name: string; role: string; status: string; days_silent?: number }>
}, dealId: string): Promise<AIInsight[]> {
  if (!import.meta.env.VITE_GROQ_API_KEY) return []

  const prompt = `Analyze this deal and generate 4 AI insights:
Deal: ${dealContext.name}, Stage: ${dealContext.stage}, Health: ${dealContext.health_score}%, Days stuck: ${dealContext.days_in_stage}
Contacts: ${dealContext.contacts.map(c => `${c.name} (${c.role}, ${c.status})`).join(', ')}`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: INSIGHTS_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    max_tokens: 600,
    temperature: 0.5,
  })
  const raw = completion.choices[0]?.message?.content ?? '[]'
  try {
    const parsed = JSON.parse(raw.replace(/```json?\n?/g, '').replace(/```/g, ''))
    return parsed.map((item: { category: string; title: string; body: string; confidence: number }, i: number) => ({
      id: `ai-${Date.now()}-${i}`,
      deal_id: dealId,
      category: item.category,
      title: item.title,
      body: item.body,
      confidence: item.confidence,
      model_used: 'groq/llama-3.3-70b-versatile',
      is_dismissed: false,
      is_actioned: false,
      generated_at: new Date().toISOString(),
    }))
  } catch {
    return []
  }
}
