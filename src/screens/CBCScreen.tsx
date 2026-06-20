import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'
import type { IconName } from '../components/Icon'
import PinGateScreen from './PinGateScreen'

// ─────────────────────────────────────────────────────────────────────────────
// CBC (Credit Bureau Cambodia) mini-app
// Flow: first-time intro alert → PIN gate → CBC form → CBC home dashboard
// ─────────────────────────────────────────────────────────────────────────────
const GREEN      = '#0C5C30'
const GREEN_DARK = '#094A26'
const GREEN_MID  = '#1A7A42'
const GREEN_LIGHT = '#E8F5EE'
const CARD_BG    = '#D5E8D9'
const MUTED      = '#8A94A6'

const FIRST_TIME_KEY = 'cbc_intro_seen'
type Stage = 'intro' | 'pin' | 'content' | 'home'

// ─── Gauge constants (270° donut arc) ────────────────────────────────────────
const GCX = 100, GCY = 105, GR = 78
const GC  = 2 * Math.PI * GR          // ≈ 490.09  full circumference
const GARC = GC * (270 / 360)          // ≈ 367.57  visible arc
const GSEG = GARC / 7                  // ≈ 52.51   each color segment
const G_COLORS = ['#B71C1C', '#F44336', '#FF7043', '#FFA726', '#CDDC39', '#8BC34A', '#43A047']

// ─── Dropdown field ───────────────────────────────────────────────────────────
function DropdownField({ label, placeholder, required = true }: { label: string; placeholder: string; required?: boolean }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#0B0F1A' }}>{label}</Typography>
        {required && <Typography sx={{ fontSize: 14, color: '#E11D48' }}>*</Typography>}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F4F6F8', borderRadius: '12px', px: 2, height: 52 }}>
        <Typography sx={{ fontSize: 14, color: MUTED }}>{placeholder}</Typography>
        <Icon name="chevronDown" size={20} color={GREEN} />
      </Box>
    </Box>
  )
}

// ─── CBC home/dashboard ───────────────────────────────────────────────────────
const CBC_SERVICES: { label: string; icon: IconName }[] = [
  { label: 'My Report',         icon: 'appPolicy' },
  { label: 'Order History',     icon: 'calendarClock' },
  { label: 'K Score',           icon: 'gauge' },
  { label: 'Order Report',      icon: 'banknote' },
  { label: 'Subscription Plan', icon: 'layers' },
  { label: 'My Monitoring',     icon: 'search' },
]

function CBCHome() {
  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: GREEN }}>

      {/* ── Header ── */}
      <Box sx={{ px: 3, pt: 3, pb: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 54, height: 54, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.55)', bgcolor: CARD_BG, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="myLoan" size={28} color={GREEN} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Good Evening Krong!</Typography>
          <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>19 Jun 2026 · 05:36 pm</Typography>
        </Box>
      </Box>

      {/* ── Scrollable body ── */}
      <Box className="scroll-content" sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* K-Score card */}
        <Box sx={{ bgcolor: CARD_BG, borderRadius: '20px', px: 2.5, pt: 2.5, pb: 2, position: 'relative' }}>
          <IconButton size="small" sx={{ position: 'absolute', top: 10, right: 10, p: 0.5 }}>
            <Icon name="eyeOff" size={20} color="#4A7A54" />
          </IconButton>

          {/* Donut gauge — SVG */}
          <svg viewBox="0 0 200 168" style={{ width: '100%', display: 'block' }}>
            {/* Background track */}
            <circle
              cx={GCX} cy={GCY} r={GR}
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={18}
              strokeLinecap="butt"
              strokeDasharray={`${GARC} ${GC - GARC}`}
              strokeDashoffset={0}
              transform={`rotate(135, ${GCX}, ${GCY})`}
            />
            {/* Colored segments */}
            {G_COLORS.map((color, i) => (
              <circle
                key={i}
                cx={GCX} cy={GCY} r={GR}
                fill="none"
                stroke={color}
                strokeWidth={18}
                strokeLinecap="round"
                strokeDasharray={`${GSEG - 3} ${GC - GSEG + 3}`}
                strokeDashoffset={-(i * GSEG)}
                transform={`rotate(135, ${GCX}, ${GCY})`}
              />
            ))}
            {/* Center labels */}
            <text x={GCX} y={GCY - 6}  textAnchor="middle" fontSize="13"   fontWeight="bold" fill="#1B5E20">My K-Score</text>
            <text x={GCX} y={GCY + 13} textAnchor="middle" fontSize="11.5" fill="#4CAF50">No transaction</text>
            {/* Scale labels */}
            <text x="20"  y="161" fontSize="11.5" fontWeight="bold" fill="#4A7A54">100</text>
            <text x="155" y="161" fontSize="11.5" fontWeight="bold" fill="#4A7A54">1400</text>
          </svg>

          {/* Date + Overview */}
          <Box sx={{ textAlign: 'center', mt: -0.5 }}>
            <Typography sx={{ fontSize: 13, color: '#4A7A54' }}>19 Jun, 2026</Typography>
            <Typography component="span" role="button" sx={{ fontSize: 13.5, color: GREEN, fontStyle: 'italic', fontWeight: 700, cursor: 'pointer' }}>
              Overview
            </Typography>
          </Box>
        </Box>

        {/* CBC Services */}
        <Box sx={{ bgcolor: CARD_BG, borderRadius: '20px', p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B0F1A' }}>CBC Services</Typography>
            <Box role="button" sx={{ display: 'flex', alignItems: 'center', gap: 0.25, cursor: 'pointer' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: GREEN }}>All Services</Typography>
              <Icon name="chevronRight" size={16} color={GREEN} />
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
            {CBC_SERVICES.map((s) => (
              <Box key={s.label} role="button" sx={{ bgcolor: '#fff', borderRadius: '14px', p: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.75, cursor: 'pointer', minHeight: 84, '&:active': { opacity: 0.75 } }}>
                <Icon name={s.icon} size={28} color={GREEN} />
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: '#0B0F1A', textAlign: 'center', lineHeight: 1.25 }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* News and Promotions */}
        <Box sx={{ bgcolor: CARD_BG, borderRadius: '20px', px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B0F1A' }}>News and Promotions</Typography>
          <Icon name="chevronRight" size={18} color={MUTED} />
        </Box>
      </Box>

      {/* ── Bottom tab bar ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', px: 1, py: 1.25, bgcolor: GREEN, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Box role="button" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: GREEN_MID, borderRadius: '999px', px: 2, py: 0.875, cursor: 'pointer' }}>
          <Icon name="home" size={20} color="#fff" />
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Home</Typography>
        </Box>
        <IconButton sx={{ color: 'rgba(255,255,255,0.5)', p: 1 }}>
          <Icon name="bell" size={24} color="rgba(255,255,255,0.5)" />
        </IconButton>
        <IconButton sx={{ color: 'rgba(255,255,255,0.5)', p: 1 }}>
          <Icon name="message" size={24} color="rgba(255,255,255,0.5)" />
        </IconButton>
        <IconButton sx={{ color: 'rgba(255,255,255,0.5)', p: 1 }}>
          <Icon name="myLoan" size={24} color="rgba(255,255,255,0.5)" />
        </IconButton>
      </Box>
    </Box>
  )
}

// ─── CBC info popup ───────────────────────────────────────────────────────────
const CBC_INFO_ROWS = [
  { icon: 'phone'   as const, text: '+855 23 999 006' },
  { icon: 'email'   as const, text: 'Info@creditbureau.com.kh' },
  { icon: 'globe'   as const, text: 'www.facebook.com/creditbureaucambodia' },
  { icon: 'pin'     as const, text: 'Level 9, Vattanac Capital, Preah Monivong Blvd, Phnom Penh' },
]

function CBCInfoSheet({ onClose }: { onClose: () => void }) {
  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'flex-end', bgcolor: 'rgba(0,0,0,0.4)' }}>
      <Box sx={{ width: '100%', bgcolor: '#fff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', px: 3, pt: 2.5, pb: 3 }}>
        {/* Handle */}
        <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#E0E4EA', mx: 'auto', mb: 2.5 }} />

        {/* Logo badge + title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2.5, gap: 1.5 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: GREEN_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="idCard" size={28} color={GREEN} />
          </Box>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B0F1A', textAlign: 'center' }}>
            Credit Bureau Cambodia
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#5B6473', textAlign: 'center', lineHeight: 1.65 }}>
            Credit Bureau Cambodia (CBC) is the leading provider of financial information, analytical solutions, and credit reporting services to financial institutions and consumers in the Kingdom of Cambodia.
          </Typography>
        </Box>

        {/* Divider */}
        <Box sx={{ height: 1, bgcolor: '#F0F2F5', mb: 2 }} />

        {/* Contact rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {CBC_INFO_ROWS.map((row) => (
            <Box key={row.text} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: GREEN_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={row.icon} size={18} color={GREEN} />
              </Box>
              <Typography sx={{ fontSize: 13.5, color: '#3A4256', lineHeight: 1.55, pt: 0.5 }}>{row.text}</Typography>
            </Box>
          ))}
        </Box>

        {/* Close button */}
        <Button
          variant="outlined"
          fullWidth
          onClick={onClose}
          sx={{ height: 50, borderRadius: '14px', fontSize: 15, fontWeight: 700, color: GREEN, borderColor: GREEN, '&:hover': { borderColor: GREEN_DARK, bgcolor: GREEN_LIGHT } }}
        >
          Close
        </Button>
      </Box>
    </Box>
  )
}

// ─── CBC onboarding form ──────────────────────────────────────────────────────
function CBCContent({ onContinue }: { onContinue: () => void }) {
  const navigate = useNavigate()
  const [infoOpen, setInfoOpen] = useState(false)
  return (
    <Box className="screen-enter" sx={{ height: '100%', position: 'relative', bgcolor: GREEN }}>
      {/* Green header */}
      <Box sx={{ px: 2, pt: 2.5, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: '#fff', p: 0.5 }}>
          <Icon name="arrowLeft" size={24} color="#fff" />
        </IconButton>
        <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
          Credit Bureau Cambodia
        </Typography>
        <IconButton onClick={() => setInfoOpen(true)} sx={{ color: '#fff', p: 0.5 }}>
          <Icon name="info" size={22} color="#fff" />
        </IconButton>
      </Box>

      {/* Info popup */}
      {infoOpen && <CBCInfoSheet onClose={() => setInfoOpen(false)} />}

      {/* White bottom sheet — 70% */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', bgcolor: '#fff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'flex', flexDirection: 'column' }}>
        {/* Scrollable fields */}
        <Box className="scroll-content" sx={{ flex: 1, overflowY: 'auto', px: 3, pt: 2.5, pb: 1 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#E0E4EA', mx: 'auto', mb: 2.5 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: GREEN_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="idCard" size={24} color={GREEN} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: '#0B0F1A' }}>Credit Bureau Cambodia</Typography>
              <Typography sx={{ fontSize: 12, color: MUTED }}>CBC · Official Mini App</Typography>
            </Box>
          </Box>

          <DropdownField label="Marital Status" placeholder="Select marital status" />

          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#0B0F1A', mb: 2 }}>
            Choose your current Address
          </Typography>

          <DropdownField label="Province"  placeholder="Select Province" />
          <DropdownField label="District"  placeholder="Select District" />
          <DropdownField label="Commune"   placeholder="Select Commune" />
          <DropdownField label="Village"   placeholder="Select Village" />
        </Box>

        {/* Pinned Continue button */}
        <Box sx={{ px: 3, pb: 3, pt: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onContinue}
            sx={{ height: 52, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: GREEN, '&:hover': { bgcolor: GREEN_DARK } }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

// ─── Intro alert sheet ────────────────────────────────────────────────────────
function IntroAlert({ onContinue, onCancel }: { onContinue: () => void; onCancel: () => void }) {
  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.45)' }}>
      <Box sx={{ width: '100%', maxWidth: 480, bgcolor: '#fff', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', p: 3, pb: 4 }}>
        <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#E0E4EA', mx: 'auto', mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '20px', bgcolor: GREEN_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="idCard" size={32} color={GREEN} />
          </Box>
        </Box>

        <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0B0F1A', textAlign: 'center', mb: 1 }}>
          Credit Bureau Cambodia
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: '#5B6473', textAlign: 'center', lineHeight: 1.6, mb: 0.5 }}>
          You are about to open the <strong>CBC Mini App</strong> — an integrated service by Credit Bureau Cambodia.
        </Typography>
        <Typography sx={{ fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 1.6, mb: 3 }}>
          This service will request your personal information to generate your official credit report. Your data is handled securely by CBC.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          {['Official Partner', 'SSL Secured', 'BNK Licensed'].map((b) => (
            <Box key={b} sx={{ px: 1.25, py: 0.5, borderRadius: '8px', bgcolor: GREEN_LIGHT }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: GREEN }}>{b}</Typography>
            </Box>
          ))}
        </Box>

        <Button fullWidth variant="contained" onClick={onContinue}
          sx={{ height: 52, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: GREEN, '&:hover': { bgcolor: GREEN_DARK }, mb: 1.5 }}>
          Continue
        </Button>
        <Button fullWidth variant="text" onClick={onCancel}
          sx={{ height: 44, borderRadius: '14px', fontSize: 14, fontWeight: 600, color: MUTED }}>
          Cancel
        </Button>
      </Box>
    </Box>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CBCScreen() {
  const navigate = useNavigate()
  const isFirstTime = !sessionStorage.getItem(FIRST_TIME_KEY)
  const [stage, setStage] = useState<Stage>(isFirstTime ? 'intro' : 'pin')

  if (stage === 'intro') {
    return (
      <Box sx={{ height: '100%', bgcolor: '#F5F5F5' }}>
        <IntroAlert
          onContinue={() => { sessionStorage.setItem(FIRST_TIME_KEY, '1'); setStage('pin') }}
          onCancel={() => navigate(-1)}
        />
      </Box>
    )
  }
  if (stage === 'pin')     return <PinGateScreen onSuccess={() => setStage('content')} />
  if (stage === 'content') return <CBCContent onContinue={() => setStage('home')} />
  return <CBCHome />
}
