import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Early payoff · Success — shown after the PIN confirmation.
// ─────────────────────────────────────────────────────────────────────────────
const GREEN = '#2E7D32'

export default function EarlyPayoffSuccessScreen() {
  const navigate = useNavigate()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{ width: 96, height: 96, borderRadius: '50%', bgcolor: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
            <Icon name="checkCircle" size={52} color={GREEN} strokeWidth={2} />
          </Box>
          <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', mb: 1 }}>
            Request submitted!
          </Typography>
          <Typography sx={{ fontSize: 15, color: '#6B7280', lineHeight: 1.5 }}>
            We've received your request and will review it carefully. Our loan officer will contact
            you at <Box component="span" sx={{ fontWeight: 700, color: '#0B0F1A' }}>096 234 5678</Box> within 1 business day.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/my-loan')}
          startIcon={<Icon name="myLoan" size={20} />}
          sx={{ height: 52, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}
        >
          Back to My Loan
        </Button>
      </Box>
    </Box>
  )
}
