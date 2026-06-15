import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'
import { useCollapse, CollapsingHeader, CollapsingTitle } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
// Send feedback — category + message + follow-up consent (from Settings).
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#5B6473', mb: 0.75 }}>
      {children} <Box component="span" sx={{ color: '#E11D48' }}>*</Box>
    </Typography>
  )
}

export default function SendFeedbackScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [message, setMessage] = useState('')
  const [contactMe, setContactMe] = useState(false)

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader
          title="Send feedback"
          collapse={collapse}
          onBack={() => navigate('/more')}
          right={
            <IconButton onClick={() => navigate('/feedback-history')} aria-label="Feedback history" sx={{ color: HEADING }}>
              <Icon name="clock" size={24} color={HEADING} />
            </IconButton>
          }
        />
        <CollapsingTitle collapse={collapse}>{"Send feedback"}</CollapsingTitle>

        <Box sx={{ px: 3, pb: 4, pt: 1 }}>
          {/* Category */}
          <FieldLabel>Category</FieldLabel>
          <Box
            role="button"
            onClick={() => {}}
            sx={{ display: 'flex', alignItems: 'center', height: 60, px: '16px', bgcolor: '#fff', borderRadius: '12px', border: '1px solid #E7ECF2', cursor: 'pointer' }}
          >
            <Typography sx={{ flex: 1, fontSize: 16, fontWeight: 600, color: HEADING }}>Suggestion</Typography>
            <Icon name="chevronsUpDown" size={18} color="#8A94A6" />
          </Box>

          {/* Message */}
          <Box sx={{ mt: 2.5 }}>
            <FieldLabel>Tell us more</FieldLabel>
            <Box
              component="textarea"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder="Share your thoughts, ideas or issues…"
              aria-label="Tell us more"
              rows={6}
              sx={{
                width: '100%',
                resize: 'none',
                p: '16px',
                bgcolor: '#fff',
                borderRadius: '12px',
                border: '1px solid #E7ECF2',
                outline: 'none',
                fontSize: 16,
                color: HEADING,
                fontFamily: 'inherit',
                lineHeight: 1.5,
                boxSizing: 'border-box',
                '::placeholder': { color: MUTED },
                '&:focus': { borderColor: BLUE },
              }}
            />
          </Box>

          {/* Consent checkbox */}
          <Box
            role="button"
            onClick={() => setContactMe((v) => !v)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2, cursor: 'pointer' }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: '6px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: contactMe ? BLUE : '#fff',
                border: contactMe ? `1px solid ${BLUE}` : '1.5px solid #CBD2DC',
              }}
            >
              {contactMe && <Icon name="checkCircle" size={16} color="#fff" />}
            </Box>
            <Typography sx={{ fontSize: 14, color: '#3A4256' }}>Allow us to contact you for follow-up</Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer CTA */}
      <Box sx={{ px: 3, pt: 2, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          fullWidth
          onClick={() => navigate('/feedback-history')}
          disabled={message.trim().length === 0}
          sx={{
            height: 54,
            borderRadius: '14px',
            bgcolor: '#275CB2',
            color: '#fff',
            fontSize: 16,
            fontWeight: 800,
            textTransform: 'none',
            '&:hover': { bgcolor: '#1F4E9C' },
            '&.Mui-disabled': { bgcolor: '#C2CEE0', color: '#fff' },
          }}
        >
          Submit feedback
        </Button>
      </Box>
    </Box>
  )
}
