import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// PIN gate screen — shown by <RequirePin> the first time a protected area
// (Profile, Chat, Notifications, Apply loan) is opened in a session.
// Any 4-digit PIN is accepted (prototype); a complete entry calls onSuccess.
// ─────────────────────────────────────────────────────────────────────────────
const BLUE = '#275CB2'
const MUTED = '#8A94A6'
const INK = '#0B1437'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'back']

export default function PinGateScreen({ onSuccess }: { onSuccess: () => void }) {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')

  // A complete 4-digit PIN unlocks the protected area.
  useEffect(() => {
    if (pin.length === 4) {
      const t = setTimeout(onSuccess, 200)
      return () => clearTimeout(t)
    }
  }, [pin, onSuccess])

  const press = (k: string) => {
    if (k === 'C') return setPin('')
    if (k === 'back') return setPin((p) => p.slice(0, -1))
    setPin((p) => (p.length >= 4 ? p : p + k))
  }

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      {/* Close — back out of the protected area */}
      <Box sx={{ px: 3, pt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Close" sx={{ mr: -1, color: '#0B0F1A' }}>
          <Icon name="close" size={26} color="#0B0F1A" />
        </IconButton>
      </Box>

      {/* Shield badge + title */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3, mt: 1 }}>
        <Icon name="accountSecurity" size={40} color={INK} />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: INK, letterSpacing: 2, mt: 0.5, mb: 1.5 }}>***</Typography>
        <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', textAlign: 'center' }}>
          Enter PIN to continue
        </Typography>
        <Typography sx={{ fontSize: 14, color: MUTED, mt: 1, textAlign: 'center', maxWidth: 250 }}>
          Confirm your PIN to access your personal information
        </Typography>

        {/* Dots */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: i < pin.length ? BLUE : 'transparent', border: `2px solid ${i < pin.length ? BLUE : '#CBD3DF'}` }} />
          ))}
        </Box>
      </Box>

      {/* Keypad */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 1, px: 3 }}>
          {KEYS.map((k) => (
            <Box
              key={k}
              component="button"
              type="button"
              onClick={() => press(k)}
              aria-label={k === 'back' ? 'Delete' : k === 'C' ? 'Clear' : k}
              sx={{
                height: 64,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'transparent',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: 30,
                fontWeight: 500,
                color: k === 'C' ? MUTED : '#0B0F1A',
                cursor: 'pointer',
                borderRadius: '50%',
                '&:active': { bgcolor: 'rgba(11,15,26,0.06)' },
              }}
            >
              {k === 'back' ? <Icon name="backspace" size={26} color="#5B6473" /> : k}
            </Box>
          ))}
        </Box>

        {/* Biometric + forgot PIN */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, pt: 1.5, pb: '36px' }}>
          <IconButton aria-label="Use Face ID" onClick={onSuccess} sx={{ color: MUTED }}>
            <Icon name="faceId" size={30} color={MUTED} />
          </IconButton>
          <Typography role="button" sx={{ fontSize: 15, fontWeight: 600, color: MUTED, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
            Forgot PIN?
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
