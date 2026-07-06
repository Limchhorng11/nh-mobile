import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import { Icon, type IconName } from '../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../components/CollapsingHeader'
import { FieldCard, BottomSheet, BLUE } from './mwl/MwlParts'
import { useFlow } from '../workspace/FlowContext'
import { useT } from '../i18n/LangContext'
import { buildSchedule, money, termStopsForProduct, type Currency, type ScheduleRow } from './loanCalc'

type IconOption = { name: string; icon: IconName }

const REPAYMENT_METHODS: IconOption[] = [
  { name: 'Constant', icon: 'equal' },
  { name: 'Decline', icon: 'trendingDown' },
  { name: 'Ballon', icon: 'banknote' },
  { name: 'Mix-Grace Period', icon: 'calendarClock' },
  { name: 'Mix Installment', icon: 'layers' },
]

const PAYMENT_MODES = [
  { name: 'Constant',        icon: 'equal'        as const, sub: 'Level payments'   },
  { name: 'Decline',         icon: 'trendingDown' as const, sub: 'Lower over time'  },
  { name: 'Ballon',          icon: 'banknote'     as const, sub: 'Lump sum at end'  },
  { name: 'Mix-Grace Period',icon: 'calendarClock'as const, sub: 'Grace, then level'},
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

const sliderSx = {
  py: 1,
  color: BLUE,
  height: 6,
  '& .MuiSlider-rail': { bgcolor: '#E5E5E5', opacity: 1, borderRadius: '999px' },
  '& .MuiSlider-track': { border: 'none', borderRadius: '999px' },
  '& .MuiSlider-thumb': {
    width: 24,
    height: 24,
    borderRadius: '50%',
    bgcolor: '#fff',
    border: `2px solid ${BLUE}`,
    boxShadow: '0 2px 6px rgba(16,24,40,0.18)',
    '&::before': { display: 'none' },
    '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: '0 3px 10px rgba(16,24,40,0.25)' },
  },
  '& .MuiSlider-valueLabel': { display: 'none' },
}

// Per-product amount ceiling. The term range comes from termStopsForProduct().
const MIN_AMOUNT = 100
const PRODUCT_MAX_AMOUNT: Record<string, number> = {
  'Micro Loan': 3000,
  'Small Biz Loan': 30000,
  'Small & Medium Enterprise Loan': 100000,
  'Housing Loan': 300000,
  'Migrant Worker Loan': 15000,
  None: 300000,
}

// Fixed monthly interest per product (the "None" option lets the user edit it).
const PRODUCT_RATE: Record<string, number> = {
  'Micro Loan': 1.2,
  'Small Biz Loan': 0.9,
  'Small & Medium Enterprise Loan': 0.75,
  'SME Loan': 0.75,
  'Housing Loan': 0.67,
  'Migration Worker Loan': 0.98,
  'Migrant Worker Loan': 0.98,
  'Staff Loan': 0.67,
}

export default function CalculatorScreen() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const [params] = useSearchParams()
  // Opened from a product → the calculator is locked to that product. Opened
  // independently (Discover / Tools) → the product dropdown is free.
  const lockedProduct = params.get('product')
  const [amount, setAmount] = useState(1000)
  const [term, setTerm] = useState(12)
  const [repaymentMethod, setRepaymentMethod] = useState(REPAYMENT_METHODS[0].name)
  const [gracePeriod, setGracePeriod] = useState(4)
  const [loanProduct, setLoanProduct] = useState(lockedProduct ?? 'None')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [termUnit, setTermUnit] = useState<'Month' | 'Year'>('Month')
  const [monthlyInterest, setMonthlyInterest] = useState(PRODUCT_RATE[lockedProduct ?? ''] ?? 1.04)
  // The rate is fixed per product; only the free "None" option lets the user edit it.
  const rateEditable = loanProduct === 'None'

  // A specific product fixes its monthly interest rate.
  useEffect(() => {
    if (loanProduct !== 'None') setMonthlyInterest(PRODUCT_RATE[loanProduct] ?? 1.04)
  }, [loanProduct])

  // Collapsing header: large title shrinks toward the back arrow on scroll.
  const t = useT()
  const { collapse, onScroll } = useCollapse()

  // Amount ceiling + term range follow the selected loan product.
  const maxAmount = PRODUCT_MAX_AMOUNT[loanProduct] ?? PRODUCT_MAX_AMOUNT.None
  const termStops = termStopsForProduct(loanProduct)
  const minMonths = termStops[0]
  const maxMonths = termStops[termStops.length - 1]

  // When the product changes, clamp the amount and term to the new limits.
  useEffect(() => {
    setAmount((a) => Math.min(a, maxAmount))
    setTerm((t) => Math.min(Math.max(t, minMonths), maxMonths))
  }, [maxAmount, minMonths, maxMonths])

  const [showAllRows, setShowAllRows] = useState(false)

  const { payment, totalPayable, totalInterest, rows } = useMemo(
    () => buildSchedule(amount, term, Number.isNaN(monthlyInterest) ? 0 : monthlyInterest, repaymentMethod, gracePeriod),
    [amount, term, monthlyInterest, repaymentMethod, gracePeriod],
  )
  const totalPrincipalPaid = rows.slice(1).reduce((s, r) => s + r.principal, 0)

  // Buzz the phone (where supported) as the term thumb moves.
  const lastMarkRef = useRef<number | null>(null)
  const handleTermChange = (_: Event, v: number | number[]) => {
    const n = v as number
    setTerm(n)
    if (lastMarkRef.current !== n) {
      navigator.vibrate?.(10)
      lastMarkRef.current = n
    }
  }


  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title={t('loanCalculator')} collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{t('loanCalculator')}</CollapsingTitle>

        {/* Currency toggle — top of page */}
        <Box sx={{ px: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '3px', gap: '3px' }}>
            {(['USD', 'KHR'] as const).map((c) => (
              <Box key={c} role="button" onClick={() => setCurrency(c)}
                sx={{ flex: 1, textAlign: 'center', py: '9px', borderRadius: '9px', cursor: 'pointer', bgcolor: currency === c ? BLUE : 'transparent', transition: 'all 0.15s' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: currency === c ? '#fff' : MUTED }}>
                  {c === 'USD' ? '$ Dollar (USD)' : '៛ Riel (KHR)'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ px: 3, pb: '34px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* ─── Inputs ───────────────────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* ── 3-slider card ────────────────────────────────────────── */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: '18px', display: 'flex', flexDirection: 'column', gap: 0 }}>

              {/* Amount slider */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: MUTED }}>Amount</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>
                    {currency === 'KHR'
                      ? `៛${(amount * 4000).toLocaleString('en-US')}`
                      : `$${amount.toLocaleString('en-US')}`}
                  </Typography>
                </Box>
                <Slider value={amount} onChange={(_, v) => setAmount(v as number)} min={500} max={maxAmount} step={500}
                  aria-label="Loan amount" sx={sliderSx} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                  <Typography sx={{ fontSize: 11, color: MUTED }}>$500</Typography>
                  <Typography sx={{ fontSize: 11, color: MUTED }}>${maxAmount.toLocaleString('en-US')}</Typography>
                </Box>
              </Box>

              <Box sx={{ height: '1px', bgcolor: '#F0F2F5', my: 2 }} />

              {/* Interest rate slider */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: MUTED }}>{t('interestRatePerMonth')}</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: rateEditable ? '#0B0F1A' : MUTED }}>{monthlyInterest.toFixed(2)}% {t('perMonth')}</Typography>
                </Box>
                <Slider
                  value={monthlyInterest}
                  onChange={(_, v) => { if (rateEditable) setMonthlyInterest(v as number) }}
                  min={0.5} max={2.0} step={0.01}
                  disabled={!rateEditable}
                  aria-label="Monthly interest rate"
                  sx={rateEditable ? sliderSx : { ...sliderSx, opacity: 0.45, pointerEvents: 'none' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                  <Typography sx={{ fontSize: 11, color: MUTED }}>0.50%</Typography>
                  <Typography sx={{ fontSize: 11, color: MUTED }}>2.00%</Typography>
                </Box>
              </Box>

              <Box sx={{ height: '1px', bgcolor: '#F0F2F5', my: 2 }} />

              {/* Term slider */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: MUTED }}>{t('loanTerm')}</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>{term} {t('months')}</Typography>
                </Box>
                <Slider value={term} onChange={handleTermChange} min={6} max={240} step={1}
                  aria-label="Loan term in months" sx={sliderSx} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                  <Typography sx={{ fontSize: 11, color: MUTED }}>6 months</Typography>
                  <Typography sx={{ fontSize: 11, color: MUTED }}>240 months</Typography>
                </Box>
              </Box>

            </Box>
          </Box>

          {/* ─── Results ──────────────────────────────────────────────────── */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Payment mode grid */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: '14px' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: '#9AA3B2', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Icon name="equal" size={13} color="#9AA3B2" /> Payment mode
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {PAYMENT_MODES.map((m, i) => {
                  const active = repaymentMethod === m.name
                  return (
                    <Box key={m.name} role="button" onClick={() => setRepaymentMethod(m.name)}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '14px', borderRadius: '14px', border: `1.5px solid ${active ? BLUE : '#E8EAEE'}`, bgcolor: active ? '#EEF3FC' : '#FAFAFA', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: active ? BLUE : '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name={m.icon} size={20} color={active ? '#fff' : '#9AA3B2'} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: active ? BLUE : '#0B0F1A', lineHeight: 1.3 }}>{m.name === 'Mix-Grace Period' ? 'Mixed' : m.name}</Typography>
                        <Typography sx={{ fontSize: 11.5, color: '#9AA3B2', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{m.sub}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>

              {/* Grace period slider — visible only for Mixed */}
              {repaymentMethod === 'Mix-Grace Period' && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #F0F2F5' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Icon name="clock" size={14} color={MUTED} />
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: MUTED }}>Grace period <Typography component="span" sx={{ fontSize: 11, color: '#B0B8C8' }}>(Interest Only Payment)</Typography></Typography>
                    </Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: BLUE }}>{gracePeriod} months</Typography>
                  </Box>
                  <Slider value={gracePeriod} onChange={(_, v) => setGracePeriod(v as number)} min={1} max={12} step={1} aria-label="Grace period" sx={sliderSx} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                    <Typography sx={{ fontSize: 11, color: MUTED }}>1 month</Typography>
                    <Typography sx={{ fontSize: 11, color: MUTED }}>12 months</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Monthly payment summary */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: '26px' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.6px', color: LABEL, textTransform: 'uppercase' }}>
                {t('monthlyInstalment')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, mt: 0.5 }}>
                <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#000', letterSpacing: '-0.5px', lineHeight: 1 }}>
                  {money(payment, currency)}
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#000', mb: '2px' }}>{t('perMonth')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.18)' }}>
                <SummaryStat label={t('totalInterest')} value={money(totalInterest, currency)} />
                <SummaryStat label={t('totalPayable')} value={money(totalPayable, currency)} />
              </Box>
            </Box>

            {/* Repayment preview */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Section header — outside card */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: LABEL }}>REPAYMENT PREVIEW</Typography>
                <Box
                  component="span"
                  onClick={() => navigate('/calculator-schedule', { state: { rows, totals: { principal: totalPrincipalPaid, interest: totalInterest, payable: totalPayable }, currency, term } })}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 12, fontWeight: 700, color: BLUE, cursor: 'pointer', '&:active': { opacity: 0.7 } }}
                >
                  <Icon name="download" size={13} color={BLUE} />
                  {t('downloadSchedule')}
                </Box>
              </Box>
              {/* Table card */}
              <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #F0F0F0' }}>
                <RepaymentTable
                  rows={rows}
                  totals={{ principal: totalPrincipalPaid, interest: totalInterest, payable: totalPayable }}
                  currency={currency}
                  showAll={showAllRows}
                />
              </Box>
              {/* Footer link — outside card */}
              <Box
                onClick={() => setShowAllRows((v) => !v)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, cursor: 'pointer', '&:active': { opacity: 0.7 } }}
              >
                <Icon name={showAllRows ? 'chevronUp' : 'eye'} size={14} color={BLUE} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: BLUE }}>
                  {showAllRows ? t('close') : t('viewFullSchedule')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ flexShrink: 0, px: 3, pb: '44px', pt: 1, bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/all-loan')}
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
  locked = false,
}: {
  label: string
  options: IconOption[]
  value: string
  onChange: (v: string) => void
  /** When locked, the field is fixed to its value (no dropdown). */
  locked?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.name === value)

  useEffect(() => {
    if (!open || locked) return
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
        onClick={locked ? undefined : () => setOpen((v) => !v)}
        trailing={
          locked ? (
            <Icon name={current?.icon ?? 'minusCircle'} size={20} color={BLUE} />
          ) : (
            <Box sx={{ display: 'flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <Icon name="chevronDown" size={18} color={MUTED} />
            </Box>
          )
        }
      />
      {open && !locked && (
        <Box sx={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 30, bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(11,15,26,0.12)' }}>
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
                  minHeight: 56,
                  bgcolor: active ? '#F4F8FF' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <Icon name={p.icon} size={22} color={active ? BLUE : '#9CA3AF'} />
                <Typography sx={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: active ? 700 : 500, color: active ? BLUE : '#0B0F1A' }}>
                  {p.name}
                </Typography>
                {active && <Icon name="check" size={18} color={BLUE} />}
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
  showAll = false,
}: {
  rows: ScheduleRow[]
  totals: { principal: number; interest: number; payable: number }
  currency: Currency
  showAll?: boolean
}) {
  const allRows = rows.filter((r) => r.month > 0)
  const preview = showAll ? allRows : allRows.slice(0, 3)
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

// ─── Download preview sheet ───────────────────────────────────────────────────
function DownloadSheet({
  open,
  onClose,
  rows,
  totals,
  currency,
  term,
}: {
  open: boolean
  onClose: () => void
  rows: ScheduleRow[]
  totals: { principal: number; interest: number; payable: number }
  currency: Currency
  term: number
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
          {term} months · {currency} · preview of first {previewRows.length - 1} installments
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
          startIcon={<Icon name="download" size={18} color="#fff" />}
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
