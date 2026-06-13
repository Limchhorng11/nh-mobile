import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { MwlHeader, MwlTitle, BLUE } from './mwl/MwlParts'

const HEADING = '#0B0F1A'
const LABEL = '#8A94A6'
const VALUE = '#171717'

// ─────────────────────────────────────────────────────────────────────────────
// Early payoff — full settlement breakdown + comment, requests a payoff letter.
// Reached from My Loan detail → Others → "Payoff Request".
// ─────────────────────────────────────────────────────────────────────────────
type Row = { label: string; value: string }

const BREAKDOWN: Row[] = [
  { label: 'Principal', value: '$120.00' },
  { label: 'Interest', value: '$14.40' },
  { label: 'Late fee', value: '$0.80' },
  { label: 'Early settlement fee (2%)', value: '$90.00' },
]

function BreakdownRow({ label, value }: Row) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '7px' }}>
      <Typography sx={{ fontSize: 14, color: LABEL }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: VALUE }}>{value}</Typography>
    </Box>
  )
}

export default function EarlyPayoffScreen() {
  const navigate = useNavigate()
  const [comment, setComment] = useState('')

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => navigate(-1)} />
        <MwlTitle>Early payoff</MwlTitle>

        <Box sx={{ px: 3, pb: 3, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Total repay amount + breakdown */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: '18px' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: LABEL }}>
              TOTAL REPAY AMOUNT
            </Typography>
            <Typography sx={{ fontSize: 34, fontWeight: 800, color: HEADING, letterSpacing: '-1px', lineHeight: 1.1, mt: 0.5 }}>
              $4,612.50
            </Typography>

            <Box sx={{ borderTop: '1px dashed #D6DCE5', my: '14px' }} />

            {BREAKDOWN.map((r) => (
              <BreakdownRow key={r.label} {...r} />
            ))}
          </Box>

          {/* Comment */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: '16px' }}>
            <Box
              component="textarea"
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="Enter your comment"
              rows={4}
              sx={{
                width: '100%',
                border: 'none',
                outline: 'none',
                resize: 'none',
                bgcolor: 'transparent',
                fontFamily: 'inherit',
                fontSize: 15,
                color: HEADING,
                lineHeight: 1.5,
                p: 0,
                '&::placeholder': { color: '#A8B0BD' },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/early-payoff-pin')}
          sx={{ height: 48, borderRadius: '12px', fontSize: 14, fontWeight: 700, bgcolor: BLUE }}
        >
          Request payoff letter
        </Button>
      </Box>
    </Box>
  )
}
