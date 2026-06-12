import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../../components/Icon'
import { Flag } from '../../components/Flag'

const BLUE = '#0052CC'
const MUTED = '#8A94A6'

export default function OtpScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const nextSuffix = params.get('next') ? '?next=' + encodeURIComponent(params.get('next')!) : ''
  const [code, setCode] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const cells = [0, 1, 2, 3]

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 3, pb: 1 }}>
          <IconButton onClick={() => navigate('/sign-up')} aria-label="Back" sx={{ ml: -1, color: '#0B0F1A' }}>
            <Icon name="chevronLeft" size={26} color="#0B0F1A" />
          </IconButton>
          <Box role="button" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#fff', borderRadius: 999, pl: 1.25, pr: 1, py: 0.5, cursor: 'pointer', boxShadow: '0 1px 3px rgba(16,24,40,0.06)' }}>
            <Flag code="gb" size={22} />
            <Icon name="chevronDown" size={16} color="#0B0F1A" />
          </Box>
        </Box>

        <Box sx={{ px: 3, pt: 1 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            Verify your number
          </Typography>
          <Typography sx={{ fontSize: 15, color: MUTED, mt: 1, lineHeight: 1.4 }}>
            Enter the 4-digit code sent to<br />+855 12 345 678
          </Typography>

          {/* OTP cells (tap to focus hidden input) */}
          <Box sx={{ position: 'relative', mt: 3.5 }} onClick={() => inputRef.current?.focus()}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {cells.map((i) => {
                const active = i === code.length
                const filled = i < code.length
                return (
                  <Box key={i} sx={{
                    width: 64, height: 64, borderRadius: '14px', bgcolor: '#fff',
                    border: `2px solid ${active ? BLUE : filled ? '#CBD3DF' : '#E2E6EC'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, fontWeight: 700, color: '#0B0F1A',
                  }}>
                    {filled ? code[i] : active ? <Box sx={{ width: '2px', height: 26, bgcolor: BLUE, animation: 'blink 1s step-end infinite', '@keyframes blink': { '50%': { opacity: 0 } } }} /> : ''}
                  </Box>
                )
              })}
            </Box>
            <Box component="input" ref={inputRef} type="tel" inputMode="numeric" autoFocus
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              sx={{ position: 'absolute', inset: 0, opacity: 0, border: 'none', width: '100%', height: '100%' }}
            />
          </Box>

          <Typography sx={{ fontSize: 14, color: MUTED, textAlign: 'center', mt: 3 }}>
            Didn't receive a code? <Box component="span" sx={{ color: BLUE, fontWeight: 700 }}>Resend in 0:42</Box>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button variant="contained" fullWidth onClick={() => navigate('/create-pin' + nextSuffix)} sx={{ height: 56, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}>
          Confirm
        </Button>
      </Box>
    </Box>
  )
}
