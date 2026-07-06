import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { MwlHeader } from './mwl/MwlParts'
import { useT } from '../i18n/LangContext'
import { ReviewTab } from './MyLoanScreen'

// Loan Requests — opened from the "requests in progress" card on My Loans.
// Shows the same Current / History content as the My Loan → In Review tab.
export default function LoanRequestsScreen() {
  const navigate = useNavigate()
  const t = useT()
  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <MwlHeader onBack={() => navigate(-1)} kebab={false} />
      <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', px: 3, pb: 1, mt: -1 }}>
        {t('loanRequests')}
      </Typography>
      <Box className="scroll-content" sx={{ flex: 1, px: 3, pt: 2, pb: 5 }}>
        <ReviewTab />
      </Box>
    </Box>
  )
}
