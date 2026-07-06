import { Fragment, ReactNode, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon, type IconName } from '../components/Icon'
import { Flag } from '../components/Flag'
import { AssetImg, BANNERS } from '../components/home/media'
import { useFlow } from '../workspace/FlowContext'
import { useT, useTd } from '../i18n/LangContext'
import { BottomSheet } from './mwl/MwlParts'
import CallSheet from '../components/CallSheet'

// ─────────────────────────────────────────────────────────────────────────────
// Product (loan) detail — opened by tapping a loan card on the Products screen.
// Mirrors the Figma "Product detail" frame (node 1213:9421).
// ─────────────────────────────────────────────────────────────────────────────
const LABEL = '#737373'
const VALUE = '#171717'
const BRAND = '#275CB2'

// Map a product name → its hero banner. Uses the same Sample-1 assets shown on
// the Products tab so the detail hero matches the card thumbnail.
const HERO_BY_NAME: Record<string, string> = {
  'SME Loan': BANNERS.smeS1,
  'Micro Loan': BANNERS.microS1,
  'Small Biz Loan': BANNERS.smallS1,
  'Housing Loan': BANNERS.housingS1,
  'Migration Worker Loan': BANNERS.mwlS1,
  'Staff Loan': BANNERS.staffLoan,
}

const USES = [
  'Daily business expenses',
  'Farming inputs & equipment',
  'Stock & inventory purchases',
  'Small repairs and upgrades',
]

const KEY_FEATURES: [string, string][] = [
  ['Loan size', 'Up to $100,000'],
  ['Interest', '1.2% (negotiable)'],
  ['Loan term', 'Up to 120 months'],
  ['Repayment', 'Periodic principal + interest'],
]

// Per-product glance data — interest rate matches PRODUCT_RATE in CalculatorScreen.
const PRODUCT_GLANCE: Record<string, [string, string][]> = {
  'Micro Loan': [
    ['Interest Rate', '1.20% / month'],
    ['Loan Amount', 'Up to $3,000'],
    ['Loan Term', 'Up to 36 months'],
    ['Repayment', 'Periodic principal + interest'],
  ],
  'Small Biz Loan': [
    ['Interest Rate', 'From 0.90% / month'],
    ['Loan Amount', 'USD 500 – USD 30,000'],
    ['Tenure', '6 – 120 months'],
    ['Purpose', 'Expand your small business'],
  ],
  'SME Loan': [
    ['Interest Rate', 'From 0.75% / month'],
    ['Loan Amount', 'USD 30,000 – USD 100,000'],
    ['Tenure', '12 – 180 months'],
    ['Purpose', 'Expands your business'],
  ],
  'Housing Loan': [
    ['Interest Rate', 'From 0.67% / month'],
    ['Loan Fee', '1.50% of approved amount'],
    ['CBC Fee', 'Included in assessment'],
    ['Loan Amount', 'USD 20,000 – USD 300,000'],
    ['Tenure', '12 – 240 months'],
    ['Purpose', 'Buy a dream house'],
  ],
}

// Staff Loan has its own headline terms.
const STAFF_FEATURES: [string, string][] = [
  ['Loan size', 'Up to 2× salary'],
  ['Interest', '1.0%'],
  ['Repayment', 'Constant'],
]

const STAFF_GLANCE: [string, string][] = [
  ['Interest Rate', 'From 0.67% / month'],
  ['Loan Amount', '2 time of the salary'],
  ['Tenure', '6 – 24 months'],
  ['Purpose', 'Personal needs'],
]

const STAFF_KEY_FEATURES: string[] = [
  'Instant decision — funded in seconds',
  'Repaid automatically by salary deduction',
  'No collateral or guarantor required',
  'Settle early in-app at any time',
]

const STAFF_ELIGIBILITY: string[] = [
  'Current NH Finance employee',
  'Passed probation period',
  'Active NH payroll account',
  'No active default on existing loans',
]

// Migration Worker Loan — at-a-glance summary (compact).
const MWL_GLANCE: [string, string][] = [
  ['Interest Rate', 'From 0.98% / month'],
  ['Loan Amount', 'USD 500 – USD 15,000'],
  ['Tenure', '36 months'],
  ['Purpose', 'Overseas job expenses'],
]

// Migration Worker Loan — full key-features list (ordered).
const MWL_FEATURES: string[] = [
  '80% digital application',
  'Decision within 2 business days',
  'SMS guarantor consent',
  'Covers Korea, Japan, Singapore, and Israel',
]

// Migration Worker Loan is unsecured — no collateral required.
const MWL_ELIGIBILITY: string[] = [
  'Cambodian national aged 18–45',
  'Valid overseas job',
  'Cambodia-based guarantor required',
  'Acceptable CBC report',
]

const MWL_USES = [
  'Visa application & processing fees',
  'Flight tickets & travel costs',
  'Medical checkup & agency fees',
  'Pre-departure training & equipment',
]

const MWL_STORY_FEATURES = [
  { emoji: '✈️', title: 'Before you fly', desc: 'Cover visa, flights, medical checks and agency fees — no collateral needed.' },
  { emoji: '💰', title: 'While you work', desc: 'Repay gradually from your overseas salary, on a schedule built around your contract.' },
  { emoji: '🏠', title: 'Family at home', desc: 'Keep loved ones supported the whole time you are away.' },
]

const MWL_DESTINATIONS = [
  { flag: 'kr' as const, name: 'Korea', sub: 'EPS · most active' },
  { flag: 'jp' as const, name: 'Japan', sub: 'SSW / Intern' },
  { flag: 'sg' as const, name: 'Singapore', sub: 'Work Permit' },
]

const ELIGIBILITY: [string, string][] = [
  ['Age', '18 – 65 years old'],
  ['Residence', 'Permanent address in NH MFI operating area'],
  ['Income', 'Stable, verifiable source'],
  ['Collateral', 'Hard or soft title'],
]

const DOCUMENTS = [
  'Business Documents',
  'Financial information',
  'Collateral documents',
  'Owner identification',
]

// Per-product key features (checklist). Products not listed fall back to WHAT IT'S FOR.
const PRODUCT_KEY_FEATURES: Record<string, string[]> = {
  'Small Biz Loan': [
    'Fast review — decision within 3 business days',
    'Flexible repayment: monthly or irregular',
    'Collateral required',
    'Co-borrower required',
  ],
  'SME Loan': [
    'Larger loan amounts for established businesses',
    'Tailored repayment schedule',
    'Dedicated credit officer assigned',
    'Business financial analysis support',
  ],
  'Housing Loan': [
    'Lowest rate in the NH product range',
    'Long tenure up to 20 years',
    'Interest-only option up to 80 months',
    'Secured against property collateral',
    'Property valuation assistance provided',
  ],
}

// Per-product eligibility (checklist). Products not listed fall back to SpecCard ELIGIBILITY.
const PRODUCT_ELIGIBILITY_LIST: Record<string, string[]> = {
  'Small Biz Loan': [
    'Cambodian national or registered business',
    'Minimum 6 months of trading history',
    'Valid business registration for amounts above USD 5,000',
    'No active default on existing loans',
  ],
  'SME Loan': [
    'Fast review — decision within 3 business days',
    'Flexible repayment: monthly or irregular',
    'Collateral required',
    'Co-borrower required',
  ],
  'Housing Loan': [
    'Cambodian national aged 21–60',
    'Stable income — employed or self-employed',
    'Hard title or LMAP soft title accepted as collateral',
    'Debt-to-income ratio below 50%',
  ],
}

const GENERAL_FAQ: { q: string; a: string }[] = [
  { q: 'How do I apply?', a: 'You can apply online or visit any NongHyup branch near you.' },
  { q: 'How long does approval take?', a: 'Most applications are reviewed within 2–5 business days.' },
  { q: 'What is the interest rate?', a: 'Rates start from 1.2% per month, subject to assessment.' },
  { q: 'Can I repay early?', a: 'Yes. Early repayment is allowed with no penalty fee.' },
  { q: 'Do I need collateral?', a: 'Collateral requirements depend on the loan type and amount.' },
  { q: 'What is the maximum loan amount?', a: 'Up to USD 100,000 depending on your income and collateral.' },
  { q: 'Can I apply for multiple loans?', a: 'Yes, subject to credit assessment and repayment capacity.' },
  { q: 'How will I receive the funds?', a: 'Funds are disbursed to your registered bank account.' },
  { q: 'Can I apply again after full repayment?', a: 'Yes, you are welcome to reapply after your loan is fully settled.' },
]

const MWL_DOCUMENTS = [
  'Personal Identification',
  'Employment Contract',
  'Medical Certificate',
  'Agency Agreement',
]

const MWL_FAQ: { q: string; a: string }[] = [
  { q: 'Can I apply before my contract?', a: 'Yes. Conditional approval may apply.' },
  { q: 'Which countries are supported?', a: 'Korea, Japan, Singapore, and Israel.' },
  { q: 'How fast is approval?', a: 'Up to 2 business days.' },
  { q: 'What documents do I need?', a: 'ID and application documents.' },
  { q: 'Do I need a guarantor?', a: 'If required by the product.' },
  { q: 'When will I receive the loan?', a: 'After approval and required conditions are met.' },
  { q: 'Can I borrow before my visa?', a: 'Yes, if eligible.' },
  { q: 'Can I repay early?', a: 'Yes.' },
  { q: 'Can I apply again?', a: 'Yes, subject to reassessment.' },
]

// Per-document preview content shown in the bottom sheet.
type DocDetail = { icon: IconName; blurb: string; items: string[]; formats: string }
const DOC_DETAILS: Record<string, DocDetail> = {
  'Business Documents': {
    icon: 'briefcase',
    blurb: 'Proof that your business is registered and operating.',
    items: [
      'Business registration / patent certificate',
      'Trade licence or commercial permit',
      'Tax registration (VAT/TIN) if available',
      'Business premises lease or ownership proof',
    ],
    formats: 'Originals to verify · clear photo or scan to upload',
  },
  'Financial information': {
    icon: 'banknote',
    blurb: 'Records that show your income and repayment capacity.',
    items: [
      'Bank statements — last 6 months',
      'Sales / revenue records or invoices',
      'Existing loan or debt statements',
      'Profit & loss summary if available',
    ],
    formats: 'PDF or photo · last 6 months required',
  },
  'Collateral documents': {
    icon: 'home',
    blurb: 'Ownership proof for the asset offered as security.',
    items: [
      'Hard or soft land/property title',
      'Vehicle registration card (if applicable)',
      'Recent property valuation if available',
      'Proof there are no existing liens',
    ],
    formats: 'Originals required at the branch for verification',
  },
  'Owner identification': {
    icon: 'idCard',
    blurb: 'Identity documents for the business owner and guarantor.',
    items: [
      'National ID card or valid passport',
      'Family book or residence certificate',
      'Recent passport-size photo',
      "Guarantor's ID (if a guarantor is required)",
    ],
    formats: 'Originals to verify · must be valid and unexpired',
  },
}
const MWL_DOC_DETAILS: Record<string, DocDetail> = {
  'Personal Identification': {
    icon: 'idCard',
    blurb: 'Valid identity documents for the applicant.',
    items: [
      'National ID card or valid passport',
      'Family book or residence certificate',
      'Recent passport-size photo',
      'Birth certificate (if required)',
    ],
    formats: 'Originals to verify · must be valid and unexpired',
  },
  'Employment Contract': {
    icon: 'briefcase',
    blurb: 'Proof of overseas employment or job offer.',
    items: [
      'Signed employment contract or offer letter',
      'Work permit or visa approval letter',
      'Employer contact details and address',
      'Contract duration and salary details',
    ],
    formats: 'Originals preferred · certified translation if not in English/Khmer',
  },
  'Medical Certificate': {
    icon: 'appPolicy',
    blurb: 'Medical fitness certificate required for overseas work.',
    items: [
      'Medical examination certificate from approved clinic',
      'Health clearance from destination country (if required)',
      'Vaccination records (if applicable)',
    ],
    formats: 'Original certificate · issued within 3 months',
  },
  'Agency Agreement': {
    icon: 'banknote',
    blurb: 'Agreement with the licensed recruitment agency.',
    items: [
      'Signed recruitment agency agreement',
      'Agency licence and registration number',
      'Fee schedule and service breakdown',
      'Contact details of agency representative',
    ],
    formats: 'Original or certified copy',
  },
}

const DOC_FALLBACK: DocDetail = {
  icon: 'appPolicy',
  blurb: 'Documents required to support your loan application.',
  items: ['Please contact your branch for the full document list.'],
  formats: 'Originals to verify · photo or scan to upload',
}

export default function ProductDetailScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { flow } = useFlow()
  const name = params.get('p') ?? 'SME Loan'
  const hero = HERO_BY_NAME[name] ?? BANNERS.smeS1
  const isStaff = name === 'Staff Loan'
  const isMwl = name === 'Migration Worker Loan'
  const features = isStaff ? STAFF_FEATURES : isMwl ? MWL_FEATURES : KEY_FEATURES
  // Apply flow per product: Migration Worker Loan → MWL (multi-step); Staff Loan
  // → the single-screen staff form; everything else → the Non-MWL flow.
  const applyPath =
    name === 'Migration Worker Loan'
      ? '/mwl-about'
      : name === 'Staff Loan'
        ? '/staff-loan'
        : '/nonmwl-about?product=' + encodeURIComponent(name)
  // Visitors must sign up first; the apply destination is carried via `?next=`
  // so they land on the application after completing sign-up.
  // Staff who have already registered go straight to the apply path (PIN gate intercepts).
  const staffRegistered = flow === 'Staff' && localStorage.getItem('weloan-staff-registered') === 'true'
  const onApply = () => {
    navigate((flow === 'Visitor' || (flow === 'Staff' && !staffRegistered)) ? '/sign-up?next=' + encodeURIComponent(applyPath) : applyPath)
  }

  // Compact header fades in once the hero image has scrolled mostly out of view.
  const t = useT()
  const td = useTd()
  const [scrolled, setScrolled] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showAllFaq, setShowAllFaq] = useState(false)

  // Chat opens the support conversation (visitors sign up first).
  const onChat = () =>
    navigate(flow === 'Visitor' ? '/sign-up?next=' + encodeURIComponent('/chat') : '/chat')

  return (
    <Box className="screen-enter" sx={{ position: 'relative', height: 'calc(100% + 34px)', mt: '-34px', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>

      {/* ── Compact sticky header (appears on scroll) ─────────────────── */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          height: 60,
          px: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #ECECEC',
          opacity: scrolled ? 1 : 0,
          transform: scrolled ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
          pointerEvents: scrolled ? 'auto' : 'none',
        }}
      >
        <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ color: '#171717' }}>
          <Icon name="chevronLeft" size={24} color="#171717" />
        </IconButton>
        <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 800, color: '#171717', letterSpacing: '-0.3px' }} noWrap>
          {td(name)}
        </Typography>
        <IconButton onClick={onChat} aria-label="Chat" sx={{ color: '#171717' }}>
          <Icon name="message" size={22} color="#171717" />
        </IconButton>
        <IconButton onClick={() => setCallOpen(true)} aria-label="Call" sx={{ color: '#171717' }}>
          <Icon name="phone" size={22} color="#171717" />
        </IconButton>
      </Box>

      <Box
        className="scroll-content"
        sx={{ flex: 1 }}
        onScroll={(e) => setScrolled((e.target as HTMLDivElement).scrollTop > 220)}
      >
        {/* ── Hero header ─────────────────────────────────────────────── */}
        <Box sx={{ position: 'relative', height: isMwl ? 320 : 300, overflow: 'hidden' }}>
          <AssetImg
            src={hero}
            alt={name}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            fallback={<Box sx={{ position: 'absolute', inset: 0, bgcolor: '#4279B3' }} />}
          />
          {/* bottom gradient */}
          <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: isMwl ? 180 : 120, background: 'linear-gradient(to bottom, rgba(30,58,120,0) 0%, #1E3A78 70%)' }} />

          {/* Back button */}
          <Box onClick={() => navigate(-1)} role="button" aria-label="Back" sx={{ position: 'absolute', top: 16, left: 16, width: 44, height: 44, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="chevronLeft" size={24} color="#fff" />
          </Box>

          <Box sx={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', gap: 1 }}>
            <HeroPill icon="message" label={t('chat')} onClick={onChat} />
            <HeroPill icon="phone" label={t('call')} onClick={() => setCallOpen(true)} />
          </Box>
        </Box>

        {/* ── Body ────────────────────────────────────────────────────── */}
        {isMwl ? (
          /* ── MWL body in Non-MWL section style ─────────────────────── */
          <Box sx={{ px: 3, py: '16px', display: 'flex', flexDirection: 'column', gap: '30px' }}>


            {/* Loan at a glance */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <SectionLabel>{t('loanAtGlance')}</SectionLabel>
              <SpecCard rows={MWL_GLANCE} />
              {/* Calculate / Request Consult */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <ToolButton icon="calculator" label={t('calculate')} onClick={() => navigate('/calculator?product=' + encodeURIComponent('Migration Worker Loan'))} sx={{ flex: 1 }} />
                <ToolButton icon="clock" label={t('requestConsult')} onClick={() => navigate(flow === 'Visitor' ? '/sign-up?next=' + encodeURIComponent('/request-consult') : '/request-consult')} sx={{ flex: 1 }} />
              </Box>
            </Box>

            {/* Key features */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <SectionLabel>{t('keyFeatures')}</SectionLabel>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                {MWL_FEATURES.map((f) => (
                  <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BlueCheck />
                    <Typography sx={{ fontSize: 14, color: '#525252' }}>{td(f)}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Eligibility */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <SectionLabel>{t('eligibility')}</SectionLabel>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                {MWL_ELIGIBILITY.map((e) => (
                  <Box key={e} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BlueCheck />
                    <Typography sx={{ fontSize: 14, color: '#525252' }}>{td(e)}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* FAQ */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <SectionLabel>{t('faqSection')}</SectionLabel>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden' }}>
                {MWL_FAQ.map((item, i, arr) => (
                  <Box key={i} sx={{ borderBottom: i < arr.length - 1 ? '1px solid #F0F2F5' : 'none' }}>
                    <Box
                      role="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: '16px', py: '13px', cursor: 'pointer', '&:active': { bgcolor: '#F8F9FB' } }}
                    >
                      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#0B0F1A', flex: 1 }}>{td(item.q)}</Typography>
                      <Icon name={openFaq === i ? 'chevronUp' : 'chevronDown'} size={15} color="#8A94A6" />
                    </Box>
                    {openFaq === i && (
                      <Box sx={{ px: '16px', pb: '13px' }}>
                        <Typography sx={{ fontSize: 13, color: '#8A94A6', lineHeight: 1.5 }}>{td(item.a)}</Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        ) : (
          /* ── Standard loan body ─────────────────────────────────────── */
          <Box sx={{ px: 3, py: '16px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Loan at a glance */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <SectionLabel>{t('loanAtGlance')}</SectionLabel>
              <SpecCard rows={isStaff ? STAFF_GLANCE : (PRODUCT_GLANCE[name] ?? KEY_FEATURES)} />
              {/* Calculate / Request Consult */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <ToolButton
                  icon="calculator"
                  label={t('calculate')}
                  onClick={() =>
                    navigate(
                      '/calculator?product=' +
                        encodeURIComponent(
                          name === 'SME Loan'
                            ? 'Small & Medium Enterprise Loan'
                            : name,
                        ),
                    )
                  }
                  sx={{ flex: 1 }}
                />
                <ToolButton
                  icon="clock"
                  label={t('requestConsult')}
                  onClick={() => navigate(flow === 'Visitor' ? '/sign-up?next=' + encodeURIComponent('/request-consult') : '/request-consult')}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>

            {/* Key features (Staff / per-product checklist) / What it's for (fallback) */}
            {(() => {
              const productFeatures = isStaff ? STAFF_KEY_FEATURES : PRODUCT_KEY_FEATURES[name]
              if (productFeatures) {
                return (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    <SectionLabel>{t('keyFeatures')}</SectionLabel>
                    <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                      {productFeatures.map((f) => (
                        <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BlueCheck />
                          <Typography sx={{ fontSize: 14, color: '#525252' }}>{td(f)}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )
              }
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  <SectionLabel>{t('whatItsFor')}</SectionLabel>
                  <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                    {USES.map((u) => (
                      <Box key={u} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckBadge />
                        <Typography sx={{ fontSize: 14, color: '#525252' }}>{td(u)}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )
            })()}

            {/* Eligibility */}
            {(() => {
              const eligibilityList = isStaff ? STAFF_ELIGIBILITY : PRODUCT_ELIGIBILITY_LIST[name]
              if (eligibilityList) {
                return (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    <SectionLabel>{t('eligibility')}</SectionLabel>
                    <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                      {eligibilityList.map((e) => (
                        <Box key={e} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BlueCheck />
                          <Typography sx={{ fontSize: 14, color: '#525252' }}>{td(e)}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )
              }
              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  <SectionLabel>{t('eligibility')}</SectionLabel>
                  <SpecCard rows={ELIGIBILITY} />
                </Box>
              )
            })()}

            {/* FAQ */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <SectionLabel>{t('faqSection')}</SectionLabel>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden' }}>
                {GENERAL_FAQ.map((item, i, arr) => (
                  <Box key={i} sx={{ borderBottom: i < arr.length - 1 ? '1px solid #F0F2F5' : 'none' }}>
                    <Box role="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: '16px', py: '13px', cursor: 'pointer', '&:active': { bgcolor: '#F8F9FB' } }}>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#0B0F1A', flex: 1 }}>{td(item.q)}</Typography>
                      <Icon name={openFaq === i ? 'chevronUp' : 'chevronDown'} size={15} color="#8A94A6" />
                    </Box>
                    {openFaq === i && (
                      <Box sx={{ px: '16px', pb: '13px' }}>
                        <Typography sx={{ fontSize: 13, color: '#8A94A6', lineHeight: 1.5 }}>{td(item.a)}</Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Footer CTA ─────────────────────────────────────────────────── */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 1, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<Icon name="arrowRight" size={18} color="#fff" />}
          onClick={onApply}
          sx={{ minHeight: 48, borderRadius: '8px', fontSize: 16, fontWeight: 600, bgcolor: BRAND, '&:hover': { bgcolor: '#1F4F9E' } }}
        >
          {isMwl ? t('applyNow') : t('applyThisLoan')}
        </Button>
      </Box>

      {/* ── Call sheet ─────────────────────────────────────────────────── */}
      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />

      {/* ── Required-document preview sheet ────────────────────────────── */}
      <DocPreviewSheet doc={previewDoc} onClose={() => setPreviewDoc(null)} />

    </Box>
  )
}

// ─── Call sheet — shows the hotline; tapping the number places the call ──────
// ─── Document preview sheet — opened from a Required Documents "Preview" link ─
// Bottom sheet (same pattern as the apply-loan sample sheet) that shows what a
// document category contains: a sample-page mockup, the items to bring and the
// accepted formats.
function DocPreviewSheet({ doc, onClose }: { doc: string | null; onClose: () => void }) {
  const t = useT()
  const detail = (doc && (DOC_DETAILS[doc] ?? MWL_DOC_DETAILS[doc])) || DOC_FALLBACK
  return (
    <BottomSheet open={doc !== null} onClose={onClose}>
      <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.4px' }}>
        {doc ?? 'Document'}
      </Typography>

      {/* Sample document mockup */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', py: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25 }}>
        <SamplePage icon={detail.icon} title={doc ?? 'Document'} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Icon name="info" size={15} color={LABEL} />
          <Typography sx={{ fontSize: 12.5, color: LABEL }}>{t('samplePreviewNote')}</Typography>
        </Box>
      </Box>

      {/* Close */}
      <Button
        variant="contained"
        fullWidth
        onClick={onClose}
        sx={{ height: 48, borderRadius: '12px', fontSize: 15, fontWeight: 700, bgcolor: BRAND, '&:hover': { bgcolor: '#1F4F9E' } }}
      >
        {t('gotIt')}
      </Button>
    </BottomSheet>
  )
}

// A stylised "document page" placeholder: an icon header over faux text lines.
function SamplePage({ icon, title }: { icon: IconName; title: string }) {
  return (
    <Box
      sx={{
        width: 168,
        aspectRatio: '3 / 4',
        bgcolor: '#fff',
        border: '1px solid #E6EBF2',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(11,15,26,0.08)',
        px: 2,
        pt: 2.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(39,92,178,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={24} color={BRAND} />
        </Box>
      </Box>
      <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: '#0B0F1A', textAlign: 'center', lineHeight: 1.3 }} noWrap>
        {title}
      </Typography>
      {[0.92, 0.78, 0.86, 0.64, 0.8, 0.7].map((w, i) => (
        <Box key={i} sx={{ height: 6, borderRadius: '3px', bgcolor: '#E6EBF2', width: `${w * 100}%` }} />
      ))}
    </Box>
  )
}

function HeroPill({ icon, label, onClick }: { icon: 'message' | 'phone'; label: string; onClick?: () => void }) {
  return (
    <Box
      role="button"
      onClick={onClick}
      sx={{
        height: 52,
        px: '16px',
        borderRadius: '8px',
        bgcolor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        cursor: 'pointer',
      }}
    >
      <Icon name={icon} size={22} color="#fff" />
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{label}</Typography>
    </Box>
  )
}

function ToolButton({
  icon,
  label,
  onClick,
  sx,
}: {
  icon: 'calculator' | 'clock'
  label: string
  onClick?: () => void
  sx?: object
}) {
  return (
    <Box
      onClick={onClick}
      role="button"
      sx={{
        minHeight: 40,
        bgcolor: '#fff',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        cursor: 'pointer',
        ...sx,
      }}
    >
      <Icon name={icon} size={16} color="#171717" />
      <Typography sx={{ fontSize: 14, fontWeight: 500, color: VALUE }}>{label}</Typography>
    </Box>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.88px', color: LABEL, textTransform: 'uppercase' }}>
      {children}
    </Typography>
  )
}

function CheckBadge() {
  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: '9px',
        bgcolor: '#EBF6EC',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box component="svg" viewBox="0 0 12 12" sx={{ width: 10, height: 10 }}>
        <path d="M2 6.4 L4.7 9 L10 3" fill="none" stroke="#16A34A" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Box>
    </Box>
  )
}

function BlueCheck() {
  return (
    <Box component="svg" viewBox="0 0 12 12" sx={{ width: 14, height: 14, flexShrink: 0 }}>
      <path d="M2 6.4 L4.7 9 L10 3" fill="none" stroke="#275CB2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Box>
  )
}

function SpecCard({ rows }: { rows: [string, string][] }) {
  const td = useTd()
  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', px: '13px' }}>
      {rows.map(([k, v], i) => (
        <Box
          key={k}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            py: '14px',
            borderTop: i > 0 ? '1px solid #F5F5F5' : 'none',
          }}
        >
          <Typography sx={{ fontSize: 14, color: LABEL, flexShrink: 0 }}>{td(k)}</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: VALUE, textAlign: 'right' }}>{td(v)}</Typography>
        </Box>
      ))}
    </Box>
  )
}
