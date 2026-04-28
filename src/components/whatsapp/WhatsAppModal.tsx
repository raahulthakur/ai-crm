import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Edit3,
  X,
  Send,
  Bot,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useUIStore, useAIStore, useMessageStore, useDealStore } from '@/store';
import { Avatar } from '@/components/shared/Avatar';
import { draftWhatsAppMessage } from '@/lib/groq';
import { DEAL_ID } from '@/data/mockData';

const VARIATIONS = [
  `Hi Priya,

Quick check-in - any updates from Rahul on the budget discussion? I know the team is excited to get started.

Also, IT Security mentioned needing DPDP compliance docs. I have those ready to send whenever you need.

Happy to jump on a quick call if helpful!`,

  `Hi Priya! Hope you're well.

Wanted to check where things stand with the CFO approval — any movement there? The team's enthusiasm has been great to see.

Also wanted to let you know our DPDP compliance docs are ready for IT Security whenever needed. Let me know how I can help move things forward!`,

  `Hey Priya,

Following up on the Razorpay proposal. Has Rahul had a chance to review the budget? We're excited to get started.

Also wanted to mention — DPDP compliance documentation is all set for the IT Security team. Just say the word and I'll send it over.`,
];

export function WhatsAppModal() {
  const { whatsAppModalOpen, whatsAppTarget, closeWhatsAppModal } =
    useUIStore();
  const { setDraftedMessage, setGeneratingMessage, isGeneratingMessage } =
    useAIStore();
  const { appendMessage, initPriyaConversation } = useMessageStore();
  const { activeDeal } = useDealStore();
  const navigate = useNavigate();

  const [variationIdx, setVariationIdx] = useState(0);
  const [editedMessage, setEditedMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (!whatsAppModalOpen || !whatsAppTarget || !activeDeal) return;
    setVariationIdx(0);
    setEditedMessage(VARIATIONS[0]);
    setIsEditing(false);

    if (import.meta.env.VITE_GROQ_API_KEY) {
      setGeneratingMessage(true);
      draftWhatsAppMessage({
        contactName: whatsAppTarget.full_name,
        contactRole: whatsAppTarget.job_title ?? 'Contact',
        dealName: activeDeal.company_name,
        arrValue: `$${(activeDeal.arr_value / 1000).toFixed(0)}K`,
        stuckReason: activeDeal.stuck_reason ?? 'deal stalled',
        lastActivity: '12 days ago',
      })
        .then((msg) => {
          if (msg) {
            setDraftedMessage(msg);
            setEditedMessage(msg);
          }
        })
        .catch(() => {})
        .finally(() => setGeneratingMessage(false));
    }
  }, [whatsAppModalOpen, whatsAppTarget?.id]);

  function handleRegenerate() {
    setIsRegenerating(true);
    setTimeout(() => {
      const next = (variationIdx + 1) % VARIATIONS.length;
      setVariationIdx(next);
      setEditedMessage(VARIATIONS[next]);
      setIsRegenerating(false);
    }, 500);
  }

  function handleSend() {
    if (!whatsAppTarget) return;
    initPriyaConversation();
    appendMessage({
      id: `msg-out-${Date.now()}`,
      deal_id: DEAL_ID,
      contact_id: whatsAppTarget.id,
      channel: 'whatsapp',
      direction: 'outbound',
      status: 'sent',
      body: editedMessage,
      ai_drafted: true,
      sent_at: new Date().toISOString(),
    });
    closeWhatsAppModal();
    navigate(`/deals/${DEAL_ID}/conversation`);
  }

  if (!whatsAppModalOpen || !whatsAppTarget) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl animate-bounce-in'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30'>
              <MessageSquare className='h-3.5 w-3.5 text-[#059669]' />
            </div>
            <div>
              <p className='font-display text-sm font-600 text-[#0F172A]'>
                WhatsApp Follow-Up
              </p>
              <p className='text-[11px] text-[#475569]'>AI Recommended Action</p>
            </div>
          </div>
          <button
            onClick={closeWhatsAppModal}
            className='rounded-lg p-1 text-[#475569] hover:text-[#0F172A] transition-colors'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* To */}
        <div className='border-b border-[#E5E7EB] px-5 py-3'>
          <p className='mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#475569]'>
            To
          </p>
          <div className='flex items-center gap-3'>
            <Avatar
              name={whatsAppTarget.full_name}
              imageUrl={whatsAppTarget.avatar_url}
              size='lg'
            />
            <div>
              <p className='text-sm font-semibold text-[#0F172A]'>
                {whatsAppTarget.full_name}
              </p>
              <p className='text-[11px] text-[#64748B]'>
                {whatsAppTarget.job_title} · Razorpay
              </p>
              <p className='text-[11px] font-medium text-[#059669]'>
                Champion — can nudge CFO internally
              </p>
            </div>
          </div>
        </div>

        {/* Draft */}
        <div className='px-5 py-4'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <Bot className='h-3.5 w-3.5 text-blue-400' />
              <p className='text-xs font-semibold text-[#475569]'>AI Draft</p>
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating || isGeneratingMessage}
                className='flex items-center gap-1 text-[11px] text-[#059669] hover:text-[#047857] transition-colors disabled:opacity-40'
              >
                <RefreshCw
                  className={`h-3 w-3 ${isRegenerating ? 'animate-spin' : ''}`}
                />
                Regenerate
              </button>
              <span className='text-[#CBD5E1]'>|</span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className='flex items-center gap-1 text-[11px] text-[#64748B] hover:text-[#0F172A] transition-colors'
              >
                <Edit3 className='h-3 w-3' />
                {isEditing ? 'Done' : 'Edit'}
              </button>
            </div>
          </div>

          {isGeneratingMessage || isRegenerating ? (
            <div className='flex items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm text-[#64748B]'>
              <Loader2 className='h-4 w-4 animate-spin text-blue-400' />
              {isRegenerating
                ? 'Loading next variation…'
                : 'AI drafting message…'}
            </div>
          ) : isEditing ? (
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              rows={7}
              className='w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 text-sm text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#059669]/40 focus:ring-1 focus:ring-[#059669]/20 resize-none transition-colors font-body'
            />
          ) : (
            <div className='min-h-[120px] rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-3 text-sm text-[#065F46] whitespace-pre-line leading-relaxed'>
              {editedMessage}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className='flex gap-2 border-t border-[#E5E7EB] px-5 py-4'>
          <button
            onClick={closeWhatsAppModal}
            className='flex-1 rounded-lg border border-[#CBD5E1] py-2 text-sm font-medium text-[#64748B] hover:border-[#94A3B8] hover:text-[#0F172A] transition-colors'
          >
            Skip
          </button>
          <button
            onClick={handleSend}
            disabled={isGeneratingMessage}
            className='flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-white disabled:opacity-50 transition-colors' style={{ background: '#059669' }} onMouseOver={e=>(e.currentTarget.style.background='#047857')} onMouseOut={e=>(e.currentTarget.style.background='#059669')}
          >
            <Send className='h-3.5 w-3.5' /> Send Now
          </button>
        </div>
      </div>
    </div>
  );
}
