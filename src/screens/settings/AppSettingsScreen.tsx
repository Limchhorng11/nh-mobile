import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import { Icon, type IconName } from '../../components/Icon'
import { useCollapse, CollapsingHeader, CollapsingTitle } from '../../components/CollapsingHeader'

// ─────────────────────────────────────────────────────────────────────────────
// App settings — notification preferences (opened from Settings).
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'
const BLUE = '#275CB2'

const blueSwitch = {
  '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: BLUE, opacity: 1 },
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
  sub: string
  divider?: boolean
  checked: boolean
  onToggle: (v: boolean) => void
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: '14px', py: '12px', borderBottom: divider ? '1px solid #F1F4F8' : 'none' }}>
      <Icon name={icon} size={24} color="#1A1A1A" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: HEADING, lineHeight: 1.3 }}>{label}</Typography>
        <Typography sx={{ fontSize: 12, color: MUTED, mt: 0.25 }}>{sub}</Typography>
      </Box>
      <Switch checked={checked} onChange={(e) => onToggle(e.target.checked)} sx={blueSwitch} />
    </Box>
  )
}

export default function AppSettingsScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [paymentReminders, setPaymentReminders] = useState(true)
  const [promotions, setPromotions] = useState(true)
  const [chatNotifs, setChatNotifs] = useState(false)

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader title="App settings" collapse={collapse} onBack={() => navigate(-1)} />
        <CollapsingTitle collapse={collapse}>{"App settings"}</CollapsingTitle>

        <Box sx={{ px: 3, pb: 4 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.7px', color: '#9AA3B2', px: 0.5, py: 1 }}>
            NOTIFICATIONS
          </Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            <ToggleRow icon="bellOff" label="Payment reminders" sub="3 days before payment due" divider checked={paymentReminders} onToggle={setPaymentReminders} />
            <ToggleRow icon="bell" label="Promotions & news" sub="Offers and updates" divider checked={promotions} onToggle={setPromotions} />
            <ToggleRow icon="message" label="Chat notifications" sub="New messages from support" checked={chatNotifs} onToggle={setChatNotifs} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
