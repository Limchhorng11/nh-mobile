import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import { Icon } from '../../components/Icon'

const BLUE = '#275CB2'
const MUTED = '#8A94A6'
const HEADING = '#0B0F1A'
const BORDER = '#E8EAEE'
const PREFIX = 'NH03012'

export default function EnterNameScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const nextSuffix = params.get('next') ? '?next=' + encodeURIComponent(params.get('next')!) : ''

  const [firstName, setFirstName] = useState('Krong')
  const [lastName, setLastName] = useState('Kampuchea')
  const [referralSheetOpen, setReferralSheetOpen] = useState(false)
  const [referralDigits, setReferralDigits] = useState('')
  const [confirmedCode, setConfirmedCode] = useState('')
  const [agreed, setAgreed] = useState(true)

  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  function handleKey(k: string) {
    if (k === 'del') {
      setReferralDigits(d => d.slice(0, -1))
    } else if (referralDigits.length < 5) {
      setReferralDigits(d => d + k)
    }
  }

  function confirmReferral() {
    setConfirmedCode(referralDigits)
    setReferralSheetOpen(false)
  }

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5', position: 'relative', overflow: 'hidden' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 3, pt: 3, pb: 1 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ ml: -1, color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
        </Box>

        <Box sx={{ px: 3, pt: 0.5 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            Enter your name
          </Typography>
          <Typography sx={{ fontSize: 15, color: MUTED, mt: 1, lineHeight: 1.4 }}>
            Please input like your NID card
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3.5 }}>
            <InputField label="First Name" value={firstName} onChange={setFirstName} />
            <InputField label="Last Name" value={lastName} onChange={setLastName} />

            {/* Preview Full Name */}
            <Box sx={{ bgcolor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: 1.3 }}>Preview Fullname</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: fullName ? HEADING : MUTED, mt: 0.25 }}>
                {fullName || '—'}
              </Typography>
            </Box>

          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 2, pb: '44px', bgcolor: '#F5F5F5' }}>
        {/* Referral — link or confirmed card */}
        {confirmedCode ? (
          <Box sx={{ bgcolor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '14px', px: 2, pt: 1.25, pb: 1.5, mb: 1.5 }}>
            {/* Top row: label + X */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography sx={{ fontSize: 13, color: MUTED }}>Referral Code</Typography>
              <IconButton size="small" onClick={() => setReferralSheetOpen(true)} sx={{ p: 0.25 }}>
                <Icon name="chevronRight" size={16} color={MUTED} />
              </IconButton>
            </Box>
            {/* Bottom row: avatar + name + prefix + digits pill */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #7B61FF 0%, #4FC3F7 100%)', flexShrink: 0 }} />
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: HEADING }}>Meas Bopha</Typography>
              <Typography sx={{ fontSize: 13, color: MUTED, ml: 'auto' }}>{PREFIX}</Typography>
              <Box sx={{ bgcolor: '#F0F2F5', borderRadius: '8px', px: 1.5, py: 0.5 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING }}>{confirmedCode}</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            role="button"
            onClick={() => setReferralSheetOpen(true)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mb: 1.5, cursor: 'pointer', '&:active': { opacity: 0.7 } }}
          >
            <Icon name="signature" size={14} color={BLUE} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: BLUE }}>Add referral</Typography>
          </Box>
        )}

        {/* Terms checkbox */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            size="small"
            sx={{ p: 0.5, color: '#CBD3DF', '&.Mui-checked': { color: BLUE } }}
          />
          <Typography sx={{ fontSize: 13, color: MUTED, lineHeight: 1.4 }}>
            I agree to{' '}
            <Box component="span" sx={{ color: BLUE, fontWeight: 700, cursor: 'pointer' }}>Terms of Service</Box>
            {' & '}
            <Box component="span" sx={{ color: BLUE, fontWeight: 700, cursor: 'pointer' }}>Privacy Policy</Box>
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          disabled={!firstName || !lastName || !agreed}
          onClick={() => navigate('/create-pin' + nextSuffix)}
          sx={{ height: 56, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}
        >
          Confirm
        </Button>
      </Box>

      {/* Referral bottom sheet */}
      {referralSheetOpen && (
        <>
          {/* Backdrop */}
          <Box
            onClick={() => setReferralSheetOpen(false)}
            sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', zIndex: 10 }}
          />
          {/* Sheet */}
          <Box sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 11,
            bgcolor: '#fff', borderRadius: '20px 20px 0 0',
            pt: 2, pb: '32px',
          }}>
            {/* Handle */}
            <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: '#E2E6EC', mx: 'auto', mb: 2 }} />

            {/* Hint */}
            <Box sx={{ px: 3, mb: 2 }}>
              <Box sx={{ bgcolor: '#F5F7FB', borderRadius: '10px', px: 2, py: 1.25, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Icon name="info" size={15} color={MUTED} />
                <Typography sx={{ fontSize: 12.5, color: MUTED, lineHeight: 1.45 }}>
                  Enter the last 5 digits of your NH staff's ID — e.g.{' '}
                  <Box component="span" sx={{ color: HEADING, fontWeight: 600 }}>NH030122006</Box>
                  {' → '}
                  <Box component="span" sx={{ color: HEADING, fontWeight: 600 }}>22006</Box>.
                </Typography>
              </Box>
            </Box>

            {/* Input row */}
            <Box sx={{ px: 3, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                flex: 1, bgcolor: '#F5F7FB', borderRadius: '12px',
                px: 2, height: 52, display: 'flex', alignItems: 'center', gap: 1.5,
                border: `1.5px solid ${BLUE}`,
              }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: MUTED, flexShrink: 0 }}>{PREFIX}</Typography>
                {/* 5 digit slots */}
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {[0,1,2,3,4].map(i => {
                    const filled = i < referralDigits.length
                    const active = i === referralDigits.length
                    return (
                      <Box key={i} sx={{
                        width: 26, height: 34, borderRadius: '6px',
                        bgcolor: filled ? '#fff' : 'transparent',
                        border: `1.5px solid ${filled ? BLUE : active ? BLUE : '#CBD3DF'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {filled ? (
                          <Typography sx={{ fontSize: 16, fontWeight: 700, color: HEADING }}>{referralDigits[i]}</Typography>
                        ) : active ? (
                          <Box sx={{ width: '1.5px', height: 18, bgcolor: BLUE, animation: 'blink 1s step-end infinite', '@keyframes blink': { '50%': { opacity: 0 } } }} />
                        ) : null}
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <IconButton
                onClick={confirmReferral}
                disabled={referralDigits.length === 0}
                sx={{
                  width: 44, height: 44, borderRadius: '50%',
                  bgcolor: referralDigits.length > 0 ? BLUE : '#E2E6EC',
                  '&:hover': { bgcolor: referralDigits.length > 0 ? '#1e4a9a' : '#E2E6EC' },
                  '&.Mui-disabled': { bgcolor: '#E2E6EC' },
                }}
              >
                <Icon name="check" size={20} color={referralDigits.length > 0 ? '#fff' : '#8A94A6'} />
              </IconButton>
            </Box>

            {/* Keypad */}
            <Keypad onKey={handleKey} />
          </Box>
        </>
      )}
    </Box>
  )
}

function Keypad({ onKey }: { onKey: (k: string) => void }) {
  const rows = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'del']]
  return (
    <Box sx={{ px: 2 }}>
      {rows.map((row, ri) => (
        <Box key={ri} sx={{ display: 'flex', gap: 1, mb: ri < 3 ? 1 : 0 }}>
          {row.map((k, ki) => (
            <Box
              key={ki}
              onClick={() => k && onKey(k)}
              sx={{
                flex: 1, height: 54, borderRadius: '12px',
                bgcolor: k ? '#F5F7FB' : 'transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: k ? 'pointer' : 'default',
                userSelect: 'none',
                '&:active': k ? { bgcolor: '#E2E6EC' } : {},
              }}
            >
              {k === 'del' ? (
                <Icon name="backspace" size={22} color="#0B0F1A" />
              ) : k ? (
                <>
                  <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#0B0F1A', lineHeight: 1 }}>{k}</Typography>
                  {['2','3','4','5','6','7','8','9'].includes(k) || k === '0' ? null : null}
                  <Typography sx={{ fontSize: 9, fontWeight: 600, color: MUTED, letterSpacing: '0.08em', mt: 0.2 }}>
                    {k === '2' ? 'ABC' : k === '3' ? 'DEF' : k === '4' ? 'GHI' : k === '5' ? 'JKL' : k === '6' ? 'MNO' : k === '7' ? 'PQRS' : k === '8' ? 'TUV' : k === '9' ? 'WXYZ' : ''}
                  </Typography>
                </>
              ) : null}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  )
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <Box sx={{ bgcolor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: 1.3 }}>
        {label}
        {!label.includes('optional') && <Box component="span" sx={{ color: '#E5484D', ml: 0.4 }}>*</Box>}
      </Typography>
      <Box
        component="input"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder ?? ''}
        sx={{ mt: 0.25, width: '100%', border: 'none', outline: 'none', bgcolor: 'transparent', fontSize: 16, fontWeight: 600, color: HEADING, fontFamily: 'inherit', p: 0, '::placeholder': { color: MUTED, fontWeight: 400 } }}
      />
    </Box>
  )
}
