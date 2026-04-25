export type DealStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
export type ContactRole = 'economic_buyer' | 'champion' | 'blocker' | 'influencer' | 'end_user' | 'technical_evaluator'
export type ContactStatus = 'not_contacted' | 'engaged' | 'champion' | 'blocked' | 'neutral' | 'unresponsive'
export type ActivityType = 'email_sent' | 'email_received' | 'whatsapp_sent' | 'whatsapp_received' | 'call_completed' | 'meeting_booked' | 'document_sent' | 'ai_insight_generated' | 'score_updated' | 'note_added'
export type MessageChannel = 'whatsapp' | 'email' | 'sms'
export type MessageDirection = 'outbound' | 'inbound'
export type MessageStatus = 'draft' | 'sent' | 'delivered' | 'read' | 'replied' | 'skipped'
export type InsightCategory = 'risk' | 'opportunity' | 'relationship' | 'competitive' | 'timeline' | 'compliance'
export type ActionPriority = 'critical' | 'high' | 'medium' | 'low'
export type DocumentType = 'proposal' | 'contract' | 'compliance_doc' | 'case_study' | 'nda' | 'pricing_sheet'

export interface Deal {
  id: string
  name: string
  company_name: string
  arr_value: number
  stage: DealStage
  health_score: number
  health_score_prev?: number
  days_in_stage: number
  close_date?: string
  owner_name?: string
  is_stuck: boolean
  stuck_reason?: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  full_name: string
  email?: string
  phone?: string
  job_title?: string
  company_name?: string
  avatar_url?: string
  last_contacted_at?: string
}

export interface DealContact {
  id: string
  deal_id: string
  contact_id: string
  role: ContactRole
  status: ContactStatus
  influence_weight: number
  reports_to?: string
  is_key_blocker: boolean
  is_champion: boolean
  notes?: string
  contact: Contact
}

export interface Activity {
  id: string
  deal_id: string
  contact_id?: string
  type: ActivityType
  title: string
  description?: string
  metadata?: Record<string, unknown>
  occurred_at: string
  created_by?: string
  contact?: Contact
}

export interface AIInsight {
  id: string
  deal_id: string
  category: InsightCategory
  title: string
  body: string
  confidence: number
  hide_confidence?: boolean
  model_used?: string
  is_dismissed: boolean
  is_actioned: boolean
  generated_at: string
}

export interface AIRecommendedAction {
  id: string
  deal_id: string
  insight_id?: string
  priority: ActionPriority
  title: string
  description: string
  action_type: string
  target_contact_id?: string
  due_date?: string
  is_completed: boolean
  metadata?: Record<string, unknown>
  target_contact?: Contact
}

export interface Message {
  id: string
  deal_id: string
  contact_id?: string
  channel: MessageChannel
  direction: MessageDirection
  status: MessageStatus
  body: string
  ai_drafted: boolean
  sent_at?: string
  contact?: Contact
}

export interface Document {
  id: string
  deal_id: string
  name: string
  type: DocumentType
  file_url?: string
  sent_to?: string[]
  sent_at?: string
}
