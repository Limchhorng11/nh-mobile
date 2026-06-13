// ─────────────────────────────────────────────────────────────────────────────
// Flow-screen registry — the single source of truth for the workspace.
//
//   • Sidebar  → lists every flow screen, grouped by `section`.
//   • Top bar  → switches between a screen's `samples` (e.g. with / without
//                bottom navigation).
//
// Add a new prototype screen by appending an entry here and a matching <Route>
// in AppRouter. The chrome (sidebar + sample switcher) updates automatically.
// ─────────────────────────────────────────────────────────────────────────────

export interface FlowSample {
  /** Variant id — carried in the URL as `?v=` */
  v: string
  /** Label shown in the top-bar pill */
  label: string
}

import type { UserFlow } from './FlowContext'

export interface FlowScreen {
  /** Route segment, e.g. "home" → /home */
  id: string
  /** Name shown in the sidebar */
  name: string
  /** Sidebar group heading */
  section: string
  /** Sample variants offered in the top bar (first = default) */
  samples: FlowSample[]
  /** User flows this screen belongs to (omit = visible in every flow) */
  flows?: UserFlow[]
  /** Per-flow sidebar name override (falls back to `name`) */
  flowNames?: Partial<Record<UserFlow, string>>
  /** Global samples this screen appears in (omit = visible in every sample) */
  inSamples?: ('1' | '2')[]
}

export const SCREENS: FlowScreen[] = [
  {
    id: 'flow-select',
    name: 'Select User Flow',
    section: 'LAUNCH',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'splash',
    name: 'Splash',
    section: 'LAUNCH',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'home',
    name: 'Home (not yet login)',
    section: 'HOME',
    samples: [{ v: '1', label: 'Sample 1' }],
    // Visitor sees the "not yet login" home; signed-in flows see a single "Home".
    flowNames: { 'New User': 'Home', Applicant: 'Home', Borrower: 'Home' },
    // The nav-less Home is the Sample 2 experience only.
    inSamples: ['2'],
  },
  {
    id: 'home-app',
    name: 'Home (logged in)',
    section: 'HOME',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor'],
    inSamples: ['2'],
  },
  {
    id: 'more',
    name: 'More menu',
    section: 'MORE',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'products',
    name: 'Products',
    section: 'PRODUCTS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'product-detail',
    name: 'Loan Detail',
    section: 'PRODUCTS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'document-preview',
    name: 'Document Preview',
    section: 'PRODUCTS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'all-loan',
    name: 'All Loan',
    section: 'PRODUCTS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'calculator',
    name: 'Loan Calculator',
    section: 'TOOLS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'my-loan',
    name: 'My Loans',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'my-loan-detail',
    name: 'Loan Detail',
    section: 'MY LOAN',
    samples: [
      { v: '1', label: '2 Segments' },
      { v: '2', label: 'One Page' },
    ],
    flows: ['Applicant', 'Borrower'],
  },
  {
    id: 'my-loan-review',
    name: 'In Review Detail',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower'],
  },
  {
    id: 'my-loan-complete',
    name: 'Completed Loan Detail',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower'],
  },
  {
    id: 'early-payoff',
    name: 'Early Payoff',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower'],
  },
  {
    id: 'early-payoff-pin',
    name: 'Early Payoff · Enter PIN',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower'],
  },
  {
    id: 'early-payoff-success',
    name: 'Early Payoff · Submitted',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower'],
  },
  {
    id: 'advance',
    name: 'Advance Account',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Borrower'],
  },
  {
    id: 'restructure-info',
    name: '1 · Your information',
    section: 'REQUEST RESTRUCTURE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Borrower'],
  },
  {
    id: 'restructure-conditions',
    name: '2 · Your current loan',
    section: 'REQUEST RESTRUCTURE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Borrower'],
  },
  {
    id: 'restructure-consent',
    name: '3 · Credit bureau consent',
    section: 'REQUEST RESTRUCTURE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Borrower'],
  },
  {
    id: 'restructure-success',
    name: 'Request submitted',
    section: 'REQUEST RESTRUCTURE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Borrower'],
  },
  {
    id: 'sign-up',
    name: 'Enter Phone Number',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor'],
  },
  {
    id: 'qr-signin',
    name: 'Sign in with QR',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor'],
  },
  {
    id: 'otp',
    name: 'Verify your number',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor'],
  },
  {
    id: 'create-pin',
    name: 'Create PIN',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor'],
  },
  {
    id: 'confirm-pin',
    name: 'Confirm PIN',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor'],
  },
  {
    id: 'mwl-about',
    name: '1 · Tell us about you',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'mwl-loan',
    name: '2 · Loan request',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'mwl-guarantor',
    name: '3 · Add your guarantor',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'mwl-review',
    name: 'Review application',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'mwl-success',
    name: 'Application received',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'nonmwl-about',
    name: '1 · Tell us about you',
    section: 'APPLY LOAN NON-MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'nonmwl-loan',
    name: '2 · Loan request',
    section: 'APPLY LOAN NON-MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'nonmwl-review',
    name: 'Review application',
    section: 'APPLY LOAN NON-MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'nonmwl-success',
    name: 'Application received',
    section: 'APPLY LOAN NON-MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'chat',
    name: 'Conversations',
    section: 'SUPPORT',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'chat-thread',
    name: 'Chat thread',
    section: 'SUPPORT',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'chat-new',
    name: 'New message',
    section: 'SUPPORT',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'request-consult',
    name: 'Request consultation',
    section: 'SUPPORT',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'consult-success',
    name: 'Request received',
    section: 'SUPPORT',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'document-view',
    name: 'Document viewer',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower'],
  },
  {
    id: 'profile',
    name: 'Profile',
    section: 'PROFILE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'profile-edit',
    name: 'Edit profile',
    section: 'PROFILE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'profile-documents',
    name: 'My documents',
    section: 'PROFILE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['New User', 'Applicant', 'Borrower'],
  },
  {
    id: 'notifications',
    name: 'Notifications',
    section: 'NOTIFICATIONS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'credit-score',
    name: 'Credit Score',
    section: 'TOOLS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'announcement',
    name: 'Announcement detail',
    section: 'NOTIFICATIONS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'settings',
    name: 'Settings',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'account-security',
    name: 'Account security',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'app-settings',
    name: 'App settings',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'branch-locator',
    name: 'Find a branch',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'blogs',
    name: 'Blogs & Education',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'send-feedback',
    name: 'Send feedback',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'feedback-history',
    name: 'Feedback history',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'about',
    name: 'About NHFC',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'terms-privacy',
    name: 'Terms & Privacy',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'faq',
    name: 'FAQ',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
]

export const DEFAULT_SCREEN = SCREENS[0]

export function findScreen(id: string | undefined): FlowScreen | undefined {
  return SCREENS.find((s) => s.id === id)
}

// Screens visible for a given user flow + global sample.
// (no `flows` field = visible in all flows; no `inSamples` = visible in all samples)
export function screensForFlow(flow: UserFlow, sample?: '1' | '2'): FlowScreen[] {
  return SCREENS.filter(
    (s) =>
      (!s.flows || s.flows.includes(flow)) &&
      (!sample || !s.inSamples || s.inSamples.includes(sample)),
  )
}
