import { ReactNode, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../components/Icon'
import PayLoanSheet from '../components/PayLoanSheet'
import { MwlHeader } from './mwl/MwlParts'

// ─────────────────────────────────────────────────────────────────────────────
// My Loan detail — opened by tapping an active loan card on the My Loans screen.
// Mirrors the Figma "Active / Pay" frames (node 1828:7430) with Details / Others.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const LABEL = '#737373'
const VALUE = '#171717'
const ACCENT = '#345EAC'
const PAID = '#275CB2'
const OUTSTANDING = '#8CC919'

type Tab = 'details' | 'others'

export default function MyLoanDetailScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  // Sample 2 (?v=2) drops the segmented tabs and stacks every section in one scroll.
  const combined = (params.get('v') ?? '1') === '2'
  const [tab, setTab] = useState<Tab>('details')
  // Deep-link: arriving with ?pay=1 (e.g. from a payment reminder) opens the Pay Loan sheet.
  const [payOpen, setPayOpen] = useState(params.get('pay') === '1')

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, pb: '44px' }}>
        <MwlHeader onBack={() => navigate('/my-loan')} />
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: HEADING, letterSpacing: '-1px', px: 3, mt: 1 }}>
          Small Business Loan
        </Typography>

        {combined ? (
          <Box sx={{ px: 3, pt: 2.5, pb: 6, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <DetailsTab onPay={() => setPayOpen(true)} />
            <OthersTab />
          </Box>
        ) : (
          <Box sx={{ px: 3, pt: 2.5, pb: 6, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <SegmentedTabs value={tab} onChange={setTab} />
            {tab === 'details' ? <DetailsTab onPay={() => setPayOpen(true)} /> : <OthersTab />}
          </Box>
        )}
      </Box>

      <PayLoanSheet open={payOpen} onClose={() => setPayOpen(false)} />
    </Box>
  )
}

// ─── Segmented pill: Details | Others ────────────────────────────────────────
function SegmentedTabs({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
  const TABS: { id: Tab; label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'others', label: 'Others' },
  ]
  return (
    <Box sx={{ display: 'flex', bgcolor: '#EBEBEC', borderRadius: '24px', p: 0.5, gap: 0.5 }}>
      {TABS.map((t) => {
        const active = value === t.id
        return (
          <Box
            key={t.id}
            onClick={() => onChange(t.id)}
            sx={{
              flex: 1,
              textAlign: 'center',
              py: '6px',
              borderRadius: '24px',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
              color: active ? '#18181B' : '#71717A',
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

// ─── DETAILS tab ─────────────────────────────────────────────────────────────
function DetailsTab({ onPay }: { onPay: () => void }) {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Status row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ bgcolor: '#E6EEF8', borderRadius: '999px', px: '9px', py: '3px' }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#0C419A' }}>Active</Typography>
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: LABEL, letterSpacing: '0.65px' }}>NH-2026-04821</Typography>
      </Box>

      {/* Overview card — donut + legend + progress + meta */}
      <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Donut />
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <LegendRow color="#D9D9D9" label="Total" value="$8,640" />
            <LegendRow color={PAID} label="Paid" value="$3,860" />
            <LegendRow color={OUTSTANDING} label="Outstanding" value="$4,780" />
          </Box>
        </Box>

        {/* Progress */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: LABEL }}>8 of 24 paid</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#000' }}>33% completed</Typography>
          </Box>
          <Box sx={{ height: 6, borderRadius: '999px', bgcolor: '#F5F5F5', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: '33%', bgcolor: OUTSTANDING, borderRadius: '999px' }} />
          </Box>
        </Box>

        {/* Meta row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F0F0F0', pt: 1.5 }}>
          <MetaCol label="Next Due" value="12 Feb 2026" />
          <MetaCol label="Due Amount" value="$270.00" />
          <MetaCol label="Rate" value="1.20%/mo" />
        </Box>
      </Box>

      {/* Next payment due card */}
      <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: 2, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon name="clock" size={16} color="#000" />
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#000' }}>Next payment due</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: VALUE, lineHeight: 1.2 }}>$320.00</Typography>
            <Typography sx={{ fontSize: 11, color: LABEL }}>Due 16 May · in 9 days</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={onPay}
            startIcon={<Icon name="cash" size={16} />}
            sx={{ height: 38, borderRadius: '9px', p: '10px', fontSize: 13, fontWeight: 500, bgcolor: ACCENT, '&:hover': { bgcolor: '#2B4F92' } }}
          >
            Pay Now
          </Button>
        </Box>
      </Box>

      {/* Actual payment table */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: LABEL, letterSpacing: '0.65px', textTransform: 'uppercase', pl: 0.5 }}>
          Actual Payment
        </Typography>
        <PaymentTable />
        <Typography sx={{ fontSize: 11, color: LABEL, textAlign: 'center', mt: 0.5 }}>
          Showing 3 of 6 · <Box component="span" role="button" onClick={() => navigate('/document-view?name=Actual%20Payment')} sx={{ color: ACCENT, fontWeight: 700, cursor: 'pointer' }}>Download</Box> for full view
        </Typography>
      </Box>
    </Box>
  )
}

function Donut() {
  // Total $8,640 · Paid $3,860 (44.7%) · Outstanding $4,780 (55.3%)
  const r = 38
  const c = 2 * Math.PI * r
  const paid = 3860 / 8640
  const paidLen = c * paid
  return (
    <Box sx={{ position: 'relative', width: 92, height: 92, flexShrink: 0 }}>
      <Box component="svg" viewBox="0 0 92 92" sx={{ width: 92, height: 92, transform: 'rotate(-90deg)' }}>
        <circle cx={46} cy={46} r={r} fill="none" stroke="#EDEDED" strokeWidth={9} />
        <circle cx={46} cy={46} r={r} fill="none" stroke={PAID} strokeWidth={9} strokeDasharray={`${paidLen} ${c - paidLen}`} />
        <circle cx={46} cy={46} r={r} fill="none" stroke={OUTSTANDING} strokeWidth={9} strokeDasharray={`${c - paidLen} ${paidLen}`} strokeDashoffset={-paidLen} />
      </Box>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: VALUE, lineHeight: 1.1 }}>$4,780</Typography>
        <Typography sx={{ fontSize: 10, fontWeight: 500, color: LABEL, lineHeight: 1.1 }}>outstanding</Typography>
      </Box>
    </Box>
  )
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
        <Typography sx={{ fontSize: 12, color: LABEL }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#000' }}>{value}</Typography>
    </Box>
  )
}

function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <Typography sx={{ fontSize: 11, color: LABEL }}>{label}</Typography>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: VALUE }}>{value}</Typography>
    </Box>
  )
}

// ─── Repayment preview table ─────────────────────────────────────────────────
type PayRow = {
  no: string
  date: string
  principal: string
  other: string
  total: string
  badge?: { text: string; tone: 'paid' | 'soon' }
  tone?: 'dim' | 'highlight' | 'normal'
}
const PAY_ROWS: PayRow[] = [
  { no: '2', date: '5/06/26', principal: '$39.46', other: '$5.53', total: '$44.99', badge: { text: 'បង់រួច', tone: 'paid' }, tone: 'dim' },
  { no: '3', date: '5/07/26', principal: '$39.93', other: '$5.53', total: '$44.99', badge: { text: 'ជិតដល់', tone: 'soon' }, tone: 'highlight' },
  { no: '4', date: '5/08/26', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
]
const PAY_HEAD = ['រ.ល', 'កាលបរិច្ឆេទ', 'ប្រាក់ដើម', 'ផ្សេងៗ', 'ប្រាក់សរុប']
// Fixed column widths — keep numeric columns tight so the last column has
// room for the amount + status badge (otherwise the badge gets clipped).
const PAY_W: (number | undefined)[] = [28, 66, 62, 46, undefined]

function PaymentTable() {
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <Box component="thead">
          <Box component="tr" sx={{ bgcolor: '#FAFAFA' }}>
            {PAY_HEAD.map((h, i) => (
              <Box
                component="th"
                key={h}
                sx={{
                  fontFamily: `'Noto Sans Khmer', sans-serif`,
                  fontSize: 10,
                  fontWeight: 600,
                  color: LABEL,
                  textAlign: i === 0 || i === PAY_HEAD.length - 1 ? 'center' : 'left',
                  px: i === 0 ? 0.5 : '8px',
                  py: '12px',
                  borderBottom: '1px solid #F0F0F0',
                  width: PAY_W[i],
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {PAY_ROWS.map((row, ri) => {
            const bg = row.tone === 'highlight' ? '#EBF6EC' : '#fff'
            const dim = row.tone === 'dim'
            return (
              <Box component="tr" key={ri} sx={{ bgcolor: bg, borderBottom: ri < PAY_ROWS.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                <Box component="td" sx={{ textAlign: 'center', px: 0.5, py: '8px', fontSize: 12, fontWeight: 500, color: dim ? 'rgba(0,0,0,0.2)' : LABEL }}>
                  {row.no}
                </Box>
                <Box component="td" sx={{ px: '8px', py: '8px', fontSize: 12, fontWeight: 500, color: dim ? 'rgba(0,0,0,0.2)' : '#000', whiteSpace: 'nowrap' }}>
                  {row.date}
                </Box>
                <Box component="td" sx={{ px: '8px', py: '8px', fontSize: 12, fontWeight: 500, color: dim ? 'rgba(0,0,0,0.2)' : LABEL, whiteSpace: 'nowrap' }}>
                  {row.principal}
                </Box>
                <Box component="td" sx={{ px: '8px', py: '8px', fontSize: 12, fontWeight: 500, color: dim ? 'rgba(0,0,0,0.2)' : LABEL, whiteSpace: 'nowrap' }}>
                  {row.other}
                </Box>
                <Box component="td" sx={{ px: '8px', py: '8px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: dim ? 'rgba(0,0,0,0.2)' : '#000' }}>{row.total}</Typography>
                    {row.badge && <StatusBadge text={row.badge.text} tone={row.badge.tone} />}
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

function StatusBadge({ text, tone }: { text: string; tone: 'paid' | 'soon' }) {
  const styles = tone === 'paid' ? { bg: '#EBF6EC', fg: '#1F6724' } : { bg: '#FAE6BD', fg: '#C2870F' }
  return (
    <Box sx={{ bgcolor: styles.bg, borderRadius: '999px', px: '4px', py: '2px', flexShrink: 0 }}>
      <Typography sx={{ fontFamily: `'Noto Sans Khmer', sans-serif`, fontSize: 10, fontWeight: 600, color: styles.fg, lineHeight: 1.2 }}>
        {text}
      </Typography>
    </Box>
  )
}

// ─── OTHERS tab ──────────────────────────────────────────────────────────────
function OthersTab() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Loan service requests */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <SectionLabel>Loan Service Requests</SectionLabel>
        <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
          <ServiceRow icon="pay" title="Payoff Request" subtitle="Notify NHFC of intent to fully settle" divider onClick={() => navigate('/early-payoff')} />
          <ServiceRow
            icon="arrowRight"
            title="Request Restructure"
            subtitle="Request temporary repayment support"
            onClick={() => navigate('/restructure-info')}
          />
        </Box>
      </Box>

      {/* My documents */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <SectionLabel>My Documents</SectionLabel>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 2, columnGap: 1 }}>
          <DocTile label="Payment Schedule" kind="schedule" />
          <DocTile label="Loan Contract" kind="pdf" />
          <DocTile label="Guarantee Contract" kind="image" />
          <DocTile label="Disbursement Receipt" kind="image" />
        </Box>
      </Box>

      {/* My officer */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <SectionLabel>My Officer</SectionLabel>
        <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              flexShrink: 0,
              background: 'radial-gradient(circle at 30% 30%, #9BD0FF 0%, #4C8BE0 45%, #2B4F92 100%)',
              boxShadow: '0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: VALUE }}>Mr. Pisey Sok</Typography>
            <Typography sx={{ fontSize: 11, color: LABEL }}>Riverside Branch</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon name="message" size={22} color="#0B0F1A" />
            <Icon name="phone" size={22} color="#0B0F1A" />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: 13, fontWeight: 600, color: LABEL, letterSpacing: '0.65px', textTransform: 'uppercase', pl: 0.5 }}>
      {children}
    </Typography>
  )
}

function ServiceRow({ icon, title, subtitle, divider, onClick }: { icon: 'pay' | 'arrowRight'; title: string; subtitle: string; divider?: boolean; onClick?: () => void }) {
  return (
    <Box
      role="button"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: '14px',
        cursor: 'pointer',
        borderBottom: divider ? '1px solid #F0F0F0' : 'none',
      }}
    >
      <Icon name={icon} size={22} color="#171717" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: VALUE }}>{title}</Typography>
        <Typography sx={{ fontSize: 11, color: LABEL }}>{subtitle}</Typography>
      </Box>
      <Icon name="chevronRight" size={16} color="#C9D2DE" />
    </Box>
  )
}

function DocTile({ label, kind }: { label: string; kind: 'schedule' | 'pdf' | 'image' }) {
  const navigate = useNavigate()
  const openDoc = () => navigate('/document-view?name=' + encodeURIComponent(label))
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box
        role="button"
        onClick={openDoc}
        sx={{
          position: 'relative',
          width: 83,
          height: 65,
          borderRadius: '9px',
          border: '1px solid rgba(0,0,0,0.1)',
          bgcolor: '#fff',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <DocThumb kind={kind} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 500, color: VALUE, textAlign: 'center' }} noWrap>{label}</Typography>
        <Typography role="button" onClick={openDoc} sx={{ fontSize: 12, fontWeight: 500, color: ACCENT, cursor: 'pointer' }}>Preview</Typography>
      </Box>
    </Box>
  )
}

function DocThumb({ kind }: { kind: 'schedule' | 'pdf' | 'image' }) {
  if (kind === 'schedule') {
    // Faint document-grid preview.
    return (
      <Box sx={{ width: '100%', height: '100%', p: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: '3px' }}>
            <Box sx={{ flex: 1, height: 4, bgcolor: '#E2E6EC', borderRadius: '1px' }} />
            <Box sx={{ width: 14, height: 4, bgcolor: '#EDEFF2', borderRadius: '1px' }} />
          </Box>
        ))}
      </Box>
    )
  }
  if (kind === 'pdf') {
    return (
      <Box sx={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="appPolicy" size={22} color="#E0524E" />
      </Box>
    )
  }
  return <Icon name="image" size={22} color="#A1D7FF" />
}
