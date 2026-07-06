import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'
import { AssetImg, asset } from '../../components/home/media'
import { useFlow } from '../../workspace/FlowContext'
import { addApplication, hasApplication, reviewQuery, type LoanApplication } from '../../workspace/applications'
import { BLUE } from './MwlParts'

const HEADING = '#0B0F1A'
const MUTED   = '#8A94A6'

export default function MwlSuccessScreen({ product: productProp = 'Migration Worker Loan' }: { product?: string } = {}) {
  const navigate = useNavigate()
  const { setFlow } = useFlow()
  const [params] = useSearchParams()
  const product = params.get('product') ?? productProp

  const app: LoanApplication = {
    title: product,
    amount: '$2,000.00',
    term: '12 months',
    rate: '1.50%/mo',
    ref: 'NH-2026-' + product.replace(/[^A-Z]/g, '').slice(0, 3) + '99201',
    on: 'Today',
    track: false,
  }

  const goToLoans = () => {
    if (!hasApplication(app.ref)) addApplication(app)
    setFlow('Borrower')
    navigate('/loan-requests')
  }

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, pb: 4 }}>

        {/* Mascot illustration */}
        <Box sx={{ height: 220, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <AssetImg
            src={asset('illustrations/mascot_done.png')}
            alt=""
            sx={{ height: '100%', width: '100%', objectFit: 'contain' }}
            fallback={
              <Box sx={{ width: 110, height: 110, borderRadius: '50%', bgcolor: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box component="img" src="/assets/brand/ico_success.svg" alt="" sx={{ width: 60, height: 60 }} />
              </Box>
            }
          />
        </Box>

        {/* Title */}
        <Typography sx={{ fontSize: 32, fontWeight: 800, color: HEADING, letterSpacing: '-1px', textAlign: 'center', lineHeight: 1.15 }}>
          Application Submitted!
        </Typography>

        {/* Status badge + ref */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
          <Box sx={{ bgcolor: '#EEF3FC', borderRadius: '999px', px: '10px', py: '4px' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: BLUE }}>Under Assessment</Typography>
          </Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: MUTED }}>{app.ref}</Typography>
        </Box>

        {/* Description */}
        <Typography sx={{ fontSize: 15, color: '#6B7280', lineHeight: 1.65, textAlign: 'center', mt: 2.5, maxWidth: 290 }}>
          Your{' '}
          <Box component="span" sx={{ fontWeight: 800, color: HEADING }}>{product}</Box>{' '}
          request of{' '}
          <Box component="span" sx={{ fontWeight: 800, color: HEADING }}>{app.amount}</Box>{' '}
          has been submitted and is now under assessment. Track its status anytime in My Loans.
        </Typography>

      </Box>

      {/* Bottom CTA */}
      <Box sx={{ flexShrink: 0, px: 3, pb: '44px', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={goToLoans}
          endIcon={<Icon name="arrowRight" size={18} />}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, textTransform: 'none' }}
        >
          View My Loans
        </Button>
        <Button
          variant="text"
          fullWidth
          onClick={() => navigate('/products')}
          sx={{ height: 44, fontSize: 15, fontWeight: 700, color: BLUE, textTransform: 'none' }}
        >
          Browse Loans
        </Button>
      </Box>
    </Box>
  )
}
