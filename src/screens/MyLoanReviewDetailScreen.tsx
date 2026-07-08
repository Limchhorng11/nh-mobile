import { Fragment, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'
import { AssetImg, asset } from '../components/home/media'
import CallSheet from '../components/CallSheet'
import { addNotice } from '../workspace/notifications'
import { TRACK_STAGES as STAGES } from '../workspace/tracking'

const HEADING = '#0B0F1A'
const LABEL = '#737373'
const BLUE = '#275CB2'
const GREEN = '#1FA85C'
const MUTED = '#8A94A6'
const PEND = '#9AA3B2'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: MUTED, mb: 1 }}>
      {children}
    </Typography>
  )
}

function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 11.5, color: LABEL, lineHeight: 1.3 }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING, mt: 0.25 }}>{value}</Typography>
    </Box>
  )
}

// ─── Terminal-state detail pages (not eligible / rejected / cancelled) ────────
type TerminalDef = {
  chipLabel: string; chipColor: string; chipBg: string
  alertBg: string; alertBorder: string; alertTitleColor: string
  alertTitle: string; alertBody: string
  reasonLabel: string; reason: string
  bullets: string[]
  ctaLabel: string; ctaColor: string
}
const TERMINAL: Record<string, TerminalDef> = {
  notEligible: {
    chipLabel: 'Not eligible', chipColor: '#E11D48', chipBg: '#FDE7EC',
    alertBg: '#FEF2F2', alertBorder: '#FECACA', alertTitleColor: '#B91C1C',
    alertTitle: 'This request didn\'t meet eligibility',
    alertBody: 'NH reviewed this request on 16 Apr 2026 and it did not meet the basic eligibility criteria for the SME Loan, so it did not move to full assessment.',
    reasonLabel: 'WHY IT WASN\'T ELIGIBLE',
    reason: 'The business had been operating for less than the 1 year minimum required for an SME Loan at the time of applying.',
    bullets: [
      'Reapply once your business reaches 12 months of operating history.',
      'Apply for a Micro Loan, which has a shorter operating-history requirement.',
      'Add an eligible guarantor to strengthen a future request.',
    ],
    ctaLabel: 'Explore eligible loans', ctaColor: '#275CB2',
  },
  rejected: {
    chipLabel: 'Rejected', chipColor: '#E11D48', chipBg: '#FDE7EC',
    alertBg: '#FEF2F2', alertBorder: '#FECACA', alertTitleColor: '#B91C1C',
    alertTitle: 'Application not approved',
    alertBody: 'After assessment — including the CBC credit report — NH was unable to approve this request on 25 Apr 2026.',
    reasonLabel: 'MAIN REASON',
    reason: 'Your current total debt-to-income ratio is above NH\'s lending limit. This was the primary factor in the decision.',
    bullets: [
      'Reapply after 3 months, or sooner with an eligible guarantor.',
      'Lower existing monthly obligations to improve your ratio.',
      'Ask your officer about a smaller amount or a longer tenure.',
    ],
    ctaLabel: 'Reapply for this loan', ctaColor: '#275CB2',
  },
  cancelled: {
    chipLabel: 'Cancelled', chipColor: '#6B7280', chipBg: '#EDEFF2',
    alertBg: '#F9FAFB', alertBorder: '#D1D5DB', alertTitleColor: '#374151',
    alertTitle: 'Approved loan cancelled',
    alertBody: 'This loan was approved on 12 Mar 2026 but later cancelled before disbursement. Nothing was disbursed and there is no impact on your credit record.',
    reasonLabel: 'WHY IT WAS CANCELLED',
    reason: 'The conditions of the conditional approval were not met within the validity period, so the approved loan was not disbursed.',
    bullets: [
      'Start a new request once you can meet the approval conditions.',
      'Ask your branch officer which condition was outstanding.',
      'Documents already on file can be reused for a new application.',
    ],
    ctaLabel: 'Start a new request', ctaColor: '#275CB2',
  },
}

function TerminalDetail({ statusKey, title, refStr }: { statusKey: string; title: string; refStr: string }) {
  const navigate = useNavigate()
  const def = TERMINAL[statusKey]
  if (!def) return null
  const [ref, date] = refStr.split(' · ')
  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, pb: '44px' }}>
        <Box sx={{ px: 1, pt: 1 }}>
          <IconButton onClick={() => navigate('/loan-requests')} aria-label="Back" sx={{ color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pt: 1, pb: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Title row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
            <Typography sx={{ fontSize: 24, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', lineHeight: 1.2 }}>{title}</Typography>
            <Box sx={{ bgcolor: def.chipBg, borderRadius: '999px', px: '10px', py: '4px', flexShrink: 0, mt: '4px' }}>
              <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: def.chipColor }}>{def.chipLabel}</Typography>
            </Box>
          </Box>
          {/* Ref + date */}
          <Typography sx={{ fontSize: 12.5, color: MUTED, mt: -1 }}>Ref: {ref}{date ? ` · Applied ${date}` : ''}</Typography>
          {/* Alert box */}
          <Box sx={{ bgcolor: def.alertBg, border: `1px solid ${def.alertBorder}`, borderRadius: '12px', px: 2, py: 1.75 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: def.alertTitleColor, mb: 0.5 }}>{def.alertTitle}</Typography>
            <Typography sx={{ fontSize: 13, color: def.alertTitleColor, lineHeight: 1.55, opacity: 0.85 }}>{def.alertBody}</Typography>
          </Box>
          {/* Reason box */}
          <Box sx={{ bgcolor: '#F3F4F6', borderRadius: '12px', px: 2, py: 1.75 }}>
            <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.6px', color: MUTED, mb: 0.75 }}>{def.reasonLabel}</Typography>
            <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: HEADING, lineHeight: 1.55 }}>{def.reason}</Typography>
          </Box>
          {/* What you can do */}
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: HEADING, mb: 1.25 }}>What you can do</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {def.bullets.map((b, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                  <Icon name="checkCircle" size={16} color="#16A34A" />
                  <Typography sx={{ fontSize: 13.5, color: HEADING, lineHeight: 1.55, flex: 1 }}>{b}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* CTAs */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 2, pb: '44px', bgcolor: '#F5F5F5', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button variant="contained" fullWidth onClick={() => navigate('/products')} sx={{ height: 52, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: def.ctaColor, '&:hover': { bgcolor: '#1F4F9E' } }}>
          {def.ctaLabel}
        </Button>
        <Button variant="outlined" fullWidth onClick={() => navigate('/loan-requests')} sx={{ height: 52, borderRadius: '14px', fontSize: 15, fontWeight: 700, color: HEADING, borderColor: '#D1D5DB', '&:hover': { bgcolor: '#F3F4F6', borderColor: '#9CA3AF' } }}>
          Back to Requests
        </Button>
      </Box>
    </Box>
  )
}

export default function MyLoanReviewDetailScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [callOpen, setCallOpen] = useState(false)
  const [disbursed, setDisbursed] = useState(false)

  const statusKey = params.get('status') ?? ''
  if (statusKey && TERMINAL[statusKey]) {
    return <TerminalDetail statusKey={statusKey} title={params.get('title') ?? ''} refStr={params.get('ref') ?? ''} />
  }

  const isRestructure = params.get('type') === 'restructure'
  const isPayoff = params.get('type') === 'payoff'
  const title = (isRestructure || isPayoff) ? 'Application in progress' : (params.get('title') ?? 'Request Housing Loan')
  const amount = isRestructure ? '$8,000.00' : isPayoff ? '$3,200.00' : (params.get('amount') ?? '$4,500.00')
  const term = params.get('term') ?? '24 months'
  const rate = params.get('rate') ?? '1.20%/mo'
  const ref = isRestructure ? '026-01285956 · Restructure' : isPayoff ? '026-01285956 · Pay-off' : (params.get('ref') ?? 'NH-2026-04821')
  const requestedOn = (isRestructure || isPayoff) ? '1 Jun 2026' : (params.get('on') ?? '12 Feb 2026')
  const isStaff = !isRestructure && !isPayoff && title === 'Staff Loan'

  const stages = isRestructure
    ? STAGES.map((s, i) => i === STAGES.length - 1 ? { ...s, label: 'Amendment' } : s)
    : isPayoff
    ? STAGES.map((s, i) => i === STAGES.length - 1 ? { ...s, label: 'Loan\nClosed' } : s)
    : STAGES
  const activeIndex = stages.findIndex((s) => s.state === 'active')
  const [sel, setSel] = useState(activeIndex < 0 ? 0 : activeIndex)

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
        {/* Header */}
        <Box sx={{ px: 1, pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton onClick={() => navigate('/loan-requests')} aria-label="Back" sx={{ color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton aria-label="Chat" sx={{ color: HEADING }}>
              <Icon name="message" size={22} color={HEADING} />
            </IconButton>
            <IconButton onClick={() => setCallOpen(true)} aria-label="Call" sx={{ color: HEADING }}>
              <Icon name="phone" size={22} color={HEADING} />
            </IconButton>
          </Box>
        </Box>

        {/* Mascot */}
        <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', mt: -1 }}>
          <AssetImg
            src={asset('illustrations/mascot_inprogress.png')}
            alt=""
            sx={{ height: '100%', width: '100%', objectFit: 'contain' }}
            fallback={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Icon name="clock" size={44} color="#C9D2DE" />
                <Typography sx={{ fontSize: 12, color: '#B4BCC9' }}>mascot_inprogress.png</Typography>
              </Box>
            }
          />
        </Box>

        <Typography sx={{ fontSize: 28, fontWeight: 800, color: HEADING, letterSpacing: '-1px', px: 3, mt: 0.5, lineHeight: 1.15, textAlign: 'center' }}>
          {title}
        </Typography>

        <Box sx={{ px: 3, pt: 2, pb: 5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Restructure banner */}
          {isRestructure && (
            <Box sx={{ bgcolor: '#EFE7FB', border: '1px solid #D4C4F5', borderRadius: '12px', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#7A4DD6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="layers" size={18} color="#fff" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.5px', color: '#5B3BA8' }}>RESTRUCTURE REQUEST</Typography>
                <Typography sx={{ fontSize: 13, color: '#7A4DD6', mt: 0.25 }}>Modifying your existing Small Biz Loan</Typography>
              </Box>
            </Box>
          )}

          {/* Pay-off banner */}
          {isPayoff && (
            <Box sx={{ bgcolor: '#E8F6EF', border: '1px solid #A8DFC0', borderRadius: '12px', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="cash" size={18} color="#fff" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.5px', color: '#166534' }}>PAY-OFF REQUEST</Typography>
                <Typography sx={{ fontSize: 13, color: GREEN, mt: 0.25 }}>Early settlement of your existing loan</Typography>
              </Box>
            </Box>
          )}

          {/* Request amount card */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: 2.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: LABEL }}>REQUEST AMOUNT</Typography>
            <Typography sx={{ fontSize: 36, fontWeight: 800, color: HEADING, letterSpacing: '-1px', lineHeight: 1.1, mt: 0.5 }}>
              {amount}
            </Typography>
            <Box sx={{ height: '1px', bgcolor: '#F0F0F0', my: 1.75 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <MetaCol label="Requested on" value={requestedOn} />
              <MetaCol label="Term" value={term} />
              <MetaCol label="Rate" value={rate} />
            </Box>
          </Box>

          {/* Horizontal step tracker */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: '18px' }}>
            <SectionLabel>APPLICATION TRACKER</SectionLabel>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
              {stages.map((s, i) => {
                const selected = i === sel
                return (
                  <Fragment key={s.key}>
                    <Box
                      role="button"
                      onClick={() => {
                        setSel(i)
                        if (isStaff && i === stages.length - 1) {
                          navigate(`/staff-loan-approved?amount=${encodeURIComponent(amount)}&term=${encodeURIComponent(term)}&rate=${encodeURIComponent(rate)}&ref=${encodeURIComponent(ref)}`)
                        }
                      }}
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, flexShrink: 0, cursor: 'pointer' }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: s.state === 'done' ? GREEN : s.state === 'active' ? BLUE : '#EEF1F5',
                          boxShadow: selected ? `0 0 0 4px ${s.state === 'done' ? 'rgba(31,168,92,0.18)' : s.state === 'pending' ? 'rgba(154,163,178,0.22)' : 'rgba(39,92,178,0.18)'}` : 'none',
                          transition: 'box-shadow 0.2s',
                        }}
                      >
                        {s.state === 'done' ? (
                          <Icon name="check" size={17} color="#fff" />
                        ) : (
                          <Typography sx={{ fontSize: 14, fontWeight: 800, color: s.state === 'active' ? '#fff' : PEND }}>{i + 1}</Typography>
                        )}
                      </Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: s.state === 'pending' ? PEND : '#3A4256', textAlign: 'center', mt: 0.5, lineHeight: 1.2, whiteSpace: 'pre-line' }}>{s.label}</Typography>
                    </Box>
                    {i < stages.length - 1 && (
                      <Box sx={{ flex: 1, height: 3, mt: '16px', mx: 0.25, borderRadius: '2px', position: 'relative', bgcolor: s.state === 'done' ? GREEN : '#E2E6EC' }}>
                        {s.state === 'active' && (
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: '50%',
                              transform: 'translate(-3px, -50%)',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: BLUE,
                              animation: 'trackerPulse 1.2s ease-in-out infinite',
                              '@keyframes trackerPulse': {
                                '0%, 100%': { boxShadow: '0 0 0 0 rgba(39,92,178,0.45)' },
                                '50%': { boxShadow: '0 0 0 5px rgba(39,92,178,0)' },
                              },
                            }}
                          />
                        )}
                      </Box>
                    )}
                  </Fragment>
                )
              })}
            </Box>
            <Typography sx={{ fontSize: 12, color: MUTED, textAlign: 'center', mt: 1.5 }}>Tap a stage to preview the tracker</Typography>
          </Box>

          {/* Officer — not shown for Staff Loan */}
          {!isStaff && (
            <Box>
              <SectionLabel>HAVE QUESTIONS? YOUR OFFICER</SectionLabel>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '16px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: '#E7F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: BLUE }}>SP</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: HEADING }}>Sok Pisey</Typography>
                  <Typography sx={{ fontSize: 12.5, color: MUTED }}>Credit Officer · Toul Kork Branch</Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setCallOpen(true)}
                  startIcon={<Icon name="phone" size={16} />}
                  sx={{ height: 40, borderRadius: '10px', px: 2, fontSize: 14, fontWeight: 700, bgcolor: GREEN, '&:hover': { bgcolor: '#198C4C' } }}
                >
                  Call
                </Button>
              </Box>
            </Box>
          )}

        </Box>
      </Box>


      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />

      {/* Disbursement success popup */}
      {disbursed && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 200, bgcolor: 'rgba(11,15,26,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
          <Box
            sx={{
              bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '20px', p: '28px 24px', width: '100%', maxWidth: 320, textAlign: 'center',
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
