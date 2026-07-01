import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'
import { AssetImg, asset } from '../components/home/media'

const HEADING = '#0B0F1A'
const BLUE = '#275CB2'
const GREEN = '#1FA85C'
const MUTED = '#8A94A6'
const LABEL = '#737373'

function MetaRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '10px', borderBottom: '1px solid #F2F4F7', '&:last-child': { borderBottom: 'none' } }}>
      <Typography sx={{ fontSize: 14, color: LABEL }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: green ? GREEN : HEADING }}>{value}</Typography>
    </Box>
  )
}

export default function StaffLoanApprovedScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const amount = params.get('amount') ?? '$500.00'
  const term = params.get('term') ?? '12 months'
  const rate = params.get('rate') ?? '1%/mo'
  const ref = params.get('ref') ?? 'NH-2026-04830'

  // Parse principal from amount string e.g. "$500.00"
  const principal = parseFloat(amount.replace(/[^0-9.]/g, '')) || 500
  const upfrontFee = principal * 0.01
  const cbcFee = 5
  const netDisbursed = principal - upfrontFee - cbcFee
  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // Simple flat monthly repayment estimate
  const months = parseInt(term) || 12
  const r = parseFloat(rate) / 100
  const monthly = r === 0 ? principal / months : (principal * r) / (1 - Math.pow(1 + r, -months))

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      <Box className="scroll-content" sx={{ flex: 1, pb: '44px' }}>

        {/* Back */}
        <Box sx={{ px: 1, pt: 1 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
        </Box>

        {/* Mascot */}
        <Box sx={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', mt: -1 }}>
          <AssetImg
            src={asset('illustrations/mascot_done.png')}
            alt=""
            sx={{ height: '100%', width: '100%', objectFit: 'contain' }}
            fallback={
              <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#DCF5E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={36} color={GREEN} />
              </Box>
            }
          />
        </Box>

        {/* Title + badge */}
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: HEADING, letterSpacing: '-1px', px: 3, mt: 0.5, lineHeight: 1.15, textAlign: 'center' }}>
          Loan Approved!
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1.25 }}>
          <Box sx={{ bgcolor: '#DCF5E6', borderRadius: '999px', px: '10px', py: '3px' }}>
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: GREEN }}>Approved</Typography>
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: LABEL, letterSpacing: '0.3px' }}>{ref}</Typography>
        </Box>

        <Box sx={{ px: 3, pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Disbursement amount hero */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', p: '20px' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: LABEL }}>AMOUNT DISBURSED TO YOUR PAYROLL</Typography>
            <Typography sx={{ fontSize: 38, fontWeight: 800, color: GREEN, letterSpacing: '-1.5px', lineHeight: 1.1, mt: 0.5 }}>
              {fmt(netDisbursed)}
            </Typography>
            <Box sx={{ borderTop: '1px dashed #D6DCE5', mt: '14px', mb: '10px' }} />
            <MetaRow label="Loan amount" value={fmt(principal)} />
            <MetaRow label={`Upfront fee (${rate.replace('/mo', '')})`} value={`-${fmt(upfrontFee)}`} />
            <MetaRow label="CBC fee" value={`-${fmt(cbcFee)}`} />
          </Box>

          {/* Loan details */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', px: '18px', py: '6px' }}>
            <MetaRow label="Term" value={term} />
            <MetaRow label="Interest rate" value={rate} />
            <MetaRow label="Monthly repayment" value={fmt(monthly)} />
            <MetaRow label="1st Payroll Deduction" value="Next payday" />
            <MetaRow label="Approved on" value="1 Jul 2026" />
          </Box>

          {/* Disbursement notice */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, bgcolor: '#EAF4EE', border: '1px solid #B7DFCA', borderRadius: '12px', p: '14px 16px' }}>
            <Box sx={{ flexShrink: 0, mt: '1px' }}>
              <Icon name="info" size={16} color="#1A7A45" strokeWidth={1.8} />
            </Box>
            <Typography sx={{ fontSize: 13, color: '#2D6A48', lineHeight: 1.55 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>Funds have been disbursed</Box> to your registered NongHyup payroll account. Monthly repayments will be auto-deducted from your next payroll cycle.
            </Typography>
          </Box>

        </Box>
      </Box>

      {/* CTA */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 2, pb: '44px', bgcolor: '#fff' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/my-loan-detail?product=Staff+Loan')}
          endIcon={<Icon name="arrowRight" size={18} />}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
        >
          View my loans
        </Button>
      </Box>
    </Box>
  )
}
