import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import { Icon, type IconName } from '../../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'
import { BottomSheet } from '../mwl/MwlParts'
import PinGateScreen from '../PinGateScreen'

// ─────────────────────────────────────────────────────────────────────────────
// Account Security — sign-in methods + active sessions (opened from Settings).
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const DANGER = '#E11D48'
const GREEN = '#1FA85C'

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1 }}>
      {children}
    </Typography>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden' }}>{children}</Box>
}

function Row({
  icon,
  label,
  sub,
  divider,
  onClick,
  right,
  disabled,
}: {
  icon: IconName
  label: string
  sub?: string
  divider?: boolean
  onClick?: () => void
  right: React.ReactNode
  disabled?: boolean
}) {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      role={onClick && !disabled ? 'button' : undefined}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: '14px',
        py: '12px',
        opacity: disabled ? 0.5 : 1,
        cursor: onClick && !disabled ? 'pointer' : 'default',
        borderBottom: divider ? '1px solid #F1F4F8' : 'none',
        ...(onClick && !disabled && { '&:active': { bgcolor: '#EAF1FB' } }),
      }}
    >
      <Icon name={icon} size={24} color="#1A1A1A" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING, lineHeight: 1.3 }}>{label}</Typography>
        {sub && <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>{sub}</Typography>}
      </Box>
      {right}
    </Box>
  )
}

// iOS-style switch — matches the Notification Settings toggles.
const iosSwitch = {
  width: 51,
  height: 31,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '2px',
    transitionDuration: '200ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': { bgcolor: BLUE, opacity: 1, border: 0 },
    },
    '&.Mui-disabled + .MuiSwitch-track': { opacity: 0.5 },
  },
  '& .MuiSwitch-thumb': {
    width: 27,
    height: 27,
    boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
  },
  '& .MuiSwitch-track': {
    borderRadius: '999px',
    bgcolor: '#E9E9EA',
    border: '1px solid #DADBDD',
    opacity: 1,
    transition: 'background-color 200ms',
  },
}

type Session = { id: string; device: string; place: string; current?: boolean }
const SESSIONS: Session[] = [
  { id: 's1', device: 'iPhone 14 · Now', place: 'Phnom Penh', current: true },
  { id: 's2', device: 'iPhone 16 Pro Max', place: 'Kampong Cham' },
]

export default function AccountSecurityScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [faceId, setFaceId] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pinStep, setPinStep] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [changePinOpen, setChangePinOpen] = useState(false)
  const [changePinStep, setChangePinStep] = useState<'current' | 'new' | 'confirm' | 'success'>('current')
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Account security" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"Account security"}</CollapsingTitle>

        <Box sx={{ px: 3, pb: 4 }}>
          {/* Sign-in methods */}
          <SectionLabel>SIGN IN METHODS</SectionLabel>
          <Card>
            <Row
              icon="faceId"
              label="Face ID"
              sub="Use Face ID to sign in"
              divider
              right={<Switch checked={faceId} onChange={(e) => setFaceId(e.target.checked)} disableRipple sx={iosSwitch} />}
            />
            <Row
              icon="fingerprint"
              label="Touch ID"
              sub="Not available on this device"
              divider
              disabled
              right={<Switch checked={false} disabled disableRipple sx={iosSwitch} />}
            />
            <Row
              icon="pin"
              label="Change PIN"
              sub="Last changed 23 Apr 2026"
              divider
              onClick={() => { setChangePinStep('current'); setCurrentPin(''); setNewPin(''); setConfirmPin(''); setChangePinOpen(true) }}
              right={<Icon name="chevronRight" size={20} color="#C2C9D4" />}
            />
            <Row
              icon="device"
              label="Change Phone Number"
              sub="Current Number 093 333 333"
              onClick={() => {}}
              right={<Icon name="chevronRight" size={20} color="#C2C9D4" />}
            />
          </Card>

          {/* Active sessions */}
          <Box sx={{ mt: 2 }}>
            <SectionLabel>ACTIVE SESSIONS</SectionLabel>
            <Card>
              {SESSIONS.map((s, i) => (
                <Box
                  key={s.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, px: '14px', py: '12px', borderBottom: i < SESSIONS.length - 1 ? '1px solid #F1F4F8' : 'none' }}
                >
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#EEF1F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="device" size={20} color="#5B6473" />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING }}>{s.device}</Typography>
                    <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>{s.place}</Typography>
                  </Box>
                  {s.current ? (
                    <Box sx={{ fontSize: 11, fontWeight: 700, px: 1.25, py: 0.5, borderRadius: 1.5, color: GREEN, bgcolor: '#E6F7EE' }}>Current</Box>
                  ) : (
                    <Typography
                      role="button"
                      onClick={() => {}}
                      sx={{ fontSize: 12.5, fontWeight: 700, color: BLUE, cursor: 'pointer', '&:active': { opacity: 0.6 } }}
                    >
                      Logged Out
                    </Typography>
                  )}
                </Box>
              ))}
            </Card>
          </Box>

          {/* Delete account */}
          <Box
            role="button"
            onClick={() => setDeleteOpen(true)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 1.75, px: '30px', mt: '30px', borderRadius: '12px', border: `1.5px solid ${DANGER}33`, bgcolor: '#FFF1F4', cursor: 'pointer', '&:active': { opacity: 0.7 } }}
          >
            <Icon name="trash" size={20} color={DANGER} />
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: DANGER }}>Delete Account</Typography>
          </Box>

        </Box>
      </Box>

      {/* PIN overlay — full screen, shown above everything */}
      {pinStep && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1400, bgcolor: '#F5F5F5' }}>
          <PinGateScreen onSuccess={() => { setPinStep(false); setDeleteOpen(false); navigate('/flow-select') }} />
        </Box>
      )}

      {/* Change PIN sheet */}
      <BottomSheet open={changePinOpen} onClose={() => setChangePinOpen(false)}>
        {changePinStep === 'success' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#E6F7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={28} color={GREEN} />
            </Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px', mt: 0.5 }}>PIN Updated</Typography>
            <Typography sx={{ fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 1.55 }}>
              Your PIN has been changed successfully.
            </Typography>
            <Button variant="contained" fullWidth onClick={() => setChangePinOpen(false)}
              sx={{ mt: 1, height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE }}>
              Done
            </Button>
          </Box>
        ) : (
          <Box sx={{ pb: 1 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px', mb: 0.5 }}>
              {changePinStep === 'current' ? 'Enter current PIN' : changePinStep === 'new' ? 'Enter new PIN' : 'Confirm new PIN'}
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: MUTED, mb: 2.5, lineHeight: 1.5 }}>
              {changePinStep === 'current' ? 'Enter your current 6-digit PIN to continue.' : changePinStep === 'new' ? 'Choose a new 6-digit PIN.' : 'Re-enter your new PIN to confirm.'}
            </Typography>
            {/* PIN dots */}
            {(() => {
              const val = changePinStep === 'current' ? currentPin : changePinStep === 'new' ? newPin : confirmPin
              const setter = changePinStep === 'current' ? setCurrentPin : changePinStep === 'new' ? setNewPin : setConfirmPin
              return (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Box key={i} sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: i < val.length ? BLUE : '#E2E6EC', transition: 'background-color 0.15s' }} />
                    ))}
                  </Box>
                  {/* Numpad */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
                    {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k) => (
                      <Box
                        key={k}
                        role={k ? 'button' : undefined}
                        onClick={() => {
                          if (!k) return
                          if (k === '⌫') { setter(v => v.slice(0, -1)); return }
                          if (val.length >= 6) return
                          const next = val + k
                          setter(next)
                          if (next.length === 6) {
                            setTimeout(() => {
                              if (changePinStep === 'current') setChangePinStep('new')
                              else if (changePinStep === 'new') setChangePinStep('confirm')
                              else setChangePinStep('success')
                            }, 200)
                          }
                        }}
                        sx={{ height: 56, borderRadius: '12px', bgcolor: k ? '#F5F7FA' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600, color: HEADING, cursor: k ? 'pointer' : 'default', '&:active': k ? { bgcolor: '#E2E8F5' } : {} }}
                      >
                        {k}
                      </Box>
                    ))}
                  </Box>
                </>
              )
            })()}
          </Box>
        )}
      </BottomSheet>

      {/* Delete account confirmation sheet */}
      <BottomSheet open={deleteOpen && !pinStep} onClose={() => { setDeleteOpen(false); setDeleted(false); setPinStep(false) }}>
        {deleted ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="trash" size={26} color={DANGER} />
            </Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px', mt: 0.5 }}>Account Deleted</Typography>
            <Typography sx={{ fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 1.55 }}>
              Your account has been permanently deleted. We're sorry to see you go.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/flow-select')}
              sx={{ mt: 1, height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
            >
              Back to Home
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="trash" size={26} color={DANGER} />
            </Box>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px', mt: 0.5 }}>Delete Account?</Typography>
            <Typography sx={{ fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 1.55 }}>
              This will permanently remove your account and all associated data. This action cannot be undone.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setPinStep(true)}
              sx={{ mt: 1, height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: DANGER, '&:hover': { bgcolor: '#B52E2E' } }}
            >
              Yes, delete my account
            </Button>
            <Typography
              role="button"
              onClick={() => setDeleteOpen(false)}
              sx={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: MUTED, cursor: 'pointer', pb: 0.5, '&:active': { opacity: 0.6 } }}
            >
              Cancel
            </Typography>
          </Box>
        )}
      </BottomSheet>
    </Box>
  )
}
