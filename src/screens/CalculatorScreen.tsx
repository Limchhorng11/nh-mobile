import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import { Icon, type IconName } from '../components/Icon'
import { FieldCard, BLUE } from './mwl/MwlParts'
import { useFlow } from '../workspace/FlowContext'
import { buildSchedule, money, type Currency, type ScheduleRow } from './loanCalc'

type IconOption = { name: string; icon: IconName }

const REPAYMENT_METHODS: IconOption[] = [
  { name: 'Constant', icon: 'equal' },
  { name: 'Decline', icon: 'trendingDown' },
  { name: 'Ballon', icon: 'banknote' },
  { name: 'Mix-Grace Period', icon: 'calendarClock' },
  { name: 'Mix Installment', icon: 'layers' },
]

const LOAN_PRODUCTS: IconOption[] = [
  { name: 'Micro Loan', icon: 'sprout' },
  { name: 'Small Biz Loan', icon: 'store' },
  { name: 'Small & Medium Enterprise Loan', icon: 'briefcase' },
  { name: 'Housing Loan', icon: 'home' },
  { name: 'Migrant Worker Loan', icon: 'plane' },
  { name: 'None', icon: 'minusCircle' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Loan calculator — equal-monthly-payment (annuity) amortization.
// Term slider recomputes the monthly payment, totals and repayment preview live.
// ─────────────────────────────────────────────────────────────────────────────
const MUTED = '#747A81'
const LABEL = '#737373'

// Per-product limits: amount ceiling and the maximum loan term (months).
const MIN_AMOUNT = 100
const MIN_MONTHS = 12
const PRODUCT_LIMITS: Record<string, { maxAmount: number; maxMonths: number }> = {
  'Micro Loan': { maxAmount: 3000, maxMonths: 48 },
  'Small Biz Loan': { maxAmount: 30000, maxMonths: 96 },
  'Small & Medium Enterprise Loan': { maxAmount: 100000, maxMonths: 120 },
  'Housing Loan': { maxAmount: 300000, maxMonths: 240 },
  'Migrant Worker Loan': { maxAmount: 15000, maxMonths: 240 },
  None: { maxAmount: 300000, maxMonths: 240 },
}

// Build the term-slider snap stops for a given max term: 7 evenly-spaced
// interior dots plus the two endpoints (kept reachable, hidden via CSS).
function termMarksFor(maxMonths: number) {
  const span = maxMonths - MIN_MONTHS
  const dots = Array.from({ length: 7 }, (_, i) => Math.round(MIN_MONTHS + (span * (i + 1)) / 8))
  return {
    marks: [MIN_MONTHS, ...dots, maxMonths].map((value) => ({ value })),
    dotValues: new Set(dots),
  }
}

export default function CalculatorScreen() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const [amount, setAmount] = useState(1000)
  const [term, setTerm] = useState(12)
  const [repaymentMethod, setRepaymentMethod] = useState(REPAYMENT_METHODS[0].name)
  const [loanProduct, setLoanProduct] = useState('None')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [termUnit, setTermUnit] = useState<'Month' | 'Year'>('Month')
  const [monthlyInterest, setMonthlyInterest] = useState(1.04)
  // The rate is fixed per product; only the "None" option lets the user edit it.
  const rateEditable = loanProduct === 'None'

  // Amount ceiling + max term follow the selected loan product.
  const { maxAmount, maxMonths } = PRODUCT_LIMITS[loanProduct] ?? PRODUCT_LIMITS.None
  const { marks: termMarks, dotValues: termDotValues } = useMemo(() => termMarksFor(maxMonths), [maxMonths])

  // When the product changes, clamp the amount and term to the new limits.
  useEffect(() => {
    setAmount((a) => Math.min(a, maxAmount))
    setTerm((t) => Math.min(Math.max(t, MIN_MONTHS), maxMonths))
  }, [maxAmount, maxMonths])

  const { payment, totalPayable, totalInterest, rows } = useMemo(
    () => buildSchedule(amount, term, Number.isNaN(monthlyInterest) ? 0 : monthlyInterest, repaymentMethod),
    [amount, term, monthlyInterest, repaymentMethod],
  )
  const totalPrincipalPaid = rows.slice(1).reduce((s, r) => s + r.principal, 0)

  // Buzz the phone (where supported) each time the term thumb lands on a dot.
  const lastMarkRef = useRef<number | null>(null)
  const handleTermChange = (_: Event, v: number | number[]) => {
    const n = v as number
    setTerm(n)
    if (termDotValues.has(n)) {
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
        {/* Header */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ ml: -1, color: '#0B0F1A' }}>
            <Icon name="chevronLeft" size={26} color="#0B0F1A" />
          </IconButton>
        </Box>
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#000', letterSpacing: '-1px', px: 3, mt: 0.5, mb: 3 }}>
          Loan calculator
        </Typography>

        <Box sx={{ px: 3, pb: '34px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* ─── Inputs ───────────────────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <IconSelect label="Loan product" options={LOAN_PRODUCTS} value={loanProduct} onChange={setLoanProduct} />

            {/* Amount */}
            <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: '16px' }}>
                Amount ${MIN_AMOUNT.toLocaleString('en-US')} ~ ${maxAmount.toLocaleString('en-US')}
              </Typography>
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

            {/* Payment estimate (term slider) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <SectionLabel>Payment estimate</SectionLabel>
              <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#525252' }}>{termUnit === 'Year' ? '1 year' : `${MIN_MONTHS} months`}</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#525252' }}>{termUnit === 'Year' ? `${Math.round(maxMonths / 12)} years` : `${maxMonths} months`}</Typography>
                </Box>
                <Slider
                  value={term}
                  onChange={handleTermChange}
                  min={MIN_MONTHS}
                  max={maxMonths}
                  step={null}
                  marks={termMarks}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${v}`}
                  aria-label="Loan term in months"
                  sx={{
                    py: 1.5,
                    color: BLUE,
                    height: 20,
                    '& .MuiSlider-rail': { bgcolor: '#E5E5E5', opacity: 1, borderRadius: '999px' },
                    '& .MuiSlider-track': { border: 'none', borderRadius: '999px' },
                    '& .MuiSlider-mark': {
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: '#C7CDD6',
                      opacity: 1,
                      '&.MuiSlider-markActive': { bgcolor: 'rgba(255,255,255,0.65)' },
                    },
                    // Hide the two endpoint dots — only the 7 interior dots show.
                    [`& .MuiSlider-mark[data-index="0"], & .MuiSlider-mark[data-index="${termMarks.length - 1}"]`]: {
                      display: 'none',
                    },
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

            {/* Loan term + Monthly interest */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 171, flexShrink: 0, bgcolor: '#fff', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: '16px' }}>Loan term</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#000' }}>
                    {termUnit === 'Month' ? term : Math.round(term / 12)}
                  </Typography>
                  <Box
                    role="button"
                    aria-label="Toggle term unit"
                    onClick={() => setTermUnit((u) => (u === 'Month' ? 'Year' : 'Month'))}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:active': { opacity: 0.6 } }}
                  >
                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: MUTED }}>{termUnit}</Typography>
                    <Icon name="chevronsUpDown" size={18} color={MUTED} />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0, bgcolor: rateEditable ? '#fff' : '#E5E5E5', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: '16px' }}>Monthly interest</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {rateEditable ? (
                    <Box
                      component="input"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      value={Number.isNaN(monthlyInterest) ? '' : monthlyInterest}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyInterest(parseFloat(e.target.value))}
                      aria-label="Monthly interest rate"
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
                        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                        MozAppearance: 'textfield',
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#000' }}>{monthlyInterest.toFixed(2)}</Typography>
                  )}
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: MUTED, ml: 1 }}>%</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ─── Results ──────────────────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <IconSelect
              label="Repayment method"
              options={REPAYMENT_METHODS}
              value={repaymentMethod}
              onChange={setRepaymentMethod}
            />

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

            {/* Repayment preview */}
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
                Showing 3 of {term} · <Box component="span" sx={{ color: BLUE, fontWeight: 700 }}>Download</Box> for full view
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ flexShrink: 0, px: 3, pb: '44px', pt: 1, bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(flow === 'Visitor' ? '/sign-up?next=' + encodeURIComponent('/mwl-about') : '/mwl-about')}
          sx={{ minHeight: 48, borderRadius: '8px', fontSize: 16, fontWeight: 600, bgcolor: '#275CB2', '&:hover': { bgcolor: '#1f4f9e' } }}
        >
          Apply this loan
        </Button>
      </Box>
    </Box>
  )
}

// ─── Icon select — FieldCard that opens a list of options each with an icon ──
function IconSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: IconOption[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
    }
  }, [open])

  return (
    <Box ref={ref} sx={{ position: 'relative' }}>
      <FieldCard
        label={label}
        value={value}
        onClick={() => setOpen((v) => !v)}
        trailing={
          <Box sx={{ display: 'flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <Icon name="chevronDown" size={18} color={MUTED} />
          </Box>
        }
      />
      {open && (
        <Box sx={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 30, bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(11,15,26,0.12)' }}>
          {options.map((p, i) => {
            const active = p.name === value
            return (
              <Box
                key={p.name}
                onClick={() => {
                  onChange(p.name)
                  setOpen(false)
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderTop: i > 0 ? '1px solid #F1F4F8' : 'none',
                  bgcolor: active ? '#F4F8FF' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <Icon name={p.icon} size={22} color={active ? BLUE : '#9CA3AF'} />
                <Typography sx={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: active ? 700 : 500, color: active ? BLUE : '#0B0F1A' }}>
                  {p.name}
                </Typography>
                {active && <Box component="span" sx={{ color: BLUE, fontSize: 16, fontWeight: 800, lineHeight: 1 }}>✓</Box>}
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
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

// ─── Repayment preview table (Khmer headers, first 3 months + total row) ─────
const HEAD = ['ចំនួនខែ', 'ប្រាក់ដើម', 'ការប្រាក់', 'ប្រាក់សរុបត្រូវបង់', 'សមតុល្យប្រាក់ដើម']

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
          <Th sx={{ width: 52 }}>{HEAD[0]}</Th>
          <Th>{HEAD[1]}</Th>
          <Th>{HEAD[2]}</Th>
          <Th>{HEAD[3]}</Th>
          <Th>{HEAD[4]}</Th>
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
        {/* Total row */}
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

function Th({ children, sx }: { children: ReactNode; sx?: object }) {
  return (
    <Box
      component="th"
      sx={{ bgcolor: '#FAFAFA', borderBottom: '1px solid #F0F0F0', fontSize: 11, fontWeight: 600, color: '#737373', textAlign: 'center', px: 0.5, py: 1, lineHeight: 1.2, verticalAlign: 'middle', ...sx }}
    >
      {children}
    </Box>
  )
}

function Td({ children, strong = false, accent = false, bold = false }: { children: ReactNode; strong?: boolean; accent?: boolean; bold?: boolean }) {
  return (
    <Box
      component="td"
      sx={{
        fontSize: 12,
        textAlign: 'center',
        px: 0.5,
        py: 1,
        height: 46,
        color: accent ? BLUE : strong ? '#000' : '#737373',
        fontWeight: bold || strong || accent ? 600 : 500,
      }}
    >
      {children}
    </Box>
  )
}
