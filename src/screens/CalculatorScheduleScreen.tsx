import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'

const BLUE = '#275CB2'
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'

type Currency = 'USD' | 'KHR'
type ScheduleRow = { month: number; principal: number; interest: number; payment: number; balance: number }

function money(v: number, cur: Currency) {
  if (cur === 'KHR') return '៛' + Math.round(v * 4000).toLocaleString('en-US')
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function CalculatorScheduleScreen() {
  const navigate = useNavigate()
  const { state } = useLocation() as {
    state: {
      rows: ScheduleRow[]
      totals: { principal: number; interest: number; payable: number }
      currency: Currency
      term: number
    } | null
  }

  const allRows: ScheduleRow[] = state?.rows ?? []
  // row 0 is the opening balance — skip it for display
  const rows = allRows.filter((r) => r.month > 0)
  const totals = state?.totals ?? { principal: 0, interest: 0, payable: 0 }
  const currency: Currency = state?.currency ?? 'USD'
  const term: number = state?.term ?? 0

  const handleSave = () => {
    const headers = ['Month', 'Principal', 'Interest', 'Payment', 'Balance']
    const csvRows = allRows.filter((r) => r.month > 0).map((r) =>
      [r.month, r.principal.toFixed(2), r.interest.toFixed(2), r.payment.toFixed(2), r.balance.toFixed(2)].join(',')
    )
    const csv = [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'repayment-schedule.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>

      {/* Header */}
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, pt: 3, pb: 1.5, bgcolor: '#F5F5F5' }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Back">
          <Icon name="chevronLeft" size={26} color={HEADING} />
        </IconButton>
        <Typography sx={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 800, color: HEADING }}>
          Repayment Schedule
        </Typography>
        <Box role="button" onClick={handleSave} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
          <Icon name="download" size={16} color={BLUE} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: BLUE }}>CSV</Typography>
        </Box>
      </Box>

      <Box className="scroll-content" sx={{ flex: 1, pb: 4 }}>

        {/* Summary strip */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, px: 3, mb: 2 }}>
          {[
            { label: 'Total principal', value: money(totals.principal, currency) },
            { label: 'Total interest',  value: money(totals.interest,  currency) },
            { label: 'Total payable',   value: money(totals.payable,   currency) },
          ].map((s) => (
            <Box key={s.label} sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '10px', textAlign: 'center' }}>
              <Typography sx={{ fontSize: 11, color: MUTED, mb: 0.25, lineHeight: 1.3 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: BLUE, lineHeight: 1.2 }}>{s.value}</Typography>
            </Box>
          ))}
        </Box>

        {/* Table */}
        <Box sx={{ mx: 3, bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden' }}>

          {/* Column headers */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 1fr', px: '12px', py: '10px', bgcolor: '#F4F6F9', borderBottom: '1px solid #E8EAEE' }}>
            {['#', 'Principal', 'Interest', 'Payment', 'Balance'].map((h) => (
              <Typography key={h} sx={{ fontSize: 10.5, fontWeight: 700, color: MUTED, textAlign: h === '#' ? 'left' : 'right', letterSpacing: '0.3px' }}>{h}</Typography>
            ))}
          </Box>

          {/* Data rows */}
          {rows.map((r, i) => (
            <Box
              key={r.month}
              sx={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 1fr 1fr 1fr',
                px: '12px',
                py: '10px',
                bgcolor: i % 2 === 0 ? '#fff' : '#FAFBFC',
                borderBottom: i < rows.length - 1 ? '1px solid #F0F2F5' : 'none',
              }}
            >
              <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: MUTED }}>{r.month}</Typography>
              <Typography sx={{ fontSize: 11.5, color: HEADING, textAlign: 'right' }}>{money(r.principal, currency)}</Typography>
              <Typography sx={{ fontSize: 11.5, color: HEADING, textAlign: 'right' }}>{money(r.interest, currency)}</Typography>
              <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: BLUE, textAlign: 'right' }}>{money(r.payment, currency)}</Typography>
              <Typography sx={{ fontSize: 11.5, color: MUTED, textAlign: 'right' }}>{money(r.balance, currency)}</Typography>
            </Box>
          ))}

          {/* Totals row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 1fr', px: '12px', py: '10px', bgcolor: '#EEF3FC', borderTop: '2px solid #D6E2F5' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: MUTED }}>Σ</Typography>
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: HEADING, textAlign: 'right' }}>{money(totals.principal, currency)}</Typography>
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: HEADING, textAlign: 'right' }}>{money(totals.interest, currency)}</Typography>
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: BLUE, textAlign: 'right' }}>{money(totals.payable, currency)}</Typography>
            <Typography sx={{ fontSize: 11.5, color: MUTED, textAlign: 'right' }}>—</Typography>
          </Box>
        </Box>

        <Typography sx={{ fontSize: 12, color: '#B0B8C8', textAlign: 'center', mt: 2, px: 3 }}>
          {term} installments · {currency} · 1 USD = 4,000 KHR
        </Typography>
      </Box>

    </Box>
  )
}
