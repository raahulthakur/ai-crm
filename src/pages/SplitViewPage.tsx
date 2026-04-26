import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCheck, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import {
  useMessageStore,
  useDealStore,
  useAIStore,
  useActivityStore,
} from '@/store';
import { Avatar } from '@/components/shared/Avatar';
import { ScoreRing } from '@/components/split-view/ScoreRing';
import { AIInsightsPanel } from '@/components/deal-room/AIInsightsPanel';
import { RecommendedActions } from '@/components/deal-room/RecommendedActions';
import { DEAL_ID, contacts } from '@/data/mockData';

const PRIYA = contacts[2];
const PRIYA_REPLY =
  "Actually yes! Great news - Rahul approved the budget yesterday! 🎉\n\nJust need to send DPDP compliance to IT Security and we're good to go.\n\nCan you send that today?";

export function SplitViewPage() {
  const { messages, appendMessage } = useMessageStore();
  const { updateDealScore, unstickDeal, activeDeal, deals, setActiveDeal } =
    useDealStore();
  const { updatePostBreakthrough } = useAIStore();
  const { addActivity } = useActivityStore();
  const navigate = useNavigate();

  const [isTyping, setIsTyping] = useState(false);
  const [breakthrough, setBreakthrough] = useState(false);
  const [scoreFrom, setScoreFrom] = useState(68);
  const [scoreTo, setScoreTo] = useState(68);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeDeal) {
      const d = deals.find((d) => d.id === DEAL_ID);
      if (d) setActiveDeal(d);
    }
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setIsTyping(true), 2500);
    const t2 = setTimeout(() => {
      setIsTyping(false);
      appendMessage({
        id: 'msg-priya-reply',
        deal_id: DEAL_ID,
        contact_id: PRIYA.id,
        channel: 'whatsapp',
        direction: 'inbound',
        status: 'read',
        body: PRIYA_REPLY,
        ai_drafted: false,
        sent_at: new Date().toISOString(),
        contact: PRIYA,
      });
      setTimeout(() => {
        setScoreFrom(68);
        setScoreTo(90);
        setBreakthrough(true);
        updateDealScore(DEAL_ID, 90);
        unstickDeal(DEAL_ID);
        updatePostBreakthrough();
        addActivity({
          id: `act-score-${Date.now()}`,
          deal_id: DEAL_ID,
          type: 'score_updated',
          title: 'AI health score updated: 68% → 90%',
          description:
            'CFO budget approved via Priya — primary financial blocker removed',
          occurred_at: new Date().toISOString(),
          created_by: 'ai_system',
          metadata: { score_before: 68, score_after: 90 },
        });
        addActivity({
          id: `act-wa-${Date.now()}`,
          deal_id: DEAL_ID,
          contact_id: PRIYA.id,
          type: 'whatsapp_received',
          title: 'Priya: CFO approved budget!',
          description:
            '"Rahul approved the budget yesterday! Just need DPDP compliance for IT Security."',
          occurred_at: new Date().toISOString(),
          created_by: PRIYA.email,
          contact: PRIYA,
        });
      }, 500);
    }, 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className='flex h-full overflow-hidden bg-zinc-950'>
      {/* LEFT — WhatsApp */}
      <div className='flex w-1/2 flex-col border-r border-zinc-800'>
        <div
          className='flex items-center gap-3 px-4 py-3 border-b'
          style={{ background: '#202C33', borderColor: '#2A3942' }}
        >
          <Avatar
            name={PRIYA.full_name}
            imageUrl={PRIYA.avatar_url}
            size='lg'
          />
          <div>
            <p className='text-sm font-semibold text-[#E9EDEF]'>
              {PRIYA.full_name}
            </p>
            <p className='text-[11px] text-[#8696A0]'>
              {PRIYA.job_title} · Razorpay
            </p>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto wa-bg p-4 space-y-2'>
          {messages.map((msg) => {
            const isOut = msg.direction === 'outbound';
            return (
              <div
                key={msg.id}
                className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}
              >
                {!isOut && (
                  <Avatar
                    name={PRIYA.full_name}
                    size='sm'
                    className='mr-2 mt-1 shrink-0'
                  />
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 shadow-sm ${isOut ? 'chat-bubble-out' : 'chat-bubble-in'}`}
                >
                  <p className='text-sm whitespace-pre-line leading-relaxed'>
                    {msg.body}
                  </p>
                  <div className='mt-1 flex items-center justify-end gap-1 text-[10px] opacity-50'>
                    <span>
                      {new Date(msg.sent_at ?? '').toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isOut && <CheckCheck className='h-3 w-3 text-blue-400' />}
                  </div>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className='flex items-center gap-2'>
              <Avatar name={PRIYA.full_name} size='sm' className='shrink-0' />
              <div className='chat-bubble-in px-4 py-3'>
                <div className='flex gap-1'>
                  <span className='typing-dot h-2 w-2 rounded-full bg-[#8696A0]' />
                  <span className='typing-dot h-2 w-2 rounded-full bg-[#8696A0]' />
                  <span className='typing-dot h-2 w-2 rounded-full bg-[#8696A0]' />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* RIGHT — Live deal update */}
      <div className='flex w-1/2 flex-col overflow-y-auto bg-zinc-950'>
        <div className='border-b border-zinc-800 bg-zinc-900/30 px-4 py-2'>
          <p className='text-[10px] font-semibold uppercase tracking-widest text-zinc-600'>
            Razorpay · Live Update
          </p>
        </div>
        <div className='p-5 space-y-4'>
          {/* Score card */}
          <div
            className={`rounded-xl border p-5 transition-all duration-500 ${
              breakthrough
                ? 'border-emerald-500/25 bg-emerald-500/5'
                : 'border-zinc-800 bg-zinc-900/30'
            }`}
          >
            {breakthrough && (
              <div className='mb-4 flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-display font-600 text-emerald-400 animate-bounce-in'>
                <Zap className='h-4 w-4 fill-emerald-400' /> BREAKTHROUGH
                DETECTED
              </div>
            )}
            <div className='flex items-center justify-center gap-6'>
              <ScoreRing from={scoreFrom} to={scoreTo} size={120} />
              {breakthrough && (
                <div className='text-left animate-fade-in space-y-2'>
                  <div className='flex items-center gap-1.5 text-emerald-400'>
                    <TrendingUp className='h-4 w-4' />
                    <span className='font-display font-700 text-base'>
                      +22 pts
                    </span>
                  </div>
                  <p className='text-[11px] text-zinc-600'>last 5 minutes</p>
                  <div className='space-y-1.5'>
                    {[
                      { dot: 'bg-emerald-400', label: 'CFO approved budget' },
                      { dot: 'bg-amber-400', label: 'DPDP compliance pending' },
                    ].map(({ dot, label }) => (
                      <div
                        key={label}
                        className='flex items-center gap-1.5 text-[11px]'
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`}
                        />
                        <span className='text-zinc-400'>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {!breakthrough && (
              <p className='mt-3 text-center text-[11px] text-zinc-600'>
                Analyzing response…
              </p>
            )}
          </div>

          {breakthrough && (
            <div className='space-y-4 animate-fade-in'>
              <AIInsightsPanel />
              <div className='border-t border-zinc-800 pt-4'>
                <RecommendedActions />
              </div>
              <button
                onClick={() => navigate(`/deals/${DEAL_ID}/victory`)}
                className='w-full flex items-center justify-center gap-2 rounded-xl btn-amber py-3 text-sm'
              >
                View Updated Deal Room <ArrowRight className='h-4 w-4' />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
