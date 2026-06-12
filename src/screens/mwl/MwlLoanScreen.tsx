import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import { Icon } from '../../components/Icon'
import { MwlHeader, MwlTitle, MwlFooter, GroupLabel, SelectField, BLUE } from './MwlParts'
import { buildSchedule, money, type Currency, type ScheduleRow } from '../loanCalc'

const TABLE_HEAD = ['ចំនួនខែ', 'ប្រាក់ដើម', 'ការប្រាក់', 'ប្រាក់សរុបត្រូវបង់', 'សមតុល្យប្រាក់ដើម']

// Migration / Non-MWL loan request limits and fixed rate.
const MIN_AMOUNT = 100
const MAX_AMOUNT = 15000
const MIN_MONTHS = 12
const MAX_MONTHS = 240
const MONTHLY_RATE = 1.04 // % — fixed for this product

const REPAYMENT_METHODS = ['Equal monthly payment', 'Declining balance', 'Balloon payment']
// Map the human label shown in the field to the schedule method key.
const METHOD_KEY: Record<string, string> = {
  'Equal monthly payment': 'Constant',
  'Declining balance': 'Decline',
  'Balloon payment': 'Ballon',
}

// Term-slider snap stops: 7 evenly-spaced interior dots plus the two endpoints.
const TERM_SPAN = MAX_MONTHS - MIN_MONTHS
const TERM_DOTS = Array.from({ length: 7 }, (_, i) => Math.round(MIN_MONTHS + (TERM_SPAN * (i + 1)) / 8))
const TERM_MARKS = [MIN_MONTHS, ...TERM_DOTS, MAX_MONTHS].map((value) => ({ value }))
const TERM_DOT_SET = new Set(TERM_DOTS)

export default function MwlLoanScreen({ nonMwl = false }: { nonMwl?: boolean } = {}) {
  const navigate = useNavigate()
  const prefix = nonMwl ? '/nonmwl' : '/mwl'
  const [showTable, setShowTable] = useState(true)
  const [amount, setAmount] = useState(5000)
  const [months, setMonths] = useState(12)
  const [currency, setCurrency] = useState<Currency>('USD')
  const [method, setMethod] = useState(REPAYMENT_METHODS[0])

  const { payment, totalPayable, totalInterest, rows } = useMemo(
    () => buildSchedule(amount, months, MONTHLY_RATE, METHOD_KEY[method] ?? 'Constant'),
    [amount, months, method],
  )
  const totalPrincipalPaid = rows.slice(1).reduce((s, r) => s + r.principal, 0)

  // Buzz the phone (where supported) each time the term thumb lands on a dot.
  const lastMarkRef = useRef<number | null>(null)
  const handleTermChange = (_: Event, v: number | number[]) => {
    const n = v as number
    setMonths(n)
    if (TERM_DOT_SET.has(n)) {
      if (lastMarkRef.current !== n) {
        navigator.vibrate?.(10)
        lastMarkRef.current = n
      }
    } else {
      lastMarkRef.current = null
    }
  }

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => navigate(`${prefix}-about`)} step={2} totalSteps={nonMwl ? 2 : 3} />
        <MwlTitle>Loan request</MwlTitle>

        <Box sx={{ px: 3, pb: 3, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Amount */}
          <Box>
            <GroupLabel>
              REQUEST AMOUNT ${MIN_AMOUNT.toLocaleString('en-US')} – ${MAX_AMOUNT.toLocaleString('en-US')}
            </GroupLabel>
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.25 }}>
              <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Amount</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#0B0F1A' }}>{currency === 'USD' ? '$' : '៛'}</Typography>
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
                      fontSize: 17,
                      fontWeight: 700,
                      color: '#0B0F1A',
                      fontFamily: 'inherit',
                    }}
                  />
                </Box>
                <Box
                  role="button"
                  aria-label="Toggle currency"
                  onClick={() => setCurrency((c) => (c === 'USD' ? 'KHR' : 'USD'))}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:active': { opacity: 0.6 } }}
                >
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0B0F1A' }}>{currency}</Typography>
                  <Icon name="chevronsUpDown" size={16} color="#8A94A6" />
                </Box>
              </Box>
            </Box>
            <Box
              onClick={() => setShowTable((v) => !v)}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75, mt: 1.25, cursor: 'pointer' }}
            >
              <Icon name={showTable ? 'eyeOff' : 'eye'} size={17} color={BLUE} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: BLUE }}>
                {showTable ? 'Hide' : 'Show'} Payment Table
              </Typography>
            </Box>
          </Box>

          {showTable && (
          <>
          {/* Payment estimate (term slider) */}
          <Box>
            <GroupLabel>PAYMENT ESTIMATE</GroupLabel>
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', px: 2, py: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0B0F1A' }}>{MIN_MONTHS} months</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0B0F1A' }}>{MAX_MONTHS} months</Typography>
              </Box>
              <Slider
                value={months}
                min={MIN_MONTHS}
                max={MAX_MONTHS}
                step={null}
                marks={TERM_MARKS}
                onChange={handleTermChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}`}
                aria-label="Loan term in months"
                sx={{
                  color: BLUE,
                  mt: 0.5,
                  height: 6,
                  '& .MuiSlider-rail': { bgcolor: '#E2E6EC', opacity: 1, borderRadius: '999px' },
                  '& .MuiSlider-track': { border: 'none', borderRadius: '999px' },
                  '& .MuiSlider-mark': {
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: '#C7CDD6',
                    opacity: 1,
                    '&.MuiSlider-markActive': { bgcolor: 'rgba(255,255,255,0.65)' },
                  },
                  [`& .MuiSlider-mark[data-index="0"], & .MuiSlider-mark[data-index="${TERM_MARKS.length - 1}"]`]: {
                    display: 'none',
                  },
                  '& .MuiSlider-thumb': { width: 20, height: 20, bgcolor: '#fff', border: `4px solid ${BLUE}`, '&::before': { display: 'none' } },
                  '& .MuiSlider-valueLabel': {
                    bgcolor: '#fff',
                    color: '#0B0F1A',
                    fontSize: 13,
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
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', px: 2, py: 1.25 }}>
              <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Loan term</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.25 }}>
                <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#0B0F1A' }}>{months}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                  <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>Month</Typography>
                  <Icon name="chevronsUpDown" size={14} color="#8A94A6" />
                </Box>
              </Box>
            </Box>
            <Box sx={{ bgcolor: '#E7EAEF', borderRadius: '12px', px: 2, py: 1.25 }}>
              <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Monthly interest</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.25 }}>
                <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#0B0F1A' }}>{MONTHLY_RATE.toFixed(2)}</Typography>
                <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>%</Typography>
              </Box>
            </Box>
          </Box>

          {/* Repayment method */}
          <SelectField label="Repayment method" options={REPAYMENT_METHODS} value={method} onChange={setMethod} />

          {/* Monthly payment summary */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', px: 2, py: 1.75 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', color: '#8A94A6' }}>MONTHLY PAYMENT</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
              <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px' }}>{money(payment, currency)}</Typography>
              <Typography sx={{ fontSize: 14, color: '#8A94A6' }}>/ month</Typography>
            </Box>
            <Box sx={{ height: '1px', bgcolor: '#ECEFF3', my: 1.5 }} />
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.4px', color: '#8A94A6' }}>TOTAL INTEREST</Typography>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B0F1A', mt: 0.25 }}>{money(totalInterest, currency)}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.4px', color: '#8A94A6' }}>TOTAL PAYABLE</Typography>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B0F1A', mt: 0.25 }}>{money(totalPayable, currency)}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Repayment preview table */}
          <Box>
            <GroupLabel>REPAYMENT PREVIEW</GroupLabel>
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
              <RepaymentTable
                rows={rows}
                totals={{ principal: totalPrincipalPaid, interest: totalInterest, payable: totalPayable }}
                currency={currency}
              />
            </Box>
            <Typography sx={{ fontSize: 12, color: '#8A94A6', textAlign: 'center', mt: 1.5 }}>
              Showing 3 of {months} · <Box component="span" sx={{ color: BLUE, fontWeight: 700 }}>Download</Box> for full view
            </Typography>
          </Box>
          </>
          )}
        </Box>
      </Box>

      <MwlFooter onPrev={() => navigate(`${prefix}-about`)} onNext={() => navigate(nonMwl ? '/nonmwl-review' : '/mwl-guarantor')} />
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
            <Box component="th" key={h} sx={{ width: i === 0 ? 48 : undefined, fontSize: 11, fontWeight: 600, color: '#8A94A6', textAlign: 'center', px: 0.5, py: 1.5, verticalAlign: 'top', lineHeight: 1.3 }}>
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="tbody">
        {preview.map((r) => (
          <Box component="tr" key={r.month} sx={{ borderTop: '1px solid #F1F4F8' }}>
            <Td>{r.month}</Td>
            <Td>{money(r.principal, currency)}</Td>
            <Td>{money(r.interest, currency)}</Td>
            <Td strong>{money(r.payment, currency)}</Td>
            <Td>{money(r.balance, currency)}</Td>
          </Box>
        ))}
        <Box component="tr" sx={{ borderTop: '1px solid #F1F4F8' }}>
          <Td accent>សរុប</Td>
          <Td accent>{money(totals.principal, currency)}</Td>
          <Td accent>{money(totals.interest, currency)}</Td>
          <Td accent>{money(totals.payable, currency)}</Td>
          <Td accent> </Td>
        </Box>
      </Box>
    </Box>
  )
}

function Td({ children, strong = false, accent = false }: { children: React.ReactNode; strong?: boolean; accent?: boolean }) {
  return (
    <Box
      component="td"
      sx={{
        fontSize: 12.5,
        textAlign: 'center',
        px: 0.5,
        py: 1.5,
        color: accent ? BLUE : strong ? '#0B0F1A' : '#6B7280',
        fontWeight: accent || strong ? 700 : 400,
      }}
    >
      {children}
    </Box>
  )
}
