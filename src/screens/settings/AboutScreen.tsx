import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../../components/CollapsingHeader'
import { Icon } from '../../components/Icon'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const GREEN = '#2EAE6C'

const STATS = [
  { value: '12', label: 'provinces\n& capital' },
  { value: '25', label: 'offices\nnationwide' },
  { value: '2018', label: 'NBC\nlicensed' },
]

const NETWORK = [
  { value: '6',  label: 'Branch' },
  { value: '3',  label: 'Office' },
  { value: '2',  label: 'Corporate\nOffice' },
  { value: '11', label: 'Total', highlight: true },
]

const CORE_VALUES = [
  { title: 'Creativity',       sub: 'Makes us a pioneer' },
  { title: 'Responsibility',   sub: 'Makes us respected' },
  { title: 'Honesty',          sub: 'Makes us proud' },
  { title: 'Dependability',    sub: 'We do what we say' },
  { title: 'Humility',         sub: 'Makes us stronger' },
  { title: 'Service to people',sub: 'Makes us great' },
]

const MILESTONES = [
  { year: '2018', done: true,  text: 'NongHyup Bank acquires 100% of SMIC Plc; the company becomes NongHyup Finance (Cambodia) Plc and receives its NBC microfinance licence.' },
  { year: '2023', done: true,  text: 'New Head Office and launch of the Loan Origination System (LOS).' },
  { year: '2025', done: true,  text: 'Launch of the Migrant Worker Loan — funding legitimate overseas workers with up to US$15,000 and no collateral.' },
  { year: '2026', done: false, text: 'Opening Kampong Chhnang branch, a new mobile app, LOS modernization and CamDigiKey adoption.' },
]

export default function AboutScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="About Us" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>About Us</CollapsingTitle>

        <Box sx={{ pb: 5 }}>

          {/* ── Hero building photo ─────────────────────────────── */}
          <Box sx={{ position: 'relative', height: 220, bgcolor: '#1A3A30', overflow: 'hidden', mx: 3, borderRadius: '16px', mt: 1 }}>
            <Box component="img" src="/assets/images/NH_HQ.webp" alt="NH Finance Head Office" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            {/* overlay gradient */}
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: '16px' }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(46,174,108,0.9)', borderRadius: '6px', px: 1, py: '3px', mb: 0.75 }}>
                <Typography sx={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.5px', color: '#fff' }}>HEAD OFFICE · PHNOM PENH</Typography>
              </Box>
              <Typography sx={{ fontSize: 13.5, color: '#fff', lineHeight: 1.45, fontWeight: 500 }}>
                A licensed microfinance institution, subsidiary of Korea's NongHyup Bank.
              </Typography>
            </Box>
          </Box>

          {/* ── Global Network ──────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2, mb: 1 }}>
            GLOBAL NETWORK
          </Typography>
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', mx: 3, overflow: 'hidden' }}>
            <Box component="img" src="/assets/images/NH_map.webp" alt="Global network map" sx={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            <Box sx={{ p: '14px' }}>
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.5px', color: MUTED, mb: 1.25 }}>OVERSEAS NETWORK</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1 }}>
                {NETWORK.map((n) => (
                  <Box key={n.label} sx={{ textAlign: 'center', p: '10px 6px', borderRadius: '10px', bgcolor: n.highlight ? BLUE : '#F5F7FA' }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 900, color: n.highlight ? '#fff' : BLUE, lineHeight: 1 }}>{n.value}</Typography>
                    <Typography sx={{ fontSize: 10, color: n.highlight ? 'rgba(255,255,255,0.8)' : MUTED, mt: 0.5, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{n.label}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: BLUE, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 12, color: MUTED }}>NongHyup Finance (Cambodia)</Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Key stats row ───────────────────────────────────── */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, px: 3, mt: 1.5 }}>
            {STATS.map((s) => (
              <Box key={s.label} sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '12px', textAlign: 'center' }}>
                <Typography sx={{ fontSize: 22, fontWeight: 900, color: BLUE, lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: 11, color: MUTED, mt: 0.5, lineHeight: 1.35, whiteSpace: 'pre-line' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── Who we are ──────────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2.5, mb: 1 }}>
            WHO WE ARE
          </Typography>
          <Box sx={{ px: 3 }}>
            <Typography sx={{ fontSize: 14, color: '#3A4255', lineHeight: 1.65 }}>
              NongHyup Finance serves low- to medium-income Cambodians with micro-loans for small businesses and agriculture, and SME loans for sustainable growth.
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#3A4255', lineHeight: 1.65, mt: 1.5 }}>
              In August 2018, the National Bank of Cambodia approved its acquisition of Samic Plc.
            </Typography>

            {/* Vision */}
            <Box sx={{ mt: 2, bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden', p: '14px' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.5px', color: BLUE, mb: 0.75 }}>OUR VISION</Typography>
              <Typography sx={{ fontSize: 14, color: '#3A4255', lineHeight: 1.55 }}>
                To be the best financial institution loved by its stakeholders.
              </Typography>
            </Box>

            {/* Mission */}
            <Box sx={{ mt: 1.5, bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden', p: '14px' }}>
              <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.5px', color: BLUE, mb: 0.75 }}>OUR MISSION</Typography>
              <Typography sx={{ fontSize: 14, color: '#3A4255', lineHeight: 1.55 }}>
                To exceed our customers' expectations by providing a wide range of financial products and services at competitive prices, through the development of our people.
              </Typography>
            </Box>
          </Box>

          {/* ── Core values ─────────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2.5, mb: 1 }}>
            OUR CORE VALUES
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, px: 3 }}>
            {CORE_VALUES.map((v) => (
              <Box key={v.title} sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', p: '12px 14px' }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: HEADING }}>{v.title}</Typography>
                <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>{v.sub}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── Milestones ──────────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2.5, mb: 1 }}>
            MILESTONES
          </Typography>
          <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {MILESTONES.map((m, i) => (
              <Box key={m.year} sx={{ display: 'flex', gap: 2 }}>
                {/* timeline line + dot */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: m.done ? BLUE : '#D0D5DD', border: `2px solid ${m.done ? BLUE : '#D0D5DD'}`, flexShrink: 0, mt: '3px' }} />
                  {i < MILESTONES.length - 1 && (
                    <Box sx={{ width: 2, flex: 1, bgcolor: '#E8EAEE', minHeight: 24, my: 0.5 }} />
                  )}
                </Box>
                <Box sx={{ pb: 2.5 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: m.done ? BLUE : MUTED }}>{m.year}</Typography>
                  <Typography sx={{ fontSize: 13.5, color: '#3A4255', lineHeight: 1.55, mt: 0.25 }}>{m.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* ── Part of NongHyup Bank ───────────────────────────── */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', mx: 3, mt: 1, overflow: 'hidden' }}>
            <Box sx={{ p: '14px 16px' }}>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: HEADING, mb: 1 }}>Part of NongHyup Bank</Typography>
              <Typography sx={{ fontSize: 13.5, color: '#3A4255', lineHeight: 1.65 }}>
                Established in 1961 with 100% domestic capital, NongHyup Bank is recognised as one of the world's most advanced cooperative financial institutions. Its global network spans foreign branches in the United States and Vietnam, microfinance institutions in Myanmar and Cambodia, and representative offices in China and India.
              </Typography>
            </Box>
            {/* Seoul HQ photo */}
            <Box sx={{ position: 'relative', height: 180, overflow: 'hidden', flexShrink: 0 }}>
              <Box component="img" src="/assets/images/NH_HQKOREA.webp" alt="NongHyup Bank Head Office Seoul" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
              <Typography sx={{ position: 'absolute', bottom: 12, left: 14, right: 14, fontSize: 12.5, fontWeight: 700, color: '#fff' }}>
                NongHyup Bank Head Office — Seoul, Republic of Korea
              </Typography>
            </Box>
          </Box>

          {/* ── Contact us ──────────────────────────────────────── */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 3.5, mt: 2.5, mb: 1 }}>
            CONTACT US
          </Typography>
          <Box
            role="button"
            onClick={() => navigate('/contact-us')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', mx: 3, px: '16px', py: '14px', cursor: 'pointer', '&:active': { bgcolor: '#F8FAFC' } }}
          >
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#EEF3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="phone" size={20} color={BLUE} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING }}>Contact Us</Typography>
              <Typography sx={{ fontSize: 12.5, color: MUTED, mt: 0.15 }}>Hotline & email</Typography>
            </Box>
            <Icon name="chevronRight" size={18} color="#C9D2DE" />
          </Box>

          <Typography sx={{ fontSize: 11.5, color: '#B6BDC8', textAlign: 'center', mt: 2.5, px: 3 }}>
            Source: NongHyup Finance (Cambodia) Plc — Annual Report 2025
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
