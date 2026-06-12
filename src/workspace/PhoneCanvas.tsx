import { ReactNode } from 'react'
import Box from '@mui/material/Box'

interface PhoneCanvasProps {
  children: ReactNode
}

// Phone column width for the desktop prototype frame.
const PHONE_W = 388

export default function PhoneCanvas({ children }: PhoneCanvasProps) {
  return (
    <Box
      sx={{
        // ── Fill the full viewport height on every breakpoint ───────────────
        position: { xs: 'fixed', md: 'relative' },
        inset: { xs: 0, md: 'auto' },

        width: { xs: '100%', md: PHONE_W },
        height: '100dvh',

        bgcolor: 'background.default',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,

        // ── Workspace: light, rounded prototype frame (desktop only) ────────
        borderRadius: { xs: 0, md: '40px' },
        boxShadow: {
          xs: 'none',
          md: '0 24px 60px rgba(16,24,40,0.18), 0 0 0 1px rgba(16,24,40,0.04)',
        },
      }}
    >
      {children}
    </Box>
  )
}
