import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Signed — terminal confirmation after Sign Contract's "Sign & Accept".
// ─────────────────────────────────────────────────────────────────────────────
const BLUE = '#275CB2'
const MUTED = '#8A94A6'
const LABEL = '#737373'
const HEADING = '#0B0F1A'

const RECORD: { label: string; value: string }[] = [
  { label: 'Identity', value: 'Face ID + PIN · biometric match' },
  { label: 'Intent', value: 'Affirmative Acceptance of final terms' },
  { label: 'Timestamp', value: '09 Jul 2026 · 14:04' },
  { label: 'Non-repudiation', value: 'Tamper-evident audit log' },
]

export default function MwlSignedScreen() {
  const navigate = useNavigate()

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1, py: 1.25 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING }}>Signed</Typography>
      </Box>

      <Box className="scroll-content" sx={{ flex: 1, px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Success banner */}
        <Box
          sx={{
            borderRadius: '18px',
            p: '28px 20px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #34C77B 0%, #16804A 100%)',
            boxShadow: '0 8px 24px rgba(22,128,74,0.28)',
          }}
        >
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
            <Icon name="check" size={28} color="#fff" />
          </Box>
          <Typography sx={{ fontSize: 19, fontWeight: 800, color: '#fff' }}>Contract signed</Typography>
          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', mt: 0.5, lineHeight: 1.5 }}>
            Your Agreement is now binding and stored. Disbursement is unlocked.
          </Typography>
        </Box>

        {/* Signing record */}
        <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: '18px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: LABEL }}>SIGNING RECORD</Typography>
            <Box sx={{ bgcolor: '#D8E9FF', borderRadius: '999px', px: '10px', py: '3px' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: BLUE }}>Door A · App</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {RECORD.map((r) => (
              <Box key={r.label} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
                <Typography sx={{ fontSize: 13, color: MUTED, flexShrink: 0 }}>{r.label}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING, textAlign: 'right' }}>{r.value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Info note */}
        <Box sx={{ display: 'flex', gap: 1.25, bgcolor: '#EAF1FC', borderRadius: '14px', p: '14px 16px' }}>
          <Box sx={{ mt: '1px' }}><Icon name="signature" size={18} color={BLUE} /></Box>
          <Typography sx={{ fontSize: 12.5, color: '#2B4A7E', lineHeight: 1.5, flex: 1 }}>
            Your signed contract is now in <Box component="span" sx={{ fontWeight: 800 }}>My Loans → Documents</Box>. Whether signed in-app or at a branch, it writes to one shared record.
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/my-loan')}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
        >
          View My Loans
        </Button>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/my-loan')}
          sx={{ height: 52, borderRadius: '14px', fontSize: 15, fontWeight: 700, color: BLUE, borderColor: '#B9CDEA', bgcolor: '#fff', '&:hover': { borderColor: '#9CC3FF', bgcolor: '#F7FAFF' } }}
        >
          Done
        </Button>
      </Box>
    </Box>
  )
}
