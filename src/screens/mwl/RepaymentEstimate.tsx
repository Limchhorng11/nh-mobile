import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import { Icon } from '../../components/Icon'
import { GroupLabel, BottomSheet, BLUE } from './MwlParts'
import { buildGraceSchedule, money, type Currency } from '../loanCalc'

// ─────────────────────────────────────────────────────────────────────────────
// Repayment estimate — the shared "Estimate Your Repayment" card used across the
// MWL, Non-MWL and Staff Loan apply flows. Shows the interest rate, a tenure
// slider and the constant monthly payment, with a "View schedule" bottom sheet
// (summary tiles + full table + a watermarked PDF download).
// ─────────────────────────────────────────────────────────────────────────────
export default function RepaymentEstimate({
  product,
  principal,
  currency,
  months,
  onMonthsChange,
  minMonths,
  maxMonths,
  monthsStep = 1,
  ratePct,
  graceMonths = 0,
  label = 'ESTIMATE YOUR REPAYMENT',
  scheduleTitle,
  children,
  paymentNote,
  onPrincipalChange,
  minAmount,
  maxAmount,
  hideSummaryAmount = false,
  hidePaymentFigure = false,
}: {
  product: string
  principal: number
  currency: Currency
  months: number
  onMonthsChange: (m: number) => void
  minMonths: number
  maxMonths: number
  /** Discrete tenure increment in months (e.g. 6 to snap to 6/12/18/24). Defaults to 1. */
  monthsStep?: number
  ratePct: number
  /** Interest-only grace months at the start of the term (0 = none). */
  graceMonths?: number
  label?: string
  /** Override the schedule sheet heading (e.g. destination name for MWL). */
  scheduleTitle?: string
  /** Optional content rendered inside the card, after the footnote. */
  children?: React.ReactNode
  /** Optional note rendered below the estimated monthly payment amount. Receives the computed payment value. */
  paymentNote?: (payment: number) => React.ReactNode
  /** If provided, renders an Amount slider above the Loan tenure slider. */
  onPrincipalChange?: (p: number) => void
  minAmount?: number
  maxAmount?: number
  /** When true (and children provided), hides the large duplicate payment amount + note below children — use when children's own breakdown already shows the monthly payment. */
  hideSummaryAmount?: boolean
  /** When true (and children provided), hides only the large payment figure while keeping the paymentNote and View schedule link. */
  hidePaymentFigure?: boolean
}) {
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const yrsLabel = Number.isInteger(months / 12) ? months / 12 : (months / 12).toFixed(1)

  // With a grace period the borrower pays interest only for the first
  // `grace` months, then the principal amortises over the remaining term.
  const grace = Math.min(Math.max(0, graceMonths), Math.max(0, months - 1))
  const interestOnlyPay = principal * (ratePct / 100)
  const { payment, totalPayable, totalInterest, rows } = buildGraceSchedule(principal, months, ratePct, grace)

  // Download the full repayment schedule as a PDF (via the browser's
  // print-to-PDF). The document carries a single large "DRAFT" watermark so an
  // estimate can't be mistaken for a final agreement.
  const downloadPdf = () => {
    const tableRows = rows
      .filter((r) => r.month >= 1)
      .map(
        (r) => `<tr>
          <td class="c">${r.month}</td>
          <td class="r b">${money(r.payment, currency)}</td>
          <td class="r">${money(r.principal, currency)}</td>
          <td class="r">${money(r.interest, currency)}</td>
          <td class="r">${money(r.balance, currency)}</td>
        </tr>`,
      )
      .join('')

    const doc = `<!doctype html><html><head><meta charset="utf-8" />
<title>Repayment Schedule — DRAFT</title>
<style>
  @page { margin: 18mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif; color: #0B0F1A; margin: 0; padding: 24px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  /* Single large DRAFT watermark — fixed so it sits centred on every printed page. */
  .wm { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
        display: flex; align-items: center; justify-content: center; }
  .wm span { color: rgba(90,100,120,0.13); font-size: 150px; font-weight: 900; letter-spacing: 16px;
             white-space: nowrap; transform: rotate(-30deg); }
  .content { position: relative; z-index: 1; }
  h1 { font-size: 22px; margin: 0; letter-spacing: -0.3px; }
  .sub { font-size: 12px; color: #8A94A6; margin: 4px 0 0; }
  .badge { display: inline-block; margin-top: 10px; font-size: 11px; font-weight: 800; letter-spacing: 1px;
           color: #B42318; background: #FEE4E2; border: 1px solid #FDA29B; border-radius: 999px; padding: 4px 10px; }
  .tiles { display: flex; gap: 10px; margin: 18px 0 16px; }
  .tile { flex: 1; background: #EEF3FC; border-radius: 10px; padding: 12px 14px; }
  .tile .k { font-size: 10px; font-weight: 700; letter-spacing: 0.4px; color: #5B7299; }
  .tile .v { font-size: 16px; font-weight: 800; margin-top: 3px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #FAFAFA; border-bottom: 1.5px solid #E8EAEE; color: #737373; font-weight: 700; letter-spacing: 0.3px; padding: 8px; text-align: right; }
  th.l { text-align: left; }
  td { padding: 8px; border-top: 1px solid #F2F2F2; color: #3A4256; }
  td.c { text-align: center; color: #737373; font-weight: 600; }
  td.r { text-align: right; }
  td.b { color: #0B0F1A; font-weight: 700; }
  tr { page-break-inside: avoid; }
  .foot { margin-top: 16px; font-size: 11px; color: #8A94A6; text-align: center; }
</style></head>
<body>
  <div class="wm"><span>DRAFT</span></div>
  <div class="content">
    <h1>Repayment Schedule</h1>
    <p class="sub">${product} · ${months} months · ${yrsLabel} yrs · ${ratePct}% / mo${grace > 0 ? ` · ${grace} mo interest-only` : ''}</p>
    <span class="badge">DRAFT · ESTIMATE ONLY</span>
    <div class="tiles">
      <div class="tile"><div class="k">MONTHLY</div><div class="v">${money(payment, currency)}</div></div>
      <div class="tile"><div class="k">TOTAL REPAYABLE</div><div class="v">${money(totalPayable, currency)}</div></div>
      <div class="tile"><div class="k">TOTAL INTEREST</div><div class="v">${money(totalInterest, currency)}</div></div>
    </div>
    <table>
      <thead><tr>
        <th class="l">#</th><th>PAYMENT</th><th>PRINCIPAL</th><th>INTEREST</th><th>BALANCE</th>
      </tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <p class="foot">Estimate only · equal monthly installments · final rate, tenure &amp; terms subject to credit approval.</p>
  </div>
  <script>window.onload = function () { setTimeout(function () { window.print(); }, 150); };</script>
</body></html>`

    const w = window.open('', '_blank')
    if (!w) return
    w.document.open()
    w.document.write(doc)
    w.document.close()
  }

  return (
    <Box>
      {label && <GroupLabel>{label}</GroupLabel>}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', p: '18px' }}>
        {/* Interest rate */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#525252' }}>Interest rate</Typography>
          <Box sx={{ bgcolor: '#EEF3FC', borderRadius: '999px', px: 1.25, py: '3px' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: BLUE }}>{ratePct}% / mo</Typography>
          </Box>
        </Box>

        {/* Amount slider — only when onPrincipalChange is provided */}
        {onPrincipalChange && minAmount !== undefined && maxAmount !== undefined && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#525252' }}>Amount</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0B0F1A' }}>
                ${principal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Typography>
            </Box>
            <Box sx={{ px: 0.5 }}>
              <Slider
                value={Math.min(Math.max(principal, minAmount), maxAmount)}
                onChange={(_, v) => onPrincipalChange(v as number)}
                step={50}
                min={minAmount}
                max={maxAmount}
                aria-label="Loan amount"
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `$${v}`}
                sx={{
                  mt: 1,
                  color: BLUE,
                  height: 6,
                  '& .MuiSlider-rail': { bgcolor: '#E7ECF2', opacity: 1 },
                  '& .MuiSlider-thumb': { width: 20, height: 20, boxShadow: '0 0 0 4px rgba(39,92,178,0.15)' },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>${minAmount}</Typography>
              <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>${maxAmount.toLocaleString()}</Typography>
            </Box>
          </>
        )}

        {/* Loan tenure + slider */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: 2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#525252' }}>Loan tenure</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0B0F1A' }}>
            {months} months
          </Typography>
        </Box>
        <Box sx={{ px: 0.5 }}>
          <Slider
            value={months}
            onChange={(_, v) => onMonthsChange(v as number)}
            step={monthsStep}
            min={minMonths}
            max={maxMonths}
            aria-label="Loan term in months"
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}m`}
            sx={{
              mt: 1,
              color: BLUE,
              height: 6,
              '& .MuiSlider-rail': { bgcolor: '#E7ECF2', opacity: 1 },
              '& .MuiSlider-thumb': { width: 20, height: 20, boxShadow: '0 0 0 4px rgba(39,92,178,0.15)' },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>{minMonths} mo</Typography>
          <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>
            {maxMonths} mo
          </Typography>
        </Box>

        {/* Estimated monthly payment */}
        {grace > 0 ? (
          // With a grace period: two rows — interest-only vs regular repayment.
          <Box sx={{ bgcolor: '#EEF3FC', borderRadius: '12px', p: '14px 16px', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#5B7299' }}>Estimated monthly payment</Typography>
              <Box role="button" onClick={() => setScheduleOpen(true)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                <Icon name="eye" size={18} color={BLUE} />
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: BLUE }}>View schedule</Typography>
              </Box>
            </Box>
            <Box sx={{ borderTop: '1px solid #DCE6F5', mt: 1.25, pt: 1 }}>
              {/* Interest Only row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
                <Typography sx={{ fontSize: 13, color: '#5B7299' }}>Interest Only</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 800, color: BLUE }}>{money(interestOnlyPay, currency)}</Typography>
              </Box>
              {/* Regular Repayment row */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #DCE6F5', py: 0.75 }}>
                <Typography sx={{ fontSize: 13, color: '#5B7299' }}>Regular Repayment</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 800, color: BLUE }}>{money(payment, currency)}</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ bgcolor: '#EEF3FC', borderRadius: '12px', p: '14px 16px', mt: 2 }}>
            {children ? (
              <>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#5B7299' }}>Estimated monthly payment</Typography>
                {children}
                {hideSummaryAmount ? (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5, pt: 1.5, borderTop: '1px dashed #D6DCE5' }}>
                    <Box role="button" onClick={() => setScheduleOpen(true)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                      <Icon name="eye" size={18} color={BLUE} />
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: BLUE }}>View schedule</Typography>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ borderTop: '1px dashed #D6DCE5', mt: 1.5, pt: 1.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        {!hidePaymentFigure && <Typography sx={{ fontSize: 26, fontWeight: 800, color: BLUE, letterSpacing: '-0.5px' }}>{money(payment, currency)}</Typography>}
                        {paymentNote?.(payment)}
                      </Box>
                      <Box role="button" onClick={() => setScheduleOpen(true)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                        <Icon name="eye" size={18} color={BLUE} />
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: BLUE }}>View schedule</Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#5B7299' }}>Estimated monthly payment</Typography>
                  <Typography sx={{ fontSize: 26, fontWeight: 800, color: BLUE, letterSpacing: '-0.5px', mt: 0.25 }}>{money(payment, currency)}</Typography>
                  {paymentNote?.(payment)}
                </Box>
                <Box role="button" onClick={() => setScheduleOpen(true)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                  <Icon name="eye" size={18} color={BLUE} />
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: BLUE }}>View schedule</Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Footnote */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mt: 2 }}>
          <Box sx={{ mt: '1px' }}><Icon name="info" size={15} color="#9AA3B2" /></Box>
          <Typography sx={{ fontSize: 12, color: '#8A94A6', lineHeight: 1.45 }}>Final rate, tenure, &amp; terms are subject to credit approval.</Typography>
        </Box>
      </Box>

      {/* Full repayment schedule */}
      <BottomSheet open={scheduleOpen} onClose={() => setScheduleOpen(false)}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.3px' }}>
              {scheduleTitle || 'Repayment Schedule'}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: '#8A94A6', mt: 0.25 }}>
              {months} months · {ratePct}% / mo flat{grace > 0 ? ` · ${grace} mo interest-only` : ''}
            </Typography>
          </Box>
          <IconButton onClick={() => setScheduleOpen(false)} aria-label="Close" sx={{ width: 36, height: 36, flexShrink: 0, bgcolor: '#fff', border: '1px solid #E2E6EC' }}>
            <Icon name="close" size={18} color="#0B0F1A" />
          </IconButton>
        </Box>

        {/* Summary tiles — Loan / Tenure / Grace */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {([
            { label: 'Loan', value: money(principal, currency), icon: 'banknote' as const, bg: '#EEF3FC', iconBg: BLUE },
            { label: 'Tenure', value: `${months} mo`, icon: 'calendar' as const, bg: '#EDFBF3', iconBg: '#1FA85C' },
            ...(grace > 0 ? [{ label: 'Grace', value: `${grace} mo`, icon: 'clock' as const, bg: '#FFFBEB', iconBg: '#D97706' }] : []),
          ]).map((t) => (
            <Box key={t.label} sx={{ flex: 1, bgcolor: t.bg, borderRadius: '12px', p: '12px' }}>
              <Box sx={{ width: 30, height: 30, borderRadius: '8px', bgcolor: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={t.icon} size={16} color="#fff" />
              </Box>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#0B0F1A', mt: 1, letterSpacing: '-0.3px', lineHeight: 1.1 }}>{t.value}</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', mt: 0.25 }}>{t.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Full table — columns: # / PRINCIPAL / INTEREST / PAYMENT (all rows, no inner scroll) */}
        <Box sx={{ border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <Box component="thead" sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <Box component="tr">
                {(['#', 'PRINCIPAL', 'INTEREST', 'PAYMENT'] as const).map((h, i) => (
                  <Box component="th" key={h} sx={{ width: i === 0 ? 28 : undefined, bgcolor: '#FAFAFA', borderBottom: '1px solid #F0F0F0', fontSize: 10, fontWeight: 700, letterSpacing: '0.3px', color: i === 3 ? BLUE : '#737373', textAlign: i === 0 ? 'left' : 'right', px: '8px', py: 1 }}>{h}</Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {rows.filter((r) => r.month >= 1).map((row) => {
                const isGraceRow = grace > 0 && row.month <= grace
                return (
                  <Box component="tr" key={row.month} sx={{ borderTop: '1px solid #F4F4F4' }}>
                    <Box component="td" sx={{ fontSize: 12, textAlign: 'left', px: '8px', py: '9px', fontWeight: 700, color: isGraceRow ? '#D97706' : '#3A4256' }}>{row.month}</Box>
                    <Box component="td" sx={{ fontSize: 12, textAlign: 'right', px: '8px', py: '9px', color: isGraceRow ? '#9AA3B2' : '#D97706', fontWeight: isGraceRow ? 400 : 600 }}>
                      {isGraceRow ? '—' : money(row.principal, currency)}
                    </Box>
                    <Box component="td" sx={{ fontSize: 12, textAlign: 'right', px: '8px', py: '9px', color: BLUE, fontWeight: 600 }}>{money(row.interest, currency)}</Box>
                    <Box component="td" sx={{ fontSize: 12, textAlign: 'right', px: '8px', py: '9px', color: '#0B0F1A', fontWeight: 700 }}>{money(row.payment, currency)}</Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>

        {/* Grace note */}
        {grace > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', p: '10px 12px' }}>
            <Box sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{grace}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#92400E' }}>
              First {grace} month{grace > 1 ? 's' : ''} are grace (interest only).
            </Typography>
          </Box>
        )}

        {/* Totals summary */}
        <Box sx={{ bgcolor: '#F8F9FB', borderRadius: '14px', px: '16px' }}>
          {([
            ['Total principal', money(principal, currency), false],
            ['Total interest', money(totalInterest, currency), false],
            ['Total repayment', money(totalPayable, currency), true],
          ] as [string, string, boolean][]).map(([k, v, hi], i) => (
            <Box key={k} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: hi ? '14px' : '12px', borderTop: i === 0 ? 'none' : '1px solid #E8EAEE' }}>
              <Typography sx={{ fontSize: hi ? 14 : 13.5, fontWeight: hi ? 700 : 500, color: hi ? '#0B0F1A' : '#5B7299' }}>{k}</Typography>
              <Typography sx={{ fontSize: hi ? 20 : 14, fontWeight: 800, letterSpacing: hi ? '-0.4px' : 0, color: hi ? BLUE : '#3A4256' }}>{v}</Typography>
            </Box>
          ))}
        </Box>

        <Typography sx={{ fontSize: 11.5, color: '#8A94A6', textAlign: 'center', lineHeight: 1.5 }}>
          Estimate using a flat {ratePct}%/month illustration. Final terms confirmed by NH after assessment.{grace > 0 ? ' Excludes the USD 10 CBC fee and upfront fee.' : ''}
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          onClick={downloadPdf}
          startIcon={<Icon name="download" size={18} color={BLUE} />}
          sx={{ height: 48, borderRadius: '12px', fontSize: 14, fontWeight: 700, color: BLUE, borderColor: '#C9D6EC', bgcolor: '#fff', '&:hover': { borderColor: BLUE, bgcolor: '#F4F8FF' } }}
        >
          Download PDF
        </Button>
      </BottomSheet>
    </Box>
  )
}
