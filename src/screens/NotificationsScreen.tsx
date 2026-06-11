import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'
import { useFlow } from '../workspace/FlowContext'

// ─────────────────────────────────────────────────────────────────────────────
// Notifications — opened from the bell in the greeting header.
// Three filters: Reminder · Transaction · Announcements, each its own feed.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#0052CC'
const DANGER = '#E11D48'
const GREEN = '#1FA85C'

type Filter = 'reminder' | 'transaction' | 'announcements'

const FILTERS: { id: Filter; label: string; dot?: boolean }[] = [
  { id: 'reminder', label: 'Reminder' },
  { id: 'transaction', label: 'Transaction', dot: true },
  { id: 'announcements', label: 'Announcements' },
]

export default function NotificationsScreen() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const [filter, setFilter] = useState<Filter>('reminder')

  // Visitors and applicants have no loan yet → no transaction history.
  const hasTransactions = flow === 'Borrower'

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ ml: -1, color: HEADING }}>
              <Icon name="chevronLeft" size={26} color={HEADING} />
            </IconButton>
            <IconButton onClick={() => navigate('/settings')} aria-label="Notification settings" sx={{ color: HEADING }}>
              <Icon name="appSettings" size={24} color={HEADING} />
            </IconButton>
          </Box>
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', mt: 0.5 }}>
            Notifications
          </Typography>

          {/* Filter pills */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2, pb: 1 }}>
            {FILTERS.map((f) => (
              <FilterPill
                key={f.id}
                label={f.label}
                dot={f.dot && hasTransactions}
                active={filter === f.id}
                onClick={() => setFilter(f.id)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ px: 3, pt: 1, pb: 5 }}>
          {filter === 'reminder' && <ReminderFeed />}
          {filter === 'transaction' && (hasTransactions ? <TransactionFeed /> : <EmptyTransactions />)}
          {filter === 'announcements' && <AnnouncementsFeed />}
        </Box>
      </Box>
    </Box>
  )
}

function FilterPill({ label, active, dot, onClick }: { label: string; active: boolean; dot?: boolean; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      role="button"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.75,
        height: 38,
        borderRadius: '999px',
        cursor: 'pointer',
        bgcolor: active ? BLUE : '#fff',
        border: active ? `1px solid ${BLUE}` : '1px solid #E7ECF2',
        transition: 'all 0.15s',
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: active ? '#fff' : '#3A4256', whiteSpace: 'nowrap' }}>
        {label}
      </Typography>
      {dot && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: DANGER }} />}
    </Box>
  )
}

function DateLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: MUTED, mt: 1.5, mb: 1.25 }}>
      {children}
    </Typography>
  )
}

function NotifCard({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '14px', p: 2, mb: 1.5 }}>{children}</Box>
  )
}

function CardHead({ icon, badge, badgeColor, badgeBg, time }: { icon: 'alert' | 'clock' | 'checkCircle'; badge: string; badgeColor: string; badgeBg: string; time: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={20} color={HEADING} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ bgcolor: badgeBg, borderRadius: '999px', px: 1, py: '3px' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: badgeColor }}>{badge}</Typography>
        </Box>
        <Typography sx={{ fontSize: 13, color: MUTED, flexShrink: 0 }}>{time}</Typography>
      </Box>
    </Box>
  )
}

// ─── Reminder feed ───────────────────────────────────────────────────────────
function ReminderFeed() {
  const navigate = useNavigate()
  return (
    <Box>
      <DateLabel>TODAY</DateLabel>
      <NotifCard>
        <CardHead icon="alert" badge="4 Days Late" badgeColor={DANGER} badgeBg="#FDE7EC" time="08:00PM" />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Payment overdue · $176.55</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Your repayment for loan account 0019-84727 is overdue by 4 days. Please pay the overdue amount today to avoid additional charges.
        </Typography>
        <ReminderActions onPay={() => navigate('/my-loan')} />
      </NotifCard>

      <DateLabel>15 MAY 2026</DateLabel>
      <NotifCard>
        <CardHead icon="clock" badge="Due in 3 days" badgeColor={HEADING} badgeBg="#EEF1F5" time="11:32AM" />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Repayment · $176.55</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Your repayment for loan account 0019-84727 is due in 3 days. Pay early to keep your account in good standing.
        </Typography>
        <ReminderActions onPay={() => navigate('/my-loan')} />
      </NotifCard>
    </Box>
  )
}

function ReminderActions({ onPay }: { onPay: () => void }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1.75 }}>
      <Button
        variant="contained"
        onClick={onPay}
        sx={{ height: 44, borderRadius: '10px', px: 2.5, fontSize: 14, fontWeight: 700, bgcolor: BLUE }}
      >
        Pay now
      </Button>
      <Button
        variant="text"
        startIcon={<Icon name="phone" size={18} color={HEADING} />}
        sx={{ height: 44, borderRadius: '10px', px: 2, fontSize: 14, fontWeight: 700, color: HEADING, bgcolor: '#F2F4F7', '&:hover': { bgcolor: '#E7ECF2' } }}
      >
        Call
      </Button>
    </Box>
  )
}

// ─── Transaction feed ────────────────────────────────────────────────────────
function TransactionFeed() {
  return (
    <Box>
      <DateLabel>15 MAY 2026</DateLabel>
      {[0, 1].map((i) => (
        <NotifCard key={i}>
          <CardHead icon="checkCircle" badge="Payment Receipt" badgeColor={GREEN} badgeBg="#E3F7EC" time="08:00PM" />
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Payment received · $176.55</Typography>
          <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
            Thank you for your repayment to account 0042-59001. If the amount or date is incorrect, contact 017 666 036.
          </Typography>
          <Button
            variant="text"
            sx={{ mt: 1.75, height: 44, borderRadius: '10px', px: 2.5, fontSize: 14, fontWeight: 700, color: HEADING, bgcolor: '#F2F4F7', '&:hover': { bgcolor: '#E7ECF2' } }}
          >
            View receipt
          </Button>
        </NotifCard>
      ))}
    </Box>
  )
}

// ─── Empty transactions (Visitor / Applicant — no loan yet) ──────────────────
function EmptyTransactions() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 8, px: 4 }}>
      <Box sx={{ width: 76, height: 76, borderRadius: '50%', bgcolor: '#EEF1F5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
        <Icon name="pay" size={34} color={MUTED} />
      </Box>
      <Typography sx={{ fontSize: 17, fontWeight: 800, color: HEADING }}>No transactions yet</Typography>
      <Typography sx={{ fontSize: 14, color: MUTED, lineHeight: 1.5, mt: 0.75, maxWidth: 260 }}>
        Once you have an active loan, your payment receipts and activity will show up here.
      </Typography>
    </Box>
  )
}

// ─── Announcements feed ──────────────────────────────────────────────────────
type Announcement = { title: string; body: string; date: string }
const ANNOUNCEMENTS: Announcement[] = [
  {
    title: 'Khmer New Year promotion',
    body: 'Lower micro-loan rates this season — apply between 14 Apr and 31 May to qualify.',
    date: 'Wed, 14 May',
  },
  {
    title: 'New Experience, Faster Credit Access with Less Papers',
    body: 'NongHyup Finance introduces a platform-based lending so-called NH Finance Mobile. The client can apply for loan, check balance, and get instant promotion/update of the products and services. Get the NH Finance Mobile now!',
    date: 'Wed, 14 May',
  },
]

function AnnouncementsFeed() {
  return (
    <Box sx={{ pt: 0.5 }}>
      {ANNOUNCEMENTS.map((a) => (
        <Box key={a.title} sx={{ bgcolor: '#fff', borderRadius: '14px', overflow: 'hidden', mb: 2 }}>
          {/* Thumbnail */}
          <Box sx={{ height: 150, bgcolor: '#DCE9FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 17, fontWeight: 800, letterSpacing: '1px', color: BLUE }}>THUMBNAIL</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, lineHeight: 1.3 }}>{a.title}</Typography>
            <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.75 }}>{a.body}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
              <Typography sx={{ fontSize: 13, color: MUTED }}>{a.date}</Typography>
              <Box role="button" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: BLUE }}>Read more</Typography>
                <Icon name="arrowRight" size={16} color={BLUE} />
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
