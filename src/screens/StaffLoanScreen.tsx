import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import { Icon } from '../components/Icon'
import { MwlHeader, MwlTitle, GroupLabel, FieldCard, SelectField, PhoneField, DiscardSheet, BLUE } from './mwl/MwlParts'
import { addApplication, type LoanApplication } from '../workspace/applications'

// ─────────────────────────────────────────────────────────────────────────────
// Staff Loan — a fast, single-screen application for staff. Everything is
// captured on one page (your info · bank account · request · CBC consent) and a
// single Submit goes straight to the result screen.
// ─────────────────────────────────────────────────────────────────────────────
const BANKS = ['ABA Bank', 'ACLEDA Bank', 'Canadia Bank', 'Wing Bank', 'PPCBank']
const TERM_MARKS = [3, 6, 9, 12].map((m) => ({ value: m, label: `${m}m` }))
const MONTHLY_RATE = 0.01 // 1.0% / month
const MAX_AMOUNT = '1,000' // suggested ceiling (≈ 2× salary)

const fmtUSD = (n: number) =>
  '$' + (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function StaffLoanScreen() {
  const navigate = useNavigate()
  const [discardOpen, setDiscardOpen] = useState(false)

  // Your info
  const [firstName, setFirstName] = useState('Sophea')
  const [lastName, setLastName] = useState('Kim')
  const [staffId, setStaffId] = useState('NH-0428')
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
  // Holds the just-submitted application while the "under review" popup is shown.
  const [submitted, setSubmitted] = useState<LoanApplication | null>(null)

  // Repayment estimate — constant monthly installment at 1.0%/month over the term.
  const principal = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0
  // Requested amount can't exceed the suggested maximum.
  const maxAmount = parseFloat(MAX_AMOUNT.replace(/[^0-9.]/g, '')) || 0
  const overMax = principal > maxAmount
  const monthly =
    months > 0 ? (principal * MONTHLY_RATE * Math.pow(1 + MONTHLY_RATE, months)) / (Math.pow(1 + MONTHLY_RATE, months) - 1) : 0
  const totalPayable = monthly * months
  const totalInterest = totalPayable - principal

  // Submit → record the application (so it shows in My Loans → In Review) and
  // show the "under review" confirmation popup.
  const submit = () => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    const app: LoanApplication = { title: 'Staff Loan', amount: `$${amount}.00`, term, rate: '1.0%/mo', ref: 'NH-2026-04830', on: today }
    addApplication(app)
    setSubmitted(app)
  }

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => setDiscardOpen(true)} />
        <MwlTitle>Staff Loan application</MwlTitle>
        <Typography sx={{ px: 3, fontSize: 14, color: '#8A94A6', lineHeight: 1.5 }}>
          Fill in your details below — it only takes a minute.
        </Typography>

        <Box sx={{ px: 3, pb: 3, pt: '20px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Your information */}
          <Box>
            <GroupLabel>YOUR INFORMATION</GroupLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FieldCard label="First name" required value={firstName} onChange={setFirstName} />
              <FieldCard label="Last name" required value={lastName} onChange={setLastName} />
              <FieldCard label="Staff ID" required value={staffId} onChange={setStaffId} />
              <PhoneField label="Phone number" code={phoneCode} number={phone} onCodeChange={setPhoneCode} onNumberChange={setPhone} />
            </Box>
          </Box>

          {/* Bank account */}
          <Box>
            <GroupLabel>BANK ACCOUNT (FOR DISBURSEMENT)</GroupLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <SelectField label="Bank" required options={BANKS} value={bank} onChange={setBank} />
              <FieldCard label="Account name" required value={accountName} onChange={setAccountName} />
              <FieldCard label="Account number" required value={accountNo} onChange={setAccountNo} />
            </Box>
          </Box>

          {/* Loan request */}
          <Box>
            <GroupLabel>LOAN REQUEST</GroupLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Amount + suggested maximum */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <FieldCard
                  label="Amount"
                  required
                  value={amount}
                  onChange={setAmount}
                  trailing={<Typography sx={{ fontSize: 16, fontWeight: 700, color: '#8A94A6' }}>USD</Typography>}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5, gap: 1 }}>
                  {overMax ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                      <Icon name="alert" size={14} color="#E5484D" />
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#E5484D' }} noWrap>
                        Amount exceeds the maximum of ${MAX_AMOUNT}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>Suggested max · up to 2× salary</Typography>
                  )}
                  <Box
                    role="button"
                    onClick={() => setAmount(MAX_AMOUNT)}
                    sx={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', px: 1.25, py: 0.5, borderRadius: '999px', bgcolor: '#F4F8FF', border: '1px solid #DCE7FB', cursor: 'pointer', '&:active': { opacity: 0.7 } }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: BLUE }}>Use ${MAX_AMOUNT}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Repayment term — stepped progress bar (3 / 6 / 9 / 12 months) */}
              <Box sx={{ bgcolor: '#fff', borderRadius: '12px', px: '16px', pt: '12px', pb: '4px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 12, color: '#8A94A6' }}>
                    Repayment term<Box component="span" sx={{ color: '#E5484D', ml: 0.4 }}>*</Box>
                  </Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0B0F1A' }}>{months} months</Typography>
                </Box>
                <Box sx={{ px: 0.5 }}>
                  <Slider
                    value={months}
                    onChange={(_, v) => setMonths(v as number)}
                    step={null}
                    min={3}
                    max={12}
                    marks={TERM_MARKS}
                    aria-label="Repayment term"
                    sx={{
                      color: BLUE,
                      height: 6,
                      mt: 1,
                      '& .MuiSlider-rail': { bgcolor: '#E7ECF2', opacity: 1 },
                      '& .MuiSlider-thumb': { width: 20, height: 20, boxShadow: '0 0 0 4px rgba(39,92,178,0.15)' },
                      '& .MuiSlider-mark': { width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff', border: '2px solid #CBD3DF', opacity: 1 },
                      '& .MuiSlider-markActive': { bgcolor: BLUE, borderColor: BLUE },
                      '& .MuiSlider-markLabel': { fontSize: 12, fontWeight: 600, color: '#8A94A6' },
                      '& .MuiSlider-markLabelActive': { color: BLUE, fontWeight: 700 },
                    }}
                  />
                </Box>
              </Box>

              {/* Estimate — constant monthly repayment, recalculated live */}
              <Box sx={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #DCE7FB' }}>
                {/* Headline monthly payment */}
                <Box sx={{ bgcolor: '#F4F8FF', px: '16px', py: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#5B6473' }}>Estimated monthly payment</Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 800, color: BLUE, letterSpacing: '-0.5px', lineHeight: 1.1, mt: 0.25 }}>{fmtUSD(monthly)}</Typography>
                    <Typography sx={{ fontSize: 12, color: '#8A94A6', mt: 0.25 }}>per month · {term}</Typography>
                  </Box>
                  <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="calculator" size={26} color={BLUE} />
                  </Box>
                </Box>
                {/* Breakdown */}
                <Box sx={{ bgcolor: '#fff', px: '16px', py: '12px', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <EstRow label="Interest rate" value="1.0% / month" />
                  <EstRow label="Total interest" value={fmtUSD(totalInterest)} />
                  <EstRow label="Total payable" value={fmtUSD(totalPayable)} strong />
                </Box>
              </Box>
              <Typography sx={{ fontSize: 11.5, color: '#8A94A6', lineHeight: 1.5, px: 0.5 }}>
                Estimated on a constant monthly repayment at 1.0%/month. Final figures are confirmed on approval.
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
              sx={{ display: 'flex', gap: 1.5, bgcolor: '#fff', borderRadius: '12px', p: '16px', cursor: 'pointer', alignItems: 'flex-start', '&:active': { opacity: 0.85 } }}
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

      {/* Submit → result */}
      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!agree || overMax}
          onClick={submit}
          endIcon={<Icon name="arrowRight" size={18} />}
          sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' }, '&.Mui-disabled': { bgcolor: '#C8D2E0', color: '#fff' } }}
        >
          Submit application
        </Button>
      </Box>

      <DiscardSheet open={discardOpen} onClose={() => setDiscardOpen(false)} onDiscard={() => navigate(-1)} />

      {/* "Under review" confirmation popup — shown after Submit */}
      {submitted && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 200, bgcolor: 'rgba(11,15,26,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: '20px',
              p: '28px 24px',
              width: '100%',
              maxWidth: 320,
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(11,15,26,0.28)',
              animation: 'sl-pop 0.22s cubic-bezier(0.32,0.72,0,1)',
              '@keyframes sl-pop': { from: { opacity: 0, transform: 'scale(0.92)' }, to: { opacity: 1, transform: 'scale(1)' } },
            }}
          >
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#E6F4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Box component="img" src="/assets/brand/ico_success.svg" alt="" sx={{ width: 40, height: 40 }} />
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.3px', mb: 1 }}>
              Congratulations!
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6B7280', lineHeight: 1.55, mb: 2.5 }}>
              Your Staff Loan request of{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#0B0F1A' }}>{submitted.amount}</Box>{' '}
              has been submitted and is now under review. Track its status anytime in My Loans.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/my-loan?tab=review')}
              endIcon={<Icon name="arrowRight" size={18} />}
              sx={{ height: 50, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
            >
              View my loans
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

// ─── Estimate breakdown row ───────────────────────────────────────────────────
function EstRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ fontSize: 13.5, color: '#3A4256' }}>{label}</Typography>
      <Typography sx={{ fontSize: strong ? 15.5 : 14, fontWeight: strong ? 800 : 700, color: strong ? '#0B0F1A' : '#3A4256' }}>{value}</Typography>
    </Box>
  )
}
