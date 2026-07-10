import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Sign Contract — PIN-verified e-signature step. Reached from Review Final
// Terms' "Continue to Sign". The signing act is simulated for the prototype.
// ─────────────────────────────────────────────────────────────────────────────
const BLUE = '#275CB2'
const GREEN = '#1FA85C'
const MUTED = '#8A94A6'
const LABEL = '#737373'
const HEADING = '#0B0F1A'

export default function MwlSignScreen() {
  const navigate = useNavigate()
  const [faceVerified, setFaceVerified] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('mwlFaceVerified') === '1') {
      sessionStorage.removeItem('mwlFaceVerified')
      setFaceVerified(true)
    }
  }, [])

  const [agreed, setAgreed] = useState(false)
  const canSign = faceVerified && agreed

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      {/* Header */}
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', px: 1, py: 1.25, bgcolor: '#F5F5F5' }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ color: HEADING }}>
          <Icon name="arrowLeft" size={22} color={HEADING} />
        </IconButton>
        <Typography sx={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 800, color: HEADING }}>Sign Contract</Typography>
        <Box sx={{ width: 44 }} />
      </Box>

      <Box className="scroll-content" sx={{ flex: 1, px: 3, pt: 1, pb: 3 }}>
        {/* Face scan */}
        <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: LABEL }}>FACE SCAN</Typography>
        <Typography sx={{ fontSize: 13.5, color: '#5B6473', lineHeight: 1.5, mt: 0.5 }}>
          Scan your face to verify you're the person signing this contract.
        </Typography>

        <Box
          role="button"
          onClick={() => { if (!faceVerified) navigate('/mwl-face-scan') }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            mt: 2,
            py: '20px',
            borderRadius: '14px',
            bgcolor: '#fff',
            border: `1.5px solid ${faceVerified ? GREEN : '#E2E6EC'}`,
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: faceVerified ? '#EAF7EF' : '#EEF1F5',
              transition: 'background-color 0.2s',
            }}
          >
            <Icon name="faceId" size={30} color={faceVerified ? GREEN : MUTED} />
          </Box>
          {faceVerified ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Icon name="check" size={15} color={GREEN} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: GREEN }}>Face verified</Typography>
            </Box>
          ) : (
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING }}>Tap to scan face</Typography>
          )}
        </Box>

        {/* Production note */}
        <Box sx={{ display: 'flex', gap: 1.25, bgcolor: '#FBF3DD', borderRadius: '14px', p: '14px 16px', mt: 2.5 }}>
          <Box sx={{ mt: '1px' }}><Icon name="info" size={18} color="#C47F11" /></Box>
          <Typography sx={{ fontSize: 12.5, color: '#7A5A12', lineHeight: 1.5, flex: 1 }}>
            <Box component="span" sx={{ fontWeight: 800 }}>Production note:</Box> live e-signature requires a PKI-backed certificate under Sub-Decree No.246. This prototype simulates the signing act; the certificate layer is gated for production.
          </Typography>
        </Box>

        {/* Agreement */}
        <Box
          role="button"
          onClick={() => setAgreed((a) => !a)}
          sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', bgcolor: '#fff', border: `1.5px solid ${agreed ? GREEN : '#E2E6EC'}`, borderRadius: '14px', p: '16px', mt: 2.5, cursor: 'pointer', transition: 'border-color 0.2s' }}
        >
          <Box sx={{ width: 24, height: 24, borderRadius: '7px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: agreed ? GREEN : '#fff', border: agreed ? 'none' : '1.5px solid #C9D2DE', transition: 'background-color 0.2s' }}>
            {agreed && <Icon name="check" size={16} color="#fff" />}
          </Box>
          <Typography sx={{ fontSize: 13.5, color: '#3A4256', lineHeight: 1.5, flex: 1 }}>
            I have read and agree to the loan contract and its final terms, and I accept this as my binding signature.
          </Typography>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 1.5, pb: '36px', bgcolor: '#F5F5F5', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!canSign}
          onClick={() => navigate('/mwl-signed')}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: GREEN, '&:hover': { bgcolor: '#198C4C' }, '&.Mui-disabled': { bgcolor: '#C7D0DA', color: '#fff' } }}
        >
          Sign &amp; Accept
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/my-loan')}
          sx={{ height: 52, borderRadius: '14px', fontSize: 15, fontWeight: 700, color: BLUE, borderColor: '#B9CDEA', bgcolor: '#fff', '&:hover': { borderColor: '#9CC3FF', bgcolor: '#F7FAFF' } }}
        >
          Sign at a branch instead
        </Button>
        <Typography sx={{ fontSize: 12, color: MUTED, textAlign: 'center', mt: 0.5 }}>Both paths create the same signed contract and audit record.</Typography>
      </Box>
    </Box>
  )
}
