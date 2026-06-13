import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'
import { FieldCard } from '../mwl/MwlParts'
import { AssetImg, ILLUS } from '../../components/home/media'
import { AvatarArt } from '../../components/home/illustrations'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

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
    <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
  const [empOpen, setEmpOpen] = useState(true)

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Profile" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse} fontSize={30}>Profile</CollapsingTitle>

        <Box sx={{ px: 3, pt: 1.5, pb: '44px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <IdentityCard />

          {/* Employment details — collapsible */}
          <Box>
            <Box
              onClick={() => setEmpOpen((v) => !v)}
              role="button"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', py: 0.5 }}
            >
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: MUTED }}>
                EMPLOYMENT DETAILS
              </Typography>
              <Box sx={{ display: 'flex', transform: empOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
                <Icon name="chevronUp" size={18} color={MUTED} />
              </Box>
            </Box>
            {empOpen && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mt: 1 }}>
                {EMPLOYMENT.map((f) => (
                  <FieldCard key={f.label} label={f.label} value={f.value} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
