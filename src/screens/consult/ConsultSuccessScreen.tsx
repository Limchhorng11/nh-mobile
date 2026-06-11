import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Request consultation · Success — booking request submitted.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#6B7280'
const GREEN = '#2E7D32'

export default function ConsultSuccessScreen() {
  const navigate = useNavigate()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{ width: 96, height: 96, borderRadius: '50%', bgcolor: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
            <Icon name="checkCircle" size={52} color={GREEN} strokeWidth={2} />
          </Box>
          <Typography sx={{ fontSize: 26, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', mb: 1 }}>
            Request received
          </Typography>
          <Typography sx={{ fontSize: 16, color: MUTED, lineHeight: 1.5, maxWidth: 300 }}>
            An officer will confirm your booking within 4 business hours. We'll call you.
          </Typography>
        </Box>

        {/* Booking card */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff', borderRadius: '16px', p: '16px', mt: 4 }}>
          {/* Date tile */}
          <Box sx={{ width: 64, flexShrink: 0, bgcolor: '#E6F4EA', borderRadius: '12px', py: 1.25, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.5px', color: GREEN }}>FRI</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 800, color: GREEN, lineHeight: 1.1 }}>25</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.5px', color: GREEN }}>MAY</Typography>
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon name="phone" size={18} color={HEADING} />
              <Typography sx={{ fontSize: 17, fontWeight: 800, color: HEADING }}>Branch Visit</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon name="findBranch" size={18} color={MUTED} />
              <Typography sx={{ fontSize: 15, color: MUTED }}>Toul Kork branch</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon name="clock" size={18} color={MUTED} />
              <Typography sx={{ fontSize: 15, color: MUTED }}>8:00AM</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/home?v=1')}
          startIcon={<Icon name="home" size={20} />}
          sx={{ height: 56, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  )
}
