// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║  HOME PARTS — shared building blocks for the "Home – new customer" samples ║
// ║                                                                           ║
// ║  Uses the real WeLoan365 assets under /public/assets when present, and    ║
// ║  falls back to styled placeholders so the prototype never breaks.         ║
// ╚═══════════════════════════════════════════════════════════════════════════╝

import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
import CallSheet from '../CallSheet'

const BLUE = '#275CB2'
const GREEN = '#8CC919'

// ─────────────────────────────────────────────────────────────────────────────
// Section label  ("POPULAR LOAN PRODUCTS"  +  optional "See all")
// ─────────────────────────────────────────────────────────────────────────────
export function SectionLabel({ label, action, onAction }: { label: string; action?: string; onAction?: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6' }}>
        {label}
      </Typography>
      {action && (
        <Typography
          role={onAction ? 'button' : undefined}
          onClick={onAction}
          sx={{ fontSize: 13, fontWeight: 600, color: BLUE, cursor: onAction ? 'pointer' : 'default', '&:active': onAction ? { opacity: 0.6 } : undefined }}
        >
          {action}
        </Typography>
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
          onClick={() => navigate(isVisitor ? '/sign-up' : '/settings')}
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
      <Typography sx={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: '#0B0F1A' }}>{label}</Typography>
      <Icon name="chevronRight" size={20} color="#C2C9D4" />
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// My Loan Officer card — shown in the More menu for Applicant / Borrower flows.
// Chat icon → inbox; call icon → shared Call sheet (portaled into the canvas).
// ─────────────────────────────────────────────────────────────────────────────
function MyLoanOfficerCard() {
  const navigate = useNavigate()
  const [callOpen, setCallOpen] = useState(false)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalEl(document.getElementById('phone-canvas'))
  }, [])

  return (
    <Box>
      <MoreSectionLabel>MY OFFICER</MoreSectionLabel>
      <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            flexShrink: 0,
            background: 'radial-gradient(circle at 30% 30%, #9BD0FF 0%, #4C8BE0 45%, #2B4F92 100%)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: '#0B0F1A', lineHeight: 1.3 }}>Mr. Pisey Sok</Typography>
          <Typography sx={{ fontSize: 12, color: '#8A94A6', mt: 0.25 }}>Riverside Branch</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Box
            role="button"
            aria-label="Chat with officer"
            onClick={() => navigate('/chat')}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', transition: 'background-color 0.15s ease', '&:active': { bgcolor: 'rgba(0,0,0,0.06)' } }}
          >
            <Icon name="message" size={22} color="#0B0F1A" />
          </Box>
          <Box
            role="button"
            aria-label="Call officer"
            onClick={() => setCallOpen(true)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', transition: 'background-color 0.15s ease', '&:active': { bgcolor: 'rgba(0,0,0,0.06)' } }}
          >
            <Icon name="phone" size={22} color="#0B0F1A" />
          </Box>
        </Box>
      </Box>

      {portalEl && createPortal(<CallSheet open={callOpen} onClose={() => setCallOpen(false)} />, portalEl)}
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton size="small" onClick={onBack} sx={{ ml: -1, color: '#3A4256' }} aria-label="Back">
              <Icon name="chevronLeft" />
            </IconButton>
            <Box sx={{ flex: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconButton onClick={() => navigate('/chat')} size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Messages">
                <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 15, minWidth: 15 } }}>
                  <Box component="img" src="/assets/brand/ico_chat.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
                </Badge>
              </IconButton>
              <IconButton onClick={() => navigate('/notifications')} size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Notifications">
                <Box component="img" src="/assets/brand/ico_bell.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
              </IconButton>
            </Box>
          </Box>
          {isVisitor ? (
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#0B0F1A' }}>Settings</Typography>
          ) : (
            <Box
              role="button"
              onClick={() => navigate('/profile')}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:active': { opacity: 0.7 } }}
            >
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <AssetImg
                  src={ILLUS.avatar01}
                  alt="avatar"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  fallback={<AvatarArt />}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Good morning!</Typography>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B0F1A', lineHeight: 1.2 }} noWrap>
                  Krong Kampuchea
                </Typography>
              </Box>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate('/settings') }} sx={{ color: '#3A4256', flexShrink: 0 }} aria-label="Settings">
                <Icon name="appSettings" size={22} />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {/* Menu */}
      <Box sx={{ flex: 1, px: 3, pt: '24px', pb: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Account entry — sign-up prompt for visitors only. Signed-in flows
            (Applicant / Borrower) reach their profile elsewhere. */}
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

        {/* Services */}
        <Box>
          <MoreSectionLabel>SUPPORT</MoreSectionLabel>
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            <MoreRow icon="phone" label="Request a consultation" divider onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/request-consult') : '/request-consult')} />
            <MoreRow icon="blogs" label="Blogs & Education" divider onClick={() => navigate('/blogs')} />
            <MoreRow icon="feedback" label="Feedback" divider onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/send-feedback') : '/send-feedback')} />
            <MoreRow icon="calculator" label="Calculator" divider onClick={() => navigate('/calculator')} />
            <MoreRow icon="findBranch" label="Find a Branch" divider onClick={() => navigate('/branch-locator')} />
            <MoreRow icon="gauge" label="Credit Score" onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/credit-score') : '/credit-score')} />
          </Box>
        </Box>

        {/* My loan officer — only relevant once a loan flow is underway */}
        {(flow === 'Applicant' || flow === 'Borrower') && <MyLoanOfficerCard />}

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
      <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#EBEBEC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="cash" size={22} color="#0B0F1A" />
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
  const navigate = useNavigate()
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
          <Button
            variant="outlined"
            onClick={(e) => { e.stopPropagation(); navigate('/my-loan-detail') }}
            sx={{ height: 40, borderRadius: '10px', px: 2.5, fontSize: 14 }}
          >
            View Details
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={(e) => { e.stopPropagation(); navigate('/my-loan-detail?pay=1') }}
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
  const navigate = useNavigate()
  return (
    <Card sx={{ cursor: 'pointer' }} onClick={() => navigate('/my-loan-detail')}>
      <ActiveLoanBody title={title} paid={paid} />
    </Card>
  )
}

// Compact loan card — used in the multi-loan grid (2 / 3 / 4 loans).
// `wide` lays it out horizontally (progress left, Pay button right) for a full-width slot.
export function CompactLoanCard({ title, wide = false }: { title: string; wide?: boolean }) {
  const navigate = useNavigate()
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
      onClick={(e) => { e.stopPropagation(); navigate('/my-loan-detail?pay=1') }}
      startIcon={<Icon name="pay" size={17} />}
      sx={{ height: 38, borderRadius: '10px', fontSize: 13, px: 2.5, flexShrink: 0 }}
    >
      Pay $320.00
    </Button>
  )

  if (wide) {
    return (
      <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate('/my-loan-detail')}>
        {header}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>{progress}</Box>
          {payBtn}
        </Box>
      </Card>
    )
  }

  return (
    <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate('/my-loan-detail')}>
      {header}
      <Box sx={{ mt: 1.5 }}>{progress}</Box>
      <Box sx={{ mt: 2, '& .MuiButton-root': { width: '100%' } }}>{payBtn}</Box>
    </Card>
  )
}

// Active-loan section — switches layout by number of active loans
const COMPACT_LOAN_NAMES = ['SBL', 'SME', 'SBL', 'SME']

export function ActiveLoansSection({ count, paid = false, hideSectionLabel = false }: { count: 1 | 2 | 3 | 4; paid?: boolean; hideSectionLabel?: boolean }) {
  const navigate = useNavigate()
  if (count === 1) {
    return (
      <Box>
        {!hideSectionLabel && <SectionLabel label="ACTIVE LOAN (1)" />}
        <ActiveLoanCard paid={paid} />
      </Box>
    )
  }
  const names = COMPACT_LOAN_NAMES.slice(0, count)
  return (
    <Box>
      {!hideSectionLabel && <SectionLabel label={`ACTIVE LOAN (${count})`} action={count >= 3 ? 'See all' : undefined} onAction={count >= 3 ? () => navigate('/my-loan') : undefined} />}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {names.map((n, i) => {
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
      <ApplyCard title="Apply Loan Non-MWL" subtitle={'Domestic\nborrowers'} img={ILLUS.nonMwl} iconName="briefcase" color="#45A89C" variant={variant} onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/nonmwl-about') : '/nonmwl-about')} />
      <ApplyCard title="Apply Loan MWL" subtitle={'Migrant\nworkers'} img={ILLUS.mwlCard} iconName="plane" color="#1FA84F" variant={variant} onClick={() => navigate(isVisitor ? '/sign-up?next=' + encodeURIComponent('/mwl-about') : '/mwl-about')} />
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
        minHeight: 132,
        ...(isWhite
          ? { bgcolor: '#fff', border: '1px solid #ECEFF3', boxShadow: '0 1px 3px rgba(16,24,40,0.04)' }
          : {
              color: '#fff',
              background: `linear-gradient(135deg, color-mix(in srgb, ${color} 85%, #fff) 0%, ${color} 45%, color-mix(in srgb, ${color} 80%, #000) 100%)`,
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.10)',
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
            fontSize: 18,
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
          right: -8,
          bottom: -8,
          width: 112,
          height: 104,
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
  { name: 'Micro Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.microS1, kind: 'agri' },
  { name: 'Small Biz Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.smallS1, kind: 'shop' },
  { name: 'Housing Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.housingS1, kind: 'housing' },
  { name: 'SME Loan', amount: 'USD ≤ 3,000', rate: '1.2%', img: BANNERS.smeS1, kind: 'sme' },
]

export function ProductScroller() {
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, mx: -0.5, px: 0.5 }} className="scroll-content">
      {POPULAR_PRODUCTS.map(({ name, amount, rate, img, kind }) => (
        <Box
          key={name}
          role="button"
          onClick={() => navigate(`/product-detail?p=${encodeURIComponent(name)}`)}
          sx={{ width: 158, flexShrink: 0, borderRadius: '12px', overflow: 'hidden', bgcolor: '#fff', border: '1px solid #ECEFF3', cursor: 'pointer', '&:active': { transform: 'scale(0.98)' }, transition: 'transform 0.12s' }}
        >
          <Box sx={{ position: 'relative', height: 106 }}>
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
            <Box sx={{ display: 'inline-flex', mt: 0.75, px: 1.25, py: '4px', bgcolor: '#F4F6F9', border: '1px solid #E7ECF2', borderRadius: '8px' }}>
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
  { src: BANNERS.bannerSme, hue: 205, label: 'SME Loan' },
  { src: BANNERS.bannerSbl, hue: 210, label: 'Small Business Loan' },
  { src: BANNERS.bannerMicro, hue: 95, label: 'Micro Loan' },
  { src: BANNERS.bannerMwl, hue: 210, label: 'Migrant Worker Loan' },
  { src: BANNERS.bannerHousing, hue: 215, label: 'Housing Loan' },
]

export function NewsBanner() {
  const navigate = useNavigate()
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
            role="button"
            onClick={() => navigate('/announcement')}
            sx={{ flex: '0 0 100%', width: '100%', aspectRatio: '2.9 / 1', scrollSnapAlign: 'start', position: 'relative', cursor: 'pointer' }}
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
type DiscoverNewsItem = { tag: string; title: string; body: string; img: string; detail: string }

const DISCOVER_NEWS_ITEMS: DiscoverNewsItem[] = [
  {
    tag: 'NEWS',
    title: 'Khmer New Year promotion',
    body: 'Lower micro-loan rates this season — apply by mid-April.',
    img: BANNERS.bannerKhmerNewYear,
    detail: 'Celebrate Khmer New Year with reduced micro-loan rates across all branches. Apply before mid-April to lock in the seasonal rate and enjoy faster approval with fewer documents. Talk to our team to see how much you can save.',
  },
  {
    tag: 'NEWS',
    title: 'Migrant worker support',
    body: 'Special rates for overseas workers and their families.',
    img: BANNERS.bannerSupport,
    detail: 'NongHyup Finance offers dedicated loan packages for migrant workers and their families, with flexible repayment aligned to overseas income. Get help with guarantor setup and remittance-friendly schedules.',
  },
  {
    tag: 'TIPS',
    title: 'Build your credit score',
    body: 'Simple habits that help you qualify for a bigger loan.',
    img: BANNERS.bannerScore,
    detail: 'Paying on time, keeping balances low, and maintaining a steady income are the habits that build a strong credit profile. A better score unlocks larger limits and lower rates on your next loan.',
  },
]

export function DiscoverRow() {
  const navigate = useNavigate()
  const [active, setActive] = useState<DiscoverNewsItem | null>(null)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)
  useEffect(() => { setPortalEl(document.getElementById('phone-canvas')) }, [])

  const sheet = (
    <>
      {/* Backdrop */}
      <Box
        onClick={() => setActive(null)}
        sx={{ position: 'absolute', inset: 0, zIndex: 100, bgcolor: 'rgba(11,15,26,0.45)', opacity: active ? 1 : 0, pointerEvents: active ? 'auto' : 'none', transition: 'opacity 0.25s ease' }}
      />
      {/* Sheet */}
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 101, bgcolor: '#F5F5F5', borderTopLeftRadius: 20, borderTopRightRadius: 20, transform: active ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)', maxHeight: '90%', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 30px rgba(11,15,26,0.18)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.5, flexShrink: 0 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#D6DBE2' }} />
        </Box>
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
          <IconButton onClick={() => setActive(null)} aria-label="Close" sx={{ width: 40, height: 40, bgcolor: '#fff', boxShadow: '0 2px 8px rgba(11,15,26,0.12)', '&:hover': { bgcolor: '#fff' } }}>
            <Icon name="close" size={22} color="#6B7280" />
          </IconButton>
        </Box>
        <Box sx={{ overflowY: 'auto', px: 3, pt: '56px', pb: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#0B0F1A', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
            {active?.title}
          </Typography>
          <Box sx={{ borderRadius: '14px', overflow: 'hidden', height: 200 }}>
            <AssetImg src={active?.img} alt={active?.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} fallback={<Box sx={{ width: '100%', height: '100%', bgcolor: '#2B5BB3' }} />} />
          </Box>
          <Typography sx={{ fontSize: 17, color: '#525866', lineHeight: 1.5 }}>{active?.detail}</Typography>
        </Box>
        <Box sx={{ flexShrink: 0, display: 'flex', gap: 1.5, px: 3, pt: 1, pb: '54px' }}>
          <Box role="button" onClick={() => setActive(null)} sx={{ flex: 1, minHeight: 56, borderRadius: '12px', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:active': { opacity: 0.7 } }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#0B0F1A' }}>Explore</Typography>
          </Box>
          <Box role="button" sx={{ flex: 1, minHeight: 56, borderRadius: '12px', bgcolor: '#275CB2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:active': { opacity: 0.85 } }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Call Now</Typography>
          </Box>
        </Box>
      </Box>
    </>
  )

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, mx: -0.5, px: 0.5 }} className="scroll-content">
        {/* Calculator */}
        <Box onClick={() => navigate('/calculator')} role="button" aria-label="Loan calculator" sx={{ flexShrink: 0, position: 'relative', width: 152, height: 218, borderRadius: '14px', overflow: 'hidden', bgcolor: '#0B1A14', cursor: 'pointer', '&:active': { opacity: 0.85 } }}>
          <AssetImg src={DISCOVER.calculator} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} fallback={<Box sx={{ width: '100%', height: '100%', bgcolor: '#0B1A14' }} />} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)' }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '12px' }}>
            <Typography sx={{ color: '#fff', fontSize: 16, fontWeight: 800, letterSpacing: '-0.2px' }}>Calculator</Typography>
            <Icon name="arrowRight" size={18} color="#fff" />
          </Box>
        </Box>
        {/* News cards */}
        {DISCOVER_NEWS_ITEMS.map((item) => (
          <Box key={item.title} role="button" onClick={() => setActive(item)} sx={{ flexShrink: 0, width: 152, height: 218, borderRadius: '14px', overflow: 'hidden', bgcolor: '#fff', border: '1px solid #ECEFF3', display: 'flex', flexDirection: 'column', cursor: 'pointer', '&:active': { opacity: 0.85 } }}>
            <Box sx={{ height: 106, flexShrink: 0 }}>
              <AssetImg src={item.img} alt={item.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} fallback={<Box sx={{ width: '100%', height: '100%', bgcolor: '#E7ECF2' }} />} />
            </Box>
            <Box sx={{ p: '12px', display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, minHeight: 0 }}>
              <Box sx={{ alignSelf: 'flex-start', bgcolor: item.tag === 'TIPS' ? '#E3F7EC' : '#FBF0CE', borderRadius: '6px', px: 0.75, py: '2px' }}>
                <Typography sx={{ fontSize: 9, fontWeight: 800, color: item.tag === 'TIPS' ? '#1A7F4B' : '#C79200', letterSpacing: '0.5px' }}>{item.tag}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0B0F1A', lineHeight: 1.2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.title}</Typography>
              <Typography sx={{ fontSize: 11, color: '#8A94A6', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.body}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      {portalEl ? createPortal(sheet, portalEl) : sheet}
    </>
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
