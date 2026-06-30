import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED   = '#8A94A6'
const BLUE    = '#275CB2'

type BranchEntry = { code: string; name: string; address: string; lat: number; lng: number }
type ProvinceGroup = { province: string; branches: BranchEntry[] }

const PROVINCE_GROUPS: ProvinceGroup[] = [
  {
    province: 'Phnom Penh',
    branches: [
      { code: 'HO',  name: 'Head Office',           address: 'Building No. 383 (E1-E2-E3), Preah Monivong Blvd, cnr St. 352, Boeng Keng Kang 1, Khan Boeng Keng Kang', lat: 11.5547, lng: 104.9269 },
      { code: 'BKK', name: 'Boeng Keng Kang Branch', address: 'Building No. 383 (E0), Preah Monivong Blvd, cnr St. 352, Khan Boeng Keng Kang',                         lat: 11.5545, lng: 104.9267 },
      { code: 'CBA', name: 'Chbar Ampov Branch',     address: 'National Road 1, No. 758, Deum Slaeng, Khan Chbar Ampov',                                                lat: 11.5289, lng: 104.9511 },
    ],
  },
  {
    province: 'Kandal',
    branches: [
      { code: 'KD', name: 'Kandal Provincial Branch', address: 'National Road 4, Svay Chrum, Baek Chan, Angk Snuol', lat: 11.5887, lng: 104.7833 },
      { code: 'SA', name: "S'ang District Branch",    address: "National Road 21, Preaek Run, Preaek Koy, S'ang",   lat: 11.4623, lng: 104.9712 },
    ],
  },
  {
    province: 'Kampong Speu',
    branches: [
      { code: 'KS', name: 'Kampong Speu Provincial Branch', address: 'National Road 4, Peanichakam, Rokar Thum, Krong Chbar Mon', lat: 11.4533, lng: 104.5197 },
      { code: 'OD', name: 'Odongk District Branch',         address: 'Skaraong, Veang Chas, Odongk',                             lat: 11.8067, lng: 104.749  },
    ],
  },
  {
    province: 'Takeo',
    branches: [
      { code: 'TK', name: 'Takeo Provincial Branch', address: 'Angk Ta Saom, Tram Kak',                               lat: 10.9777, lng: 104.7997 },
      { code: 'BT', name: 'Bati District Branch',    address: 'National Road 2, Smau Khnhei, Trapeang Sab, Bati',     lat: 11.1556, lng: 104.9417 },
    ],
  },
  {
    province: 'Kampot',
    branches: [
      { code: 'KP',  name: 'Kampot Provincial Branch',        address: 'Kampong Bay Khang Tboung, Krong Kampot',          lat: 10.5997, lng: 104.1809 },
      { code: 'KT',  name: 'Kampong Trach District Branch',   address: 'Kampong Trach Khang Kaeut, Kampong Trach',        lat: 10.6178, lng: 104.4511 },
      { code: 'BM',  name: 'Banteay Meas District Branch',    address: 'Tuk Meas, Banteay Meas',                          lat: 10.7233, lng: 104.2944 },
      { code: 'CK',  name: 'Chhuk District Branch',           address: 'National Road 3, Chheu Teal, Chhuk',              lat: 10.8422, lng: 104.0958 },
    ],
  },
  {
    province: 'Kep',
    branches: [
      { code: 'KEP', name: 'Kep Provincial Branch', address: "National Road 33, Damnak Chang'aeur, Prey Thum, Krong Kep", lat: 10.4828, lng: 104.3161 },
    ],
  },
  {
    province: 'Preah Sihanouk',
    branches: [
      { code: 'PSN', name: 'Preah Sihanouk Provincial Branch', address: 'Phum 3, Sangkat 3, Krong Preah Sihanouk', lat: 10.6236, lng: 103.5222 },
      { code: 'STH', name: 'Stueng Hav District Branch',       address: 'Phum 3, Tomnob Rolok, Stueng Hav',       lat: 10.7056, lng: 103.6311 },
      { code: 'PN',  name: 'Prey Nob District Branch',         address: 'National Road 4, Veal Meas, Veal Renh, Prey Nob', lat: 10.7533, lng: 103.6644 },
    ],
  },
  {
    province: 'Siem Reap',
    branches: [
      { code: 'SR', name: 'Siem Reap Provincial Branch', address: 'Banteay Chas, Sla Kram, Krong Siem Reap', lat: 13.3633, lng: 103.8564 },
      { code: 'PK', name: 'Puok District Branch',        address: 'Kouk Chuon, Puok',                       lat: 13.3211, lng: 103.6467 },
    ],
  },
  {
    province: 'Kampong Thom',
    branches: [
      { code: 'KTH', name: 'Kampong Thom Provincial Branch', address: 'Kdei, Prey Ta Hu, Krong Stueng Saen', lat: 12.7111, lng: 104.8900 },
      { code: 'BR',  name: 'Baray District Branch',          address: 'Prey Ta Trav, Ballangk, Baray',        lat: 12.9133, lng: 105.0856 },
    ],
  },
  {
    province: 'Kampong Cham',
    branches: [
      { code: 'KPC', name: 'Kampong Cham Provincial Branch', address: 'National Road 7, Prey Totueng, Chrey Vien, Prey Chhor', lat: 11.9924, lng: 105.4636 },
    ],
  },
  {
    province: 'Prey Veng',
    branches: [
      { code: 'PV', name: 'Prey Veng Provincial Branch', address: 'No. 345, Prasat, Kampong Trabaek', lat: 11.4833, lng: 105.3253 },
    ],
  },
  {
    province: 'Svay Rieng',
    branches: [
      { code: 'SVR', name: 'Svay Rieng Provincial Branch', address: 'Chong Preaek, Krong Svay Rieng', lat: 11.0878, lng: 105.8003 },
      { code: 'BV',  name: 'Krong Bavet Branch',           address: 'Tuol Mpil, Chrak Mtes, Krong Bavet', lat: 11.0672, lng: 106.0108 },
    ],
  },
]

// Head office coords for the map preview
const HEAD_OFFICE = PROVINCE_GROUPS[0].branches[0]

function mapsUrl(b: BranchEntry) {
  return `https://www.google.com/maps/search/?api=1&query=${b.lat}%2C${b.lng}`
}

function osmSrc(lat: number, lng: number) {
  const dLat = 0.04, dLng = 0.05
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-dLng},${lat-dLat},${lng+dLng},${lat+dLat}&layer=mapnik&marker=${lat},${lng}`
}

// ── Initials badge ────────────────────────────────────────────────────────────
function InitialsBadge({ code }: { code: string }) {
  return (
    <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#1E3A7A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Typography sx={{ fontSize: code.length > 2 ? 10.5 : 12.5, fontWeight: 800, color: '#fff', letterSpacing: '0.3px' }}>
        {code}
      </Typography>
    </Box>
  )
}

// ── Province section ──────────────────────────────────────────────────────────
function ProvinceSection({ group }: { group: ProvinceGroup }) {
  return (
    <Box>
      {/* Province header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 800, color: HEADING }}>{group.province}</Typography>
        <Typography sx={{ fontSize: 12, color: MUTED }}>{group.branches.length} {group.branches.length === 1 ? 'office' : 'offices'}</Typography>
      </Box>

      {/* Branch cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {group.branches.map((b) => (
          <Box key={b.code} sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', p: '14px 16px' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <InitialsBadge code={b.code} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING, lineHeight: 1.35 }}>{b.name}</Typography>
                <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.375, lineHeight: 1.5 }}>{b.address}</Typography>
                <Box
                  component="a"
                  href={mapsUrl(b)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, textDecoration: 'none' }}
                >
                  <Icon name="findBranch" size={13} color={BLUE} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: BLUE }}>Directions</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function BranchLocatorScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Find a branch" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>Find a branch</CollapsingTitle>

        <Box sx={{ pb: 5 }}>
          {/* ── Map with overlay chips ─────────────────────────────────────── */}
          <Box sx={{ position: 'relative', mx: 3, height: 190, borderRadius: '16px', overflow: 'hidden', bgcolor: '#E8EEF4' }}>
            <Box
              component="iframe"
              title="NongHyup Finance branches"
              loading="lazy"
              src={osmSrc(11.5547, 104.9269)}
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
            {/* Overlay: branch chip + open in maps button */}
            <Box sx={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: 'rgba(255,255,255,0.95)', borderRadius: '999px', px: '10px', py: '5px', boxShadow: '0 1px 6px rgba(0,0,0,0.15)' }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: BLUE, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: HEADING }}>Head Office</Typography>
                <Typography sx={{ fontSize: 12, color: MUTED }}>· 1.2 km</Typography>
              </Box>
              <Box
                component="a"
                href={mapsUrl(HEAD_OFFICE)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: BLUE, borderRadius: '999px', px: '12px', py: '6px', textDecoration: 'none', boxShadow: '0 1px 6px rgba(0,0,0,0.2)' }}
              >
                <Icon name="findBranch" size={13} color="#fff" />
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>Open in Maps</Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Info banner ────────────────────────────────────────────────── */}
          <Box sx={{ mx: 3, mt: 2, bgcolor: '#EAF1FB', borderRadius: '12px', px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: 13, color: '#3A4256', lineHeight: 1.6 }}>
              <Box component="span" sx={{ fontWeight: 700 }}>25 offices</Box> across Phnom Penh &amp; 11 provinces. Tap{' '}
              <Box component="span" sx={{ fontWeight: 700, color: BLUE }}>Directions</Box>{' '}
              to open a branch in Maps. Open Mon–Fri 8:00am–5:00pm, Sat 8:00am–12:00pm.
            </Typography>
          </Box>

          {/* ── Branch groups ──────────────────────────────────────────────── */}
          <Box sx={{ px: 3, mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {PROVINCE_GROUPS.map((g) => (
              <ProvinceSection key={g.province} group={g} />
            ))}
          </Box>

          {/* ── Footer note ────────────────────────────────────────────────── */}
          <Typography sx={{ fontSize: 12, color: MUTED, textAlign: 'center', lineHeight: 1.6, px: 4, mt: 3 }}>
            NongHyup Finance operates in Phnom Penh and 11 provinces. Call the hotline{' '}
            <Box component="span" sx={{ fontWeight: 700, color: HEADING }}>1800 207 818</Box>
            {' '}to reach any branch.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
