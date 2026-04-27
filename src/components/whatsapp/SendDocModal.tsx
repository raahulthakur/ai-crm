import { useRef, useState } from 'react';
import {
  FileText,
  Upload,
  X,
  Send,
  CheckCircle2,
  Plus,
  Mail,
} from 'lucide-react';
import { useUIStore, useAIStore, useActivityStore } from '@/store';
import { Avatar } from '@/components/shared/Avatar';

interface Recipient {
  name: string;
  email: string;
  role: string;
  removable: boolean;
}

const DEFAULT_RECIPIENTS: Recipient[] = [
  {
    name: 'Neha Kapoor',
    email: 'security@razorpay.com',
    role: 'IT Security Lead',
    removable: false,
  },
  {
    name: 'Priya Sharma',
    email: 'priya@razorpay.com',
    role: 'VP Marketing',
    removable: true,
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul.mehta@razorpay.com',
    role: 'CFO',
    removable: true,
  },
];

export function SendDocModal({ actionId }: { actionId: string }) {
  const { sendDocModalOpen, closeSendDocModal, addToast } = useUIStore();
  const { completeAction } = useAIStore();
  const { addActivity } = useActivityStore();

  const fileRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<string[]>([
    'DPDP_compliance_doc.pdf',
  ]);
  const [recipients, setRecipients] = useState<Recipient[]>(DEFAULT_RECIPIENTS);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [sent, setSent] = useState(false);

  if (!sendDocModalOpen) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setAttachments((prev) => [...prev, f.name]);
  }

  function removeFile(name: string) {
    setAttachments((prev) => prev.filter((f) => f !== name));
  }

  function removeRecipient(email: string) {
    setRecipients((prev) => prev.filter((r) => r.email !== email));
  }

  function addEmailRecipient() {
    const trimmed = emailInput.trim();
    if (!trimmed || !trimmed.includes('@')) return;
    const newR: Recipient = {
      name: trimmed.split('@')[0],
      email: trimmed,
      role: 'Custom',
      removable: true,
    };
    setRecipients((prev) => [...prev, newR]);
    setEmailInput('');
    setShowEmailInput(false);
  }

  function handleSend() {
    setSent(true);
    setTimeout(() => {
      completeAction(actionId);
      addToast({
        type: 'gmail',
        title: 'Email sent via Gmail',
        subtitle: `Sent to ${recipients.length} recipient${recipients.length !== 1 ? 's' : ''} — DPDP compliance docs delivered`,
      });
      addActivity({
        id: `act-email-${Date.now()}`,
        deal_id: 'abc-corp-deal-001',
        type: 'email_sent',
        title: `DPDP compliance email sent to ${recipients.length} recipients`,
        description: `Sent to: ${recipients.map((r) => r.name).join(', ')}`,
        occurred_at: new Date().toISOString(),
        created_by: 'rahulthakur@nexusai.com',
      });
      closeSendDocModal();
      setSent(false);
      setAttachments(['DPDP_compliance_doc.pdf']);
      setRecipients(DEFAULT_RECIPIENTS);
    }, 1100);
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm'>
      <div className='mx-4 w-full max-w-md rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl animate-bounce-in'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-zinc-800 px-5 py-4'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/30'>
              <FileText className='h-3.5 w-3.5 text-teal-700' />
            </div>
            <div>
              <p className='font-display text-sm font-600 text-zinc-50'>
                Send Compliance Document
              </p>
              <p className='text-[11px] text-[#475569]'>
                IT Security approval blocker
              </p>
            </div>
          </div>
          <button
            onClick={closeSendDocModal}
            className='rounded-lg p-1 text-[#475569] hover:text-[#0F172A] transition-colors'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <div className='px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto'>
          {/* Attachments */}
          <div>
            <p className='mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#475569]'>
              Attached Files
            </p>
            <div className='space-y-1.5'>
              {attachments.map((name) => (
                <div
                  key={name}
                  className='flex items-center gap-2.5 rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-3 py-2.5'
                >
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 border border-teal-500/20 shrink-0'>
                    <FileText className='h-3.5 w-3.5 text-teal-700' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='font-mono text-xs font-semibold text-zinc-200 truncate'>
                      {name}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(name)}
                    className='shrink-0 rounded p-0.5 text-[#475569] hover:text-rose-400 transition-colors'
                  >
                    <X className='h-3.5 w-3.5' />
                  </button>
                </div>
              ))}
            </div>
            <input
              ref={fileRef}
              type='file'
              className='hidden'
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className='mt-2 flex items-center gap-1.5 text-[11px] text-[#059669] hover:text-[#047857] transition-colors'
            >
              <Upload className='h-3.5 w-3.5' /> Upload additional file from
              device
            </button>
          </div>

          {/* Recipients */}
          <div>
            <p className='mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#475569]'>
              Recipients
            </p>
            <div className='space-y-1.5'>
              {recipients.map((r) => (
                <div
                  key={r.email}
                  className='flex items-center gap-2.5 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-3 py-2'
                >
                  <Avatar name={r.name} size='sm' />
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-semibold text-zinc-200'>
                      {r.name}
                    </p>
                    <p className='text-[10px] text-[#475569]'>
                      {r.role} · {r.email}
                    </p>
                  </div>
                  {r.removable && (
                    <button
                      onClick={() => removeRecipient(r.email)}
                      className='shrink-0 rounded p-0.5 text-zinc-700 hover:text-rose-400 transition-colors'
                    >
                      <X className='h-3.5 w-3.5' />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add by email */}
            {showEmailInput ? (
              <div className='mt-2 flex gap-2'>
                <div className='flex flex-1 items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 focus-within:border-amber-400/40 transition-colors'>
                  <Mail className='h-3 w-3 text-[#475569] shrink-0' />
                  <input
                    type='email'
                    placeholder='name@company.com'
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addEmailRecipient()}
                    autoFocus
                    className='w-full bg-transparent text-xs text-zinc-200 placeholder-[#94A3B8] outline-none'
                  />
                </div>
                <button
                  onClick={addEmailRecipient}
                  className='btn-ghost text-[11px]'
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowEmailInput(false);
                    setEmailInput('');
                  }}
                  className='rounded-lg p-1.5 text-[#475569] hover:text-[#475569] transition-colors'
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEmailInput(true)}
                className='mt-2 flex items-center gap-1.5 text-[11px] text-[#059669] hover:text-[#047857] transition-colors'
              >
                <Plus className='h-3.5 w-3.5' /> Add recipient by email
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex gap-2 border-t border-zinc-800 px-5 py-4'>
          <button
            onClick={closeSendDocModal}
            className='flex-1 rounded-lg border border-[#CBD5E1] py-2.5 text-sm font-medium text-gray-700 hover:border-gray-400 hover:text-[#0F172A] transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={
              sent || attachments.length === 0 || recipients.length === 0
            }
            className='flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-colors' style={{ background: '#059669' }} onMouseOver={e => (e.currentTarget.style.background='#047857')} onMouseOut={e => (e.currentTarget.style.background='#059669')}
          >
            {sent ? (
              <>
                <CheckCircle2 className='h-4 w-4' /> Sending…
              </>
            ) : (
              <>
                <Send className='h-3.5 w-3.5' /> Send Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
