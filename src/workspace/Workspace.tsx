import { useState } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PhoneCanvas from './PhoneCanvas'
import AppRouter from '../router/AppRouter'
import { findScreen, DEFAULT_SCREEN, screensForFlow } from './registry'
import { FlowProvider, useFlow, USER_FLOWS, type UserFlow } from './FlowContext'
import { PinGateProvider } from './PinGateContext'
import { LangProvider } from '../i18n/LangContext'

const SIDEBAR_W = 272

// Display labels for the flow picker (the underlying flow values are kept).
const FLOW_LABELS: Record<UserFlow, string> = {
  Visitor: 'Visitor',
  Applicant: 'Applicant',
  Borrower: 'Borrower',
  'Co-Borrower': 'Borrower + Co-Borrower + Guarantor',
  Guarantee: 'Sole Guarantor (multiple loans)',
  Staff: 'Staff',
}

// ─── User-flow selector — defines which user context the prototype represents ─
function UserFlowSelect() {
  const [open, setOpen] = useState(false)
  const { flow, setFlow } = useFlow()

  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', color: '#9AA3B2', mb: 1 }}>
        USER FLOW
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <Box
          onClick={() => setOpen((v) => !v)}
          role="button"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1.5,
            py: 1.25,
            borderRadius: 2,
            border: `1px solid ${open ? '#275CB2' : '#D6DBE2'}`,
            cursor: 'pointer',
            fontSize: 14.5,
            fontWeight: 600,
            color: '#0B0F1A',
            transition: 'border-color 0.12s',
          }}
        >
          {FLOW_LABELS[flow]}
          <Box component="span" sx={{ color: '#8A94A6', fontSize: 11, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▲</Box>
        </Box>
        {open && (
          <Box
            sx={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              zIndex: 20,
              bgcolor: '#fff',
              borderRadius: 2,
              border: '1px solid #ECEFF3',
              boxShadow: '0 8px 24px rgba(16,24,40,0.12)',
              overflow: 'hidden',
            }}
          >
            {USER_FLOWS.map((f) => {
              const active = f === flow
              return (
                <Box
                  key={f}
                  onClick={() => {
                    setFlow(f)
                    setOpen(false)
                  }}
                  role="button"
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    cursor: 'pointer',
                    fontSize: 14.5,
                    fontWeight: active ? 700 : 500,
                    color: active ? '#275CB2' : '#3A4256',
                    bgcolor: active ? '#F4F8FF' : 'transparent',
                    '&:hover': { bgcolor: active ? '#F4F8FF' : '#F5F7FA' },
                  }}
                >
                  {FLOW_LABELS[f]}
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  )
}

// "10/JUNE/2026"
function todayLabel() {
  const d = new Date()
  return `${d.getDate()}/${d.toLocaleString('en-US', { month: 'long' }).toUpperCase()}/${d.getFullYear()}`
}

// Active flow-screen id, derived from the URL ("/products" → "products").
function useActiveScreenId() {
  const { pathname } = useLocation()
  const seg = pathname.split('/').filter(Boolean)[0]
  return findScreen(seg) ? seg : DEFAULT_SCREEN.id
}

// ─── Sidebar — title, date, and the list of flow screens ─────────────────────
function Sidebar() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const activeId = useActiveScreenId()
  const { flow } = useFlow()

  // Screens for the active user flow, grouped by section in registry order.
  const screens = screensForFlow(flow)
  const sections: string[] = []
  for (const s of screens) if (!sections.includes(s.section)) sections.push(s.section)

  // The section that contains the currently-active screen — so we can
  // highlight its header in step with the active screen row.
  const activeSection = screens.find((s) => s.id === activeId)?.section

  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_W,
        flexShrink: 0,
        height: '100vh',
        bgcolor: '#fff',
        borderRight: '1px solid #ECEFF3',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        px: 2,
        py: 4,
        overflowY: 'auto',
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', color: '#9AA3B2' }}>
        {todayLabel()}
      </Typography>
      <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0B0F1A', mt: 0.5, mb: 4, lineHeight: 1.25 }}>
        NongHyup Mobile App
      </Typography>

      <UserFlowSelect />

      {sections.map((section) => {
        const sectionActive = section === activeSection
        return (
        <Box key={section} sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', color: sectionActive ? '#275CB2' : '#9AA3B2', mb: 1, transition: 'color 0.12s' }}>
            {section}
          </Typography>
          {screens.filter((s) => s.section === section).map((s) => {
            const active = s.id === activeId
            return (
              <Box
                key={s.id}
                onClick={() => navigate(`/${s.id}?v=${params.get('v') ?? s.samples[0].v}`)}
                role="button"
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontSize: 14.5,
                  fontWeight: active ? 700 : 500,
                  color: active ? '#0B0F1A' : '#3A4256',
                  bgcolor: active ? '#ECEFF3' : 'transparent',
                  transition: 'background 0.12s',
                  '&:hover': { bgcolor: active ? '#ECEFF3' : '#F5F7FA' },
                }}
              >
                {s.flowNames?.[flow] ?? s.name}
              </Box>
            )
          })}
        </Box>
        )
      })}
    </Box>
  )
}

// ─── Top bar — sample switcher pill for the active screen ────────────────────
function SampleSwitcher() {
  const [params, setParams] = useSearchParams()
  const activeId = useActiveScreenId()
  const screen = findScreen(activeId) ?? DEFAULT_SCREEN
  const activeV = params.get('v') ?? screen.samples[0].v

  // Single-sample screens have nothing to switch.
  if (screen.samples.length < 2) return null

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        bgcolor: '#fff',
        border: '1px solid #ECEFF3',
        borderRadius: 999,
        p: 0.5,
        gap: 0.5,
        boxShadow: '0 1px 3px rgba(16,24,40,0.06)',
      }}
    >
      {screen.samples.map((s) => {
        const active = s.v === activeV
        return (
          <Box
            key={s.v}
            onClick={() => setParams({ v: s.v })}
            role="button"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 999,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 700,
              color: active ? '#0B0F1A' : '#8A94A6',
              bgcolor: active ? '#F5F5F5' : 'transparent',
              transition: 'all 0.12s',
            }}
          >
            {s.label}
          </Box>
        )
      })}
    </Box>
  )
}

export default function Workspace() {
  return (
    <LangProvider>
    <FlowProvider>
      <PinGateProvider>
      <Box sx={{ display: 'flex', minHeight: { xs: '100dvh', md: '100vh' }, bgcolor: { xs: 'transparent', md: '#DDE0E5' } }}>
        <Sidebar />

        {/* Main canvas area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 0,
            gap: { xs: 0, md: 2 },
            minWidth: 0,
          }}
        >
          <SampleSwitcher />
          <PhoneCanvas>
            <AppRouter />
          </PhoneCanvas>
        </Box>
      </Box>
      </PinGateProvider>
    </FlowProvider>
    </LangProvider>
  )
}
