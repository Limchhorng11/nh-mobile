import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'
import { MwlHeader, MwlTitle, GroupLabel, SelectField, PhoneField, DiscardSheet, BLUE } from './mwl/MwlParts'
import RepaymentEstimate from './mwl/RepaymentEstimate'
import { addApplication, reviewQuery, type LoanApplication } from '../workspace/applications'
import { buildGraceSchedule, money } from './loanCalc'

const BANKS = ['ABA Bank', 'ACLEDA Bank', 'Canadia Bank', 'Wing Bank', 'PPCBank']

// Loan 1: normal staff loan · Loan 2: top-up while Loan 1 is active (25% of salary)
const BASE_SALARY = 500          // sample base salary (USD)
const LOAN2_MAX = Math.floor(BASE_SALARY * 0.25)  // $200

const LOAN_TYPES = [
  { label: 'Loan 1', maxAmount: 1000, rate: 1.0 },
  { label: 'Loan 2', maxAmount: LOAN2_MAX, rate: 1.2 },
]

// Sample active Loan 1 data (shown in Loan 2 flow)
const ACTIVE_LOAN1 = {
  ref: 'NH-2025-00412',
  original: '$1,000.00',
  outstanding: '$625.00',
  monthlyPayment: '$92.50',
  remainingTerm: '7 months',
  startDate: '1 Dec 2025',
}

const MUTED = '#8A94A6'
const HEADING = '#0B0F1A'
const GREEN = '#1FA85C'

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography sx={{ fontSize: 13, color: MUTED }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: bold ? 700 : 500, color: bold ? HEADING : '#3A4256' }}>{value}</Typography>
    </Box>
  )
}

export default function StaffLoanScreen() {
  const navigate = useNavigate()
  const [discardOpen, setDiscardOpen] = useState(false)
  const [loanType, setLoanType] = useState(0)
  const activeLoan = LOAN_TYPES[loanType]
  const isLoan2 = loanType === 1

  // Your info
  const [firstName, setFirstName] = useState('Sophea')
  const [lastName, setLastName] = useState('Kim')
  const [staffId, setStaffId] = useState('NH-042800000')
  const formatStaffId = (v: string) => {
    const digits = v.replace(/[^0-9]/g, '').slice(0, 9)
    setStaffId('NH-' + digits)
  }
  const [phoneCode, setPhoneCode] = useState('+855')
  const [phone, setPhone] = useState('096 234 5678')
  // Bank account
  const [bank, setBank] = useState('ABA Bank')
  const [accountName, setAccountName] = useState('Sophea Kim')
  const [accountNo, setAccountNo] = useState('000 123 456')
  // Request
  const [amount, setAmount] = useState('500')
  const [months, setMonths] = useState(12)
  const term = `${months} months`
  // Credit bureau consent
  const [agree, setAgree] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [reviewAgree, setReviewAgree] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [faceState, setFaceState] = useState<'scanning' | 'success'>('scanning')
  const [pinStep, setPinStep] = useState(false)
  const [pinValue, setPinValue] = useState('')

  const principal = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
  const overMax = principal > activeLoan.maxAmount
  const { payment: monthlyPayment } = buildGraceSchedule(principal, months, activeLoan.rate, 0)
  const overPayment = principal > 0 && monthlyPayment >= principal * 0.25
  const salaryPct = (monthlyPayment / BASE_SALARY) * 100
  const overSalaryPct = principal > 0 && salaryPct > 25

  const upfrontFee = principal * 0.01
  const cbcFee = 5
  const netAmount = principal - upfrontFee - cbcFee

  const submit = () => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    const app: LoanApplication = {
      title: isLoan2 ? 'Staff Loan 2' : 'Staff Loan',
      amount: `$${amount}.00`,
      term,
      rate: `${activeLoan.rate}%/mo`,
      ref: isLoan2 ? 'NH-2026-05120' : 'NH-2026-04830',
      on: today,
    }
    addApplication(app)
    navigate(`/my-loan-review?${reviewQuery(app)}`)
  }

  if (reviewing && true) {
    return (
      <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
        <Box className="scroll-content" sx={{ flex: 1 }}>
          {/* Header — matches MwlHeader style */}
          <Box sx={{ px: 3, pt: 3, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ ml: -1 }}>
              <IconButton onClick={() => setReviewing(false)} aria-label="Back" sx={{ color: HEADING }}>
                <Icon name="chevronLeft" size={26} color={HEADING} />
              </IconButton>
            </Box>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: HEADING, letterSpacing: '-0.4px' }}>Review & confirm</Typography>
            <Box sx={{ width: 40 }} />
          </Box>

          <Box sx={{ px: 3, pb: 3, pt: 0.5, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* YOUR LOAN summary card */}
            <Box>
              <GroupLabel>YOUR LOAN</GroupLabel>
              <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden' }}>
                {/* Fee rows */}
                <Box sx={{ px: '18px', pt: '16px', pb: '4px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Loan amount', value: money(principal, 'USD'), highlight: false },
                    { label: `Upfront fee · ${activeLoan.rate === 1.0 ? '1.00' : '1.20'}%`, value: `-${money(upfrontFee, 'USD')}`, highlight: false },
                    { label: 'CBC fee', value: `-${money(cbcFee, 'USD')}`, highlight: false },
                  ].map((row) => (
                    <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '10px', borderBottom: '1px solid #F2F4F7' }}>
                      <Typography sx={{ fontSize: 14, color: '#5B6473' }}>{row.label}</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#3A4256' }}>{row.value}</Typography>
                    </Box>
                  ))}
                  {/* Net released row — highlighted */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '12px' }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>Released to your payroll account</Typography>
                    <Typography sx={{ fontSize: 15, fontWeight: 800, color: GREEN }}>{money(netAmount, 'USD')}</Typography>
                  </Box>
                </Box>

                {/* Divider */}
                <Box sx={{ mx: '18px', borderTop: '1px dashed #D6DCE5' }} />

                {/* Term / payment rows */}
                <Box sx={{ px: '18px', pt: '4px', pb: '16px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Term', value: `${months} months · ${activeLoan.rate}%/mo` },
                    { label: 'Monthly repayment (auto-deducted)', value: money(monthlyPayment, 'USD') },
                    { label: '1st Payroll Deduction', value: 'Next payday' },
                  ].map((row) => (
                    <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: '10px', borderBottom: '1px solid #F2F4F7', '&:last-child': { borderBottom: 'none' } }}>
                      <Typography sx={{ fontSize: 14, color: '#5B6473' }}>{row.label}</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING }}>{row.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Disbursement notice */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, bgcolor: '#EAF4EE', border: '1px solid #B7DFCA', borderRadius: '12px', p: '14px 16px' }}>
              <Box sx={{ flexShrink: 0, mt: '1px' }}>
                <Icon name="info" size={17} color="#1A7A45" strokeWidth={1.8} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#145C33', lineHeight: 1.4 }}>
                  Disbursed to your payroll account
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#2D6A48', mt: 0.4, lineHeight: 1.5 }}>
                  Your approved loan amount will be automatically transferred to your registered NongHyup payroll account.
                </Typography>
              </Box>
            </Box>

            {/* Final consent */}
            <Box
              role="checkbox"
              aria-checked={reviewAgree}
              onClick={() => setReviewAgree((v) => !v)}
              sx={{ display: 'flex', gap: 1.5, bgcolor: '#fff', border: `1.5px solid ${reviewAgree ? BLUE : '#E8EAEE'}`, borderRadius: '12px', p: '16px', cursor: 'pointer', alignItems: 'flex-start', transition: 'border-color 0.15s', '&:active': { opacity: 0.85 } }}
            >
              <Box sx={{ mt: '1px', width: 22, height: 22, borderRadius: '6px', flexShrink: 0, border: `2px solid ${reviewAgree ? BLUE : '#CBD3DF'}`, bgcolor: reviewAgree ? BLUE : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>
                {reviewAgree && <Icon name="check" size={14} color="#fff" />}
              </Box>
              <Typography sx={{ fontSize: 13.5, color: '#3A4256', lineHeight: 1.55 }}>
                I have read and agree to the{' '}
                <Box component="span" sx={{ fontWeight: 700, color: HEADING }}>Loan Terms &amp; Conditions</Box>
                {' '}and authorise{' '}
                <Box component="span" sx={{ fontWeight: 700, color: HEADING }}>salary deduction</Box>
                . I consent to the{' '}
                <Box component="span" sx={{ fontWeight: 700, color: HEADING }}>CBC credit check</Box>
                {' '}and to{' '}
                <Box component="span" sx={{ fontWeight: 700, color: HEADING }}>e-sign</Box>
                {' '}the digital loan contract.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* CTA */}
        <Box sx={{ flexShrink: 0, px: 3, pt: 2, pb: '44px', bgcolor: '#F5F5F5' }}>
          <Button
            variant="contained"
            fullWidth
            disabled={!reviewAgree}
            onClick={() => { setFaceState('scanning'); setReviewing(false); setVerifying(true) }}
            sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: GREEN, '&:hover': { bgcolor: '#178a4a' }, '&.Mui-disabled': { bgcolor: '#C8D2E0', color: '#fff' } }}
          >
            Agree &amp; get my money
          </Button>
          <Typography sx={{ fontSize: 12, color: MUTED, textAlign: 'center', mt: 1.5, lineHeight: 1.5 }}>
            Next: confirm it's you with Face ID + PIN, then we fund instantly.
          </Typography>
        </Box>
      </Box>
    )
  }

  if (pinStep) {
    const BLUE = '#275CB2'
    const MUTED = '#8A94A6'
    const INK = '#0B1437'
    const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'back']
    const press = (k: string) => {
      if (k === 'C') return setPinValue('')
      if (k === 'back') return setPinValue(p => p.slice(0, -1))
      if (pinValue.length >= 4) return
      const next = pinValue + k
      setPinValue(next)
      if (next.length === 4) setTimeout(() => { setPinStep(false); setPinValue(''); submit() }, 400)
    }
    return (
      <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
        <Box sx={{ px: 3, pt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => { setPinStep(false); setVerifying(true); setFaceState('success') }} aria-label="Close" sx={{ mr: -1, color: '#0B0F1A' }}>
            <Icon name="close" size={26} color="#0B0F1A" />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 3, mt: 1 }}>
          <Icon name="accountSecurity" size={40} color={INK} />
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: INK, letterSpacing: 2, mt: 0.5, mb: 1.5 }}>***</Typography>
          <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', textAlign: 'center' }}>
            Enter PIN to continue
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            {[0, 1, 2, 3].map((i) => (
              <Box key={i} sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: i < pinValue.length ? BLUE : 'transparent', border: `2px solid ${i < pinValue.length ? BLUE : '#CBD3DF'}` }} />
            ))}
          </Box>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: 1, px: 3 }}>
            {KEYS.map((k) => (
              <Box key={k} component="button" type="button" onClick={() => press(k)} aria-label={k === 'back' ? 'Delete' : k === 'C' ? 'Clear' : k}
                sx={{ height: 64, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent', border: 'none', fontFamily: 'inherit', fontSize: 30, fontWeight: 500, color: k === 'C' ? MUTED : '#0B0F1A', cursor: 'pointer', borderRadius: '50%', '&:active': { bgcolor: 'rgba(11,15,26,0.06)' } }}>
                {k === 'back' ? <Icon name="backspace" size={26} color="#5B6473" /> : k}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, pt: 1.5, pb: '36px' }}>
            <IconButton aria-label="Use Face ID" sx={{ color: MUTED }}>
              <Icon name="faceId" size={30} color={MUTED} />
            </IconButton>
            <Typography role="button" sx={{ fontSize: 15, fontWeight: 600, color: MUTED, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
              Forgot PIN?
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  if (verifying && true) {
    const isSuccess = faceState === 'success'
    return (
      <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0B0F1A' }}>
        {/* Back button — only shown while scanning, not after success */}
        {!isSuccess && (
          <Box sx={{ px: 2, pt: 2, flexShrink: 0 }}>
            <IconButton
              onClick={() => { setVerifying(false); setReviewing(true) }}
              aria-label="Back"
              sx={{ color: '#fff' }}
            >
              <Icon name="chevronLeft" size={26} color="#fff" />
            </IconButton>
          </Box>
        )}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, gap: 0 }}>
          {/* Face scan frame */}
          <Box sx={{ position: 'relative', width: 220, height: 260, mb: 4 }}>
            {/* Face photo */}
            <Box sx={{
              position: 'absolute', inset: 0,
              borderRadius: '16px',
              overflow: 'hidden',
              bgcolor: '#1A2035',
            }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
                alt="Face sample"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: isSuccess ? 1 : 0.85 }}
              />
              {/* Scan line overlay */}
              {!isSuccess && (
                <Box sx={{
                  position: 'absolute', left: 0, right: 0, height: '3px',
                  background: `linear-gradient(90deg, transparent, ${BLUE}, transparent)`,
                  boxShadow: `0 0 12px 4px ${BLUE}55`,
                  animation: 'scanLine 2s ease-in-out infinite',
                  '@keyframes scanLine': {
                    '0%': { top: '10%' },
                    '50%': { top: '85%' },
                    '100%': { top: '10%' },
                  },
                }} />
              )}
              {/* Success green overlay */}
              {isSuccess && (
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(31,168,92,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#1FA85C', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(31,168,92,0.5)' }}>
                    <Icon name="check" size={30} color="#fff" />
                  </Box>
                </Box>
              )}
            </Box>
            {/* Corner brackets */}
            {[
              { top: -4, left: -4, borderTop: '3px solid', borderLeft: '3px solid', borderRadius: '10px 0 0 0' },
              { top: -4, right: -4, borderTop: '3px solid', borderRight: '3px solid', borderRadius: '0 10px 0 0' },
              { bottom: -4, left: -4, borderBottom: '3px solid', borderLeft: '3px solid', borderRadius: '0 0 0 10px' },
              { bottom: -4, right: -4, borderBottom: '3px solid', borderRight: '3px solid', borderRadius: '0 0 10px 0' },
            ].map((s, i) => (
              <Box key={i} sx={{ position: 'absolute', width: 36, height: 36, borderColor: isSuccess ? '#1FA85C' : BLUE, transition: 'border-color 0.4s', zIndex: 2, ...s }} />
            ))}
          </Box>

          {/* Status text */}
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', textAlign: 'center', lineHeight: 1.2 }}>
            {isSuccess ? 'Identity Verified' : 'Face ID'}
          </Typography>
          <Typography sx={{ fontSize: 14, color: isSuccess ? '#1FA85C' : '#8A94A6', textAlign: 'center', mt: 1, lineHeight: 1.5, transition: 'color 0.4s' }}>
            {isSuccess ? 'Verification successful. Continue to confirm with your PIN.' : 'Look at your camera to verify your identity'}
          </Typography>

          {/* Dot indicators */}
          {!isSuccess && (
            <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
              {[0, 1, 2].map((i) => (
                <Box key={i} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: BLUE, opacity: 0.4,
                  animation: `pulse-dot 1.2s ${i * 0.2}s infinite ease-in-out`,
                  '@keyframes pulse-dot': { '0%,100%': { opacity: 0.3, transform: 'scale(1)' }, '50%': { opacity: 1, transform: 'scale(1.3)' } },
                }} />
              ))}
            </Box>
          )}
        </Box>

        {/* Bottom actions */}
        <Box sx={{ flexShrink: 0, px: 3, pb: '44px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {!isSuccess ? (
            <>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  setFaceState('success')
                }}
                sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
              >
                Scan Face
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={() => setVerifying(false)}
                sx={{ height: 44, borderRadius: '14px', fontSize: 14, fontWeight: 600, color: '#8A94A6' }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={() => { setVerifying(false); setPinStep(true) }}
              sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: '#1FA85C', '&:hover': { bgcolor: '#178a4d' } }}
            >
              Continue to PIN
            </Button>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => setDiscardOpen(true)} />

        {/* Toggle */}
        <Box sx={{ px: 3, pt: 0.5 }}>
          <Box sx={{ bgcolor: '#EEF1F5', borderRadius: '12px', p: '4px', display: 'flex' }}>
            {LOAN_TYPES.map((lt, i) => (
              <Box
                key={lt.label}
                role="button"
                onClick={() => setLoanType(i)}
                sx={{
                  flex: 1, py: '8px', textAlign: 'center', borderRadius: '9px',
                  bgcolor: loanType === i ? '#fff' : 'transparent',
                  boxShadow: loanType === i ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                  transition: 'all 0.18s', cursor: 'pointer',
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: loanType === i ? BLUE : MUTED, transition: 'color 0.18s' }}>
                  {lt.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <MwlTitle>Staff Loan application</MwlTitle>
        <Typography sx={{ px: 3, fontSize: 14, color: MUTED, lineHeight: 1.5 }}>
          {isLoan2
            ? 'Borrow alongside your active Loan 1 — up to 25% of your base salary.'
            : 'Fill in your details below — it only takes a minute.'}
        </Typography>

        <Box sx={{ px: 3, pb: 3, pt: '20px', display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Your information — profile card */}
          <Box>
            <GroupLabel>YOUR INFORMATION</GroupLabel>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: '16px 18px', display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Avatar */}
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: '#1C3A7A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </Typography>
              </Box>
              {/* Details */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px', lineHeight: 1.25 }}>
                  {firstName} {lastName}
                </Typography>
                <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.35, lineHeight: 1.5 }}>HQ · Marketing &amp; Operations Dept.</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                  <Typography sx={{ fontSize: 12, color: MUTED }}>{staffId}</Typography>
                  <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#C8D0DC' }} />
                  <Typography sx={{ fontSize: 12, color: MUTED }}>${BASE_SALARY.toLocaleString()}/mo</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Loan request */}
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* ── Loan 2 only: Eligibility (below amount) ── */}
              {isLoan2 && (
                <Box sx={{ bgcolor: '#F0FBF5', border: '1px solid #BBE9CE', borderRadius: '14px', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: '10px', bgcolor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="check" size={16} color="#fff" />
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F6636' }}>You are eligible for Loan 2</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: 13, color: '#2D6A48' }}>Base salary</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0F6636' }}>${BASE_SALARY.toLocaleString()}/mo</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: 13, color: '#2D6A48' }}>25% of salary</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#0F6636' }}>${LOAN2_MAX} maximum</Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              <RepaymentEstimate
                product="Staff Loan"
                principal={principal}
                currency="USD"
                months={months}
                onMonthsChange={setMonths}
                minMonths={6}
                maxMonths={24}
                monthsStep={6}
                ratePct={activeLoan.rate}
                label=""
                onPrincipalChange={(p) => setAmount(String(p))}
                minAmount={50}
                maxAmount={activeLoan.maxAmount}
                hidePaymentFigure
                paymentNote={(pmt) => (
                  <Typography sx={{ fontSize: 12, fontWeight: overSalaryPct ? 700 : 400, color: overSalaryPct ? '#DC2626' : '#5B7299', mt: 0.5 }}>
                    {((pmt / BASE_SALARY) * 100).toFixed(1)}% of salary
                  </Typography>
                )}
              >
                {/* Fee breakdown — donut chart */}
                {(() => {
                  const upfront = principal * 0.01
                  const cbc = 5
                  const net = principal - upfront - cbc
                  const C = 226.19
                  const s1 = (net / principal) * C
                  const s2 = (upfront / principal) * C
                  const s3 = (cbc / principal) * C
                  const ORANGE = '#F97316'
                  const PURPLE = '#A855F7'
                  const items = [
                    { label: 'Request', value: `$${principal.toFixed(0)}`, color: BLUE },
                    { label: 'Upfront fee', value: `-$${upfront.toFixed(2)}`, color: ORANGE },
                    { label: 'CBC fee', value: `-$${cbc.toFixed(2)}`, color: PURPLE },
                    { label: 'Net amount', value: `$${net.toFixed(2)}`, color: HEADING, bold: true },
                    { label: 'Est. Pay', value: `${money(monthlyPayment, 'USD')}/mo`, color: '#0B0F1A', bold: true },
                  ]
                  return (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      {/* Donut */}
                      <Box sx={{ position: 'relative', flexShrink: 0, width: '40%', aspectRatio: '1' }}>
                        <svg width="100%" height="100%" viewBox="0 0 88 88">
                          <circle cx="44" cy="44" r="36" fill="none" stroke="#EEF1FC" strokeWidth="10" />
                          <circle cx="44" cy="44" r="36" fill="none" stroke={BLUE} strokeWidth="10"
                            strokeDasharray={`${s1} ${C}`} strokeDashoffset={0}
                            transform="rotate(-90 44 44)" strokeLinecap="butt" />
                          <circle cx="44" cy="44" r="36" fill="none" stroke={ORANGE} strokeWidth="10"
                            strokeDasharray={`${s2} ${C}`} strokeDashoffset={-s1}
                            transform="rotate(-90 44 44)" strokeLinecap="butt" />
                          <circle cx="44" cy="44" r="36" fill="none" stroke={PURPLE} strokeWidth="10"
                            strokeDasharray={`${s3} ${C}`} strokeDashoffset={-(s1 + s2)}
                            transform="rotate(-90 44 44)" strokeLinecap="butt" />
                        </svg>
                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: '0.3px', textTransform: 'uppercase' }}>You get</Typography>
                          <Typography sx={{ fontSize: 20, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', lineHeight: 1.1 }}>${net.toFixed(0)}</Typography>
                          <Typography sx={{ fontSize: 11, color: MUTED }}>net amount</Typography>
                        </Box>
                      </Box>
                      {/* Legend */}
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {items.map((item) => (
                          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                              <Typography sx={{ fontSize: 12, color: MUTED }}>{item.label}</Typography>
                            </Box>
                            <Typography sx={{ fontSize: 12, fontWeight: item.bold ? 800 : 600, color: item.bold ? HEADING : '#3A4256' }}>{item.value}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )
                })()}
              </RepaymentEstimate>
            </Box>
          </Box>

          {/* Payroll disbursement notice */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, bgcolor: '#EAF4EE', border: '1px solid #B7DFCA', borderRadius: '12px', p: '14px 16px' }}>
            <Box sx={{ flexShrink: 0, mt: '1px' }}>
              <Icon name="info" size={17} color="#1A7A45" strokeWidth={1.8} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#145C33', lineHeight: 1.4 }}>
                Disbursed to your payroll account
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#2D6A48', mt: 0.4, lineHeight: 1.5 }}>
                Your approved loan amount will be automatically transferred to your registered NongHyup payroll account.
              </Typography>
            </Box>
          </Box>

        </Box>
      </Box>

      {/* Submit */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          disabled={overMax || overPayment || overSalaryPct}
          onClick={() => setReviewing(true)}
          endIcon={<Icon name="arrowRight" size={18} />}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, '&.Mui-disabled': { bgcolor: '#C8D2E0', color: '#fff' } }}
        >
          Submit application
        </Button>
      </Box>

      {/* Over-salary toast */}
      {overSalaryPct && !overPayment && (
        <Box
          sx={{
            position: 'absolute',
            top: 56,
            left: 16,
            right: 16,
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.25,
            bgcolor: '#FFF5F6',
            border: '2px solid #FCA5A5',
            borderRadius: '14px',
            px: 2,
            py: 1.5,
            boxShadow: '0 6px 24px rgba(220,38,38,0.18)',
            animation: 'toast-slide 0.28s cubic-bezier(0.32,0.72,0,1)',
            '@keyframes toast-slide': {
              from: { opacity: 0, transform: 'translateY(-8px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="alert" size={19} color="#DC2626" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#DC2626' }}>
              You can not pay upper 24.9%
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#991B1B', lineHeight: 1.45, mt: 0.3 }}>
              This repayment is {salaryPct.toFixed(1)}% of your salary. Reduce amount or extend term to continue.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Over-payment toast */}
      {overPayment && (
        <Box
          sx={{
            position: 'absolute',
            top: 56,
            left: 16,
            right: 16,
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.25,
            bgcolor: '#FFF5F6',
            border: '2px solid #FCA5A5',
            borderRadius: '14px',
            px: 2,
            py: 1.5,
            boxShadow: '0 6px 24px rgba(220,38,38,0.18)',
            animation: 'toast-slide 0.28s cubic-bezier(0.32,0.72,0,1)',
            '@keyframes toast-slide': {
              from: { opacity: 0, transform: 'translateY(-8px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="alert" size={19} color="#DC2626" />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#DC2626' }}>
              Monthly payment too high
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#991B1B', lineHeight: 1.45, mt: 0.3 }}>
              {money(monthlyPayment, 'USD')} exceeds 25% of loan amount ({money(principal * 0.25, 'USD')}). Reduce amount or extend term.
            </Typography>
          </Box>
        </Box>
      )}

      <DiscardSheet open={discardOpen} onClose={() => setDiscardOpen(false)} onDiscard={() => navigate(-1)} />

    </Box>
  )
}
