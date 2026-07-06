import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import BottomNav from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { HomeTopBar, NewsBanner } from '../components/home/HomeParts'
import { AssetImg, BANNERS, DISCOVER } from '../components/home/media'
import { useFlow } from '../workspace/FlowContext'
import { useT } from '../i18n/LangContext'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'

type Product = { name: string; amount: string; rate: string; img?: string; pin?: string; icon?: import('../components/Icon').IconName }

const PRODUCTS: Product[] = [
  { name: 'Micro Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.microS1, icon: 'sprout' },
  { name: 'Small Biz Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.smallS1, icon: 'store' },
  { name: 'Housing Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.housingS1, icon: 'globe' },
  { name: 'SME Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.smeS1, icon: 'briefcase' },
]

const STAFF_LOAN: Product = { name: 'Staff Loan', amount: 'USD ≤ 10,000', rate: '1.0%', img: BANNERS.staffLoan, icon: 'idCard' }

const MIGRATION: Product = { name: 'Migration Worker Loan', amount: 'USD ≤ 15,000', rate: '1.2%', img: BANNERS.mwlS1, icon: 'plane' }

const POPULAR_PRODUCTS: Product[] = [
  { name: 'Migration Worker Loan', amount: 'USD ≤ 15,000', rate: '0.98%', img: BANNERS.mwlS1, pin: 'Recommended', icon: 'plane' },
  { name: 'Small Biz Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.smallS1, pin: 'Popular', icon: 'store' },
  { name: 'SME Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.smeS1, pin: 'Growth', icon: 'briefcase' },
  { name: 'Housing Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.housingS1, pin: 'Special Offer', icon: 'globe' },
]

const STAFF_LOAN_PRODUCT: Product = {
  name: 'Staff Loan', amount: 'USD ≤ 10,000', rate: '1.0%', img: BANNERS.staffLoan, pin: 'Staff', icon: 'idCard',
}

const PIN_COLORS: Record<string, string> = {
  'Recommended': '#F59E0B',
  'Popular':     '#275CB2',
  'Growth':      '#16A34A',
  'Special Offer': '#EA580C',
  'Staff':       '#1A7A45',
}

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
      <Box sx={{ p: '12px' }}>
        {p.pin && (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', bgcolor: '#F5F6F8', borderRadius: '6px', px: '7px', py: '3px', mb: '6px' }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: PIN_COLORS[p.pin] ?? '#275CB2', flexShrink: 0 }} />
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#0B0F1A', letterSpacing: '0.1px' }}>{p.pin}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {p.icon && (
            <Box sx={{ width: 26, height: 26, borderRadius: '8px', bgcolor: '#EEF3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={p.icon} size={14} color="#275CB2" strokeWidth={1.25} />
            </Box>
          )}
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING }} noWrap>{p.name}</Typography>
        </Box>
        <Box sx={{ display: 'inline-flex', mt: 0.75, px: 1.25, py: '4px', bgcolor: '#ECECEC', borderRadius: '8px' }}>
          <Typography sx={{ fontSize: 11, color: '#000' }}>{p.amount}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

// Exported product data + card so the dedicated All Loan screen can reuse them.
export { ProductCard, PRODUCTS, STAFF_LOAN, MIGRATION }
export type { Product }

// ─── Discover — horizontal carousel of shortcuts + news under "All Loan" ─────
type NewsItem = { tag: string; title: string; body: string; img?: string; detail?: string }

const DISCOVER_NEWS: NewsItem[] = [
  {
    tag: 'NEWS',
    title: 'Khmer New Year promotion',
    body: 'Lower micro-loan rates this season — apply by mid-April.',
    img: BANNERS.bannerKhmerNewYear,
    detail:
      'Celebrate Khmer New Year with reduced micro-loan rates across all branches. Apply before mid-April to lock in the seasonal rate and enjoy faster approval with fewer documents. Talk to our team to see how much you can save.',
  },
  {
    tag: 'NEWS',
    title: 'Migrant worker support',
    body: 'Special rates for overseas workers and their families.',
    img: BANNERS.bannerSupport,
    detail:
      'NongHyup Finance offers dedicated loan packages for migrant workers and their families, with flexible repayment aligned to overseas income. Get help with guarantor setup and remittance-friendly schedules.',
  },
  {
    tag: 'TIPS',
    title: 'Build your credit score',
    body: 'Simple habits that help you qualify for a bigger loan.',
    img: BANNERS.bannerScore,
    detail:
      'Paying on time, keeping balances low, and maintaining a steady income are the habits that build a strong credit profile. A better score unlocks larger limits and lower rates on your next loan.',
  },
]

const DISCOVER_CARD_W = 152
const DISCOVER_CARD_H = 218

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
      {/* Bottom scrim so the white title + arrow stay legible over the photo. */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)' }} />
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '12px' }}>
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
      <Box sx={{ height: 106, flexShrink: 0 }}>
        <AssetImg
          src={n.img}
          alt={n.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          fallback={<Box sx={{ width: '100%', height: '100%', bgcolor: '#E7ECF2' }} />}
        />
      </Box>
      <Box sx={{ p: '12px', display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, minHeight: 0 }}>
        <Box sx={{ alignSelf: 'flex-start', bgcolor: '#FBF0CE', borderRadius: '6px', px: 0.75, py: '2px' }}>
          <Typography sx={{ fontSize: 9, fontWeight: 800, color: '#C79200', letterSpacing: '0.5px' }}>{n.tag}</Typography>
        </Box>
        <Typography
          sx={{ fontSize: 13, fontWeight: 700, color: HEADING, lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {n.title}
        </Typography>
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
          mx: -3,
          px: 3,
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
          bgcolor: '#fff',
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
        {/* Close — floats top-right; the title sits below it, full width */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{ width: 40, height: 40, bgcolor: '#fff', boxShadow: '0 2px 8px rgba(11,15,26,0.12)', '&:hover': { bgcolor: '#fff' } }}
          >
            <Icon name="close" size={22} color="#6B7280" />
          </IconButton>
        </Box>

        <Box sx={{ overflowY: 'auto', px: 3, pt: '56px', pb: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Headline — left-aligned, full width, below the close button */}
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: HEADING, lineHeight: 1.15, letterSpacing: '-0.5px' }}>
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
        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1.5, px: 3, pt: 1, pb: '54px' }}>
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
        px: 3,
        pt: 4,
        pb: 2,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: 'transparent',
      }}
    >
      <Box
        component="img"
        src="/assets/brand/header_logo.svg"
        alt="NongHyup Finance (Cambodia) Plc"
        role="button"
        aria-label="Settings"
        onClick={() => navigate('/sign-up')}
        sx={{ height: 26, width: 'auto', display: 'block', flex: 1, minWidth: 0, objectFit: 'contain', objectPosition: 'left', cursor: 'pointer', '&:active': { opacity: 0.6 } }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <IconButton size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Messages">
          <Box component="img" src="/assets/brand/ico_chat.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
        </IconButton>
        <IconButton onClick={() => navigate('/notifications')} size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Notifications">
          <Box component="img" src="/assets/brand/ico_bell.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default function ProductsScreen() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const t = useT()

  // Signed-in flows (Applicant / Borrower) see the personalized greeting
  // header; visitors keep the brand logo bar.
  const greeting = flow !== 'Visitor'

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {greeting ? <HomeTopBar /> : <ProductsTopBar />}
        <Box sx={{ px: 3, pb: 5, display: 'flex', flexDirection: 'column', gap: '24px', mt: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: MUTED, letterSpacing: '0.6px', mb: 1.5 }}>
              NEWS &amp; PROMOTIONS
            </Typography>
            <NewsBanner />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: MUTED, letterSpacing: '0.6px' }}>
                {t('products').toUpperCase()}
              </Typography>
              <Box
                onClick={() => navigate('/all-loan')}
                role="button"
                sx={{ cursor: 'pointer', '&:active': { opacity: 0.6 } }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#275CB2' }}>{t('seeAll')}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {(flow === 'Staff' ? [STAFF_LOAN_PRODUCT, ...POPULAR_PRODUCTS].slice(0, 4) : POPULAR_PRODUCTS).map((p) => (
                <ProductCard key={p.name} p={p} height={152} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <BottomNav />
    </Box>
  )
}
