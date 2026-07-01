import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import BottomNav from '../components/BottomNav'
import PayLoanSheet from '../components/PayLoanSheet'
import { Icon, type IconName } from '../components/Icon'
import { SummaryCard, Card, StatusChip, SectionLabel, AdvanceCard, HomeTopBar } from '../components/home/HomeParts'
import { AssetImg, asset } from '../components/home/media'
import { useFlow } from '../workspace/FlowContext'
import { getApplications, reviewQuery } from '../workspace/applications'
import { activeStage, STAGE_CHIP } from '../workspace/tracking'
import { BottomSheet } from './mwl/MwlParts'

const BLUE = '#275CB2'
const MUTED = '#8A94A6'
const HEADING = '#0B0F1A'

// ── Credit score data (shared with CreditScoreScreen) ──────────────────────
const CS_SCORE = 742
const CS_MIN = 300
const CS_MAX = 850
const CS_BAND = { label: 'Very Good', color: '#2E9E5B' }

function CreditGaugeSvg({ size = 200 }: { size?: number }) {
  const h = size * 0.575
  const cx = size / 2, cy = h * 0.945
  const r = size * 0.417
  const startAngle = Math.PI
  const pct = (CS_SCORE - CS_MIN) / (CS_MAX - CS_MIN)
  const angle = startAngle + pct * Math.PI
  const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(Math.PI * 2), y2 = cy + r * Math.sin(Math.PI * 2)
  const px = cx + r * Math.cos(angle), py = cy + r * Math.sin(angle)
  const sw = size * 0.067
  return (
    <Box component="svg" width={size} height={h} viewBox={`0 0 ${size} ${h}`} sx={{ display: 'block' }}>
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke="#EDEFF3" strokeWidth={sw} strokeLinecap="round" />
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${px} ${py}`} fill="none" stroke={CS_BAND.color} strokeWidth={sw} strokeLinecap="round" />
      <circle cx={px} cy={py} r={sw * 0.44} fill="#fff" stroke={CS_BAND.color} strokeWidth={sw * 0.19} />
    </Box>
  )
}

type Tab = 'active' | 'review' | 'complete'

const TABS: { id: Tab; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'review', label: 'Requests' },
  { id: 'complete', label: 'Paid off' },
]

// My Loans — segmented control switches between Active / In Review / Complete.
export default function MyLoanScreen() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const isApplicant = flow === 'Applicant'
  const isGuarantee = flow === 'Guarantee'
  // Visitors always empty; Staff empty only until they submit an application.
  const isEmpty = flow === 'Visitor' || (flow === 'Staff' && getApplications().length === 0)
  const [params] = useSearchParams()
  const tabParam = params.get('tab')
  const isStaff = flow === 'Staff'
  const initialTab: Tab = tabParam === 'review' || tabParam === 'complete' ? tabParam : (isApplicant || isStaff) ? 'review' : 'active'
  const [tab, setTab] = useState<Tab>(initialTab)
  const [payOpen, setPayOpen] = useState(false)
  const [creditOpen, setCreditOpen] = useState(false)
  const isBorrower = flow === 'Borrower'
  const apps = getApplications()
  const reviewHasCards = isBorrower || (isApplicant ? true : apps.length > 0)
  const tabHasCards = tab === 'active' ? !isApplicant : tab === 'complete' ? !isApplicant : tab === 'review' ? reviewHasCards : true

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: isEmpty ? '#fff' : '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <HomeTopBar />
        <Box sx={{ px: 3, pt: 0.5, pb: 1 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px' }}>
            My Loans
          </Typography>
        </Box>
        <Box sx={{ px: 3, pb: '54px', display: 'flex', flexDirection: 'column', gap: '24px', mt: '24px' }}>
          {isEmpty ? (
            <EmptyState
              label="No loans yet"
              hint="You don't have any loans yet. Explore our products and apply in minutes."
            />
          ) : isGuarantee ? (
            <GuarantorView />
          ) : (
            <>
              {!isApplicant && <SummaryCard loanCount={3} onPay={() => setPayOpen(true)} />}

              {!isApplicant && <AdvanceCard />}

              <SegmentedTabs value={tab} onChange={setTab} />

              {tab === 'active' && (isApplicant ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ mb: -4, width: '100%' }}><EmptyState label="No active loans yet" /></Box>
                  <Typography sx={{ fontSize: 13, color: '#8A94A6', textAlign: 'center', mt: -1 }}>
                    Apply for a loan from the Products tab<br />and it will appear here.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/all-loan')}
                    sx={{ height: 48, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, textTransform: 'none' }}
                  >
                    Visit &amp; Apply Loans
                  </Button>
                </Box>
              ) : <ActiveTab onPay={() => setPayOpen(true)} flow={flow} />)}
              {tab === 'review' && (reviewHasCards ? <ReviewTab /> : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ mb: -4, width: '100%' }}><EmptyState label="No loan requests" /></Box>
                  <Typography sx={{ fontSize: 13, color: '#8A94A6', textAlign: 'center', mt: -1 }}>
                    Apply for a loan from the Products tab<br />and it will appear here.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/all-loan')}
                    sx={{ height: 48, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, textTransform: 'none' }}
                  >
                    Visit &amp; Apply Loans
                  </Button>
                </Box>
              ))}
              {tab === 'complete' && (isApplicant ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ mb: -4, width: '100%' }}><EmptyState label="No completed loans" /></Box>
                  <Typography sx={{ fontSize: 13, color: '#8A94A6', textAlign: 'center', mt: -1 }}>
                    Apply for a loan from the Products tab<br />and it will appear here.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/all-loan')}
                    sx={{ height: 48, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, textTransform: 'none' }}
                  >
                    Visit &amp; Apply Loans
                  </Button>
                </Box>
              ) : <CompleteTab />)}
              {tabHasCards && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Typography sx={{ fontSize: 13, color: '#8A94A6', textAlign: 'center' }}>
                    Apply for a loan from the Products tab<br />and it will appear here.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/all-loan')}
                    sx={{ height: 48, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, textTransform: 'none' }}
                  >
                    Visit &amp; Apply Loans
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      <BottomNav />

      <PayLoanSheet open={payOpen} onClose={() => setPayOpen(false)} />

      {/* Credit score summary sheet */}
      <BottomSheet open={creditOpen} onClose={() => setCreditOpen(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 1 }}>
          <CreditGaugeSvg size={180} />
          <Box sx={{ mt: -1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 48, fontWeight: 900, color: HEADING, lineHeight: 1, letterSpacing: '-2px' }}>
              {CS_SCORE}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ bgcolor: '#E6F4ED', borderRadius: '999px', px: '10px', py: '3px' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: CS_BAND.color }}>{CS_BAND.label}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, bgcolor: '#F0FBF5', borderRadius: '999px', px: '8px', py: '3px' }}>
                <Typography sx={{ fontSize: 12, color: '#1FA85C' }}>▲</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#1FA85C' }}>+11 pts this month</Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 12, color: MUTED, mt: 1 }}>Updated 12 Jun 2026 · refreshed monthly</Typography>
          </Box>
          <Box sx={{ width: '100%', mt: 2.5, bgcolor: '#F5F7FB', borderRadius: '14px', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
            {[{ label: 'Poor', color: '#EF4444' }, { label: 'Fair', color: '#F97316' }, { label: 'Good', color: '#EAB308' }, { label: 'Very Good', color: '#2E9E5B' }, { label: 'Excellent', color: '#1B8048' }].map((b) => (
              <Box key={b.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: b.color, outline: b.label === CS_BAND.label ? `3px solid ${b.color}` : 'none', outlineOffset: '2px' }} />
                <Typography sx={{ fontSize: 10, fontWeight: b.label === CS_BAND.label ? 800 : 500, color: b.label === CS_BAND.label ? HEADING : MUTED }}>{b.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </BottomSheet>
    </Box>
  )
}

// ─── Empty state — shown for Applicants on the Active / Complete tabs ─────────
function EmptyState({ label, hint, showApplyButtons }: { label: string; hint?: string; showApplyButtons?: boolean }) {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const isVisitor = flow === 'Visitor'
  if (showApplyButtons) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', pt: 4, px: 0 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0B0F1A', mt: 3 }}>{label}</Typography>
        <Typography sx={{ fontSize: 14, color: '#8A94A6', mt: 1, maxWidth: 280, lineHeight: 1.6 }}>{hint}</Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/all-loan')}
          sx={{ mt: 4, height: 52, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, textTransform: 'none' }}
        >
          Visit &amp; Apply Loans
        </Button>
      </Box>
    )
  }
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

// ─── Segmented pill: Active | Requests | Paid off | Guarantee ────────────────
function SegmentedTabs({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  return (
    <Box sx={{ height: 40, bgcolor: '#EBEBEC', borderRadius: 999, p: '4px', gap: 0.5, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
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
              whiteSpace: 'nowrap',
              borderRadius: 999,
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
function ActiveTab({ onPay, flow }: { onPay: () => void; flow: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <SectionLabel label="ACTIVE LOANS (4)" />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ActiveLoanCard title="Small Biz Loan" icon="store" restructured />
          <ActiveLoanCard title="Housing Loan" icon="home" coBorrower />
          <ActiveLoanCard title="Micro Loan" icon="sprout" status="overdue" />
          <ActiveLoanCard title="Staff Loan" icon="idCard" salaryDeduction staffLoan />
        </Box>
      </Box>
      {flow === 'Co-Borrower' && <GuaranteeTab />}
    </Box>
  )
}

// ─── Guarantor full view (replaces tabs for Guarantee flow) ─────────────────
function GuarantorDonut({ pct = 0.55, size = 72 }: { pct?: number; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.42
  const sw = size * 0.13
  const startAngle = -Math.PI / 2
  const endAngle = startAngle + pct * 2 * Math.PI
  const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle)
  const large = pct > 0.5 ? 1 : 0
  return (
    <Box component="svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} sx={{ display: 'block', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDEFF3" strokeWidth={sw} />
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} fill="none" stroke="#2E9E5B" strokeWidth={sw} strokeLinecap="round" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={size * 0.18} fontWeight="800" fill={HEADING}>{Math.round(pct * 100)}%</text>
      <text x={cx} y={cy + size * 0.17} textAnchor="middle" fontSize={size * 0.13} fill={MUTED}>repaid</text>
    </Box>
  )
}

function GuarantorView() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Total Outstanding card */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', overflow: 'hidden' }}>
        {/* Top row: donut + amounts */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '16px 18px' }}>
          <GuarantorDonut pct={0.55} size={78} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.6px', color: MUTED, mb: 0.5 }}>TOTAL OUTSTANDING GUARANTEE</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', lineHeight: 1.15 }}>$4,780.00</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', lineHeight: 1.15 }}>៛19,598,000</Typography>
          </Box>
        </Box>

        {/* Next payment + Pay now */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0F2F5', px: '18px', py: '12px' }}>
          <Box>
            <Typography sx={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>Total payment</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', lineHeight: 1.2 }}>$320.00</Typography>
            <Typography sx={{ fontSize: 11.5, color: MUTED, mt: 0.25 }}>Due 16 May · in 9 days</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Icon name="cash" size={16} />}
            onClick={() => navigate('/my-loan-detail?guarantee=true&pay=1')}
            sx={{ height: 40, borderRadius: '10px', px: '14px', fontSize: 13, fontWeight: 700, bgcolor: '#345EAC', '&:hover': { bgcolor: '#2B4F92' }, textTransform: 'none', flexShrink: 0 }}
          >
            Pay now
          </Button>
        </Box>
      </Box>

      {/* Guaranteed loans list */}
      <GuaranteeTab count={3} />

      {/* Apply loan */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, pt: '50px' }}>
        <Typography sx={{ fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 1.6 }}>
          Ready to grow? As a guarantor you can also apply for your own loan — explore our products and get started in minutes.
        </Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/all-loan')}
          sx={{ height: 48, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, textTransform: 'none' }}
        >
          Visit &amp; Apply Loans
        </Button>
      </Box>
    </Box>
  )
}

// ─── Guarantee tab ───────────────────────────────────────────────────────────
function GuaranteeTab({ count = 1 }: { count?: number }) {
  const cards = [
    <ActiveLoanCard key="mwl" title="Migrant Worker Loan" icon="plane" guaranteeNav />,
    <ActiveLoanCard key="hl"  title="Housing Loan"        icon="home"  guaranteeNav />,
    <ActiveLoanCard key="ml"  title="Micro Loan"          icon="sprout" guaranteeNav />,
  ].slice(0, count)
  return (
    <Box>
      <SectionLabel label={`GUARANTEE LOANS (${count})`} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cards}
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

function ActiveLoanCard({ title, icon, status, restructured, coBorrower, salaryDeduction, staffLoan, statusLabel, statusColor, statusBg, guaranteeNav, payAmount }: { title: string; icon: 'store' | 'home' | 'sprout' | 'idCard' | 'plane'; status?: 'restructure' | 'overdue'; restructured?: boolean; coBorrower?: boolean; salaryDeduction?: boolean; staffLoan?: boolean; statusLabel?: string; statusColor?: string; statusBg?: string; guaranteeNav?: boolean; payAmount?: string }) {
  const navigate = useNavigate()
  const encodedTitle = encodeURIComponent(title)
  const destination = staffLoan
    ? '/my-loan-detail?product=Staff+Loan'
    : status === 'overdue'
      ? `/my-loan-detail?overdue=true&product=${encodedTitle}`
      : guaranteeNav
        ? `/my-loan-detail?guarantee=true&product=${encodedTitle}`
        : `/my-loan-detail?product=${encodedTitle}`
  return (
    <Card onClick={() => navigate(destination)} sx={{ cursor: 'pointer', p: '16px' }}>
      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header: icon + title/subtitle + status chips + chevron */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#EEF1FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={icon} size={22} color={BLUE} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0B0F1A' }} noWrap>{title}</Typography>
            {(restructured || status === 'overdue' || guaranteeNav || coBorrower || salaryDeduction) && (
              <Box sx={{ mt: '4px', display: 'inline-flex', gap: 0.5 }}>
                {restructured && <StatusChip label="1st Restructured" color="#7A4DD6" bg="#EFE7FB" />}
                {status === 'overdue' && <StatusChip label="Overdue" color="#E8770B" bg="#FFF1E6" />}
                {salaryDeduction && (
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: '#E6F4EA', borderRadius: '6px', px: '8px', py: '3px' }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#15803D' }}>Salary deduction</Typography>
                  </Box>
                )}
                {guaranteeNav && statusLabel && (
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: statusBg ?? '#FEF3C7', borderRadius: '6px', px: '8px', py: '3px' }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: statusColor ?? '#C2870F' }}>{statusLabel}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Icon name="chevronRight" size={18} color="#C9D2DE" />
        </Box>

        {/* Progress */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>8 of 24 paid</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#3A4256' }}>33%</Typography>
          </Box>
          <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#E7ECF2', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: '33%', bgcolor: BLUE, borderRadius: 3 }} />
          </Box>
        </Box>

        {/* Footer: next due + amount left */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography sx={{ fontSize: 12.5, color: '#8A94A6' }}>Next due · 20 May</Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#0B0F1A' }}>$4,500.00 left</Typography>
        </Box>

        {/* Pay button — Guarantee cards only when payAmount provided */}
        {guaranteeNav && payAmount && (
          <Box
            component="button"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate(destination + '&pay=1') }}
            sx={{ mt: 1.5, width: '100%', height: 42, borderRadius: '10px', bgcolor: BLUE, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:active': { opacity: 0.85 } }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Pay {payAmount}</Typography>
          </Box>
        )}
      </Box>
    </Card>
  )
}

// ─── In Review tab ───────────────────────────────────────────────────────────
type ReqStatus = { label: string; color: string; bg: string }
const REQ_STATUS = {
  assessment: { label: 'Under Assessment', color: '#275CB2', bg: '#D8E9FF' },
  notEligible: { label: 'Not eligible', color: '#E11D48', bg: '#FDE7EC' },
  rejected: { label: 'Rejected', color: '#E11D48', bg: '#FDE7EC' },
  cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#EDEFF2' },
  disbursed: { label: 'Disbursed', color: '#1FA85C', bg: '#DCF5E6' },
  restructured: { label: 'Approved', color: '#7A4DD6', bg: '#EFE7FB' },
  paidOff: { label: 'Paid Off', color: '#1FA85C', bg: '#DCF5E6' },
}

// Reference icon per loan product (mirrors the Loan Calculator).
const PRODUCT_ICON: Record<string, IconName> = {
  'Micro Loan': 'sprout',
  'Small Biz Loan': 'store',
  'SME Loan': 'briefcase',
  'Small & Medium Enterprise Loan': 'briefcase',
  'Housing Loan': 'home',
  'Migrant Worker Loan': 'plane',
  'Wash Loan': 'cash',
  Restructuring: 'layers',
}
const iconFor = (title: string): IconName => PRODUCT_ICON[title] ?? 'cash'

// Past requests with terminal outcomes.
const REQUEST_HISTORY: { title: string; sub: string; status: ReqStatus; statusKey: string; tag?: string; disabled?: boolean }[] = [
  { title: 'SME Loan',       sub: 'SME-2026-309818 · 14 Apr 2026', status: REQ_STATUS.notEligible, statusKey: 'notEligible' },
  { title: 'Micro Loan',     sub: 'MCL-2026-204417 · 22 Apr 2026', status: REQ_STATUS.rejected,    statusKey: 'rejected'    },
  { title: 'Wash Loan',      sub: 'WL-2026-118250 · 10 Mar 2026',  status: REQ_STATUS.cancelled,   statusKey: 'cancelled'   },
  { title: 'Small Biz Loan', sub: 'SBL-2025-201311 · 12 Jan 2025', status: REQ_STATUS.disbursed,   statusKey: 'disbursed',  disabled: true },
]

// A request row — same visual language as the active loan card (icon + title +
// subtitle + status chip), compact for a list.
function RequestRow({ icon, title, sub, status, amount, onClick, showSub, tag, disabled }: { icon: IconName; title: string; sub: string; status: ReqStatus; amount?: string; onClick?: () => void; showSub?: boolean; tag?: string; disabled?: boolean }) {
  return (
    <Card onClick={disabled ? undefined : onClick} sx={{ cursor: disabled ? 'default' : onClick ? 'pointer' : 'default', p: '14px 16px', opacity: disabled ? 0.45 : 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: '#EEF1FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={21} color={BLUE} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#0B0F1A' }} noWrap>{title}</Typography>
            {tag && <Box sx={{ bgcolor: '#F0F2F5', borderRadius: '6px', px: '7px', py: '2px', flexShrink: 0 }}><Typography sx={{ fontSize: 10.5, fontWeight: 700, color: '#6B7280', letterSpacing: '0.2px' }}>{tag}</Typography></Box>}
          </Box>
          <Box sx={{ mt: '4px' }}>
            <StatusChip label={status.label} color={status.color} bg={status.bg} />
          </Box>
        </Box>
        {!disabled && <Icon name="chevronRight" size={18} color="#C9D2DE" />}
      </Box>
      {amount && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5, pt: 1.5, borderTop: '1px solid #F0F2F5' }}>
          <Typography sx={{ fontSize: 12, color: '#8A94A6', fontWeight: 600 }}>Requested amount</Typography>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B0F1A' }}>{amount}</Typography>
        </Box>
      )}
    </Card>
  )
}

function SectionHeader({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <Typography sx={{ fontSize: 15, fontWeight: 800, color: muted ? '#9AA3B2' : '#0B0F1A', mb: 1.5 }}>{children}</Typography>
  )
}

function ReviewTab() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const isApplicant = flow === 'Applicant'
  const isBorrower = flow === 'Borrower'
  const [showAllHistory, setShowAllHistory] = useState(false)
  const HISTORY_PREVIEW = 3

  const trackChip = STAGE_CHIP[activeStage().key]
  const apps = getApplications()

  // Cards for newly submitted applications (any flow)
  const submittedCards = apps.map((a) => ({
    icon: iconFor(a.title),
    title: a.title,
    sub: `${a.ref} · ${a.on}`,
    amount: a.amount,
    status: a.track ? trackChip : REQ_STATUS.assessment,
    onClick: () => a.track ? navigate('/mwl-tracker') : navigate(`/my-loan-review?${reviewQuery(a)}`),
  }))

  // Borrower always shows hardcoded in-progress requests + any submitted apps
  const borrowerFixed = [
    { icon: 'layers' as IconName, title: 'Restructuring', sub: 'Small Biz Loan', amount: '$8,000.00', status: REQ_STATUS.assessment, onClick: () => navigate('/my-loan-review?type=restructure') },
    { icon: 'cash' as IconName, title: 'Pay off', sub: 'Small Biz Loan', amount: '$3,200.00', status: REQ_STATUS.assessment, onClick: () => navigate('/my-loan-review?type=payoff') },
  ]

  // Applicant with no submitted apps falls back to the MWL sample card
  const sampleApp = { title: 'Small Biz Loan', ref: 'MWL-2026-001234', on: '10 Jun 2026', amount: '$5,000.00', track: true }
  const applicantFallback = [{
    icon: iconFor(sampleApp.title),
    title: sampleApp.title,
    sub: `${sampleApp.ref} · ${sampleApp.on}`,
    amount: sampleApp.amount,
    status: trackChip,
    onClick: () => navigate('/mwl-tracker'),
  }]

  const current = isBorrower
    ? [...submittedCards, ...borrowerFixed]
    : isApplicant
      ? (submittedCards.length > 0 ? submittedCards : applicantFallback)
      : submittedCards

  if (current.length === 0) {
    return <EmptyState label="No loan requests" />
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <SectionHeader>Current ({current.length})</SectionHeader>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {current.map((c, i) => (
            <RequestRow key={i} icon={c.icon} title={c.title} sub={c.sub} amount={c.amount} status={c.status} onClick={c.onClick} showSub />
          ))}
        </Box>
      </Box>
      <Box>
        <SectionHeader muted>History ({REQUEST_HISTORY.length})</SectionHeader>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {REQUEST_HISTORY.map((r, i) => (
            <RequestRow key={i} icon={iconFor(r.title)} title={r.title} sub={r.sub} status={r.status} tag={r.tag} showSub disabled={!!r.disabled} onClick={r.disabled ? undefined : () => navigate(`/my-loan-review?status=${r.statusKey}&title=${encodeURIComponent(r.title)}&ref=${encodeURIComponent(r.sub)}`)} />
          ))}
        </Box>
        <Typography sx={{ fontSize: 11.5, color: '#8A94A6', textAlign: 'center', mt: 0.5, lineHeight: 1.5 }}>
          History keeps 36 months · Older records: ask your branch
        </Typography>
      </Box>
    </Box>
  )
}

// ─── Complete tab ────────────────────────────────────────────────────────────
function CompletedCard({ title, amount, term, rate, lastPaid }: { title: string; amount: string; term: string; rate: string; lastPaid: string }) {
  const navigate = useNavigate()
  const iconMap: Record<string, 'store' | 'home' | 'sprout' | 'cash'> = {
    'Small Business Loan': 'store',
    'Housing Loan': 'home',
    'Micro Loan': 'sprout',
  }
  const icon = iconMap[title] ?? 'cash'
  return (
    <Card onClick={() => navigate('/my-loan-complete')} sx={{ cursor: 'pointer', p: '16px' }}>
      {/* Header: icon + title + status chip */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#EEF1FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={22} color={BLUE} />
        </Box>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0B0F1A', flex: 1, minWidth: 0 }} noWrap>{title}</Typography>
        <Icon name="chevronRight" size={18} color="#C9D2DE" />
      </Box>

      {/* Progress — 100% complete */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Fully paid</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#1FA85C' }}>100%</Typography>
        </Box>
        <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#E7ECF2', overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: '100%', bgcolor: '#1FA85C', borderRadius: 3 }} />
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Icon name="clock" size={14} color="#8A94A6" />
          <Typography sx={{ fontSize: 12.5, color: '#8A94A6' }}>Last Paid on {lastPaid}</Typography>
        </Box>
      </Box>
    </Card>
  )
}

function CompleteTab() {
  return (
    <Box>
      <SectionLabel label="COMPLETED (2)" />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CompletedCard title="Small Business Loan" amount="$4,500.00" term="24 months" rate="1.20%/mo" lastPaid="20 May" />
        <CompletedCard title="Micro Loan" amount="$1,500.00" term="12 months" rate="1.30%/mo" lastPaid="08 Feb" />
      </Box>
    </Box>
  )
}
