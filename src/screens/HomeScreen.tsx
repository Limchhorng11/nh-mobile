import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import BottomNav from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { useFlow } from '../workspace/FlowContext'
import { useSample } from '../workspace/SampleContext'
import {
  HomeTopBar,
  SummaryCard,
  AdvanceCard,
  ActiveLoansSection,
  SectionLabel,
  StatusChip,
  ApplyLoanCards,
  NewsBanner,
  ProductScroller,
  DiscoverRow,
  Card,
} from '../components/home/HomeParts'

const BLUE = '#275CB2'

// Home — the main dashboard. Its top section adapts to the active user flow:
//   • Visitor   → welcome + explore prompt (no loans)
//   • Applicant → application-in-progress tracker
//   • Borrower  → outstanding summary + active loans
// Sample 1 shows the bottom nav, Sample 2 hides it (global SampleContext).
export default function HomeScreen({ loggedIn = false }: { loggedIn?: boolean } = {}) {
  const { sample } = useSample()
  const showNav = sample === '1'
  const { flow } = useFlow()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const v = params.get('v') ?? '1'

  // Borrower loan variant: v=1 → 1 active + 1 review, v=2 → 2 active + 1 review, v=3 → 1 active only
  const activeCount = v === '2' ? 2 : 1
  const showReview = v === '1' || v === '2'

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {loggedIn || flow !== 'Visitor' ? <HomeTopBar /> : <VisitorTopBar />}
        <Box sx={{ px: 3, pb: 5, display: 'flex', flexDirection: 'column', gap: 4, mt: 3 }}>
          {!loggedIn && flow === 'Applicant' && <ApplicationProgress />}
          {!loggedIn && flow === 'Borrower' && (
            <>
              <SummaryCard loanCount={activeCount} />
              <AdvanceCard />
              <Box>
                <SectionLabel label="ALL LOAN" action="See all" onAction={() => navigate('/my-loan')} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ActiveLoansSection count={activeCount as 1 | 2 | 3 | 4} hideSectionLabel />
                  {showReview && <HomeReviewCard />}
                </Box>
              </Box>
            </>
          )}

          <Box>
            <SectionLabel label="APPLY LOAN" />
            <ApplyLoanCards loggedIn={loggedIn} />
          </Box>
          <Box>
            <SectionLabel label="NEWS & PROMOTIONS" />
            <NewsBanner />
          </Box>
          <Box>
            <SectionLabel label="POPULAR LOAN PRODUCTS" action="See all" onAction={() => navigate('/all-loan')} />
            <ProductScroller />
          </Box>
          <Box>
            <SectionLabel label="DISCOVER" />
            <DiscoverRow />
          </Box>
        </Box>
      </Box>

      {showNav && <BottomNav />}
    </Box>
  )
}

// ─── Visitor top bar — brand logo with chat & bell ───────────────────────────
function VisitorTopBar() {
  const navigate = useNavigate()
  const { sample } = useSample()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: 3,
        pt: 4,
        pb: 2,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: '#F5F5F5',
      }}
    >
      <Box
        component="img"
        src="/assets/brand/header_logo.svg"
        alt="NongHyup Finance (Cambodia) Plc"
        role="button"
        onClick={() => navigate(sample === '2' ? '/more' : '/sign-up')}
        sx={{ height: 26, width: 'auto', display: 'block', flex: 1, minWidth: 0, objectFit: 'contain', objectPosition: 'left', cursor: 'pointer', '&:active': { opacity: 0.6 } }}
      />
      {/* Visitors must sign up before chatting; carry /chat as the post-sign-up destination. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <IconButton onClick={() => navigate('/sign-up?next=' + encodeURIComponent('/chat'))} size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Messages">
          <Box component="img" src="/assets/brand/ico_chat.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
        </IconButton>
        <IconButton onClick={() => navigate('/notifications')} size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Notifications">
          <Box component="img" src="/assets/brand/ico_bell.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
        </IconButton>
      </Box>
    </Box>
  )
}

// ─── Borrower — compact in-review loan card shown on Home when a review exists ──
function HomeReviewCard() {
  const navigate = useNavigate()
  return (
    <Card sx={{ cursor: 'pointer', '&:active': { opacity: 0.8 } }} onClick={() => navigate('/my-loan-review')}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#0B0F1A' }}>Small Business Loan</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
            <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>$4,500 requested</Typography>
            <Typography sx={{ fontSize: 13, color: '#CBD2DC' }}>·</Typography>
            <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>24 months</Typography>
          </Box>
        </Box>
        <Box sx={{ fontSize: 12, fontWeight: 700, px: 1.5, py: 0.5, borderRadius: 2, color: '#B25E00', bgcolor: '#FFF1DC', flexShrink: 0 }}>In Review</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {APP_STEPS_V2.map((step, i) => {
          const done = step.state === 'done'
          const active = step.state === 'active'
          const future = step.state === 'future'
          const isLast = i === APP_STEPS_V2.length - 1
          return (
            <Box key={step.label} sx={{ display: 'flex', gap: 1.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...(done ? { bgcolor: BLUE } : active ? { bgcolor: '#fff', border: `2px solid ${BLUE}` } : { bgcolor: '#fff', border: '2px solid #CBD2DC' }) }}>
                  {done ? <Icon name="check" size={13} color="#fff" /> : <Typography sx={{ fontSize: 12, fontWeight: 700, color: active ? BLUE : '#9AA3B2', lineHeight: 1 }}>{i + 1}</Typography>}
                </Box>
                {!isLast && <Box sx={{ width: 2, flex: 1, minHeight: 16, bgcolor: '#E2E6EC', my: 0.5 }} />}
              </Box>
              <Box sx={{ pb: isLast ? 0 : 2 }}>
                <Typography sx={{ fontSize: 14, fontWeight: done || active ? 700 : 500, color: future ? '#9AA3B2' : '#0B0F1A', lineHeight: 1.2 }}>{step.label}</Typography>
                <Typography sx={{ fontSize: 12, color: future ? '#B8C0CC' : '#8A94A6', mt: 0.25 }}>{step.sub}</Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Card>
  )
}

// ─── Visitor — no loans yet; sign-up prompt ──────────────────────────────────
// ─── Applicant — application submitted; tracking its progress ────────────────
const APP_STEPS = ['Submitted', 'Under review', 'Approved']
const APP_CURRENT = 1 // index of the in-progress step

const APP_STEPS_V2 = [
  { label: 'You Submitted', sub: '19 May, 02:23PM', state: 'done' as const },
  { label: 'Our Team Reviewing', sub: '20 May, 02:23PM', state: 'active' as const },
  { label: 'Result', sub: 'To be update soon!', state: 'future' as const },
]

function ApplicationProgress() {
  const navigate = useNavigate()
  const { sample } = useSample()

  if (sample === '2') {
    return (
      <Box>
        <SectionLabel label="YOUR APPLICATION" action="View details" onAction={() => navigate('/my-loan-review')} />
        <Card sx={{ cursor: 'pointer', '&:active': { opacity: 0.8 } }} onClick={() => navigate('/my-loan-review')}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: 17, fontWeight: 700, color: '#0B0F1A' }}>Migrant Worker Loan</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>$5,000 requested</Typography>
                <Typography sx={{ fontSize: 13, color: '#CBD2DC' }}>·</Typography>
                <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>30 months</Typography>
              </Box>
            </Box>
            <Box sx={{ fontSize: 12, fontWeight: 700, px: 1.5, py: 0.5, borderRadius: 2, color: '#B25E00', bgcolor: '#FFF1DC', flexShrink: 0 }}>In Review</Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {APP_STEPS_V2.map((step, i) => {
              const done = step.state === 'done'
              const active = step.state === 'active'
              const future = step.state === 'future'
              const isLast = i === APP_STEPS_V2.length - 1
              return (
                <Box key={step.label} sx={{ display: 'flex', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...(done ? { bgcolor: BLUE } : active ? { bgcolor: '#fff', border: `2px solid ${BLUE}` } : { bgcolor: '#fff', border: '2px solid #CBD2DC' }) }}>
                      {done ? <Icon name="check" size={13} color="#fff" /> : <Typography sx={{ fontSize: 12, fontWeight: 700, color: active ? BLUE : '#9AA3B2', lineHeight: 1 }}>{i + 1}</Typography>}
                    </Box>
                    {!isLast && <Box sx={{ width: 2, flex: 1, minHeight: 16, bgcolor: '#E2E6EC', my: 0.5 }} />}
                  </Box>
                  <Box sx={{ pb: isLast ? 0 : 2 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: done || active ? 700 : 500, color: future ? '#9AA3B2' : '#0B0F1A', lineHeight: 1.2 }}>{step.label}</Typography>
                    <Typography sx={{ fontSize: 12, color: future ? '#B8C0CC' : '#8A94A6', mt: 0.25 }}>{step.sub}</Typography>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Card>
      </Box>
    )
  }

  return (
    <Box>
      <SectionLabel label="YOUR APPLICATION" action="View details" onAction={() => navigate('/my-loan-review')} />
      <Card sx={{ cursor: 'pointer', '&:active': { opacity: 0.8 } }} onClick={() => navigate('/my-loan-review')}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>Migrant Worker Loan</Typography>
            <Typography sx={{ fontSize: 13, color: '#8A94A6', mt: 0.25 }}>Ref · MWL-2026-0418</Typography>
          </Box>
          <Box sx={{ fontSize: 11, fontWeight: 700, px: 1.25, py: 0.5, borderRadius: 1.5, color: '#B25E00', bgcolor: '#FFF1DC' }}>In Review</Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 2 }}>
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px' }}>$5,000</Typography>
          <Typography sx={{ fontSize: 13, color: '#8A94A6' }}>requested · 30 months</Typography>
        </Box>

        {/* Progress stepper */}
        <Box sx={{ display: 'flex', mt: 2.5 }}>
          {APP_STEPS.map((label, i) => {
            const done = i < APP_CURRENT
            const active = i === APP_CURRENT
            const reached = done || active
            return (
              <Box key={label} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i > 0 && (
                  <Box sx={{ position: 'absolute', top: 9, right: '50%', left: '-50%', height: 3, borderRadius: 2, bgcolor: i <= APP_CURRENT ? BLUE : '#E2E6EC' }} />
                )}
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: reached ? BLUE : '#E2E6EC',
                    color: '#fff',
                  }}
                >
                  {done ? <Icon name="check" size={12} color="#fff" /> : <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#fff' }} />}
                </Box>
                <Typography sx={{ fontSize: 11, fontWeight: active ? 700 : 600, color: reached ? '#0B0F1A' : '#8A94A6', mt: 0.75, textAlign: 'center' }}>
                  {label}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Card>
    </Box>
  )
}
