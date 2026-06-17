import { useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import { Icon } from '../../components/Icon'
import { MwlHeader, MwlTitle, MwlFooter, GroupLabel, SelectField, BottomSheet, BLUE } from './MwlParts'
import Button from '@mui/material/Button'
import { buildSchedule, money, termStopsForProduct, type Currency, type ScheduleRow } from '../loanCalc'

const TABLE_HEAD = ['ចំនួនខែ', 'ប្រាក់ដើម', 'ការប្រាក់', 'ប្រាក់សរុបត្រូវបង់', 'សមតុល្យប្រាក់ដើម']

// Shared muted greys (match the Loan calculator).
const MUTED = '#8A94A6'
const LABEL = '#737373'

// Migration / Non-MWL loan request limits and fixed rate.
const MIN_AMOUNT = 100
const MAX_AMOUNT = 15000
const MONTHLY_RATE = 1.04 // % — fixed for this product

const REPAYMENT_METHODS = ['Equal monthly payment', 'Declining balance', 'Balloon payment']
// Map the human label shown in the field to the schedule method key.
const METHOD_KEY: Record<string, string> = {
  'Equal monthly payment': 'Constant',
  'Declining balance': 'Decline',
  'Balloon payment': 'Ballon',
}

export default function MwlLoanScreen({ nonMwl = false }: { nonMwl?: boolean } = {}) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const prefix = nonMwl ? '/nonmwl' : '/mwl'
  // Term-slider stops depend on the loan product (MWL → "None" default range).
  const termStops = termStopsForProduct(params.get('product') ?? undefined)
  const MIN_MONTHS = termStops[0]
  const MAX_MONTHS = termStops[termStops.length - 1]
  const [showTable, setShowTable] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [amount, setAmount] = useState(5000)
  const [months, setMonths] = useState(() => (termStops.includes(24) ? 24 : termStops[0]))
  const [currency, setCurrency] = useState<Currency>('USD')
  const [method, setMethod] = useState(REPAYMENT_METHODS[0])

  const { payment, totalPayable, totalInterest, rows } = useMemo(
    () => buildSchedule(amount, months, MONTHLY_RATE, METHOD_KEY[method] ?? 'Constant'),
    [amount, months, method],
  )
  const totalPrincipalPaid = rows.slice(1).reduce((s, r) => s + r.principal, 0)

  // Buzz the phone (where supported) each time the term thumb snaps to a stop.
  const lastMarkRef = useRef<number | null>(null)
  const handleTermChange = (_: Event, v: number | number[]) => {
    const n = v as number
    setMonths(n)
    if (lastMarkRef.current !== n) {
      navigator.vibrate?.(10)
      lastMarkRef.current = n
    }
  }

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => navigate(`${prefix}-about`)} step={2} totalSteps={nonMwl ? 2 : 3} />
        <MwlTitle>Loan request</MwlTitle>

        <Box sx={{ px: 3, pb: 3, pt: '24px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Amount */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <GroupLabel>
              {currency === 'KHR'
                ? 'REQUEST AMOUNT ៛400K – ៛59,500K'
                : `REQUEST AMOUNT $${MIN_AMOUNT.toLocaleString('en-US')} – $${MAX_AMOUNT.toLocaleString('en-US')}`}
            </GroupLabel>
            <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: '16px' }}>Amount</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: MUTED }}>{currency === 'USD' ? '$' : '៛'}</Typography>
                  <Box
                    component="input"
                    type="text"
                    inputMode="numeric"
                    value={amount ? amount.toLocaleString('en-US') : ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const digits = e.target.value.replace(/[^0-9]/g, '')
                      setAmount(digits ? parseInt(digits, 10) : 0)
                    }}
                    aria-label="Loan amount"
                    sx={{
                      width: 0,
                      flex: 1,
                      minWidth: 0,
                      border: 'none',
                      outline: 'none',
                      bgcolor: 'transparent',
                      p: 0,
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#000',
                      fontFamily: 'inherit',
                      height: 24,
                      lineHeight: '24px',
                    }}
                  />
                </Box>
                <Box
                  role="button"
                  aria-label="Toggle currency"
                  onClick={() => setCurrency((c) => (c === 'USD' ? 'KHR' : 'USD'))}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:active': { opacity: 0.6 } }}
                >
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: MUTED }}>{currency}</Typography>
                  <Icon name="chevronsUpDown" size={18} color={MUTED} />
                </Box>
              </Box>
            </Box>
            <Box
              onClick={() => setShowTable((v) => !v)}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75, cursor: 'pointer', pt: '8px' }}
            >
              <Icon name={showTable ? 'eyeOff' : 'eye'} size={17} color={BLUE} />
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: BLUE }}>
                {showTable ? 'Hide' : 'Show'} Payment Table
              </Typography>
            </Box>
          </Box>

          {showTable && (
          <>
          {/* Payment estimate (term slider) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <SectionLabel>Payment estimate</SectionLabel>
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#525252' }}>{MIN_MONTHS} months</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#525252' }}>{MAX_MONTHS} months</Typography>
              </Box>
              <Slider
                value={months}
                min={MIN_MONTHS}
                max={MAX_MONTHS}
                step={1}
                onChange={handleTermChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}`}
                aria-label="Loan term in months"
                sx={{
                  py: 1.5,
                  color: BLUE,
                  height: 20,
                  '& .MuiSlider-rail': { bgcolor: '#E5E5E5', opacity: 1, borderRadius: '999px' },
                  '& .MuiSlider-track': { border: 'none', borderRadius: '999px' },
                  '& .MuiSlider-thumb': {
                    width: 36,
                    height: 28,
                    borderRadius: '999px',
                    bgcolor: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 6px rgba(16,24,40,0.24)',
                    '&::before': { display: 'none' },
                    '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: '0 3px 10px rgba(16,24,40,0.3)' },
                  },
                  '& .MuiSlider-valueLabel': {
                    bgcolor: '#fff',
                    color: '#0B0F1A',
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: '999px',
                    px: 1,
                    py: 0.25,
                    boxShadow: '0 4px 12px rgba(16,24,40,0.18)',
                    '&::before': { display: 'none' },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Loan term + interest */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: 171, flexShrink: 0, bgcolor: '#fff', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: '16px' }}>Loan term</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#000' }}>{months}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: MUTED }}>Month</Typography>
                  <Icon name="chevronsUpDown" size={18} color={MUTED} />
                </Box>
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, bgcolor: '#E5E5E5', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: '16px' }}>Monthly interest</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#000' }}>{MONTHLY_RATE.toFixed(2)}</Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: MUTED, ml: 1 }}>%</Typography>
              </Box>
            </Box>
          </Box>

          {/* Repayment method */}
          <SelectField label="Repayment method" options={REPAYMENT_METHODS} value={method} onChange={setMethod} />

          {/* Monthly payment summary */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: '26px' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.6px', color: LABEL, textTransform: 'uppercase' }}>
              Monthly payment
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, mt: 0.5 }}>
              <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#000', letterSpacing: '-0.5px', lineHeight: 1 }}>
                {money(payment, currency)}
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#000', mb: '2px' }}>/ month</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.18)' }}>
              <SummaryStat label="Total interest" value={money(totalInterest, currency)} />
              <SummaryStat label="Total payable" value={money(totalPayable, currency)} />
            </Box>
          </Box>

          {/* Repayment preview table */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <SectionLabel>Repayment preview</SectionLabel>
            <Box sx={{ bgcolor: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
              <RepaymentTable
                rows={rows}
                totals={{ principal: totalPrincipalPaid, interest: totalInterest, payable: totalPayable }}
                currency={currency}
              />
            </Box>
            <Typography sx={{ fontSize: 14, color: LABEL, textAlign: 'center', py: 1.5 }}>
              Showing 3 of {months} · <Box component="span" onClick={() => setDownloadOpen(true)} sx={{ color: BLUE, fontWeight: 700, cursor: 'pointer' }}>Download</Box> for full view
            </Typography>
          </Box>
          </>
          )}
        </Box>
      </Box>

      <MwlFooter onPrev={() => navigate(`${prefix}-about`)} onNext={() => navigate(nonMwl ? '/nonmwl-review' : '/mwl-guarantor')} />

      {/* Download preview sheet */}
      <DownloadSheet
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        rows={rows}
        totals={{ principal: totalPrincipalPaid, interest: totalInterest, payable: totalPayable }}
        currency={currency}
        months={months}
      />
    </Box>
  )
}

// ─── Download preview sheet ───────────────────────────────────────────────────
function DownloadSheet({
  open,
  onClose,
  rows,
  totals,
  currency,
  months,
}: {
  open: boolean
  onClose: () => void
  rows: ScheduleRow[]
  totals: { principal: number; interest: number; payable: number }
  currency: Currency
  months: number
}) {
  const previewRows = rows.slice(0, Math.min(rows.length, 6))
  const handleSave = () => {
    const headers = ['Month', 'Principal', 'Interest', 'Payment', 'Balance']
    const csvRows = rows.map((r) => [r.month, r.principal.toFixed(2), r.interest.toFixed(2), r.payment.toFixed(2), r.balance.toFixed(2)].join(','))
    const csv = [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'repayment-table.csv'
    a.click()
    URL.revokeObjectURL(url)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.3px' }}>
          Repayment Table
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: '#8A94A6' }}>
          {months} months · {currency} · preview of first {previewRows.length - 1} installments
        </Typography>
      </Box>
      <Box sx={{ bgcolor: '#fff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #F0F0F0' }}>
        <RepaymentTable rows={previewRows} totals={totals} currency={currency} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          sx={{ height: 52, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}
        >
          Save as CSV
        </Button>
        <Button
          variant="text"
          fullWidth
          onClick={onClose}
          sx={{ height: 44, fontSize: 15, fontWeight: 600, color: '#8A94A6' }}
        >
          Cancel
        </Button>
      </Box>
    </BottomSheet>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.65px', color: LABEL, textTransform: 'uppercase' }}>
      {children}
    </Typography>
  )
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', color: LABEL, textTransform: 'uppercase' }}>{label}</Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#000', mt: 0.5 }}>{value}</Typography>
    </Box>
  )
}

function RepaymentTable({
  rows,
  totals,
  currency,
}: {
  rows: ScheduleRow[]
  totals: { principal: number; interest: number; payable: number }
  currency: Currency
}) {
  const preview = rows.slice(0, 3) // months 0, 1, 2
  return (
    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
      <Box component="thead">
        <Box component="tr">
          {TABLE_HEAD.map((h, i) => (
            <Box
              component="th"
              key={h}
              sx={{ width: i === 0 ? 52 : undefined, bgcolor: '#FAFAFA', borderBottom: '1px solid #F0F0F0', fontSize: 11, fontWeight: 600, color: LABEL, textAlign: 'center', px: 0.5, py: 1, lineHeight: 1.2, verticalAlign: 'middle' }}
            >
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="tbody">
        {preview.map((r) => (
          <Box component="tr" key={r.month} sx={{ borderTop: '1px solid #F0F0F0' }}>
            <Td bold>{r.month}</Td>
            <Td>{money(r.principal, currency)}</Td>
            <Td>{money(r.interest, currency)}</Td>
            <Td strong>{money(r.payment, currency)}</Td>
            <Td>{money(r.balance, currency)}</Td>
          </Box>
        ))}
        <Box component="tr" sx={{ borderTop: '1px solid #F0F0F0' }}>
          <Td accent bold>សរុប</Td>
          <Td accent>{money(totals.principal, currency)}</Td>
          <Td accent>{money(totals.interest, currency)}</Td>
          <Td accent>{money(totals.payable, currency)}</Td>
          <Td> </Td>
        </Box>
      </Box>
    </Box>
  )
}

function Td({ children, strong = false, accent = false, bold = false }: { children: React.ReactNode; strong?: boolean; accent?: boolean; bold?: boolean }) {
  return (
    <Box
      component="td"
      sx={{
        fontSize: 12,
        textAlign: 'center',
        px: 0.5,
        py: 1,
        height: 46,
        color: accent ? BLUE : strong ? '#000' : LABEL,
        fontWeight: bold || strong || accent ? 600 : 500,
      }}
    >
      {children}
    </Box>
  )
}
