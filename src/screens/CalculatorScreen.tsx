import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import { Icon, type IconName } from '../components/Icon'
import { FieldCard, BLUE } from './mwl/MwlParts'

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

const usd = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

type ScheduleRow = { month: number; principal: number; interest: number; payment: number; balance: number }

function amortize(amount: number, months: number, monthlyRatePct: number) {
  const r = monthlyRatePct / 100
  const payment = r === 0 ? amount / months : (amount * r) / (1 - Math.pow(1 + r, -months))
  const rows: ScheduleRow[] = [{ month: 0, principal: 0, interest: 0, payment: 0, balance: amount }]
  let balance = amount
  for (let m = 1; m <= months; m++) {
    const interest = balance * r
    const principal = payment - interest
    balance = Math.max(0, balance - principal)
    rows.push({ month: m, principal, interest, payment, balance })
  }
  const totalPayable = payment * months
  return { payment, totalPayable, totalInterest: totalPayable - amount, rows }
}

export default function CalculatorScreen() {
  const navigate = useNavigate()
  const [amount] = useState(1000)
  const [term, setTerm] = useState(12)
  const [repaymentMethod, setRepaymentMethod] = useState(REPAYMENT_METHODS[0].name)
  const [loanProduct, setLoanProduct] = useState('Migrant Worker Loan')
  const [currency, setCurrency] = useState<'USD' | 'KHR'>('USD')
  const [termUnit, setTermUnit] = useState<'Month' | 'Year'>('Month')
  const [monthlyInterest, setMonthlyInterest] = useState(1.04)
  // The rate is fixed per product; only the "None" option lets the user edit it.
  const rateEditable = loanProduct === 'None'

  const { payment, totalPayable, totalInterest, rows } = useMemo(
    () => amortize(amount, term, Number.isNaN(monthlyInterest) ? 0 : monthlyInterest),
    [amount, term, monthlyInterest],
  )
  const totalPrincipalPaid = rows.slice(1).reduce((s, r) => s + r.principal, 0)

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1 }}>
          <IconButton onClick={() => navigate('/home?v=1')} aria-label="Back" sx={{ ml: -1, color: '#0B0F1A' }}>
            <Icon name="chevronLeft" size={26} color="#0B0F1A" />
          </IconButton>
        </Box>
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#000', letterSpacing: '-1px', px: 3, mt: 0.5, mb: 2 }}>
          Loan calculator
        </Typography>

        <Box sx={{ px: 3, pb: '34px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* ─── Inputs ───────────────────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <IconSelect label="Loan product" options={LOAN_PRODUCTS} value={loanProduct} onChange={setLoanProduct} />

            {/* Amount */}
            <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: '16px' }}>Amount $100 ~ $300,000</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: MUTED }}>{currency === 'USD' ? '$' : '៛'}</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#000' }}>{amount.toLocaleString('en-US')}</Typography>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <SectionLabel>Payment estimate</SectionLabel>
              <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#525252' }}>12 months</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#525252' }}>240 months</Typography>
                </Box>
                <Slider
                  value={term}
                  onChange={(_, v) => setTerm(v as number)}
                  min={12}
                  max={240}
                  step={1}
                  aria-label="Loan term in months"
                  sx={{
                    py: 1,
                    color: BLUE,
                    height: 4,
                    '& .MuiSlider-rail': { bgcolor: 'rgba(12,65,154,0.12)', opacity: 1 },
                    '& .MuiSlider-track': { border: 'none' },
                    '& .MuiSlider-thumb': {
                      width: 14,
                      height: 14,
                      bgcolor: '#fff',
                      border: `2px solid ${BLUE}`,
                      boxShadow: '0 1px 3px rgba(12,65,154,0.3)',
                      '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 6px rgba(0,82,204,0.16)' },
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
                    {termUnit === 'Month' ? term : (term / 12) % 1 === 0 ? term / 12 : (term / 12).toFixed(1)}
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
            <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: 2 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.6px', color: LABEL, textTransform: 'uppercase' }}>
                Monthly payment
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, mt: 0.5 }}>
                <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#000', letterSpacing: '-0.5px', lineHeight: 1 }}>
                  {usd(payment)}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#000', mb: '2px' }}>/ month</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.18)' }}>
                <SummaryStat label="Total interest" value={usd(totalInterest)} />
                <SummaryStat label="Total payable" value={usd(totalPayable)} />
              </Box>
            </Box>

            {/* Repayment preview */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <SectionLabel>Repayment preview</SectionLabel>
              <Box sx={{ bgcolor: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
                <RepaymentTable
                  rows={rows}
                  totals={{ principal: totalPrincipalPaid, interest: totalInterest, payable: totalPayable }}
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
          onClick={() => navigate('/mwl-about')}
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
}: {
  rows: ScheduleRow[]
  totals: { principal: number; interest: number; payable: number }
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
            <Td>{usd(r.principal)}</Td>
            <Td>{usd(r.interest)}</Td>
            <Td strong>{usd(r.payment)}</Td>
            <Td>{usd(r.balance)}</Td>
          </Box>
        ))}
        {/* Total row */}
        <Box component="tr" sx={{ borderTop: '1px solid #F0F0F0' }}>
          <Td accent bold>សរុប</Td>
          <Td accent>{usd(totals.principal)}</Td>
          <Td accent>{usd(totals.interest)}</Td>
          <Td accent>{usd(totals.payable)}</Td>
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
