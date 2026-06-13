import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import { Icon, type IconName } from '../../components/Icon'
import { useCollapse, CollapsingHeader, CollapsingTitle } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
// Notification Settings — toggles for the kinds of push the user receives.
// Opened from Settings › Account Settings › Notifications.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

function Card({ children }: { children: React.ReactNode }) {
  return <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>{children}</Box>
}

function ToggleRow({
  icon,
  label,
  sub,
  divider,
  checked,
  onToggle,
}: {
  icon: IconName
  label: string
  sub?: string
  divider?: boolean
  checked: boolean
  onToggle: (v: boolean) => void
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: '14px',
        py: '12px',
        borderBottom: divider ? '1px solid #F1F4F8' : 'none',
      }}
    >
      <Icon name={icon} size={24} color="#1A1A1A" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: HEADING, lineHeight: 1.3 }}>{label}</Typography>
        {sub && <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>{sub}</Typography>}
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
        disableRipple
        sx={{
          width: 51,
          height: 31,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: '2px',
            transitionDuration: '200ms',
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              color: '#fff',
              '& + .MuiSwitch-track': { bgcolor: BLUE, opacity: 1, border: 0 },
            },
          },
          '& .MuiSwitch-thumb': {
            width: 27,
            height: 27,
            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
          },
          '& .MuiSwitch-track': {
            borderRadius: '999px',
            bgcolor: '#E9E9EA',
            border: '1px solid #DADBDD',
            opacity: 1,
            transition: 'background-color 200ms',
          },
        }}
      />
    </Box>
  )
}

export default function NotificationSettingsScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [paymentReminders, setPaymentReminders] = useState(false)
  const [promotions, setPromotions] = useState(true)
  const [chatNotifs, setChatNotifs] = useState(false)

  // Master switch reflects "all on" and flips every notification at once.
  const allOn = paymentReminders && promotions && chatNotifs
  const toggleAll = (v: boolean) => {
    setPaymentReminders(v)
    setPromotions(v)
    setChatNotifs(v)
  }

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="Notifications" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"Notifications"}</CollapsingTitle>

        <Box sx={{ px: 3, pt: '24px', pb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card>
            <ToggleRow icon="bell" label="All notifications" sub="Turn every notification on or off" checked={allOn} onToggle={toggleAll} />
          </Card>

          <Card>
            <ToggleRow icon="bellOff" label="Payment reminders" divider checked={paymentReminders} onToggle={setPaymentReminders} />
            <ToggleRow icon="bell" label="Promotions & news" divider checked={promotions} onToggle={setPromotions} />
            <ToggleRow icon="bellOff" label="Chat notifications" checked={chatNotifs} onToggle={setChatNotifs} />
          </Card>
        </Box>
      </Box>
    </Box>
  )
}
