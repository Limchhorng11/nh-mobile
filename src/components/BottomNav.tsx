import { useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon, type IconName } from './Icon'
import { useT } from '../i18n/LangContext'

const BLUE = '#275CB2'
const MUTED = '#8A94A6'

const TAB_DEFS: { id: string; icon: IconName; path: string }[] = [
  { id: 'loan', icon: 'myLoan', path: '/my-loan' },
  { id: 'products', icon: 'products', path: '/products' },
  { id: 'more', icon: 'more', path: '/more' },
]

// Bottom tab bar — present in "Sample 1", absent in "Sample 2".
export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const t = useT()

  const tabs = [
    { ...TAB_DEFS[0], label: t('navMyLoan') },
    { ...TAB_DEFS[1], label: t('navProducts') },
    { ...TAB_DEFS[2], label: t('navMore') },
  ]

  return (
    <Box
      sx={{
        flexShrink: 0,
        bgcolor: '#fff',
        borderTop: '1px solid #ECEFF3',
        display: 'flex',
        alignItems: 'stretch',
        '& > *': { minHeight: 64 },
      }}
    >
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.path)
        return (
          <Box
            key={tab.id}
            onClick={() => navigate(tab.path)}
            role="button"
            aria-label={tab.label}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              cursor: 'pointer',
              color: active ? BLUE : MUTED,
              '&:active': { opacity: 0.6 },
            }}
          >
            <Icon name={tab.icon} size={24} color={active ? BLUE : MUTED} />
            <Typography sx={{ fontSize: 11, fontWeight: active ? 700 : 600, color: 'inherit' }}>
              {tab.label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
