import { ReactNode, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../components/Icon'
import PayLoanSheet from '../components/PayLoanSheet'
import CallSheet from '../components/CallSheet'
import { MwlHeader } from './mwl/MwlParts'
import { useFlow } from '../workspace/FlowContext'

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

export default function MyLoanDetailScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [payOpen, setPayOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const overdue = searchParams.get('overdue') === 'true'
  const product = searchParams.get('product') ?? 'Small Business Loan'
  const { flow } = useFlow()
  const isCoBorrower = flow === 'Co-Borrower'
  const isBorrower = flow === 'Borrower'
  const isGuaranteeView = flow === 'Guarantee' || searchParams.get('guarantee') === 'true'

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, pb: '44px' }}>
        <MwlHeader onBack={() => navigate(-1)} />
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: HEADING, letterSpacing: '-1px', px: 3, mt: 1 }}>
          {product}
        </Typography>


        <Box sx={{ px: 3, pt: 2.5, pb: 6, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <DetailsTab onPay={() => setPayOpen(true)} overdue={overdue} onInfo={() => setInfoOpen(true)} isGuaranteeView={isGuaranteeView} />
          <OthersTab isGuaranteeView={isGuaranteeView} />
        </Box>
      </Box>

      <PayLoanSheet open={payOpen} onClose={() => setPayOpen(false)} overdue={overdue} />
      <ProductFeaturesSheet open={infoOpen} onClose={() => setInfoOpen(false)} product={product} isCoBorrower={isCoBorrower} isBorrower={isBorrower} isGuarantee={!isCoBorrower && isGuaranteeView} />
    </Box>
  )
}

// ─── DETAILS tab ─────────────────────────────────────────────────────────────
function DetailsTab({ onPay, overdue, onInfo, isGuaranteeView }: { onPay: () => void; overdue: boolean; onInfo: () => void; isGuaranteeView?: boolean }) {
  const [showAllRows, setShowAllRows] = useState(false)
  const navigate = useNavigate()
  const isGuarantee = !!isGuaranteeView
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Status row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ bgcolor: '#E6EEF8', borderRadius: '999px', px: '9px', py: '3px' }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#0C419A' }}>Active</Typography>
        </Box>
        {overdue && (
          <Box sx={{ bgcolor: '#FEF3E2', borderRadius: '999px', px: '9px', py: '3px', display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <Icon name="alert" size={11} color="#C2870F" />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#C2870F' }}>Overdue</Typography>
          </Box>
        )}
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: LABEL, letterSpacing: '0.65px' }}>NH-2026-04821</Typography>
        <Box
          role="button"
          onClick={onInfo}
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', opacity: 0.85, '&:active': { opacity: 0.5 } }}
        >
          <Icon name="info" size={16} color={ACCENT} strokeWidth={1.6} />
        </Box>
      </Box>

      {/* Overview card — donut + legend + progress + meta */}
      <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: LABEL }}>8 of 24 paid</Typography>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#000' }}>33% completed</Typography>
          </Box>
          <Box sx={{ height: 6, borderRadius: '999px', bgcolor: '#fff', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: '33%', bgcolor: OUTSTANDING, borderRadius: '999px' }} />
          </Box>
        </Box>

        {/* Meta row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F0F0F0', pt: 1.5 }}>
          <MetaCol label="Next Due" value="12 Feb 2026" />
        </Box>
      </Box>

      {/* Next payment due card */}
      {!isGuarantee && <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: 3 }}>
        {/* Top row: label + penalty */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Icon name="clock" size={16} color="#000" />
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#000' }}>Next payment due</Typography>
          </Box>
          {overdue && (
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#E07A1A' }}>+$5.00 Penalty</Typography>
          )}
        </Box>
        {/* Bottom row: amount + due date | Pay now button */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 800, color: VALUE, letterSpacing: '-1px', lineHeight: 1.1 }}>$320.00</Typography>
            <Typography sx={{ fontSize: 12, color: LABEL, mt: 0.25 }}>Due 16 May · in 9 days</Typography>
          </Box>
          <Button
            variant="contained"
            onClick={onPay}
            startIcon={<Icon name="cash" size={18} />}
            sx={{ height: 48, minWidth: 0, borderRadius: '12px', px: '22px', fontSize: 15, fontWeight: 700, bgcolor: ACCENT, '&:hover': { bgcolor: '#2B4F92' }, textTransform: 'none' }}
          >
            Pay now
          </Button>
        </Box>
      </Box>}

      {/* Actual payment table */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: 0.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: LABEL, letterSpacing: '0.65px', textTransform: 'uppercase' }}>
            Actual Payment
          </Typography>
          <Box
            role="button"
            onClick={() => navigate(`/document-view?name=Actual%20Payment${isGuarantee ? '&guarantee=true' : ''}`)}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:active': { opacity: 0.7 } }}
          >
            <Icon name="download" size={14} color={ACCENT} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>Download</Typography>
          </Box>
        </Box>
        <PaymentTable showAll={showAllRows} />
        <Box
          role="button"
          onClick={() => setShowAllRows(v => !v)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, pt: 1, cursor: 'pointer', '&:active': { opacity: 0.7 } }}
        >
          <Box component="svg" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" sx={{ width: 15, height: 15 }}>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </Box>
          <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: ACCENT }}>
            {showAllRows ? 'Show less' : 'View full schedule'}
          </Typography>
        </Box>
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
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: VALUE, lineHeight: 1.1 }}>55%</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 500, color: LABEL, lineHeight: 1.1 }}>outstanding</Typography>
      </Box>
    </Box>
  )
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
        <Typography sx={{ fontSize: 13.5, color: LABEL }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#000' }}>{value}</Typography>
    </Box>
  )
}

function MetaCol({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <Typography sx={{ fontSize: 12, color: LABEL }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: VALUE }}>{value}</Typography>
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
  { no: '1',  date: '5/01/26', principal: '$39.46', other: '$5.53', total: '$44.99', badge: { text: 'បង់រួច', tone: 'paid' }, tone: 'dim' },
  { no: '2',  date: '5/02/26', principal: '$39.46', other: '$5.53', total: '$44.99', badge: { text: 'បង់រួច', tone: 'paid' }, tone: 'dim' },
  { no: '3',  date: '5/03/26', principal: '$39.46', other: '$5.53', total: '$44.99', badge: { text: 'បង់រួច', tone: 'paid' }, tone: 'dim' },
  { no: '4',  date: '5/04/26', principal: '$39.46', other: '$5.53', total: '$44.99', badge: { text: 'បង់រួច', tone: 'paid' }, tone: 'dim' },
  { no: '5',  date: '5/05/26', principal: '$39.46', other: '$5.53', total: '$44.99', badge: { text: 'បង់រួច', tone: 'paid' }, tone: 'dim' },
  { no: '6',  date: '5/06/26', principal: '$39.46', other: '$5.53', total: '$44.99', badge: { text: 'បង់រួច', tone: 'paid' }, tone: 'dim' },
  { no: '7',  date: '5/07/26', principal: '$39.46', other: '$5.53', total: '$44.99', badge: { text: 'បង់រួច', tone: 'paid' }, tone: 'dim' },
  { no: '8',  date: '5/08/26', principal: '$39.46', other: '$5.53', total: '$44.99', badge: { text: 'បង់រួច', tone: 'paid' }, tone: 'dim' },
  { no: '9',  date: '5/09/26', principal: '$39.93', other: '$5.53', total: '$44.99', badge: { text: 'ជិតដល់', tone: 'soon' }, tone: 'highlight' },
  { no: '10', date: '5/10/26', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '11', date: '5/11/26', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '12', date: '5/12/26', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '13', date: '5/01/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '14', date: '5/02/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '15', date: '5/03/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '16', date: '5/04/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '17', date: '5/05/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '18', date: '5/06/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '19', date: '5/07/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '20', date: '5/08/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '21', date: '5/09/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '22', date: '5/10/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '23', date: '5/11/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
  { no: '24', date: '5/12/27', principal: '$39.93', other: '$5.53', total: '$44.99', tone: 'normal' },
]
const PAY_PREVIEW = 3
const PAY_HEAD = ['រ.ល', 'កាលបរិច្ឆេទ', 'ប្រាក់ដើម', 'ផ្សេងៗ', 'ប្រាក់សរុប']
// Fixed column widths — keep numeric columns tight so the last column has
// room for the amount + status badge (otherwise the badge gets clipped).
const PAY_W: string[] = ['9%', '21%', '19%', '15%', '36%']

function PaymentTable({ showAll = false }: { showAll?: boolean }) {
  const highlightIdx = PAY_ROWS.findIndex(r => r.tone === 'highlight')
  const previewStart = Math.max(0, highlightIdx - 1)
  const rows = showAll ? PAY_ROWS : PAY_ROWS.slice(previewStart, previewStart + PAY_PREVIEW)
  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden' }}>
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
                  textAlign: i === 0 ? 'center' : i === 1 ? 'left' : 'right',
                  px: i === 0 ? 0.5 : i === PAY_HEAD.length - 1 ? '10px' : '8px',
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
          {rows.map((row, ri) => {
            const bg = row.tone === 'highlight' ? '#EBF6EC' : '#fff'
            const dim = row.tone === 'dim'
            return (
              <Box component="tr" key={ri} sx={{ bgcolor: bg, borderBottom: ri < rows.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                <Box component="td" sx={{ textAlign: 'center', px: 0.5, py: '8px', fontSize: 12, fontWeight: 500, color: dim ? 'rgba(0,0,0,0.2)' : LABEL }}>
                  {row.no}
                </Box>
                <Box component="td" sx={{ px: '8px', py: '8px', fontSize: 12, fontWeight: 500, color: dim ? 'rgba(0,0,0,0.2)' : '#000', whiteSpace: 'nowrap' }}>
                  {row.date}
                </Box>
                <Box component="td" sx={{ px: '8px', py: '8px', fontSize: 12, fontWeight: 500, textAlign: 'right', color: dim ? 'rgba(0,0,0,0.2)' : LABEL, whiteSpace: 'nowrap' }}>
                  {row.principal}
                </Box>
                <Box component="td" sx={{ px: '8px', py: '8px', fontSize: 12, fontWeight: 500, textAlign: 'right', color: dim ? 'rgba(0,0,0,0.2)' : LABEL, whiteSpace: 'nowrap' }}>
                  {row.other}
                </Box>
                <Box component="td" sx={{ px: '10px', py: '8px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', color: dim ? 'rgba(0,0,0,0.2)' : '#000' }}>{row.total}</Typography>
                  {row.badge && <StatusBadge text={row.badge.text} tone={row.badge.tone} />}
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
function OthersTab({ isGuaranteeView }: { isGuaranteeView?: boolean }) {
  const navigate = useNavigate()
  const [callOpen, setCallOpen] = useState(false)
  const isGuarantee = !!isGuaranteeView
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Loan service requests */}
      {!isGuarantee && <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <SectionLabel>Loan Service Requests</SectionLabel>
        <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden' }}>
          <ServiceRow icon="cash" title="Payoff Request" subtitle="Notify NHFC of intent to fully settle" divider onClick={() => navigate('/early-payoff')} />
          <ServiceRow
            icon="restructure"
            title="Request Restructure"
            subtitle="Request temporary repayment support"
            onClick={() => navigate('/restructure-info')}
          />
        </Box>
      </Box>}

      {/* My documents */}
      {!isGuarantee && <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <SectionLabel>My Documents</SectionLabel>
        <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', px: '14px' }}>
          {DOCS.map((d, i) => (
            <DocRow key={d.title} {...d} last={i === DOCS.length - 1} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25, pl: 0.5 }}>
          <Icon name="accountSecurity" size={14} color="#9AA3B2" />
          <Typography sx={{ fontSize: 11.5, color: '#9AA3B2' }}>Official NH documents. Downloads are watermarked with retrieval date.</Typography>
        </Box>
      </Box>}

      {/* My officer */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <SectionLabel>My Officer</SectionLabel>
        <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            <Box role="button" aria-label="Chat" onClick={() => navigate('/chat')} sx={{ display: 'flex', cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
              <Icon name="message" size={22} color="#0B0F1A" />
            </Box>
            <Box role="button" aria-label="Call" onClick={() => setCallOpen(true)} sx={{ display: 'flex', cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
              <Icon name="phone" size={22} color="#0B0F1A" />
            </Box>
          </Box>
        </Box>
      </Box>

      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />
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

function ServiceRow({ icon, title, subtitle, divider, onClick }: { icon: 'cash' | 'restructure'; title: string; subtitle: string; divider?: boolean; onClick?: () => void }) {
  return (
    <Box
      role="button"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: '14px',
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

const DOCS: { title: string; sub: string; size: string }[] = [
  { title: 'Payment Schedule', sub: 'Original 24-installment schedule', size: 'PDF · 48 KB' },
  { title: 'Loan Contract', sub: 'Signed Small Biz Loan agreement', size: 'PDF · 124 KB' },
  { title: '1st Restructured Contract', sub: 'Approved 12 May 2026 · Grace period 3 months', size: 'PDF · 96 KB' },
  { title: 'Hypothec Contract', sub: 'Collateral agreement · Secured loan', size: 'PDF · 89 KB' },
  { title: 'Guarantee Contract', sub: 'Guarantor agreement · Third party security', size: 'PDF · 76 KB' },
]

function DocRow({ title, last }: { title: string; sub?: string; size?: string; last?: boolean }) {
  const navigate = useNavigate()
  return (
    <Box
      role="button"
      onClick={() => navigate('/document-view?name=' + encodeURIComponent(title))}
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: '13px', borderBottom: last ? 'none' : '1px solid #F0F0F0', cursor: 'pointer', '&:active': { opacity: 0.7 } }}
    >
      {/* Red PDF badge */}
      <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: '#FEECEC', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box component="svg" viewBox="0 0 24 24" fill="none" stroke="#E03232" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" sx={{ width: 18, height: 18 }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="12" y2="17" />
        </Box>
      </Box>

      {/* Title */}
      <Typography sx={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: VALUE, minWidth: 0 }} noWrap>{title}</Typography>

      {/* Eye + View */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Box component="svg" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" sx={{ width: 15, height: 15 }}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </Box>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: ACCENT }}>View</Typography>
      </Box>
    </Box>
  )
}

// ─── Product features sheet ───────────────────────────────────────────────────
type FeatureItem = { icon: string; label: string; value: string }

const PRODUCT_FEATURES: Record<string, { title: string; tagline: string; features: FeatureItem[] }> = {
  'Small Business Loan': {
    title: 'Small Business Loan',
    tagline: 'Grow your business with flexible capital',
    features: [
      { icon: 'cash',        label: 'Loan Amount',    value: 'Up to $10,000'        },
      { icon: 'calendar',    label: 'Loan Term',       value: '6 – 36 months'        },
      { icon: 'gauge',       label: 'Interest Rate',   value: 'From 1.20% / month'   },
      { icon: 'checkCircle', label: 'Repayment',       value: 'Equal monthly payment'},
      { icon: 'layers',      label: 'Collateral',      value: 'Not required'         },
    ],
  },
  'Migration Worker Loan': {
    title: 'Migration Worker Loan',
    tagline: 'Support your journey abroad with confidence',
    features: [
      { icon: 'cash',        label: 'Loan Amount',    value: 'Up to $5,000'               },
      { icon: 'calendar',    label: 'Loan Term',       value: '12 – 36 months'             },
      { icon: 'gauge',       label: 'Interest Rate',   value: 'From 1.04% / month'         },
      { icon: 'plane',       label: 'Purpose',         value: 'Overseas work preparation'  },
      { icon: 'checkCircle', label: 'Repayment',       value: 'Monthly installment'        },
      { icon: 'idCard',      label: 'Eligibility',     value: 'Valid work permit required' },
    ],
  },
  'Housing Loan': {
    title: 'Housing Loan',
    tagline: 'Own your dream home today',
    features: [
      { icon: 'cash',        label: 'Loan Amount',    value: 'Up to $200,000'           },
      { icon: 'calendar',    label: 'Loan Term',       value: 'Up to 20 years'           },
      { icon: 'gauge',       label: 'Interest Rate',   value: 'From 0.85% / month'       },
      { icon: 'home',        label: 'Purpose',         value: 'Purchase · Build · Repair'},
      { icon: 'checkCircle', label: 'Repayment',       value: 'Equal monthly payment'    },
      { icon: 'layers',      label: 'Collateral',      value: 'Property title required'  },
    ],
  },
  'Staff Loan': {
    title: 'Staff Loan',
    tagline: 'Exclusive financial support for NH staff',
    features: [
      { icon: 'cash',        label: 'Loan Amount',    value: 'Up to 24× monthly salary' },
      { icon: 'calendar',    label: 'Loan Term',       value: '12 – 60 months'           },
      { icon: 'gauge',       label: 'Interest Rate',   value: '0% (subsidised)'          },
      { icon: 'checkCircle', label: 'Repayment',       value: 'Salary deduction'         },
      { icon: 'layers',      label: 'Collateral',      value: 'Not required'             },
      { icon: 'idCard',      label: 'Eligibility',     value: 'NH full-time employees'   },
    ],
  },
}

const DEFAULT_FEATURES: (typeof PRODUCT_FEATURES)[string] = {
  title: 'Loan Product',
  tagline: 'Flexible financial solutions for your needs',
  features: [
    { icon: 'cash',        label: 'Loan Amount',   value: 'Subject to assessment'  },
    { icon: 'calendar',    label: 'Loan Term',      value: 'Subject to assessment'  },
    { icon: 'gauge',       label: 'Interest Rate',  value: 'Subject to assessment'  },
    { icon: 'checkCircle', label: 'Repayment',      value: 'Monthly installment'    },
  ],
}

function ProductFeaturesSheet({ open, onClose, product, isCoBorrower, isBorrower, isGuarantee }: { open: boolean; onClose: () => void; product: string; isCoBorrower?: boolean; isBorrower?: boolean; isGuarantee?: boolean }) {
  const info = PRODUCT_FEATURES[product] ?? DEFAULT_FEATURES
  return (
    <>
      {/* Backdrop */}
      {open && (
        <Box
          onClick={onClose}
          sx={{ position: 'absolute', inset: 0, zIndex: 100, bgcolor: 'rgba(11,15,26,0.4)' }}
        />
      )}
      {/* Sheet */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 101,
          bgcolor: '#fff',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 40px rgba(11,15,26,0.16)',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
          pb: '44px',
        }}
      >
        {/* Handle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 1 }}>
          <Box sx={{ width: 36, height: 4, borderRadius: '2px', bgcolor: '#E0E4EC' }} />
        </Box>

        {/* Header */}
        <Box sx={{ px: 3, pt: 1, pb: 2, borderBottom: '1px solid #F0F2F5' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px' }}>
            {info.title}
          </Typography>
          <Typography sx={{ fontSize: 13, color: LABEL, mt: 0.25 }}>{info.tagline}</Typography>
        </Box>

        {/* Co-Borrower identity card */}
        {isCoBorrower && (
          <Box sx={{ mx: 3, mt: 2, bgcolor: '#F8FAFF', border: '1.5px solid #E0EAFF', borderRadius: '14px', p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: '#EEF3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="idCard" size={15} color={ACCENT} />
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: ACCENT, letterSpacing: '0.3px' }}>CO-BORROWER</Typography>
              </Box>
              <Box sx={{ bgcolor: '#EEF3FC', borderRadius: '999px', px: '10px', py: '3px' }}>
                <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: ACCENT }}>Jointly liable</Typography>
              </Box>
            </Box>
            <Box sx={{ height: '1px', bgcolor: '#E0EAFF' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#E8EAEE', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: ACCENT }}>KK</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 11, color: LABEL, lineHeight: 1.2 }}>Primary borrower</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING, lineHeight: 1.3 }}>Krong Kampuchea</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Icon name="checkCircle" size={14} color="#16A34A" />
                <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: '#16A34A' }}>Verified</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Borrower identity card */}
        {isBorrower && (
          <Box sx={{ mx: 3, mt: 2, bgcolor: '#F8FAFF', border: '1.5px solid #E0EAFF', borderRadius: '14px', p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: '#EEF3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="idCard" size={15} color={ACCENT} />
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: ACCENT, letterSpacing: '0.3px' }}>BORROWER</Typography>
              </Box>
              <Box sx={{ bgcolor: '#EEF3FC', borderRadius: '999px', px: '10px', py: '3px' }}>
                <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: ACCENT }}>Primary liable</Typography>
              </Box>
            </Box>
            <Box sx={{ height: '1px', bgcolor: '#E0EAFF' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#E8EAEE', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: ACCENT }}>KK</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 11, color: LABEL, lineHeight: 1.2 }}>Account holder</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING, lineHeight: 1.3 }}>Krong Kampuchea</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Icon name="checkCircle" size={14} color="#16A34A" />
                <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: '#16A34A' }}>Verified</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Feature rows — guarantee view shows loan-you-guarantee context */}
        {isGuarantee ? (
          <Box sx={{ px: 3, pt: 2, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {/* Guarantee identity card — mirrors Co-Borrower style */}
            <Box sx={{ bgcolor: '#FFFBF2', border: '1.5px solid #F5D78E', borderRadius: '14px', p: '14px 16px', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="alert" size={14} color="#C2870F" />
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#92400E', letterSpacing: '0.3px' }}>GUARANTOR</Typography>
                </Box>
                <Box sx={{ bgcolor: '#FEF3C7', borderRadius: '999px', px: '10px', py: '3px' }}>
                  <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: '#C2870F' }}>Jointly liable</Typography>
                </Box>
              </Box>
              <Box sx={{ height: '1px', bgcolor: '#F5D78E' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#FEF3C7', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#C2870F' }}>DK</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11, color: LABEL, lineHeight: 1.2 }}>Primary borrower</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING, lineHeight: 1.3 }}>Dim Kim</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Icon name="checkCircle" size={14} color="#16A34A" />
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: '#16A34A' }}>Verified</Typography>
                </Box>
              </Box>
            </Box>
            {[
              { icon: 'myLoan' as const,      label: 'Loan product',      value: info.title },
              { icon: 'pay' as const,         label: 'Loan amount',       value: info.features.find(f => f.label === 'Loan Amount')?.value ?? '—' },
              { icon: 'clock' as const,       label: 'Loan term',         value: info.features.find(f => f.label === 'Loan Term')?.value ?? '—' },
              { icon: 'restructure' as const, label: 'Interest rate',     value: info.features.find(f => f.label === 'Interest Rate')?.value ?? '—' },
            ].map((f, i, arr) => (
              <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: '11px', borderBottom: i < arr.length - 1 ? '1px solid #F0F2F5' : 'none' }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#EEF3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={f.icon} size={17} color={ACCENT} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 12, color: LABEL, lineHeight: 1.3 }}>{f.label}</Typography>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING, lineHeight: 1.3, mt: 0.15 }}>{f.value}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
        <Box sx={{ px: 3, pt: 2, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {info.features.map((f, i) => (
            <Box
              key={f.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: '13px',
                borderBottom: i < info.features.length - 1 ? '1px solid #F0F2F5' : 'none',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: '#EEF3FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name={f.icon as any} size={17} color={ACCENT} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, color: LABEL, lineHeight: 1.3 }}>{f.label}</Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING, lineHeight: 1.3, mt: 0.15 }}>{f.value}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        )}

        {/* Close button */}
        <Box sx={{ px: 3, pt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            sx={{ height: 46, borderRadius: '12px', fontSize: 15, fontWeight: 700, color: ACCENT, borderColor: '#C6D8F8', textTransform: 'none', '&:hover': { bgcolor: '#EEF3FC' } }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </>
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
