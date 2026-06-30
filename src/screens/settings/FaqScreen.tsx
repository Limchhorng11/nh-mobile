import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import { Icon } from '../../components/Icon'
import { useCollapse, CollapsingHeader, CollapsingTitle } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
// FAQ — searchable, expandable common questions (opened from Settings).
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

type Qa = { q: string; a: string }
type Group = { heading: string; items: Qa[] }

const GROUPS: Group[] = [
  {
    heading: 'LOANS',
    items: [
      { q: 'How do I apply for a loan?', a: 'Open the Products tab, choose a loan, tap “Apply this loan” and follow the guided steps. You can save and resume your application at any time.' },
      { q: 'How long does approval take?', a: 'Most applications are reviewed within 1–3 business days. You’ll get a notification as soon as a decision is made.' },
      { q: 'Can I pay off my loan early?', a: 'Yes. Open the loan in My Loans and choose “Pay off early”. Any applicable early-settlement terms are shown before you confirm.' },
    ],
  },
  {
    heading: 'ACCOUNT',
    items: [
      { q: 'How do I change my PIN?', a: 'Go to Settings → Account Security → Change PIN. You’ll confirm your current PIN before setting a new one.' },
      { q: 'I forgot my PIN — what now?', a: 'On the sign-in screen tap “Forgot PIN” to verify your phone number and create a new PIN.' },
      { q: 'How do I update my phone number?', a: 'Go to Settings → Account Security → Change Phone Number and verify the new number with an OTP.' },
    ],
  },
  {
    heading: 'PAYMENTS',
    items: [
      { q: 'When are payments due?', a: 'Your due date is shown on each loan in My Loans. Enable payment reminders in App Settings to be notified 3 days in advance.' },
      { q: 'What payment methods are supported?', a: 'You can repay via linked bank accounts, mobile wallets, and at any NHFC branch.' },
    ],
  },
]

export default function FaqScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const groups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter(
      (i) => i.q.toLowerCase().includes(query.toLowerCase()) || i.a.toLowerCase().includes(query.toLowerCase()),
    ),
  })).filter((g) => g.items.length > 0)

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="FAQ" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"FAQ"}</CollapsingTitle>

        <Box sx={{ px: 3, pb: 5 }}>
          {/* Search */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#ECEEF1', borderRadius: '12px', px: '14px', height: 48, mt: 1 }}>
            <Icon name="search" size={20} color={MUTED} />
            <Box
              component="input"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search questions"
              aria-label="Search questions"
              sx={{ flex: 1, border: 'none', outline: 'none', bgcolor: 'transparent', fontSize: 16, color: HEADING, fontFamily: 'inherit', '::placeholder': { color: MUTED } }}
            />
          </Box>

          {groups.map((g) => (
            <Box key={g.heading}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1, mt: 1.5 }}>
                {g.heading}
              </Typography>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden' }}>
                {g.items.map((item, i) => {
                  const key = g.heading + i
                  const isOpen = open === key
                  return (
                    <Box key={key} sx={{ borderBottom: i < g.items.length - 1 ? '1px solid #F1F4F8' : 'none' }}>
                      <Box
                        role="button"
                        onClick={() => setOpen(isOpen ? null : key)}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: '14px', py: '14px', cursor: 'pointer', '&:active': { bgcolor: '#F8FAFC' } }}
                      >
                        <Typography sx={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: HEADING, lineHeight: 1.35 }}>{item.q}</Typography>
                        <Box sx={{ flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                          <Icon name="chevronDown" size={20} color={isOpen ? BLUE : '#C2C9D4'} />
                        </Box>
                      </Box>
                      <Collapse in={isOpen} unmountOnExit>
                        <Typography sx={{ px: '14px', pb: '14px', fontSize: 13.5, color: '#3A4256', lineHeight: 1.6 }}>{item.a}</Typography>
                      </Collapse>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          ))}

          {groups.length === 0 && (
            <Typography sx={{ fontSize: 14, color: MUTED, textAlign: 'center', mt: 5 }}>No questions match “{query}”.</Typography>
          )}

        </Box>
      </Box>
    </Box>
  )
}
