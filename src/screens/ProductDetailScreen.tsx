import { ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../components/Icon'
import { AssetImg, BANNERS } from '../components/home/media'

// ─────────────────────────────────────────────────────────────────────────────
// Product (loan) detail — opened by tapping a loan card on the Products screen.
// Mirrors the Figma "Product detail" frame (node 1213:9421).
// ─────────────────────────────────────────────────────────────────────────────
const LABEL = '#737373'
const VALUE = '#171717'
const BRAND = '#275CB2'

// Map a product name → its hero banner (falls back to the SME banner).
const HERO_BY_NAME: Record<string, string> = {
  'SME Loan': BANNERS.enterprise,
  'Micro Loan': BANNERS.micro,
  'Small Biz Loan': BANNERS.smallBusiness,
  'Housing Loan': BANNERS.housing,
  'Migration Worker Loan': BANNERS.migrant,
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

export default function ProductDetailScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const name = params.get('p') ?? 'SME Loan'
  const hero = HERO_BY_NAME[name] ?? BANNERS.enterprise
  // Only the Migration Worker Loan uses the MWL apply flow; the other four
  // products (Micro / Small Biz / Housing / SME) apply via the Non-MWL flow.
  const isMwl = name === 'Migration Worker Loan'
  const applyPath = isMwl ? '/mwl-about' : '/nonmwl-about'

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
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
            onClick={() => navigate('/products?v=1')}
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
            <HeroPill icon="message" label="Chat" />
            <HeroPill icon="phone" label="Call" />
          </Box>
        </Box>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <Box sx={{ px: 2, pt: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: '30px' }}>
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
            <ToolButton icon="calculator" label="Calculate" onClick={() => navigate('/calculator?v=1')} sx={{ width: 132, flexShrink: 0 }} />
            <ToolButton icon="clock" label="Request Consult" sx={{ flex: 1 }} />
          </Box>

          {/* Spec cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <SectionLabel>Key features</SectionLabel>
              <SpecCard rows={KEY_FEATURES} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <SectionLabel>Eligibility</SectionLabel>
              <SpecCard rows={ELIGIBILITY} />
            </Box>
          </Box>

          {/* Required documents */}
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
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: VALUE }}>{d}</Typography>
                    <Typography sx={{ fontSize: 11, color: LABEL }}>Required when applicable</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Footer CTA ─────────────────────────────────────────────────── */}
      <Box sx={{ flexShrink: 0, px: 2, pt: 1, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<Icon name="arrowRight" size={18} color="#fff" />}
          onClick={() => navigate(applyPath)}
          sx={{ minHeight: 48, borderRadius: '8px', fontSize: 16, fontWeight: 600, bgcolor: BRAND, '&:hover': { bgcolor: '#1F4F9E' } }}
        >
          Apply this loan
        </Button>
      </Box>
    </Box>
  )
}

function HeroPill({ icon, label }: { icon: 'message' | 'phone'; label: string }) {
  return (
    <Box
      role="button"
      sx={{
        height: 52,
        px: 2,
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
