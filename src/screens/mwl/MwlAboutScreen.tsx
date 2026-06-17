import { useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon, IconName } from '../../components/Icon'
import { Flag, type FlagCode } from '../../components/Flag'
import { MwlHeader, MwlTitle, MwlFooter, GroupLabel, FieldCard, PhoneField, SelectField, BottomSheet, DiscardSheet, BLUE } from './MwlParts'
import Slider from '@mui/material/Slider'
import { AssetImg, asset } from '../../components/home/media'
import { buildSchedule, money, termStopsForProduct, type Currency } from '../loanCalc'

const DESTINATIONS: { id: string; flag: FlagCode; name: string; sub: string }[] = [
  { id: 'korea', flag: 'kr', name: 'Korea', sub: 'EPS · most active' },
  { id: 'japan', flag: 'jp', name: 'Japan', sub: 'SSW / Intern' },
  { id: 'singapore', flag: 'sg', name: 'Singapore', sub: 'Work Permit' },
]

const CITIES = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kandal']
const OCCUPATIONS = ['Garment worker', 'Construction worker', 'Farmer', 'Driver', 'Self-employed']
const STATUSES = ['Single', 'Married', 'Divorced', 'Widowed']
const BRANCHES = ['Chroy Changvar', 'Phnom Penh Main', 'Toul Kork', 'Sen Sok', 'Siem Reap', 'Battambang', 'Sihanoukville']
const CURRENCIES = ['Dollar', 'Riel']
// Small circular currency-symbol badge shown beside each currency option.
const currencyBadge = (symbol: string): ReactNode => (
  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#EEF3FC', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#275CB2', lineHeight: 1 }}>{symbol}</Typography>
  </Box>
)
const CURRENCY_ICONS: Record<string, ReactNode> = { Dollar: currencyBadge('$'), Riel: currencyBadge('៛') }

type DocId = 'nid' | 'selfie' | 'family'
const DOCS: { id: DocId; label: string; sample: string; img: string; canShare?: boolean }[] = [
  { id: 'nid', label: 'National ID Card', sample: 'Sample NID', img: asset('banners/NID.png') },
  { id: 'selfie', label: 'Selfie with NID', sample: 'Sample Selfie with NID', img: asset('banners/Selfie.png') },
  { id: 'family', label: 'Family Book', sample: 'Sample Family Book', img: asset('banners/FamBook.png'), canShare: true },
]

export default function MwlAboutScreen({ nonMwl = false }: { nonMwl?: boolean } = {}) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const prefix = nonMwl ? '/nonmwl' : '/mwl'
  const product = params.get('product') ?? 'Small Business Loan'
  // Term stops depend on the selected product (snap-to-preset slider).
  const termStops = termStopsForProduct(product)
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
  const [currency, setCurrency] = useState('Dollar')
  const [amount, setAmount] = useState('5,000')
  const [months, setMonths] = useState(() => (termStops.includes(24) ? 24 : termStops[0]))
  const [showTable, setShowTable] = useState(false)
  const [sample, setSample] = useState<DocId | null>(null)
  const activeSample = DOCS.find((d) => d.id === sample) ?? null

  // Switching currency converts the amount at 1 USD = 4,000 KHR.
  const RIEL_PER_USD = 4000
  const changeCurrency = (next: string) => {
    if (next === currency) return
    const n = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
    const converted =
      currency === 'Dollar' && next === 'Riel' ? n * RIEL_PER_USD : currency === 'Riel' && next === 'Dollar' ? n / RIEL_PER_USD : n
    setCurrency(next)
    setAmount(Math.round(converted).toLocaleString('en-US'))
  }

  // Payment table — constant monthly repayment at 0.75%/mo over the chosen term.
  const cur: Currency = currency === 'Riel' ? 'KHR' : 'USD'
  const principal = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
  const { payment, totalPayable, totalInterest, rows } = buildSchedule(principal, months, 0.75, 'Constant')

  // Download the full repayment schedule as a CSV.
  const downloadCsv = () => {
    const headers = ['Month', 'Principal', 'Interest', 'Payment', 'Balance']
    const csv = [
      headers.join(','),
      ...rows.map((r) => [r.month, r.principal.toFixed(2), r.interest.toFixed(2), r.payment.toFixed(2), r.balance.toFixed(2)].join(',')),
    ].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'repayment-table.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Non-MWL is a single step: Continue goes straight to the review summary,
  // carrying the entered details. (MWL keeps its multi-step flow.)
  const goNext = () => {
    if (!nonMwl) return navigate(`${prefix}-loan`)
    const qs = new URLSearchParams({
      product,
      name: `${firstName} ${lastName}`,
      phone: `${phoneCode} ${phone}`,
      branch,
      currency,
      amount,
      tenure: String(months),
    })
    navigate(`/nonmwl-review?${qs.toString()}`)
  }

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => setDiscardOpen(true)} step={nonMwl ? undefined : 1} totalSteps={3} />
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
              <SelectField label="Select Branch" required options={BRANCHES} value={branch} onChange={setBranch} />
              <SelectField label="Currency" required options={CURRENCIES} value={currency} onChange={changeCurrency} icons={CURRENCY_ICONS} />
            </Box>
          </Box>

          {/* Loan request — Non-MWL captures the amount on this same step */}
          {nonMwl && (
            <Box>
              <Box sx={{ bgcolor: '#fff', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: 12, color: '#8A94A6', lineHeight: '16px' }}>Amount</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#8A94A6' }}>{currency === 'Riel' ? '៛' : '$'}</Typography>
                  <Box
                    component="input"
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value.replace(/[^0-9,]/g, ''))}
                    aria-label="Loan amount"
                    sx={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', bgcolor: 'transparent', p: 0, fontSize: 16, fontWeight: 600, color: '#000', fontFamily: 'inherit', height: 24 }}
                  />
                </Box>
              </Box>

              {/* Show / Hide payment table */}
              <Box onClick={() => setShowTable((v) => !v)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75, cursor: 'pointer', pt: '10px' }}>
                <Icon name={showTable ? 'eyeOff' : 'eye'} size={17} color={BLUE} />
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: BLUE }}>{showTable ? 'Hide' : 'Show'} Payment Table</Typography>
              </Box>

              {showTable && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1.5 }}>
                  {/* Term — snap-to-stop slider (range depends on the product) */}
                  <Box sx={{ bgcolor: '#fff', borderRadius: '14px', p: '16px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.6px', color: '#737373', textTransform: 'uppercase' }}>Loan term</Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0B0F1A' }}>{months} months</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>{termStops[0]} months</Typography>
                      <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>{termStops[termStops.length - 1]} months</Typography>
                    </Box>
                    <Box sx={{ px: 0.5 }}>
                      <Slider
                        value={months}
                        onChange={(_, v) => setMonths(v as number)}
                        step={1}
                        min={termStops[0]}
                        max={termStops[termStops.length - 1]}
                        aria-label="Loan term in months"
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `${v}m`}
                        sx={{
                          mt: 0.5,
                          color: BLUE,
                          height: 6,
                          '& .MuiSlider-rail': { bgcolor: '#E7ECF2', opacity: 1 },
                          '& .MuiSlider-thumb': { width: 20, height: 20, boxShadow: '0 0 0 4px rgba(39,92,178,0.15)' },
                        }}
                      />
                    </Box>
                  </Box>
                  {/* Monthly payment summary */}
                  <Box sx={{ bgcolor: '#fff', borderRadius: '14px', p: '18px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.6px', color: '#737373', textTransform: 'uppercase' }}>Monthly payment</Typography>
                      <Box sx={{ bgcolor: '#EEF3FC', borderRadius: '999px', px: 1.25, py: '3px' }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: BLUE }}>0.75% / mo</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, mt: 0.5 }}>
                      <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#000', letterSpacing: '-0.5px', lineHeight: 1 }}>{money(payment, cur)}</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#000', mb: '2px' }}>/ month</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, pt: 2, borderTop: '1px solid #EEE' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', color: '#737373', textTransform: 'uppercase' }}>Total interest</Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#000', mt: 0.5 }}>{money(totalInterest, cur)}</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', color: '#737373', textTransform: 'uppercase' }}>Total payable</Typography>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#000', mt: 0.5 }}>{money(totalPayable, cur)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  {/* Repayment preview (first 3 months) */}
                  <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                      <Box component="thead">
                        <Box component="tr">
                          {['Mo', 'Principal', 'Interest', 'Payment', 'Balance'].map((h, i) => (
                            <Box component="th" key={h} sx={{ width: i === 0 ? 34 : undefined, bgcolor: '#FAFAFA', borderBottom: '1px solid #F0F0F0', fontSize: 11, fontWeight: 600, color: '#737373', textAlign: i === 0 ? 'center' : 'right', px: '6px', py: 1 }}>{h}</Box>
                          ))}
                        </Box>
                      </Box>
                      <Box component="tbody">
                        {rows.slice(0, 3).map((row) => (
                          <Box component="tr" key={row.month} sx={{ borderTop: '1px solid #F4F4F4' }}>
                            <Box component="td" sx={{ fontSize: 11.5, textAlign: 'center', px: '6px', py: '10px', color: '#737373', fontWeight: 600 }}>{row.month}</Box>
                            <Box component="td" sx={{ fontSize: 11.5, textAlign: 'right', px: '6px', py: '10px', color: '#3A4256' }}>{money(row.principal, cur)}</Box>
                            <Box component="td" sx={{ fontSize: 11.5, textAlign: 'right', px: '6px', py: '10px', color: '#3A4256' }}>{money(row.interest, cur)}</Box>
                            <Box component="td" sx={{ fontSize: 11.5, textAlign: 'right', px: '6px', py: '10px', color: '#000', fontWeight: 700 }}>{money(row.payment, cur)}</Box>
                            <Box component="td" sx={{ fontSize: 11.5, textAlign: 'right', px: '6px', py: '10px', color: '#3A4256' }}>{money(row.balance, cur)}</Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 11.5, color: '#8A94A6', textAlign: 'center' }}>
                    Showing 3 of {months} · 0.75%/mo ·{' '}
                    <Box component="span" role="button" onClick={downloadCsv} sx={{ color: BLUE, fontWeight: 700, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                      Download
                    </Box>{' '}
                    full table
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      <MwlFooter onNext={goNext} />

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
