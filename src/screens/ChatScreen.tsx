import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { Icon } from '../components/Icon'
import CallSheet from '../components/CallSheet'
import { useFlow } from '../workspace/FlowContext'

// ─────────────────────────────────────────────────────────────────────────────
// Chat — conversation list (inbox). Opened from the chat icon in the home header.
// All / Unread tabs, searchable rows, and a compose FAB.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const GREEN = '#1FA85C'

type Conversation = {
  id: string
  name: string
  role: string
  preview: string
  time: string
  unread: number
  online?: boolean
  tint?: string
  preIcon?: 'mic'
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'pisey',
    name: 'Pisey Sok',
    role: 'Customer Support',
    preview: 'Your documents have been received…',
    time: 'just now',
    unread: 2,
    online: true,
    tint: '#275CB2',
  },
  {
    id: 'nhfc',
    name: 'NHFC Support',
    role: 'Customer Support',
    preview: 'Welcome to WeLoan! How can we help?',
    time: '2h',
    unread: 0,
    online: true,
  },
  {
    id: 'channa',
    name: 'Channa Vong',
    role: 'Loan officer',
    preview: 'Voice message · 0:34',
    time: 'Yesterday',
    unread: 0,
    preIcon: 'mic',
  },
  {
    id: 'sopheap',
    name: 'Sopheap Tep',
    role: 'Branch manager',
    preview: 'Schedule confirmed for 26 May 13:00.',
    time: 'Mon',
    unread: 0,
  },
]

type Tab = 'all' | 'unread'

export default function ChatScreen() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const [tab, setTab] = useState<Tab>('all')
  const [callOpen, setCallOpen] = useState(false)
  const isVisitor = flow === 'Visitor'
  const conversations = isVisitor ? [] : CONVERSATIONS
  const unreadCount = conversations.filter((c) => c.unread > 0).length
  const list = tab === 'all' ? conversations : conversations.filter((c) => c.unread > 0)

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ ml: -1, color: HEADING }}>
                <Icon name="chevronLeft" size={26} color={HEADING} />
              </IconButton>
              <Box component="img" src="/assets/brand/header_logo.svg" alt="NongHyup Finance" sx={{ height: 30, display: 'block' }} />
            </Box>
            <IconButton aria-label="Call support" onClick={() => setCallOpen(true)} sx={{ color: HEADING }}>
              <Icon name="phone" size={22} color={HEADING} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ px: 3, pt: 1.5 }}>
          {/* Search */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#ECEEF1', borderRadius: '12px', px: '14px', height: 48 }}>
            <Icon name="search" size={20} color={MUTED} />
            <Box
              component="input"
              placeholder="Search"
              aria-label="Search conversations"
              sx={{ flex: 1, border: 'none', outline: 'none', bgcolor: 'transparent', fontSize: 16, color: HEADING, fontFamily: 'inherit', '::placeholder': { color: MUTED } }}
            />
          </Box>

          {/* Tabs */}
          <Box sx={{ display: 'flex', gap: 3, mt: 2.5, borderBottom: '1px solid #E5E8EC' }}>
            <TabItem label="All" active={tab === 'all'} onClick={() => setTab('all')} />
            <TabItem label={`Unread (${unreadCount})`} active={tab === 'unread'} onClick={() => setTab('unread')} />
          </Box>
        </Box>

        {/* Conversation rows or empty state */}
        <Box sx={{ px: 3, pb: 5 }}>
          {list.length > 0 ? (
            list.map((c) => (
              <ConversationRow key={c.id} c={c} onClick={() => navigate('/chat-thread')} />
            ))
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 8, px: 2 }}>
              <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#EEF1F5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
                <Icon name="message" size={32} color="#B4BCC9" />
              </Box>
              <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#0B0F1A' }}>No conversations yet</Typography>
              <Typography sx={{ fontSize: 13.5, color: MUTED, mt: 0.75, maxWidth: 240, lineHeight: 1.5 }}>
                Start a conversation with our support team to get help with your loan.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/chat-new')}
                sx={{ mt: 3, height: 48, borderRadius: '12px', px: 3, fontSize: 14, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
              >
                Start a conversation
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Compose FAB */}
      <IconButton
        aria-label="New message"
        onClick={() => navigate('/chat-new')}
        sx={{
          position: 'absolute',
          right: 24,
          bottom: 32,
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: BLUE,
          color: '#fff',
          boxShadow: '0 6px 16px rgba(0,82,204,0.35)',
          '&:hover': { bgcolor: '#0048B3' },
          '&:active': { opacity: 0.9 },
        }}
      >
        <Icon name="plus" size={28} color="#fff" />
      </IconButton>

      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />
    </Box>
  )
}

function TabItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Box
      role="button"
      onClick={onClick}
      sx={{ cursor: 'pointer', pb: 1.25, borderBottom: active ? `2.5px solid ${BLUE}` : '2.5px solid transparent', mb: '-1px' }}
    >
      <Typography sx={{ fontSize: 17, fontWeight: active ? 800 : 600, color: active ? BLUE : MUTED }}>{label}</Typography>
    </Box>
  )
}

function ConversationRow({ c, onClick }: { c: Conversation; onClick: () => void }) {
  const initials = c.name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  const tint = c.tint ?? GREEN
  return (
    <Box
      role="button"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.75,
        py: 2,
        borderBottom: '1px solid #ECEEF1',
        cursor: 'pointer',
        '&:active': { bgcolor: '#ECEEF1' },
      }}
    >
      {/* Avatar */}
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: tint + '1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: tint }}>{initials}</Typography>
        </Box>
        {c.online && (
          <Box sx={{ position: 'absolute', right: 1, bottom: 1, width: 13, height: 13, borderRadius: '50%', bgcolor: GREEN, border: '2.5px solid #F5F5F5' }} />
        )}
      </Box>

      {/* Text */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: HEADING }} noWrap>{c.name}</Typography>
          <Typography sx={{ fontSize: 13, color: MUTED, flexShrink: 0 }}>{c.time}</Typography>
        </Box>
        <Typography sx={{ fontSize: 13.5, color: MUTED, lineHeight: 1.3, mt: 0.25 }}>{c.role}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            {c.preIcon === 'mic' && <Icon name="mic" size={15} color={MUTED} />}
            <Typography
              noWrap
              sx={{ fontSize: 14.5, color: c.unread > 0 ? HEADING : '#5B6473', fontWeight: c.unread > 0 ? 700 : 400 }}
            >
              {c.preview}
            </Typography>
          </Box>
          {c.unread > 0 && (
            <Box sx={{ flexShrink: 0, minWidth: 22, height: 22, px: 0.5, borderRadius: '999px', bgcolor: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{c.unread}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
