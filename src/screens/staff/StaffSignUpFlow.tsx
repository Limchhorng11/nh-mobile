import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { Icon } from '../../components/Icon'
import { AssetImg, asset } from '../../components/home/media'
import { BottomSheet } from '../mwl/MwlParts'

const BLUE = '#275CB2'
const MUTED = '#8A94A6'
const HEADING = '#0B0F1A'
const GREEN = '#1A7A45'

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ step, total = 4 }: { step: number; total?: number }) {
  return (
    <Box sx={{ display: 'flex', gap: '6px', px: 3, pt: 2, pb: 0.5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            bgcolor: i < step ? BLUE : '#E0E4EA',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </Box>
  )
}

// ─── Scan overlay ─────────────────────────────────────────────────────────────
function ScanOverlay({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'scanning' | 'success'>('ready')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (phase !== 'scanning') return
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(t); setPhase('success'); return 100 }
        return p + 4
      })
    }, 60)
    return () => clearInterval(t)
  }, [phase])

  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 50, bgcolor: '#0D1117', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 3, pb: 1.5 }}>
        <IconButton onClick={onClose} sx={{ color: '#fff', ml: -1 }}>
          <Icon name="close" size={22} color="#fff" />
        </IconButton>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Scan National ID</Typography>
        <Box sx={{ width: 40 }} />
      </Box>

      {/* Camera area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, gap: 2 }}>
        {/* ID card frame */}
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 320, aspectRatio: '1.58', borderRadius: '18px', overflow: 'hidden', bgcolor: '#7FB3D3' }}>
          {/* Background gradient */}
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #8EC5DE 0%, #6FA8C8 100%)' }} />

          {/* Dashed card outline */}
          <Box sx={{ position: 'absolute', inset: 12, border: '2px dashed rgba(255,255,255,0.7)', borderRadius: '12px' }} />

          {/* ID card illustration */}
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', px: 3, gap: 2.5 }}>
            {/* Person silhouette */}
            <Box sx={{ width: 64, height: 64, flexShrink: 0 }}>
              <Box component="svg" viewBox="0 0 64 64" sx={{ width: '100%', height: '100%' }}>
                <circle cx="32" cy="20" r="14" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
                <path d="M8 58 C8 40 56 40 56 58" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
              </Box>
            </Box>
            {/* Text lines */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[90, 70, 70, 55].map((w, i) => (
                <Box key={i} sx={{ height: '2px', width: `${w}%`, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
              ))}
            </Box>
          </Box>

          {/* Scan line when scanning */}
          {phase === 'scanning' && (
            <Box sx={{
              position: 'absolute', left: 12, right: 12, height: 2,
              bgcolor: 'rgba(96,165,250,0.9)',
              boxShadow: '0 0 8px rgba(96,165,250,1)',
              top: `${12 + (progress / 100) * 76}%`,
              transition: 'top 0.06s linear', borderRadius: 1,
            }} />
          )}

          {/* Success overlay */}
          {phase === 'success' && (
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(34,197,94,0.6)' }}>
                <Icon name="check" size={28} color="#fff" />
              </Box>
            </Box>
          )}

        </Box>

        {/* Hint text */}
        <Typography sx={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 1.5 }}>
          {phase === 'ready' && 'Position your National ID card\nwithin the frame'}
          {phase === 'scanning' && `Scanning… ${progress}%`}
          {phase === 'success' && 'ID scanned successfully!'}
        </Typography>
      </Box>

      {/* Bottom action */}
      <Box sx={{ px: 3, pb: '48px', pt: 2 }}>
        {phase === 'success' ? (
          <Button variant="contained" fullWidth onClick={onDone}
            sx={{ height: 52, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: '#22C55E', '&:hover': { bgcolor: '#16A34A' } }}>
            Continue
          </Button>
        ) : (
          <Button variant="contained" fullWidth
            disabled={phase === 'scanning'}
            onClick={() => { setProgress(0); setPhase('scanning') }}
            sx={{ height: 52, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}>
            {phase === 'scanning' ? `Scanning… ${progress}%` : 'Start Scan'}
          </Button>
        )}
      </Box>
    </Box>
  )
}

// ─── Multi-step verify flow (NID → Face) ─────────────────────────────────────
function VerifyFlow({ onStepDone, onDone, onClose }: { onStepDone: (step: 1 | 2) => void; onDone: () => void; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [phase, setPhase] = useState<'ready' | 'scanning' | 'success'>('ready')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (phase !== 'scanning') return
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(t); setPhase('success'); return 100 }
        return p + 4
      })
    }, 60)
    return () => clearInterval(t)
  }, [phase])

  const goNext = () => {
    if (step === 1) { onStepDone(1); setStep(2); setPhase('ready'); setProgress(0) }
    else { onStepDone(2); onDone() }
  }

  const isNid = step === 1
  const title = isNid ? 'Scan National ID' : 'Face Verification'
  const hint = isNid
    ? 'Position your National ID within the frame, ensure it is clearly visible'
    : 'Position your face within the frame and look directly at the camera'

  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 50, bgcolor: '#0D1117', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 3, pb: 1 }}>
        <IconButton onClick={step === 1 ? onClose : () => { setStep(1); setPhase('ready'); setProgress(0) }} sx={{ color: '#fff', ml: -1 }}>
          <Icon name="chevronLeft" size={24} color="#fff" />
        </IconButton>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Step {step} / 2</Typography>
        <Box sx={{ width: 40 }} />
      </Box>

      {/* Step bar */}
      <Box sx={{ display: 'flex', gap: '4px', px: 3, pb: 2 }}>
        {[1, 2].map((s) => (
          <Box key={s} sx={{ flex: 1, height: 3, borderRadius: 2, bgcolor: s <= step ? '#F5C518' : 'rgba(255,255,255,0.2)', transition: 'background 0.3s' }} />
        ))}
      </Box>

      {/* Instructions */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.3, mb: 1 }}>
          {step}. {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {hint.split(', ').map((line, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: '1px' }}>
                <Icon name="info" size={11} color="rgba(255,255,255,0.6)" />
              </Box>
              <Typography sx={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{line}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Camera frame */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
        {isNid ? (
          /* NID card frame */
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 320, aspectRatio: '1.58', borderRadius: '18px', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #8EC5DE 0%, #6FA8C8 100%)' }} />
            <Box sx={{ position: 'absolute', inset: 12, border: '2px dashed rgba(255,255,255,0.7)', borderRadius: '12px' }} />
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', px: 3, gap: 2.5 }}>
              <Box sx={{ width: 64, height: 64, flexShrink: 0 }}>
                <Box component="svg" viewBox="0 0 64 64" sx={{ width: '100%', height: '100%' }}>
                  <circle cx="32" cy="20" r="14" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
                  <path d="M8 58 C8 40 56 40 56 58" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
                </Box>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[90, 70, 70, 55].map((w, i) => (
                  <Box key={i} sx={{ height: '2px', width: `${w}%`, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
                ))}
              </Box>
            </Box>
            {phase === 'scanning' && (
              <Box sx={{ position: 'absolute', left: 12, right: 12, height: 2, bgcolor: 'rgba(96,165,250,0.9)', boxShadow: '0 0 8px rgba(96,165,250,1)', top: `${12 + (progress / 100) * 76}%`, transition: 'top 0.06s linear', borderRadius: 1 }} />
            )}
            {phase === 'success' && (
              <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={28} color="#fff" />
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          /* Face frame */
          <Box sx={{ position: 'relative', width: 220, height: 260 }}>
            <Box component="svg" viewBox="0 0 220 260" sx={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
              <ellipse cx="110" cy="130" rx="95" ry="115" fill="none"
                stroke={phase === 'success' ? '#22C55E' : phase === 'scanning' ? '#60A5FA' : 'rgba(255,255,255,0.45)'}
                strokeWidth="2" strokeDasharray={phase === 'scanning' ? '8 4' : 'none'}
                style={{ transition: 'stroke 0.4s' }}
              />
              {[{ x: 15, y: 15, r: 0 }, { x: 205, y: 15, r: 90 }, { x: 205, y: 245, r: 180 }, { x: 15, y: 245, r: 270 }].map(({ x, y, r }, i) => (
                <g key={i} transform={`rotate(${r}, ${x}, ${y})`}>
                  <path d={`M ${x} ${y + 16} L ${x} ${y} L ${x + 16} ${y}`} fill="none"
                    stroke={phase === 'success' ? '#22C55E' : '#60A5FA'} strokeWidth="3" strokeLinecap="round"
                    style={{ opacity: phase === 'ready' ? 0.5 : 1 }} />
                </g>
              ))}
            </Box>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {phase === 'success'
                ? <Icon name="checkCircle" size={48} color="#22C55E" />
                : <Icon name="faceId" size={56} color="rgba(255,255,255,0.18)" />
              }
            </Box>
            {phase === 'scanning' && (
              <Box sx={{ position: 'absolute', left: '10%', right: '10%', height: 2, bgcolor: 'rgba(96,165,250,0.8)', boxShadow: '0 0 6px rgba(96,165,250,1)', top: `${10 + (progress / 100) * 80}%`, transition: 'top 0.06s linear', borderRadius: 1 }} />
            )}
          </Box>
        )}
      </Box>

      {/* Status + bottom button */}
      <Box sx={{ px: 3, pb: '48px', pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {phase === 'scanning' && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CircularProgress size={14} sx={{ color: '#60A5FA' }} />
            <Typography sx={{ fontSize: 13, color: '#60A5FA', fontWeight: 600 }}>Scanning… {progress}%</Typography>
          </Box>
        )}
        {phase === 'success' ? (
          <Button variant="contained" fullWidth onClick={goNext}
            sx={{ height: 52, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: '#22C55E', '&:hover': { bgcolor: '#16A34A' } }}>
            {step === 1 ? 'Next — Face Scan' : 'All Done'}
          </Button>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            {/* Camera capture button */}
            <Box role="button" onClick={() => { setProgress(0); setPhase('scanning') }}
              sx={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid #fff', bgcolor: phase === 'scanning' ? '#444' : '#fff', cursor: phase === 'scanning' ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
              <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: phase === 'scanning' ? '#666' : '#fff', border: '2px solid #ccc' }} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

// ─── Step 2: Staff Information + Verify (combined) ───────────────────────────
export function StaffInfoScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')
  const [nidDone, setNidDone] = useState(false)
  const [faceDone, setFaceDone] = useState(false)
  const [showVerifyFlow, setShowVerifyFlow] = useState(false)

  const onContinue = () => {
    navigate('/create-pin' + (next ? '?next=' + encodeURIComponent(next) : ''))
  }

  return (
    <Box className="screen-enter" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1, overflowY: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 3, pt: 3, pb: 0 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ ml: -1, color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pt: 2, pb: 1 }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, color: HEADING, letterSpacing: '-0.4px', lineHeight: 1.15 }}>
            Verify Your Identity
          </Typography>
          <Typography sx={{ fontSize: 14, color: MUTED, mt: 0.75 }}>Complete the steps below to continue.</Typography>
        </Box>

        {/* ── Staff profile card — centered ──────────────────────────────── */}
        <Box sx={{ mx: 3, mt: 2, bgcolor: '#fff', borderRadius: '18px', px: 2.5, pt: 2.5, pb: 2, boxShadow: '0 2px 12px rgba(11,15,26,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
          {/* Avatar */}
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>SK</Typography>
          </Box>
          {/* Name + role */}
          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: HEADING, lineHeight: 1.2 }}>Sophea Kim</Typography>
            <Typography sx={{ fontSize: 13, color: MUTED, mt: 0.3 }}>Credit Officer</Typography>
          </Box>
          {/* Phone */}
          <Typography sx={{ fontSize: 12.5, color: MUTED }}>+855 012 345 678</Typography>
          {/* Description */}
          <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: 1.5, mt: 0.5, maxWidth: 280 }}>
            You are a verified staff member of NongHyup Finance (Cambodia) Plc. Please complete identity verification to activate your account.
          </Typography>
          {/* Verification completion status */}
          {(nidDone || faceDone) && (
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, bgcolor: nidDone ? '#DCFCE7' : '#F5F5F5', borderRadius: 999, px: 1, py: 0.4, border: `1px solid ${nidDone ? '#BFE6CF' : '#E0E4EA'}` }}>
                <Icon name={nidDone ? 'check' : 'idCard'} size={10} color={nidDone ? GREEN : MUTED} />
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: nidDone ? GREEN : MUTED }}>NID {nidDone ? '✓' : '—'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, bgcolor: faceDone ? '#DCFCE7' : '#F5F5F5', borderRadius: 999, px: 1, py: 0.4, border: `1px solid ${faceDone ? '#BFE6CF' : '#E0E4EA'}` }}>
                <Icon name={faceDone ? 'check' : 'faceId'} size={10} color={faceDone ? GREEN : MUTED} />
                <Typography sx={{ fontSize: 10, fontWeight: 700, color: faceDone ? GREEN : MUTED }}>Face {faceDone ? '✓' : '—'}</Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* ── Verification guideline steps ───────────────────────────────── */}
        <Box sx={{ mx: 3, mt: 2, mb: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[
            { num: 1, icon: 'idCard' as const, title: 'National ID — Front', desc: 'Take a clear photo of the front side of your national ID card', done: nidDone },
            { num: 2, icon: 'faceId' as const, title: 'Face Verification', desc: 'Position your face in the frame so we can verify your identity', done: faceDone },
          ].map(({ num, icon, title, desc, done }) => (
            <Box key={num} sx={{ display: 'flex', gap: 1.5, bgcolor: done ? '#EAF7EF' : '#fff', border: done ? '1px solid #BFE6CF' : '1px solid #E8EAEE', borderRadius: '14px', p: '12px 14px' }}>
              {/* Step number circle */}
              <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: done ? GREEN : BLUE, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {done
                  ? <Icon name="check" size={16} color="#fff" />
                  : <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{num}</Typography>
                }
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <Icon name={icon} size={14} color={done ? GREEN : BLUE} />
                  <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: HEADING }}>{title}</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: 1.4 }}>{desc}</Typography>
                {done && <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: GREEN, mt: 0.5 }}>✓ Completed</Typography>}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Verify flow overlay */}
      {showVerifyFlow && (
        <VerifyFlow
          onClose={() => setShowVerifyFlow(false)}
          onStepDone={(s) => { if (s === 1) setNidDone(true); else setFaceDone(true) }}
          onDone={() => setShowVerifyFlow(false)}
        />
      )}

      {/* Footer CTA */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 1.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<Icon name="arrowRight" size={18} color="#fff" />}
          onClick={nidDone && faceDone ? onContinue : () => setShowVerifyFlow(true)}
          sx={{
            height: 56, borderRadius: '14px', fontSize: 16, fontWeight: 700,
            bgcolor: nidDone && faceDone ? GREEN : BLUE,
            '&:hover': { bgcolor: nidDone && faceDone ? '#155E35' : '#1E4A9A' },
          }}
        >
          {nidDone && faceDone ? 'Continue' : 'Start Verification'}
        </Button>
      </Box>
    </Box>
  )
}

// ─── Step 3: Success ──────────────────────────────────────────────────────────
export function StaffSignUpSuccessScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, pb: 4 }}>
        <StepBar step={4} />

        {/* Success circle */}
        <Box sx={{
          width: 120, height: 120, borderRadius: '50%', bgcolor: '#DCFCE7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mt: 4, mb: 3, boxShadow: '0 0 0 20px rgba(34,197,94,0.08)',
        }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="checkCircle" size={40} color="#fff" />
          </Box>
        </Box>

        <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.7px', color: GREEN, textTransform: 'uppercase', mb: 1 }}>
          Step 4 of 4
        </Typography>
        <Typography sx={{ fontSize: 30, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', textAlign: 'center', lineHeight: 1.15 }}>
          You're all set!
        </Typography>
        <Typography sx={{ fontSize: 16, color: MUTED, mt: 1.5, textAlign: 'center', lineHeight: 1.5 }}>
          Your staff account has been verified. You can now access staff loan products.
        </Typography>

        {/* Staff recap */}
        <Box sx={{
          mt: 3.5, bgcolor: '#fff', borderRadius: '16px', px: 2.5, py: 2,
          display: 'flex', alignItems: 'center', gap: 2, width: '100%',
          boxShadow: '0 2px 10px rgba(11,15,26,0.07)',
        }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#E7F0FF', flexShrink: 0, overflow: 'hidden' }}>
            <Box component="img" src="/assets/illustrations/Avatar_01.png" alt=""
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none' }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: HEADING }}>Sophea Kim</Typography>
            <Typography sx={{ fontSize: 13, color: MUTED }}>Credit Officer · Riverside Branch</Typography>
          </Box>
          <Box sx={{ bgcolor: '#DCFCE7', borderRadius: 999, px: 1.25, py: 0.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: GREEN }}>Verified</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, px: 3, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained" fullWidth
          endIcon={<Icon name="arrowRight" size={18} color="#fff" />}
          onClick={() => navigate(next ?? '/products')}
          sx={{ height: 56, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: GREEN, '&:hover': { bgcolor: '#155E35' } }}
        >
          Go to Products
        </Button>
      </Box>
    </Box>
  )
}

// Re-export for backwards compat (route /staff-face-verify now unused)
export { StaffSignUpSuccessScreen as StaffFaceVerifyScreen }
