import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Face Scan — full-screen camera-style verification step for Sign Contract.
// Auto-completes after a short simulated scan, then returns to Sign Contract
// with the result flagged via sessionStorage (read once and cleared there).
// ─────────────────────────────────────────────────────────────────────────────
const GREEN = '#1FA85C'
const BLUE = '#275CB2'

export default function MwlFaceScanScreen() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'scanning' | 'done'>('scanning')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('done'), 1800)
    const t2 = setTimeout(() => {
      sessionStorage.setItem('mwlFaceVerified', '1')
      navigate(-1)
    }, 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [navigate])

  return (
    <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0B0F1A' }}>
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', px: 1, py: 1.25 }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Cancel" sx={{ color: '#fff' }}>
          <Icon name="arrowLeft" size={22} color="#fff" />
        </IconButton>
        <Typography sx={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>Face Scan</Typography>
        <Box sx={{ width: 44 }} />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, px: 4 }}>
        <Box
          sx={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `3px solid ${phase === 'done' ? GREEN : BLUE}`,
            transition: 'border-color 0.3s',
            animation: phase === 'scanning' ? 'faceScanRing 1.2s ease-in-out infinite' : 'none',
            '@keyframes faceScanRing': {
              '0%, 100%': { boxShadow: `0 0 0 0 rgba(39,92,178,0.35)` },
              '50%': { boxShadow: `0 0 0 14px rgba(39,92,178,0)` },
            },
          }}
        >
          <Icon name={phase === 'done' ? 'check' : 'faceId'} size={72} color={phase === 'done' ? GREEN : '#fff'} />
        </Box>

        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#fff', textAlign: 'center' }}>
          {phase === 'done' ? 'Face verified' : 'Hold still — scanning your face…'}
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#9AA3B2', textAlign: 'center', lineHeight: 1.5 }}>
          {phase === 'done' ? 'Returning to Sign Contract…' : 'Position your face inside the circle in good lighting.'}
        </Typography>
      </Box>
    </Box>
  )
}
