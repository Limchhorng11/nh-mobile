import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Icon } from '../components/Icon'
import { AssetImg, asset } from '../components/home/media'
import { MwlHeader, MwlTitle, GroupLabel, FieldCard, SelectField, PhoneField, DiscardSheet, BLUE } from './mwl/MwlParts'
import RepaymentEstimate from './mwl/RepaymentEstimate'
import { addApplication, type LoanApplication } from '../workspace/applications'
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
  const [submitted, setSubmitted] = useState<LoanApplication | null>(null)

  const principal = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
  const overMax = principal > activeLoan.maxAmount
  const { payment: monthlyPayment } = buildGraceSchedule(principal, months, activeLoan.rate, 0)
  const overPayment = principal > 0 && monthlyPayment >= principal * 0.25

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
    setSubmitted(app)
  }

  if (submitted) {
    return (
      <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, pb: 4 }}>
          {/* Mascot */}
          <Box sx={{ height: 220, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <AssetImg
              src={asset('illustrations/mascot_done.png')}
              alt=""
              sx={{ height: '100%', width: '100%', objectFit: 'contain' }}
              fallback={
                <Box sx={{ width: 110, height: 110, borderRadius: '50%', bgcolor: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box component="img" src="/assets/brand/ico_success.svg" alt="" sx={{ width: 60, height: 60 }} />
                </Box>
              }
            />
          </Box>

          <Typography sx={{ fontSize: 34, fontWeight: 800, color: HEADING, letterSpacing: '-1px', textAlign: 'center', lineHeight: 1.1 }}>
            Congratulations!
          </Typography>

          {/* Ref + status badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
            <Box sx={{ bgcolor: '#E6F4EA', borderRadius: '999px', px: '10px', py: '4px' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#15803D' }}>Submitted</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: MUTED }}>{submitted.ref}</Typography>
          </Box>

          <Typography sx={{ fontSize: 15, color: '#6B7280', lineHeight: 1.65, textAlign: 'center', mt: 2.5, maxWidth: 290 }}>
            Your {isLoan2 ? 'Loan 2' : 'Staff Loan'} request of{' '}
            <Box component="span" sx={{ fontWeight: 800, color: HEADING }}>{submitted.amount}</Box>{' '}
            has been submitted and is now under review. Track its status anytime in My Loans.
          </Typography>
        </Box>

        <Box sx={{ flexShrink: 0, px: 3, pb: '44px' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/my-loan?tab=review')}
            endIcon={<Icon name="arrowRight" size={18} />}
            sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
          >
            View my loans
          </Button>
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

          {/* Your information */}
          <Box>
            <GroupLabel>YOUR INFORMATION</GroupLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FieldCard label="First name" required value={firstName} onChange={setFirstName} />
              <FieldCard label="Last name" required value={lastName} onChange={setLastName} />
              <FieldCard label="Staff ID" required value={staffId} onChange={formatStaffId} placeholder="NH-000000000" />
              <PhoneField label="Phone number" code={phoneCode} number={phone} onCodeChange={setPhoneCode} onNumberChange={setPhone} />
            </Box>
          </Box>

          {/* Loan request */}
          <Box>
            <GroupLabel>LOAN REQUEST</GroupLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <FieldCard
                  label="Amount"
                  required
                  value={amount}
                  onChange={setAmount}
                  trailing={<Typography sx={{ fontSize: 16, fontWeight: 700, color: MUTED }}>USD</Typography>}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5, gap: 1 }}>
                  {overMax ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                      <Icon name="alert" size={14} color="#E5484D" />
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#E5484D' }} noWrap>
                        Exceeds maximum of ${activeLoan.maxAmount}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: MUTED }}>
                      {isLoan2 ? '25% of base salary limit' : 'Suggested max · up to 2× salary'}
                    </Typography>
                  )}
                  <Box
                    role="button"
                    onClick={() => setAmount(String(activeLoan.maxAmount))}
                    sx={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', px: 1.25, py: 0.5, borderRadius: '999px', bgcolor: '#F4F8FF', border: '1px solid #DCE7FB', cursor: 'pointer', '&:active': { opacity: 0.7 } }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: BLUE }}>Use ${activeLoan.maxAmount}</Typography>
                  </Box>
                </Box>
              </Box>

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
                minMonths={3}
                maxMonths={24}
                ratePct={activeLoan.rate}
                label=""
                paymentNote={(pmt) => (
                  <Typography sx={{ fontSize: 12, color: '#5B7299', mt: 0.5 }}>
                    {((pmt / BASE_SALARY) * 100).toFixed(1)}% of salary
                  </Typography>
                )}
              >
                {/* Fee breakdown — inside the repayment card */}
                <Box sx={{ borderTop: '1px dashed #D6DCE5', mt: 2, pt: 1 }}>
                  {([
                    ['Upfront Fee (1%)', `-$${(principal * 0.01).toFixed(2)}`, false],
                    ['CBC Fee', '-$5.00', false],
                    ['Net Amount', `$${(principal - principal * 0.01 - 5).toFixed(2)}`, true],
                  ] as [string, string, boolean][]).map(([label, value, hi]) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '8px' }}>
                      <Typography sx={{ fontSize: 13.5, color: hi ? '#0B0F1A' : '#8A94A6', fontWeight: hi ? 700 : 400 }}>{label}</Typography>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: hi ? '#0B0F1A' : '#D92D20' }}>{value}</Typography>
                    </Box>
                  ))}
                </Box>
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

          {/* Credit bureau consent */}
          <Box>
            <GroupLabel>CREDIT BUREAU CONSENT</GroupLabel>
            <Box
              onClick={() => setAgree((v) => !v)}
              role="checkbox"
              aria-checked={agree}
              sx={{ display: 'flex', gap: 1.5, bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '16px', cursor: 'pointer', alignItems: 'flex-start', '&:active': { opacity: 0.85 } }}
            >
              <Box sx={{ mt: '1px', width: 22, height: 22, borderRadius: '6px', flexShrink: 0, border: `2px solid ${agree ? BLUE : '#CBD3DF'}`, bgcolor: agree ? BLUE : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s' }}>
                {agree && <Icon name="check" size={14} color="#fff" />}
              </Box>
              <Typography sx={{ fontSize: 13.5, color: '#3A4256', lineHeight: 1.5 }}>
                I authorize NongHyup Finance to obtain and check my credit history from the Credit Bureau of Cambodia (CBC) to assess this application.
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
          disabled={!agree || overMax || overPayment}
          onClick={submit}
          endIcon={<Icon name="arrowRight" size={18} />}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, '&.Mui-disabled': { bgcolor: '#C8D2E0', color: '#fff' } }}
        >
          Submit application
        </Button>
      </Box>

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
