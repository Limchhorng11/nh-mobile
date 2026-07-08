import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Icon } from './Icon'
import { AssetImg, BANKS } from './home/media'

// ─────────────────────────────────────────────────────────────────────────────
// Pay loan — bottom sheet opened from any active-loan "Pay" button.
// Lists payment methods (KHQR + partner banks); selecting KHQR reveals the
// scan-to-pay QR card. Bank logos come from /assets/banks.
// ─────────────────────────────────────────────────────────────────────────────
const BLUE = '#275CB2'
const HEADING = '#0B0F1A'
const MUTED = '#8A94A6'

type MethodId = 'khqr' | 'aba' | 'acleda' | 'ppcb' | 'wing'

type Method = { id: MethodId; label: string; icon: string }

const METHODS: Method[] = [
  { id: 'khqr', label: 'បង់តាម KHQR', icon: BANKS.khqr },
  { id: 'aba', label: 'ធនាគារ អេប៊ីអេ', icon: BANKS.aba },
  { id: 'acleda', label: 'ធនាគារ អេស៊ីលីដ', icon: BANKS.acleda },
  { id: 'ppcb', label: 'ធនាគារ ភីភីស៊ីប៊ី', icon: BANKS.ppcb },
  { id: 'wing', label: 'ធនាគារ វីង', icon: BANKS.wing },
]

const KH = `'Noto Sans Khmer', sans-serif`

const KHR_RATE = 4100 // 1 USD ≈ 4,100 ៛

export default function PayLoanSheet({ open, onClose, overdue = false, currency = 'USD' }: { open: boolean; onClose: () => void; overdue?: boolean; currency?: 'USD' | 'KHR' }) {
  const isKhr = currency === 'KHR'
  const symbol = isKhr ? '៛' : '$'
  const INSTALLMENT = isKhr ? Math.round(320 * KHR_RATE).toLocaleString('en-US') : '320.00'
  const PENALTY = isKhr ? Math.round(5 * KHR_RATE).toLocaleString('en-US') : '5.00'
  const FULL = overdue
    ? (isKhr ? Math.round(325 * KHR_RATE).toLocaleString('en-US') : '325.00')
    : INSTALLMENT
  const [selected, setSelected] = useState<MethodId | null>(null)
  const [amount, setAmount] = useState('')
  const [fulfilled, setFulfilled] = useState(false)

  useEffect(() => {
    if (open) {
      setSelected(null)
      setAmount('')
      setFulfilled(false)
    }
  }, [open])

  if (!open) return null

  return (
    <Box sx={{ position: 'absolute', inset: 0, zIndex: 1300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(15,20,30,0.45)',
          animation: 'payFade 0.2s ease-out',
          '@keyframes payFade': { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
      />

      {/* Sheet */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#fff',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          maxHeight: '92%',
          display: 'flex',
          flexDirection: 'column',
          animation: 'paySlide 0.28s cubic-bezier(0.22,1,0.36,1)',
          '@keyframes paySlide': { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        }}
      >
        {/* Grab handle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.25 }}>
          <Box sx={{ width: 40, height: 5, borderRadius: 3, bgcolor: '#D5D9E0' }} />
        </Box>

        {/* Header */}
        <Box sx={{ px: 3, pt: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 26, fontWeight: 800, color: HEADING, letterSpacing: '-0.5px' }}>Pay now</Typography>
          <IconButton onClick={onClose} aria-label="Close" sx={{ bgcolor: '#fff', width: 34, height: 34, mt: 0.5, '&:hover': { bgcolor: '#EDEFF2' } }}>
            <Icon name="close" size={20} color="#0B0F1A" />
          </IconButton>
        </Box>

        {/* Scrollable body */}
        <Box sx={{ px: 3, pt: 1, pb: 2, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {/* Amount */}
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.7px', color: MUTED, mb: 1 }}>
            AMOUNT
          </Typography>

          {/* Hint text + shortcut: changes after Fulfill is tapped */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1, px: 0.5 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 15, color: fulfilled ? BLUE : MUTED, fontWeight: fulfilled ? 700 : 500 }}>
                {fulfilled
                  ? `You will pay ${symbol}${FULL}`
                  : `Installment due ${symbol}${INSTALLMENT}`
                }
              </Typography>
              {overdue && (
                <Typography sx={{ fontSize: 12, color: '#E07A1A', fontWeight: 600, mt: 0.25 }}>
                  + {symbol}{PENALTY} penalty included
                </Typography>
              )}
            </Box>
            <Box
              role="button"
              onClick={() => {
                setAmount(FULL)
                setFulfilled(true)
              }}
              sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', bgcolor: '#EEF3FC', borderRadius: '8px', px: '10px', py: '6px', cursor: 'pointer', '&:active': { bgcolor: '#DCE9FB' } }}
            >
              <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: BLUE, whiteSpace: 'nowrap' }}>
                Pay full installment
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, border: `1.5px solid ${amount ? BLUE : '#E8EAEE'}`, borderRadius: '14px', px: 2, height: 60, mb: 2.5, transition: 'border-color 0.15s' }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: HEADING }}>{symbol}</Typography>
            <Box
              component="input"
              type="text"
              inputMode="decimal"
              placeholder={isKhr ? '0' : '0.00'}
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              sx={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', bgcolor: 'transparent', fontFamily: 'inherit', fontSize: 22, fontWeight: 800, color: HEADING, '&::placeholder': { color: '#C9D2DE' } }}
            />
          </Box>

          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.7px', color: MUTED, mb: 1 }}>
            PAYMENT METHOD
          </Typography>

          <Box sx={{ bgcolor: '#fff', border: '1px solid #E8EAEE', borderRadius: '14px', overflow: 'hidden' }}>
            {METHODS.map((m, i) => {
              const isSelected = selected === m.id
              const showQr = m.id === 'khqr' && isSelected
              return (
                <Box key={m.id}>
                  <MethodRow
                    method={m}
                    selected={isSelected}
                    divider={i < METHODS.length - 1}
                    onSelect={() => setSelected(m.id)}
                  />
                  {showQr && <KhqrPanel />}
                </Box>
              )
            })}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ px: 3, pt: 1.5, pb: '34px', bgcolor: '#fff' }}>
          {selected === 'khqr' ? (
            /* KHQR — always show Save */
            <Button
              variant="contained"
              fullWidth
              onClick={onClose}
              startIcon={<Icon name="download" size={18} />}
              sx={{ height: 52, borderRadius: '14px', p: '10px', fontSize: 16, fontWeight: 700, bgcolor: BLUE, '&:hover': { bgcolor: '#1F4F9E' } }}
            >
              Save
            </Button>
          ) : (
            /* Bank — always visible, enabled only after bank selected + fulfilled */
            <Button
              variant="contained"
              fullWidth
              disabled={!selected || !fulfilled}
              onClick={onClose}
              startIcon={<Icon name="cash" size={18} />}
              sx={{
                height: 52,
                borderRadius: '14px',
                p: '10px',
                fontSize: 16,
                fontWeight: 700,
                bgcolor: BLUE,
                '&:hover': { bgcolor: '#1F4F9E' },
                '&.Mui-disabled': { bgcolor: '#A9C3EC', color: '#fff' },
              }}
            >
              {fulfilled && amount ? `Pay ${symbol}${amount}` : 'Pay Now'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

function MethodRow({ method, selected, divider, onSelect }: { method: Method; selected: boolean; divider?: boolean; onSelect: () => void }) {
  return (
    <Box
      onClick={onSelect}
      role="button"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: '14px',
        cursor: 'pointer',
        borderBottom: divider ? '1px solid #F1F4F8' : 'none',
        '&:active': { bgcolor: '#F8FAFC' },
      }}
    >
      <Box sx={{ width: 30, height: 30, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AssetImg
          src={method.icon}
          alt=""
          sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          fallback={<Box sx={{ width: 26, height: 26, borderRadius: '6px', bgcolor: '#E7ECF2' }} />}
        />
      </Box>
      <Typography sx={{ flex: 1, minWidth: 0, fontFamily: KH, fontSize: 15, fontWeight: 600, color: HEADING }}>
        {method.label}
      </Typography>
      <Radio selected={selected} />
    </Box>
  )
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <Box
      sx={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        flexShrink: 0,
        border: selected ? `6px solid ${BLUE}` : '2px solid #CBD2DC',
        bgcolor: '#fff',
        transition: 'border 0.15s',
      }}
    />
  )
}

// ─── KHQR scan-to-pay panel ──────────────────────────────────────────────────
function KhqrPanel() {
  return (
    <Box sx={{ px: 2, pb: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: HEADING }}>Scan to pay</Typography>

      {/* KHQR card artwork */}
      <AssetImg
        src={BANKS.khqrCard}
        alt="KHQR — NongHyup M.F.I"
        sx={{ width: 200, height: 'auto', display: 'block' }}
        fallback={<Box sx={{ width: 200, aspectRatio: '189 / 259', borderRadius: '12px', bgcolor: '#9C1820' }} />}
      />

      {/* Share / Download — generous tap targets (≥44px high) */}
      <Box sx={{ display: 'flex', gap: 1.5, pt: 0.5, width: '100%' }}>
        <QrAction icon="share" label="Share" />
        <QrAction icon="download" label="Download QR" />
      </Box>
    </Box>
  )
}

function QrAction({ icon, label }: { icon: 'share' | 'download'; label: string }) {
  return (
    <Box
      role="button"
      sx={{
        flex: 1,
        minHeight: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        px: 2,
        borderRadius: '12px',
        bgcolor: '#EAF1FC',
        cursor: 'pointer',
        transition: 'background 0.12s',
        '&:hover': { bgcolor: '#DCE9FB' },
        '&:active': { bgcolor: '#CFE0F8' },
      }}
    >
      <Icon name={icon} size={22} color={BLUE} />
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: BLUE }}>{label}</Typography>
    </Box>
  )
}
