import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../components/CollapsingHeader'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'

const CAT_COLORS: Record<string, string> = {
  'COMMUNITY WELFARE': '#275CB2',
  'PUBLIC SERVICE': '#2EAE6C',
  'EDUCATION': '#E8A020',
}

interface Activity {
  id: string
  category: string
  title: string
  location: string
  date: string
  meta: string
  description: string
  highlight?: string
  images: string[]
}

const FEATURED: Activity = {
  id: 'soldiers-donation',
  category: 'COMMUNITY WELFARE',
  title: 'Donation to Soldiers & Siem Reap Provincial Referral Hospital',
  location: 'Siem Reap',
  date: 'Saturday, 13 September 2025',
  meta: '',
  description:
    'NongHyup Finance (Cambodia), represented by Mr. Jung Joo Yong, delivered donations to Cambodian soldiers and the Siem Reap Provincial Referral Hospital — honouring the bravery and sacrifice of soldiers defending the nation\'s sovereignty and territorial integrity. Gifts included basic necessities and a monetary contribution totalling KHR 28,000,000.',
  highlight:
    'NongHyup Finance had previously announced a debt write-off policy for the families of soldiers who lost their lives in the line of duty while protecting national sovereignty.',
  images: [],
}

const MORE_ACTIVITIES: Activity[] = [
  {
    id: 'blood-donation',
    category: 'COMMUNITY WELFARE',
    title: 'Blood Donation Drive',
    location: 'Phnom Penh',
    date: '7 March 2025',
    meta: '',
    description:
      'Thirteen NongHyup Finance staff joined a blood donation organised by the Cambodia Microfinance Association (CMA) with the Association of Banks in Cambodia (ABC) — supporting national blood supply needs and helping save lives.',
    images: [],
  },
  {
    id: 'afesip-cambodia',
    category: 'COMMUNITY WELFARE',
    title: 'Supporting AFESIP Cambodia',
    location: 'Dangkor district · Phnom Penh',
    date: '8 August 2023 · NH Finance 5th anniversary',
    meta: '',
    description:
      'In the presence of NongHyup Bank President & CEO Lee Seok Yong, NH Finance and NongHyup Bank donated essential supplies and a $5,000 contribution to AFESIP Cambodia — supporting 155 children in the organization\'s care.',
    images: [],
  },
  {
    id: 'materials-local',
    category: 'PUBLIC SERVICE',
    title: 'Materials for Local Authorities',
    location: 'Santuk & Baray districts · Kampong Thom',
    date: '30 May 2022',
    meta: '',
    description:
      'NH Finance contributed materials and budget to help five commune halls in Santuk and Baray districts better serve their communities — 75 plastic chairs, 10 rubbish bins and 10 boxes of A4 paper.',
    images: [],
  },
]

function CategoryBadge({ cat }: { cat: string }) {
  const color = CAT_COLORS[cat] ?? '#275CB2'
  return (
    <Box sx={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', px: 1.25, py: '3px', borderRadius: '6px', bgcolor: `${color}14` }}>
      <Typography sx={{ fontSize: 10.5, fontWeight: 800, letterSpacing: '0.5px', color }}>{cat}</Typography>
    </Box>
  )
}

function PhotoCarousel({ count }: { count: number }) {
  const [idx, setIdx] = useState(1)
  const total = count || 4
  return (
    <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', bgcolor: '#1A3A30', height: 200 }}>
      {/* placeholder gradient image */}
      <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1A3A30 0%, #2E6B50 50%, #1A3A30 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="blogs" size={48} color="rgba(255,255,255,0.2)" />
      </Box>

      {/* counter pill */}
      <Box sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'rgba(0,0,0,0.55)', borderRadius: '8px', px: 1, py: '3px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Icon name="camera" size={12} color="#fff" />
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{idx}/{total}</Typography>
      </Box>

      {/* prev / next arrows */}
      <Box
        role="button"
        onClick={() => setIdx((p) => Math.max(1, p - 1))}
        sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <Icon name="chevronLeft" size={18} color="#0B0F1A" />
      </Box>
      <Box
        role="button"
        onClick={() => setIdx((p) => Math.min(total, p + 1))}
        sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <Icon name="chevronRight" size={18} color="#0B0F1A" />
      </Box>

      {/* dots */}
      <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
        {Array.from({ length: total }).map((_, i) => (
          <Box key={i} sx={{ width: i + 1 === idx ? 16 : 6, height: 6, borderRadius: '3px', bgcolor: i + 1 === idx ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'width 0.2s' }} />
        ))}
      </Box>
    </Box>
  )
}

function ActivityCard({ activity }: { activity: Activity }) {
  const tint = activity.category === 'COMMUNITY WELFARE' ? '#1A3A30' : '#0B2A1A'
  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden' }}>
      {/* image placeholder */}
      <Box sx={{ height: 160, background: `linear-gradient(135deg, ${tint} 0%, #2E6B50 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="blogs" size={40} color="rgba(255,255,255,0.18)" />
      </Box>
      <Box sx={{ p: '14px', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <CategoryBadge cat={activity.category} />
        <Typography sx={{ fontSize: 15, fontWeight: 800, color: HEADING, lineHeight: 1.3 }}>{activity.title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon name="findBranch" size={13} color={MUTED} />
          <Typography sx={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{activity.location}</Typography>
        </Box>
        <Typography sx={{ fontSize: 12, color: MUTED }}>{activity.date}</Typography>
        <Typography sx={{ fontSize: 13.5, color: '#3A4255', lineHeight: 1.55, mt: 0.25 }}>{activity.description}</Typography>
      </Box>
    </Box>
  )
}

export default function CsrActivityScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="CSR Activity" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>CSR Activity</CollapsingTitle>

        <Box sx={{ px: 3, pb: 5 }}>
          {/* Intro */}
          <Typography sx={{ fontSize: 14, color: '#3A4255', lineHeight: 1.65, mb: 2.5 }}>
            Beyond financing, NH Finance invests in the communities we serve — supporting education, welfare and disaster relief across Cambodia.
          </Typography>

          {/* Featured activity label */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', mb: 1.5 }}>
            FEATURED ACTIVITY
          </Typography>

          {/* Featured card */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden', mb: 3 }}>
            <Box sx={{ p: '14px', pb: 0 }}>
              <PhotoCarousel count={4} />
            </Box>
            <Box sx={{ p: '14px', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <CategoryBadge cat={FEATURED.category} />
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING, lineHeight: 1.3 }}>
                {FEATURED.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Icon name="findBranch" size={13} color={MUTED} />
                <Typography sx={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{FEATURED.location}</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: MUTED }}>{FEATURED.date}</Typography>
              <Typography sx={{ fontSize: 13.5, color: '#3A4255', lineHeight: 1.55, mt: 0.25 }}>
                {FEATURED.description}
              </Typography>
            </Box>
          </Box>

          {/* Highlight callout — outside the card */}
          {FEATURED.highlight && (
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden', mb: 3, p: '14px' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING, mb: 0.5 }}>A continued commitment</Typography>
              <Typography sx={{ fontSize: 13.5, color: '#3A4255', lineHeight: 1.55 }}>{FEATURED.highlight}</Typography>
            </Box>
          )}

          {/* More activities */}
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', mb: 1.5 }}>
            MORE ACTIVITIES
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {MORE_ACTIVITIES.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </Box>

          <Typography sx={{ fontSize: 12, color: '#B0B8C8', textAlign: 'center', lineHeight: 1.55, mt: 3 }}>
            Part of NH Finance's annual corporate social responsibility program.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
