import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'
import CallSheet from '../components/CallSheet'
import { useFlow } from '../workspace/FlowContext'

// ─────────────────────────────────────────────────────────────────────────────
// Notifications — opened from the bell in the greeting header.
// Four filters: All · Reminder · Transaction · Announcements.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const DANGER = '#E11D48'
const GREEN = '#1FA85C'
const AMBER = '#C47F11'

type Filter = 'all' | 'reminder' | 'transaction' | 'announcements'

const FILTERS: { id: Filter; label: string; dot?: boolean }[] = [
  { id: 'all', label: 'All' },
  { id: 'reminder', label: 'Reminder' },
  { id: 'transaction', label: 'Transaction' },
  { id: 'announcements', label: 'Announcements' },
]

export default function NotificationsScreen() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const [filter, setFilter] = useState<Filter>('all')
  const [scrolled, setScrolled] = useState(false)

  // Only borrowers have a loan → transaction history.
  const hasTransactions = flow === 'Borrower'
  // Visitors and New Users have no loan or application yet → no payment reminders.
  const hasReminders = flow === 'Applicant' || flow === 'Borrower'

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box
        className="scroll-content"
        sx={{ flex: 1 }}
        onScroll={(e: React.UIEvent<HTMLDivElement>) => setScrolled(e.currentTarget.scrollTop > 50)}
      >
        {/* Header */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1 }}>
          {/* Back row — compact title fades in when scrolled */}
          <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ ml: -1, color: HEADING }}>
              <Icon name="chevronLeft" size={26} color={HEADING} />
            </IconButton>
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: HEADING, ml: 0.5, opacity: scrolled ? 1 : 0, transition: 'opacity 0.22s ease' }}>
              Notifications
            </Typography>
          </Box>

          {/* Large title — collapses on scroll */}
          <Box sx={{ maxHeight: scrolled ? 0 : 56, opacity: scrolled ? 0 : 1, overflow: 'hidden', transition: 'max-height 0.25s ease, opacity 0.2s ease' }}>
            <Typography sx={{ fontSize: 30, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', mt: 0.5 }}>
              Notifications
            </Typography>
          </Box>

          {/* Filter — scrollable so 4 pills fit */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              height: 40,
              gap: 0.5,
              mt: scrolled ? 1 : 2,
              mb: 1,
              p: '4px',
              bgcolor: '#EBEBEC',
              borderRadius: 999,
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              transition: 'margin-top 0.25s ease',
            }}
          >
            {FILTERS.map((f) => (
              <FilterPill
                key={f.id}
                label={f.label}
                dot={f.dot && (f.id === 'all' || (f.id === 'transaction' && hasTransactions))}
                active={filter === f.id}
                onClick={() => setFilter(f.id)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ px: 3, pt: 1, pb: 5 }}>
          {filter === 'all' && <AllFeed />}
          {filter === 'reminder' && (hasReminders ? <ReminderFeed /> : <EmptyReminders />)}
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
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.625,
        px: '14px',
        borderRadius: 999,
        cursor: 'pointer',
        bgcolor: active ? '#fff' : 'transparent',
        boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.15s',
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: active ? '#0B0F1A' : '#71717A', whiteSpace: 'nowrap' }}>
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
    <Box sx={{ bgcolor: '#fff', borderRadius: '14px', p: '12px', mb: 1.5 }}>{children}</Box>
  )
}

function CardHead({
  icon, badge, badgeColor, badgeBg, iconBg, iconColor, time,
}: {
  icon: 'alert' | 'clock' | 'checkCircle'
  badge?: string
  badgeColor?: string
  badgeBg?: string
  iconBg?: string
  iconColor?: string
  time: string
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: iconBg ?? '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={20} color={iconColor ?? HEADING} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        {badge && badgeBg && badgeColor ? (
          <Box sx={{ bgcolor: badgeBg, borderRadius: '999px', px: 1, py: '3px' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: badgeColor }}>{badge}</Typography>
          </Box>
        ) : <Box />}
        <Typography sx={{ fontSize: 13, color: MUTED, flexShrink: 0 }}>{time}</Typography>
      </Box>
    </Box>
  )
}

// ─── All feed — combined loan-status + reminder + transaction items ────────────
function AllFeed() {
  const navigate = useNavigate()
  const [callOpen, setCallOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  return (
    <Box>
      <DateLabel>TODAY</DateLabel>

      {/* 1. Loan Approved */}
      <NotifCard>
        <CardHead
          icon="checkCircle"
          iconBg="#E3F7EC"
          iconColor={GREEN}
          time="10:30AM"
        />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Your loan has been approved!</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Congratulations! Your Small Business Loan application (Ref: SBL-2026-0418) has been approved. Disbursement will be processed within 1–2 business days.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/my-loan-detail')}
          sx={{ mt: 1.75, height: 44, borderRadius: '10px', px: 2.5, fontSize: 14, fontWeight: 700, bgcolor: BLUE }}
        >
          View Loan
        </Button>
      </NotifCard>

      {/* 2b. Restructure Approved */}
      <NotifCard>
        <CardHead
          icon="checkCircle"
          iconBg="#E3F7EC"
          iconColor={GREEN}
          time="09:15AM"
        />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Loan restructure approved</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Your restructure application for account 0019-84727 has been approved. New repayment terms take effect from 1 June 2026.
        </Typography>
        <Button
          variant="text"
          onClick={() => navigate('/restructure-success')}
          sx={{ mt: 1.75, height: 44, borderRadius: '10px', px: 2.5, fontSize: 14, fontWeight: 700, color: HEADING, bgcolor: '#F2F4F7', '&:hover': { bgcolor: '#E7ECF2' } }}
        >
          View New Terms
        </Button>
      </NotifCard>

      {/* Overdue reminder */}
      <NotifCard>
        <CardHead icon="alert" iconBg="#FDE7EC" iconColor={DANGER} time="08:00PM" />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Payment overdue · $176.55</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Your repayment for loan account 0019-84727 is overdue by 4 days. Please pay the overdue amount today to avoid additional charges.
        </Typography>
        <ReminderActions onPay={() => navigate('/my-loan-detail?pay=1')} onCall={() => setCallOpen(true)} />
      </NotifCard>

      <DateLabel>15 MAY 2026</DateLabel>

      {/* 2a. Restructure Submitted */}
      <NotifCard>
        <CardHead
          icon="clock"
          iconBg="#FFF5E6"
          iconColor={AMBER}
          time="02:00PM"
        />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Restructure request submitted</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Your loan restructure application for account 0019-84727 is now under review. We will notify you once a decision has been made.
        </Typography>
      </NotifCard>

      {/* 3. Loan Rejected */}
      <NotifCard>
        <CardHead
          icon="alert"
          iconBg="#FDE7EC"
          iconColor={DANGER}
          time="11:00AM"
        />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Your loan application was not approved</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Unfortunately, your Small Business Loan application (Ref: SBL-2026-0319) could not be approved at this time. Please contact our team for more details.
        </Typography>
        <Button
          variant="text"
          onClick={() => navigate('/request-consult')}
          startIcon={<Icon name="phone" size={18} color={HEADING} />}
          sx={{ mt: 1.75, height: 44, borderRadius: '10px', px: 3, fontSize: 14, fontWeight: 700, color: HEADING, bgcolor: '#F2F4F7', '&:hover': { bgcolor: '#E7ECF2' } }}
        >
          Contact Us
        </Button>
      </NotifCard>

      {/* 4. Fully Paid Off */}
      <NotifCard>
        <CardHead
          icon="checkCircle"
          iconBg="#E3F7EC"
          iconColor={GREEN}
          time="08:00AM"
        />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Loan fully settled!</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Your Migrant Worker Loan (Ref: MWL-2025-0221) has been fully paid off. Thank you for your commitment to repayment.
        </Typography>
        <Button
          variant="text"
          onClick={() => navigate('/my-loan-complete')}
          sx={{ mt: 1.75, height: 44, borderRadius: '10px', px: 2.5, fontSize: 14, fontWeight: 700, color: HEADING, bgcolor: '#F2F4F7', '&:hover': { bgcolor: '#E7ECF2' } }}
        >
          View Summary
        </Button>
      </NotifCard>

      {/* Upcoming due reminder */}
      <NotifCard>
        <CardHead icon="clock" time="11:32AM" />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Repayment · $176.55</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Your repayment for loan account 0019-84727 is due in 3 days. Pay early to keep your account in good standing.
        </Typography>
        <ReminderActions onPay={() => navigate('/my-loan-detail?pay=1')} onCall={() => setCallOpen(true)} />
      </NotifCard>

      {/* Payment receipts */}
      {[0, 1].map((i) => (
        <NotifCard key={i}>
          <CardHead icon="checkCircle" iconBg="#E3F7EC" iconColor={GREEN} time="08:00PM" />
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Payment received · $176.55</Typography>
          <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
            Thank you for your repayment to account 0042-59001. If the amount or date is incorrect, contact 017 666 036.
          </Typography>
          <Button
            variant="text"
            onClick={() => setReceiptOpen(true)}
            sx={{ mt: 1.75, height: 44, borderRadius: '10px', px: 2.5, fontSize: 14, fontWeight: 700, color: HEADING, bgcolor: '#F2F4F7', '&:hover': { bgcolor: '#E7ECF2' } }}
          >
            View receipt
          </Button>
        </NotifCard>
      ))}

      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />
      <ReceiptSheet open={receiptOpen} onClose={() => setReceiptOpen(false)} />
    </Box>
  )
}

// ─── Reminder feed ───────────────────────────────────────────────────────────
function ReminderFeed() {
  const navigate = useNavigate()
  const [callOpen, setCallOpen] = useState(false)
  return (
    <Box>
      <DateLabel>TODAY</DateLabel>
      <NotifCard>
        <CardHead icon="alert" iconBg="#FDE7EC" iconColor={DANGER} time="08:00PM" />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Payment overdue · $176.55</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Your repayment for loan account 0019-84727 is overdue by 4 days. Please pay the overdue amount today to avoid additional charges.
        </Typography>
        <ReminderActions onPay={() => navigate('/my-loan-detail?pay=1')} onCall={() => setCallOpen(true)} />
      </NotifCard>

      <DateLabel>15 MAY 2026</DateLabel>
      <NotifCard>
        <CardHead icon="clock" time="11:32AM" />
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Repayment · $176.55</Typography>
        <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Your repayment for loan account 0019-84727 is due in 3 days. Pay early to keep your account in good standing.
        </Typography>
        <ReminderActions onPay={() => navigate('/my-loan-detail?pay=1')} onCall={() => setCallOpen(true)} />
      </NotifCard>

      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />
    </Box>
  )
}

function ReminderActions({ onPay, onCall }: { onPay: () => void; onCall: () => void }) {
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
        onClick={onCall}
        startIcon={<Icon name="phone" size={18} color={HEADING} />}
        sx={{ height: 44, borderRadius: '10px', px: 3, fontSize: 14, fontWeight: 700, color: HEADING, bgcolor: '#F2F4F7', '&:hover': { bgcolor: '#E7ECF2' } }}
      >
        Call
      </Button>
    </Box>
  )
}

// ─── Transaction feed ────────────────────────────────────────────────────────
function TransactionFeed() {
  const [receiptOpen, setReceiptOpen] = useState(false)
  return (
    <Box>
      <DateLabel>15 MAY 2026</DateLabel>
      {[0, 1].map((i) => (
        <NotifCard key={i}>
          <CardHead icon="checkCircle" iconBg="#E3F7EC" iconColor={GREEN} time="08:00PM" />
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, mt: 1.25 }}>Payment received · $176.55</Typography>
          <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
            Thank you for your repayment to account 0042-59001. If the amount or date is incorrect, contact 017 666 036.
          </Typography>
          <Button
            variant="text"
            onClick={() => setReceiptOpen(true)}
            sx={{ mt: 1.75, height: 44, borderRadius: '10px', px: 2.5, fontSize: 14, fontWeight: 700, color: HEADING, bgcolor: '#F2F4F7', '&:hover': { bgcolor: '#E7ECF2' } }}
          >
            View receipt
          </Button>
        </NotifCard>
      ))}
      <ReceiptSheet open={receiptOpen} onClose={() => setReceiptOpen(false)} />
    </Box>
  )
}

// ─── Receipt sheet ────────────────────────────────────────────────────────────
function ReceiptSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <Box
        onClick={onClose}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 100,
          bgcolor: 'rgba(11,15,26,0.45)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 101,
          bgcolor: '#F5F5F5',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '92%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -8px 30px rgba(11,15,26,0.18)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.5, flexShrink: 0 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#D6DBE2' }} />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 30, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px' }}>Loan Detail</Typography>
            <IconButton onClick={onClose} aria-label="Close" sx={{ bgcolor: '#fff', boxShadow: '0 1px 3px rgba(16,24,40,0.1)', '&:hover': { bgcolor: '#fff' } }}>
              <Icon name="close" size={20} color={HEADING} />
            </IconButton>
          </Box>

          <Box sx={{ bgcolor: '#1F7A33', borderRadius: '16px', py: 2.5, mt: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.8px', color: 'rgba(255,255,255,0.85)' }}>AMOUNT PAID</Typography>
            <Typography sx={{ fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.1, mt: 0.25 }}>$320.00</Typography>
            <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', mt: 0.25 }}>Installment 4 of 12</Typography>
          </Box>

          <ReceiptSectionLabel>SMALL BUSINESS LOAN</ReceiptSectionLabel>
          <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: 2, mt: 1 }}>
            <ReceiptRow label="Principal" value="$300.00" bold />
            <ReceiptRow label="Interest" value="$20.00" bold />
            <ReceiptRow label="Late fee" value="—" />
            <ReceiptRow label="Unpaid" value="—" />
            <ReceiptRow label="Monthly" value="—" />
            <ReceiptRow label="Total paid" value="$320.00" labelBold bold last />
          </Box>

          <ReceiptSectionLabel>TRANSACTION</ReceiptSectionLabel>
          <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: 2, mt: 1, mb: 1 }}>
            <ReceiptRow label="Sender" value="Sothea Mao (ACLEDA Bank) 000 0000 0000" bold align />
            <ReceiptRow label="Reference" value="TXN-2026-0319-8842" bold />
            <ReceiptRow label="Date" value="16 Mar 2026 · 12:22 PM" bold />
            <ReceiptRow label="Channel" value="KHQR" bold last />
          </Box>
        </Box>

        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1.5, px: 3, pt: 1.5, pb: '34px' }}>
          <Button
            variant="outlined"
            startIcon={<Icon name="download" size={20} color={HEADING} />}
            sx={{ flex: 1, height: 56, borderRadius: '14px', fontSize: 16, fontWeight: 700, color: HEADING, borderColor: '#E2E6EC', bgcolor: '#fff', '&:hover': { borderColor: '#D6DBE2', bgcolor: '#fff' } }}
          >
            Receipt
          </Button>
          <Button
            variant="contained"
            startIcon={<Icon name="send" size={20} color="#fff" />}
            sx={{ flex: 1, height: 56, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}
          >
            Share
          </Button>
        </Box>
      </Box>
    </>
  )
}

function ReceiptSectionLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: MUTED, mt: 2.5 }}>{children}</Typography>
  )
}

function ReceiptRow({ label, value, bold, labelBold, last, align }: { label: string; value: string; bold?: boolean; labelBold?: boolean; last?: boolean; align?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: align ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 2, py: 1.75, borderBottom: last ? 'none' : '1px solid #F0F0F0' }}>
      <Typography sx={{ fontSize: 16, color: labelBold ? HEADING : '#5B6473', fontWeight: labelBold ? 800 : 400, flexShrink: 0 }}>{label}</Typography>
      <Typography sx={{ fontSize: 16, fontWeight: bold ? 800 : 400, color: HEADING, textAlign: 'right' }}>{value}</Typography>
    </Box>
  )
}

// ─── Empty states ─────────────────────────────────────────────────────────────
function EmptyReminders() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 8, px: 3 }}>
      <Box sx={{ width: 76, height: 76, borderRadius: '50%', bgcolor: '#EEF1F5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5 }}>
        <Icon name="clock" size={34} color={MUTED} />
      </Box>
      <Typography sx={{ fontSize: 17, fontWeight: 800, color: HEADING }}>No reminders yet</Typography>
      <Typography sx={{ fontSize: 14, color: MUTED, lineHeight: 1.5, mt: 0.75, maxWidth: 260 }}>
        Once you have an active loan, payment due dates and reminders will show up here.
      </Typography>
    </Box>
  )
}

function EmptyTransactions() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 8, px: 3 }}>
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
export type Announcement = { title: string; body: string; date: string }
export const ANNOUNCEMENTS: Announcement[] = [
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
  const navigate = useNavigate()
  return (
    <Box sx={{ pt: 0.5 }}>
      {ANNOUNCEMENTS.map((a, i) => (
        <Box
          key={a.title}
          role="button"
          onClick={() => navigate('/announcement?i=' + i)}
          sx={{ bgcolor: '#fff', borderRadius: '14px', overflow: 'hidden', mb: 2, cursor: 'pointer', '&:active': { opacity: 0.95 } }}
        >
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
