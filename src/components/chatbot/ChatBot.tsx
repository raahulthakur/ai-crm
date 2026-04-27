import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Mic,
  MicOff,
  Send,
  Zap,
  CheckCircle2,
  XCircle,
  BarChart3,
  TrendingUp,
  Edit3,
} from 'lucide-react';
import { useDealStore } from '@/store';
import { WaveformAnimation } from './WaveformAnimation';
import { formatCurrency } from '@/lib/utils';
import type { Deal, DealStage } from '@/types';
import {
  dealContacts,
  contacts,
  activities as mockActivities,
  insights as mockInsights,
} from '@/data/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingDeal {
  company_name: string;
  arr_value: number;
  stage: DealStage;
  health_score: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  pendingDeal?: PendingDeal;
  listDeals?: Deal[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Natural language voice-to-text samples — 8 varied prompts, real Indian companies
const VOICE_SAMPLES = [
  "Hey, just got off a call with Razorpay. They want to move forward — about 65 lakhs ARR, currently in negotiation",
  "Add Freshworks to the pipeline. We had a great demo, they're at proposal stage, roughly 120 lakhs",
  "New deal — Zoho Corp. They've verbally committed, 80 lakhs ARR, still in discovery stage",
  "Got a warm lead at PhonePe. 95 lakhs, negotiation stage, need to follow up this week",
  "Just had a great call with Meesho. Create a new deal — 55 lakhs, proposal stage. Very promising!",
  "Add Zepto to the pipeline — about 70 lakhs ARR, they're in qualification stage. CTO is excited",
  "Just spoke with CRED's procurement team. New deal, 140 lakhs potential, early discovery phase",
  "Swiggy wants to move forward! Add a new deal, 85 lakhs ARR, they're at proposal stage now",
];

const GREETING = `Hi! I'm your **CloseLoop AI** assistant. I can help you:
• **Add deals** — "Add deal for Acme Corp, $650K, negotiation"
• **Query anything** — "What is the ARR of Razorpay?"
• **Find contacts** — "Who is the champion for Razorpay?"
• **Search data** — "Which deals are stuck?" · "Total pipeline value?"
• **List deals** — "Show all deals"

Or tap the **mic** to use voice.`;

const STAGE_MAP: Record<string, DealStage> = {
  negotiation: 'negotiation',
  contract: 'negotiation',
  proposal: 'proposal',
  qualify: 'qualification',
  qualification: 'qualification',
  discovery: 'qualification',
  prospect: 'prospecting',
  prospecting: 'prospecting',
  closed: 'closed_won',
  won: 'closed_won',
};

const STAGE_LABELS: Record<DealStage, string> = {
  prospecting: 'Prospecting',
  qualification: 'Discovery',
  proposal: 'Proposal Sent',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

const ALL_STAGES: DealStage[] = [
  'prospecting',
  'qualification',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
];

// ─── Intent Parser ─────────────────────────────────────────────────────────

type ParseResult =
  | { kind: 'create'; deal: PendingDeal }
  | { kind: 'list'; deals: Deal[] }
  | { kind: 'query'; reply: string }
  | { kind: 'fallback' };

function findDeal(lower: string, deals: Deal[]): Deal | undefined {
  return deals.find((d) =>
    lower.includes(d.company_name.toLowerCase().split(' ')[0]),
  );
}

function parseIntent(text: string, deals: Deal[]): ParseResult {
  const lower = text.toLowerCase();

  // ── Create deal — checked FIRST before any contact queries ────────────
  // Broad trigger: explicit commands OR natural phrases like "warm lead", "just spoke with"
  if (/\b(add|create|new deal|log|enter|warm lead|just got off|just spoke|just had|follow up this week|new pipeline)\b/.test(lower)) {
    // Company extraction: try patterns in priority order
    let companyName = 'New Company'

    // P1: "at/with/for [Capitalized]" — handles "at PhonePe", "with Razorpay"
    const atMatch = text.match(/\b(?:at|with|for)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\b/)
    if (atMatch?.[1] && !['The', 'A', 'An', 'Our', 'My', 'This'].includes(atMatch[1])) {
      companyName = atMatch[1].trim()
    } else {
      // P2: "company/deal [Name]" before comma or ARR keyword
      const kwMatch = text.match(/(?:company|deal[,\s]+)\s*([A-Za-z][A-Za-z\s&.']+?)(?=\s*,|\s+(?:ARR|value|arr|lakh|\d))/i)
      if (kwMatch?.[1]) {
        companyName = kwMatch[1].trim()
      } else {
        // P3: Known company suffixes
        const sfxMatch = text.match(/\b([A-Z][a-zA-Z\s&.']+(?:Corp|Inc|Ltd|Solutions|India|Technologies|Tech|Pvt|Pay|works))\b/)
        if (sfxMatch?.[1]) {
          companyName = sfxMatch[1].trim()
        } else {
          // P4: First capitalized word right after "Add" or "Create"
          const addMatch = text.match(/\b(?:Add|Create)\s+([A-Z][a-zA-Z]+)\b/)
          if (addMatch?.[1]) companyName = addMatch[1].trim()
        }
      }
    }

    // ARR: handle "lakhs" (×100000) and plain numbers
    const arrMatches = [...text.matchAll(/([0-9][0-9,]*)/g)]
    const rawNum = arrMatches.map((m) => parseInt(m[1].replace(/,/g, ''))).find((n) => n >= 1) ?? 50
    const isLakh = /lakh/i.test(lower)
    const arrNum = isLakh ? rawNum * 100000 : rawNum < 1000 ? rawNum * 1000 : rawNum

    const stageMatch = Object.keys(STAGE_MAP).find((k) => lower.includes(k))

    return {
      kind: 'create',
      deal: {
        company_name: companyName,
        arr_value: arrNum,
        stage: stageMatch ? STAGE_MAP[stageMatch] : 'qualification',
        health_score: Math.floor(Math.random() * 30) + 60,
      },
    }
  }

  // ── List all deals ─────────────────────────────────────────────────────
  if (/\b(list|show all|all deals|overview)\b/.test(lower)) {
    return { kind: 'list', deals };
  }

  // ── Total pipeline ─────────────────────────────────────────────────────
  if (/\b(total|pipeline value|sum|portfolio|forecast)\b/.test(lower)) {
    const total = deals.reduce((s, d) => s + d.arr_value, 0);
    const byStage = ALL_STAGES.map((s) => ({
      stage: s,
      count: deals.filter((d) => d.stage === s).length,
    }))
      .filter((x) => x.count > 0)
      .map(
        (x) =>
          `• ${STAGE_LABELS[x.stage]}: ${x.count} deal${x.count > 1 ? 's' : ''}`,
      )
      .join('\n');
    return {
      kind: 'query',
      reply: `**Total pipeline: ${formatCurrency(total)} ARR** across ${deals.length} deals.\n\n${byStage}`,
    };
  }

  // ── Stuck / blocked ────────────────────────────────────────────────────
  if (/\b(stuck|blocked|at risk|need attention|overdue)\b/.test(lower)) {
    const stuck = deals.filter((d) => d.is_stuck);
    if (!stuck.length)
      return {
        kind: 'query',
        reply: 'No deals are stuck right now — great work! 🎉',
      };
    return {
      kind: 'query',
      reply: `**${stuck.length} deal${stuck.length > 1 ? 's' : ''} need attention:**\n${stuck.map((d) => `• **${d.company_name}** — ${d.stuck_reason}`).join('\n')}`,
    };
  }

  // ── Healthy deals ──────────────────────────────────────────────────────
  if (/\b(healthy|green|best deals?|top deals?)\b/.test(lower)) {
    const healthy = [...deals]
      .filter((d) => d.health_score >= 80)
      .sort((a, b) => b.health_score - a.health_score);
    if (!healthy.length)
      return { kind: 'query', reply: 'No deals above 80% health currently.' };
    return {
      kind: 'query',
      reply: `**Healthy deals (≥80%):**\n${healthy.map((d) => `• **${d.company_name}** — ${d.health_score}%`).join('\n')}`,
    };
  }

  // ── Contacts / champion / who ──────────────────────────────────────────
  if (/\b(champion|who is|contact|ceo|cfo|cto|vp|head of|team lead)\b/.test(lower)) {
    // Role-based search
    const roleKeywords: Record<string, string[]> = {
      champion: ['champion', 'advocate'],
      ceo: ['ceo', 'chief executive'],
      cfo: ['cfo', 'chief financial'],
      'it security': ['it security', 'security'],
      'vp marketing': ['vp marketing', 'marketing'],
      'team lead': ['team lead', 'lead'],
    };
    for (const [role, keywords] of Object.entries(roleKeywords)) {
      if (keywords.some((k) => lower.includes(k))) {
        const found = dealContacts.find(
          (dc) =>
            dc.contact.job_title?.toLowerCase().includes(role) ||
            (dc.is_champion && lower.includes('champion')),
        );
        if (found) {
          const c = found.contact;
          return {
            kind: 'query',
            reply: `**${c.full_name}** is the **${c.job_title}** at ${c.company_name}.\nEmail: ${c.email ?? 'N/A'}\nStatus: ${found.status}`,
          };
        }
      }
    }
    // Name-based search
    const namedContact = contacts.find((c) =>
      lower.includes(c.full_name.split(' ')[0].toLowerCase()),
    );
    if (namedContact) {
      const dc = dealContacts.find((x) => x.contact_id === namedContact.id);
      return {
        kind: 'query',
        reply: `**${namedContact.full_name}** — ${namedContact.job_title} at ${namedContact.company_name}\nEmail: ${namedContact.email ?? 'N/A'}\nRole: ${dc?.role ?? 'N/A'} · Status: ${dc?.status ?? 'N/A'}`,
      };
    }
    return {
      kind: 'query',
      reply: `Try: "Who is the champion for Razorpay?" or "Contact info for Priya"`,
    };
  }

  // ── Contacts list ──────────────────────────────────────────────────────
  if (
    /\b(contacts?|team|stakeholders?|people|buying committee)\b/.test(lower)
  ) {
    const deal = findDeal(lower, deals);
    const dcs = dealContacts.filter((dc) => !deal || dc.deal_id === deal?.id);
    if (!dcs.length)
      return { kind: 'query', reply: 'No contacts found for that deal.' };
    return {
      kind: 'query',
      reply: `**Contacts${deal ? ` for ${deal.company_name}` : ''}:**\n${dcs.map((dc) => `• **${dc.contact.full_name}** (${dc.contact.job_title}) — ${dc.status}`).join('\n')}`,
    };
  }

  // ── Activities ─────────────────────────────────────────────────────────
  if (/\b(activit|timeline|recent|last touch|history)\b/.test(lower)) {
    const deal = findDeal(lower, deals);
    const acts = mockActivities
      .filter((a) => !deal || a.deal_id === deal?.id)
      .sort(
        (a, b) =>
          new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime(),
      )
      .slice(0, 4);
    if (!acts.length) return { kind: 'query', reply: 'No activities found.' };
    return {
      kind: 'query',
      reply: `**Recent activities${deal ? ` — ${deal.company_name}` : ''}:**\n${acts.map((a) => `• ${a.title}`).join('\n')}`,
    };
  }

  // ── AI Insights ────────────────────────────────────────────────────────
  if (/\b(insight|risk|opportunit|recommend|ai suggest)\b/.test(lower)) {
    const active = mockInsights.filter((i) => !i.is_dismissed);
    if (!active.length)
      return { kind: 'query', reply: 'No active AI insights at the moment.' };
    return {
      kind: 'query',
      reply: `**AI Insights (${active.length}):**\n${active.map((i) => `• **${i.title}** — ${i.category} (${i.confidence}%)`).join('\n')}`,
    };
  }

  // ── Stage filter ───────────────────────────────────────────────────────
  if (/\b(in|stage|at|deals?)\b/.test(lower)) {
    const stageKey = Object.keys(STAGE_MAP).find((k) => lower.includes(k));
    if (stageKey) {
      const stage = STAGE_MAP[stageKey];
      const filtered = deals.filter((d) => d.stage === stage);
      if (!filtered.length)
        return {
          kind: 'query',
          reply: `No deals in **${STAGE_LABELS[stage]}** stage.`,
        };
      return {
        kind: 'query',
        reply: `**Deals in ${STAGE_LABELS[stage]}:**\n${filtered.map((d) => `• **${d.company_name}** — ${formatCurrency(d.arr_value)}`).join('\n')}`,
      };
    }
  }

  // ── Per-deal queries ───────────────────────────────────────────────────
  const foundDeal = findDeal(lower, deals);

  if (/\b(arr|annual recurring|revenue|value|worth)\b/.test(lower)) {
    if (foundDeal)
      return {
        kind: 'query',
        reply: `The ARR for **${foundDeal.company_name}** is **${formatCurrency(foundDeal.arr_value)}** per year.`,
      };
    return {
      kind: 'query',
      reply: `I couldn't find that company. Try: "ARR of Razorpay"`,
    };
  }

  if (/\b(health|score)\b/.test(lower)) {
    if (foundDeal) {
      const label =
        foundDeal.health_score >= 80
          ? 'Healthy 🟢'
          : foundDeal.health_score >= 60
            ? 'At Risk 🟡'
            : 'Critical 🔴';
      return {
        kind: 'query',
        reply: `**${foundDeal.company_name}** health score: **${foundDeal.health_score}%** — ${label}`,
      };
    }
    return {
      kind: 'query',
      reply: `I couldn't find that company. Try: "Health score of XYZ Inc"`,
    };
  }

  if (/\b(stage|status)\b/.test(lower)) {
    if (foundDeal)
      return {
        kind: 'query',
        reply: `**${foundDeal.company_name}** is in the **${STAGE_LABELS[foundDeal.stage]}** stage.`,
      };
    return {
      kind: 'query',
      reply: `I couldn't find that company. Try: "Stage of PQR Ltd"`,
    };
  }

  if (/\b(close|closing|close date|when)\b/.test(lower)) {
    if (foundDeal?.close_date)
      return {
        kind: 'query',
        reply: `**${foundDeal.company_name}** is targeted to close by **${foundDeal.close_date}**.`,
      };
    if (foundDeal)
      return {
        kind: 'query',
        reply: `No close date set for **${foundDeal.company_name}**.`,
      };
  }

  if (/\b(owner|who owns|assigned)\b/.test(lower)) {
    if (foundDeal)
      return {
        kind: 'query',
        reply: `**${foundDeal.company_name}** is owned by **${foundDeal.owner_name ?? 'Unassigned'}**.`,
      };
  }

  // ── Generic search across all text ────────────────────────────────────
  const words = lower.split(/\s+/).filter((w) => w.length > 3);
  const dealHit = deals.find((d) =>
    words.some((w) => d.company_name.toLowerCase().includes(w)),
  );
  if (dealHit) {
    return {
      kind: 'query',
      reply: `Here's what I know about **${dealHit.company_name}**:\n• ARR: ${formatCurrency(dealHit.arr_value)}\n• Stage: ${STAGE_LABELS[dealHit.stage]}\n• Health: ${dealHit.health_score}%\n• Owner: ${dealHit.owner_name ?? 'N/A'}${dealHit.is_stuck ? `\n• ⚠️ Stuck: ${dealHit.stuck_reason}` : ''}`,
    };
  }

  return { kind: 'fallback' };
}

// ─── Editable Deal Card ────────────────────────────────────────────────────

function EditableDealCard({
  initial,
  onConfirm,
  onCancel,
}: {
  initial: PendingDeal;
  onConfirm: (d: PendingDeal) => void;
  onCancel: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [company, setCompany] = useState(initial.company_name);
  const [arr, setArr] = useState(String(initial.arr_value));
  const [stage, setStage] = useState<DealStage>(initial.stage);
  const [health] = useState(initial.health_score);

  const arrNum = parseInt(arr.replace(/,/g, '')) || initial.arr_value;

  function confirm() {
    onConfirm({
      company_name: company.trim() || initial.company_name,
      arr_value: arrNum,
      stage,
      health_score: health,
    });
  }

  return (
    <div className='mt-2.5 rounded-xl border border-[#CBD5E1] bg-white p-3 space-y-2'>
      <div className='flex items-center justify-between'>
        <p className='text-[10px] font-bold uppercase tracking-wider text-[#64748B]'>
          New Deal Preview
        </p>
        <button
          onClick={() => setEditing((v) => !v)}
          className='flex items-center gap-1 text-[10px] text-[#475569] hover:text-amber-400 transition-colors'
        >
          <Edit3 className='h-2.5 w-2.5' /> {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <div className='space-y-2'>
          {[
            {
              label: 'Company',
              node: (
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className='w-full rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-1 text-[11px] text-[#0F172A] outline-none focus:border-[#059669]/50'
                />
              ),
            },
            {
              label: 'ARR ($)',
              node: (
                <input
                  value={arr}
                  onChange={(e) => setArr(e.target.value)}
                  className='w-full rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-1 text-[11px] font-mono text-[#0F172A] outline-none focus:border-[#059669]/50'
                />
              ),
            },
            {
              label: 'Stage',
              node: (
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as DealStage)}
                  className='w-full rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-1 text-[11px] text-[#0F172A] outline-none appearance-none cursor-pointer'
                >
                  {ALL_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {STAGE_LABELS[s]}
                    </option>
                  ))}
                </select>
              ),
            },
          ].map(({ label, node }) => (
            <div
              key={label}
              className='grid grid-cols-[60px_1fr] items-center gap-2'
            >
              <span className='text-[10px] text-[#64748B]'>{label}</span>
              {node}
            </div>
          ))}
        </div>
      ) : (
        <div className='space-y-1'>
          {[
            ['Company', company],
            ['ARR', formatCurrency(arrNum)],
            ['Stage', STAGE_LABELS[stage]],
            ['Health', `${health}% (auto)`],
          ].map(([k, v]) => (
            <div key={k} className='flex items-center justify-between'>
              <span className='text-[10px] text-[#64748B]'>{k}</span>
              <span className='font-mono text-[11px] font-semibold text-[#0F172A]'>
                {v}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className='flex gap-2 pt-1'>
        <button
          onClick={confirm}
          className='flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-all'
          style={{ background: '#059669', color: '#ffffff' }}
        >
          <CheckCircle2 className='h-3.5 w-3.5' /> Create Deal
        </button>
        <button
          onClick={onCancel}
          className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#CBD5E1] py-1.5 text-[11px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors'
        >
          <XCircle className='h-3.5 w-3.5' /> Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Render helpers ────────────────────────────────────────────────────────

function renderContent(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/);
    return (
      <span key={i} className='block'>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={j} className='text-zinc-100'>
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          ),
        )}
      </span>
    );
  });
}

// ─── Main Component ────────────────────────────────────────────────────────

export function ChatBot() {
  const { deals, addDeal } = useDealStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listeningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastVoiceIdxRef = useRef<number>(-1);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: GREETING,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  useEffect(
    () => () => {
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
      if (listeningTimerRef.current) clearTimeout(listeningTimerRef.current);
    },
    [],
  );

  // ── Voice ────────────────────────────────────────────────────────────────

  function startVoice() {
    if (isListening) return;
    setIsListening(true);
    setInputText('');

    listeningTimerRef.current = setTimeout(() => {
      setIsListening(false);
      // Pick a sample that wasn't used last time (no consecutive repeats)
      let idx: number;
      do { idx = Math.floor(Math.random() * VOICE_SAMPLES.length) }
      while (idx === lastVoiceIdxRef.current && VOICE_SAMPLES.length > 1);
      lastVoiceIdxRef.current = idx;
      typewriterFill(VOICE_SAMPLES[idx]);
    }, 3000);
  }

  function cancelVoice() {
    if (listeningTimerRef.current) {
      clearTimeout(listeningTimerRef.current);
      listeningTimerRef.current = null;
    }
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
      typewriterRef.current = null;
    }
    setIsListening(false);
    setInputText('');
  }

  function typewriterFill(text: string, idx = 0) {
    if (idx > text.length) {
      inputRef.current?.focus();
      return;
    }
    setInputText(text.slice(0, idx));
    typewriterRef.current = setTimeout(() => typewriterFill(text, idx + 1), 28);
  }

  // ── Send ─────────────────────────────────────────────────────────────────

  function sendMessage(text = inputText) {
    const trimmed = text.trim();
    if (!trimmed || isListening) return;
    setInputText('');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsBotTyping(true);

    setTimeout(() => {
      const result = parseIntent(trimmed, deals);
      let botMsg: ChatMessage;

      if (result.kind === 'create') {
        botMsg = {
          id: `b-${Date.now()}`,
          role: 'assistant',
          content: 'Here are the deal details I captured. Review and confirm:',
          timestamp: new Date().toISOString(),
          pendingDeal: result.deal,
        };
      } else if (result.kind === 'list') {
        botMsg = {
          id: `b-${Date.now()}`,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          listDeals: result.deals,
        };
      } else if (result.kind === 'query') {
        botMsg = {
          id: `b-${Date.now()}`,
          role: 'assistant',
          content: result.reply,
          timestamp: new Date().toISOString(),
        };
      } else {
        botMsg = {
          id: `b-${Date.now()}`,
          role: 'assistant',
          content: `I can help with:\n• "Add deal for TechCo, $650K, proposal"\n• "ARR of Razorpay" · "Health score of XYZ Inc"\n• "Who is the champion for Razorpay?"\n• "List all deals" · "Total pipeline value"`,
          timestamp: new Date().toISOString(),
        };
      }

      setMessages((prev) => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 750);
  }

  // ── Deal actions ──────────────────────────────────────────────────────────

  function handleConfirmDeal(pending: PendingDeal, msgId: string) {
    const newDeal: Deal = {
      id: crypto.randomUUID(),
      name: `${pending.company_name} - New`,
      company_name: pending.company_name,
      arr_value: pending.arr_value,
      stage: pending.stage,
      health_score: pending.health_score,
      days_in_stage: 0,
      owner_name: 'Rahul Thakur',
      is_stuck: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addDeal(newDeal);
    // Remove pending card, add success — panel stays open
    setMessages((prev) => [
      ...prev.map((m) =>
        m.id === msgId ? { ...m, pendingDeal: undefined } : m,
      ),
      {
        id: `b-${Date.now()}`,
        role: 'assistant' as const,
        content: `✅ **${pending.company_name}** added to your pipeline!\n• ARR: ${formatCurrency(pending.arr_value)}\n• Stage: ${STAGE_LABELS[pending.stage]}\n• Health: ${pending.health_score}%\n\nYou can view it in the Deals list. Anything else?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  function handleCancelDeal(msgId: string) {
    setMessages((prev) => [
      ...prev.map((m) =>
        m.id === msgId ? { ...m, pendingDeal: undefined } : m,
      ),
      {
        id: `b-${Date.now()}`,
        role: 'assistant' as const,
        content: `No problem — deal entry cancelled. Let me know if you'd like to try again!`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {isOpen && (
        <div
          className='chat-panel fixed bottom-20 right-6 z-50 flex w-96 flex-col rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-2xl'
          style={{ height: '590px' }}
        >
          {/* Header */}
          <div className='flex items-center gap-3 rounded-t-2xl border-b border-zinc-800 px-4 py-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400'>
              <Zap className='h-4 w-4 fill-zinc-950 text-zinc-950' />
            </div>
            <div className='flex-1'>
              <p className='font-display text-sm font-700 text-zinc-50'>
                CloseLoop AI
              </p>
              <p className='text-[10px] text-[#475569]'>
                Ask anything about your pipeline
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='rounded-lg p-1 text-[#475569] hover:text-[#0F172A] transition-colors'
            >
              <X className='h-4 w-4' />
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3'>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className='mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400'>
                    <Zap className='h-3 w-3 fill-zinc-950 text-zinc-950' />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-[#ECFDF5] text-[#1F2937] border border-[#10B981]/30'
                      : 'rounded-bl-sm bg-[#F3F4F6] text-[#1F2937] border border-[#E5E7EB]'
                  }`}
                >
                  {msg.listDeals ? (
                    <div className='space-y-1.5'>
                      <p className='text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2'>
                        All Deals ({msg.listDeals.length})
                      </p>
                      {msg.listDeals.map((d) => (
                        <div
                          key={d.id}
                          className='flex items-center justify-between gap-2 rounded-lg bg-[#F1F5F9] px-2.5 py-1.5'
                        >
                          <div className='flex items-center gap-1.5 min-w-0'>
                            <BarChart3 className='h-3 w-3 text-amber-400 shrink-0' />
                            <span className='text-xs font-semibold text-[#0F172A] truncate'>
                              {d.company_name}
                            </span>
                          </div>
                          <div className='flex items-center gap-2 shrink-0'>
                            <span className='font-mono text-[10px] font-semibold text-amber-400'>
                              {formatCurrency(d.arr_value)}
                            </span>
                            <span
                              className={`text-[10px] font-semibold ${d.health_score >= 80 ? 'text-emerald-400' : d.health_score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}
                            >
                              {d.health_score}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : msg.content ? (
                    <div>{renderContent(msg.content)}</div>
                  ) : null}

                  {msg.pendingDeal && (
                    <EditableDealCard
                      initial={msg.pendingDeal}
                      onConfirm={(edited) => handleConfirmDeal(edited, msg.id)}
                      onCancel={() => handleCancelDeal(msg.id)}
                    />
                  )}
                </div>
              </div>
            ))}

            {isBotTyping && (
              <div className='flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-amber-400'>
                  <Zap className='h-3 w-3 fill-zinc-950 text-zinc-950' />
                </div>
                <div className='rounded-2xl rounded-bl-sm bg-[#F3F4F6] border border-[#E5E7EB] px-4 py-3'>
                  <div className='flex gap-1'>
                    <span className='typing-dot h-1.5 w-1.5 rounded-full bg-zinc-500' />
                    <span className='typing-dot h-1.5 w-1.5 rounded-full bg-zinc-500' />
                    <span className='typing-dot h-1.5 w-1.5 rounded-full bg-zinc-500' />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className='border-t border-zinc-800 p-3'>
            <div className='flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 focus-within:border-amber-400/40 transition-colors'>
              {isListening ? (
                <div className='flex flex-1 items-center gap-2'>
                  <WaveformAnimation />
                  <span className='text-[11px] text-[#475569]'>Listening…</span>
                </div>
              ) : (
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder='Ask anything or "add deal…"'
                  className='flex-1 bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none'
                />
              )}
              <div className='flex items-center gap-1.5 shrink-0'>
                {isListening ? (
                  /* Cancel voice — stops immediately, clears everything */
                  <button
                    onClick={cancelVoice}
                    className='flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors'
                    title='Cancel voice'
                  >
                    <MicOff className='h-3.5 w-3.5' />
                  </button>
                ) : (
                  <button
                    onClick={startVoice}
                    className='flex h-7 w-7 items-center justify-center rounded-lg text-[#64748B] hover:bg-zinc-700 hover:text-amber-400 transition-colors'
                    title='Voice input'
                  >
                    <Mic className='h-3.5 w-3.5' />
                  </button>
                )}
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputText.trim() || isListening}
                  className='flex h-7 w-7 items-center justify-center rounded-lg transition-all disabled:opacity-30'
                  style={{
                    background:
                      inputText.trim() && !isListening ? '#059669' : undefined,
                    color: '#ffffff',
                  }}
                >
                  <Send className='h-3.5 w-3.5' />
                </button>
              </div>
            </div>
            <p className='mt-1.5 text-center text-[10px] text-[#94A3B8]'>
              "Who is the champion?" · "Total pipeline?" · "Add deal for Acme,
              $650K"
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className='fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95'
        style={{ background: '#059669' }}
        title='Open AI Assistant'
      >
        {isOpen ? (
          <X className='h-6 w-6 text-white' />
        ) : (
          <MessageSquare className='h-6 w-6 text-white' />
        )}
        {!isOpen && (
          <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400'>
            <TrendingUp className='h-2.5 w-2.5 text-zinc-950' />
          </span>
        )}
      </button>
    </>
  );
}
