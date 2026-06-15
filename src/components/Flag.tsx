import Box from '@mui/material/Box'

// ISO-ish country codes for the flag SVGs.
export type FlagCode = 'gb' | 'kh' | 'kr' | 'jp' | 'sg' | 'th' | 'vn' | 'cn' | 'my' | 'id' | 'ph' | 'mm' | 'la' | 'us' | 'au'

// Local high-quality assets; others fall back to flagcdn.com PNGs.
const FLAG_LOCAL: Partial<Record<FlagCode, string>> = {
  gb: '/assets/brand/Flags/United Kingdom.svg',
  kh: '/assets/brand/Flags/Cambodia.svg',
  kr: '/assets/brand/Flags/South Korea.svg',
  jp: '/assets/flags/jp.svg',
  sg: '/assets/flags/sg.svg',
}

const FLAG_SRC = (code: FlagCode): string =>
  FLAG_LOCAL[code] ?? `https://flagcdn.com/w80/${code}.png`

// Designed flags are already circular 24×24 SVG badges with a built-in border ring.
// Legacy flags (jp, sg) are rectangular and need a circular wrapper to match.
const DESIGNED: FlagCode[] = ['gb', 'kh', 'kr']

// Flag chip. The designed SVGs are square (24×24) circular badges, so render
// in a square box with `contain` — never crop them. `size` is the box width.
export function Flag({ code, size = 22 }: { code: FlagCode; size?: number }) {
  if (!DESIGNED.includes(code)) {
    return (
      <Box sx={{
        width: Math.round(size * (4 / 3)),
        height: size,
        borderRadius: '2px',
        overflow: 'hidden',
        border: '1.5px solid #D9D9D9',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Box
          component="img"
          src={encodeURI(FLAG_SRC(code))}
          alt=""
          aria-hidden
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </Box>
    )
  }

  return (
    <Box
      component="img"
      src={encodeURI(FLAG_SRC(code))}
      alt=""
      aria-hidden
      sx={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
      }}
    />
  )
}
