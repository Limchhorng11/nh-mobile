import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon, type IconName } from '../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Document Preview — opened from the "Preview" action on a Required Documents
// row in the product detail screen. Shows what a document category contains:
// a sample-page mockup, the exact items to bring, and accepted formats.
// Prototype content only.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const VALUE = '#171717'
const MUTED = '#737373'
const BRAND = '#275CB2'

type DocDetail = {
  icon: IconName
  blurb: string
  items: string[]
  formats: string
}

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

const FALLBACK: DocDetail = {
  icon: 'appPolicy',
  blurb: 'Documents required to support your loan application.',
  items: ['Please contact your branch for the full document list.'],
  formats: 'Originals to verify · photo or scan to upload',
}

export default function DocumentPreviewScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const doc = params.get('doc') ?? 'Business Documents'
  const product = params.get('p') ?? 'SME Loan'
  const detail = DOC_DETAILS[doc] ?? FALLBACK

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      {/* Header */}
      <Box sx={{ flexShrink: 0, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ ml: -1, color: HEADING }}>
          <Icon name="chevronLeft" size={26} color={HEADING} />
        </IconButton>
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: 20, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px' }}>{doc}</Typography>
          <Typography noWrap sx={{ fontSize: 12.5, color: MUTED }}>{product}</Typography>
        </Box>
      </Box>

      <Box className="scroll-content" sx={{ flex: 1, px: 3, pt: 1, pb: '44px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Sample document mockup */}
        <Box
          sx={{
            bgcolor: '#fff',
            borderRadius: '18px',
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SamplePage icon={detail.icon} title={doc} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 2 }}>
            <Icon name="info" size={15} color={MUTED} />
            <Typography sx={{ fontSize: 12.5, color: MUTED }}>Sample preview · for reference only</Typography>
          </Box>
        </Box>

        {/* Blurb */}
        <Typography sx={{ fontSize: 14, color: VALUE, lineHeight: 1.6 }}>{detail.blurb}</Typography>

        {/* What to bring */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.88px', color: MUTED, textTransform: 'uppercase' }}>
            What to bring
          </Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            {detail.items.map((item, i) => (
              <Box
                key={item}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.25,
                  px: '14px',
                  py: '13px',
                  borderBottom: i < detail.items.length - 1 ? '1px solid #F0F0F0' : 'none',
                }}
              >
                <Box sx={{ mt: '1px', flexShrink: 0 }}>
                  <Icon name="checkCircle" size={19} color={BRAND} />
                </Box>
                <Typography sx={{ fontSize: 14, color: VALUE, lineHeight: 1.45 }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Accepted formats note */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, bgcolor: '#EEF3FC', borderRadius: '12px', p: '14px' }}>
          <Box sx={{ mt: '1px', flexShrink: 0 }}>
            <Icon name="appPolicy" size={18} color={BRAND} />
          </Box>
          <Typography sx={{ fontSize: 13, color: VALUE, lineHeight: 1.5 }}>{detail.formats}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

// A stylised "document page" placeholder: an icon header over a few faux text
// lines — enough to read as a paper document without showing real data.
function SamplePage({ icon, title }: { icon: IconName; title: string }) {
  return (
    <Box
      sx={{
        width: 168,
        aspectRatio: '3 / 4',
        bgcolor: '#F7F9FC',
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
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            bgcolor: 'rgba(39,92,178,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size={24} color={BRAND} />
        </Box>
      </Box>
      <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: HEADING, textAlign: 'center', lineHeight: 1.3 }} noWrap>
        {title}
      </Typography>
      {/* faux text lines */}
      {[0.92, 0.78, 0.86, 0.64, 0.8, 0.7].map((w, i) => (
        <Box key={i} sx={{ height: 6, borderRadius: '3px', bgcolor: '#E6EBF2', width: `${w * 100}%` }} />
      ))}
    </Box>
  )
}
