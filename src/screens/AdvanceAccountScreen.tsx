import { ReactNode, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'
import { MwlHeader, BottomSheet, BLUE } from './mwl/MwlParts'
import { useHomePath } from '../workspace/useHomePath'

// ─── Advances payment ledger ─────────────────────────────────────────────────
const TABLE_HEAD = ['កាលបរិច្ឆេទ', 'ដាក់ប្រាក់', 'ប្រាក់បង់កម្ចី', 'ផ្ទេរទៅកាន់កម្ចី']
type Row = { date: string; deposit: string; pay: string; transfer?: string }
const TABLE_ROWS: Row[] = [
  { date: '5/08/2026', deposit: '$44.99', pay: '$0.00' },
  { date: '5/08/2026', deposit: '$44.99', pay: '$0.00' },
  { date: '5/08/2026', deposit: '$0.00', pay: '$44.99', transfer: 'កម្ចីខ្នាតតូច' },
  { date: '5/08/2026', deposit: '$0.00', pay: '$44.99', transfer: 'កម្ចីគេហដ្ឋាន' },
  { date: '5/08/2026', deposit: '$0.00', pay: '$44.99', transfer: 'កម្ចីពលករ' },
]

// ─── Top-up payment methods ──────────────────────────────────────────────────
type Method = { id: string; name: string; logo: string }
const METHODS: Method[] = [
  { id: 'khqr', name: 'បង់តាម KHQR', logo: '/assets/banks/ico_khqr.png' },
  { id: 'aba', name: 'ធនាគារ អេប៊ីអេ', logo: '/assets/banks/ABA.png' },
  { id: 'acleda', name: 'ធនាគារ អេស៊ីលីដា', logo: '/assets/banks/Aceleda.png' },
  { id: 'ppcb', name: 'ធនាគារ ភីភីស៊ីប៊ី', logo: '/assets/banks/PPCB.png' },
  { id: 'wing', name: 'ធនាគារ វីង', logo: '/assets/banks/Wing.png' },
]

export default function AdvanceAccountScreen() {
  const navigate = useNavigate()
  const home = useHomePath()
  const [params] = useSearchParams()
  // Sample 2 (?v=2) opens the Top-up sheet by default for review.
  const [topUpOpen, setTopUpOpen] = useState((params.get('v') ?? '1') === '2')
  const [method, setMethod] = useState('ppcb')

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => navigate(home)} kebab={false} />
        <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', px: 3, mt: 0.5, mb: 2 }}>
          Advance Account
        </Typography>

        <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Balance + Top-up */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', border: '1px solid #ECEFF3', boxShadow: '0 1px 3px rgba(16,24,40,0.04)', px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.3px' }}>Balance</Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', mt: 0.25 }}>$120.00</Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => setTopUpOpen(true)}
              startIcon={<Icon name="pay" size={18} />}
              sx={{ height: 48, borderRadius: '12px', px: 2.5, fontSize: 15, fontWeight: 700, flexShrink: 0 }}
            >
              Top-up Advance
            </Button>
          </Box>

          {/* Advances payment table */}
          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6', mb: 1 }}>
              HISTORY
            </Typography>
            <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
              <AdvancesTable onRowClick={() => navigate('/my-loan-detail')} />
            </Box>
            <Typography sx={{ fontSize: 12, color: '#8A94A6', textAlign: 'center', mt: 1.5 }}>
              Showing 5 of 16 · <Box component="span" sx={{ color: BLUE, fontWeight: 700 }}>Preview</Box> for full view
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Top-up Advance bottom sheet */}
      <BottomSheet open={topUpOpen} onClose={() => setTopUpOpen(false)}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px' }}>
            Top-up Advance
          </Typography>
          <IconButton
            onClick={() => setTopUpOpen(false)}
            aria-label="Close"
            sx={{ bgcolor: '#fff', border: '1px solid #ECEFF3', width: 40, height: 40, color: '#0B0F1A', boxShadow: '0 1px 2px rgba(16,24,40,0.05)', '&:hover': { bgcolor: '#F4F6F9' } }}
          >
            <Box component="span" sx={{ fontSize: 20, fontWeight: 600, lineHeight: 1 }}>✕</Box>
          </IconButton>
        </Box>

        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6', mb: 1.25 }}>
            PAYMENT METHOD
          </Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: '14px', border: '1px solid #ECEFF3', overflow: 'hidden' }}>
            {METHODS.map((m, i) => {
              const active = method === m.id
              return (
                <Box
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, cursor: 'pointer', borderTop: i > 0 ? '1px solid #F1F4F8' : 'none' }}
                >
                  <LogoTile logo={m.logo} alt={m.name} />
                  <Typography sx={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>{m.name}</Typography>
                  <Radio active={active} />
                </Box>
              )
            })}
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={() => setTopUpOpen(false)}
          startIcon={<Icon name="cash" size={16} />}
          sx={{ height: 56, borderRadius: '14px', p: '10px', fontSize: 17, fontWeight: 700 }}
        >
          Pay Now
        </Button>
      </BottomSheet>
    </Box>
  )
}

function AdvancesTable({ onRowClick }: { onRowClick?: () => void }) {
  return (
    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
      <Box component="thead">
        <Box component="tr">
          {TABLE_HEAD.map((h) => (
            <Box component="th" key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', textAlign: 'center', px: 0.5, py: 1.5, verticalAlign: 'top', lineHeight: 1.3 }}>
              {h}
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="tbody">
        {TABLE_ROWS.map((row, ri) => (
          <Box
            component="tr"
            key={ri}
            onClick={onRowClick}
            sx={{ borderTop: '1px solid #F1F4F8', cursor: onRowClick ? 'pointer' : 'default', '&:active': { bgcolor: '#F7F9FC' } }}
          >
            <Cell>{row.date}</Cell>
            <Cell strong={row.deposit !== '$0.00'}>{row.deposit}</Cell>
            <Cell strong={row.pay !== '$0.00'}>{row.pay}</Cell>
            <Box component="td" sx={{ textAlign: 'center', px: 0.5, py: 1.5 }}>
              {row.transfer && (
                <Box component="span" sx={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#2E7D32', bgcolor: '#E6F4EA', borderRadius: '999px', px: 1, py: 0.5, lineHeight: 1.3 }}>
                  {row.transfer}
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function Cell({ children, strong = false }: { children: ReactNode; strong?: boolean }) {
  return (
    <Box
      component="td"
      sx={{ fontSize: 13, textAlign: 'center', px: 0.5, py: 1.5, color: strong ? '#0B0F1A' : '#9AA3B2', fontWeight: strong ? 700 : 500 }}
    >
      {children}
    </Box>
  )
}

function LogoTile({ logo, alt }: { logo: string; alt: string }) {
  return (
    <Box
      component="img"
      src={logo}
      alt={alt}
      sx={{ width: 44, height: 44, borderRadius: '12px', flexShrink: 0, display: 'block', objectFit: 'cover', bgcolor: '#fff', border: '1px solid #F1F4F8' }}
    />
  )
}

function Radio({ active }: { active: boolean }) {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        flexShrink: 0,
        border: active ? `2px solid ${BLUE}` : '2px solid #C9D2DE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: active ? 'none' : '0 1px 2px rgba(16,24,40,0.06)',
      }}
    >
      {active && <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: BLUE }} />}
    </Box>
  )
}
