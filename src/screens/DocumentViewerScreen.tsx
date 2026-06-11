import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Document viewer — full-page "PDF" preview opened from a document tile / Download.
// Renders the NongHyup customer-history repayment schedule as a print-style page.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const BLUE = '#0052CC'
const BRAND = '#2B53A8'
const HEAD_ORANGE = '#C2700C'
const BORDER = '#C9CDD4'

type Row = [string, string, string, string, string, string, string, string]

// No, Date, Principal, Interest, Admin Fee, Unpaid Int, Total Amount, Loan Outstanding
const ROWS: Row[] = [
  ['1', '19/12/2023', '100.00', '82.50', '16.50', '0.00', '199.00', '2,900.00'],
  ['2', '19/01/2024', '100.00', '44.95', '8.99', '0.00', '153.94', '2,800.00'],
  ['3', '19/02/2024', '100.00', '43.40', '8.68', '0.00', '152.08', '2,700.00'],
  ['4', '19/03/2024', '100.00', '39.15', '7.83', '0.00', '146.98', '2,600.00'],
  ['5', '19/04/2024', '100.00', '40.30', '8.06', '0.00', '148.36', '2,500.00'],
  ['6', '20/05/2024', '100.00', '38.75', '7.75', '0.00', '146.50', '2,400.00'],
  ['7', '19/06/2024', '100.00', '36.00', '7.20', '0.00', '143.20', '2,300.00'],
  ['8', '19/07/2024', '100.00', '34.50', '6.90', '0.00', '141.40', '2,200.00'],
  ['9', '18/08/2024', '100.00', '34.10', '6.82', '0.00', '140.92', '2,100.00'],
  ['10', '19/09/2024', '100.00', '32.55', '6.51', '0.00', '139.06', '2,000.00'],
  ['11', '21/10/2024', '100.00', '32.00', '6.40', '0.00', '138.40', '1,900.00'],
  ['12', '19/11/2024', '100.00', '27.55', '5.51', '0.00', '133.06', '1,800.00'],
  ['13', '19/12/2024', '100.00', '27.00', '5.40', '0.00', '132.40', '1,700.00'],
  ['14', '20/01/2025', '100.00', '27.20', '5.44', '0.00', '132.64', '1,600.00'],
  ['15', '19/02/2025', '100.00', '24.00', '4.80', '0.00', '128.80', '1,500.00'],
  ['16', '19/03/2025', '100.00', '21.00', '4.20', '0.00', '125.20', '1,400.00'],
  ['17', '21/04/2025', '100.00', '23.10', '4.62', '0.00', '127.72', '1,300.00'],
  ['18', '19/05/2025', '100.00', '18.20', '3.64', '0.00', '121.84', '1,200.00'],
  ['19', '19/06/2025', '100.00', '18.60', '3.72', '0.00', '122.32', '1,100.00'],
  ['20', '21/07/2025', '100.00', '17.60', '3.52', '0.00', '121.12', '1,000.00'],
  ['21', '19/08/2025', '100.00', '14.50', '2.90', '0.00', '117.40', '900.00'],
  ['22', '19/09/2025', '100.00', '13.95', '2.79', '0.00', '116.74', '800.00'],
  ['23', '20/10/2025', '100.00', '12.40', '2.48', '0.00', '114.88', '700.00'],
  ['24', '19/11/2025', '100.00', '10.50', '2.10', '0.00', '112.60', '600.00'],
  ['25', '19/12/2025', '100.00', '9.00', '1.80', '0.00', '110.80', '500.00'],
  ['26', '19/01/2026', '100.00', '7.75', '1.55', '0.00', '109.30', '400.00'],
  ['27', '19/02/2026', '100.00', '6.20', '1.24', '0.00', '107.44', '300.00'],
  ['28', '19/03/2026', '100.00', '4.20', '0.84', '0.00', '105.04', '200.00'],
  ['29', '20/04/2026', '100.00', '3.20', '0.64', '0.00', '103.84', '100.00'],
  ['30', '19/05/2026', '100.00', '1.45', '0.29', '0.00', '101.74', '0.00'],
]
const TOTAL: Row = ['', 'Total', '3,000.00', '745.60', '149.12', '0.00', '3,894.72', '']
const HEAD = ['No', 'Installment Date', 'Principal', 'Interest', 'Admin Fee', 'Unpaid Int', 'Total Amount', 'Loan Outstanding']
const COL_W = [30, 96, 70, 66, 64, 60, 86, 96]

export default function DocumentViewerScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const title = (params.get('name') ?? 'Actual Payment') + '.pdf'

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 1.5, pt: 3, pb: 1.5, bgcolor: '#fff', borderBottom: '1px solid #EDEFF2' }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ color: HEADING }}>
          <Icon name="chevronLeft" size={26} color={HEADING} />
        </IconButton>
        <Typography noWrap sx={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px' }}>
          {title}
        </Typography>
        <Typography role="button" sx={{ flexShrink: 0, fontSize: 16, fontWeight: 700, color: BLUE, px: 1, cursor: 'pointer' }}>
          Save
        </Typography>
      </Box>

      {/* Document body */}
      <Box className="scroll-content" sx={{ flex: 1, overflow: 'auto', bgcolor: '#fff' }}>
        <Box sx={{ minWidth: 720, px: 2.5, py: 3 }}>
          {/* Title block */}
          <Box sx={{ textAlign: 'center', mb: 2.5 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: BRAND, fontFamily: 'Georgia, serif' }}>
              NongHyup Finance (Cambodia) Plc.
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: BRAND, fontFamily: 'Georgia, serif' }}>
              Customer History
            </Typography>
          </Box>

          {/* Metadata — two columns */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 3, rowGap: 1 }}>
            <Meta label="Loan Account No" value="004-01225829" />
            <Meta label="Date Release" value="25/10/2023 16:17:09" />
            <Meta label="Client Name" value="Dim, Kim" />
            <Meta label="Gender" value="F" />
            <Meta label="Amount Release" value="3,000.00 USD" />
            <Meta label="Maturity Date" value="19/05/2026" />
            <Meta label="Payment Mode" value="Decline" />
            <Meta label="Loan Cycle" value="1" />
            <Meta label="Term: 30" value="Rate: 18.00" inline />
            <Meta label="GroupName" value="" />
          </Box>
          <Box sx={{ mt: 1 }}>
            <Meta label="Address" value="Kampong Speu, Samraong Tong, Krang Ampil, Thlok Doun Sokh" />
          </Box>

          {/* Table */}
          <Box sx={{ mt: 2.5, border: `1px solid ${BORDER}` }}>
            {/* Caption */}
            <Box sx={{ borderBottom: `1px solid ${BORDER}`, py: '7px', textAlign: 'center' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: HEADING }}>Amount to be Collect</Typography>
            </Box>
            {/* Head */}
            <Box sx={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
              {HEAD.map((h, i) => (
                <Cell key={h} w={COL_W[i]} head last={i === HEAD.length - 1}>{h}</Cell>
              ))}
            </Box>
            {/* Rows */}
            {ROWS.map((r) => (
              <Box key={r[0]} sx={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
                {r.map((c, i) => (
                  <Cell key={i} w={COL_W[i]} align={i === 0 || i === 1 ? 'left' : 'right'} last={i === r.length - 1}>{c}</Cell>
                ))}
              </Box>
            ))}
            {/* Total */}
            <Box sx={{ display: 'flex' }}>
              {TOTAL.map((c, i) => (
                <Cell key={i} w={COL_W[i]} align={i === 1 ? 'center' : 'right'} last={i === TOTAL.length - 1} bold>{c}</Cell>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Meta({ label, value, inline }: { label: string; value: string; inline?: boolean }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'baseline' }}>
      <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: HEADING, whiteSpace: 'nowrap' }}>
        {label}{inline ? '' : ':'}
      </Typography>
      <Typography sx={{ fontSize: 11.5, color: '#333', minWidth: 0 }}>{value}</Typography>
    </Box>
  )
}

function Cell({ children, w, head, bold, align = 'left', last }: { children: React.ReactNode; w: number; head?: boolean; bold?: boolean; align?: 'left' | 'right' | 'center'; last?: boolean }) {
  return (
    <Box
      sx={{
        width: w,
        flexShrink: 0,
        px: '6px',
        py: '5px',
        borderRight: last ? 'none' : `1px solid ${BORDER}`,
        textAlign: align,
      }}
    >
      <Typography sx={{ fontSize: 10.5, fontWeight: head || bold ? 700 : 400, color: head ? HEAD_ORANGE : HEADING, lineHeight: 1.3 }}>
        {children}
      </Typography>
    </Box>
  )
}
