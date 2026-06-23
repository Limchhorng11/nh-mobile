import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../components/Icon'
import { MwlHeader } from './mwl/MwlParts'

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

// ── Loan breakdown card ──────────────────────────────────────────────────────
function LoanCard({ icon, title, loanRef, tag, tagColor, tagBg, left, leftLabel, pct, pctLabel, alert, onAlertClick }: {
  icon: any; title: string; loanRef: string; tag: string; tagColor: string; tagBg: string;
  left: string; leftLabel: string; pct: string; pctLabel: string; alert?: string; onAlertClick?: () => void
}) {
  return (
    <Box sx={CARD_SX}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#EEF1FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={icon} size={18} color={BLUE} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: HEADING, lineHeight: 1.2 }}>{title}</Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: tagBg, borderRadius: '999px', px: '10px', py: '3px', flexShrink: 0 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: tagColor }}>{tag}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
        <Typography sx={{ fontSize: 11.5, color: LABEL }}>{leftLabel}</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 800, color: BLUE }}>{left}</Typography>
      </Box>
      <Box sx={{ height: 5, borderRadius: 3, bgcolor: '#EAECF0', overflow: 'hidden', mb: 0.5 }}>
        <Box sx={{ height: '100%', width: pct, bgcolor: BLUE, borderRadius: 3 }} />
      </Box>
      <Typography sx={{ fontSize: 11, color: LABEL }}>{pctLabel}</Typography>

      {alert && (
        <Box onClick={onAlertClick} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, pt: 1.25, borderTop: '1px solid #F0F2F5', cursor: onAlertClick ? 'pointer' : 'default' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Icon name="clock" size={13} color="#C2870F" />
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#C2870F' }}>{alert}</Typography>
          </Box>
          <Icon name="chevronRight" size={15} color={LABEL} />
        </Box>
      )}
    </Box>
  )
}

// ── Upcoming due item ────────────────────────────────────────────────────────
function DueItem({ day, month, dotColor, title, sub, amount, amountColor }: {
  day: string; month: string; dotColor: string; title: string; sub: string; amount: string; amountColor: string
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ width: 42, height: 42, borderRadius: '10px', bgcolor: dotColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{day}</Typography>
        <Typography sx={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>{month}</Typography>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING }} noWrap>{title}</Typography>
        <Typography sx={{ fontSize: 11.5, color: LABEL }}>{sub}</Typography>
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 800, color: amountColor, flexShrink: 0 }}>{amount}</Typography>
    </Box>
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
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.875 }}>
                {[
                  { dot: '#EAECF0', label: 'Total approved', value: '≈ $108,040' },
                  { dot: BLUE,      label: 'Paid to date',   value: '≈ $44,070'  },
                  { dot: GREEN,     label: 'Outstanding',    value: '≈ $63,970'  },
                ].map((r) => (
                  <Box key={r.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: r.dot, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 11.5, color: '#3A4256' }}>{r.label}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: HEADING }}>{r.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Stats grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Stat label="ACTIVE LOANS"       value="3"           sub="SBL · MWL · MB"              valueColor={BLUE}      bg="#EEF3FC" />
              <Stat label="PORTFOLIO HEALTH"   value="Good"        sub="1 restructuring in review"   valueColor="#1A8A4C"   bg="#EAF6EF" />
              <Stat label="TOTAL INSTALLMENTS" value="22"          sub="of 66 paid"                  valueColor={HEADING}  bg="#F5F7FA" />
              <Stat label="DUE THIS MONTH"     value="៛1,107,000" sub="1 payment pending"            valueColor="#C0392B"  bg="#FDF0EF" />
            </Box>
          </Box>
        </Box>

        {/* ── Loan breakdown ──────────────────────────────────────────────── */}
        <Box>
          <SectionHeader icon="layers" label="Loan breakdown" />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <LoanCard
              icon="store" title="Small Biz Loan" loanRef="SBL · 026-01285956"
              tag="Just paid" tagColor={BLUE} tagBg="#EEF3FC"
              leftLabel="Paid $2,800 of $4,900" left="$2,100 left"
              pct="33%" pctLabel="33% · 8 of 24"
              alert="Restructuring · Under Assessment"
              onAlertClick={goToRestructure}
            />
            <LoanCard
              icon="plane" title="Migrant Worker Loan" loanRef="MWL · 026-01285959 · KHR"
              tag="On track" tagColor="#1A8A4C" tagBg="#EAF6EF"
              leftLabel="Paid ៛5,207,000 of ៛12,874,000" left="៛7,667,000 left"
              pct="28%" pctLabel="28% · 5 of 18"
            />
            <LoanCard
              icon="home" title="Housing Loan" loanRef="HL · 026-01285963"
              tag="Just paid" tagColor={BLUE} tagBg="#EEF3FC"
              leftLabel="Paid $40,000 of $100,000" left="$60,000 left"
              pct="40%" pctLabel="40% · 48 of 120"
            />
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
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: HEADING, lineHeight: 1.2 }}>Excellent</Typography>
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
                <Box key={s.label} sx={{ bgcolor: '#F5F7FA', borderRadius: '10px', p: '10px', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 17, fontWeight: 800, color: s.color, lineHeight: 1.2 }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: 10.5, color: LABEL, mt: 0.25, lineHeight: 1.3 }}>{s.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── Upcoming obligations ────────────────────────────────────────── */}
        <Box>
          <SectionHeader icon="calendar" label="Upcoming obligations" />
          <Box sx={CARD_SX}>
            <Typography sx={{ fontSize: 12, color: LABEL, mb: 1.5 }}>Next 3 due payments</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <DueItem day="20" month="JUN" dotColor={GREEN}   title="Migrant Worker Loan" sub="Installment 6 of 18"   amount="$270.00"   amountColor={GREEN}   />
              <DueItem day="05" month="JUL" dotColor="#E8770B" title="Housing Loan"         sub="Installment 49 of 120" amount="$1,083.00" amountColor="#C0392B" />
              <DueItem day="15" month="JUL" dotColor={BLUE}    title="Small Biz Loan"       sub="Installment 9 of 24"  amount="$350.00"   amountColor={BLUE}    />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5, pt: 1.5, borderTop: '1px solid #F0F2F5' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: HEADING }}>Total: $1,703.00</Typography>
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  )
}
