import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import BottomNav from '../components/BottomNav'
import PayLoanSheet from '../components/PayLoanSheet'
import { Icon } from '../components/Icon'
import { HomeTopBar, SummaryCard, Card, StatusChip, SectionLabel } from '../components/home/HomeParts'
import { useFlow } from '../workspace/FlowContext'
import { useSample } from '../workspace/SampleContext'

const BLUE = '#0052CC'

type Tab = 'active' | 'review' | 'complete'

const TABS: { id: Tab; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'review', label: 'In Review' },
  { id: 'complete', label: 'Complete' },
]

// My Loans — segmented control switches between Active / In Review / Complete.
export default function MyLoanScreen() {
  const { flow } = useFlow()
  const { sample } = useSample()
  // Applicants have only an in-review application: no summary card, no active/complete loans.
  const isApplicant = flow === 'Applicant'
  // Visitors and New Users have no loans or applications at all — fully empty state.
  const isEmpty = flow === 'Visitor' || flow === 'New User'
  const [tab, setTab] = useState<Tab>(isApplicant ? 'review' : 'active')
  const [payOpen, setPayOpen] = useState(false)

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <HomeTopBar secondIcon="phone" />
        <Box sx={{ px: 3, pb: 5, display: 'flex', flexDirection: 'column', gap: '24px', mt: 1 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px' }}>
            My Loans
          </Typography>

          {isEmpty ? (
            <EmptyState
              label="No loans yet"
              hint="Apply for a loan from the Products tab and it will appear here."
            />
          ) : (
            <>
              {!isApplicant && <SummaryCard loanCount={3} />}

              <SegmentedTabs value={tab} onChange={setTab} />

              {tab === 'active' && (isApplicant ? <EmptyState label="No active loans yet" hint="Your loan appears here once your application is approved." /> : <ActiveTab onPay={() => setPayOpen(true)} />)}
              {tab === 'review' && <ReviewTab />}
              {tab === 'complete' && (isApplicant ? <EmptyState label="No completed loans" hint="Loans you've fully paid off will show up here." /> : <CompleteTab />)}
            </>
          )}
        </Box>
      </Box>

      {sample === '1' && <BottomNav />}

      <PayLoanSheet open={payOpen} onClose={() => setPayOpen(false)} />
    </Box>
  )
}

// ─── Empty state — shown for Applicants on the Active / Complete tabs ─────────
function EmptyState({ label, hint }: { label: string; hint: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 6, px: 2 }}>
      <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#EEF1F5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Icon name="myLoan" size={30} color="#B4BCC9" />
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: '#8A94A6', mt: 0.75, maxWidth: 240, lineHeight: 1.5 }}>{hint}</Typography>
    </Box>
  )
}

// ─── Segmented pill: Active | In Review | Complete ───────────────────────────
function SegmentedTabs({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', height: 40, bgcolor: '#EBEBEC', borderRadius: 2.5, p: '4px', gap: 0.5 }}>
      {TABS.map((t) => {
        const active = value === t.id
        return (
          <Box
            key={t.id}
            onClick={() => onChange(t.id)}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              borderRadius: 2,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              color: active ? '#0B0F1A' : '#71717A',
              bgcolor: active ? '#fff' : 'transparent',
              boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            {t.label}
          </Box>
        )
      })}
    </Box>
  )
}

// ─── Active tab ──────────────────────────────────────────────────────────────
function ActiveTab({ onPay }: { onPay: () => void }) {
  return (
    <Box>
      <SectionLabel label="ACTIVE LOANS (3)" />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <ActiveLoanCard onPay={onPay} />
        <ActiveLoanCard onPay={onPay} banner={{ tone: 'neutral', text: 'This loan is under review for restructuring' }} />
        <ActiveLoanCard onPay={onPay} banner={{ tone: 'warning', text: 'This loan is overdue, penalty may charge' }} />
      </Box>
    </Box>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ flex: 1, bgcolor: '#F7F7F8', border: 'none', borderRadius: '10px', px: 2, py: 1.5 }}>
      <Typography sx={{ fontSize: 11, color: '#8A94A6', fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B0F1A', mt: 0.25 }}>{value}</Typography>
    </Box>
  )
}

function ActiveLoanCard({ banner, onPay }: { banner?: { tone: 'neutral' | 'warning'; text: string }; onPay: () => void }) {
  const navigate = useNavigate()
  return (
    <Card onClick={() => navigate('/my-loan-detail')} sx={{ cursor: 'pointer' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>Small Business Loan</Typography>
        <StatusChip label="Active" color="#275CB2" bg="#D8E9FF" />
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        <StatBox label="Outstanding" value="$4,500.00" />
        <StatBox label="Paid" value="$2,800.00" />
      </Box>

      {/* progress */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>8 of 24</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#3A4256' }}>33%</Typography>
        </Box>
        <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#E7ECF2', overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: '33%', bgcolor: '#000', borderRadius: 3 }} />
        </Box>
      </Box>

      {banner && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 2,
            px: 1.5,
            py: 1,
            borderRadius: 2,
            bgcolor: banner.tone === 'warning' ? '#FFF1E6' : '#F5F5F5',
          }}
        >
          <Icon name="alert" size={16} color={banner.tone === 'warning' ? '#E8770B' : '#8A94A6'} />
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: banner.tone === 'warning' ? '#E8770B' : '#8A94A6' }}>
            {banner.text}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Icon name="clock" size={14} color="#8A94A6" />
          <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Due Date 20 May</Typography>
        </Box>
        <Button variant="contained" onClick={(e) => { e.stopPropagation(); onPay() }} startIcon={<Icon name="cash" size={16} />} sx={{ height: 38, minWidth: 0, borderRadius: '9px', px: '12px', py: '10px', fontSize: 13, fontWeight: 500, bgcolor: '#345EAC', '&:hover': { bgcolor: '#2B4F92' } }}>
          Pay $320.00
        </Button>
      </Box>
    </Card>
  )
}

// ─── In Review tab ───────────────────────────────────────────────────────────
function ReviewTab() {
  const navigate = useNavigate()
  return (
    <Box>
      <SectionLabel label="IN REVIEW (1)" />
      <Card onClick={() => navigate('/my-loan-review')} sx={{ cursor: 'pointer' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>Small Business Loan</Typography>
          <StatusChip label="In review" color="#B7791F" bg="#FBEBC6" />
        </Box>

        <Box sx={{ bgcolor: '#F4F6F9', border: '1px solid #ECEFF3', borderRadius: 2.5, px: 2, py: 1.5, mt: 2 }}>
          <Typography sx={{ fontSize: 11, color: '#8A94A6', fontWeight: 600 }}>Requested amount</Typography>
          <Typography sx={{ fontSize: 19, fontWeight: 800, color: '#0B0F1A', mt: 0.25 }}>$4,500.00</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Step 2 of 10</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#3A4256' }}>Credit assessment</Typography>
          </Box>
          <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#E7ECF2', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: '20%', bgcolor: '#B7791F', borderRadius: 3 }} />
          </Box>
        </Box>

        <Button
          variant="outlined"
          onClick={(e) => { e.stopPropagation(); navigate('/my-loan-review') }}
          endIcon={<Icon name="arrowRight" size={16} />}
          fullWidth
          sx={{ mt: 2.5, height: 44, borderRadius: '10px', fontSize: 14 }}
        >
          View Details
        </Button>
      </Card>
    </Box>
  )
}

// ─── Complete tab ────────────────────────────────────────────────────────────
function CompleteTab() {
  const navigate = useNavigate()
  return (
    <Box>
      <SectionLabel label="COMPLETED (1)" />
      <Card onClick={() => navigate('/my-loan-complete')} sx={{ cursor: 'pointer' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>Small Business Loan</Typography>
          <StatusChip label="Paid Off" color="#1FA85C" bg="#DCF5E6" />
        </Box>

        <Box sx={{ bgcolor: '#F4F6F9', border: '1px solid #ECEFF3', borderRadius: 2.5, px: 2, py: 1.5, mt: 2 }}>
          <Typography sx={{ fontSize: 11, color: '#8A94A6', fontWeight: 600 }}>Requested amount</Typography>
          <Typography sx={{ fontSize: 19, fontWeight: 800, color: '#0B0F1A', mt: 0.25 }}>$4,500.00</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
          <StatBox label="Term" value="24 months" />
          <StatBox label="Rate" value="1.20%/mo" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Icon name="clock" size={14} color="#8A94A6" />
            <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Last Paid on 20 May</Typography>
          </Box>
          <Button variant="outlined" onClick={(e) => { e.stopPropagation(); navigate('/my-loan-complete') }} endIcon={<Icon name="arrowRight" size={16} />} sx={{ height: 40, borderRadius: '10px', px: 2.5, fontSize: 14 }}>
            View Details
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
