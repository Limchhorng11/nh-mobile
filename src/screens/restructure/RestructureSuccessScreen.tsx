import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Request Restructure · Success — Request submitted
// ─────────────────────────────────────────────────────────────────────────────
const GREEN = '#2E7D32'

export default function RestructureSuccessScreen() {
  const navigate = useNavigate()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 3 }}>
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

        {/* Reference card */}
        <Box sx={{ bgcolor: '#fff', borderRadius: '14px', p: '18px', mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6' }}>REFERENCE</Typography>
            <Box sx={{ bgcolor: '#FBEBC6', borderRadius: '999px', px: '9px', py: '3px' }}>
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.4px', color: '#B7791F' }}>IN REVIEW</Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0B0F1A', letterSpacing: '0.5px', mt: 0.5 }}>RS-2026-00188</Typography>

          <Box sx={{ height: '1px', bgcolor: '#F0F0F0', my: 1.75 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>Submitted</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0B0F1A' }}>27 May 2026 · 14:34</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, bgcolor: '#E9EBEF', borderRadius: '12px', px: '14px', py: '12px', mt: 1.75 }}>
            <Box
              component="img"
              src="/assets/brand/ico_info_16.svg"
              alt=""
              sx={{ mt: '1px', flexShrink: 0, width: 16, height: 16, display: 'block' }}
            />
            <Typography sx={{ fontSize: 12.5, color: '#3A3F4A', lineHeight: 1.45 }}>
              <Box component="span" sx={{ fontWeight: 800, color: '#0B0F1A' }}>Important</Box> — keep paying your current loan as
              scheduled. The restructure isn't effective until you sign the new agreement.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/home?v=1')}
          startIcon={<Icon name="home" size={20} />}
          sx={{ height: 52, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  )
}
