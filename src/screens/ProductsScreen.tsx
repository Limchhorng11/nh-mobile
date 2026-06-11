import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import BottomNav from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { HomeTopBar, NewsBanner } from '../components/home/HomeParts'
import { AssetImg, BANNERS, DISCOVER } from '../components/home/media'
import { useSample } from '../workspace/SampleContext'
import { useFlow } from '../workspace/FlowContext'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'

type Product = { name: string; amount: string; rate: string; img?: string }

const PRODUCTS: Product[] = [
  { name: 'Micro Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.microS1 },
  { name: 'Small Biz Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.smallS1 },
  { name: 'Housing Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.housingS1 },
  { name: 'SME Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.smeS1 },
]

const MIGRATION: Product = { name: 'Migration Worker Loan', amount: 'USD ≤ 15,000', rate: '1.2%', img: BANNERS.mwlS1 }

function ProductCard({ p, height, showRate = false }: { p: Product; height: number; showRate?: boolean }) {
  const navigate = useNavigate()
  return (
    <Box
      onClick={() => navigate(`/product-detail?p=${encodeURIComponent(p.name)}`)}
      role="button"
      sx={{ borderRadius: '12px', overflow: 'hidden', bgcolor: '#fff', border: '1px solid #ECEFF3', cursor: 'pointer' }}
    >
      <Box sx={{ position: 'relative', height }}>
        <AssetImg
          src={p.img}
          alt={p.name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          fallback={<Box sx={{ width: '100%', height: '100%', bgcolor: '#E7ECF2' }} />}
        />
        {showRate && (
          <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: '8px', px: 0.75, py: 0.25 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: HEADING }}>{p.rate}</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ px: 1.25, py: 1.25 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING }} noWrap>{p.name}</Typography>
        <Box sx={{ display: 'inline-flex', mt: 0.75, px: 1.25, py: '4px', bgcolor: '#ECECEC', borderRadius: '8px' }}>
          <Typography sx={{ fontSize: 11, color: '#000' }}>{p.amount}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

// Exported product data + card so the dedicated All Loan screen can reuse them.
export { ProductCard, PRODUCTS, MIGRATION }
export type { Product }

// ─── Discover — horizontal carousel of shortcuts + news under "All Loan" ─────
type NewsItem = { tag: string; title: string; body: string; img?: string; detail?: string }

const DISCOVER_NEWS: NewsItem[] = [
  {
    tag: 'NEWS',
    title: 'Khmer New Year promotion',
    body: 'Lower micro-loan rates this season — apply by mid-April.',
    img: BANNERS.micro,
    detail:
      'Celebrate Khmer New Year with reduced micro-loan rates across all branches. Apply before mid-April to lock in the seasonal rate and enjoy faster approval with fewer documents. Talk to our team to see how much you can save.',
  },
  {
    tag: 'NEWS',
    title: 'Migrant worker support',
    body: 'Special rates for overseas workers and their families.',
    img: BANNERS.migrant,
    detail:
      'NongHyup Finance offers dedicated loan packages for migrant workers and their families, with flexible repayment aligned to overseas income. Get help with guarantor setup and remittance-friendly schedules.',
  },
  {
    tag: 'TIPS',
    title: 'Build your credit score',
    body: 'Simple habits that help you qualify for a bigger loan.',
    img: BANNERS.housing,
    detail:
      'Paying on time, keeping balances low, and maintaining a steady income are the habits that build a strong credit profile. A better score unlocks larger limits and lower rates on your next loan.',
  },
]

const DISCOVER_CARD_W = 152
const DISCOVER_CARD_H = 190

function CalculatorCard() {
  const navigate = useNavigate()
  return (
    <Box
      onClick={() => navigate('/calculator')}
      role="button"
      aria-label="Loan calculator"
      sx={{
        flexShrink: 0,
        position: 'relative',
        width: DISCOVER_CARD_W,
        height: DISCOVER_CARD_H,
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        bgcolor: '#0B1A14',
        '&:active': { opacity: 0.85 },
      }}
    >
      <AssetImg
        src={DISCOVER.calculator}
        alt=""
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        fallback={<Box sx={{ width: '100%', height: '100%', bgcolor: '#0B1A14' }} />}
      />
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 1.5 }}>
        <Typography sx={{ color: '#fff', fontSize: 16, fontWeight: 800, letterSpacing: '-0.2px' }}>Calculator</Typography>
        <Icon name="arrowRight" size={18} color="#fff" />
      </Box>
    </Box>
  )
}

function NewsCard({ n, onClick }: { n: NewsItem; onClick?: () => void }) {
  return (
    <Box
      role="button"
      onClick={onClick}
      sx={{
        flexShrink: 0,
        width: DISCOVER_CARD_W,
        height: DISCOVER_CARD_H,
        borderRadius: '14px',
        overflow: 'hidden',
        bgcolor: '#fff',
        border: '1px solid #ECEFF3',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:active': { opacity: 0.85 },
      }}
    >
      <Box sx={{ height: 90, flexShrink: 0 }}>
        <AssetImg
          src={n.img}
          alt={n.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          fallback={<Box sx={{ width: '100%', height: '100%', bgcolor: '#E7ECF2' }} />}
        />
      </Box>
      <Box sx={{ p: 1.25, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, minHeight: 0 }}>
        <Box sx={{ alignSelf: 'flex-start', bgcolor: '#F5C518', borderRadius: '6px', px: 0.75, py: '2px' }}>
          <Typography sx={{ fontSize: 9, fontWeight: 800, color: HEADING, letterSpacing: '0.5px' }}>{n.tag}</Typography>
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING, lineHeight: 1.2 }}>{n.title}</Typography>
        <Typography
          sx={{ fontSize: 11, color: MUTED, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {n.body}
        </Typography>
      </Box>
    </Box>
  )
}

function DiscoverSection() {
  const [active, setActive] = useState<NewsItem | null>(null)
  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 800, color: MUTED, letterSpacing: '0.6px', mb: 1.5 }}>
        DISCOVER
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          // Bleed the scroll row to the screen edges, keep first/last card inset.
          mx: -4,
          px: 4,
          pb: 0.5,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <CalculatorCard />
        {DISCOVER_NEWS.map((n) => (
          <NewsCard key={n.title} n={n} onClick={() => setActive(n)} />
        ))}
      </Box>
      <NewsSheet item={active} onClose={() => setActive(null)} />
    </Box>
  )
}

// ─── News detail — slides up within the phone canvas (no portal) ─────────────
function NewsSheet({ item, onClose }: { item: NewsItem | null; onClose: () => void }) {
  const open = item !== null
  return (
    <>
      {/* Backdrop */}
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
      {/* Sheet */}
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
          maxHeight: '90%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -8px 30px rgba(11,15,26,0.18)',
        }}
      >
        {/* Drag handle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.5, flexShrink: 0 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#D6DBE2' }} />
        </Box>
        {/* Close */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{ width: 40, height: 40, bgcolor: '#fff', boxShadow: '0 2px 8px rgba(11,15,26,0.12)', '&:hover': { bgcolor: '#fff' } }}
          >
            <Icon name="close" size={22} color="#6B7280" />
          </IconButton>
        </Box>

        <Box sx={{ overflowY: 'auto', px: 3, pt: 2, pb: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Headline */}
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: HEADING, lineHeight: 1.15, letterSpacing: '-0.5px', pr: 5 }}>
            {item?.title}
          </Typography>

          {/* Hero banner */}
          <Box sx={{ borderRadius: '14px', overflow: 'hidden', height: 200 }}>
            <AssetImg
              src={item?.img}
              alt={item?.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              fallback={<Box sx={{ width: '100%', height: '100%', bgcolor: '#2B5BB3' }} />}
            />
          </Box>

          {/* Body */}
          <Typography sx={{ fontSize: 17, color: '#525866', lineHeight: 1.5 }}>
            {item?.detail ?? item?.body}
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1.5, px: 3, pt: 1, pb: '44px' }}>
          <Box
            role="button"
            onClick={onClose}
            sx={{ flex: 1, minHeight: 56, borderRadius: '12px', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:active': { opacity: 0.7 } }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: HEADING }}>Explore</Typography>
          </Box>
          <Box
            role="button"
            sx={{ flex: 1, minHeight: 56, borderRadius: '12px', bgcolor: '#275CB2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:active': { opacity: 0.85 } }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Call Now</Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

function ProductsTopBar() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: 4,
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
        sx={{ height: 26, width: 'auto', display: 'block', flex: 1, minWidth: 0, objectFit: 'contain', objectPosition: 'left' }}
      />
      <IconButton size="small" sx={{ color: '#1A1A1A' }} aria-label="Messages">
        <Box component="img" src="/assets/brand/ico_chat.svg" alt="" sx={{ width: 22, height: 22, display: 'block' }} />
      </IconButton>
      <IconButton onClick={() => navigate('/notifications')} size="small" sx={{ color: '#1A1A1A' }} aria-label="Notifications">
        <Box component="img" src="/assets/brand/ico_bell.svg" alt="" sx={{ width: 20, height: 20, display: 'block' }} />
      </IconButton>
    </Box>
  )
}

export default function ProductsScreen() {
  const navigate = useNavigate()
  const { sample } = useSample()
  const { flow } = useFlow()
  const showNav = sample === '1'

  // Logged-in flows (Applicant / Borrower) in Sample 1 see the personalized
  // greeting header; visitors and Sample 2 keep the brand logo bar.
  const greeting = sample === '1' && (flow === 'Applicant' || flow === 'Borrower')

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {greeting ? <HomeTopBar /> : <ProductsTopBar />}
        <Box sx={{ px: 4, pb: 5, display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {sample === '1' && (
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: MUTED, letterSpacing: '0.6px', mb: 1.5 }}>
                NEWS &amp; PROMOTIONS
              </Typography>
              <NewsBanner />
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: MUTED, letterSpacing: '0.6px' }}>
              POPULAR PRODUCTS
            </Typography>
            <Box
              onClick={() => navigate('/all-loan')}
              role="button"
              sx={{ cursor: 'pointer', '&:active': { opacity: 0.6 } }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0052CC' }}>See all</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {PRODUCTS.map((p) => (
              <ProductCard key={p.name} p={p} height={130} />
            ))}
          </Box>

          {sample === '1' && <DiscoverSection />}
        </Box>
      </Box>

      {showNav && <BottomNav />}
    </Box>
  )
}
