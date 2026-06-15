import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'
import { useFlow } from '../../workspace/FlowContext'

const GREEN = '#2E7D32'

export default function MwlSuccessScreen({ product = 'Migration Worker Loan' }: { product?: string } = {}) {
  const navigate = useNavigate()
  const { setFlow } = useFlow()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, textAlign: 'center' }}>
        <Box sx={{ width: 88, height: 88, borderRadius: '50%', bgcolor: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Box component="img" src="/assets/brand/ico_success.svg" alt="" sx={{ width: 48, height: 48 }} />
        </Box>

        <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', mb: 1.5 }}>
          Application received!
        </Typography>

        <Typography sx={{ fontSize: 17, color: '#6B7280', lineHeight: 1.5 }}>
          Thank you, <Box component="span" sx={{ fontWeight: 700, color: '#0B0F1A' }}>Sophea Kim</Box>.
          Your loan request for <Box component="span" sx={{ fontWeight: 700, color: '#0B0F1A' }}>{product}</Box> has been submitted.
          Our loan officer will contact you at <Box component="span" sx={{ fontWeight: 700, color: '#0B0F1A' }}>096 234 5678</Box> within 1 business day.
        </Typography>
      </Box>

      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            setFlow('Applicant')
            navigate('/my-loan?v=1')
          }}
          startIcon={<Icon name="myLoan" size={20} />}
          sx={{ height: 56, borderRadius: '14px', fontSize: 17, fontWeight: 700 }}
        >
          View My Loans
        </Button>
      </Box>
    </Box>
  )
}
