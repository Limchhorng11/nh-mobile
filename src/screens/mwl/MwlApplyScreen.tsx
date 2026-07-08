import { Fragment, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'
import { Flag, type FlagCode } from '../../components/Flag'
import { AssetImg, asset } from '../../components/home/media'
import { MwlHeader, MwlTitle, FieldCard, SelectField, PhoneField, BottomSheet, DiscardSheet, BLUE } from './MwlParts'
import RepaymentEstimate from './RepaymentEstimate'
import { buildGraceSchedule, money, type Currency } from '../loanCalc'

// ─────────────────────────────────────────────────────────────────────────────
// Migration Worker Loan — 4-step application wizard.
//   1 Your Loan · 2 About You · 3 Guarantor · 4 Confirm
// Self-contained: holds all form state and steps through internally.
//
// MWL is a flat-interest product with an interest-only grace period: for the
// first 1–6 months the borrower pays interest only, then principal is spread
// evenly over the remaining months. The shared RepaymentEstimate card renders
// the tenure slider, monthly payment (with the interest-only figure) and the
// full schedule / PDF.
// ─────────────────────────────────────────────────────────────────────────────
const GREEN = '#1FA85C'
const MUTED = '#8A94A6'

const DESTINATIONS: { name: string; flag: FlagCode; long: string; code: string }[] = [
  { name: 'Korea', flag: 'kr', long: 'South Korea', code: 'KR' },
  { name: 'Japan', flag: 'jp', long: 'Japan', code: 'JP' },
  { name: 'Singapore', flag: 'sg', long: 'Singapore', code: 'SG' },
]
const BRANCHES = ['Khan Toul Kork Branch', 'Phnom Penh Main', 'Chroy Changvar', 'Siem Reap', 'Battambang']
const CURRENCIES = ['USD — US Dollar', 'KHR — Riel']
const STATUSES = ['Single', 'Married', 'Widow / Widower']
const RELATIONSHIPS = ['Spouse (1st)', 'Parent', 'Sibling', 'Relative', 'Friend']
const GRACE_OPTIONS = ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months']
const RATE_PCT = 1.5 // 1.5% / month
const MAX_LOAN = 15000 // maximum loan amount in USD (or KHR equivalent)

const GUARANTOR_STEPS = [
  { title: 'Open SMS Link', desc: 'They receive a secure link by SMS.' },
  { title: 'Review Loan', desc: 'They review your loan details and terms.' },
  { title: 'Confirm as Guarantor', desc: 'They confirm to back your application.' },
]

export default function MwlApplyScreen() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [sheet, setSheet] = useState<{ title: string; img?: string } | null>(null)
  // Documents start un-uploaded; the user taps to upload each.
  const [docs, setDocs] = useState<Record<string, boolean>>({})
  const upload = (key: string) => setDocs((d) => ({ ...d, [key]: true }))

  // Step 1 — Your Loan
  const [dest, setDest] = useState('Korea')
  const [branch, setBranch] = useState('Khan Toul Kork Branch')
  const [currency, setCurrency] = useState('USD — US Dollar')
  const [amount, setAmount] = useState('2,000')
  const [months, setMonths] = useState(12)
  const [graceMonths, setGraceMonths] = useState(3)
  // Step 2 — About You
  const [lastName, setLastName] = useState('Sok')
  const [firstName, setFirstName] = useState('Vanna')
  const [status, setStatus] = useState('Married')
  const [phoneCode, setPhoneCode] = useState('+855')
  const [phone, setPhone] = useState('96 234 5678')
  // Step 3 — Guarantor
  const [gLastName, setGLastName] = useState('Chan')
  const [gFirstName, setGFirstName] = useState('Dara')
  const [relationship, setRelationship] = useState('Spouse (1st)')
  const [gPhoneCode, setGPhoneCode] = useState('+855')
  const [gPhone, setGPhone] = useState('12 345 678')
  // Step 4 — Consent
  const [agree, setAgree] = useState(false)

  const curCode = currency.startsWith('KHR') ? 'KHR' : 'USD'
  const cur = (curCode === 'KHR' ? 'KHR' : 'USD') as Currency
  const principal = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
  const destObj = DESTINATIONS.find((d) => d.name === dest)

  // Loan amount cap — KHR uses 4,000 rate; compare against USD equivalent.
  const principalUsd = curCode === 'KHR' ? principal / 4000 : principal
  const overMax = principal > 0 && principalUsd > MAX_LOAN

  // Flat-interest grace schedule — figures shared with the estimate card.
  const { payment, totalPayable } = buildGraceSchedule(principal, months, RATE_PCT, graceMonths)
  const interestOnlyPay = principal * (RATE_PCT / 100)

  const back = () => (step > 1 ? setStep(step - 1) : setDiscardOpen(true))
  const next = () => (step < 4 ? setStep(step + 1) : navigate('/mwl-success'))

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      {/* Step body — old-style header (Step X/4 bar) + title */}
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={back} step={step} totalSteps={4} />
        <MwlTitle>{step === 1 ? 'Your Loan' : step === 2 ? 'About You' : step === 3 ? 'Your Guarantor' : 'Confirm'}</MwlTitle>
        <Box sx={{ px: 3, pt: 2, pb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {step === 1 && (
            <>
              {/* Destination — dropdown with flag */}
              <SelectField
                label="Where are you heading?"
                required
                options={DESTINATIONS.map((d) => d.name)}
                value={dest}
                onChange={setDest}
                icons={Object.fromEntries(DESTINATIONS.map((d) => [d.name, <Flag key={d.name} code={d.flag} size={22} rect />]))}
              />
              <SelectField label="Nearest Branch" required options={BRANCHES} value={branch} onChange={setBranch} />
              <SelectField label="Currency" required options={CURRENCIES} value={currency} onChange={setCurrency} />
              {/* Interest-only grace period — borrower pays interest only for 1–6 months */}
              <SelectField
                label="Interest Only Payment"
                required
                options={GRACE_OPTIONS}
                value={`${graceMonths} month${graceMonths > 1 ? 's' : ''}`}
                onChange={(v) => setGraceMonths(parseInt(v, 10) || 0)}
              />
              {/* Repayment estimate — shared card (tenure slider + monthly payment + interest-only + schedule) */}
              <RepaymentEstimate
                product="Migration Worker Loan"
                principal={principal}
                currency={cur}
                months={months}
                onMonthsChange={setMonths}
                minMonths={12}
                maxMonths={36}
                ratePct={RATE_PCT}
                graceMonths={graceMonths}
                label=""
                scheduleTitle={destObj?.long}
                onPrincipalChange={(p) => setAmount(String(p))}
                minAmount={100}
                maxAmount={curCode === 'KHR' ? MAX_LOAN * 4000 : MAX_LOAN}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FieldCard label="Last Name" required value={lastName} onChange={setLastName} />
                <FieldCard label="First Name" required value={firstName} onChange={setFirstName} />
              </Box>
              <SelectField label="Marital Status" required options={STATUSES} value={status} onChange={setStatus} />
              <PhoneField label="Phone Number" code={phoneCode} number={phone} onCodeChange={setPhoneCode} onNumberChange={setPhone} />
              <Box sx={{ mt: 1 }}>
                <SubLabel>Upload ID &amp; Family Book</SubLabel>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <DocRow label="National ID — Front" img={asset('banners/NID.png')} uploaded={!!docs.nid} onUpload={() => upload('nid')} onView={() => setSheet({ title: 'National ID — Front', img: asset('banners/NID.png') })} />
                  <DocRow label="Family / Residential Book" img={asset('banners/FamBook.png')} uploaded={!!docs.family} onUpload={() => upload('family')} onView={() => setSheet({ title: 'Family / Residential Book', img: asset('banners/FamBook.png') })} />
                </Box>
              </Box>
            </>
          )}

          {step === 3 && (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FieldCard label="Last Name" required value={gLastName} onChange={setGLastName} />
                <FieldCard label="First Name" required value={gFirstName} onChange={setGFirstName} />
              </Box>
              <SelectField label="Relationship" required options={RELATIONSHIPS} value={relationship} onChange={setRelationship} />
              <PhoneField label="Phone Number" code={gPhoneCode} number={gPhone} onCodeChange={setGPhoneCode} onNumberChange={setGPhone} />
              <Box sx={{ mt: 1 }}>
                <SubLabel>Guarantor's National ID</SubLabel>
                <DocRow label="Upload Photo" img={asset('banners/NID.png')} uploaded={!!docs.guarantor} onUpload={() => upload('guarantor')} onView={() => setSheet({ title: "Guarantor's National ID", img: asset('banners/NID.png') })} />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Box sx={{ bgcolor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '14px', p: '16px' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ width: 22, height: 22, borderRadius: '6px', bgcolor: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="checkCircle" size={13} color="#fff" />
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#92400E', letterSpacing: '0.1px' }}>What Your Guarantor Will Do</Typography>
                  </Box>

                  {/* Horizontal stepper */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    {GUARANTOR_STEPS.map((s, i) => (
                      <Fragment key={s.title}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                          <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: i === 0 ? '#F59E0B' : '#FBEBC6', border: i === 0 ? 'none' : '1.5px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 800, color: i === 0 ? '#fff' : '#B7791F' }}>{i + 1}</Typography>
                          </Box>
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#92400E', textAlign: 'center', mt: 0.75, lineHeight: 1.25, whiteSpace: 'pre-line' }}>{s.title.replace(' ', '\n')}</Typography>
                        </Box>
                        {i < GUARANTOR_STEPS.length - 1 && (
                          <Box sx={{ flex: 1, height: 1.5, bgcolor: '#F59E0B', mt: '15px', opacity: 0.4 }} />
                        )}
                      </Fragment>
                    ))}
                  </Box>

                  {/* Footer note */}
                  <Typography sx={{ fontSize: 12, color: '#92400E', mt: 2, opacity: 0.8 }}>
                    They'll get an SMS link after you submit.
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {step === 4 && (
            <>
              <Box>
                <SubLabel>Review Summary</SubLabel>
                <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', px: '16px' }}>
                  <SummaryRow label="Destination" value={<Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}><Flag code={destObj?.flag ?? 'kr'} size={18} rect /> {destObj?.long}</Box>} first />
                  <SummaryRow label="Currency" value={curCode} />
                  <SummaryRow label="Loan Request" value={`${curCode} ${amount}`} />
                  <SummaryRow label="Borrower" value={`${lastName} ${firstName}`} />
                  <SummaryRow label="Marital Status" value={status} />
                  <SummaryRow label="Phone" value={`${phoneCode} ${phone}`} />
                  <SummaryRow label="Branch" value={branch} />
                  <SummaryRow label="Documents" value={<Box component="span" sx={{ color: GREEN, fontWeight: 700 }}>Uploaded</Box>} />
                  <SummaryRow label="Guarantor" value={`${gLastName} ${gFirstName}`} />
                  <SummaryRow label="Relationship" value={relationship} />
                </Box>
              </Box>
              <Box>
                <SubLabel>Indicative Terms</SubLabel>
                <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', px: '16px' }}>
                  <SummaryRow label="Interest Rate" value="1.50% / month" first />
                  <SummaryRow label="Tenure" value={`${months} months`} />
                  <SummaryRow label="Interest-only" value={`${graceMonths} months`} />
                  <SummaryRow label="Est. interest-only" value={`${money(interestOnlyPay, cur)} / mo`} />
                  <SummaryRow label="Est. regular" value={`${money(payment, cur)} / mo`} />
                  <SummaryRow label="Total repayable" value={money(totalPayable, cur)} />
                </Box>
                <Typography sx={{ fontSize: 11.5, color: MUTED, mt: 1, px: 0.5 }}>Indicative only · final terms confirmed at credit assessment.</Typography>
              </Box>

              {/* CBC + Guarantor consent */}
              <Box
                onClick={() => setAgree((v) => !v)}
                role="checkbox"
                aria-checked={agree}
                sx={{ display: 'flex', gap: 1.5, bgcolor: '#fff', border: `1px solid ${agree ? BLUE : '#E8EAEE'}`, borderRadius: '12px', p: '16px', cursor: 'pointer', alignItems: 'flex-start', transition: 'border-color 0.15s', '&:active': { opacity: 0.85 } }}
              >
                <Box sx={{ mt: '1px', width: 22, height: 22, borderRadius: '6px', flexShrink: 0, border: `2px solid ${agree ? BLUE : '#CBD3DF'}`, bgcolor: agree ? BLUE : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>
                  {agree && <Icon name="check" size={14} color="#fff" />}
                </Box>
                <Typography sx={{ fontSize: 13.5, color: '#3A4256', lineHeight: 1.55 }}>
                  By submitting, I consent to NHFC accessing my CBC report and sending a secure consent link to my guarantor in accordance with applicable laws.
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 2, pb: '40px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          disabled={(step === 1 && overMax) || (step === 4 && !agree)}
          onClick={next}
          endIcon={step < 4 ? <Icon name="arrowRight" size={18} /> : undefined}
          sx={{
            height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700,
            bgcolor: step === 4 ? GREEN : BLUE,
            '&:hover': { bgcolor: step === 4 ? '#1A9150' : '#1F4F9E' },
            '&.Mui-disabled': { bgcolor: '#C8D2E0', color: '#fff' },
          }}
        >
          {step === 4 ? 'Submit Loan Request' : 'Continue'}
        </Button>
      </Box>

      <DiscardSheet open={discardOpen} onClose={() => setDiscardOpen(false)} onDiscard={() => navigate('/products')} />

      {/* View sample sheet */}
      <BottomSheet open={sheet !== null} onClose={() => setSheet(null)} title={sheet?.title}>
        {sheet?.img ? (
          <Box sx={{ bgcolor: '#EDEDED', borderRadius: '14px', overflow: 'hidden' }}>
            <AssetImg src={sheet.img} alt={sheet.title} sx={{ width: '100%', height: 'auto', display: 'block' }}
              fallback={<Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="image" size={40} color="#B4BCC9" /></Box>} />
          </Box>
        ) : (
          <Typography sx={{ fontSize: 14, color: '#5B6473', lineHeight: 1.6 }}>
            Sample document preview.
          </Typography>
        )}
        <Button variant="contained" fullWidth onClick={() => setSheet(null)} sx={{ height: 50, borderRadius: '14px', fontSize: 15, fontWeight: 700 }}>
          Got it
        </Button>
      </BottomSheet>
    </Box>
  )
}

function SubLabel({ children }: { children: ReactNode }) {
  return <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#3A4256', mb: 1 }}>{children}</Typography>
}

function DocRow({ label, img, uploaded, onUpload, onView }: { label: string; img: string; uploaded: boolean; onUpload: () => void; onView: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: uploaded ? '#EAF7EF' : '#fff', border: uploaded ? '1px solid #BFE6CF' : '1px dashed #CBD3DF', borderRadius: '12px', p: '10px 12px' }}>
      <Box sx={{ width: 52, height: 40, borderRadius: '8px', overflow: 'hidden', flexShrink: 0, bgcolor: '#F2F4F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {uploaded ? (
          <AssetImg src={img} alt={label} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} fallback={<Icon name="image" size={18} color="#B4BCC9" />} />
        ) : (
          <Icon name="camera" size={18} color="#9AA3B2" />
        )}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0B0F1A' }} noWrap>{label}</Typography>
        <Typography role="button" onClick={onView} sx={{ fontSize: 12, fontWeight: 600, color: BLUE, cursor: 'pointer', display: 'inline-block', mt: '1px' }}>
          View sample
        </Typography>
      </Box>
      {uploaded ? (
        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="check" size={14} color="#fff" />
        </Box>
      ) : (
        <Box role="button" aria-label={`Upload ${label}`} onClick={onUpload} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, bgcolor: '#EEF3FC', borderRadius: '999px', px: 1.25, py: 0.75, cursor: 'pointer', '&:active': { opacity: 0.7 } }}>
          <Icon name="camera" size={15} color={BLUE} />
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: BLUE }}>Upload</Typography>
        </Box>
      )}
    </Box>
  )
}

function SummaryRow({ label, value, first = false }: { label: string; value: ReactNode; first?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: '13px', borderTop: first ? 'none' : '1px solid #F1F4F8' }}>
      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#0B0F1A', flexShrink: 0 }}>{label}</Typography>
      <Typography component="div" sx={{ fontSize: 13.5, color: '#3A4256', textAlign: 'right' }}>{value}</Typography>
    </Box>
  )
}
