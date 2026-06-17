import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../components/Icon'
import CallSheet from '../components/CallSheet'
import { MwlHeader } from './mwl/MwlParts'

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

type Step = { title: string; sub: string; state: 'done' | 'current' | 'pending' }
const TIMELINE: Step[] = [
  { title: 'Submitted', sub: '19 May, 14:22', state: 'done' },
  { title: 'Documents reviewed', sub: '20 May, 09:14', state: 'done' },
  { title: 'Credit assessment', sub: 'In progress · CBC + LOS check', state: 'current' },
  { title: 'Final approval decision', sub: 'Pending', state: 'pending' },
  { title: 'Disbursement', sub: 'Pending', state: 'pending' },
]

const EST_HEAD = ['ចំនួនខែ', 'ប្រាក់ដើម', 'ការប្រាក់', 'ប្រាក់សរុបត្រូវបង់', 'សមតុល្យប្រាក់ដើម']
const EST_ROWS = [
  ['0', '$0.00', '$0.00', '$0.00', '$500.00'],
  ['1', '$38.99', '$6.00', '$44.99', '$461.01'],
  ['2', '$39.46', '$5.53', '$44.99', '$421.56'],
]
const EST_TOTAL = ['សរុប', '$500.00', '$39.85', '$539.85', '']

export default function MyLoanReviewDetailScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [callOpen, setCallOpen] = useState(false)

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

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
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

          {/* Payment estimate */}
          <Box>
            <SectionLabel>Payment Estimate</SectionLabel>
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden', mt: 1.25 }}>
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <Box component="thead">
                  <Box component="tr">
                    {EST_HEAD.map((h, i) => (
                      <Box
                        component="th"
                        key={h}
                        sx={{
                          fontFamily: KH,
                          fontSize: 9.5,
                          fontWeight: 600,
                          color: LABEL,
                          textAlign: i === 0 ? 'center' : 'right',
                          verticalAlign: 'top',
                          px: '6px',
                          py: '12px',
                          lineHeight: 1.3,
                          width: i === 0 ? 34 : undefined,
                          borderBottom: '1px solid #F0F0F0',
                        }}
                      >
                        {h}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box component="tbody">
                  {EST_ROWS.map((row) => (
                    <Box component="tr" key={row[0]} sx={{ borderBottom: '1px solid #F4F4F4' }}>
                      {row.map((cell, ci) => (
                        <Box
                          component="td"
                          key={ci}
                          sx={{
                            fontSize: 11.5,
                            fontWeight: ci === 3 ? 700 : 500,
                            color: ci === 0 ? LABEL : ci === 3 ? HEADING : '#3A4256',
                            textAlign: ci === 0 ? 'center' : 'right',
                            px: '6px',
                            py: '12px',
                          }}
                        >
                          {cell}
                        </Box>
                      ))}
                    </Box>
                  ))}
                  <Box component="tr" sx={{ bgcolor: '#FAFBFC' }}>
                    {EST_TOTAL.map((cell, ci) => (
                      <Box
                        component="td"
                        key={ci}
                        sx={{
                          fontFamily: ci === 0 ? KH : 'inherit',
                          fontSize: ci === 0 ? 11 : 11.5,
                          fontWeight: 700,
                          color: BLUE,
                          textAlign: ci === 0 ? 'center' : 'right',
                          px: '6px',
                          py: '12px',
                        }}
                      >
                        {cell}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 11, color: LABEL, textAlign: 'center', mt: 1.25 }}>
              Showing 3 of 6 · <Box component="span" sx={{ color: ACCENT, fontWeight: 700 }}>Download</Box> for full view
            </Typography>
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
              </Box>
            </Box>
          </Box>
          )}
        </Box>
      </Box>

      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />
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
      <Box sx={{ pb: last ? 0 : 2 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: step.state === 'pending' ? '#9AA3B2' : HEADING, lineHeight: 1.2 }}>
          {step.title}
        </Typography>
        <Typography sx={{ fontSize: 13, color: LABEL, mt: 0.25 }}>{step.sub}</Typography>
      </Box>
    </Box>
  )
}
