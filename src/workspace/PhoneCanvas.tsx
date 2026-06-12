import { ReactNode } from 'react'
import Box from '@mui/material/Box'

interface PhoneCanvasProps {
  children: ReactNode
}

// iPhone 13 logical size — a clean, light prototype frame (no dark bezel).
const PHONE_W = 388
const PHONE_H = 844

export default function PhoneCanvas({ children }: PhoneCanvasProps) {
  return (
    <Box
      sx={{
        // ── Real device: fill the screen ────────────────────────────────────
        position: { xs: 'fixed', md: 'relative' },
        inset: { xs: 0, md: 'auto' },

        width: { xs: '100%', md: PHONE_W },
        height: { xs: '100dvh', md: `min(${PHONE_H}px, calc(100dvh - 120px))` },

        bgcolor: 'background.default',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,

        // Status-bar space reserved at the top of every screen (iPhone 13 notch = 47px).
        pt: '47px',

        // ── Workspace: light, rounded prototype frame ───────────────────────
        borderRadius: { xs: 0, md: '40px' },
        boxShadow: {
          xs: 'none',
          md: '0 24px 60px rgba(16,24,40,0.18), 0 0 0 1px rgba(16,24,40,0.04)',
        },
      }}
    >
      {children}

      {/* Home indicator — the iPhone 13 gesture bar pill. */}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: '8px',
          transform: 'translateX(-50%)',
          width: '134px',
          height: '5px',
          borderRadius: '3px',
          bgcolor: '#0B0F1A',
          zIndex: 50,
        }}
      />
    </Box>
  )
}
