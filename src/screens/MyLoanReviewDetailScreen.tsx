import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../components/Icon'
import CallSheet from '../components/CallSheet'
import { MwlHeader } from './mwl/MwlParts'
import { addNotice } from '../workspace/notifications'

// ─────────────────────────────────────────────────────────────────────────────
// In-review application detail — opened from the "In Review" card on My Loans.
// Mirrors the Figma "Request Housing Loan" frame: amount, timeline, estimate.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const LABEL = '#737373'
const VALUE = '#171717'
const ACCENT = '#345EAC'
const BLUE = '#275CB2'
const KH = `'Noto Sans Khmer', sans-serif`

type Chip = { label: string; color: string; bg: string }
type Step = { title: string; sub: string; state: 'done' | 'current' | 'pending'; desc?: string; chips?: Chip[] }
const TIMELINE: Step[] = [
  { title: 'Application Received', sub: 'Completed · 1 Jun 2026', state: 'done' },
  { title: 'Guarantor Consent', sub: 'Completed · 1 Jun 2026', state: 'done' },
  {
    title: 'Assessment',
    sub: 'In progress · Est. 1–2 business days',
    state: 'current',
    desc: 'Our team reviews your application, including the credit bureau report.',
  },
  {
    title: 'Decision',
    sub: 'Pending assessment',
    state: 'pending',
    chips: [
      { label: 'Approved', color: '#1FA85C', bg: '#DCF5E6' },
      { label: 'Rejected', color: '#E11D48', bg: '#FDE7EC' },
      { label: 'Cancelled', color: '#C47F11', bg: '#FBEBC6' },
    ],
    desc: 'The outcome will be confirmed here.',
  },
  { title: 'Disbursement', sub: 'Released after approval', state: 'pending' },
]

export default function MyLoanReviewDetailScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [callOpen, setCallOpen] = useState(false)
  const [disbursed, setDisbursed] = useState(false)

  // The detail is parametrised so a freshly-submitted application (e.g. Staff
  // Loan) can show its own figures; defaults keep the existing Housing example.
  const title = params.get('title') ?? 'Request Housing Loan'
  const amount = params.get('amount') ?? '$4,500.00'
  const term = params.get('term') ?? '24 months'
  const rate = params.get('rate') ?? '1.20%/mo'
  const ref = params.get('ref') ?? 'NH-2026-04821'
  const requestedOn = params.get('on') ?? '12 Feb 2026'
  // The Staff Loan review has no assigned officer card.
  const isStaff = title === 'Staff Loan'

  // Staff Loan: "Continue" disburses the loan — show the success popup and raise
  // a disbursement notification (visible in Notifications → All).
  const disburse = () => {
    addNotice({
      kind: 'disbursement',
      title: `Disbursement successful · ${amount}`,
      body: `Your Staff Loan (${ref}) has been disbursed to your bank account. Please check your balance.`,
      time: 'Just now',
    })
    setDisbursed(true)
  }

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, pb: '44px' }}>
        <MwlHeader onBack={() => navigate(-1)} />
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: HEADING, letterSpacing: '-1px', px: 3, mt: 0.5 }}>
          {title}
        </Typography>

        <Box sx={{ px: 3, pt: 2, pb: 5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Status row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ bgcolor: '#FBEBC6', borderRadius: '999px', px: '9px', py: '3px' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#B7791F' }}>In review</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: LABEL, letterSpacing: '0.65px' }}>{ref}</Typography>
          </Box>

          {/* Request amount card */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: 2.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.6px', color: LABEL }}>REQUEST AMOUNT</Typography>
            <Typography sx={{ fontSize: 38, fontWeight: 800, color: HEADING, letterSpacing: '-1px', lineHeight: 1.1, mt: 0.5 }}>{amount}</Typography>
            <Box sx={{ height: '1px', bgcolor: '#F0F0F0', my: 1.75 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <MetaCol label="Requested on" value={requestedOn} />
              <MetaCol label="Term" value={term} />
              <MetaCol label="Rate" value={rate} />
            </Box>
          </Box>

          {/* Application timeline */}
          <Box>
            <SectionLabel>Application Timeline</SectionLabel>
            <Box sx={{ mt: 1.5 }}>
              {TIMELINE.map((s, i) => (
                <TimelineRow key={s.title} step={s} last={i === TIMELINE.length - 1} />
              ))}
            </Box>
          </Box>

          {/* My officer — not shown for a Staff Loan review */}
          {!isStaff && (
          <Box>
            <SectionLabel>My Officer</SectionLabel>
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.25 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: 'radial-gradient(circle at 30% 30%, #9BD0FF 0%, #4C8BE0 45%, #2B4F92 100%)',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: VALUE }}>Mr. Pisey Sok</Typography>
                <Typography sx={{ fontSize: 11, color: LABEL }}>Riverside Branch</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box role="button" aria-label="Chat" onClick={() => navigate('/chat')} sx={{ display: 'flex', cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                  <Icon name="message" size={22} color="#0B0F1A" />
                </Box>
                <Box role="button" aria-label="Call" onClick={() => setCallOpen(true)} sx={{ display: 'flex', cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                  <Icon name="phone" size={22} color="#0B0F1A" />
                </Box>
                <Box role="button" aria-label="Telegram" onClick={() => window.open('https://t.me/', '_blank')} sx={{ display: 'flex', cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                  <Icon name="telegram" size={22} color="#229ED9" />
                </Box>
              </Box>
            </Box>
          </Box>
          )}
        </Box>
      </Box>

      {/* Staff Loan: continue the process → disbursement */}
      {isStaff && (
        <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={disburse}
            endIcon={<Icon name="arrowRight" size={18} />}
            sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
          >
            Loan disbursement happen
          </Button>
        </Box>
      )}

      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />

      {/* Disbursement success popup */}
      {disbursed && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 200, bgcolor: 'rgba(11,15,26,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
          <Box
            sx={{
              bgcolor: '#fff', borderRadius: '20px', p: '28px 24px', width: '100%', maxWidth: 320, textAlign: 'center',
              boxShadow: '0 24px 60px rgba(11,15,26,0.28)',
              animation: 'ml-pop 0.22s cubic-bezier(0.32,0.72,0,1)',
              '@keyframes ml-pop': { from: { opacity: 0, transform: 'scale(0.92)' }, to: { opacity: 1, transform: 'scale(1)' } },
            }}
          >
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Box component="img" src="/assets/brand/ico_success.svg" alt="" sx={{ width: 40, height: 40 }} />
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.3px', mb: 1 }}>
              Disbursement successful
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6B7280', lineHeight: 1.55, mb: 2.5 }}>
              Your Staff Loan of <Box component="span" sx={{ fontWeight: 700, color: '#0B0F1A' }}>{amount}</Box> has been disbursed. Please check your bank account.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/notifications')}
              endIcon={<Icon name="arrowRight" size={18} />}
              sx={{ height: 50, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
            >
              View notifications
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <Typography sx={{ fontSize: 11, color: LABEL }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: VALUE }}>{value}</Typography>
    </Box>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 13, fontWeight: 600, color: LABEL, letterSpacing: '0.65px', textTransform: 'uppercase', pl: 0.5 }}>
      {children}
    </Typography>
  )
}

function TimelineRow({ step, last }: { step: Step; last: boolean }) {
  const done = step.state === 'done'
  const current = step.state === 'current'
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      {/* Node + connector */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            mt: '2px',
            bgcolor: done ? BLUE : '#fff',
            border: done ? `2px solid ${BLUE}` : current ? `2px solid ${BLUE}` : '2px solid #C9D2DE',
          }}
        />
        {!last && <Box sx={{ width: 2, flex: 1, minHeight: 28, bgcolor: done ? BLUE : '#E2E6EC', my: '2px' }} />}
      </Box>
      {/* Text */}
      <Box sx={{ pb: last ? 0 : 2, minWidth: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: step.state === 'pending' ? '#9AA3B2' : HEADING, lineHeight: 1.2 }}>
          {step.title}
        </Typography>
        <Typography sx={{ fontSize: 13, color: LABEL, mt: 0.25 }}>{step.sub}</Typography>
        {step.desc && (
          <Typography sx={{ fontSize: 12.5, color: '#8A94A6', mt: 0.5, lineHeight: 1.45 }}>{step.desc}</Typography>
        )}
        {step.chips && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.75 }}>
            {step.chips.map((c) => (
              <Box key={c.label} sx={{ bgcolor: c.bg, borderRadius: '999px', px: 1, py: '2px' }}>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: c.color }}>{c.label}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
