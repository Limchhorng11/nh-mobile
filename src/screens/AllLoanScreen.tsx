import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'
import { ProductCard, PRODUCTS, MIGRATION } from './ProductsScreen'

const HEADING = '#0B0F1A'

// ─────────────────────────────────────────────────────────────────────────────
// All Loan — full product catalogue, reached from "See all" on the Products tab.
// ─────────────────────────────────────────────────────────────────────────────
export default function AllLoanScreen() {
  const navigate = useNavigate()

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        {/* Header — back + chat + phone */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#F5F5F5', px: 3, pt: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ ml: -1, color: HEADING }}>
            <Icon name="chevronLeft" size={26} color={HEADING} />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon name="message" size={23} color={HEADING} />
            <Icon name="phone" size={22} color={HEADING} />
          </Box>
        </Box>

        <Box sx={{ px: 3, pb: 5 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px', mt: 0.5, mb: 2 }}>
            All Loan
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {PRODUCTS.map((p) => (
              <ProductCard key={p.name} p={p} height={130} />
            ))}
          </Box>

          <Box sx={{ mt: 1.5 }}>
            <ProductCard p={MIGRATION} height={170} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
