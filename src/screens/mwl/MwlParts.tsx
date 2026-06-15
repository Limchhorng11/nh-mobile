import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../../components/Icon'
import CallSheet from '../../components/CallSheet'

export const BLUE = '#275CB2'

// ─── Header — back chevron + chat & phone icons + optional step bar ──────────
// The chat icon routes to the inbox; the call icon opens the shared Call sheet.
// The sheet is portaled into the phone canvas (not this sticky header) so it can
// cover the whole screen and slide up from the bottom edge.
export function MwlHeader({ onBack, step, totalSteps = 3, kebab = false }: { onBack: () => void; step?: number; totalSteps?: number; kebab?: boolean }) {
  const navigate = useNavigate()
  const [callOpen, setCallOpen] = useState(false)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setPortalEl(document.getElementById('phone-canvas'))
  }, [])

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: step ? 1.5 : 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={onBack} aria-label="Back" sx={{ ml: -1, color: '#0B0F1A' }}>
          <Icon name="chevronLeft" size={26} color="#0B0F1A" />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mr: '-7px' }}>
          {!kebab && (
            <Box
              component="img"
              src="/assets/brand/ico_chat.svg"
              alt="Chat"
              role="button"
              onClick={() => navigate('/chat')}
              sx={{ width: 22, height: 22, p: '7px', boxSizing: 'content-box', display: 'block', cursor: 'pointer', '&:active': { opacity: 0.6 } }}
            />
          )}
          <Box
            component="img"
            src="/assets/brand/ico_call.svg"
            alt="Call"
            role="button"
            onClick={() => setCallOpen(true)}
            sx={{ width: 22, height: 22, p: '7px', boxSizing: 'content-box', display: 'block', cursor: 'pointer', '&:active': { opacity: 0.6 } }}
          />
          {kebab && <Icon name="dotsVertical" size={22} color="#0B0F1A" />}
        </Box>
      </Box>
      {step && <StepBar step={step} totalSteps={totalSteps} />}

      {portalEl && createPortal(<CallSheet open={callOpen} onClose={() => setCallOpen(false)} />, portalEl)}
    </Box>
  )
}

function StepBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#8A94A6', flexShrink: 0 }}>Step {step}/{totalSteps}</Typography>
      <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
        {Array.from({ length: totalSteps }, (_, idx) => idx + 1).map((i) => (
          <Box key={i} sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: i <= step ? BLUE : '#E2E6EC' }} />
        ))}
      </Box>
    </Box>
  )
}

// ─── Page title ──────────────────────────────────────────────────────────────
export function MwlTitle({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', lineHeight: 1.15, px: 3, mt: 1.5, mb: 0.5 }}>
      {children}
    </Typography>
  )
}

// ─── Section label (e.g. "YOUR INFO") ────────────────────────────────────────
export function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6', mb: 1 }}>
      {children}
    </Typography>
  )
}

function Label({ label, required }: { label: string; required?: boolean }) {
  return (
    <Typography sx={{ fontSize: 12, color: '#8A94A6', lineHeight: 1.3 }}>
      {label}
      {required && <Box component="span" sx={{ color: '#E5484D', ml: 0.4 }}>*</Box>}
    </Typography>
  )
}

// ─── Field card — label above a value, optional trailing icon ────────────────
export function FieldCard({
  label,
  required,
  value,
  trailing,
  onClick,
}: {
  label: string
  required?: boolean
  value: ReactNode
  trailing?: ReactNode
  onClick?: () => void
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: '#fff',
        borderRadius: '12px',
        px: '16px',
        minHeight: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Label label={label} required={required} />
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#0B0F1A', mt: 0.25 }} noWrap>
          {value}
        </Typography>
      </Box>
      {trailing}
    </Box>
  )
}

// ─── Select field — FieldCard that opens an inline dropdown of options ───────
export function SelectField({
  label,
  required,
  options,
  value,
  onChange,
}: {
  label: string
  required?: boolean
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
    }
  }, [open])

  return (
    <Box ref={ref} sx={{ position: 'relative' }}>
      <FieldCard
        label={label}
        required={required}
        value={value}
        onClick={() => setOpen((v) => !v)}
        trailing={
          <Box sx={{ display: 'flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <Icon name="chevronDown" size={18} color="#8A94A6" />
          </Box>
        }
      />
      {open && (
        <Box sx={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 30, bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 6px 20px rgba(11,15,26,0.12)' }}>
          {options.map((o, i) => {
            const active = o === value
            return (
              <Box
                key={o}
                onClick={() => {
                  onChange(o)
                  setOpen(false)
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  minHeight: 56,
                  bgcolor: active ? '#F4F8FF' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: active ? 700 : 500, color: active ? BLUE : '#0B0F1A' }}>{o}</Typography>
                {active && <Icon name="check" size={18} color={BLUE} />}
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

// ─── Phone field — country code + divider + number ───────────────────────────
export function PhoneField({ label, code = '+855', number }: { label: string; code?: string; number: string }) {
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '12px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Label label={label} required />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>{code}</Typography>
          <Icon name="chevronDown" size={16} color="#8A94A6" />
        </Box>
        <Box sx={{ width: '1px', alignSelf: 'stretch', bgcolor: '#E2E6EC', my: 0.25 }} />
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#0B0F1A' }}>{number}</Typography>
      </Box>
    </Box>
  )
}

// ─── Bottom sheet — slides up within the phone canvas (no portal) ────────────
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}) {
  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 100,
          bgcolor: 'rgba(11,15,26,0.45)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />
      {/* Sheet */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 101,
          bgcolor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '88%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -8px 30px rgba(11,15,26,0.18)',
        }}
      >
        {/* Drag handle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.5, flexShrink: 0 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#D6DBE2' }} />
        </Box>
        {title && (
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#0B0F1A', textAlign: 'center', px: 3, pt: 0.5, pb: 1, flexShrink: 0 }}>
            {title}
          </Typography>
        )}
        <Box sx={{ overflowY: 'auto', px: '20px', pt: '24px', pb: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>{children}</Box>
      </Box>
    </>
  )
}

// ─── Discard confirmation — shown when leaving a half-finished application ────
export function DiscardSheet({
  open,
  onClose,
  onDiscard,
}: {
  open: boolean
  onClose: () => void
  onDiscard: () => void
}) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.3px' }}>
          Discard this application?
        </Typography>
        <Typography sx={{ fontSize: 14.5, color: '#5B6473', lineHeight: 1.5 }}>
          Your progress won’t be saved. You can start a new loan application anytime.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          variant="contained"
          onClick={onDiscard}
          sx={{ height: 52, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: '#E5484D', boxShadow: 'none', '&:hover': { bgcolor: '#D13A3F', boxShadow: 'none' } }}
        >
          Discard
        </Button>
        <Button
          variant="text"
          onClick={onClose}
          sx={{ height: 52, borderRadius: '14px', fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}
        >
          Keep editing
        </Button>
      </Box>
    </BottomSheet>
  )
}

// ─── Footer — Continue (and optional Previous) ───────────────────────────────
export function MwlFooter({
  onPrev,
  onNext,
  nextLabel = 'Continue',
}: {
  onPrev?: () => void
  onNext: () => void
  nextLabel?: string
}) {
  return (
    <Box sx={{ flexShrink: 0, display: 'flex', gap: 1.5, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
      {onPrev && (
        <Button
          variant="outlined"
          onClick={onPrev}
          startIcon={<Icon name="arrowLeft" size={16} />}
          sx={{ height: 48, borderRadius: '12px', px: 2.5, fontSize: 14, fontWeight: 700, color: '#0B0F1A', borderColor: '#E2E6EC', bgcolor: '#fff' }}
        >
          Previous
        </Button>
      )}
      <Button
        variant="contained"
        onClick={onNext}
        endIcon={<Icon name="arrowRight" size={16} />}
        sx={{ flex: 1, height: 48, borderRadius: '12px', fontSize: 14, fontWeight: 700 }}
      >
        {nextLabel}
      </Button>
    </Box>
  )
}
