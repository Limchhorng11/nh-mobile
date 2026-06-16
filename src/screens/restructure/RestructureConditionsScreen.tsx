import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Icon } from '../../components/Icon'
import { MwlHeader, MwlTitle, MwlFooter, SelectField, BLUE } from '../mwl/MwlParts'

// ─────────────────────────────────────────────────────────────────────────────
// Request Restructure · Step 2/3 — Your Current loan & New conditions
// ─────────────────────────────────────────────────────────────────────────────
const KH = `'Noto Sans Khmer', sans-serif`

const GRACE = ['1 month', '2 months', '3 months', '6 months']
const TENURE = ['6 months', '12 months', '18 months', '24 months']
const METHODS = ['Mix (Grace Period)', 'Equal Principal', 'Equal Installment']

const PREVIEW_HEAD = ['ចំនួនខែ', 'ប្រាក់ដើម', 'ការប្រាក់', 'ប្រាក់សរុបត្រូវបង់', 'សមតុល្យប្រាក់ដើម']
const PREVIEW_ROWS = [
  ['1', '$78.67', '$10.40', '$89.07', '$1,000.00'],
  ['2', '$78.67', '$10.40', '$89.07', '$921.33'],
  ['3', '$79.49', '$9.58', '$89.07', '$841.83'],
]
const PREVIEW_TOTAL = ['សរុប', '$1,000.00', '$68.88', '$1,068.88', '']

export default function RestructureConditionsScreen() {
  const navigate = useNavigate()
  const [grace, setGrace] = useState('3 months')
  const [tenure, setTenure] = useState('12 months')
  const [method, setMethod] = useState('Mix (Grace Period)')
  const [showTable, setShowTable] = useState(false)

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => navigate('/restructure-info')} step={2} totalSteps={3} />
        <MwlTitle>Your Current loan</MwlTitle>

        <Box sx={{ px: 3, pb: 3, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Loan outstanding */}
          <Box sx={{ bgcolor: '#EAF1FC', borderRadius: '14px', p: '16px' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', color: '#5B6B86' }}>LOAN OUTSTANDING</Typography>
            <Typography sx={{ fontSize: 30, fontWeight: 800, color: BLUE, letterSpacing: '-0.5px', mt: 0.25 }}>$2,000.00</Typography>
            <Typography sx={{ fontSize: 13, color: '#5B6B86', mt: 0.25 }}>As of 27 May 2026 · principal remaining</Typography>
          </Box>

          {/* Unpaid obligation */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: '16px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0B0F1A', mb: 1.25 }}>Unpaid obligation</Typography>
            <KeyValue label="Interest" value="$120.00" />
            <KeyValue label="Monthly fee" value="$15.00" />
            <KeyValue label="Penalty" value="$25.00" />
            <Box sx={{ height: '1px', bgcolor: '#F0F0F0', my: 1.25 }} />
            <KeyValue label="Total unpaid balance" value="$160.00" bold />
          </Box>

          <InfoPill text="The $160 of unpaid will charges to your new principal so you don't pay it upfront." />

          {/* New conditions */}
          <Typography sx={{ fontSize: 24, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', mt: 0.5 }}>New conditions</Typography>

          <Box sx={{ background: 'linear-gradient(160deg, #14438F 0%, #0B2E66 100%)', borderRadius: '14px', p: '16px', color: '#fff' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', color: 'rgba(255,255,255,0.7)' }}>NEW LOAN OUTSTANDING</Typography>
            <Typography sx={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', mt: 0.25, color: '#fff' }}>$2,160.00</Typography>
            <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', mt: 0.25 }}>Final amount will be determined at the approval date.</Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6', mb: 1 }}>REQUESTED CONDITIONS</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <SelectField label="Grace period យៈពេលអនុគ្រោះ" required options={GRACE} value={grace} onChange={setGrace} />
              <SelectField label="Extended loan tenure" required options={TENURE} value={tenure} onChange={setTenure} />
              <SelectField label="Repayment method" required options={METHODS} value={method} onChange={setMethod} />
            </Box>
          </Box>

          {/* New payment estimate */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '12px', p: '16px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0B0F1A', mb: 1.25 }}>New payment estimate</Typography>
            <KeyValue label="During grace (1–3 mo)" value="$23.76/mo" bold />
            <KeyValue label="After grace (4–12 mo)" value="$248.40/mo" bold />
          </Box>

          <InfoPill text="Down from $372.18/mo on your current plan." highlight="$372.18/mo" />

          {/* Toggle payment table */}
          <Box
            onClick={() => setShowTable((v) => !v)}
            role="button"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75, cursor: 'pointer' }}
          >
            <Icon name={showTable ? 'eyeOff' : 'eye'} size={18} color={BLUE} />
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: BLUE }}>
              {showTable ? 'Hide Payment Table' : 'Show Payment Table'}
            </Typography>
          </Box>

          {showTable && (
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6', mb: 1 }}>REPAYMENT PREVIEW</Typography>
              <Box sx={{ bgcolor: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <Box component="thead">
                    <Box component="tr">
                      {PREVIEW_HEAD.map((h, i) => (
                        <Box
                          component="th"
                          key={h}
                          sx={{
                            fontFamily: KH,
                            fontSize: 9.5,
                            fontWeight: 600,
                            color: '#8A94A6',
                            textAlign: i === 0 ? 'center' : 'right',
                            verticalAlign: 'top',
                            px: '6px',
                            py: '10px',
                            lineHeight: 1.3,
                            width: i === 0 ? 34 : undefined,
                          }}
                        >
                          {h}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {PREVIEW_ROWS.map((row) => (
                      <Box component="tr" key={row[0]} sx={{ borderTop: '1px solid #F4F4F4' }}>
                        {row.map((cell, ci) => (
                          <Box
                            component="td"
                            key={ci}
                            sx={{
                              fontSize: 11.5,
                              fontWeight: ci === 3 ? 700 : 500,
                              color: ci === 0 ? '#8A94A6' : ci === 3 ? '#0B0F1A' : '#3A4256',
                              textAlign: ci === 0 ? 'center' : 'right',
                              px: '6px',
                              py: '12px',
                            }}
                          >
                            {cell}
                          </Box>
                        ))}
                      </Box>
                    ))}
                    <Box component="tr" sx={{ borderTop: '1px solid #ECECEC', bgcolor: '#FAFBFC' }}>
                      {PREVIEW_TOTAL.map((cell, ci) => (
                        <Box
                          component="td"
                          key={ci}
                          sx={{
                            fontFamily: ci === 0 ? KH : 'inherit',
                            fontSize: ci === 0 ? 11 : 11.5,
                            fontWeight: 700,
                            color: BLUE,
                            textAlign: ci === 0 ? 'center' : 'right',
                            px: '6px',
                            py: '12px',
                          }}
                        >
                          {cell}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 12, color: '#8A94A6', textAlign: 'center', mt: 1.25 }}>
                Showing 3 of 12 · <Box component="span" sx={{ color: BLUE, fontWeight: 700 }}>Download</Box> for full view
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <MwlFooter onNext={() => navigate('/restructure-consent')} />
    </Box>
  )
}

function KeyValue({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '5px' }}>
      <Typography sx={{ fontSize: 14, fontWeight: bold ? 700 : 500, color: bold ? '#0B0F1A' : '#5B6B86' }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: bold ? 800 : 600, color: '#0B0F1A' }}>{value}</Typography>
    </Box>
  )
}

function InfoPill({ text, highlight }: { text: string; highlight?: string }) {
  const parts = highlight ? text.split(highlight) : [text]
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, bgcolor: '#E9EBEF', borderRadius: '12px', px: '14px', py: '12px' }}>
      <Box
        component="img"
        src="/assets/brand/ico_info_16.svg"
        alt=""
        sx={{ mt: '1px', flexShrink: 0, width: 16, height: 16, display: 'block' }}
      />
      <Typography sx={{ fontSize: 12.5, color: '#3A3F4A', lineHeight: 1.45 }}>
        {highlight ? (
          <>
            {parts[0]}
            <Box component="span" sx={{ fontWeight: 800, color: '#0B0F1A' }}>{highlight}</Box>
            {parts[1]}
          </>
        ) : (
          text
        )}
      </Typography>
    </Box>
  )
}
