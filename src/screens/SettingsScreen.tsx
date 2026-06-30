import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import { Icon, type IconName } from '../components/Icon'
import { Flag, type FlagCode } from '../components/Flag'
import { AssetImg, ILLUS } from '../components/home/media'
import { AvatarArt } from '../components/home/illustrations'
import { useFlow } from '../workspace/FlowContext'
import { BottomSheet } from './mwl/MwlParts'
import CallSheet from '../components/CallSheet'
import PinGateScreen from './PinGateScreen'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const DANGER = '#E11D48'

// Appearance picker options.
type LangId = 'en' | 'km' | 'ko'
const LANGUAGES: { id: LangId; label: string; flag: FlagCode }[] = [
  { id: 'en', label: 'English', flag: 'gb' },
  { id: 'km', label: 'ខ្មែរ', flag: 'kh' },
  { id: 'ko', label: '한국어', flag: 'kr' },
]
type ThemeId = 'System' | 'Light' | 'Dark'
const THEMES: { id: ThemeId; icon: IconName }[] = [
  { id: 'System', icon: 'smartphone' },
  { id: 'Light', icon: 'sun' },
  { id: 'Dark', icon: 'moon' },
]

// ─── Reusable settings cards ─────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1 }}>
      {children}
    </Typography>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden' }}>{children}</Box>
  )
}

function RowShell({
  icon,
  label,
  sub,
  divider,
  onClick,
  right,
}: {
  icon: IconName
  label: string
  sub?: string
  divider?: boolean
  onClick?: () => void
  right: React.ReactNode
}) {
  return (
    <Box
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: '14px',
        py: '12px',
        cursor: onClick ? 'pointer' : 'default',
        borderBottom: divider ? '1px solid #F1F4F8' : 'none',
        transition: 'background 0.12s',
        ...(onClick && { '&:hover': { bgcolor: '#F8FAFC' }, '&:active': { bgcolor: '#EAF1FB' } }),
      }}
    >
      <Icon name={icon} size={24} color="#1A1A1A" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: HEADING, lineHeight: 1.3 }}>{label}</Typography>
        {sub && <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }} noWrap>{sub}</Typography>}
      </Box>
      {right}
    </Box>
  )
}

function NavRow(props: { icon: IconName; label: string; sub?: string; divider?: boolean; onClick?: () => void }) {
  return <RowShell {...props} right={<Icon name="chevronRight" size={20} color="#C2C9D4" />} />
}

function SelectRow({
  icon,
  label,
  sub,
  divider,
  value,
  flag,
  onClick,
}: {
  icon: IconName
  label: string
  sub?: string
  divider?: boolean
  value: string
  flag?: FlagCode
  onClick?: () => void
}) {
  return (
    <RowShell
      icon={icon}
      label={label}
      sub={sub}
      divider={divider}
      onClick={onClick ?? (() => {})}
      right={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {flag && <Flag code={flag} size={20} />}
          <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: HEADING }}>{value}</Typography>
          <Icon name="chevronsUpDown" size={18} color="#8A94A6" />
        </Box>
      }
    />
  )
}

// ─── Settings sections — shared by the Settings screen and the More tab ──────
// Renders ACCOUNT / NOTIFICATION SETTINGS / APPEARANCE / ABOUT + Sign out, plus
// the language/theme bottom-sheet pickers. The host supplies horizontal padding.
export function SettingsSections() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const isVisitor = flow === 'Visitor'
  const [language, setLanguage] = useState<LangId>('en')
  const [theme, setTheme] = useState<ThemeId>('System')
  const [picker, setPicker] = useState<'language' | 'theme' | null>(null)
  const [callOpen, setCallOpen] = useState(false)
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [signOutPin, setSignOutPin] = useState(false)
  const activeLang = LANGUAGES.find((l) => l.id === language) ?? LANGUAGES[0]

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

        {!isVisitor && (
          <Box>
            <SectionLabel>MY OFFICER</SectionLabel>
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: '14px', py: '12px' }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: 'radial-gradient(circle at 30% 30%, #9BD0FF 0%, #4C8BE0 45%, #2B4F92 100%)', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING, lineHeight: 1.3 }}>Mr. Pisey Sok</Typography>
                  <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>Riverside Branch</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Box role="button" aria-label="Chat with officer" onClick={() => navigate('/chat')} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', '&:active': { bgcolor: 'rgba(0,0,0,0.06)' } }}>
                    <Icon name="message" size={22} color="#0B0F1A" />
                  </Box>
                  <Box role="button" aria-label="Call officer" onClick={() => setCallOpen(true)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', '&:active': { bgcolor: 'rgba(0,0,0,0.06)' } }}>
                    <Icon name="phone" size={22} color="#0B0F1A" />
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        )}

        {!isVisitor && (
          <Box>
            <SectionLabel>PROFILE</SectionLabel>
            <Card>
              <NavRow icon="idCard" label="My Profile" onClick={() => navigate('/profile')} />
            </Card>
          </Box>
        )}

        <Box>
          <SectionLabel>ACCOUNT SETTINGS</SectionLabel>
          <Card>
            {!isVisitor && (
              <NavRow icon="accountSecurity" label="Account Security" divider onClick={() => navigate('/account-security')} />
            )}
            <NavRow icon="bell" label="Notifications" divider onClick={() => navigate('/notification-settings')} />
            <SelectRow
              icon="globe"
              label="Language"
              value={activeLang.label}
              flag={activeLang.flag}
              onClick={() => setPicker('language')}
              divider
            />
            <SelectRow
              icon="theme"
              label="Theme"
              value={theme}
              onClick={() => setPicker('theme')}
            />
          </Card>
        </Box>

        <Box>
          <SectionLabel>ABOUT</SectionLabel>
          <Card>
            <NavRow icon="faq" label="FAQ" divider onClick={() => navigate('/faq')} />
            <NavRow icon="appPolicy" label="App policy & terms" onClick={() => navigate('/terms-privacy')} />
          </Card>
        </Box>

        {/* Sign out — visitors aren't signed in, so it's hidden for them */}
        {!isVisitor && (
          <Box
            role="button"
            onClick={() => setSignOutOpen(true)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, pt: '28px', pb: '8px', cursor: 'pointer', '&:active': { opacity: 0.6 } }}
          >
            <Icon name="signOut" size={20} color={DANGER} />
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: DANGER }}>Sign out</Typography>
          </Box>
        )}
      </Box>

      {/* Language picker */}
      <PickerSheet
        open={picker === 'language'}
        title="Language"
        options={LANGUAGES.map((l) => ({ value: l.id, label: l.label, flag: l.flag }))}
        selected={language}
        onSelect={(v) => setLanguage(v as LangId)}
        onClose={() => setPicker(null)}
      />

      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />

      {/* PIN overlay for sign out */}
      {signOutPin && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1400, bgcolor: '#F5F5F5' }}>
          <PinGateScreen onSuccess={() => { setSignOutPin(false); setSignOutOpen(false); navigate('/splash') }} />
        </Box>
      )}

      {/* Sign out confirmation sheet */}
      <BottomSheet open={signOutOpen && !signOutPin} onClose={() => setSignOutOpen(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="signOut" size={26} color={DANGER} />
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px', mt: 0.5 }}>Sign out?</Typography>
          <Typography sx={{ fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 1.55 }}>
            Are you sure you want to sign out of your account?
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
          <Box
            role="button"
            onClick={() => setSignOutPin(true)}
            sx={{ height: 54, borderRadius: '14px', bgcolor: DANGER, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:active': { opacity: 0.85 } }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Sign out</Typography>
          </Box>
          <Typography
            role="button"
            onClick={() => setSignOutOpen(false)}
            sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: MUTED, cursor: 'pointer', pb: 0.5, '&:active': { opacity: 0.6 } }}
          >
            Cancel
          </Typography>
        </Box>
      </BottomSheet>

      {/* Theme picker */}
      <PickerSheet
        open={picker === 'theme'}
        title="Theme"
        options={THEMES.map((t) => ({ value: t.id, label: t.id, icon: t.icon }))}
        selected={theme}
        onSelect={(v) => setTheme(v as ThemeId)}
        onClose={() => setPicker(null)}
      />
    </>
  )
}

export default function SettingsScreen() {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const isVisitor = flow === 'Visitor'

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top icon row — back + chat + bell */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ ml: -1, color: '#0B0F1A' }}>
            <Icon name="chevronLeft" size={26} color="#0B0F1A" />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconButton size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Messages">
              <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, height: 15, minWidth: 15 } }}>
                <Box component="img" src="/assets/brand/ico_chat.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
              </Badge>
            </IconButton>
            <IconButton onClick={() => navigate('/notifications')} size="small" sx={{ color: '#1A1A1A', p: '6px' }} aria-label="Notifications">
              <Box component="img" src="/assets/brand/ico_bell.svg" alt="" sx={{ width: 24, height: 24, display: 'block' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Profile row (signed-in) — or a sign-up prompt for visitors */}
        {isVisitor ? (
          <Box sx={{ px: 3, pt: 1, pb: 2 }}>
            <Box
              role="button"
              onClick={() => navigate('/sign-up')}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: '16px', borderRadius: '14px', bgcolor: '#fff', cursor: 'pointer', '&:active': { opacity: 0.85 } }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: HEADING, lineHeight: 1.2 }}>Welcome!</Typography>
                <Typography sx={{ fontSize: 13, color: MUTED, mt: 0.25 }}>Sign up to apply loan faster</Typography>
              </Box>
              <Box
                sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: BLUE, color: '#fff', borderRadius: '10px', p: '8px' }}
              >
                <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: '#fff' }}>Get Started</Typography>
                <Icon name="arrowRight" size={18} color="#fff" />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            role="button"
            onClick={() => navigate('/profile')}
            sx={{ px: 3, pt: 1, pb: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', '&:active': { opacity: 0.7 } }}
          >
            <Box sx={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <AssetImg src={ILLUS.avatar01} alt="avatar" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} fallback={<AvatarArt />} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.2 }}>Good morning!</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING, lineHeight: 1.2 }} noWrap>
                Krong Kampuchea
              </Typography>
            </Box>
          </Box>
        )}

        {/* Sections */}
        <Box sx={{ px: 3, pb: 2 }}>
          <SettingsSections />
        </Box>

        <Typography sx={{ fontSize: 11.5, color: '#B6BDC8', textAlign: 'center', pt: 1, pb: '44px' }}>
          NongHyup v1.0.0 · build 2026
        </Typography>
      </Box>
    </Box>
  )
}

// Bottom-sheet option picker for the Appearance rows.
function PickerSheet({
  open,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  open: boolean
  title: string
  options: { value: string; label: string; flag?: FlagCode; icon?: IconName }[]
  selected: string
  onSelect: (v: string) => void
  onClose: () => void
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {options.map((opt) => {
          const active = opt.value === selected
          return (
            <Box
              key={opt.value}
              role="button"
              onClick={() => {
                onSelect(opt.value)
                onClose()
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                minHeight: 60,
                px: '16px',
                borderRadius: '12px',
                bgcolor: active ? '#EEF3FC' : '#F7F9FC',
                border: active ? `1px solid ${BLUE}` : '1px solid transparent',
                cursor: 'pointer',
                transition: 'background 0.12s',
                '&:active': { opacity: 0.85 },
              }}
            >
              {opt.flag && <Flag code={opt.flag} size={24} />}
              {opt.icon && <Icon name={opt.icon} size={22} color="#1A1A1A" />}
              <Typography sx={{ flex: 1, fontSize: 16, fontWeight: 700, color: HEADING }}>{opt.label}</Typography>
              {active && <Icon name="checkCircle" size={22} color={BLUE} />}
            </Box>
          )
        })}
      </Box>
    </BottomSheet>
  )
}
