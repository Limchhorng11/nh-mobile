import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'
import { ANNOUNCEMENTS } from './NotificationsScreen'

// ─────────────────────────────────────────────────────────────────────────────
// Announcement detail — opened by tapping an announcement card in Notifications.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#6B7280'
const BLUE = '#1F4FB0'

export default function AnnouncementDetailScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const idx = Number(params.get('i') ?? 0)
  const a = ANNOUNCEMENTS[idx] ?? ANNOUNCEMENTS[0]

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ px: 2, pt: 3, pb: 1 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
        </Box>

        <Box sx={{ px: 3, pt: 1, pb: 6 }}>
          {/* Headline */}
          <Typography sx={{ fontSize: 32, fontWeight: 800, color: HEADING, letterSpacing: '-0.8px', lineHeight: 1.18 }}>
            {a.title}
          </Typography>

          {/* Banner — app-store promo */}
          <Box
            sx={{
              mt: 3,
              borderRadius: '18px',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${BLUE} 0%, #2C63CC 60%, #3A74E0 100%)`,
              position: 'relative',
              minHeight: 200,
              display: 'flex',
            }}
          >
            <Box sx={{ p: 2.5, pr: 1, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>
                Download NH Finance Mobile App
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
                Get your latest version app now
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                <StoreBadge store="App Store" />
                <StoreBadge store="Google Play" />
              </Box>
            </Box>
            {/* Phone mockup */}
            <Box sx={{ width: 120, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
              <Box
                sx={{
                  position: 'absolute',
                  right: -8,
                  top: 30,
                  width: 110,
                  height: 200,
                  borderRadius: '20px',
                  border: '4px solid #11254D',
                  bgcolor: '#fff',
                  transform: 'rotate(15deg)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ height: 56, bgcolor: BLUE }} />
                <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Box sx={{ height: 8, width: '60%', borderRadius: 1, bgcolor: '#E3E8F0' }} />
                  <Box sx={{ height: 28, borderRadius: 1.5, bgcolor: '#EEF2F8' }} />
                  <Box sx={{ height: 8, width: '40%', borderRadius: 1, bgcolor: '#E3E8F0' }} />
                  <Box sx={{ height: 40, borderRadius: 1.5, bgcolor: '#EAF0FA' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Body */}
          <Typography sx={{ fontSize: 19, color: MUTED, lineHeight: 1.5, mt: 3 }}>
            {a.body}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

function StoreBadge({ store }: { store: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#000', borderRadius: '7px', px: 1, py: 0.5 }}>
      <Box sx={{ width: 14, height: 14, borderRadius: '3px', bgcolor: '#fff', flexShrink: 0 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 7, color: 'rgba(255,255,255,0.8)', lineHeight: 1 }}>GET IT ON</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{store}</Typography>
      </Box>
    </Box>
  )
}
