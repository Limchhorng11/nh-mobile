import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Chat thread — a single conversation with a support agent.
// Outgoing (blue, right) / incoming (white, left) bubbles, plus voice & file.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const GREEN = '#1FA85C'
const DANGER = '#E11D48'

type Msg =
  | { kind: 'text'; from: 'me' | 'them'; text: string; time: string }
  | { kind: 'voice'; from: 'me' | 'them'; time: string }
  | { kind: 'file'; from: 'me' | 'them'; name: string; size: string; time: string }

const MESSAGES: Msg[] = [
  { kind: 'text', from: 'me', text: 'Hi, I want to check the status of my loan application.', time: '10:28 AM' },
  { kind: 'text', from: 'them', text: 'Sure, may I have your application ID please?', time: '10:30 AM' },
  { kind: 'text', from: 'me', text: 'APP-2026-04-8812', time: '10:28 AM' },
  { kind: 'voice', from: 'them', time: '10:30 AM' },
  { kind: 'file', from: 'them', name: 'Required_Doc_Checklist.pdf', size: '234KB', time: '10:30 AM' },
  { kind: 'text', from: 'them', text: "Your documents have been received. We'll get back to you shortly.", time: '10:30 AM' },
]

export default function ChatThreadScreen() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      {/* Header */}
      <Box sx={{ flexShrink: 0, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1.5, borderBottom: '1px solid #ECEEF1' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/chat')} aria-label="Back" sx={{ color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: BLUE + '1F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: BLUE }}>PS</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 800, color: HEADING }} noWrap>Pisey Sok</Typography>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: GREEN }} />
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: GREEN }}>Online</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.2 }}>Customer Support</Typography>
          </Box>
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <IconButton
              aria-label="More options"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              sx={{ color: HEADING }}
            >
              <Icon name="dotsVertical" size={22} color={HEADING} />
            </IconButton>

            {menuOpen && (
              <>
                {/* Click-away layer */}
                <Box onClick={() => setMenuOpen(false)} sx={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                {/* Dropdown */}
                <Box
                  role="menu"
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    right: 4,
                    mt: 0.5,
                    zIndex: 50,
                    minWidth: 196,
                    bgcolor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 28px rgba(16,24,40,0.18), 0 0 0 1px rgba(16,24,40,0.05)',
                    overflow: 'hidden',
                    py: 0.5,
                    transformOrigin: 'top right',
                    animation: 'menuIn 0.14s ease',
                    '@keyframes menuIn': { from: { opacity: 0, transform: 'scale(0.96) translateY(-4px)' }, to: { opacity: 1, transform: 'scale(1) translateY(0)' } },
                  }}
                >
                  <Box
                    role="menuitem"
                    onClick={() => { setMenuOpen(false); navigate('/chat') }}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.75, py: 1.25, cursor: 'pointer', '&:hover': { bgcolor: '#FFF5F6' }, '&:active': { bgcolor: '#FBE7EB' } }}
                  >
                    <Icon name="trash" size={20} color={DANGER} />
                    <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: DANGER }}>Delete conversation</Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Messages */}
      <Box className="scroll-content" sx={{ flex: 1, px: 3, py: 2, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
        {/* Day divider */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: '999px', px: 1.75, py: 0.5, boxShadow: '0 1px 2px rgba(16,24,40,0.06)' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING }}>Today</Typography>
          </Box>
        </Box>

        {MESSAGES.map((m, i) => (
          <MessageBubble key={i} m={m} />
        ))}
      </Box>

      {/* Composer */}
      <Box sx={{ flexShrink: 0, bgcolor: '#F5F5F5', px: 3, pt: 1.5, pb: '34px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton aria-label="Attach file" sx={{ color: MUTED, p: 0.5 }}>
            <Icon name="paperclip" size={24} color={MUTED} />
          </IconButton>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#ECEEF1', borderRadius: '999px', px: '16px', height: 48 }}>
            <Box
              component="input"
              placeholder="Type a message…"
              aria-label="Message"
              sx={{ flex: 1, border: 'none', outline: 'none', bgcolor: 'transparent', fontSize: 16, color: HEADING, fontFamily: 'inherit', '::placeholder': { color: MUTED } }}
            />
            <IconButton aria-label="Record voice" sx={{ color: MUTED, p: 0.25, mr: -0.5 }}>
              <Icon name="mic" size={22} color={MUTED} />
            </IconButton>
          </Box>
          <IconButton aria-label="Send" sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: BLUE, color: '#fff', flexShrink: 0, '&:hover': { bgcolor: '#0048B3' } }}>
            <Icon name="send" size={20} color="#fff" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

function MessageBubble({ m }: { m: Msg }) {
  const mine = m.from === 'me'
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start', maxWidth: '100%' }}>
      <Box
        sx={{
          maxWidth: '80%',
          bgcolor: mine ? BLUE : '#fff',
          borderRadius: '18px',
          borderBottomRightRadius: mine ? '6px' : '18px',
          borderBottomLeftRadius: mine ? '18px' : '6px',
          px: m.kind === 'text' ? 2 : 1.5,
          py: m.kind === 'text' ? 1.25 : 1.25,
          boxShadow: mine ? 'none' : '0 1px 2px rgba(16,24,40,0.06)',
        }}
      >
        {m.kind === 'text' && (
          <Typography sx={{ fontSize: 16, lineHeight: 1.4, color: mine ? '#fff' : HEADING }}>{m.text}</Typography>
        )}
        {m.kind === 'voice' && <VoiceContent mine={mine} />}
        {m.kind === 'file' && <FileContent name={m.name} size={m.size} mine={mine} />}
      </Box>
      <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.5, mx: 0.5 }}>{m.time}</Typography>
    </Box>
  )
}

function VoiceContent({ mine }: { mine: boolean }) {
  const accent = mine ? '#fff' : BLUE
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 180 }}>
      <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: mine ? 'rgba(255,255,255,0.22)' : BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="play" size={18} color="#fff" />
      </Box>
      {/* Waveform */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', flex: 1, height: 28 }}>
        {WAVE.map((h, i) => (
          <Box key={i} sx={{ width: '3px', height: `${h}%`, borderRadius: '2px', bgcolor: accent, opacity: mine ? 0.9 : 0.85 }} />
        ))}
      </Box>
    </Box>
  )
}

const WAVE = [30, 55, 80, 45, 95, 60, 35, 70, 100, 50, 75, 40, 90, 55, 30, 65, 85, 45, 60, 35]

function FileContent({ name, size, mine }: { name: string; size: string; mine: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 200 }}>
      <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: mine ? 'rgba(255,255,255,0.2)' : '#FDECEC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Typography sx={{ fontSize: 10, fontWeight: 800, color: mine ? '#fff' : '#E5484D', letterSpacing: '0.3px' }}>PDF</Typography>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: 14.5, fontWeight: 700, color: mine ? '#fff' : HEADING }}>{name}</Typography>
        <Typography sx={{ fontSize: 12.5, color: mine ? 'rgba(255,255,255,0.8)' : MUTED }}>{size}</Typography>
      </Box>
    </Box>
  )
}
