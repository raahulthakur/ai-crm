import { useState } from 'react';
import {
  MessageSquare,
  Phone,
  FileText,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useAIStore, useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import type { AIRecommendedAction, ActionPriority } from '@/types';
import { BookMeetingCard } from '@/components/whatsapp/BookMeetingCard';
import { SendDocModal } from '@/components/whatsapp/SendDocModal';

const PRIORITY_DOT: Record<ActionPriority, string> = {
  critical: 'bg-rose-400',
  high: 'bg-amber-400',
  medium: 'bg-blue-400',
  low: 'bg-zinc-600',
};

const PRIORITY_TEXT: Record<ActionPriority, string> = {
  critical: 'text-rose-400',
  high: 'text-amber-400',
  medium: 'text-blue-400',
  low: 'text-zinc-500',
};

const ACTION_ICONS: Record<string, typeof MessageSquare> = {
  send_whatsapp: MessageSquare,
  book_meeting: Phone,
  send_doc: FileText,
};

const ACTION_LABELS: Record<string, string> = {
  send_whatsapp: 'Send WhatsApp',
  book_meeting: 'Book Meeting',
  send_doc: 'Send Document',
};

export function RecommendedActions() {
  const { actions } = useAIStore();
  const { openWhatsAppModal, openSendDocModal } = useUIStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pending = actions.filter((a) => !a.is_completed);

  function handleAction(action: AIRecommendedAction) {
    if (action.action_type === 'send_whatsapp' && action.target_contact) {
      openWhatsAppModal(action.target_contact);
    } else if (action.action_type === 'book_meeting') {
      setExpandedId(expandedId === action.id ? null : action.id);
    } else if (action.action_type === 'send_doc') {
      openSendDocModal(action.id);
    }
  }

  return (
    <div className='space-y-2.5'>
      <h3 className='text-[10px] font-semibold uppercase tracking-widest text-zinc-600'>
        AI Recommended Actions
      </h3>

      <div className='space-y-2'>
        {pending.map((action) => {
          const Icon = ACTION_ICONS[action.action_type] ?? Zap;
          const isExpanded = expandedId === action.id;

          return (
            <div
              key={action.id}
              className='rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 transition-all hover:border-zinc-700 animate-fade-in'
            >
              <div className='flex items-start gap-2.5'>
                <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700'>
                  <Icon className='h-3 w-3 text-zinc-400' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-1.5 flex-wrap'>
                    <span className='text-xs font-semibold text-zinc-100'>
                      {action.title}
                    </span>
                    <span
                      className={cn(
                        'flex items-center gap-1 text-[10px] font-medium',
                        PRIORITY_TEXT[action.priority],
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          PRIORITY_DOT[action.priority],
                        )}
                      />
                      {action.priority}
                    </span>
                  </div>
                  <p className='mt-0.5 text-[11px] leading-relaxed text-zinc-500'>
                    {action.description}
                  </p>
                  {action.target_contact && (
                    <p className='mt-1 text-[10px] text-zinc-700'>
                      → {action.target_contact.full_name} ·{' '}
                      {action.target_contact.job_title}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAction(action)}
                className={cn(
                  'mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all',
                  action.action_type === 'send_whatsapp'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                    : action.action_type === 'book_meeting'
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25'
                      : 'bg-teal-500/15 text-teal-400 border border-teal-500/30 hover:bg-teal-500/25',
                )}
              >
                <Zap className='h-3 w-3' />
                {ACTION_LABELS[action.action_type] ?? 'Take Action'}
              </button>

              {action.action_type === 'book_meeting' &&
                isExpanded &&
                action.target_contact && (
                  <BookMeetingCard
                    actionId={action.id}
                    contactName={action.target_contact.full_name}
                    contactEmail={
                      action.target_contact.email ?? 'rahul.mehta@razorpay.com'
                    }
                  />
                )}
            </div>
          );
        })}

        {pending.find((a) => a.action_type === 'send_doc') && (
          <SendDocModal
            actionId={pending.find((a) => a.action_type === 'send_doc')!.id}
          />
        )}

        {pending.length === 0 && (
          <div className='flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3'>
            <CheckCircle2 className='h-4 w-4 text-emerald-400 shrink-0' />
            <span className='text-xs font-medium text-emerald-400'>
              All actions completed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
