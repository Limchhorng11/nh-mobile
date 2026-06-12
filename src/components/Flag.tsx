import Box from '@mui/material/Box'

// ISO-ish country codes for the flag SVGs in /public/assets/flags.
export type FlagCode = 'gb' | 'kh' | 'kr' | 'jp' | 'sg'

// Rounded flag chip. Real SVG flags (no emoji) so they render identically
// across platforms. `size` is the width in px; height keeps a 4:3 ratio.
export function Flag({ code, size = 22 }: { code: FlagCode; size?: number }) {
  return (
    <Box
      component="img"
      src={`/assets/flags/${code}.svg`}
      alt=""
      aria-hidden
      sx={{
        width: size,
        height: Math.round(size * 0.75),
        borderRadius: '3px',
        objectFit: 'cover',
        display: 'block',
        flexShrink: 0,
        boxShadow: 'inset 0 0 0 1px rgba(16,24,40,0.10)',
      }}
    />
  )
}
