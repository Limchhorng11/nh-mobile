import { ReactNode, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon } from './Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Collapsing header — iOS-style large title that shrinks toward the back button
// as the screen scrolls. Wire it up with the useCollapse() hook:
//
//   const { collapse, onScroll } = useCollapse()
//   <Box className="scroll-content" onScroll={onScroll}>
//     <CollapsingHeader title="Find a branch" onBack={() => navigate(-1)} collapse={collapse} right={…} />
//     <CollapsingTitle collapse={collapse}>Find a branch</CollapsingTitle>
//     …content
//   </Box>
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'

// Tracks scroll progress 0 → 1 over the first `threshold` px of scroll.
export function useCollapse(threshold = 48) {
  const [collapse, setCollapse] = useState(0)
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const y = (e.target as HTMLDivElement).scrollTop
    setCollapse(Math.min(1, Math.max(0, y / threshold)))
  }
  return { collapse, onScroll }
}

// Sticky top bar: back arrow + a compact title that fades in as you scroll.
export function CollapsingHeader({
  title,
  collapse,
  onBack,
  right,
}: {
  title: string
  collapse: number
  onBack?: () => void
  right?: ReactNode
}) {
  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {onBack && (
        <IconButton onClick={onBack} aria-label="Back" sx={{ ml: -1, color: HEADING }}>
          <Icon name="chevronLeft" size={26} color={HEADING} />
        </IconButton>
      )}
      <Typography
        noWrap
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: 19,
          fontWeight: 800,
          color: HEADING,
          letterSpacing: '-0.4px',
          opacity: collapse,
          transform: `translateX(${(1 - collapse) * -6}px)`,
          transition: 'opacity 0.1s linear',
          pointerEvents: 'none',
        }}
      >
        {title}
      </Typography>
      {right}
    </Box>
  )
}

// Large in-flow title that fades + shrinks away as the header collapses.
export function CollapsingTitle({
  children,
  collapse,
  fontSize = 28,
  color = '#000',
}: {
  children: ReactNode
  collapse: number
  fontSize?: number
  color?: string
}) {
  return (
    <Typography
      sx={{
        fontSize,
        fontWeight: 800,
        color,
        letterSpacing: '-0.6px',
        px: 3,
        mt: 0.5,
        mb: 2,
        opacity: 1 - collapse,
        transformOrigin: 'left top',
        transform: `scale(${1 - collapse * 0.12})`,
      }}
    >
      {children}
    </Typography>
  )
}
