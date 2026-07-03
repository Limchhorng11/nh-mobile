import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Blog Post Detail — full article view with thumbnail, meta, body.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

const RELATED_POSTS = [
  { cat: 'FINANCIAL BASICS', title: 'Unlicensed Online Loan',                  tint: '#275CB2', videoId: 'RT2taL5xxWU' },
  { cat: "CUSTOMER'S STORY",  title: "Sophea's rice farm: from harvest to growth", tint: '#1FA85C', videoId: 'VIIclHZEkco' },
  { cat: 'EDU',               title: 'Understanding interest rates',             tint: '#7A3FF2', videoId: 'bk4pBXKyW3M' },
]

export default function BlogDetailScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.key])

  const post = state as {
    cat: string
    title: string
    tint: string
    videoId?: string
    body?: string
    day?: string
    author?: string
  } | null

  const cat = post?.cat ?? 'BLOG'
  const title = post?.title ?? 'Blog Post'
  const tint = post?.tint ?? BLUE
  const videoId = post?.videoId
  const body = post?.body ?? 'NongHyup Finance is committed to providing accessible financial services to all Cambodians. Our products are designed to support individuals, families, and businesses at every stage of their financial journey.'
  const day = post?.day ?? '1 Jul 2026'
  const author = post?.author ?? 'NongHyup Finance'

  const thumbUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, pt: 1, pb: 0.5 }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ color: HEADING }}>
          <Icon name="chevronLeft" size={26} color={HEADING} />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        <IconButton aria-label="Share" sx={{ color: HEADING }}>
          <Icon name="share" size={22} color={HEADING} />
        </IconButton>
      </Box>

      <Box ref={scrollRef} className="scroll-content" sx={{ flex: 1, pb: '32px' }}>
        {/* Thumbnail */}
        <Box sx={{ position: 'relative', height: 220, bgcolor: '#000', overflow: 'hidden', mx: 0 }}>
          {thumbUrl ? (
            <Box
              component="img"
              src={thumbUrl}
              alt={title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
          ) : (
            <Box sx={{ height: '100%', background: `linear-gradient(135deg, ${tint}40, ${tint}18)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="blogs" size={56} color={tint} />
            </Box>
          )}
          {/* Play button overlay for video */}
          {videoId && (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.7)' }}>
                <Icon name="play" size={22} color="#fff" />
              </Box>
            </Box>
          )}
          {/* Category badge */}
          <Box sx={{ position: 'absolute', top: 14, left: 16, bgcolor: tint, borderRadius: '999px', px: '10px', py: '3px' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>{cat}</Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ px: 3, pt: 2.5 }}>
          {/* Title */}
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: HEADING, lineHeight: 1.25, letterSpacing: '-0.3px' }}>
            {title}
          </Typography>

          {/* Meta row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, pb: 2, borderBottom: '1px solid #F0F2F5' }}>
            <Typography sx={{ fontSize: 13, color: MUTED }}>By</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING }}>{author}</Typography>
            <Typography sx={{ fontSize: 13, color: MUTED }}>·</Typography>
            <Typography sx={{ fontSize: 13, color: MUTED }}>{day}</Typography>
          </Box>

          {/* Body */}
          <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ fontSize: 15, color: '#3A4256', lineHeight: 1.75 }}>
              {body}
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#3A4256', lineHeight: 1.75 }}>
              NongHyup Finance Cambodia (NHFC) offers a wide range of loan products tailored for every need — from micro loans for small entrepreneurs to housing loans for growing families. With competitive interest rates and flexible repayment terms, NHFC is your trusted financial partner.
            </Typography>
            <Typography sx={{ fontSize: 15, color: '#3A4256', lineHeight: 1.75 }}>
              Our dedicated officers are available across all branches to guide you through the application process, ensuring a smooth and transparent experience from start to finish.
            </Typography>

            {/* Pull quote */}
            <Box sx={{ borderLeft: `4px solid ${tint}`, pl: 2, py: 0.5, bgcolor: `${tint}0A`, borderRadius: '0 8px 8px 0' }}>
              <Typography sx={{ fontSize: 15, fontStyle: 'italic', fontWeight: 600, color: HEADING, lineHeight: 1.6 }}>
                "Financial inclusion is at the heart of everything we do at NongHyup Finance Cambodia."
              </Typography>
            </Box>

            <Typography sx={{ fontSize: 15, color: '#3A4256', lineHeight: 1.75 }}>
              Visit your nearest NHFC branch or contact us via our hotline for more information about our products and services. Together, let's build a stronger financial future.
            </Typography>
          </Box>

          {/* Related posts */}
          <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid #F0F2F5' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: MUTED, mb: 1.5 }}>MORE POSTS</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', mx: -3, px: 3, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
              {RELATED_POSTS.filter((p) => p.title !== title).slice(0, 3).map((p) => (
                <Box
                  key={p.videoId}
                  role="button"
                  onClick={() => navigate('/blog-detail', { state: { cat: p.cat, title: p.title, tint: p.tint, videoId: p.videoId, day: '1 Jul 2026', author: 'NongHyup Finance' } })}
                  sx={{ flexShrink: 0, width: 180, bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', '&:active': { opacity: 0.85 } }}
                >
                  <Box sx={{ position: 'relative', height: 100, bgcolor: '#000', overflow: 'hidden' }}>
                    <Box component="img" src={`https://img.youtube.com/vi/${p.videoId}/hqdefault.jpg`} alt={p.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="play" size={13} color="#fff" />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ p: '10px' }}>
                    <Box sx={{ display: 'inline-block', fontSize: 10, fontWeight: 700, px: '6px', py: '2px', borderRadius: '4px', color: p.tint, bgcolor: `${p.tint}1A`, mb: 0.5 }}>{p.cat}</Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: HEADING, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
