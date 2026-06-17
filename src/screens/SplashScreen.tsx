import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useHomePath } from '../workspace/useHomePath'

// ─── Splash screen — brand blue, centered logo, loading spinner ──────────────
export default function SplashScreen() {
  const navigate = useNavigate()
  const home = useHomePath()

  // Auto-advance after a 1.5s brand hold to the flow's default tab
  // (Visitor → Products, others → My Loan).
  useEffect(() => {
    const t = setTimeout(() => navigate(home), 1500)
    return () => clearTimeout(t)
  }, [navigate, home])

  return (
    <Box
      className="screen-enter"
      sx={{
        // Full-bleed brand background — extend up into the 47px status-bar reserve.
        height: 'calc(100% + 47px)',
        mt: '-47px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(165deg, #1C4DB8 0%, #0A3A9E 100%)',
        px: 3,
      }}
    >
      <Box
        component="img"
        src="/assets/brand/logo_white.png"
        alt="NongHyup Finance (Cambodia) Plc"
        sx={{ width: 240, height: 'auto', display: 'block' }}
      />

      <CircularProgress size={28} thickness={4} sx={{ color: '#fff', mt: 4 }} />
    </Box>
  )
}
