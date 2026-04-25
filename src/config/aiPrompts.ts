export const WHATSAPP_DRAFT_SYSTEM_PROMPT = `You are a sales AI assistant helping craft WhatsApp messages for B2B sales reps.
Write concise, warm, professional messages. Max 80 words. No emojis. First person ("Hi [Name],").
Focus on one clear ask. End with an offer to help.`

export function buildWhatsAppPrompt(params: {
  contactName: string
  contactRole: string
  dealName: string
  arrValue: string
  stuckReason: string
  lastActivity: string
}): string {
  return `Draft a WhatsApp follow-up message to ${params.contactName} (${params.contactRole}) about the ${params.dealName} deal (${params.arrValue} ARR).
Context: ${params.stuckReason}. Last touch: ${params.lastActivity}.
Ask Priya for an update on the CFO budget discussion and mention that DPDP compliance docs are ready whenever needed.`
}

export const INSIGHTS_SYSTEM_PROMPT = `You are a CRM AI that analyzes deal data and generates sales insights.
Return a JSON array of 4 insight objects with fields: category (risk|opportunity|compliance|relationship|timeline), title (max 8 words), body (max 40 words), confidence (60-98).
Return ONLY valid JSON, no markdown fences.`

export function buildInsightsPrompt(deal: {
  name: string
  stage: string
  health_score: number
  days_in_stage: number
  stuck_reason?: string
  contacts: Array<{ name: string; role: string; status: string; days_silent?: number }>
}): string {
  return `Analyze this deal and generate 4 AI insights:
Deal: ${deal.name}, Stage: ${deal.stage}, Health: ${deal.health_score}%, Days stuck: ${deal.days_in_stage}
Stuck reason: ${deal.stuck_reason}
Contacts: ${deal.contacts.map(c => `${c.name} (${c.role}, ${c.status}${c.days_silent ? `, ${c.days_silent}d silent` : ''})`).join(', ')}`
}
