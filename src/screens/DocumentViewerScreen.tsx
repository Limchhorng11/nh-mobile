import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from '../components/Icon'

// ─────────────────────────────────────────────────────────────────────────────
// Document viewer — full-page "PDF" preview opened from a document tile / Download.
// Renders the NongHyup customer-history repayment schedule as a print-style page.
// ─────────────────────────────────────────────────────────────────────────────
const HEADING = '#0B0F1A'
const BLUE = '#275CB2'
const BRAND = '#2B53A8'
const HEAD_ORANGE = '#C2700C'
const BORDER = '#C9CDD4'

type Row = { cells: [string, string, string, string, string, string, string, string]; paid: boolean }

// No, Date, Principal, Interest, Admin Fee, Unpaid Int, Total Amount, Loan Outstanding
// Rows 1–8 are paid (strikethrough), rows 9–24 are upcoming
const ROWS: Row[] = [
  { cells: ['1',  '5/01/26', '39.46', '3.99', '1.54', '0.00', '44.99', '4,460.54'], paid: true  },
  { cells: ['2',  '5/02/26', '39.46', '3.99', '1.54', '0.00', '44.99', '4,421.08'], paid: true  },
  { cells: ['3',  '5/03/26', '39.46', '3.99', '1.54', '0.00', '44.99', '4,381.62'], paid: true  },
  { cells: ['4',  '5/04/26', '39.46', '3.99', '1.54', '0.00', '44.99', '4,342.16'], paid: true  },
  { cells: ['5',  '5/05/26', '39.46', '3.99', '1.54', '0.00', '44.99', '4,302.70'], paid: true  },
  { cells: ['6',  '5/06/26', '39.46', '3.99', '1.54', '0.00', '44.99', '4,263.24'], paid: true  },
  { cells: ['7',  '5/07/26', '39.46', '3.99', '1.54', '0.00', '44.99', '4,223.78'], paid: true  },
  { cells: ['8',  '5/08/26', '39.46', '3.99', '1.54', '0.00', '44.99', '4,184.32'], paid: true  },
  { cells: ['9',  '5/09/26', '39.93', '3.59', '1.47', '0.00', '44.99', '4,144.39'], paid: false },
  { cells: ['10', '5/10/26', '39.93', '3.59', '1.47', '0.00', '44.99', '4,104.46'], paid: false },
  { cells: ['11', '5/11/26', '39.93', '3.59', '1.47', '0.00', '44.99', '4,064.53'], paid: false },
  { cells: ['12', '5/12/26', '39.93', '3.59', '1.47', '0.00', '44.99', '4,024.60'], paid: false },
  { cells: ['13', '5/01/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,984.67'], paid: false },
  { cells: ['14', '5/02/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,944.74'], paid: false },
  { cells: ['15', '5/03/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,904.81'], paid: false },
  { cells: ['16', '5/04/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,864.88'], paid: false },
  { cells: ['17', '5/05/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,824.95'], paid: false },
  { cells: ['18', '5/06/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,785.02'], paid: false },
  { cells: ['19', '5/07/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,745.09'], paid: false },
  { cells: ['20', '5/08/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,705.16'], paid: false },
  { cells: ['21', '5/09/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,665.23'], paid: false },
  { cells: ['22', '5/10/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,625.30'], paid: false },
  { cells: ['23', '5/11/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,585.37'], paid: false },
  { cells: ['24', '5/12/27', '39.93', '3.59', '1.47', '0.00', '44.99', '3,545.44'], paid: false },
]
const TOTAL_CELLS: [string, string, string, string, string, string, string, string] = ['', 'Total', '950.75', '86.52', '35.73', '0.00', '1,079.76', '']
const HEAD = ['No', 'Installment Date', 'Principal', 'Interest', 'Admin Fee', 'Unpaid Int', 'Total Amount', 'Loan Outstanding']
const COL_W = [20, 52, 44, 42, 40, 38, 50, 52]

// ─── Contract documents (Loan / Hypothec / Guarantee / Restructured) ──────────
type ContractDef = {
  title: string
  ref: string
  note?: { tone: 'warn' | 'info'; text: string }
  sections: { label: string; rows: [string, string][] }[]
}
const CONTRACTS: Record<string, ContractDef> = {
  'Loan Contract': {
    title: 'Loan Contract',
    ref: 'Ref: 026-01285956 · Issued: 01 Jan 2024',
    sections: [
      { label: 'PARTIES', rows: [['Lender', 'NH Loans Co., Ltd.'], ['Borrower', 'Dong Phally'], ['Loan product', 'Small Biz Loan']] },
      { label: 'LOAN TERMS', rows: [['Loan amount', '$4,900.00'], ['Interest rate', '1.2% / mo'], ['Tenure', '24 months']] },
    ],
  },
  '1st Restructured Contract': {
    title: '1st Restructured Contract',
    ref: 'Ref: 026-01285956-RST · Issued: 12 May 2026',
    note: { tone: 'info', text: 'Approved restructuring of your existing loan. The new repayment terms below replace the original ones.' },
    sections: [
      { label: 'NEW TERMS', rows: [['Loan amount', '$2,000.00'], ['Interest rate', '1.5% / mo'], ['Tenure', '12 months'], ['Grace period', '3 months']] },
    ],
  },
  'Hypothec Contract': {
    title: 'Hypothec Contract',
    ref: 'Ref: 026-01285956-HYP · Issued: 01 Jan 2024',
    note: { tone: 'warn', text: 'This document describes the asset pledged as collateral for this loan.' },
    sections: [
      { label: 'COLLATERAL', rows: [['Asset type', 'Land title'], ['Title number', 'PP-2023-004512'], ['Location', 'Khan Toul Kork, PP']] },
    ],
  },
  'Guarantee Contract': {
    title: 'Guarantee Contract',
    ref: 'Ref: 026-01285956-GUA · Issued: 01 Jan 2024',
    note: { tone: 'info', text: 'A guarantor has agreed to be responsible for repaying this loan if you are unable to.' },
    sections: [
      { label: 'GUARANTEE TERMS', rows: [['Guarantor', 'Kim Dara'], ['Guaranteed amount', '$4,900.00']] },
    ],
  },
}

export default function DocumentViewerScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const name = params.get('name') ?? 'Actual Payment'
  const contract = CONTRACTS[name]
  const isGuaranteeDownload = params.get('guarantee') === 'true'

  return (
    <Box className="screen-enter" sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      {/* Header */}
      <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 1.5, pt: 3, pb: 1.5, bgcolor: '#F5F5F5', borderBottom: '1px solid #EDEFF2' }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Back" sx={{ color: HEADING }}>
          <Icon name="chevronLeft" size={26} color={HEADING} />
        </IconButton>
        <Typography noWrap sx={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px' }}>
          {name}
        </Typography>
        <IconButton aria-label="Download" sx={{ color: BLUE }}>
          <Icon name="download" size={22} color={BLUE} />
        </IconButton>
      </Box>

      {contract ? (
        <Box className="scroll-content" sx={{ flex: 1, overflow: 'auto', bgcolor: '#F5F5F5', p: 2 }}>
          <ContractView c={contract} />
        </Box>
      ) : (
      /* Document body — repayment schedule */
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box className="scroll-content" sx={{ flex: 1, overflow: 'auto', bgcolor: '#fff' }}>
        <Box sx={{ px: 1.5, py: 3 }}>
          {/* Title block */}
          <Box sx={{ textAlign: 'center', mb: 2.5 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: BRAND, fontFamily: 'Georgia, serif' }}>
              NongHyup Finance (Cambodia) Plc.
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: BRAND, fontFamily: 'Georgia, serif' }}>
              Customer History
            </Typography>
          </Box>

          {/* Guarantor notice */}
          {isGuaranteeDownload && (
            <Box sx={{ mb: 2.5, bgcolor: '#FBF6EC', border: '1px solid #E8C97A', borderRadius: '12px', px: 2, py: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
              <Box sx={{ mt: '1px', flexShrink: 0 }}>
                <Icon name="info" size={16} color="#C47F11" />
              </Box>
              <Typography sx={{ fontSize: 13, color: '#7A5A12', lineHeight: 1.55 }}>
                You are viewing this document as a <Box component="span" sx={{ fontWeight: 700 }}>guarantor</Box>. You are jointly responsible if the primary borrower defaults on this loan.
              </Typography>
            </Box>
          )}

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
              <Box key={r.cells[0]} sx={{ position: 'relative', display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
                {r.cells.map((c, i) => (
                  <Cell key={i} w={COL_W[i]} align={i === 0 || i === 1 ? 'left' : 'right'} paid={r.paid} last={i === r.cells.length - 1}>{c}</Cell>
                ))}
                {r.paid && (
                  <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', bgcolor: '#A0A8B5', pointerEvents: 'none' }} />
                )}
              </Box>
            ))}
            {/* Total */}
            <Box sx={{ display: 'flex' }}>
              {TOTAL_CELLS.map((c, i) => (
                <Cell key={i} w={COL_W[i]} align={i === 1 ? 'center' : 'right'} last={i === TOTAL_CELLS.length - 1} bold>{c}</Cell>
              ))}
            </Box>
          </Box>
        </Box>
        </Box>

        {/* Sticky download button */}
        <Box sx={{ flexShrink: 0, px: 3, pt: 2, pb: '36px', bgcolor: '#fff', borderTop: '1px solid #EDEFF2' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Icon name="download" size={18} color="#fff" />}
            sx={{ height: 52, borderRadius: '14px', fontSize: 15, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1e4a9a' } }}
          >
            Download PDF
          </Button>
        </Box>
      </Box>
      )}
    </Box>
  )
}

function ContractView({ c }: { c: ContractDef }) {
  return (
    <Box sx={{ position: 'relative', bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '16px', p: '24px 22px', overflow: 'hidden' }}>
      {/* Watermark */}
      <Typography sx={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%) rotate(-28deg)', fontSize: 46, fontWeight: 900, color: 'rgba(39,92,178,0.07)', letterSpacing: 4, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
        NH LOANS
      </Typography>

      {/* Issuer */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box component="svg" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" sx={{ width: 26, height: 26, flexShrink: 0 }}>
          <line x1="3" x2="21" y1="22" y2="22" />
          <line x1="6" x2="6" y1="18" y2="11" />
          <line x1="10" x2="10" y1="18" y2="11" />
          <line x1="14" x2="14" y1="18" y2="11" />
          <line x1="18" x2="18" y1="18" y2="11" />
          <polygon points="12 2 20 7 4 7" />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: HEADING }}>NH Loans</Typography>
          <Typography sx={{ fontSize: 11.5, color: '#8A94A6' }}>Licensed Microfinance Institution</Typography>
        </Box>
      </Box>
      <Box sx={{ height: 3, bgcolor: BLUE, borderRadius: '2px', mt: 1.5, mb: 2.5 }} />

      {/* Title */}
      <Typography sx={{ fontSize: 24, fontWeight: 800, color: HEADING, letterSpacing: '-0.3px' }}>{c.title}</Typography>
      <Typography sx={{ fontSize: 12, color: '#8A94A6', mt: 0.25 }}>{c.ref}</Typography>

      {/* Note */}
      {c.note && (
        <Box sx={{ display: 'flex', gap: 1, bgcolor: c.note.tone === 'warn' ? '#FBF6EC' : '#EFE7FB', borderRadius: '12px', p: '12px 14px', mt: 2.5 }}>
          <Box sx={{ mt: '1px' }}><Icon name="info" size={16} color={c.note.tone === 'warn' ? '#C47F11' : '#7A4DD6'} /></Box>
          <Typography sx={{ fontSize: 12.5, color: c.note.tone === 'warn' ? '#7A5A12' : '#5B4A8A', lineHeight: 1.5 }}>{c.note.text}</Typography>
        </Box>
      )}

      {/* Sections */}
      {c.sections.map((s) => (
        <Box key={s.label} sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.5px', color: BLUE, mb: 0.5 }}>{s.label}</Typography>
          <Box sx={{ borderTop: '1px solid #ECEFF3' }}>
            {s.rows.map(([k, v]) => (
              <Box key={k} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: '10px', borderBottom: '1px solid #F2F4F7' }}>
                <Typography sx={{ fontSize: 13.5, color: '#8A94A6', flexShrink: 0 }}>{k}</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: HEADING, textAlign: 'right' }}>{v}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}

      {/* Footer */}
      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #ECEFF3', textAlign: 'center' }}>
        <Typography sx={{ fontSize: 11, color: '#9AA3B2' }}>NH Loans Co., Ltd. · Phnom Penh, Cambodia</Typography>
        <Typography sx={{ fontSize: 11, color: '#9AA3B2', mt: 0.25 }}>Retrieved 26 May 2026.</Typography>
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

function Cell({ children, w, head, bold, paid, align = 'left', last }: { children: React.ReactNode; w: number; head?: boolean; bold?: boolean; paid?: boolean; align?: 'left' | 'right' | 'center'; last?: boolean }) {
  return (
    <Box
      sx={{
        width: w,
        flexShrink: 0,
        px: '3px',
        py: '5px',
        borderRight: last ? 'none' : `1px solid ${BORDER}`,
        textAlign: align,
      }}
    >
      <Typography sx={{ fontSize: 8.5, fontWeight: head || bold ? 700 : 400, color: head ? HEAD_ORANGE : paid ? '#A0A8B5' : HEADING, lineHeight: 1.3, textDecoration: paid ? 'line-through' : 'none' }}>
        {children}
      </Typography>
    </Box>
  )
}
