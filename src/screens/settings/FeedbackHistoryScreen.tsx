import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../../components/Icon'
import { useCollapse, CollapsingHeader, CollapsingTitle } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
// Feedback History — past submissions and support replies (from Send feedback).
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'
const GREEN = '#1FA85C'

type Entry = {
  id: string
  date: string
  time: string
  category: string
  body: string
  reply?: string
}

const ENTRIES: Entry[] = [
  {
    id: 'f1',
    date: '15 May 2026',
    time: '08:00PM',
    category: 'Suggestion',
    body: 'It would be great to see a dark mode for the app, especially for using it at night.',
    reply: 'Thanks for the idea! Dark mode is on our roadmap and we hope to ship it in a future update.',
  },
  {
    id: 'f2',
    date: '02 May 2026',
    time: '11:24AM',
    category: 'Issue',
    body: 'The repayment schedule was slow to load on my older phone last week.',
  },
]

export default function FeedbackHistoryScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Feedback history" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"Feedback history"}</CollapsingTitle>

        <Box sx={{ px: 3, pb: 5, pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ENTRIES.map((e) => (
            <Box key={e.id} sx={{ bgcolor: '#fff', borderRadius: '16px', p: 2.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'inline-block', fontSize: 11, fontWeight: 700, px: 1, py: 0.25, borderRadius: 1, color: BLUE, bgcolor: '#EAF1FB' }}>{e.category}</Box>
                <Typography sx={{ fontSize: 12, color: MUTED }}>{e.date}, {e.time}</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, color: '#3A4256', lineHeight: 1.55, mt: 1 }}>{e.body}</Typography>

              {e.reply && (
                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #F1F4F8' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                    <Icon name="message" size={16} color={GREEN} />
                    <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: GREEN }}>Reply</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13.5, color: '#3A4256', lineHeight: 1.55 }}>{e.reply}</Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
