// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  HOME PARTS — shared building blocks for the "Home – new customer" samples ║
// ║                                                                           ║
// ║  Uses the real WeLoan365 assets under /public/assets when present, and    ║
// ║  falls back to styled placeholders so the prototype never breaks.         ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

import { ReactNode, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Collapse from '@mui/material/Collapse'
import { AssetImg, BANNERS, ILLUS, DISCOVER } from './media'
import { Icon, type IconName } from '../Icon'
import { ProductScene, AvatarArt, PromoScene } from './illustrations'
import { useFlow } from '../../workspace/FlowContext'
import { SettingsSections } from '../../screens/SettingsScreen'

const BLUE = '#0052CC'
const GREEN = '#8CC919'

// ─────────────────────────────────────────────────────────────────────────────
// Section label  ("POPULAR LOAN PRODUCTS"  +  optional "See all")
// ─────────────────────────────────────────────────────────────────────────────
export function SectionLabel({ label, action }: { label: string; action?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6' }}>
        {label}
      </Typography>
      {action && (
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: BLUE }}>{action}</Typography>
      )}
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Top bar — avatar + "Welcome back, Krong Kampuchea" + chat & bell
// ─────────────────────────────────────────────────────────────────────────────
export function HomeTopBar({ secondIcon = 'bell' }: { secondIcon?: IconName } = {}) {
  const navigate = useNavigate()
  const { flow } = useFlow()
  // Visitors aren't signed in, so there's no profile to show — display the
  // NongHyup brand logo instead (matching the visitor Home tab). Chat is
  // gated behind sign-up for visitors.
  const isVisitor = flow === 'Visitor'
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 3,
        pt: 2,
        pb: 2,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: '#F5F5F5',
      }}
    >
      {isVisitor ? (
        <Box
          component="img"
          src="/assets/brand/header_logo.svg"
          alt="NongHyup Finance (Cambodia) Plc"
          role="button"
          aria-label="Settings"
          onClick={() => navigate('/settings')}
          sx={{ height: 26, width: 'auto', display: 'block', flex: 1, minWidth: 0, objectFit: 'contain', objectPosition: 'left', cursor: 'pointer', '&:active': { opacity: 0.6 } }}
        />
      ) : (
        /* Tap the profile (avatar + name) to open the Profile screen. */
        <Box
          onClick={() => navigate('/profile')}
          role="button"
          aria-label="Open profile"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0, cursor: 'pointer', '&:active': { opacity: 0.6 } }}
        >
          <Box sx={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <AssetImg
              src={ILLUS.avatar01}
              alt="avatar"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              fallback={<AvatarArt />}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, color: '#8A94A6', lineHeight: 1.2 }}>Good morning!</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A', lineHeight: 1.3 }} noWrap>
              Krong Kampuchea
            </Typography>
          </Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <IconButton onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/chat') : '/chat')} size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Messages">
          <Badge badgeContent={isVisitor ? 0 : 2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 15, minWidth: 15 } }}>
            <Box component="img" src="/assets/brand/ico_chat.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
          </Badge>
        </IconButton>
        <IconButton onClick={() => navigate('/notifications')} size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Notifications">
          <Box component="img" src="/assets/brand/ico_bell.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
        </IconButton>
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// "More" menu atoms — section label, quick-action tile, and nav row
// ─────────────────────────────────────────────────────────────────────────────
function MoreSectionLabel({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', mb: 1 }}>
      {children}
    </Typography>
  )
}

function MoreTile({ icon, label, onClick }: { icon: IconName; label: string; onClick?: () => void }) {
  return (
    <Box
      onClick={onClick}
      role="button"
      aria-label={label}
      sx={{
        bgcolor: '#fff',
        borderRadius: '14px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        cursor: 'pointer',
        transition: 'transform 0.12s, background 0.12s',
        '&:active': { transform: 'scale(0.98)', bgcolor: '#F8FAFC' },
      }}
    >
      <Box sx={{ width: 40, height: 40, borderRadius: '11px', bgcolor: '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={22} color="#1A1A1A" />
      </Box>
      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#0B0F1A' }}>{label}</Typography>
    </Box>
  )
}

function MoreRow({ icon, label, onClick, divider }: { icon: IconName; label: string; onClick?: () => void; divider?: boolean }) {
  return (
    <Box
      onClick={onClick}
      role="button"
      aria-label={label}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: '14px',
        py: '12px',
        cursor: 'pointer',
        borderBottom: divider ? '1px solid #F1F4F8' : 'none',
        transition: 'background 0.12s',
        '&:hover': { bgcolor: '#F8FAFC' },
        '&:active': { bgcolor: '#EAF1FB' },
      }}
    >
      <Icon name={icon} size={24} color="#1A1A1A" />
      <Typography sx={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: '#0B0F1A' }}>{label}</Typography>
      <Icon name="chevronRight" size={20} color="#C2C9D4" />
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared "More" menu body — rendered full-page by the More screen.
// `greeting` swaps the back-chevron/profile header for the personalized
// HomeTopBar (used when More is a logged-in bottom-nav tab).
export function MoreMenuBody({
  onBack,
  greeting = false,
}: {
  onBack?: () => void
  greeting?: boolean
}) {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const isVisitor = flow === 'Visitor'
  return (
    <Box className="scroll-content" sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#F5F5F5' }}>
      {greeting ? (
        <HomeTopBar />
      ) : (
        /* Header — back chevron + profile (brand logo for visitors) */
        <Box sx={{ px: 3, pt: 4, pb: 1 }}>
          <IconButton size="small" onClick={onBack} sx={{ ml: -1, mb: 2, color: '#3A4256' }} aria-label="Back">
            <Icon name="chevronLeft" />
          </IconButton>
          {isVisitor ? (
            <Box
              component="img"
              src="/assets/brand/header_logo.svg"
              alt="NongHyup Finance (Cambodia) Plc"
              role="button"
              aria-label="Settings"
              onClick={() => navigate('/settings')}
              sx={{ height: 26, width: 'auto', display: 'block', objectFit: 'contain', objectPosition: 'left', cursor: 'pointer', '&:active': { opacity: 0.6 } }}
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <AssetImg
                  src={ILLUS.orb}
                  alt="avatar"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  fallback={<AvatarArt />}
                />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 19, fontWeight: 800, color: '#0B0F1A', lineHeight: 1.2 }} noWrap>
                  Krong Kampuchea
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#8A94A6', mt: 0.25 }}>ID: 00239913</Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* Menu */}
      <Box sx={{ flex: 1, px: 3, pt: 2, pb: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Account entry — sign-up prompt for visitors only. Signed-in flows
            (New User / Applicant / Borrower) reach their profile elsewhere. */}
        {isVisitor && (
          <Box
            role="button"
            onClick={() => navigate('/sign-up')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '16px', borderRadius: '14px', bgcolor: '#fff', cursor: 'pointer', '&:active': { opacity: 0.85 } }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#0B0F1A', lineHeight: 1.2 }}>Welcome!</Typography>
              <Typography sx={{ fontSize: 13, color: '#8A94A6', mt: 0.25 }}>Sign up to apply loan faster</Typography>
            </Box>
            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: BLUE, borderRadius: '10px', p: '8px' }}>
              <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: '#fff' }}>Get Started</Typography>
              <Icon name="arrowRight" size={18} color="#fff" />
            </Box>
          </Box>
        )}

        {/* Quick actions */}
        <Box>
          <MoreSectionLabel>QUICK ACTIONS</MoreSectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <MoreTile icon="calculator" label="Calculator" onClick={() => navigate('/calculator')} />
            <MoreTile icon="findBranch" label="Find a Branch" onClick={() => navigate('/branch-locator')} />
            <MoreTile icon="message" label="Live Chat" onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/chat') : '/chat')} />
            <MoreTile icon="gauge" label="Credit Score" onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/credit-score') : '/credit-score')} />
          </Box>
        </Box>

        {/* Services */}
        <Box>
          <MoreSectionLabel>SUPPORT</MoreSectionLabel>
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            <MoreRow icon="phone" label="Request a consultation" divider onClick={() => navigate('/request-consult')} />
            <MoreRow icon="blogs" label="Blogs & Education" divider onClick={() => navigate('/blogs')} />
            <MoreRow icon="faq" label="FAQ" divider onClick={() => navigate('/faq')} />
            <MoreRow icon="feedback" label="Feedback" onClick={() => navigate('/send-feedback')} />
          </Box>
        </Box>

        {/* Settings — Account / Notifications / Appearance / About + Sign out */}
        <SettingsSections />

        {/* Footer */}
        <Typography sx={{ fontSize: 11.5, color: '#B6BDC8', textAlign: 'center', pt: 1, pb: 1 }}>
          NongHyup v1.0.0 · build 2026
        </Typography>
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Currency toggle pill  (USD | KHR)
// ─────────────────────────────────────────────────────────────────────────────
export function CurrencyToggle({ value, onChange }: { value: 'USD' | 'KHR'; onChange: (c: 'USD' | 'KHR') => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', height: 40, bgcolor: '#EBEBEC', borderRadius: 999, p: '4px', gap: 0.5 }}>
      {(['USD', 'KHR'] as const).map((c) => (
        <Box
          key={c}
          onClick={() => onChange(c)}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s',
            color: value === c ? '#0B0F1A' : '#71717A',
            bgcolor: value === c ? '#fff' : 'transparent',
            boxShadow: value === c ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          {c}
        </Box>
      ))}
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Donut — outstanding ring (green progress arc)
// ─────────────────────────────────────────────────────────────────────────────
export function OutstandingDonut({ pct = 60, centerText, blurred = false }: { pct?: number; centerText?: string; blurred?: boolean }) {
  const SIZE = 92
  const STROKE = 8
  const r = (SIZE - STROKE) / 2
  const c = 2 * Math.PI * r
  return (
    <Box sx={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
      <Box component="svg" width={SIZE} height={SIZE} sx={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={r} fill="none" stroke="#E7ECF2" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={r}
          fill="none"
          stroke={GREEN}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
        />
      </Box>
      {/* center: amount on top, label below */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            color: '#0B0F1A',
            fontWeight: 800,
            lineHeight: 1.2,
            filter: blurred ? 'blur(5px)' : 'none',
            userSelect: blurred ? 'none' : 'auto',
          }}
          noWrap
        >
          {centerText ?? ''}
        </Typography>
        <Typography sx={{ fontSize: 9, color: '#8A94A6', fontWeight: 600, lineHeight: 1 }}>outstanding</Typography>
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary card — currency toggle, total outstanding, donut, view-full link
// ─────────────────────────────────────────────────────────────────────────────
// Riel figures use the same KHR≈4,100/USD rate applied to the dollar amounts below.
const SUMMARY_ROWS = [
  { label: 'Paid to date', usd: '$3,860', khr: '៛15,826,000', pct: '45%', color: '#275CB2' },
  { label: 'Outstanding', usd: '$4,780', khr: '៛19,598,000', pct: '55%', color: GREEN },
  { label: 'Total approved', usd: '$8,640', khr: '៛35,424,000', pct: '100%', color: '#F0F0F0' },
]

export function SummaryCard({ children, loanCount = 3, defaultExpanded = false }: { children?: ReactNode; loanCount?: number; defaultExpanded?: boolean }) {
  const [hidden, setHidden] = useState(false)
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [cur, setCur] = useState<'USD' | 'KHR'>('USD')
  const isKHR = cur === 'KHR'
  const total = isKHR ? '៛19,598,000' : '$4,780.00'
  const totalShort = isKHR ? '៛19.6M' : '$4,780'

  return (
    <Card>
      <CurrencyToggle value={cur} onChange={setCur} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
        <OutstandingDonut pct={55} centerText={totalShort} blurred={hidden} />
        <Box sx={{ flex: 1, ml: '34px' }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6' }}>
            TOTAL OUTSTANDING
          </Typography>
          {/* Total amount + show/hide eye at the end */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Typography
              sx={{
                fontSize: 26,
                fontWeight: 800,
                color: '#0B0F1A',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
                filter: hidden ? 'blur(8px)' : 'none',
                userSelect: hidden ? 'none' : 'auto',
                transition: 'filter 0.15s',
              }}
            >
              {total}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setHidden((v) => !v)}
              aria-label={hidden ? 'Show amount' : 'Hide amount'}
              sx={{ p: 0.25, color: BLUE }}
            >
              {hidden ? <Icon name="eyeOff" size={18} /> : <Icon name="eye" size={18} />}
            </IconButton>
          </Box>
          <Typography sx={{ fontSize: 14, color: '#3A4256', mt: 0.5 }}>
            {loanCount} active loan{loanCount > 1 ? 's' : ''}
          </Typography>
          <Box
            onClick={() => setExpanded((v) => !v)}
            role="button"
            aria-expanded={expanded}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, mt: 1.5, cursor: 'pointer' }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: BLUE }}>View summary</Typography>
            <Box
              component="span"
              sx={{ display: 'inline-flex', color: BLUE, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none' }}
            >
              <Icon name="chevronDown" size={18} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Collapsible breakdown */}
      <Collapse in={expanded} timeout={250} unmountOnExit>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mt: 2 }}>
          {SUMMARY_ROWS.map((row) => (
            <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: row.color, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 13.5, color: '#3A4256' }}>{row.label}</Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0B0F1A',
                  filter: hidden ? 'blur(7px)' : 'none',
                  userSelect: hidden ? 'none' : 'auto',
                  transition: 'filter 0.15s',
                }}
              >
                {isKHR ? row.khr : row.usd} <Box component="span" sx={{ color: '#8A94A6', fontWeight: 600 }}>({row.pct})</Box>
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
      {children}
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Advance card — payments made after the daily cut-off time (shown under summary)
// ─────────────────────────────────────────────────────────────────────────────
export function AdvanceCard({ amount = '$320.00' }: { amount?: string } = {}) {
  const navigate = useNavigate()
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/advance')}>
      <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#EEF3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="clock" size={22} color={BLUE} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#0B0F1A', lineHeight: 1.2 }}>Advance</Typography>
        <Typography sx={{ fontSize: 12, color: '#8A94A6', mt: 0.25, lineHeight: 1.3 }}>
          Payment that not reach cut off time
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#0B0F1A' }}>{amount}</Typography>
        <Icon name="chevronRight" size={20} color="#8A94A6" />
      </Box>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Active loan card — Small Business Loan + progress + next payment + Pay Now
// ─────────────────────────────────────────────────────────────────────────────
export function ActiveLoanBody({ title = 'Small Business Loan', paid = false }: { title?: string; paid?: boolean }) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>{title}</Typography>
        <StatusChip label="Active" color="#275CB2" bg="#D8E9FF" />
      </Box>

      {/* progress */}
      <Box sx={{ mt: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
          <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>8 of 24</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#3A4256' }}>33%</Typography>
        </Box>
        <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#E7ECF2', overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: '33%', bgcolor: '#000', borderRadius: 3 }} />
        </Box>
      </Box>

      {/* payment row — paid: next-payment date + View Details · unpaid: due date + Pay */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Icon name="clock" size={14} color="#8A94A6" />
          <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>
            {paid ? 'Next Payment 20 May' : 'Due Date 20 May'}
          </Typography>
        </Box>
        {paid ? (
          <Button variant="outlined" sx={{ height: 40, borderRadius: '10px', px: 2.5, fontSize: 14 }}>
            View Details
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<Icon name="pay" size={18} />}
            sx={{ height: 40, borderRadius: '10px', px: 2.5, fontSize: 14 }}
          >
            Pay $320.00
          </Button>
        )}
      </Box>
    </>
  )
}

export function ActiveLoanCard({ title, paid = false }: { title?: string; paid?: boolean }) {
  return (
    <Card>
      <ActiveLoanBody title={title} paid={paid} />
    </Card>
  )
}

// Compact loan card — used in the multi-loan grid (2 / 3 / 4 loans).
// `wide` lays it out horizontally (progress left, Pay button right) for a full-width slot.
export function CompactLoanCard({ title, wide = false }: { title: string; wide?: boolean }) {
  const header = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0B0F1A' }} noWrap>{title}</Typography>
      <StatusChip label="Active" color="#275CB2" bg="#D8E9FF" />
    </Box>
  )
  const progress = (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
        <Typography sx={{ fontSize: 11, color: '#8A94A6' }}>8 of 24</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#3A4256' }}>33%</Typography>
      </Box>
      <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#E7ECF2', overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: '33%', bgcolor: '#000', borderRadius: 3 }} />
      </Box>
    </>
  )
  const payBtn = (
    <Button
      variant="contained"
      startIcon={<Icon name="pay" size={17} />}
      sx={{ height: 38, borderRadius: '10px', fontSize: 13, px: 2.5, flexShrink: 0 }}
    >
      Pay $320.00
    </Button>
  )

  if (wide) {
    return (
      <Card sx={{ p: 2 }}>
        {header}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>{progress}</Box>
          {payBtn}
        </Box>
      </Card>
    )
  }

  return (
    <Card sx={{ p: 2 }}>
      {header}
      <Box sx={{ mt: 1.5 }}>{progress}</Box>
      <Box sx={{ mt: 2, '& .MuiButton-root': { width: '100%' } }}>{payBtn}</Box>
    </Card>
  )
}

// Active-loan section — switches layout by number of active loans
const COMPACT_LOAN_NAMES = ['SBL', 'SME', 'SBL', 'SME']

export function ActiveLoansSection({ count, paid = false }: { count: 1 | 2 | 3 | 4; paid?: boolean }) {
  if (count === 1) {
    return (
      <Box>
        <SectionLabel label="ACTIVE LOAN (1)" />
        <ActiveLoanCard paid={paid} />
      </Box>
    )
  }
  const names = COMPACT_LOAN_NAMES.slice(0, count)
  return (
    <Box>
      <SectionLabel label={`ACTIVE LOAN (${count})`} action={count >= 3 ? 'See all' : undefined} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {names.map((n, i) => {
          // For 3 loans, the last (odd) card spans full width.
          const isLastFullWidth = count === 3 && i === names.length - 1
          return (
            <Box key={i} sx={isLastFullWidth ? { gridColumn: '1 / -1' } : undefined}>
              <CompactLoanCard title={n} wide={isLastFullWidth} />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Apply-loan cards — Non-MWL (teal, briefcase) + MWL (green, airplane)
// ─────────────────────────────────────────────────────────────────────────────
export function ApplyLoanCards({ variant = 'color', loggedIn = false }: { variant?: 'color' | 'white'; loggedIn?: boolean }) {
  const navigate = useNavigate()
  const { flow } = useFlow()
  // Visitors aren't signed in — any apply tap routes to sign-up first.
  const isVisitor = flow === 'Visitor' && !loggedIn
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <ApplyCard title="Apply Loan Non-MWL" subtitle={'Domestic\nborrowers'} img={ILLUS.briefcase} iconName="briefcase" color="#45A89C" variant={variant} onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/nonmwl-about') : '/nonmwl-about')} />
      <ApplyCard title="Apply Loan MWL" subtitle={'Migrant\nworkers'} img={ILLUS.mwl} iconName="plane" color="#1FA84F" variant={variant} onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/mwl-about') : '/mwl-about')} />
    </Box>
  )
}

function ApplyCard({ title, subtitle, img, iconName, color, variant = 'color', onClick }: { title: string; subtitle: string; img: string; iconName: IconName; color: string; variant?: 'color' | 'white'; onClick?: () => void }) {
  const isWhite = variant === 'white'
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        borderRadius: '12px',
        p: 2.5,
        minHeight: 116,
        ...(isWhite
          ? { bgcolor: '#fff', border: '1px solid #ECEFF3', boxShadow: '0 1px 3px rgba(16,24,40,0.04)' }
          : {
              color: '#fff',
              background: `linear-gradient(140deg, ${color} 0%, color-mix(in srgb, ${color} 80%, #000) 100%)`,
              border: '1px solid rgba(0,0,0,0.1)',
            }),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:active': { transform: 'scale(0.98)' },
        transition: 'transform 0.12s',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '72%' }}>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 800,
            lineHeight: 1.2,
            color: isWhite ? '#0B0F1A' : '#fff',
            textShadow: isWhite ? 'none' : '0 1px 4px rgba(0,0,0,0.28)',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            mt: 0.5,
            whiteSpace: 'pre-line',
            lineHeight: 1.3,
            color: isWhite ? '#8A94A6' : 'rgba(255,255,255,0.95)',
            textShadow: isWhite ? 'none' : '0 1px 3px rgba(0,0,0,0.22)',
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: -15,
          bottom: -9,
          width: 96,
          height: 88,
          pointerEvents: 'none',
        }}
      >
        <AssetImg
          src={img}
          alt=""
          sx={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom right' }}
          fallback={
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', pr: 1, pb: 1 }}>
              <Icon name={iconName} size={64} color={isWhite ? `${color}33` : 'rgba(255,255,255,0.28)'} />
            </Box>
          }
        />
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Popular Loan Products — horizontal scroller of self-contained designed cards
// (gradient + icon + rate badge + amount), no image files required.
// ─────────────────────────────────────────────────────────────────────────────
const POPULAR_PRODUCTS: { name: string; amount: string; rate: string; img: string; kind: 'sme' | 'housing' | 'agri' | 'shop' }[] = [
  { name: 'SME Loan', amount: 'USD ≤ 100,000', rate: '1.4%', img: BANNERS.productSme, kind: 'sme' },
  { name: 'Housing Loan', amount: 'USD ≤ 300,000', rate: '1.4%', img: BANNERS.productHousing, kind: 'housing' },
  { name: 'Micro Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.productAgri, kind: 'agri' },
  { name: 'Small Biz Loan', amount: 'USD ≤ 30,000', rate: '1.2%', img: BANNERS.productSmallBiz, kind: 'shop' },
]

export function ProductScroller() {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, mx: -0.5, px: 0.5 }} className="scroll-content">
      {POPULAR_PRODUCTS.map(({ name, amount, rate, img, kind }) => (
        <Box
          key={name}
          sx={{ width: 158, flexShrink: 0, borderRadius: '12px', overflow: 'hidden', bgcolor: '#fff', border: '1px solid #ECEFF3' }}
        >
          <Box sx={{ position: 'relative', height: 118 }}>
            <AssetImg
              src={img}
              alt={name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              fallback={<ProductScene kind={kind} />}
            />
            <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: '8px', px: 0.75, py: 0.25 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#0B0F1A' }}>{rate}</Typography>
            </Box>
          </Box>
          <Box sx={{ px: 1.25, py: 1.25 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0B0F1A' }} noWrap>{name}</Typography>
            <Box
              sx={{
                display: 'inline-flex',
                mt: 0.75,
                px: 1.25,
                py: '4px',
                bgcolor: '#F4F6F9',
                border: '1px solid #E7ECF2',
                borderRadius: '8px',
              }}
            >
              <Typography sx={{ fontSize: 11, color: '#8A94A6' }}>{amount}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// News & promotions — carousel of real promo banners (swipe / tap dots)
// ─────────────────────────────────────────────────────────────────────────────
const NEWS_SLIDES = [
  { src: BANNERS.migrant, hue: 210, label: 'ពលករក្រៅប្រទេស' },
  { src: BANNERS.enterprise, hue: 205, label: 'សហគ្រាសខ្នាតតូច' },
  { src: BANNERS.housing, hue: 215, label: 'គេហដ្ឋាន' },
  { src: BANNERS.micro, hue: 95, label: 'ខ្នាតតូចបំផុត' },
]

export function NewsBanner() {
  const [idx, setIdx] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  // Track the active slide from the scroll position (native swipe)
  const handleScroll = () => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== idx) setIdx(i)
  }

  const goTo = (i: number) => {
    const el = trackRef.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', bgcolor: '#0A4DA6' }}>
      {/* Swipeable track — scroll-snap gives native touch swipe */}
      <Box
        ref={trackRef}
        onScroll={handleScroll}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {NEWS_SLIDES.map((slide) => (
          <Box
            key={slide.label}
            sx={{ flex: '0 0 100%', width: '100%', aspectRatio: '2.9 / 1', scrollSnapAlign: 'start', position: 'relative' }}
          >
            <AssetImg
              src={slide.src}
              alt={slide.label}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              fallback={
                <Box sx={{ position: 'absolute', inset: 0 }}>
                  <PromoScene hue={slide.hue} />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      px: 3,
                      fontFamily: `'Noto Sans Khmer', sans-serif`,
                      fontWeight: 800,
                      fontSize: 18,
                      textShadow: '0 1px 5px rgba(0,0,0,0.35)',
                    }}
                  >
                    {slide.label}
                  </Box>
                </Box>
              }
            />
          </Box>
        ))}
      </Box>

      {/* dots — overlapping the image, bottom-center */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 0.75,
          zIndex: 2,
        }}
      >
        {NEWS_SLIDES.map((_, i) => (
          <Box
            key={i}
            onClick={() => goTo(i)}
            sx={{
              width: i === idx ? 16 : 6,
              height: 6,
              borderRadius: 3,
              bgcolor: i === idx ? '#fff' : 'rgba(255,255,255,0.55)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Discover row — Calculator tile + news cards (horizontal scroll)
// ─────────────────────────────────────────────────────────────────────────────
export function DiscoverRow() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, mx: -0.5, px: 0.5 }} className="scroll-content">
      {/* Calculator */}
      <Box onClick={() => navigate('/calculator')} sx={{ width: 130, height: 218, flexShrink: 0, borderRadius: '8px', position: 'relative', overflow: 'hidden', bgcolor: '#0E5C54', cursor: 'pointer' }}>
        <AssetImg
          src={DISCOVER.calculator}
          alt="Calculator"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          fallback={
            <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #1A1A2E 0%, #2D2D4A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="calculator" size={52} color="rgba(255,255,255,0.9)" />
            </Box>
          }
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 45%)' }} />
        <Box sx={{ position: 'absolute', top: 10, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Calculator</Typography>
          <Icon name="arrowRight" size={15} color="#fff" />
        </Box>
      </Box>
      {/* News cards */}
      {([
        ['Khmer New Year promotion', 'Lower micro-loan rates this season — apply b…', BANNERS.micro, 28],
        ['Migrant Worker offer', 'Special rate for overseas workers — limited…', BANNERS.migrant, 205],
      ] as [string, string, string, number][]).map(([title, body, img, hue], i) => (
        <Box key={i} sx={{ width: 160, height: 218, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', bgcolor: '#fff', border: '1px solid #ECEFF3' }}>
          <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <AssetImg
              src={img}
              alt={title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              fallback={<PromoScene hue={hue} />}
            />
          </Box>
          <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ bgcolor: '#FFF1DC', color: '#B25E00', fontSize: 9, fontWeight: 800, px: 0.875, py: 0.375, borderRadius: '6px', mb: 0.75 }}>
              NEWS
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#0B0F1A', lineHeight: 1.3 }}>{title}</Typography>
            <Typography sx={{ fontSize: 10, color: '#8A94A6', mt: 0.5, lineHeight: 1.4 }}>{body}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Small reusable atoms
// ─────────────────────────────────────────────────────────────────────────────
export function Card({ children, sx, onClick }: { children: ReactNode; sx?: object; onClick?: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: '#fff',
        borderRadius: '16px',
        border: 'none',
        boxShadow: 'none',
        p: 2.5,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export function StatusChip({ label, color, bg, outlined = false }: { label: string; color: string; bg?: string; outlined?: boolean }) {
  return (
    <Box
      sx={{
        fontSize: 11,
        fontWeight: 700,
        px: 1.25,
        py: 0.5,
        borderRadius: 1.5,
        color: outlined ? color : bg ? color : '#fff',
        bgcolor: outlined ? 'transparent' : bg ?? color,
        border: outlined ? `1px solid ${color}55` : 'none',
      }}
    >
      {label}
    </Box>
  )
}
