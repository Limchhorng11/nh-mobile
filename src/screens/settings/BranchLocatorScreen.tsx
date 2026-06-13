import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
// Branch Locator — map preview + nearest branch (opened from Settings).
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

// Google Maps pin logo — multicolour teardrop with a white centre.
function GoogleMapsPin() {
  return (
    <Box component="svg" viewBox="0 0 24 24" aria-hidden="true" sx={{ width: 18, height: 18, flexShrink: 0, display: 'block' }}>
      <defs>
        <clipPath id="gmaps-pin">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 4.17 4.42 9.92 6.23 12.13a1 1 0 0 0 1.54 0C14.58 18.92 19 13.17 19 9c0-3.87-3.13-7-7-7z" />
        </clipPath>
      </defs>
      <g clipPath="url(#gmaps-pin)">
        <polygon points="12,9 0,0 24,0" fill="#EA4335" />
        <polygon points="12,9 24,0 24,24" fill="#4285F4" />
        <polygon points="12,9 24,24 0,24" fill="#34A853" />
        <polygon points="12,9 0,24 0,0" fill="#FBBC04" />
      </g>
      <circle cx="12" cy="9" r="2.7" fill="#fff" />
    </Box>
  )
}

type Branch = { name: string; address: string; distance: string; lat: number; lng: number }
const BRANCHES: Branch[] = [
  { name: 'NongHyup Finance Odongk', address: 'National Road 4, Odongk District, Kampong Speu', distance: '2.4 km', lat: 11.8067, lng: 104.749 },
  { name: 'NongHyup Finance Phnom Penh', address: 'No. 12, Norodom Blvd, Phnom Penh', distance: '8.1 km', lat: 11.5564, lng: 104.9282 },
  { name: 'NongHyup Finance Kampong Cham', address: 'Preah Monivong St, Kampong Cham', distance: '46 km', lat: 11.9924, lng: 105.4636 },
]

// OpenStreetMap embed centred on a branch, with a marker on it.
function mapSrc({ lat, lng }: Branch) {
  const dLat = 0.01
  const dLng = 0.014
  const bbox = `${lng - dLng},${lat - dLat},${lng + dLng},${lat + dLat}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
}

export default function BranchLocatorScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Branch>(BRANCHES[0])

  const filtered = BRANCHES.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Find a branch" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"Find a branch"}</CollapsingTitle>

        <Box sx={{ px: 3, pb: 5 }}>
          {/* Search */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#ECEEF1', borderRadius: '12px', px: '14px', height: 48, mt: 1 }}>
            <Icon name="search" size={20} color={MUTED} />
            <Box
              component="input"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search branches"
              aria-label="Search branches"
              sx={{ flex: 1, border: 'none', outline: 'none', bgcolor: 'transparent', fontSize: 16, color: HEADING, fontFamily: 'inherit', '::placeholder': { color: MUTED } }}
            />
          </Box>

          {/* Map preview — real, draggable OpenStreetMap (no API key needed) */}
          <Box
            sx={{
              position: 'relative',
              mt: 2,
              height: 220,
              borderRadius: '16px',
              overflow: 'hidden',
              bgcolor: '#E8EEF4',
            }}
          >
            <Box
              key={selected.name}
              component="iframe"
              title={selected.name}
              loading="lazy"
              src={mapSrc(selected)}
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </Box>

          {/* Open the selected branch in Google Maps */}
          <Box
            component="a"
            href={`https://www.google.com/maps/search/?api=1&query=${selected.lat}%2C${selected.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${selected.name} in Google Maps`}
            sx={{
              mt: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              height: 46,
              borderRadius: '12px',
              bgcolor: '#EAF1FB',
              color: BLUE,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 0.12s',
              '&:active': { bgcolor: '#DCE8FA' },
            }}
          >
            <GoogleMapsPin />
            <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: BLUE }}>Open in Google Maps</Typography>
            <Icon name="arrowRight" size={16} color={BLUE} />
          </Box>

          {/* Branch list */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1, mt: 1 }}>
            NEARBY BRANCHES
          </Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            {filtered.map((b, i) => {
              const active = b.name === selected.name
              return (
              <Box
                key={b.name}
                role="button"
                aria-pressed={active}
                onClick={() => setSelected(b)}
                sx={{ display: 'flex', alignItems: 'center', gap: 2, px: '14px', py: '12px', cursor: 'pointer', bgcolor: active ? '#EAF1FB' : 'transparent', borderBottom: i < filtered.length - 1 ? '1px solid #F1F4F8' : 'none', transition: 'background 0.12s', '&:active': { bgcolor: '#EAF1FB' } }}
              >
                <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: active ? BLUE : '#EAF1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.12s' }}>
                  <Icon name="findBranch" size={20} color={active ? '#fff' : BLUE} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING }} noWrap>{b.name}</Typography>
                  <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }} noWrap>{b.address}</Typography>
                </Box>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: BLUE, flexShrink: 0 }}>{b.distance}</Typography>
              </Box>
              )
            })}
            {filtered.length === 0 && (
              <Typography sx={{ fontSize: 14, color: MUTED, textAlign: 'center', py: 4 }}>No branches match “{query}”.</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
