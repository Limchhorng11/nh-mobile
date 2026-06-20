import { Fragment, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon, type IconName } from '../../components/Icon'
import { AssetImg, asset } from '../../components/home/media'
import CallSheet from '../../components/CallSheet'
import { TRACK_STAGES as STAGES } from '../../workspace/tracking'

const BLUE = '#275CB2'
const GREEN = '#1FA85C'
const MUTED = '#8A94A6'
const HEADING = '#0B0F1A'
const LABEL = '#737373'
const PEND = '#9AA3B2'

type ReqKind = 'restructure' | 'payoff'
const REQ_META: Record<ReqKind, { icon: IconName; badge: string; sub: string; finalLabel: string; finalInfo: string; solid: string; deep: string; soft1: string; soft2: string; border: string; subText: string; shadow: string }> = {
  restructure: { icon: 'layers', badge: 'RESTRUCTURE REQUEST', sub: 'Modifying your existing Small Biz Loan', finalLabel: 'New Terms\nTake Effect', finalInfo: 'New terms take effect once approved', solid: '#7A4DD6', deep: '#6D3BD1', soft1: '#F4EEFD', soft2: '#EBE0FB', border: '#E0D2F7', subText: '#8A6FC4', shadow: 'rgba(122,77,214,0.15)' },
  payoff: { icon: 'cash', badge: 'PAY-OFF REQUEST', sub: 'Early settlement of your existing loan', finalLabel: 'Loan\nClosed', finalInfo: 'Loan closes once settlement is approved', solid: '#1FA85C', deep: '#16804A', soft1: '#EAF7EF', soft2: '#D9F0E2', border: '#BFE6CF', subText: '#5B9E78', shadow: 'rgba(31,168,92,0.15)' },
}

type Chip = { label: string; color: string; bg: string }
type Step = { title: string; sub: string; state: 'done' | 'current' | 'pending'; desc?: string; chips?: Chip[] }

function buildTimeline(stages: typeof STAGES, finalLabel?: string): Step[] {
  return stages.map((s) => {
    const state: Step['state'] = s.state === 'done' ? 'done' : s.state === 'active' ? 'current' : 'pending'
    switch (s.key) {
      case 'application':
        return { title: 'Application Received', sub: state === 'done' ? 'Submitted · 1 Jun 2026' : 'Pending', state }
      case 'assessment':
        return {
          title: 'Assessment',
          sub: state === 'current' ? 'In progress · Est. 1–2 business days' : state === 'done' ? 'Completed' : 'Pending assessment',
          desc: state === 'current' ? 'Our team is reviewing your application, including a credit bureau check.' : undefined,
          state,
        }
      case 'decision':
        return {
          title: 'Decision',
          sub: 'Pending assessment',
          chips: [
            { label: 'Approved', color: '#1FA85C', bg: '#DCF5E6' },
            { label: 'Rejected', color: '#E11D48', bg: '#FDE7EC' },
            { label: 'Cancelled', color: '#C47F11', bg: '#FBEBC6' },
          ],
          state,
        }
      case 'approve':
        return { title: finalLabel ?? 'Disbursement', sub: 'Released after approval', state }
      default:
        return { title: s.label, sub: s.info, state }
    }
  })
}

function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 11.5, color: LABEL, lineHeight: 1.3 }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING, mt: 0.25 }}>{value}</Typography>
    </Box>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: MUTED, mb: 1.5 }}>
      {children}
    </Typography>
  )
}

function TimelineRow({ step, last }: { step: Step; last: boolean }) {
  const done = step.state === 'done'
  const current = step.state === 'current'
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
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

export default function MwlTrackerScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const ref = params.get('ref') ?? 'APP-2024-00412'
  const tag = params.get('tag') ?? 'MWL'
  const amount = params.get('amount') ?? '$4,500.00'
  const term = params.get('term') ?? '24 months'
  const rate = params.get('rate') ?? '1.20%/mo'
  const requestedOn = params.get('on') ?? '1 Jun 2026'

  const t = tag.toLowerCase()
  const kind: ReqKind | null = t.includes('restructure') ? 'restructure' : t.includes('pay') ? 'payoff' : null
  const meta = kind ? REQ_META[kind] : null

  const stages = meta
    ? STAGES.map((s) => (s.key === 'approve' ? { ...s, label: meta.finalLabel, info: meta.finalInfo } : s))
    : STAGES

  const timeline = buildTimeline(stages, meta?.finalLabel)
  const activeIndex = stages.findIndex((s) => s.state === 'active')
  const [sel, setSel] = useState(activeIndex < 0 ? 0 : activeIndex)
  const [callOpen, setCallOpen] = useState(false)

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, pb: '44px' }}>
        {/* Header */}
        <Box sx={{ px: 1, pt: 1 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
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
          Application in progress
        </Typography>

        <Box sx={{ px: 3, pt: 2, pb: 5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Status + ref */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Box sx={{ bgcolor: '#D8E9FF', borderRadius: '999px', px: '9px', py: '3px' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: BLUE }}>In progress</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: LABEL, letterSpacing: '0.5px' }}>
              {ref} · {tag}
            </Typography>
          </Box>

          {/* REQ_META badge */}
          {meta && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.25,
                background: `linear-gradient(135deg, ${meta.soft1} 0%, ${meta.soft2} 100%)`,
                border: `1px solid ${meta.border}`,
                borderRadius: '14px',
                px: 1.75,
                py: 1.25,
                boxShadow: `0 4px 14px ${meta.shadow}`,
                alignSelf: 'center',
              }}
            >
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: meta.solid, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={meta.icon} size={18} color="#fff" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: meta.deep, letterSpacing: '0.3px', lineHeight: 1.2 }}>{meta.badge}</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: meta.subText, lineHeight: 1.3 }}>{meta.sub}</Typography>
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
                      onClick={() => { setSel(i); if (s.key === 'approve') navigate('/mwl-contract') }}
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
            {/* Selected stage info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, bgcolor: '#EAF1FC', borderRadius: '10px', px: 1.5, py: 1.25 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: BLUE, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#2B4A7E' }}>{stages[sel].info}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: MUTED, textAlign: 'center', mt: 1.5 }}>Tap a stage to preview the tracker</Typography>
          </Box>

          {/* Officer in charge */}
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
        </Box>
      </Box>

      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />
    </Box>
  )
}
