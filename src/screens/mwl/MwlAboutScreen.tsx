import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFlow } from '../../workspace/FlowContext'
import { useSample } from '../../workspace/SampleContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon, IconName } from '../../components/Icon'
import { Flag, type FlagCode } from '../../components/Flag'
import { MwlHeader, MwlTitle, MwlFooter, GroupLabel, FieldCard, PhoneField, SelectField, BottomSheet, DiscardSheet, BLUE } from './MwlParts'
import { AssetImg, asset } from '../../components/home/media'

const DESTINATIONS: { id: string; flag: FlagCode; name: string; sub: string }[] = [
  { id: 'korea', flag: 'kr', name: 'Korea', sub: 'EPS · most active' },
  { id: 'japan', flag: 'jp', name: 'Japan', sub: 'SSW / Intern' },
  { id: 'singapore', flag: 'sg', name: 'Singapore', sub: 'Work Permit' },
]

const CITIES = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kandal']
const OCCUPATIONS = ['Garment worker', 'Construction worker', 'Farmer', 'Driver', 'Self-employed']
const STATUSES = ['Single', 'Married', 'Divorced', 'Widowed']
const BRANCHES = ['Chroy Changvar', 'Phnom Penh Main', 'Toul Kork', 'Sen Sok', 'Siem Reap', 'Battambang', 'Sihanoukville']

type DocId = 'nid' | 'selfie' | 'family'
const DOCS: { id: DocId; label: string; sample: string; img: string; canShare?: boolean }[] = [
  { id: 'nid', label: 'National ID Card', sample: 'Sample NID', img: asset('banners/NID.png') },
  { id: 'selfie', label: 'Selfie with NID', sample: 'Sample Selfie with NID', img: asset('banners/Selfie.png') },
  { id: 'family', label: 'Family Book', sample: 'Sample Family Book', img: asset('banners/FamBook.png'), canShare: true },
]

export default function MwlAboutScreen({ nonMwl = false }: { nonMwl?: boolean } = {}) {
  const navigate = useNavigate()
  const { flow } = useFlow()
  const { sample: globalSample } = useSample()
  const prefix = nonMwl ? '/nonmwl' : '/mwl'
  const [discardOpen, setDiscardOpen] = useState(false)
  const [firstName, setFirstName] = useState('Mao')
  const [lastName, setLastName] = useState('Sothea')
  const [phoneCode, setPhoneCode] = useState('+855')
  const [phone, setPhone] = useState('017 666 036')
  const [dest, setDest] = useState('korea')
  const [city, setCity] = useState('Phnom Penh')
  const [occupation, setOccupation] = useState('Garment worker')
  const [status, setStatus] = useState('Married')
  const [branch, setBranch] = useState('Chroy Changvar')
  const [sample, setSample] = useState<DocId | null>(null)
  const activeSample = DOCS.find((d) => d.id === sample) ?? null

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => globalSample === '2' && flow === 'New User' ? navigate('/home') : setDiscardOpen(true)} step={1} totalSteps={nonMwl ? 2 : 3} />
        <MwlTitle>Tell us about you</MwlTitle>

        <Box sx={{ px: 3, pb: 3, pt: '24px', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Destination picker — MWL only (migrant workers heading abroad) */}
          {!nonMwl && (
          <Box>
            <GroupLabel>WHERE ARE YOU HEADING?</GroupLabel>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
              {DESTINATIONS.map((d) => {
                const active = dest === d.id
                return (
                  <Box
                    key={d.id}
                    onClick={() => setDest(d.id)}
                    sx={{
                      position: 'relative',
                      bgcolor: '#fff',
                      borderRadius: '14px',
                      border: active ? `2px solid ${BLUE}` : '2px solid #E2E6EC',
                      p: 1.5,
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    {active && (
                      <Box sx={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', bgcolor: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" size={13} color="#fff" />
                      </Box>
                    )}
                    <Flag code={d.flag} size={32} rect />
                    <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#0B0F1A', mt: 0.75 }}>{d.name}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>
          )}

          {/* Your info */}
          <Box>
            <GroupLabel>YOUR INFO</GroupLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FieldCard label="First name" required value={firstName} onChange={setFirstName} />
                <FieldCard label="Last name" required value={lastName} onChange={setLastName} />
              </Box>
              <PhoneField label="Mobile number" code={phoneCode} number={phone} onNumberChange={setPhone} onCodeChange={setPhoneCode} />
              <SelectField label="City" required options={CITIES} value={city} onChange={setCity} />
              <SelectField label="Current occupation" required options={OCCUPATIONS} value={occupation} onChange={setOccupation} />
              <SelectField label="Status" required options={STATUSES} value={status} onChange={setStatus} />
              <SelectField label="Select Branch" required options={BRANCHES} value={branch} onChange={setBranch} />
            </Box>
          </Box>

          {/* Upload documents */}
          <Box sx={{ mt: '34px' }}>
            <GroupLabel>UPLOAD YOUR DOCUMENTS</GroupLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {DOCS.map((d) => (
                <DocRow key={d.id} label={d.label} img={d.img} canShare={d.canShare} onPreview={() => setSample(d.id)} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <MwlFooter onNext={() => navigate(`${prefix}-loan`)} />

      {/* Discard confirmation — leaving step 1 exits the apply flow */}
      <DiscardSheet open={discardOpen} onClose={() => setDiscardOpen(false)} onDiscard={() => navigate('/products')} />

      {/* Sample preview bottom sheet */}
      <BottomSheet open={sample !== null} onClose={() => setSample(null)}>
        <Typography sx={{ fontSize: 28, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px' }}>
          {activeSample?.sample}
        </Typography>
        <Box sx={{ bgcolor: '#EDEDED', borderRadius: '14px', overflow: 'hidden' }}>
          <AssetImg
            src={activeSample?.img}
            alt={activeSample?.sample}
            sx={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
            fallback={
              <Box sx={{ width: '100%', height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Icon name="image" size={40} color="#B4BCC9" />
                <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Sample photo</Typography>
              </Box>
            }
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {activeSample?.canShare && (
            <Button
              variant="outlined"
              onClick={() => setSample(null)}
              startIcon={<Icon name="upload" size={16} />}
              sx={{ height: 48, borderRadius: '12px', px: 2.5, fontSize: 14, fontWeight: 700, color: '#0B0F1A', borderColor: '#E2E6EC', bgcolor: '#fff' }}
            >
              Upload
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => setSample(null)}
            endIcon={<Icon name="arrowRight" size={16} />}
            sx={{ flex: 1, height: 48, borderRadius: '12px', fontSize: 14, fontWeight: 700 }}
          >
            Go Take Photo
          </Button>
        </Box>
      </BottomSheet>
    </Box>
  )
}

function DocRow({ label, img, canShare, onPreview }: { label: string; img?: string; canShare?: boolean; onPreview: () => void }) {
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '12px', px: 1.5, minHeight: 80, display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Box sx={{ width: 56, height: 56, borderRadius: '10px', bgcolor: '#F5F5F5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <AssetImg
          src={img}
          alt={label}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          fallback={<Icon name="image" size={22} color="#B4BCC9" />}
        />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0B0F1A' }} noWrap>
          {label}
        </Typography>
        <Typography onClick={onPreview} sx={{ fontSize: 12.5, fontWeight: 700, color: BLUE, cursor: 'pointer', mt: 0.25 }}>
          Preview Sample
        </Typography>
      </Box>
      <DocButton icon="camera" />
      {canShare && <DocButton icon="upload" />}
    </Box>
  )
}

function DocButton({ icon }: { icon: IconName }) {
  return (
    <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#EEF3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
      <Icon name={icon} size={19} color={BLUE} />
    </Box>
  )
}
