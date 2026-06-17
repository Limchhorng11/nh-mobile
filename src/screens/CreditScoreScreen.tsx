import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon, type IconName } from '../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../components/CollapsingHeader'
import { useFlow } from '../workspace/FlowContext'

// ─────────────────────────────────────────────────────────────────────────────
// Credit Score — a member's NHFC credit health, opened from the More menu.
// Shows an at-a-glance gauge, the rating band, the factors driving the score,
// and a short history. Prototype data only.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

const SCORE = 742
const SCORE_MIN = 300
const SCORE_MAX = 850

// Rating bands across the full range (low → high).
const BANDS = [
  { label: 'Poor', from: 300, to: 579, color: '#E5484D' },
  { label: 'Fair', from: 580, to: 669, color: '#F5A623' },
  { label: 'Good', from: 670, to: 739, color: '#E8C100' },
  { label: 'Very Good', from: 740, to: 799, color: '#2E9E5B' },
  { label: 'Excellent', from: 800, to: 850, color: '#1B8048' },
]

function bandFor(score: number) {
  return BANDS.find((b) => score >= b.from && score <= b.to) ?? BANDS[0]
}

type FactorStatus = 'Excellent' | 'Good' | 'Fair' | 'Poor'
const STATUS_COLOR: Record<FactorStatus, string> = {
  Excellent: '#1B8048',
  Good: '#2E9E5B',
  Fair: '#F5A623',
  Poor: '#E5484D',
}

type Factor = { icon: IconName; label: string; detail: string; status: FactorStatus }
const FACTORS: Factor[] = [
  { icon: 'checkCircle', label: 'Payment history', detail: '100% on-time payments', status: 'Excellent' },
  { icon: 'pay', label: 'Credit utilization', detail: 'Using 28% of available credit', status: 'Good' },
  { icon: 'clock', label: 'Length of credit', detail: '3 yrs 4 mo average age', status: 'Fair' },
  { icon: 'layers', label: 'Loan mix', detail: '2 active loan types', status: 'Good' },
  { icon: 'search', label: 'Recent inquiries', detail: '1 in the last 12 months', status: 'Excellent' },
]

const HISTORY = [
  { month: 'Jun', score: 742 },
  { month: 'May', score: 731 },
  { month: 'Apr', score: 728 },
  { month: 'Mar', score: 715 },
  { month: 'Feb', score: 709 },
  { month: 'Jan', score: 698 },
]

export default function CreditScoreScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const { flow } = useFlow()
  const band = bandFor(SCORE)
  const delta = HISTORY[0].score - HISTORY[1].score
  // A credit score is built from repayment history. Only Borrowers (with active
  // loans) have one; Visitors and Applicants haven't — show an empty state.
  const noScore = flow !== 'Borrower'

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, pb: '44px' }} onScroll={onScroll}>
        <CollapsingHeader title="Credit Score" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"Credit Score"}</CollapsingTitle>

        {noScore ? (
          <EmptyState onApply={() => navigate('/products')} />
        ) : (
        <Box sx={{ px: 3, pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Score card */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '18px', pt: 3, pb: 2.5, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Gauge score={SCORE} color={band.color} label={band.label} />

            {/* Delta + updated */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5, bgcolor: '#EAF6EE', borderRadius: '999px', px: 1.5, py: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', transform: 'rotate(180deg)' }}>
                <Icon name="trendingDown" size={16} color="#1B8048" />
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1B8048' }}>
                +{delta} pts this month
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: MUTED, mt: 1 }}>Updated 12 Jun 2026 · refreshed monthly</Typography>
          </Box>

          {/* Range bar */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING, mb: 1.5 }}>Where you stand</Typography>
            <RangeBar score={SCORE} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography sx={{ fontSize: 11.5, color: MUTED }}>{SCORE_MIN}</Typography>
              <Typography sx={{ fontSize: 11.5, color: MUTED }}>{SCORE_MAX}</Typography>
            </Box>
          </Box>

          {/* Factors */}
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1 }}>
              WHAT AFFECTS YOUR SCORE
            </Typography>
            <Box sx={{ bgcolor: '#fff', borderRadius: '14px', overflow: 'hidden' }}>
              {FACTORS.map((f, i) => (
                <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.75, px: '14px', py: '13px', borderBottom: i < FACTORS.length - 1 ? '1px solid #F1F4F8' : 'none' }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#F1F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={f.icon} size={19} color="#1A1A1A" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING }} noWrap>{f.label}</Typography>
                    <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }} noWrap>{f.detail}</Typography>
                  </Box>
                  <Box sx={{ flexShrink: 0, bgcolor: STATUS_COLOR[f.status] + '1A', borderRadius: '999px', px: 1.25, py: 0.4 }}>
                    <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: STATUS_COLOR[f.status] }}>{f.status}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* History */}
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1 }}>
              6-MONTH HISTORY
            </Typography>
            <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: 2.5 }}>
              <HistoryChart data={HISTORY} color={band.color} />
            </Box>
          </Box>

          {/* Footnote */}
          <Typography sx={{ fontSize: 11.5, color: '#B6BDC8', textAlign: 'center', lineHeight: 1.5, px: 1 }}>
            Your NHFC score is an estimate based on your account activity. It does not affect your credit bureau rating.
          </Typography>
        </Box>
        )}
      </Box>
    </Box>
  )
}

// ─── Empty state — no score yet (Visitor / Applicant) ────────────────────────
function EmptyState({ onApply }: { onApply: () => void }) {
  return (
    <Box sx={{ px: 3, pt: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ bgcolor: '#fff', borderRadius: '18px', px: 3, py: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#EEF3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
          <Icon name="gauge" size={38} color="#9FB6DC" />
        </Box>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: HEADING }}>No credit score yet</Typography>
        <Typography sx={{ fontSize: 13.5, color: MUTED, mt: 1, maxWidth: 260, lineHeight: 1.55 }}>
          Your score is built from your loan repayment history. Once you have an active loan and start making payments, your score will appear here.
        </Typography>
        <Button
          variant="contained"
          onClick={onApply}
          endIcon={<Icon name="arrowRight" size={18} />}
          sx={{ mt: 3, height: 48, borderRadius: '12px', px: 3, fontSize: 15, fontWeight: 700, boxShadow: 'none' }}
        >
          Explore loans
        </Button>
      </Box>

      {/* What you can do to build a score */}
      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1, mt: 1 }}>
        HOW TO BUILD YOUR SCORE
      </Typography>
      <Box sx={{ bgcolor: '#fff', borderRadius: '14px', overflow: 'hidden' }}>
        {[
          { icon: 'pay' as IconName, label: 'Take out a loan', detail: 'Apply and get approved for your first loan' },
          { icon: 'checkCircle' as IconName, label: 'Pay on time', detail: 'On-time repayments are the biggest factor' },
          { icon: 'calendarClock' as IconName, label: 'Build history', detail: 'Your score grows as your record lengthens' },
        ].map((s, i, arr) => (
          <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.75, px: '14px', py: '13px', borderBottom: i < arr.length - 1 ? '1px solid #F1F4F8' : 'none' }}>
            <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#F1F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={s.icon} size={19} color="#1A1A1A" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>{s.detail}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

// ─── Semicircular score gauge ────────────────────────────────────────────────
function Gauge({ score, color, label }: { score: number; color: string; label: string }) {
  const W = 240
  const H = 138
  const cx = W / 2
  const cy = 128
  const r = 100
  const frac = Math.max(0, Math.min(1, (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)))

  // Point on the top semicircle at fraction f (0 = left, 1 = right).
  const point = (f: number) => {
    const angle = Math.PI - f * Math.PI // π (left) → 0 (right)
    return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) }
  }
  const start = point(0)
  const end = point(1)
  const cur = point(frac)
  const bg = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`
  // The progress arc spans frac·180° — always ≤ 180°, so the large-arc flag is
  // always 0 (the minor arc over the top). A 1 here would draw the long way round.
  const fg = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${cur.x} ${cur.y}`

  return (
    <Box sx={{ position: 'relative', width: W, height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <path d={bg} fill="none" stroke="#EDEFF3" strokeWidth={16} strokeLinecap="round" />
        <path d={fg} fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" />
        {/* End-of-progress knob */}
        <circle cx={cur.x} cy={cur.y} r={7} fill="#fff" stroke={color} strokeWidth={3} />
      </svg>
      {/* Center readout */}
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', pb: 0.5 }}>
        <Typography sx={{ fontSize: 46, fontWeight: 800, color: HEADING, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{score}</Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color, mt: 0.5 }}>{label}</Typography>
      </Box>
    </Box>
  )
}

// ─── Horizontal range bar with marker ────────────────────────────────────────
function RangeBar({ score }: { score: number }) {
  const frac = Math.max(0, Math.min(1, (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)))
  return (
    <Box sx={{ position: 'relative', pt: 2.5 }}>
      <Box sx={{ display: 'flex', height: 10, borderRadius: '999px', overflow: 'hidden' }}>
        {BANDS.map((b) => (
          <Box key={b.label} sx={{ flex: b.to - b.from, bgcolor: b.color }} />
        ))}
      </Box>
      {/* Marker */}
      <Box sx={{ position: 'absolute', top: 0, left: `${frac * 100}%`, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ bgcolor: HEADING, color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: '6px', px: 0.75, py: 0.25, fontVariantNumeric: 'tabular-nums' }}>{score}</Box>
        <Box sx={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${HEADING}` }} />
      </Box>
    </Box>
  )
}

// ─── Mini 6-month bar chart ───────────────────────────────────────────────────
function HistoryChart({ data, color }: { data: { month: string; score: number }[]; color: string }) {
  const ordered = [...data].reverse() // oldest → newest, left → right
  const values = ordered.map((d) => d.score)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(1, max - min)
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1, height: 120 }}>
      {ordered.map((d, i) => {
        const isLast = i === ordered.length - 1
        const h = 28 + ((d.score - min) / span) * 64 // 28–92px
        return (
          <Box key={d.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: isLast ? color : MUTED, fontVariantNumeric: 'tabular-nums' }}>{d.score}</Typography>
            <Box sx={{ width: '100%', maxWidth: 26, height: h, borderRadius: '7px', bgcolor: isLast ? color : '#E3E8EF' }} />
            <Typography sx={{ fontSize: 11, color: MUTED }}>{d.month}</Typography>
          </Box>
        )
      })}
    </Box>
  )
}
