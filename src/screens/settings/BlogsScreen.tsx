import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../../components/Icon'
import { useCollapse, CollapsingHeader, CollapsingTitle } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
// Blogs & Education — date-grouped articles with category filter.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

const TABS = ['All', 'Blog', 'News', 'Tips', 'EDU', 'CSR']

type Post = { id: string; cat: string; title: string; body: string; day: string; tint: string; videoId?: string }
type Group = { date: string; posts: Post[] }

const GROUPS: Group[] = [
  {
    date: '1 Jul 2026',
    posts: [
      { id: 'p0', cat: 'FINANCIAL BASICS', title: 'Unlicensed Online Loan', body: 'Learn how to identify and avoid unlicensed online lenders that charge hidden fees and exploit borrowers.', day: '1 Jul 2026', tint: '#275CB2', videoId: 'RT2taL5xxWU' },
      { id: 'p1', cat: "CUSTOMER'S STORY", title: "Sophea's rice farm: from harvest to growth", body: 'How a small rice farmer in Kampong Cham used an NHFC loan to triple her harvest and support her family.', day: '1 Jul 2026', tint: '#1FA85C', videoId: 'VIIclHZEkco' },
    ],
  },
  {
    date: '15 May 2026',
    posts: [
      { id: 'p2', cat: 'News', title: 'Khmer New Year promotion', body: 'Special interest rates on migrant worker loans throughout the holiday season.', day: 'Wed, 14 May', tint: '#275CB2' },
      { id: 'p3', cat: 'Tips', title: 'How to plan your repayments', body: 'Five simple habits that keep your loan healthy and your credit score strong.', day: 'Wed, 14 May', tint: '#1FA85C' },
    ],
  },
  {
    date: '12 May 2026',
    posts: [
      { id: 'p4', cat: 'EDU', title: 'Understanding interest rates', body: 'A short guide to flat vs. reducing-balance interest and what it means for you.', day: 'Mon, 12 May', tint: '#7A3FF2', videoId: 'bk4pBXKyW3M' },
      { id: 'p5', cat: 'CSR', title: 'Supporting rural farmers', body: 'NHFC partners with local cooperatives to fund the new harvest season.', day: 'Mon, 12 May', tint: '#E08A1E' },
    ],
  },
]

export default function BlogsScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [tab, setTab] = useState('All')

  const groups = GROUPS.map((g) => ({
    ...g,
    posts: g.posts.filter((p) => tab === 'All' || p.cat === tab),
  })).filter((g) => g.posts.length > 0)

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Blogs & Education" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"Blogs & Education"}</CollapsingTitle>

        {/* Category tabs */}
        <Box sx={{ display: 'flex', gap: 1, px: 3, py: 1.5, overflowX: 'auto', '::-webkit-scrollbar': { display: 'none' } }}>
          {TABS.map((t) => (
            <Box
              key={t}
              role="button"
              onClick={() => setTab(t)}
              sx={{
                flexShrink: 0,
                px: 1.75,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '999px',
                cursor: 'pointer',
                bgcolor: tab === t ? BLUE : '#fff',
                border: tab === t ? `1px solid ${BLUE}` : '1px solid #E7ECF2',
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: tab === t ? '#fff' : '#3A4256' }}>{t}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ px: 3, pb: 5 }}>
          {groups.map((g) => (
            <Box key={g.date}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.4px', color: MUTED, mt: 2, mb: 1 }}>{g.date}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {g.posts.map((p) => (
                  <Box
                    key={p.id}
                    role="button"
                    onClick={() => navigate('/blog-detail', { state: { cat: p.cat, title: p.title, tint: p.tint, body: p.body, day: p.day, author: 'NongHyup Finance' } })}
                    sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', '&:active': { opacity: 0.85 } }}
                  >
                    {/* Thumbnail */}
                    <Box sx={{ position: 'relative', height: 160, bgcolor: '#000', overflow: 'hidden' }}>
                      {p.videoId ? (
                        <>
                          <Box component="img" src={`https://img.youtube.com/vi/${p.videoId}/hqdefault.jpg`} alt={p.title}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.88 }} />
                          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.6)' }}>
                              <Icon name="play" size={18} color="#fff" />
                            </Box>
                          </Box>
                        </>
                      ) : (
                        <Box sx={{ height: '100%', background: `linear-gradient(135deg, ${p.tint}26, ${p.tint}0D)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="blogs" size={36} color={p.tint} />
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ p: '12px' }}>
                      <Box sx={{ display: 'inline-block', fontSize: 11, fontWeight: 700, px: 1, py: 0.25, borderRadius: 1, color: p.tint, bgcolor: `${p.tint}1A`, mb: 0.75 }}>{p.cat}</Box>
                      <Typography sx={{ fontSize: 15.5, fontWeight: 800, color: HEADING, lineHeight: 1.3 }}>{p.title}</Typography>
                      <Typography sx={{ fontSize: 13, color: '#5B6473', lineHeight: 1.5, mt: 0.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.body}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.25 }}>
                        <Typography sx={{ fontSize: 12, color: MUTED }}>{p.day}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: BLUE }}>Read more</Typography>
                          <Icon name="arrowRight" size={15} color={BLUE} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
