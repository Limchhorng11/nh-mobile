import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { Icon } from '../../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'
import { FieldCard, BottomSheet } from '../mwl/MwlParts'
import { AssetImg, ILLUS } from '../../components/home/media'
import { AvatarArt } from '../../components/home/illustrations'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const DANGER = '#D63B3B'

const EMPLOYMENT: { label: string; value: string }[] = [
  { label: 'Employment Type', value: 'Employed · Private sector' },
  { label: 'Occupation / Position', value: 'Senior accountant' },
  { label: 'Specify Comment', value: '—' },
  { label: 'Company Name', value: 'ABC Logistics Co., Ltd.' },
  { label: 'Business Type', value: 'Logistics & transport' },
  { label: 'Business Nature', value: 'Trading' },
  { label: 'Main source of income', value: 'Salary' },
  { label: 'Monthly Range', value: '$500.00' },
]

// ─── Profile identity card — photo, name, NID + blue detail panel ────────────
function IdentityCard() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = useState<string | null>(null)

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhoto(URL.createObjectURL(file))
  }

  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Box sx={{ width: 126, height: 126, borderRadius: '14px', overflow: 'hidden', bgcolor: '#EDF1F6' }}>
            {photo ? (
              <Box component="img" src={photo} alt="profile photo" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <AssetImg src={ILLUS.avatar01} alt="profile photo" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} fallback={<AvatarArt />} />
            )}
          </Box>
          {/* Hidden capture input — opens the device camera on mobile */}
          <Box
            component="input"
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={onPick}
            sx={{ display: 'none' }}
          />
          <Box
            onClick={() => fileRef.current?.click()}
            role="button"
            aria-label="Take photo"
            sx={{
              position: 'absolute',
              right: -6,
              bottom: -6,
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: BLUE,
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon name="camera" size={14} color="#fff" />
          </Box>
        </Box>
        <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Box>
            <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: 1.3 }}>Full Name</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: HEADING, lineHeight: 1.25 }} noWrap>
              Krong Kampuchea
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: 1.3 }}>National ID</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: HEADING }}>28012026001</Typography>
          </Box>
        </Box>
      </Box>

      {/* Blue detail panel */}
      <Box sx={{ bgcolor: BLUE, borderRadius: '12px', p: '14px', color: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>Birth Date</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>12 May 1988</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>Mobile</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>010 234 5678</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 1.5 }}>
          <Typography sx={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>Address</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: '#fff' }}>
            No. 28C, Street 308, Phum 14, Tonle Bassac, Chamkar Mon, Phnom Penh
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [staffOpen, setStaffOpen] = useState(false)
  const [staffId, setStaffId] = useState('')
  const [staffSave, setStaffSave] = useState<'idle' | 'loading' | 'match' | 'nomatch' | 'saved'>('idle')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const staffSavedRef = useRef(false)
  const [staffConfirmOpen, setStaffConfirmOpen] = useState(false)
  const [staffNoMatchOpen, setStaffNoMatchOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    if (staffSavedRef.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    if (staffId.length === 0) { setStaffSave('idle'); return }
    setStaffSave('loading')
    saveTimer.current = setTimeout(() => {
      if (/^NH-\d{9}$/.test(staffId)) {
        setStaffSave('match')
        setStaffConfirmOpen(true)
      } else {
        setStaffSave('nomatch')
      }
    }, 1200)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [staffId])

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Profile" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse} fontSize={30}>Profile</CollapsingTitle>

        <Box sx={{ px: 3, pt: 1.5, pb: '44px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Personal profile section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5, mb: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: MUTED }}>
                PERSONAL PROFILE
              </Typography>
            </Box>
            <IdentityCard />
          </Box>

          {/* Employment details — always visible */}
          <Box>
            <Box sx={{ py: 0.5, mb: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: MUTED }}>
                EMPLOYMENT DETAILS
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {EMPLOYMENT.map((f) => (
                <FieldCard key={f.label} label={f.label} value={f.value} />
              ))}
            </Box>
          </Box>

          {/* Staff Information — collapsible with Staff ID input */}
          <Box>
            <Box
              role="button"
              onClick={() => setStaffOpen((v) => !v)}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', py: 0.5 }}
            >
              <Box sx={{ display: 'flex', transform: staffOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
                <Icon name="chevronUp" size={18} color={MUTED} />
              </Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: MUTED }}>
                STAFF INFORMATION
              </Typography>
            </Box>
            {staffOpen && (
              <Box sx={{ mt: 1 }}>
                {staffSave === 'saved' ? (
                  <FieldCard
                    label="Staff ID"
                    value={staffId}
                    onClick={() => setStaffConfirmOpen(true)}
                    trailing={
                      <Box sx={{ display: 'flex' }}>
                        <Icon name="arrowRight" size={20} color={MUTED} />
                      </Box>
                    }
                  />
                ) : (
                  <FieldCard
                    label="Staff ID"
                    value={staffId}
                    onChange={(v) => setStaffId(v)}
                    placeholder="NH-000000000"
                    trailing={
                      staffSave === 'loading' ? (
                        <CircularProgress size={16} sx={{ color: BLUE, flexShrink: 0 }} />
                      ) : staffSave === 'match' ? (
                        <Box role="button" onClick={() => setStaffConfirmOpen(true)} sx={{ display: 'flex', cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                          <Icon name="checkCircle" size={20} color="#22C55E" />
                        </Box>
                      ) : staffSave === 'nomatch' ? (
                        <Box role="button" onClick={() => setStaffNoMatchOpen(true)} sx={{ display: 'flex', cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                          <Icon name="alert" size={20} color="#EF4444" />
                        </Box>
                      ) : null
                    }
                  />
                )}
              </Box>
            )}
          </Box>

          {/* Delete account */}
          <Box sx={{ pt: '60px', pb: '8px', display: 'flex', justifyContent: 'center' }}>
            <Box
              role="button"
              onClick={() => setDeleteOpen(true)}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:active': { opacity: 0.6 } }}
            >
              <Icon name="trash" size={20} color={MUTED} />
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: MUTED }}>Delete account</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Staff information confirmation sheet */}
      <BottomSheet open={staffConfirmOpen} onClose={() => setStaffConfirmOpen(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#EBF1FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="checkCircle" size={28} color={BLUE} />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px', mt: 0.5, textAlign: 'center' }}>
            This is your staff information
          </Typography>
          <Typography sx={{ fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 1.5 }}>
            Your staff ID has been verified and linked to your account.
          </Typography>
        </Box>
        {/* Staff ID card */}
        <Box sx={{ bgcolor: '#F5F7FB', borderRadius: '14px', px: 3, py: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography sx={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>Staff ID</Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: HEADING, letterSpacing: '0.5px' }}>{staffId}</Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={() => { staffSavedRef.current = true; setStaffSave('saved'); setStaffConfirmOpen(false) }}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4E9C' } }}
        >
          Got it
        </Button>
      </BottomSheet>

      {/* Staff ID no-match sheet */}
      <BottomSheet open={staffNoMatchOpen} onClose={() => setStaffNoMatchOpen(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={26} color="#EF4444" />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px', mt: 0.5, textAlign: 'center' }}>
            ID does not match
          </Typography>
          <Typography sx={{ fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 1.55 }}>
            Your ID does not match, please try again.
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={() => setStaffNoMatchOpen(false)}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}
        >
          Try again
        </Button>
      </BottomSheet>

      {/* Delete account confirmation sheet */}
      <BottomSheet open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="trash" size={26} color={DANGER} />
          </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px', mt: 0.5 }}>
            Delete account?
          </Typography>
          <Typography sx={{ fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 1.55 }}>
            This will permanently remove your account and all associated data. This action cannot be undone.
          </Typography>
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/flow-select')}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: DANGER, '&:hover': { bgcolor: '#B52E2E' } }}
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
      </BottomSheet>
    </Box>
  )
}
