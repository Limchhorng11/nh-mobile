import { ReactNode, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon, type IconName } from '../components/Icon'
import { AssetImg, BANNERS } from '../components/home/media'
import { useFlow } from '../workspace/FlowContext'
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

// Staff Loan has its own headline terms.
const STAFF_FEATURES: [string, string][] = [
  ['Loan size', 'Up to 2× salary'],
  ['Interest', '1.0%'],
  ['Repayment', 'Constant'],
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
  const features = isStaff ? STAFF_FEATURES : KEY_FEATURES
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
  const onApply = () =>
    navigate(flow === 'Visitor' ? '/sign-up?next=' + encodeURIComponent(applyPath) : applyPath)

  // Compact header fades in once the hero image has scrolled mostly out of view.
  const [scrolled, setScrolled] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  // Required-documents preview: holds the doc name whose sheet is open.
  const [previewDoc, setPreviewDoc] = useState<string | null>(null)

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
          {name}
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
        <Box sx={{ position: 'relative', height: 300, overflow: 'hidden' }}>
          <AssetImg
            src={hero}
            alt={name}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            fallback={<Box sx={{ position: 'absolute', inset: 0, bgcolor: '#4279B3' }} />}
          />
          {/* bottom gradient so the action pills stay legible */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 120,
              background: 'linear-gradient(to bottom, rgba(66,121,179,0) 0%, #4279B3 60%)',
            }}
          />

          {/* Back button */}
          <Box
            onClick={() => navigate(-1)}
            role="button"
            aria-label="Back"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon name="chevronLeft" size={24} color="#fff" />
          </Box>

          {/* Chat / Call pills */}
          <Box sx={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', gap: 1 }}>
            <HeroPill icon="message" label="Chat" onClick={onChat} />
            <HeroPill icon="phone" label="Call" onClick={() => setCallOpen(true)} />
          </Box>
        </Box>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <Box sx={{ px: 3, py: '16px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* What it's for */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            <SectionLabel>What it's for</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {USES.map((u) => (
                <Box key={u} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckBadge />
                  <Typography sx={{ fontSize: 14, color: '#525252' }}>{u}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Calculate / Request Consult */}
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <ToolButton
              icon="calculator"
              label="Calculate"
              onClick={() =>
                navigate(
                  '/calculator?product=' +
                    encodeURIComponent(
                      name === 'SME Loan'
                        ? 'Small & Medium Enterprise Loan'
                        : name === 'Migration Worker Loan'
                          ? 'Migrant Worker Loan'
                          : name,
                    ),
                )
              }
              sx={{ width: 132, flexShrink: 0 }}
            />
            <ToolButton
              icon="clock"
              label="Request Consult"
              onClick={() => navigate(flow === 'Visitor' ? '/sign-up?next=' + encodeURIComponent('/request-consult') : '/request-consult')}
              sx={{ flex: 1 }}
            />
          </Box>

          {/* Spec cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <SectionLabel>Key features</SectionLabel>
              <SpecCard rows={features} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <SectionLabel>Eligibility</SectionLabel>
              <SpecCard rows={ELIGIBILITY} />
            </Box>
          </Box>

          {/* Required documents — hidden for the Staff Loan */}
          {!isStaff && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <SectionLabel>Required Documents</SectionLabel>
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
              {DOCUMENTS.map((d, i) => (
                <Box
                  key={d}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: '14px',
                    py: '12px',
                    borderBottom: i < DOCUMENTS.length - 1 ? '1px solid #F0F0F0' : 'none',
                  }}
                >
                  <Icon name="appPolicy" size={22} color="#171717" />
                  <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 600, color: VALUE }}>{d}</Typography>
                  <Box
                    role="button"
                    aria-label={`Preview ${d}`}
                    onClick={() => setPreviewDoc(d)}
                    sx={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: 32,
                      px: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      '&:active': { bgcolor: 'rgba(39,92,178,0.08)' },
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: BRAND }}>Preview</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          )}
        </Box>
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
          Apply this loan
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
  const detail = (doc && DOC_DETAILS[doc]) || DOC_FALLBACK
  return (
    <BottomSheet open={doc !== null} onClose={onClose}>
      <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.4px' }}>
        {doc ?? 'Document'}
      </Typography>

      {/* Sample document mockup */}
      <Box sx={{ bgcolor: '#F5F5F5', borderRadius: '16px', py: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25 }}>
        <SamplePage icon={detail.icon} title={doc ?? 'Document'} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Icon name="info" size={15} color={LABEL} />
          <Typography sx={{ fontSize: 12.5, color: LABEL }}>Sample preview · for reference only</Typography>
        </Box>
      </Box>

      {/* Close */}
      <Button
        variant="contained"
        fullWidth
        onClick={onClose}
        sx={{ height: 48, borderRadius: '12px', fontSize: 15, fontWeight: 700, bgcolor: BRAND, '&:hover': { bgcolor: '#1F4F9E' } }}
      >
        Got it
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

function SpecCard({ rows }: { rows: [string, string][] }) {
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '12px', px: '13px' }}>
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
          <Typography sx={{ fontSize: 14, color: LABEL, flexShrink: 0 }}>{k}</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: VALUE, textAlign: 'right' }}>{v}</Typography>
        </Box>
      ))}
    </Box>
  )
}
