import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
// Terms & Privacy — tabbed legal text (opened from Settings).
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

type Tab = 'privacy' | 'terms'

const SECTIONS: Record<Tab, { n: number; title: string; body: string }[]> = {
  privacy: [
    { n: 1, title: 'Introduction', body: 'This Privacy Policy explains how NongHyup Finance (Cambodia) Plc collects, uses and protects the personal information you share through this app.' },
    { n: 2, title: 'Eligibility', body: 'You must be at least 18 years old and a resident of Cambodia to create an account and use our financial services.' },
    { n: 3, title: 'Loan applications', body: 'Information you submit during a loan application is used solely to assess your request and is stored securely under banking-grade encryption.' },
    { n: 4, title: 'Credit consent', body: 'By applying, you consent to NHFC retrieving your credit history from the Credit Bureau of Cambodia for the purpose of evaluating your application.' },
  ],
  terms: [
    { n: 1, title: 'Introduction', body: 'These Terms of Service govern your use of the NongHyup Finance mobile application and any related services.' },
    { n: 2, title: 'Eligibility', body: 'Access to certain features requires a verified account. You agree to provide accurate information and keep your credentials secure.' },
    { n: 3, title: 'Loan applications', body: 'All loan offers are subject to approval. Interest rates, fees and repayment terms are disclosed before you confirm any application.' },
    { n: 4, title: 'Credit consent', body: 'You authorise NHFC to process your data as needed to deliver the services and meet regulatory obligations.' },
  ],
}

export default function TermsPrivacyScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [tab, setTab] = useState<Tab>('privacy')

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Terms & Privacy" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"Terms & Privacy"}</CollapsingTitle>

        <Box sx={{ px: 3, pb: 5 }}>
          {/* Tabs */}
          <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#E9ECF1', borderRadius: '12px', p: '4px', mt: 1 }}>
            {([['privacy', 'Privacy Policy'], ['terms', 'Terms of Service']] as [Tab, string][]).map(([id, label]) => (
              <Box
                key={id}
                role="button"
                onClick={() => setTab(id)}
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  py: 1,
                  borderRadius: '9px',
                  cursor: 'pointer',
                  bgcolor: tab === id ? '#fff' : 'transparent',
                  boxShadow: tab === id ? '0 1px 3px rgba(16,24,40,0.1)' : 'none',
                }}
              >
                <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: tab === id ? HEADING : MUTED }}>{label}</Typography>
              </Box>
            ))}
          </Box>

          {/* Version */}
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING }}>Version 3.2</Typography>
            <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>Updated 12 May 2026</Typography>
          </Box>

          {/* Sections */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: 2.5, mt: 2 }}>
            {SECTIONS[tab].map((s, i) => (
              <Box key={s.n} sx={{ mt: i === 0 ? 0 : 2.5 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 800, color: HEADING }}>
                  {s.n}. {s.title}
                </Typography>
                <Typography sx={{ fontSize: 13.5, color: '#3A4256', lineHeight: 1.6, mt: 0.5 }}>{s.body}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
