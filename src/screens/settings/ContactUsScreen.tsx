import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const GREEN = '#2EAE6C'

const INFO_ROWS = [
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
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig)" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig)" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="#C13584"/>
        <defs>
          <linearGradient id="ig" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
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

export default function ContactUsScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Contact Us" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>Contact Us</CollapsingTitle>

        <Box sx={{ px: 3, pb: 5 }}>
          {/* Hotline hero card — tap to call */}
          <Box
            role="button"
            onClick={() => { window.location.href = 'tel:1800207816' }}
            sx={{ background: 'linear-gradient(135deg, #2B5CC8 0%, #1A3D8F 100%)', borderRadius: '16px', p: '20px', mt: 1, cursor: 'pointer', '&:active': { opacity: 0.88 } }}
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
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1, mt: 1 }}>
            CONTACT INFO
          </Typography>
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden' }}>
            {INFO_ROWS.map((row, i) => (
              <Box
                key={row.label}
                sx={{ display: 'flex', alignItems: 'center', gap: 2, px: '14px', py: '12px', borderBottom: i < INFO_ROWS.length - 1 ? '1px solid #F1F4F8' : 'none' }}
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
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1, mt: 1 }}>
            CONNECT WITH US
          </Typography>
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: 2.5 }}>
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

          <Typography sx={{ fontSize: 12, color: '#B0B8C8', textAlign: 'center', lineHeight: 1.55, mt: 2 }}>
            For loan-specific questions, your assigned Credit Officer can help faster — see My Credit Officer.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
