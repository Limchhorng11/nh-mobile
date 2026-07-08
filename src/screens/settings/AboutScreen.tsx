import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'
import { Icon } from '../../components/Icon'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const GREEN = '#2EAE6C'

const STATS = [
  { value: '12', label: 'provinces\n& capital' },
  { value: '25', label: 'offices\nnationwide' },
  { value: '2018', label: 'NBC\nlicensed' },
]

const NETWORK = [
  { value: '6',  label: 'Branch' },
  { value: '3',  label: 'Office' },
  { value: '2',  label: 'Corporate\nOffice' },
  { value: '11', label: 'Total', highlight: true },
]

const CORE_VALUES = [
  { title: 'Creativity',       sub: 'Makes us a pioneer' },
  { title: 'Responsibility',   sub: 'Makes us respected' },
  { title: 'Honesty',          sub: 'Makes us proud' },
  { title: 'Dependability',    sub: 'We do what we say' },
  { title: 'Humility',         sub: 'Makes us stronger' },
  { title: 'Service to people',sub: 'Makes us great' },
]

const CONTACT_INFO_ROWS = [
  { label: 'Complaint hotline',      value: '023 999 010',               icon: 'phone'      as const, highlight: false },
  { label: 'Website',                value: 'nhfinance.com.kh',          icon: 'website'    as const, highlight: false },
  { label: 'Email',                  value: 'info@nhfinance.com.kh',     icon: 'email'      as const, highlight: true  },
  { label: 'No. 12, Norodom Blvd, Phnom Penh', value: 'Head office',    icon: 'findBranch' as const, highlight: false },
  { label: 'Operating hours',                  value: 'Mon – Fri (8:00AM – 17:00PM)', icon: 'clock' as const, highlight: false },
]

type SocialItem = { name: string; bg: string; svg: React.ReactNode }

const SOCIALS: SocialItem[] = [
  {
    name: 'Website', bg: '#EBF3FF',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#275CB2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <ellipse cx="12" cy="12" rx="4" ry="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M4.93 7h14.14M4.93 17h14.14"/>
      </svg>
    ),
  },
  {
    name: 'Facebook', bg: '#E7F0FD',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="#1877F2">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram', bg: '#FDE8F3',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-about)" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig-about)" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="#C13584"/>
        <defs>
          <linearGradient id="ig-about" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F9CE34"/><stop offset="0.4" stopColor="#EE2A7B"/><stop offset="1" stopColor="#6228D7"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: 'TikTok', bg: '#F0F0F0',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="#000">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube', bg: '#FFECEC',
    svg: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="#FF0000">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.52V8.48L15.83 12l-6.08 3.52z"/>
      </svg>
    ),
  },
]

const MILESTONES = [
  { year: '2018', done: true,  text: 'NongHyup Bank acquires 100% of SMIC Plc; the company becomes NongHyup Finance (Cambodia) Plc and receives its NBC microfinance licence.' },
  { year: '2023', done: true,  text: 'New Head Office and launch of the Loan Origination System (LOS).' },
  { year: '2025', done: true,  text: 'Launch of the Migrant Worker Loan — funding legitimate overseas workers with up to US$15,000 and no collateral.' },
  { year: '2026', done: false, text: 'Opening Kampong Chhnang branch, a new mobile app, LOS modernization and CamDigiKey adoption.' },
]

export default function AboutScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="About Us" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>About Us</CollapsingTitle>

        <Box sx={{ pb: 5 }}>

          {/* ── Hero building photo ─────────────────────────────── */}
          <Box sx={{ position: 'relative', height: 220, bgcolor: '#1A3A30', overflow: 'hidden', mx: 3, borderRadius: '16px', mt: 1 }}>
            <Box component="img" src="/assets/images/NH_HQ.webp" alt="NH Finance Head Office" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {/* overlay gradient */}
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: '16px' }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(46,174,108,0.9)', borderRadius: '6px', px: 1, py: '3px', mb: 0.75 }}>
                <Typography sx={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.5px', color: '#fff' }}>HEAD OFFICE · PHNOM PENH</Typography>
              </Box>
              <Typography sx={{ fontSize: 13.5, color: '#fff', lineHeight: 1.45, fontWeight: 500 }}>
                A licensed microfinance institution, subsidiary of Korea's NongHyup Bank.
              </Typography>
            </Box>
          </Box>

          {/* ── Global Network ──────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2, mb: 1 }}>
            GLOBAL NETWORK
          </Typography>
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', mx: 3, overflow: 'hidden' }}>
            <Box component="img" src="/assets/images/NH_map.webp" alt="Global network map" sx={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            <Box sx={{ p: '14px' }}>
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.5px', color: MUTED, mb: 1.25 }}>OVERSEAS NETWORK</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1 }}>
                {NETWORK.map((n) => (
                  <Box key={n.label} sx={{ textAlign: 'center', p: '10px 6px', borderRadius: '10px', bgcolor: n.highlight ? BLUE : '#F5F7FA' }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 900, color: n.highlight ? '#fff' : BLUE, lineHeight: 1 }}>{n.value}</Typography>
                    <Typography sx={{ fontSize: 10, color: n.highlight ? 'rgba(255,255,255,0.8)' : MUTED, mt: 0.5, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{n.label}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: BLUE, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 12, color: MUTED }}>NongHyup Finance (Cambodia)</Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Key stats row ───────────────────────────────────── */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, px: 3, mt: 1.5 }}>
            {STATS.map((s) => (
              <Box key={s.label} sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '12px', textAlign: 'center' }}>
                <Typography sx={{ fontSize: 22, fontWeight: 900, color: BLUE, lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: 11, color: MUTED, mt: 0.5, lineHeight: 1.35, whiteSpace: 'pre-line' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── Who we are ──────────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2.5, mb: 1 }}>
            WHO WE ARE
          </Typography>
          <Box sx={{ px: 3 }}>
            <Typography sx={{ fontSize: 14, color: '#3A4255', lineHeight: 1.65 }}>
              NongHyup Finance serves low- to medium-income Cambodians with micro-loans for small businesses and agriculture, and SME loans for sustainable growth.
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#3A4255', lineHeight: 1.65, mt: 1.5 }}>
              In August 2018, the National Bank of Cambodia approved its acquisition of Samic Plc.
            </Typography>

            {/* Vision */}
            <Box sx={{ mt: 2, bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden', p: '14px' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.5px', color: BLUE, mb: 0.75 }}>OUR VISION</Typography>
              <Typography sx={{ fontSize: 14, color: '#3A4255', lineHeight: 1.55 }}>
                To be the best financial institution loved by its stakeholders.
              </Typography>
            </Box>

            {/* Mission */}
            <Box sx={{ mt: 1.5, bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden', p: '14px' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.5px', color: BLUE, mb: 0.75 }}>OUR MISSION</Typography>
              <Typography sx={{ fontSize: 14, color: '#3A4255', lineHeight: 1.55 }}>
                To exceed our customers' expectations by providing a wide range of financial products and services at competitive prices, through the development of our people.
              </Typography>
            </Box>
          </Box>

          {/* ── Core values ─────────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2.5, mb: 1 }}>
            OUR CORE VALUES
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, px: 3 }}>
            {CORE_VALUES.map((v) => (
              <Box key={v.title} sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '12px 14px' }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: HEADING }}>{v.title}</Typography>
                <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>{v.sub}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── Milestones ──────────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2.5, mb: 1 }}>
            MILESTONES
          </Typography>
          <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {MILESTONES.map((m, i) => (
              <Box key={m.year} sx={{ display: 'flex', gap: 2 }}>
                {/* timeline line + dot */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: m.done ? BLUE : '#D0D5DD', border: `2px solid ${m.done ? BLUE : '#D0D5DD'}`, flexShrink: 0, mt: '3px' }} />
                  {i < MILESTONES.length - 1 && (
                    <Box sx={{ width: 2, flex: 1, bgcolor: '#E8EAEE', minHeight: 24, my: 0.5 }} />
                  )}
                </Box>
                <Box sx={{ pb: 2.5 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: m.done ? BLUE : MUTED }}>{m.year}</Typography>
                  <Typography sx={{ fontSize: 13.5, color: '#3A4255', lineHeight: 1.55, mt: 0.25 }}>{m.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* ── Part of NongHyup Bank ───────────────────────────── */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', mx: 3, mt: 1, overflow: 'hidden' }}>
            <Box sx={{ p: '14px 16px' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: HEADING, mb: 1 }}>Part of NongHyup Bank</Typography>
              <Typography sx={{ fontSize: 13.5, color: '#3A4255', lineHeight: 1.65 }}>
                Established in 1961 with 100% domestic capital, NongHyup Bank is recognised as one of the world's most advanced cooperative financial institutions. Its global network spans foreign branches in the United States and Vietnam, microfinance institutions in Myanmar and Cambodia, and representative offices in China and India.
              </Typography>
            </Box>
            {/* Seoul HQ photo */}
            <Box sx={{ position: 'relative', height: 180, overflow: 'hidden', flexShrink: 0 }}>
              <Box component="img" src="/assets/images/NH_HQKOREA.webp" alt="NongHyup Bank Head Office Seoul" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
              <Typography sx={{ position: 'absolute', bottom: 12, left: 14, right: 14, fontSize: 12.5, fontWeight: 700, color: '#fff' }}>
                NongHyup Bank Head Office — Seoul, Republic of Korea
              </Typography>
            </Box>
          </Box>

          {/* ── Contact us ──────────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2.5, mb: 1 }}>
            CONTACT US
          </Typography>
          <Box sx={{ px: 3 }}>
            {/* Hotline hero card — tap to call */}
            <Box
              role="button"
              onClick={() => { window.location.href = 'tel:1800207816' }}
              sx={{ background: 'linear-gradient(135deg, #2B5CC8 0%, #1A3D8F 100%)', borderRadius: '16px', p: '20px', cursor: 'pointer', '&:active': { opacity: 0.88 } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '0.4px' }}>TOLL-FREE · 24 / 7</Typography>
                  <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '0.5px', lineHeight: 1.15 }}>1800 207 816</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: GREEN, borderRadius: '10px', px: '14px', py: '8px', flexShrink: 0, ml: 1 }}>
                  <Icon name="phone" size={14} color="#fff" />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Call now</Typography>
                </Box>
              </Box>
              <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.12)', mb: 2 }} />
              <Typography sx={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)' }}>Free from any Cambodian network</Typography>
            </Box>

            {/* Info rows */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden', mt: 1.5 }}>
              {CONTACT_INFO_ROWS.map((row, i) => (
                <Box
                  key={row.label}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, px: '14px', py: '12px', borderBottom: i < CONTACT_INFO_ROWS.length - 1 ? '1px solid #F1F4F8' : 'none' }}
                >
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#F1F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={row.icon} size={20} color="#1A1A1A" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: row.highlight ? BLUE : HEADING }} noWrap>{row.value}</Typography>
                    <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>{row.label}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Social links */}
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: 2.5, mt: 1.5 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: HEADING, mb: 2 }}>
                Connect and Learn More About Us
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {SOCIALS.map((s) => (
                  <Box key={s.name} role="button" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, cursor: 'pointer', '&:active': { opacity: 0.7 } }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.svg}
                    </Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: MUTED }}>{s.name}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Typography sx={{ fontSize: 11.5, color: '#B6BDC8', textAlign: 'center', mt: 2.5, px: 3 }}>
            Source: NongHyup Finance (Cambodia) Plc — Annual Report 2025
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
