import { ReactNode, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon, type IconName } from '../components/Icon'
import { MwlHeader, BottomSheet, BLUE } from './mwl/MwlParts'
import { AssetImg, BANKS } from '../components/home/media'
import { CurrencyToggle } from '../components/home/HomeParts'
import { useT, useTd } from '../i18n/LangContext'

// ─── Advance account movement ledger ─────────────────────────────────────────
type Move = { type: 'Top Up' | 'Settlement'; date: string; sign: '+' | '-'; amount: string; balance: string; beginning: string; ref: string }
const MOVEMENTS: Move[] = [
  { type: 'Top Up',    date: '18 Jun 2026', sign: '+', amount: '$250.00',    balance: '$350.00',    beginning: '$100.00',    ref: 'ADV0005' },
  { type: 'Settlement',date: '20 May 2026', sign: '-', amount: '៛1,107,000', balance: '៛1,393,000', beginning: '៛2,500,000', ref: 'ADV0004' },
  { type: 'Top Up',    date: '15 May 2026', sign: '+', amount: '៛2,500,000', balance: '៛2,500,000', beginning: '—',          ref: 'ADV0003' },
  { type: 'Settlement',date: '20 Apr 2026', sign: '-', amount: '$350.00',    balance: '$100.00',    beginning: '$450.00',    ref: 'ADV0002' },
  { type: 'Top Up',    date: '05 Apr 2026', sign: '+', amount: '$450.00',    balance: '$450.00',    beginning: '—',          ref: 'ADV0001' },
]

// ─── Top-up payment methods ──────────────────────────────────────────────────
type Method = { id: string; name: string; logo: string }
const METHODS: Method[] = [
  { id: 'khqr', name: 'បង់តាម KHQR', logo: '/assets/banks/ico_khqr.png' },
  { id: 'aba', name: 'ធនាគារ អេប៊ីអេ', logo: '/assets/banks/ABA.png' },
  { id: 'acleda', name: 'ធនាគារ អេស៊ីលីដា', logo: '/assets/banks/Aceleda.png' },
  { id: 'ppcb', name: 'ធនាគារ ភីភីស៊ីប៊ី', logo: '/assets/banks/PPCB.png' },
  { id: 'wing', name: 'ធនាគារ វីង', logo: '/assets/banks/Wing.png' },
]

const KHR_RATE = 4100 // 1 USD ≈ 4,100 ៛
const ACCOUNTS = { USD: '026-00052501', KHR: '026-00052502' } as const

// Converts a "18 Jun 2026" style date to "18/06/26" (DD/MM/YY).
const MONTHS: Record<string, string> = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
}
function toDDMMYY(date: string): string {
  const [day, mon, year] = date.split(' ')
  const mm = MONTHS[mon] ?? mon
  return `${day.padStart(2, '0')}/${mm}/${year.slice(-2)}`
}

export default function AdvanceAccountScreen() {
  const navigate = useNavigate()
  const t = useT()
  const td = useTd()
  const [params] = useSearchParams()
  // Sample 2 (?v=2) opens the Top-up sheet by default for review.
  const [topUpOpen, setTopUpOpen] = useState((params.get('v') ?? '1') === '2')
  const [detailMove, setDetailMove] = useState<Move | null>(null)
  const [showAllMoves, setShowAllMoves] = useState(false)
  const [method, setMethod] = useState('ppcb')
  const [amount, setAmount] = useState('')
  const [cur, setCur] = useState<'USD' | 'KHR'>('USD')
  const switchCur = (next: 'USD' | 'KHR') => {
    if (next === cur) return
    const n = parseFloat(amount.replace(/,/g, '')) || 0
    setAmount(next === 'KHR' ? Math.round(n * KHR_RATE).toLocaleString('en-US') : (n / KHR_RATE).toFixed(2))
    setCur(next)
  }
  const symbol = cur === 'USD' ? '$' : '៛'

  return (
    <Box className="screen-enter" sx={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      <Box className="scroll-content" sx={{ flex: 1 }}>
        <MwlHeader onBack={() => navigate(-1)} kebab={false} />
        <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', px: 3, mt: 0.5, mb: 2 }}>
          {t('advanceAccount')}
        </Typography>

        <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Balance + Total IN/OUT — one unified card */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', border: '1px solid #ECEFF3', boxShadow: '0 1px 3px rgba(16,24,40,0.04)', overflow: 'hidden' }}>
            {/* Balance section label */}
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1.25 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#8A94A6', letterSpacing: '0.5px' }}>{t('balanceLabel')}</Typography>
            </Box>
            {/* USD row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pb: 1 }}>
              <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', lineHeight: 1.1 }}>$120.00</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.2px' }}>USD · {ACCOUNTS['USD']}</Typography>
            </Box>
            {/* KHR row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pb: 2 }}>
              <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px', lineHeight: 1.1 }}>៛492,000</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.2px' }}>KHR · {ACCOUNTS['KHR']}</Typography>
            </Box>
            {/* Top-up button — full width */}
            <Box sx={{ px: 2.5, pb: 2.5 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setTopUpOpen(true)}
                startIcon={<Icon name="plus" size={18} />}
                sx={{ height: 48, borderRadius: '12px', fontSize: 15, fontWeight: 700 }}
              >
                {t('topUpAdvance')}
              </Button>
            </Box>
          </Box>

          {/* Linked Loans */}
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', border: '1px solid #ECEFF3', boxShadow: '0 1px 3px rgba(16,24,40,0.04)', overflow: 'hidden' }}>
            <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6' }}>{t('linkedLoans')}</Typography>
            </Box>
            {[
              { title: 'Migrant Worker Loan', icon: 'plane' as IconName, account: '026-01285956' },
              { title: 'Micro Loan', icon: 'sprout' as IconName, account: '026-01285959' },
              { title: 'Staff Loan', icon: 'idCard' as IconName, account: '026-01285963' },
            ].map((l) => (
              <Box
                key={l.title}
                role="button"
                onClick={() => navigate(`/my-loan-detail?product=${encodeURIComponent(l.title)}`)}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.5, py: '12px', borderTop: '1px solid #F1F4F8', cursor: 'pointer', '&:active': { bgcolor: '#F8FAFC' } }}
              >
                <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: '#EEF1FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={l.icon} size={17} color={BLUE} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: '#0B0F1A' }} noWrap>{td(l.title)}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#8A94A6', letterSpacing: '0.3px' }} noWrap>{l.account}</Typography>
                </Box>
                <Icon name="chevronRight" size={16} color="#C9D2DE" />
              </Box>
            ))}
          </Box>

          {/* Movement */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#0B0F1A' }}>{t('movement')}</Typography>
              <Typography role="button" onClick={() => navigate('/advance-history-preview')} sx={{ fontSize: 14, fontWeight: 700, color: BLUE, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
                {t('download')}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '12px', overflow: 'hidden' }}>
              {/* Column header */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1.45fr 1.05fr 1.05fr 0.85fr', alignItems: 'center', px: '14px', py: '9px', bgcolor: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', color: '#8A94A6' }}>{t('thDate')}</Typography>
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', color: '#8A94A6', textAlign: 'right' }}>{t('thAmountCol')}</Typography>
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', color: '#8A94A6', textAlign: 'right' }}>{t('thBalanceCol')}</Typography>
                <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', color: '#8A94A6', textAlign: 'right' }}>{t('thView')}</Typography>
              </Box>
              {(showAllMoves ? MOVEMENTS : MOVEMENTS.slice(0, 3)).map((m, i, arr) => (
                <MovementRow key={i} m={m} last={i === arr.length - 1} onView={() => setDetailMove(m)} />
              ))}
              {/* See more / See less */}
              <Box
                role="button"
                onClick={() => setShowAllMoves(v => !v)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, py: '11px', borderTop: '1px solid #F1F4F8', cursor: 'pointer', '&:active': { opacity: 0.6 } }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: BLUE }}>
                  {showAllMoves ? t('seeLess') : t('seeMore')}
                </Typography>
                <Icon name={showAllMoves ? 'chevronUp' : 'chevronDown'} size={15} color={BLUE} />
              </Box>
            </Box>
          </Box>

          {/* Hint */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 2, px: 0.5 }}>
            <Icon name="info" size={16} color="#8A94A6" />
            <Typography sx={{ fontSize: 13, color: '#8A94A6', lineHeight: 1.5 }}>
              {t('advanceHint')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Top-up Advance bottom sheet */}
      <BottomSheet open={topUpOpen} onClose={() => setTopUpOpen(false)}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.5px' }}>
            {t('topUpAdvance')}
          </Typography>
          <IconButton
            onClick={() => setTopUpOpen(false)}
            aria-label="Close"
            sx={{ bgcolor: '#fff', border: '1px solid #ECEFF3', width: 40, height: 40, color: '#0B0F1A', boxShadow: '0 1px 2px rgba(16,24,40,0.05)', '&:hover': { bgcolor: '#F4F6F9' } }}
          >
            <Icon name="close" size={20} color="#0B0F1A" />
          </IconButton>
        </Box>

        {/* Amount + currency toggle */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6' }}>{t('thAmountCol')}</Typography>
            <Box sx={{ display: 'flex', bgcolor: '#EFF1F4', borderRadius: '999px', p: '3px' }}>
              {(['USD', 'KHR'] as const).map((c) => (
                <Box key={c} role="button" onClick={() => switchCur(c)} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: '5px', borderRadius: '999px', cursor: 'pointer', bgcolor: cur === c ? '#fff' : 'transparent', boxShadow: cur === c ? '0 1px 3px rgba(0,0,0,0.12)' : 'none' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: cur === c ? '#0B0F1A' : '#9AA3B2' }}>{c}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, border: '1px solid #E8EAEE', borderRadius: '14px', px: 2, height: 56, bgcolor: '#fff' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: '#0B0F1A' }}>{symbol}</Typography>
            <Box component="input" value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)} inputMode="decimal" placeholder="0.00" sx={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', bgcolor: 'transparent', fontFamily: 'inherit', fontSize: 22, fontWeight: 800, color: '#0B0F1A', '&::placeholder': { color: '#C2C8D0' } }} />
          </Box>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#8A94A6', mt: 0.75, pl: 0.5 }}>
            {t('minimum')} {cur === 'USD' ? '$1.00' : '៛4,100'}
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: '#8A94A6', mb: 1.25 }}>
            {t('paymentMethod')}
          </Typography>
          <Box sx={{ bgcolor: '#fff', borderRadius: '14px', border: '1px solid #ECEFF3', overflow: 'hidden' }}>
            {METHODS.map((m, i) => {
              const active = method === m.id
              const showQr = m.id === 'khqr' && active
              return (
                <Box key={m.id}>
                  <Box
                    onClick={() => setMethod(m.id)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, cursor: 'pointer', borderTop: i > 0 ? '1px solid #F1F4F8' : 'none' }}
                  >
                    <LogoTile logo={m.logo} alt={m.name} />
                    <Typography sx={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 700, color: '#0B0F1A' }}>{m.name}</Typography>
                    <Radio active={active} />
                  </Box>
                  {showQr && (
                    <Box sx={{ px: 2, pb: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, borderTop: '1px solid #F1F4F8' }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0B0F1A' }}>{t('scanToPay')}</Typography>
                      <AssetImg
                        src={BANKS.khqrCard}
                        alt="KHQR — NongHyup M.F.I"
                        sx={{ width: 200, height: 'auto', display: 'block' }}
                        fallback={<Box sx={{ width: 200, aspectRatio: '189 / 259', borderRadius: '12px', bgcolor: '#9C1820' }} />}
                      />
                      <Box sx={{ display: 'flex', gap: 1.5, pt: 0.5, width: '100%' }}>
                        {(['share', 'download'] as const).map((ic, idx) => (
                          <Box key={ic} role="button" sx={{ flex: 1, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, px: 2, borderRadius: '12px', bgcolor: '#EAF1FC', cursor: 'pointer', '&:active': { bgcolor: '#CFE0F8' } }}>
                            <Icon name={ic} size={22} color={BLUE} />
                            <Typography sx={{ fontSize: 15, fontWeight: 700, color: BLUE }}>{idx === 0 ? t('share') : t('downloadQr')}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={() => setTopUpOpen(false)}
          startIcon={<Icon name="cash" size={16} />}
          sx={{ height: 56, borderRadius: '14px', p: '10px', fontSize: 17, fontWeight: 700 }}
        >
          {amount ? `${t('topUp')} ${symbol}${amount}` : t('topUp')}
        </Button>
      </BottomSheet>

      {/* Movement detail sheet */}
      <BottomSheet open={!!detailMove} onClose={() => setDetailMove(null)}>
        {detailMove && <MoveDetailContent m={detailMove} onClose={() => setDetailMove(null)} />}
      </BottomSheet>
    </Box>
  )
}

function MovementRow({ m, last, onView }: { m: Move; last?: boolean; onView?: () => void }) {
  const t = useT()
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1.45fr 1.05fr 1.05fr 0.85fr', alignItems: 'center', px: '14px', py: '11px', borderBottom: last ? 'none' : '1px solid #F1F4F8' }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: '#0B0F1A' }} noWrap>{toDDMMYY(m.date)}</Typography>
      </Box>
      <Typography sx={{ fontSize: 12, fontWeight: 800, textAlign: 'right', whiteSpace: 'nowrap', color: m.sign === '+' ? '#1A9E5C' : '#D63B3B' }}>
        {m.sign === '+' ? '+' : '−'}{m.amount}
      </Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap', color: '#0B0F1A' }}>{m.balance}</Typography>
      <Box role="button" onClick={onView} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.3, cursor: 'pointer', '&:active': { opacity: 0.6 } }}>
        <Box component="svg" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" sx={{ width: 12, height: 12 }}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </Box>
        <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: BLUE }}>{t('view')}</Typography>
      </Box>
    </Box>
  )
}

function LogoTile({ logo, alt }: { logo: string; alt: string }) {
  return (
    <Box
      component="img"
      src={logo}
      alt={alt}
      sx={{ width: 44, height: 44, borderRadius: '12px', flexShrink: 0, display: 'block', objectFit: 'cover', bgcolor: '#F5F5F5', border: '1px solid #F1F4F8' }}
    />
  )
}

function Radio({ active }: { active: boolean }) {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        flexShrink: 0,
        border: active ? `2px solid ${BLUE}` : '2px solid #C9D2DE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: active ? 'none' : '0 1px 2px rgba(16,24,40,0.06)',
      }}
    >
      {active && <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: BLUE }} />}
    </Box>
  )
}

function MoveDetailContent({ m, onClose }: { m: Move; onClose: () => void }) {
  const navigate = useNavigate()
  const t = useT()
  const td = useTd()
  const isTopUp = m.type === 'Top Up'
  const currency = m.amount.startsWith('$') ? 'USD' : 'KHR'
  const subtitle = isTopUp ? `${t('topUpAdvance')} · ${currency}` : `${td('Settlement')} · ${currency}`
  const rows: [string, string, boolean?][] = [
    [t('dateLabel'), m.date],
    [t('reference'), m.ref],
    [t('fromAccount'), isTopUp ? '—' : t('advanceAccount')],
    [t('toAccount'), isTopUp ? '026-00052501' : '—'],
    [t('beginningBalance'), m.beginning],
    [t('amountLabel'), (m.sign === '+' ? '+' : '−') + m.amount, true],
    [t('endingBalance'), m.balance],
  ]
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Title row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box>
          <Typography sx={{ fontSize: 26, fontWeight: 800, color: '#0B0F1A', letterSpacing: '-0.4px', lineHeight: 1.15 }}>{td(m.type)}</Typography>
          <Typography sx={{ fontSize: 13, color: '#8A94A6', mt: 0.4 }}>{subtitle}</Typography>
        </Box>
        <Box sx={{ px: '10px', py: '4px', borderRadius: '999px', bgcolor: isTopUp ? '#D9F0E4' : '#FCE8E8', flexShrink: 0, mt: 0.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: isTopUp ? '#1A7A48' : '#C0392B' }}>
            {isTopUp ? t('credit') : t('debit')}
          </Typography>
        </Box>
      </Box>

      {/* Detail card */}
      <Box sx={{ bgcolor: '#F8F9FB', borderRadius: '14px', overflow: 'hidden' }}>
        {rows.map(([label, value, isAmt], i) => {
          const isEnding = label === t('endingBalance')
          const amtColor = m.sign === '+' ? '#1A9E5C' : '#D63B3B'
          const isClickableAmt = isAmt && !isTopUp
          return (
            <Box
              key={label}
              role={isClickableAmt ? 'button' : undefined}
              onClick={isClickableAmt ? () => navigate('/my-loan-detail') : undefined}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: '11px', borderBottom: i < rows.length - 1 ? '1px solid #ECEFF3' : 'none', cursor: isClickableAmt ? 'pointer' : 'default', '&:active': isClickableAmt ? { bgcolor: '#F0F2F5' } : {} }}
            >
              <Typography sx={{ fontSize: 13.5, color: '#8A94A6', fontWeight: isEnding ? 700 : 400 }}>{label}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: isEnding ? 800 : isAmt ? 800 : 600, color: isEnding ? BLUE : isAmt ? amtColor : '#0B0F1A' }}>
                  {value}
                </Typography>
                {isClickableAmt && (
                  <Box component="svg" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" sx={{ width: 14, height: 14, flexShrink: 0 }}>
                    <path d="m9 18 6-6-6-6" />
                  </Box>
                )}
              </Box>
            </Box>
          )
        })}
      </Box>

      {/* Download button */}
      <Button
        variant="contained"
        fullWidth
        startIcon={<Icon name="download" size={18} />}
        onClick={() => navigate(`/advance-history-preview?ref=${m.ref}`)}
        sx={{ height: 54, borderRadius: '14px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
      >
        {t('downloadRecord')}
      </Button>

      <Typography role="button" onClick={onClose} sx={{ textAlign: 'center', fontSize: 14, color: '#8A94A6', cursor: 'pointer', pb: 0.5, '&:active': { opacity: 0.6 } }}>
        {t('close')}
      </Typography>
    </Box>
  )
}
