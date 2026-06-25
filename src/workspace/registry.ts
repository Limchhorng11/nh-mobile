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
    id: 'welcome',
    name: 'Welcome',
    section: 'LAUNCH',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor', 'Guarantee', 'Staff'],
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
    id: 'calculator-schedule',
    name: 'Repayment Schedule',
    section: 'TOOLS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
  {
    id: 'my-loan',
    name: 'My Loans',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor', 'Applicant', 'Borrower', 'Co-Borrower', 'Guarantee', 'Staff'],
  },
  {
    id: 'my-loan-detail',
    name: 'Loan Detail',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower', 'Guarantee'],
  },
  {
    id: 'my-loan-review',
    name: 'In Review Detail',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'my-loan-complete',
    name: 'Completed Loan Detail',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'early-payoff',
    name: 'Early Payoff',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'early-payoff-pin',
    name: 'Early Payoff · Enter PIN',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'early-payoff-success',
    name: 'Early Payoff · Submitted',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'advance',
    name: 'Advance Account',
    section: 'MY LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Borrower', 'Co-Borrower'],
  },
  {
    id: 'restructure-info',
    name: 'Loan Restructuring',
    section: 'REQUEST RESTRUCTURE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Borrower', 'Co-Borrower'],
  },
  {
    id: 'restructure-success',
    name: 'Request submitted',
    section: 'REQUEST RESTRUCTURE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Borrower', 'Co-Borrower'],
  },
  {
    id: 'sign-up',
    name: 'Enter Phone Number',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor', 'Guarantee', 'Staff'],
  },
  {
    id: 'qr-signin',
    name: 'Sign in with QR',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor', 'Guarantee', 'Staff'],
  },
  {
    id: 'otp',
    name: 'Verify your number',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor', 'Guarantee', 'Staff'],
  },
  {
    id: 'enter-name',
    name: 'Enter Your Name',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor', 'Guarantee'],
  },
  {
    id: 'create-pin',
    name: 'Create PIN',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor', 'Guarantee', 'Staff'],
  },
  {
    id: 'confirm-pin',
    name: 'Confirm PIN',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Visitor', 'Guarantee', 'Staff'],
  },
  {
    id: 'staff-signup-info',
    name: 'Staff Information',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Staff'],
  },
  {
    id: 'staff-face-verify',
    name: 'Face Verification',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Staff'],
  },
  {
    id: 'staff-signup-success',
    name: 'Verified · Success',
    section: 'SIGN UP',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Staff'],
  },
  {
    id: 'mwl-about',
    name: 'Apply (4 steps)',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'mwl-success',
    name: 'Submitted · guarantor',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'mwl-tracker',
    name: 'Application tracker',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'mwl-contract',
    name: 'Contract ready · approved',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'mwl-sign-review',
    name: 'Review final terms',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'mwl-contract-doc',
    name: 'Full loan contract',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'mwl-sign',
    name: 'Sign contract · PIN',
    section: 'APPLY LOAN MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'guarantor-sms',
    name: 'Guarantor · SMS',
    section: 'GUARANTOR LINK',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'guarantor-web',
    name: 'Guarantor · Web invite',
    section: 'GUARANTOR LINK',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'guarantor-review',
    name: 'Guarantor · Web review',
    section: 'GUARANTOR LINK',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'guarantor-confirm',
    name: 'Guarantor · Web confirm',
    section: 'GUARANTOR LINK',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'guarantor-confirmed',
    name: 'Guarantor · Web confirmed',
    section: 'GUARANTOR LINK',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'nonmwl-about',
    name: '1 · Application',
    section: 'APPLY LOAN NON-MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'nonmwl-review',
    name: '2 · Review application',
    section: 'APPLY LOAN NON-MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'nonmwl-success',
    name: 'Application received',
    section: 'APPLY LOAN NON-MWL',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'staff-loan',
    name: 'Fill your details',
    section: 'APPLY STAFF LOAN',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
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
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'profile',
    name: 'Profile',
    section: 'PROFILE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'profile-edit',
    name: 'Edit profile',
    section: 'PROFILE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
  },
  {
    id: 'profile-documents',
    name: 'My documents',
    section: 'PROFILE',
    samples: [{ v: '1', label: 'Sample 1' }],
    flows: ['Applicant', 'Borrower', 'Co-Borrower'],
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
    id: 'csr-activity',
    name: 'CSR Activity',
    section: 'MORE',
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
    id: 'contact-us',
    name: 'Contact Us',
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
  {
    id: 'cbc',
    name: 'CBC',
    section: 'SETTINGS',
    samples: [{ v: '1', label: 'Sample 1' }],
  },
]

export const DEFAULT_SCREEN = SCREENS[0]

export function findScreen(id: string | undefined): FlowScreen | undefined {
  return SCREENS.find((s) => s.id === id)
}

// Screens visible for a given user flow.
// (no `flows` field = visible in all flows)
export function screensForFlow(flow: UserFlow): FlowScreen[] {
  return SCREENS.filter((s) => !s.flows || s.flows.includes(flow))
}
