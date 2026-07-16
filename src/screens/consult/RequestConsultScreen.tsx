import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { Icon } from '../../components/Icon'

const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const DANGER = '#E5484D'
const BLUE = '#275CB2'

const BRANCHES = [
  'Phnom Penh Main', 'Chroy Changvar', 'Toul Kork', 'Sen Sok',
  'Kandal — Takhmao', 'Siem Reap', 'Battambang', 'Sihanoukville',
  'Kampong Cham', 'Kampot', 'Takeo', 'Pursat',
]

const CONSULT_TOPICS = [
  'Loan Application Guidance',
  'Loan Restructuring',
  'Repayment Schedule',
  'Account & Document Support',
  'General Inquiry',
]

const TIME_SLOTS = [
  '8:00AM', '9:00AM', '10:00AM', '11:00AM',
  '1:00PM', '2:00PM', '3:00PM', '4:00PM', '5:00PM',
]

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function parseDateValue(val: string): { d: number; m: number; y: number } {
  const parts = val.split(' ')
  return { d: parseInt(parts[0]), m: SHORT_MONTHS.indexOf(parts[1]), y: parseInt(parts[2]) }
}

function formatDateValue(d: number, m: number, y: number): string {
  return `${d} ${SHORT_MONTHS[m]} ${y}`
}

// ─── Calendar picker component ────────────────────────────────────────────────
function CalendarPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed = parseDateValue(value)
  const [viewYear, setViewYear] = useState(parsed.y)
  const [viewMonth, setViewMonth] = useState(parsed.m)

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <Box>
      {/* Month nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton onClick={prevMonth} size="small" sx={{ color: HEADING }}>
          <Icon name="chevronLeft" size={20} color={HEADING} />
        </IconButton>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: HEADING }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Typography>
        <IconButton onClick={nextMonth} size="small" sx={{ color: HEADING }}>
          <Icon name="chevronRight" size={20} color={HEADING} />
        </IconButton>
      </Box>

      {/* Day labels */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {DAY_LABELS.map(d => (
          <Typography key={d} sx={{ fontSize: 12, fontWeight: 600, color: MUTED, textAlign: 'center', py: 0.5 }}>{d}</Typography>
        ))}
      </Box>

      {/* Day cells */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((day, i) => {
          if (!day) return <Box key={i} />
          const isSelected = day === parsed.d && viewMonth === parsed.m && viewYear === parsed.y
          return (
            <Box
              key={i}
              onClick={() => onChange(formatDateValue(day, viewMonth, viewYear))}
              sx={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                cursor: 'pointer',
                bgcolor: isSelected ? BLUE : 'transparent',
                '&:hover': { bgcolor: isSelected ? BLUE : '#F4F8FF' },
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: isSelected ? 700 : 500, color: isSelected ? '#fff' : HEADING }}>
                {day}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default function RequestConsultScreen() {
  const navigate = useNavigate()
  const [branch, setBranch] = useState('Kandal — Takhmao')
  const [date, setDate] = useState('12 May 2026')
  const [time, setTime] = useState('8:00AM')
  const [topic, setTopic] = useState(CONSULT_TOPICS[0])
  const [topicOpen, setTopicOpen] = useState(false)
  const [sheet, setSheet] = useState<'branch' | 'date' | 'time' | null>(null)
  const [branchSearch, setBranchSearch] = useState('')
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)

  useEffect(() => { setPortalEl(document.getElementById('phone-canvas')) }, [])

  const filteredBranches = BRANCHES.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()))

  const close = () => { setSheet(null); setBranchSearch('') }

  const sheets = (
    <>
      {/* Branch picker */}
      <BottomSheet open={sheet === 'branch'} onClose={close} title="Select Branch">
        <Box sx={{ bgcolor: '#F5F5F7', borderRadius: '12px', px: 2, height: 44, display: 'flex', alignItems: 'center', gap: 1, mt: -1 }}>
          <Icon name="search" size={18} color={MUTED} />
          <Box
            component="input"
            value={branchSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBranchSearch(e.target.value)}
            placeholder="Search branch"
            autoFocus={sheet === 'branch'}
            sx={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: HEADING, p: 0, fontFamily: 'inherit', '&::placeholder': { color: MUTED } }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: -1 }}>
          {filteredBranches.map((b) => (
            <Box
              key={b}
              onClick={() => { setBranch(b); close() }}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #F0F0F2', cursor: 'pointer', mx: -0.5, px: 0.5, borderRadius: '8px', bgcolor: b === branch ? '#F4F8FF' : 'transparent' }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: b === branch ? BLUE : HEADING }}>{b}</Typography>
              {b === branch && <Icon name="check" size={18} color={BLUE} />}
            </Box>
          ))}
          {filteredBranches.length === 0 && (
            <Typography sx={{ fontSize: 15, color: MUTED, textAlign: 'center', py: 4 }}>No results</Typography>
          )}
        </Box>
      </BottomSheet>

      {/* Date picker — calendar */}
      <BottomSheet open={sheet === 'date'} onClose={close} title="Select Date">
        <Box sx={{ mt: -1 }}>
          <CalendarPicker value={date} onChange={(v) => { setDate(v); close() }} />
        </Box>
      </BottomSheet>

      {/* Time picker */}
      <BottomSheet open={sheet === 'time'} onClose={close} title="Select Time">
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: -1 }}>
          {TIME_SLOTS.map((t) => (
            <Box
              key={t}
              onClick={() => { setTime(t); close() }}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #F0F0F2', cursor: 'pointer', mx: -0.5, px: 0.5, borderRadius: '8px', bgcolor: t === time ? '#F4F8FF' : 'transparent' }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: t === time ? BLUE : HEADING }}>{t}</Typography>
              {t === time && <Icon name="check" size={18} color={BLUE} />}
            </Box>
          ))}
        </Box>
      </BottomSheet>
    </>
  )

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 3, pb: 1 }}>
          <IconButton onClick={() => navigate('/more')} aria-label="Back" sx={{ color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/chat')} aria-label="Chat support" sx={{ color: HEADING }}>
              <Icon name="message" size={24} color={HEADING} />
            </IconButton>
            <IconButton aria-label="Call support" sx={{ color: HEADING }}>
              <Icon name="phone" size={22} color={HEADING} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ px: 3, pt: 1 }}>
          <Typography sx={{ fontSize: 32, fontWeight: 800, color: HEADING, letterSpacing: '-0.8px', lineHeight: 1.15 }}>
            When would you like to meet?
          </Typography>

          {/* Select Branch */}
          <Box
            onClick={() => setSheet('branch')}
            sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 4, cursor: 'pointer' }}
          >
            <FieldLabel label="Select Branch" required />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: HEADING, flex: 1 }}>{branch}</Typography>
              <Icon name="search" size={20} color={MUTED} />
            </Box>
          </Box>

          {/* Date + Time */}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Box
              onClick={() => setSheet('date')}
              sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0, cursor: 'pointer' }}
            >
              <FieldLabel label="Date" required />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: HEADING, flex: 1 }} noWrap>{date}</Typography>
                <Icon name="calendar" size={20} color={MUTED} />
              </Box>
            </Box>
            <Box
              onClick={() => setSheet('time')}
              sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, minWidth: 0, cursor: 'pointer' }}
            >
              <FieldLabel label="Time" required />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: HEADING, flex: 1 }} noWrap>{time}</Typography>
                <Icon name="chevronsUpDown" size={20} color={MUTED} />
              </Box>
            </Box>
          </Box>

          {/* Consultation Topic — inline dropdown, not a bottom sheet */}
          <Box sx={{ position: 'relative', mt: 2 }}>
            <Box
              onClick={() => setTopicOpen((v) => !v)}
              sx={{ bgcolor: '#fff', border: `1px solid ${topicOpen ? BLUE : '#E8EAEE'}`, borderRadius: '14px', px: '16px', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 0.15s' }}
            >
              <FieldLabel label="Consultation Topic" required />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: HEADING, flex: 1 }} noWrap>{topic}</Typography>
                <Icon name="chevronsUpDown" size={20} color={MUTED} />
              </Box>
            </Box>

            {topicOpen && (
              <>
                <Box onClick={() => setTopicOpen(false)} sx={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    zIndex: 41,
                    bgcolor: '#fff',
                    border: '1px solid #E8EAEE',
                    borderRadius: '14px',
                    boxShadow: '0 8px 24px rgba(11,15,26,0.14)',
                    py: '6px',
                    overflow: 'hidden',
                  }}
                >
                  {CONSULT_TOPICS.map((tp) => (
                    <Box
                      key={tp}
                      onClick={() => { setTopic(tp); setTopicOpen(false) }}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '16px', py: '12px', cursor: 'pointer', bgcolor: tp === topic ? '#F4F8FF' : 'transparent', '&:hover': { bgcolor: '#F7F9FC' } }}
                    >
                      <Typography sx={{ fontSize: 15, fontWeight: 600, color: tp === topic ? BLUE : HEADING }}>{tp}</Typography>
                      {tp === topic && <Icon name="check" size={16} color={BLUE} />}
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>

          {/* Comment */}
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', px: '16px', py: '16px', mt: 2 }}>
            <Box
              component="textarea"
              rows={3}
              placeholder="Enter your comment"
              aria-label="Comment"
              sx={{ width: '100%', border: 'none', outline: 'none', resize: 'none', bgcolor: 'transparent', fontSize: 16, color: HEADING, fontFamily: 'inherit', p: 0, '::placeholder': { color: MUTED } }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: '44px', bgcolor: '#F5F5F5' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate('/consult-success')}
          sx={{ height: 56, borderRadius: '14px', fontSize: 16, fontWeight: 700 }}
        >
          Submit
        </Button>
      </Box>

      {portalEl ? createPortal(sheets, portalEl) : sheets}
    </Box>
  )
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Typography sx={{ fontSize: 12, color: MUTED, lineHeight: 1.3 }}>
      {label}
      {required && <Box component="span" sx={{ color: DANGER, ml: 0.4 }}>*</Box>}
    </Typography>
  )
}

function BottomSheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  return (
    <>
      <Box onClick={onClose} sx={{ position: 'absolute', inset: 0, zIndex: 100, bgcolor: 'rgba(11,15,26,0.45)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.25s ease' }} />
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 101, bgcolor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, transform: open ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)', maxHeight: '88%', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 30px rgba(11,15,26,0.18)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25, pb: 0.5, flexShrink: 0 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: '#D6DBE2' }} />
        </Box>
        {title && (
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: HEADING, textAlign: 'center', px: 3, pt: 0.5, pb: 1, flexShrink: 0 }}>{title}</Typography>
        )}
        <Box sx={{ overflowY: 'auto', px: '20px', pt: '24px', pb: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>{children}</Box>
      </Box>
    </>
  )
}
