import type { ComponentType } from 'react'
import {
  CreditCard,
  MessageSquare,
  Bell,
  Eye,
  EyeOff,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calculator,
  Briefcase,
  Plane,
  Settings,
  ShieldCheck,
  CircleHelp,
  MapPin,
  Newspaper,
  MessageCircle,
  FileText,
  Info,
  Phone,
  CircleAlert,
  ArrowLeft,
  EllipsisVertical,
  Search,
  ChevronsUpDown,
  Camera,
  Image as ImageIcon,
  Upload,
  PenLine,
  Contact,
  QrCode,
  CircleCheck,
  Check,
  Lock,
  Flashlight,
  Delete,
  BellOff,
  Globe,
  Contrast,
  LogOut,
  X,
  Share,
  Download,
  Calendar,
  Trash2,
  ChevronUp,
  Sprout,
  Store,
  CircleMinus,
  Equal,
  TrendingDown,
  Banknote,
  CalendarClock,
  Layers,
  Send,
  Paperclip,
  Mic,
  Play,
  Plus,
  ScanFace,
  Fingerprint,
  Smartphone,
  Mail,
  Gauge,
  Sun,
  Moon,
  Monitor,
  RefreshCw,
  type LucideProps,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Central icon registry — the single place icons are defined for the whole app.
//
// TEMPORARY: backed by Lucide (free to ship on web, close to iOS visually).
// LATER: when the SF Symbol SVGs are exported, swap the map below to render
// those files (e.g. via a CSS-mask <span>) — no call site has to change.
// ─────────────────────────────────────────────────────────────────────────────

export type IconName =
  | 'home'
  | 'myLoan'
  | 'more'
  | 'message'
  | 'bell'
  | 'eye'
  | 'eyeOff'
  | 'clock'
  | 'chevronDown'
  | 'chevronLeft'
  | 'chevronRight'
  | 'arrowRight'
  | 'restructure'
  | 'calculator'
  | 'pay'
  | 'briefcase'
  | 'plane'
  | 'appSettings'
  | 'accountSecurity'
  | 'faq'
  | 'findBranch'
  | 'blogs'
  | 'feedback'
  | 'appPolicy'
  | 'aboutNhfc'
  | 'phone'
  | 'alert'
  | 'arrowLeft'
  | 'dotsVertical'
  | 'search'
  | 'chevronsUpDown'
  | 'camera'
  | 'image'
  | 'upload'
  | 'signature'
  | 'idCard'
  | 'qrCode'
  | 'products'
  | 'checkCircle'
  | 'check'
  | 'lock'
  | 'flashlight'
  | 'backspace'
  | 'info'
  | 'bellOff'
  | 'globe'
  | 'theme'
  | 'signOut'
  | 'close'
  | 'share'
  | 'download'
  | 'calendar'
  | 'trash'
  | 'chevronUp'
  | 'sprout'
  | 'store'
  | 'minusCircle'
  | 'equal'
  | 'trendingDown'
  | 'banknote'
  | 'calendarClock'
  | 'layers'
  | 'send'
  | 'paperclip'
  | 'mic'
  | 'play'
  | 'plus'
  | 'faceId'
  | 'fingerprint'
  | 'device'
  | 'email'
  | 'website'
  | 'pin'
  | 'gauge'
  | 'cash'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'smartphone'
  | 'redo'
  | 'telegram'

// ─── Custom filled tab-bar glyphs (brand exports, recolor via `color`) ───────
const Filled = (path: string): ComponentType<LucideProps> =>
  function FilledIcon({ size = 24, color = 'currentColor' }: LucideProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={path} fill={color} />
      </svg>
    )
  }

const HomeGlyph = Filled('M6.25651 21.0195C4.91081 21.0195 4.1237 20.2409 4.1237 18.9375V11.2018L3.24349 11.9297C3.01497 12.1243 2.7526 12.2682 2.47331 12.2682C1.8724 12.2682 1.5 11.862 1.5 11.3626C1.5 11.0918 1.62695 10.804 1.88086 10.6009L10.6999 3.19531C11.5039 2.51823 12.528 2.51823 13.3236 3.19531L17.2422 6.48763V4.99805C17.2422 4.61719 17.5046 4.37174 17.8854 4.37174H19.2057C19.5951 4.37174 19.8405 4.61719 19.8405 4.99805V8.67122L22.1341 10.5924C22.3796 10.804 22.5065 11.0664 22.5065 11.3796C22.5065 11.9212 22.0918 12.2682 21.5417 12.2682C21.2539 12.2682 20.9915 12.1243 20.763 11.9297L19.8405 11.1595V18.9375C19.8405 20.2324 19.0534 21.0195 17.7077 21.0195H6.25651ZM14.4323 13.6647V19.1322H17.1576C17.6738 19.1322 17.9616 18.8359 17.9616 18.3197V9.57682L12.418 4.92188C12.1556 4.70182 11.8594 4.70182 11.6055 4.92188L6.0026 9.61914V18.3197C6.0026 18.8359 6.29036 19.1322 6.80664 19.1322H9.57422V13.6647C9.57422 13.2669 9.83659 13.0046 10.2344 13.0046H13.7721C14.1699 13.0046 14.4323 13.2669 14.4323 13.6647Z')

const StackGlyph = Filled('M6.41895 2.75977C6.48047 1.95996 6.97266 1.52051 7.83398 1.52051H16.1572C17.0273 1.52051 17.5195 1.95996 17.5811 2.75977H6.41895ZM4.64355 5.37891C4.75781 4.51758 5.20605 4.0166 6.18164 4.0166H17.8184C18.7852 4.0166 19.2334 4.51758 19.3564 5.37891H4.64355ZM5.62793 21.7705C3.67676 21.7705 2.64844 20.751 2.64844 18.8174V9.77344C2.64844 7.83984 3.67676 6.82031 5.62793 6.82031H18.3633C20.3057 6.82031 21.3428 7.84863 21.3428 9.77344V18.8174C21.3428 20.7422 20.3057 21.7705 18.3633 21.7705H5.62793ZM5.79492 19.8193H18.1963C18.9609 19.8193 19.3828 19.4238 19.3828 18.6152V9.97559C19.3828 9.16699 18.9609 8.78027 18.1963 8.78027H5.79492C5.02148 8.78027 4.6084 9.16699 4.6084 9.97559V18.6152C4.6084 19.4238 5.02148 19.8193 5.79492 19.8193ZM15.8145 14.502C14.6543 14.502 13.7227 13.5703 13.7227 12.4189C13.7227 11.2676 14.6543 10.3359 15.8145 10.3359C16.957 10.3359 17.8799 11.2676 17.8799 12.4189C17.8799 13.5703 16.957 14.502 15.8145 14.502ZM6.75293 12.0674C6.38379 12.0674 6.10254 11.7598 6.10254 11.4082C6.10254 11.0391 6.375 10.749 6.75293 10.749H11.7891C12.1494 10.749 12.4307 11.0391 12.4307 11.4082C12.4307 11.751 12.1494 12.0674 11.7891 12.0674H6.75293ZM6.75293 14.3262C6.38379 14.3262 6.10254 14.0361 6.10254 13.6846C6.10254 13.3154 6.375 13.0166 6.75293 13.0166H10.3125C10.6816 13.0166 10.9629 13.3154 10.9629 13.6846C10.9629 14.0361 10.6729 14.3262 10.3125 14.3262H6.75293Z')

const GridGlyph = Filled('M4.62646 11.3071C3.1499 11.3071 2.42188 10.5894 2.42188 9.07178V4.77539C2.42188 3.25781 3.1499 2.54004 4.62646 2.54004H8.98438C10.4609 2.54004 11.189 3.25781 11.189 4.77539V9.07178C11.189 10.5894 10.4609 11.3071 8.98438 11.3071H4.62646ZM15.0034 11.3071C13.5166 11.3071 12.7988 10.5894 12.7988 9.07178V4.77539C12.7988 3.25781 13.5166 2.54004 15.0034 2.54004H19.3613C20.8379 2.54004 21.5659 3.25781 21.5659 4.77539V9.07178C21.5659 10.5894 20.8379 11.3071 19.3613 11.3071H15.0034ZM4.62646 21.6841C3.1499 21.6841 2.42188 20.9663 2.42188 19.4385V15.1523C2.42188 13.6348 3.1499 12.917 4.62646 12.917H8.98438C10.4609 12.917 11.189 13.6348 11.189 15.1523V19.4385C11.189 20.9663 10.4609 21.6841 8.98438 21.6841H4.62646ZM15.0034 21.6841C13.5166 21.6841 12.7988 20.9663 12.7988 19.4385V15.1523C12.7988 13.6348 13.5166 12.917 15.0034 12.917H19.3613C20.8379 12.917 21.5659 13.6348 21.5659 15.1523V19.4385C21.5659 20.9663 20.8379 21.6841 19.3613 21.6841H15.0034Z')

const MyLoanGlyph = Filled('M6.39551 3.24121C6.45703 2.44141 6.94922 2.00195 7.81055 2.00195H16.1338C17.0039 2.00195 17.4961 2.44141 17.5576 3.24121H6.39551ZM4.62012 5.86035C4.73438 4.99902 5.18262 4.49805 6.1582 4.49805H17.7949C18.7617 4.49805 19.21 4.99902 19.333 5.86035H4.62012ZM5.60449 22.252C3.65332 22.252 2.625 21.2324 2.625 19.2988V10.2549C2.625 8.32129 3.65332 7.30176 5.60449 7.30176H18.3398C20.2822 7.30176 21.3193 8.33008 21.3193 10.2549V19.2988C21.3193 21.2236 20.2822 22.252 18.3398 22.252H5.60449ZM5.77148 20.3008H7.01953C7.81055 18.6309 9.71777 17.5059 11.9766 17.5059C14.2354 17.5059 16.1514 18.6309 16.9336 20.3008H18.1729C18.9375 20.3008 19.3594 19.9053 19.3594 19.0967V10.457C19.3594 9.64844 18.9375 9.26172 18.1729 9.26172H5.77148C4.99805 9.26172 4.58496 9.64844 4.58496 10.457V19.0967C4.58496 19.9053 4.99805 20.3008 5.77148 20.3008ZM11.9766 16.293C10.4561 16.2842 9.27832 15.0098 9.26953 13.3398C9.26953 11.7578 10.4648 10.4395 11.9766 10.4395C13.4971 10.4395 14.6836 11.7578 14.6836 13.3398C14.6836 15.0098 13.5059 16.3105 11.9766 16.293Z')

// Telegram paper-plane glyph (brand mark, recolored via `color`).
const TelegramGlyph = Filled('M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.27 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z')

// Maps a semantic name → its SF Symbol (for the eventual export) → Lucide stand-in.
const REGISTRY: Record<IconName, { sf: string; cmp: ComponentType<LucideProps> }> = {
  telegram:        { sf: 'paperplane.fill',        cmp: TelegramGlyph },
  home:            { sf: 'house.fill',            cmp: HomeGlyph },
  products:        { sf: 'wallet.fill',           cmp: StackGlyph },
  myLoan:          { sf: 'creditcard.fill',       cmp: MyLoanGlyph },
  more:            { sf: 'square.grid.2x2.fill',  cmp: GridGlyph },
  message:         { sf: 'message.fill',          cmp: MessageSquare },
  bell:            { sf: 'bell.fill',             cmp: Bell },
  eye:             { sf: 'eye',                    cmp: Eye },
  eyeOff:          { sf: 'eye.slash',              cmp: EyeOff },
  clock:           { sf: 'clock',                  cmp: Clock },
  chevronDown:     { sf: 'chevron.down',           cmp: ChevronDown },
  chevronLeft:     { sf: 'chevron.left',           cmp: ChevronLeft },
  chevronRight:    { sf: 'chevron.right',          cmp: ChevronRight },
  arrowRight:      { sf: 'arrow.right',            cmp: ArrowRight },
  restructure:     { sf: 'arrow.trianglehead.2.clockwise', cmp: RefreshCw },
  redo:            { sf: 'arrow.clockwise',         cmp: RefreshCw },
  calculator:      { sf: 'function',               cmp: Calculator },
  pay:             { sf: 'creditcard',             cmp: CreditCard },
  briefcase:       { sf: 'briefcase.fill',         cmp: Briefcase },
  plane:           { sf: 'airplane',               cmp: Plane },
  appSettings:     { sf: 'gearshape.fill',         cmp: Settings },
  accountSecurity: { sf: 'lock.shield.fill',       cmp: ShieldCheck },
  faq:             { sf: 'questionmark.circle',    cmp: CircleHelp },
  findBranch:      { sf: 'mappin.and.ellipse',     cmp: MapPin },
  blogs:           { sf: 'newspaper.fill',         cmp: Newspaper },
  feedback:        { sf: 'bubble.left.fill',       cmp: MessageCircle },
  appPolicy:       { sf: 'doc.text.fill',          cmp: FileText },
  aboutNhfc:       { sf: 'info.circle.fill',       cmp: Info },
  phone:           { sf: 'phone.fill',             cmp: Phone },
  alert:           { sf: 'exclamationmark.circle.fill', cmp: CircleAlert },
  arrowLeft:       { sf: 'arrow.left',             cmp: ArrowLeft },
  dotsVertical:    { sf: 'ellipsis',               cmp: EllipsisVertical },
  search:          { sf: 'magnifyingglass',        cmp: Search },
  chevronsUpDown:  { sf: 'chevron.up.chevron.down', cmp: ChevronsUpDown },
  camera:          { sf: 'camera.fill',            cmp: Camera },
  image:           { sf: 'photo.fill',             cmp: ImageIcon },
  upload:          { sf: 'square.and.arrow.up',    cmp: Upload },
  signature:       { sf: 'signature',              cmp: PenLine },
  idCard:          { sf: 'person.text.rectangle',  cmp: Contact },
  qrCode:          { sf: 'qrcode',                  cmp: QrCode },
  checkCircle:     { sf: 'checkmark.circle',        cmp: CircleCheck },
  check:           { sf: 'checkmark',               cmp: Check },
  lock:            { sf: 'lock.fill',               cmp: Lock },
  flashlight:      { sf: 'flashlight.off.fill',     cmp: Flashlight },
  backspace:       { sf: 'delete.left',             cmp: Delete },
  info:            { sf: 'info.circle',             cmp: Info },
  bellOff:         { sf: 'bell.slash',              cmp: BellOff },
  globe:           { sf: 'globe',                   cmp: Globe },
  theme:           { sf: 'circle.lefthalf.filled',  cmp: Contrast },
  signOut:         { sf: 'rectangle.portrait.and.arrow.right', cmp: LogOut },
  close:           { sf: 'xmark',                   cmp: X },
  share:           { sf: 'square.and.arrow.up',     cmp: Share },
  download:        { sf: 'arrow.down.circle',       cmp: Download },
  calendar:        { sf: 'calendar',                cmp: Calendar },
  trash:           { sf: 'trash',                   cmp: Trash2 },
  chevronUp:       { sf: 'chevron.up',              cmp: ChevronUp },
  sprout:          { sf: 'leaf',                    cmp: Sprout },
  store:           { sf: 'storefront',              cmp: Store },
  minusCircle:     { sf: 'minus.circle',            cmp: CircleMinus },
  equal:           { sf: 'equal',                   cmp: Equal },
  trendingDown:    { sf: 'chart.line.downtrend.xyaxis', cmp: TrendingDown },
  banknote:        { sf: 'banknote',                cmp: Banknote },
  calendarClock:   { sf: 'calendar.badge.clock',    cmp: CalendarClock },
  layers:          { sf: 'square.3.layers.3d',      cmp: Layers },
  send:            { sf: 'paperplane.fill',          cmp: Send },
  paperclip:       { sf: 'paperclip',                cmp: Paperclip },
  mic:             { sf: 'mic.fill',                 cmp: Mic },
  play:            { sf: 'play.fill',                cmp: Play },
  plus:            { sf: 'plus',                     cmp: Plus },
  faceId:          { sf: 'faceid',                   cmp: ScanFace },
  fingerprint:     { sf: 'touchid',                  cmp: Fingerprint },
  device:          { sf: 'iphone',                   cmp: Smartphone },
  email:           { sf: 'envelope.fill',            cmp: Mail },
  website:         { sf: 'globe',                     cmp: Globe },
  pin:             { sf: 'asterisk',                  cmp: Lock },
  gauge:           { sf: 'gauge',                      cmp: Gauge },
  cash:            { sf: 'banknote',                   cmp: Banknote },
  sun:             { sf: 'sun.max',                    cmp: Sun },
  moon:            { sf: 'moon',                       cmp: Moon },
  monitor:         { sf: 'display',                    cmp: Monitor },
  smartphone:      { sf: 'iphone',                     cmp: Smartphone },
}

// ─── Brand glyph overrides ───────────────────────────────────────────────────
// Monochrome SF-Symbol-style exports in /assets/brand. Rendered via CSS mask so
// the `color` prop still recolors them; falls back to the Lucide cmp above if
// the file fails to load. (Full-color logos like socials are NOT listed here —
// render those as a plain <img>.)
const BRAND_DIR = '/assets/brand/'
const BRAND: Partial<Record<IconName, string>> = {
  message:         'ico_chat.svg',
  accountSecurity: 'Security.svg',
  appPolicy:       'AppPolicy.svg',
  faq:             'FAQ.svg',
  feedback:        'Feedback_hand.svg',
  blogs:           'Blog.svg',
  calculator:      'Calculator.svg',
  findBranch:      'Map.svg',
  gauge:           'score.svg',
  theme:           'Theme.svg',
  bell:            'Notification.svg',
  bellOff:         'Mute.svg',
  globe:           'Language.svg',
  phone:           'ico_call.svg',
  faceId:          'FaceID.svg',
  fingerprint:     'FingerPrint.svg',
  device:          'Device.svg',
  email:           'Email.svg',
  website:         'Website.svg',
  pin:             'PIN.svg',
  cash:            'ico_cash.svg',
  restructure:     'restructure.svg',
  aboutNhfc:       'NH.svg',
}

export interface IconProps {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
}

export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 2 }: IconProps) {
  const brand = BRAND[name]
  if (brand) {
    const url = `url(${BRAND_DIR}${encodeURI(brand)})`
    return (
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          flexShrink: 0,
          backgroundColor: color,
          WebkitMaskImage: url,
          maskImage: url,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
      />
    )
  }
  const C = REGISTRY[name].cmp
  return <C size={size} color={color} strokeWidth={strokeWidth} absoluteStrokeWidth />
}
