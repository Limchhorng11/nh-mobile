import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { Icon } from '../components/Icon'
import { CollapsingHeader, CollapsingTitle, useCollapse } from '../components/CollapsingHeader'
import CallSheet from '../components/CallSheet'
import { ProductCard, PRODUCTS, MIGRATION } from './ProductsScreen'

const HEADING = '#0B0F1A'

// ─────────────────────────────────────────────────────────────────────────────
// All Loan — full product catalogue, reached from "See all" on the Products tab.
// ─────────────────────────────────────────────────────────────────────────────
export default function AllLoanScreen() {
  const navigate = useNavigate()
  const { collapse, onScroll } = useCollapse()
  const [callOpen, setCallOpen] = useState(false)

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }} onScroll={onScroll}>
        <CollapsingHeader
          title="All Loan"
          collapse={collapse}
          onBack={() => navigate(-1)}
          right={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box role="button" aria-label="Chat" onClick={() => navigate('/chat')} sx={{ display: 'flex', cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                <Icon name="message" size={23} color={HEADING} />
              </Box>
              <Box role="button" aria-label="Call" onClick={() => setCallOpen(true)} sx={{ display: 'flex', cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                <Icon name="phone" size={22} color={HEADING} />
              </Box>
            </Box>
          }
        />
        <CollapsingTitle collapse={collapse}>{"All Loan"}</CollapsingTitle>

        <Box sx={{ px: 3, pb: '44px' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {PRODUCTS.map((p) => (
              <ProductCard key={p.name} p={p} height={152} />
            ))}
          </Box>

          <Box sx={{ mt: 1.5 }}>
            <ProductCard p={MIGRATION} height={170} />
          </Box>
        </Box>
      </Box>

      <CallSheet open={callOpen} onClose={() => setCallOpen(false)} />
    </Box>
  )
}
