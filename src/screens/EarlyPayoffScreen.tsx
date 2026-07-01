import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../components/Icon'
import { MwlHeader, MwlTitle, BLUE } from './mwl/MwlParts'
import { StatusChip } from '../components/home/HomeParts'
import PayLoanSheet from '../components/PayLoanSheet'

const HEADING = '#0B0F1A'
const LABEL = '#8A94A6'
const VALUE = '#171717'

const REASONS = ['Loan fully repaid ahead of schedule', 'Sale of collateral asset', 'Refinancing with another institution', 'Other']

// ─────────────────────────────────────────────────────────────────────────────
// Early payoff — full settlement breakdown + comment, requests a payoff letter.
// Reached from My Loan detail → Others → "Payoff Request".
// ─────────────────────────────────────────────────────────────────────────────
type Row = { label: string; value: string }

const BREAKDOWN: Row[] = [
  { label: 'Principal', value: '$120.00' },
  { label: 'Interest', value: '$14.40' },
  { label: 'Late fee', value: '$0.80' },
  { label: 'Early settlement fee (2%)', value: '$90.00' },
]

function BreakdownRow({ label, value }: Row) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '7px' }}>
      <Typography sx={{ fontSize: 14, color: LABEL }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: VALUE }}>{value}</Typography>
    </Box>
  )
}

export default function EarlyPayoffScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const isStaff = params.get('staff') === 'true'
  const [payoffDate, setPayoffDate] = useState('')
  const [reason, setReason] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [settleMethod, setSettleMethod] = useState<'qr' | 'salary' | ''>('')
  const [payOpen, setPayOpen] = useState(false)

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => navigate(-1)} />
        <MwlTitle>Early payoff</MwlTitle>

        <Box sx={{ px: 3, pb: 3, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Notice-only warning — hidden for Staff */}
          {!isStaff && (
            <Box sx={{ display: 'flex', gap: 1.25, bgcolor: '#FBF3DD', borderRadius: '12px', p: '14px 16px' }}>
              <Box sx={{ mt: '1px' }}><Icon name="alert" size={18} color="#C47F11" /></Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: '#7A5A12' }}>This serves a notice only</Typography>
                <Typography sx={{ fontSize: 12.5, color: '#7A5A12', lineHeight: 1.5, mt: 0.5 }}>
                  The <Box component="span" sx={{ fontWeight: 800 }}>actual payoff is completed at the branch</Box>. Your branch calculates the precise payoff amount, any lock-in penalty, and releases your collateral from the vault. This form simply tells NH you intend to pay off.
                </Typography>
              </Box>
            </Box>
          )}

          {/* Total repay amount + breakdown */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '18px' }}>
            {isStaff ? (
              <>
                <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: LABEL, mb: 1 }}>
                  TOTAL OUTSTANDING
                </Typography>
                {/* Staff payoff chip */}
                <Box sx={{ mb: 1.5 }}>
                  <StatusChip label="✓  PAYOFF TODAY · STAFF LOAN" color="#1C3A7A" bg="#F5C518" />
                </Box>
                <Typography sx={{ fontSize: 38, fontWeight: 800, color: HEADING, letterSpacing: '-1.5px', lineHeight: 1.05 }}>
                  $1,792.48
                </Typography>
                <Typography sx={{ fontSize: 13, color: LABEL, mt: 0.75 }}>
                  Acct 026-01285971 · settles your loan in full
                </Typography>
              </>
            ) : (
              <>
                <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: LABEL }}>
                  TOTAL REPAY AMOUNT
                </Typography>
                <Typography sx={{ fontSize: 34, fontWeight: 800, color: HEADING, letterSpacing: '-1px', lineHeight: 1.1, mt: 0.5 }}>
                  $4,612.50
                </Typography>
              </>
            )}

            <Box sx={{ borderTop: '1px dashed #D6DCE5', my: '14px' }} />

            {BREAKDOWN.map((r) => (
              <Box key={r.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '7px' }}>
                <Typography sx={{ fontSize: 14, color: LABEL }}>{r.label}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: VALUE }}>{r.value}</Typography>
              </Box>
            ))}

            {/* You save section — Staff only */}
            {isStaff && (
              <Box sx={{ borderTop: '1px dashed #D6DCE5', mt: '4px', pt: '10px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '4px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Icon name="check" size={13} color="#2E7D32" />
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#2E7D32' }}>Interest saved</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#2E7D32' }}>$184.67</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: LABEL, pl: '21px', lineHeight: 1.5 }}>
                  Paying off today saves vs. continuing the remaining 21 installments at $44.42/mo
                </Typography>
              </Box>
            )}
          </Box>


          {/* Early payoff warning — Staff only */}
          {isStaff && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, bgcolor: '#FFFBEA', border: '1px solid #F5D76E', borderRadius: '12px', p: '12px 14px' }}>
              <Box sx={{ mt: '1px', flexShrink: 0 }}>
                <Icon name="alert" size={14} color="#C47F11" />
              </Box>
              <Typography sx={{ fontSize: 13, color: '#7A5A12', lineHeight: 1.5 }}>
                Paying off early stops all future salary deductions for this loan.
              </Typography>
            </Box>
          )}

          {/* Notice details — hidden for Staff */}
          {!isStaff && (
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '18px' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: LABEL, mb: 1.5 }}>NOTICE DETAILS</Typography>

              <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING }}>Intended Payoff Date</Typography>
              <Box
                component="input"
                type="date"
                value={payoffDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPayoffDate(e.target.value)}
                sx={{ width: '100%', boxSizing: 'border-box', mt: 0.75, height: 46, borderRadius: '10px', border: '1px solid #E2E6EC', px: 1.5, fontFamily: 'inherit', fontSize: 15, color: HEADING, outline: 'none', bgcolor: '#fff', '&:focus': { borderColor: BLUE } }}
              />

              <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING, mt: 2 }}>Reason</Typography>
              <Box
                component="select"
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReason(e.target.value)}
                sx={{ width: '100%', boxSizing: 'border-box', mt: 0.75, height: 46, borderRadius: '10px', border: '1px solid #E2E6EC', px: 1.5, fontFamily: 'inherit', fontSize: 15, color: reason ? HEADING : '#A8B0BD', outline: 'none', bgcolor: '#fff', '&:focus': { borderColor: BLUE } }}
              >
                <option value="">Select reason…</option>
                {REASONS.map((r) => (
                  <option key={r} value={r} style={{ color: HEADING }}>{r}</option>
                ))}
              </Box>
            </Box>
          )}

          {/* Confirmation */}
          <Box
            role="button"
            onClick={() => setAgreed((a) => !a)}
            sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start', bgcolor: '#F4F6F9', borderRadius: '12px', p: '14px 16px', cursor: 'pointer' }}
          >
            <Box sx={{ width: 22, height: 22, borderRadius: '6px', flexShrink: 0, mt: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: agreed ? BLUE : '#fff', border: agreed ? 'none' : '1.5px solid #C9D2DE', transition: 'background-color 0.15s' }}>
              {agreed && <Icon name="check" size={15} color="#fff" />}
            </Box>
            <Typography sx={{ fontSize: 13, color: '#5B6473', lineHeight: 1.5 }}>
              {isStaff
                ? 'I authorise NH Finance to settle Staff Loan 026-01285971 in full today, and I understand future salary deductions for this loan will stop.'
                : 'I confirm this is my genuine intent to fully repay this loan, and I understand the final payoff amount, any penalty, and collateral release are completed at the branch.'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!agreed}
          onClick={() => isStaff ? setPayOpen(true) : navigate('/early-payoff-success')}
          sx={{ height: 48, borderRadius: '12px', fontSize: 14, fontWeight: 700, bgcolor: BLUE, '&.Mui-disabled': { bgcolor: '#B9C3D2', color: '#fff' } }}
        >
          {isStaff ? 'Confirm Payoff' : 'Submit Notice'}
        </Button>
      </Box>
      <PayLoanSheet open={payOpen} onClose={() => setPayOpen(false)} />
    </Box>
  )
}
