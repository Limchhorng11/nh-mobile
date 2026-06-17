import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import BottomNav from '../../components/BottomNav'
import { MoreMenuBody } from '../../components/home/HomeParts'
import { useHomePath } from '../../workspace/useHomePath'

// Full-page "More" screen — reached from the bottom-nav "More" tab. It uses the
// shared HomeTopBar to match the My Loan and Products tabs; HomeTopBar adapts
// per flow: the brand logo for visitors, the greeting for signed-in flows.
export default function MoreScreen() {
  const navigate = useNavigate()
  const home = useHomePath()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <MoreMenuBody greeting onBack={() => navigate(home)} />
      </Box>
      <BottomNav />
    </Box>
  )
}
