import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'
import { Flag } from '../../components/Flag'
import { MwlHeader, BottomSheet, BLUE } from './MwlParts'

const CUSTOMER = [
  ['Full Name', 'Sophea Kim'],
  ['Phone', '093 333 333'],
  ['City', 'Phnom Penh'],
  ['Current occupation', 'Garment worker'],
  ['Status', 'Married'],
  ['Select Branch', 'Chroy Changvar'],
]
const LOAN = [
  ['Amount', '5,000.00'],
  ['Loan term', '12 months'],
  ['Monthly interest', '1.04%'],
  ['Repayment method', 'Equal monthly payment'],
]
const GUARANTOR = [
  ['Full Name', 'Krong Kampuchea'],
  ['Mobile number', '012 482 991'],
  ['Relationship', 'Spouse'],
]

export default function MwlReviewScreen({ nonMwl = false }: { nonMwl?: boolean } = {}) {
  const navigate = useNavigate()
  const prefix = nonMwl ? '/nonmwl' : '/mwl'
  const [signOpen, setSignOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.setPointerCapture(e.pointerId)
    drawing.current = true
    const ctx = canvas.getContext('2d')!
    const { x, y } = getPos(e)
    ctx.beginPath(); ctx.moveTo(x, y)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')!
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0B0F1A'
    const { x, y } = getPos(e)
    ctx.lineTo(x, y); ctx.stroke()
  }, [])

  const onPointerUp = useCallback(() => { drawing.current = false }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  useEffect(() => {
    if (!signOpen) clearCanvas()
  }, [signOpen, clearCanvas])

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => navigate(nonMwl ? '/nonmwl-loan' : '/mwl-guarantor')} />
        <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', px: 3, mt: 0.5, mb: 1.5 }}>
          Review your application
        </Typography>

        <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Loan request hero */}
          <Box sx={{ background: `linear-gradient(135deg, ${BLUE} 0%, #003C99 100%)`, borderRadius: '14px', p: '18px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '-4px' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: 'rgba(255,255,255,0.85)' }}>LOAN REQUEST</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 0.5 }}>
              <Typography sx={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', color: '#fff' }}>$5,000</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
              <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>30 months</Typography>
              <Flag code="kr" size={18} />
              <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>Korea</Typography>
            </Box>
          </Box>

          <Section title="CUSTOMER INFO" rows={CUSTOMER} onEdit={() => navigate(`${prefix}-about`)} />
          <Section title="LOAN REQUEST" rows={LOAN} onEdit={() => navigate(`${prefix}-loan`)} />
          {!nonMwl && <Section title="GUARANTOR INFO" rows={GUARANTOR} onEdit={() => navigate('/mwl-guarantor')} />}
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button variant="contained" fullWidth onClick={() => setSignOpen(true)} endIcon={<Icon name="arrowRight" size={16} />} sx={{ height: 48, borderRadius: '12px', fontSize: 15, fontWeight: 700 }}>
          Continue
        </Button>
      </Box>

      {/* E-Signature bottom sheet */}
      <BottomSheet open={signOpen} onClose={() => setSignOpen(false)}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon name="signature" size={26} color="#0B0F1A" />
            <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px' }}>E-Signature</Typography>
          </Box>
          <Box
            component="button"
            type="button"
            aria-label="Clear signature"
            onClick={clearCanvas}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 40,
              px: 2,
              bgcolor: '#fff',
              border: '1px solid #E2E6EC',
              borderRadius: '12px',
              fontFamily: 'inherit',
              fontSize: 15,
              fontWeight: 700,
              color: '#0B0F1A',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
              '&:active': { bgcolor: '#F4F6F9' },
            }}
          >
            Clear
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#ECECEC', borderRadius: '14px', overflow: 'hidden', height: 250, touchAction: 'none' }}>
          <Box
            component="canvas"
            ref={canvasRef}
            width={600}
            height={250}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            sx={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
          />
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(`${prefix}-success`)}
          sx={{ height: 52, borderRadius: '12px', fontSize: 15, fontWeight: 700 }}
        >
          Submit
        </Button>
      </BottomSheet>
    </Box>
  )
}

function Section({ title, rows, onEdit }: { title: string; rows: string[][]; onEdit: () => void }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', color: '#8A94A6' }}>{title}</Typography>
        <Typography onClick={onEdit} sx={{ fontSize: 13, fontWeight: 700, color: BLUE, cursor: 'pointer' }}>EDIT</Typography>
      </Box>
      <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
        {rows.map(([label, value], i) => (
          <Row key={label} label={label} value={value} divider={i < rows.length - 1} />
        ))}
      </Box>
    </Box>
  )
}

function Row({ label, value, divider }: { label: string; value: ReactNode; divider: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: '14px', py: '12px', borderBottom: divider ? '1px solid #F1F4F8' : 'none' }}>
      <Typography sx={{ fontSize: 13, color: '#6B7280' }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0B0F1A', textAlign: 'right' }}>{value}</Typography>
    </Box>
  )
}
