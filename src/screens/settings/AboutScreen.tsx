import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon, type IconName } from '../../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
// About NHFC — mission, vision and contact info (opened from Settings).
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

type ContactItem = { icon: IconName; value: string; label: string }
const CONTACTS: ContactItem[] = [
  { icon: 'phone', value: '017 666 036', label: 'Support hotline · 24/7' },
  { icon: 'website', value: 'nhfc.com.kh', label: 'Website' },
  { icon: 'email', value: 'info@nhfc.com.kh', label: 'Email' },
  { icon: 'findBranch', value: 'Head office', label: 'No. 12, Norodom Blvd, Phnom Penh' },
]

const SOCIALS: { name: string; file: string }[] = [
  { name: 'Facebook', file: 'Facebook Icon.svg' },
  { name: 'Telegram', file: 'Telegram Icon.svg' },
  { name: 'LinkedIn', file: 'LinkedIn Icon.svg' },
]

export default function AboutScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="About" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"About"}</CollapsingTitle>

        <Box sx={{ px: 3, pb: 5 }}>
          {/* Brand header */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: 3, textAlign: 'center', mt: 1 }}>
            <Box component="img" src="/assets/brand/header_logo.svg" alt="NongHyup Finance" sx={{ height: 30, width: 'auto', display: 'inline-block', objectFit: 'contain' }} />
            <Typography sx={{ fontSize: 12.5, color: MUTED, mt: 1.25 }}>Microfinance Institution · Est. 2017</Typography>
          </Box>

          {/* Mission / vision */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: 2.5, mt: 2 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.7px', color: BLUE }}>MISSION</Typography>
            <Typography sx={{ fontSize: 14, color: '#3A4256', lineHeight: 1.55, mt: 0.75 }}>
              To expand access to fair and reliable financial services that empower individuals and small businesses across Cambodia to grow with confidence.
            </Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.7px', color: BLUE, mt: 2.5 }}>VISION</Typography>
            <Typography sx={{ fontSize: 14, color: '#3A4256', lineHeight: 1.55, mt: 0.75 }}>
              To be the most trusted financial partner for Cambodian families and entrepreneurs, building prosperity in every community we serve.
            </Typography>
          </Box>

          {/* Contact */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1, mt: 1 }}>
            CONTACT
          </Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            {CONTACTS.map((c, i) => (
              <Box key={c.value} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: '14px', py: '12px', borderBottom: i < CONTACTS.length - 1 ? '1px solid #F1F4F8' : 'none' }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#F1F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={c.icon} size={20} color="#1A1A1A" />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING }}>{c.value}</Typography>
                  <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>{c.label}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Socials */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 3 }}>
            {SOCIALS.map((s) => (
              <Box
                key={s.name}
                role="button"
                aria-label={s.name}
                onClick={() => {}}
                sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:active': { opacity: 0.6 } }}
              >
                <Box component="img" src={`/assets/brand/${encodeURI(s.file)}`} alt={s.name} sx={{ width: 26, height: 26, display: 'block' }} />
              </Box>
            ))}
          </Box>

          <Typography sx={{ fontSize: 11.5, color: '#B6BDC8', textAlign: 'center', mt: 3 }}>
            NongHyup v1.0.0 · build 2026
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
