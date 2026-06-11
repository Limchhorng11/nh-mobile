import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Request consultation · Step 1 — pick a branch, date & time to meet an officer.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const DANGER = '#E5484D'

export default function RequestConsultScreen() {
  const navigate = useNavigate()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 3, pb: 1 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/chat')} aria-label="Chat support" sx={{ color: HEADING }}>
              <Icon name="feedback" size={24} color={HEADING} />
            </IconButton>
            <IconButton aria-label="Call support" sx={{ color: HEADING }}>
              <Icon name="phone" size={22} color={HEADING} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ px: 3, pt: 1 }}>
          <Typography sx={{ fontSize: 32, fontWeight: 800, color: HEADING, letterSpacing: '-0.8px', lineHeight: 1.15 }}>
            When would you like to meet?
          </Typography>

          {/* Select Branch */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 4 }}>
            <FieldLabel label="Select Branch" required />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: HEADING, flex: 1 }}>Kandal — Takhmao</Typography>
              <Icon name="search" size={20} color={MUTED} />
            </Box>
          </Box>

          {/* Date + Time */}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
              <FieldLabel label="Date" required />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: HEADING, flex: 1 }} noWrap>12 May 2026</Typography>
                <Icon name="calendar" size={20} color={MUTED} />
              </Box>
            </Box>
            <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0 }}>
              <FieldLabel label="Time" required />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: HEADING, flex: 1 }} noWrap>8:00AM</Typography>
                <Icon name="chevronsUpDown" size={20} color={MUTED} />
              </Box>
            </Box>
          </Box>

          {/* Comment */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: '16px', py: '16px', mt: 2 }}>
            <Box
              component="textarea"
              rows={3}
              placeholder="Enter your comment"
              aria-label="Comment"
              sx={{
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none',
                bgcolor: 'transparent',
                fontSize: 16,
                color: HEADING,
                fontFamily: 'inherit',
                p: 0,
                '::placeholder': { color: MUTED },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/consult-success')}
          sx={{ height: 56, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  )
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: 1.3 }}>
      {label}
      {required && <Box component="span" sx={{ color: DANGER, ml: 0.4 }}>*</Box>}
    </Typography>
  )
}
