import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../components/Icon'
import { MwlHeader } from './mwl/MwlParts'
import { Card, StatusChip } from '../components/home/HomeParts'

const BLUE    = '#275CB2'
const GREEN   = '#76C043'
const LABEL   = '#8A94A6'
const HEADING = '#0B0F1A'
const CARD_SX = {
  bgcolor: '#fff',
  borderRadius: '16px',
  border: '1px solid #E8EAEE',
  p: 2,
}

// ── Section header (matches SectionLabel pattern in HomeParts) ──────────────
function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
      <Icon name={icon as any} size={14} color={LABEL} />
      <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: LABEL }}>
        {label.toUpperCase()}
      </Typography>
    </Box>
  )
}

// ── Stat tile ───────────────────────────────────────────────────────────────
function Stat({ label, value, sub, valueColor = HEADING, bg = '#F5F7FA' }: {
  label: string; value: string; sub?: string; valueColor?: string; bg?: string
}) {
  return (
    <Box sx={{ bgcolor: bg, borderRadius: '12px', p: '12px 14px' }}>
      <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.5px', color: LABEL }}>{label}</Typography>
      <Typography sx={{ fontSize: 17, fontWeight: 800, color: valueColor, mt: 0.25, lineHeight: 1.2 }}>{value}</Typography>
      {sub && <Typography sx={{ fontSize: 11, color: LABEL, mt: 0.25 }}>{sub}</Typography>}
    </Box>
  )
}

// ── Upcoming due item ────────────────────────────────────────────────────────
function DueItem({ day, month, dotColor, title, sub, amount, amountColor, overdue, onClick }: {
  day: string; month: string; dotColor: string; title: string; sub: string; amount: string; amountColor: string; overdue?: boolean; onClick?: () => void
}) {
  return (
    <Box
      role="button"
      onClick={onClick}
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:active': { opacity: 0.7 } }}
    >
      <Box sx={{ width: 42, height: 42, borderRadius: '10px', bgcolor: dotColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{day}</Typography>
        <Typography sx={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>{month}</Typography>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING }} noWrap>{title}</Typography>
        <Typography sx={{ fontSize: 11.5, color: LABEL }}>{sub}</Typography>
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 800, color: amountColor, flexShrink: 0 }}>{amount}</Typography>
      <Icon name="chevronRight" size={16} color="#C9D2DE" />
    </Box>
  )
}

// ── Active-style loan card (same as My Loans screen) ─────────────────────────
function ActiveStyleLoanCard({ title, icon, status, restructured }: { title: string; icon: any; status?: 'overdue'; restructured?: boolean }) {
  const navigate = useNavigate()
  return (
    <Card onClick={() => navigate(status === 'overdue' ? '/my-loan-detail?overdue=true' : '/my-loan-detail')} sx={{ cursor: 'pointer', p: '16px' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#EEF1FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={icon} size={22} color={BLUE} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING }} noWrap>{title}</Typography>
            {(restructured || status === 'overdue') && (
              <Box sx={{ mt: '4px', display: 'inline-flex', gap: 0.5 }}>
                {restructured && <StatusChip label="1st Restructured" color="#7A4DD6" bg="#EFE7FB" />}
                {status === 'overdue' && <StatusChip label="Overdue" color="#E8770B" bg="#FFF1E6" />}
              </Box>
            )}
          </Box>
          <StatusChip label="Active" color="#1FA85C" bg="#DCF5E6" />
          <Icon name="chevronRight" size={18} color="#C9D2DE" />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography sx={{ fontSize: 12, color: LABEL }}>8 of 24 paid</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#3A4256' }}>33%</Typography>
          </Box>
          <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#E7ECF2', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: '33%', bgcolor: BLUE, borderRadius: 3 }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography sx={{ fontSize: 12.5, color: LABEL }}>Next due · 20 May</Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: HEADING }}>$4,500.00 left</Typography>
        </Box>
      </Box>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function PortfolioSummaryScreen() {
  const navigate = useNavigate()
  const goToRestructure = () => navigate('/my-loan-review')

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <MwlHeader onBack={() => navigate(-1)} />
      <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', px: 3, pb: 1, mt: -1 }}>
        Portfolio Summary
      </Typography>

      <Box className="scroll-content" sx={{ flex: 1, px: 3, pt: 2.5, pb: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* ── Portfolio overview ──────────────────────────────────────────── */}
        <Box>
          <SectionHeader icon="trendingDown" label="Portfolio overview" />
          <Box sx={CARD_SX}>
            {/* Donut + legend row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
                <Box component="svg" width={84} height={84} viewBox="0 0 84 84">
                  <circle cx={42} cy={42} r={32} fill="none" stroke="#EAECF0" strokeWidth={10} />
                  <circle cx={42} cy={42} r={32} fill="none" stroke={BLUE} strokeWidth={10}
                    strokeDasharray={`${2 * Math.PI * 32 * 0.41} ${2 * Math.PI * 32 * 0.59}`}
                    strokeDashoffset={2 * Math.PI * 32 * 0.25} strokeLinecap="round" />
                  <circle cx={42} cy={42} r={32} fill="none" stroke={GREEN} strokeWidth={10}
                    strokeDasharray={`${2 * Math.PI * 32 * 0.59} ${2 * Math.PI * 32 * 0.41}`}
                    strokeDashoffset={2 * Math.PI * 32 * (0.25 - 0.41)} strokeLinecap="round" />
                </Box>
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 800, color: GREEN, lineHeight: 1 }}>59%</Typography>
                  <Typography sx={{ fontSize: 8.5, color: LABEL, lineHeight: 1.3, textAlign: 'center' }}>outstanding</Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { dot: '#C8CDD6', label: 'Total approved', usd: '$108,040', khr: '៛442,964,000' },
                  { dot: BLUE,      label: 'Paid to date',   usd: '$44,070',  khr: '៛180,687,000' },
                  { dot: GREEN,     label: 'Outstanding',    usd: '$63,970',  khr: '៛262,277,000' },
                ].map((r) => (
                  <Box key={r.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: r.dot, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#8A94A6' }}>{r.label}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 800, color: HEADING, lineHeight: 1.3 }}>{r.usd}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Stats strip — 1 row 3 columns */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
              {[
                { label: 'Active loans',   value: '3',    valueColor: BLUE },
                { label: 'Installments',   value: '22',   valueColor: HEADING },
                { label: 'Due this month', value: '$270', valueColor: '#C0392B' },
              ].map((s) => (
                <Box key={s.label} sx={{ bgcolor: '#F5F7FA', borderRadius: '12px', p: '12px 8px', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px', color: '#8A94A6', mb: 0.75 }}>{s.label.toUpperCase()}</Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: s.valueColor, lineHeight: 1.1 }}>{s.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── Payment performance ─────────────────────────────────────────── */}
        <Box>
          <SectionHeader icon="checkCircle" label="Payment performance" />
          <Box sx={CARD_SX}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {/* Mini ring */}
              <Box sx={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                <Box component="svg" width={64} height={64} viewBox="0 0 64 64">
                  <circle cx={32} cy={32} r={24} fill="none" stroke="#EAECF0" strokeWidth={7} />
                  <circle cx={32} cy={32} r={24} fill="none" stroke={GREEN} strokeWidth={7}
                    strokeDasharray={`${2 * Math.PI * 24} 0`}
                    strokeDashoffset={2 * Math.PI * 24 * 0.25} strokeLinecap="round" />
                </Box>
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: GREEN, lineHeight: 1 }}>100%</Typography>
                  <Typography sx={{ fontSize: 8.5, color: LABEL, lineHeight: 1.3 }}>on-time</Typography>
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING, lineHeight: 1.2 }}>Excellent</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: GREEN, mt: 0.25 }}>Perfect payment record</Typography>
                <Typography sx={{ fontSize: 11.5, color: LABEL, mt: 0.5, lineHeight: 1.5 }}>
                  All 22 payments on time — strengthens your credit standing.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
              {[
                { label: 'Payments made', value: '22', color: HEADING },
                { label: 'On time',       value: '22', color: GREEN   },
                { label: 'Missed / late', value: '0',  color: LABEL   },
              ].map((s) => (
                <Box key={s.label} sx={{ bgcolor: '#F5F7FA', borderRadius: '12px', p: '12px 8px', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px', color: '#8A94A6', mb: 0.75 }}>{s.label.toUpperCase()}</Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── Upcoming obligations ────────────────────────────────────────── */}
        <Box>
          <SectionHeader icon="calendar" label="Upcoming obligations" />
          <Box sx={CARD_SX}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontSize: 12, color: LABEL }}>Next 3 due payments</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: HEADING }}>Total: $1,703.00</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { day: '20', month: 'JUN', dotColor: GREEN,      title: 'Migrant Worker Loan', sub: 'Installment 6 of 18',   amount: '$270.00',   amountColor: GREEN,      onClick: () => navigate('/my-loan-detail') },
                { day: '05', month: 'JUL', dotColor: '#E8770B',  title: 'Housing Loan',        sub: 'Installment 49 of 120', amount: '$1,083.00', amountColor: '#C0392B', onClick: () => navigate('/my-loan-detail?overdue=true') },
                { day: '15', month: 'JUL', dotColor: BLUE,       title: 'Small Biz Loan',      sub: 'Installment 9 of 24',  amount: '$350.00',   amountColor: BLUE,       onClick: () => navigate('/my-loan-detail') },
              ].map((item, i) => (
                <Box key={item.title} sx={{ py: 1.5, borderTop: i > 0 ? '1px solid #F0F2F5' : 'none' }}>
                  <DueItem {...item} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  )
}
