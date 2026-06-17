import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const BASE = 'http://localhost:5173'
const OUT_DIR = path.join(process.env.HOME, 'Desktop', 'weloan365-screens')
const PDF_PATH = path.join(process.env.HOME, 'Desktop', 'weloan365-stakeholder-review.pdf')

fs.mkdirSync(OUT_DIR, { recursive: true })

// ── Screen definitions ────────────────────────────────────────────────────────
// [route, title, flow, section]
const SCREENS = [
  // Onboarding
  ['/splash',       'Splash Screen',             'Visitor',  'Onboarding'],
  ['/flow-select',  'Select User Flow',           'Visitor',  'Onboarding'],
  ['/sign-up',      'Enter Phone Number',         'Visitor',  'Sign Up'],
  ['/qr-signin',    'Sign In with QR',            'Visitor',  'Sign Up'],
  ['/otp',          'Verify Your Number (OTP)',   'Visitor',  'Sign Up'],
  ['/create-pin',   'Create 4-digit PIN',         'Visitor',  'Sign Up'],
  ['/confirm-pin',  'Confirm PIN',                'Visitor',  'Sign Up'],

  // Home
  ['/products',     'Products (Visitor)',         'Visitor',  'Home'],
  ['/products',     'Products (New User)',        'Applicant', 'Home'],
  ['/more',         'More Menu',                  'Applicant', 'Home'],
  ['/notifications','Notifications',              'Borrower', 'Home'],

  // My Loans
  ['/my-loan',      'My Loans (Empty)',           'Applicant', 'My Loans'],
  ['/my-loan',      'My Loans (Active)',          'Borrower', 'My Loans'],
  ['/my-loan-detail','Active Loan Detail',        'Borrower', 'My Loans'],
  ['/my-loan-review','In Review Detail',          'Applicant','My Loans'],
  ['/my-loan-complete','Completed Loan Detail',   'Borrower', 'My Loans'],

  // Apply Loan — MWL
  ['/mwl-about',    '1 · Tell Us About You (MWL)',      'Applicant', 'Apply MWL Loan'],
  ['/mwl-loan',     '2 · Loan Request (MWL)',           'Applicant', 'Apply MWL Loan'],
  ['/mwl-guarantor','3 · Add Your Guarantor (MWL)',     'Applicant', 'Apply MWL Loan'],
  ['/mwl-review',   '4 · Review Application (MWL)',     'Applicant', 'Apply MWL Loan'],
  ['/mwl-success',  '5 · Application Received (MWL)',   'Applicant', 'Apply MWL Loan'],

  // Apply Loan — Non-MWL
  ['/nonmwl-about', '1 · Tell Us About You (Non-MWL)',  'Applicant', 'Apply Non-MWL Loan'],
  ['/nonmwl-loan',  '2 · Loan Request (Non-MWL)',       'Applicant', 'Apply Non-MWL Loan'],
  ['/nonmwl-review','3 · Review Application (Non-MWL)', 'Applicant', 'Apply Non-MWL Loan'],
  ['/nonmwl-success','4 · Application Received (Non-MWL)','Applicant','Apply Non-MWL Loan'],

  // Tools
  ['/calculator',   'Loan Calculator',            'Applicant', 'Tools'],
  ['/credit-score', 'Credit Score',               'Borrower', 'Tools'],
  ['/all-loan',     'All Loans',                  'Borrower', 'Tools'],
  ['/product-detail','Product Detail',            'Visitor',  'Tools'],
  ['/advance',      'Advance Account',            'Borrower', 'Tools'],

  // Restructure
  ['/restructure-info',      'Restructure · Info',       'Borrower', 'Restructure'],
  ['/restructure-conditions','Restructure · Conditions', 'Borrower', 'Restructure'],
  ['/restructure-consent',   'Restructure · Consent',    'Borrower', 'Restructure'],
  ['/restructure-success',   'Restructure · Success',    'Borrower', 'Restructure'],

  // Early Payoff
  ['/early-payoff',        'Early Payoff',         'Borrower', 'Early Payoff'],
  ['/early-payoff-pin',    'Early Payoff · PIN',   'Borrower', 'Early Payoff'],
  ['/early-payoff-success','Early Payoff · Success','Borrower','Early Payoff'],

  // Chat & Support
  ['/chat',            'Conversations (Empty)',   'Visitor',  'Chat & Support'],
  ['/chat',            'Conversations',           'Borrower', 'Chat & Support'],
  ['/chat-thread',     'Chat Thread',             'Borrower', 'Chat & Support'],
  ['/chat-new',        'New Message',             'Borrower', 'Chat & Support'],
  ['/request-consult', 'Request Consultation',    'Applicant', 'Chat & Support'],
  ['/consult-success', 'Consultation Success',    'Applicant', 'Chat & Support'],
  ['/send-feedback',   'Send Feedback',           'Applicant', 'Chat & Support'],
  ['/feedback-history','Feedback History',        'Applicant', 'Chat & Support'],

  // Profile
  ['/profile',           'Profile',               'Borrower', 'Profile'],
  ['/profile-documents', 'My Documents',          'Borrower', 'Profile'],
  ['/profile-edit',      'Edit Profile',          'Borrower', 'Profile'],

  // Settings
  ['/account-security',       'Account Security',       'Applicant', 'Settings'],
  ['/notification-settings',  'Notification Settings',  'Applicant', 'Settings'],
  ['/app-settings',           'App Settings',           'Applicant', 'Settings'],
  ['/about',                  'About NHFC',             'Applicant', 'Settings'],
  ['/terms-privacy',          'Terms & Privacy',        'Applicant', 'Settings'],
  ['/branch-locator',         'Find a Branch',          'Applicant', 'Settings'],
  ['/blogs',                  'Blogs & Education',      'Applicant', 'Settings'],
  ['/faq',                    'FAQ',                    'Applicant', 'Settings'],
]

const FLOW_MAP = {
  'Visitor':   'Visitor',
  'Applicant': 'Applicant',
  'Borrower':  'Borrower',
}

async function capture() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()

  // Load the app once to warm up
  await page.goto(BASE + '/splash', { waitUntil: 'networkidle' })

  const screenshots = [] // { title, section, file }
  let currentFlow = null

  for (const [route, title, flow, section] of SCREENS) {
    console.log(`  Capturing: ${title}`)

    // Set flow in localStorage when it changes
    if (flow !== currentFlow) {
      await page.evaluate((f) => localStorage.setItem('weloan-user-flow', f), flow)
      currentFlow = flow
    }

    // Navigate
    await page.evaluate((r) => window.history.pushState({}, '', r), route)
    await page.evaluate(() => window.dispatchEvent(new PopStateEvent('popstate')))
    await page.waitForTimeout(600)

    // Wait for phone canvas
    await page.waitForSelector('#phone-canvas', { timeout: 5000 }).catch(() => {})

    // Screenshot only the phone canvas
    const canvas = await page.$('#phone-canvas')
    const slug = title.replace(/[^a-z0-9]+/gi, '_').toLowerCase()
    const file = path.join(OUT_DIR, `${String(screenshots.length + 1).padStart(3, '0')}_${slug}.png`)

    if (canvas) {
      await canvas.screenshot({ path: file, type: 'png' })
    } else {
      await page.screenshot({ path: file, type: 'png' })
    }

    screenshots.push({ title, section, file })
  }

  await browser.close()

  // ── Build print-ready HTML ────────────────────────────────────────────────
  console.log('\n  Building PDF…')

  const toDataUrl = (f) => {
    const data = fs.readFileSync(f).toString('base64')
    return `data:image/png;base64,${data}`
  }

  // Group by section
  const sections = {}
  for (const s of screenshots) {
    if (!sections[s.section]) sections[s.section] = []
    sections[s.section].push(s)
  }

  let gridHtml = ''
  for (const [sec, items] of Object.entries(sections)) {
    gridHtml += `
      <div class="section-header">${sec}</div>
      <div class="grid">
        ${items.map(s => `
          <div class="card">
            <img src="${toDataUrl(s.file)}" alt="${s.title}" />
            <div class="card-title">${s.title}</div>
          </div>
        `).join('')}
      </div>
    `
  }

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>NongHyup Mobile App — Stakeholder Review</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #0B0F1A; }

  .cover {
    width: 100%; height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    page-break-after: always;
    background: #F5F7FA;
  }
  .cover h1 { font-size: 42px; font-weight: 800; color: #275CB2; letter-spacing: -1px; }
  .cover p  { font-size: 18px; color: #8A94A6; margin-top: 12px; }
  .cover .badge { margin-top: 32px; font-size: 13px; color: #B0B8C4; }

  .section-header {
    font-size: 11px; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; color: #8A94A6;
    padding: 28px 32px 12px;
    border-top: 1px solid #E8ECF1;
    margin-top: 8px;
  }
  .section-header:first-of-type { border-top: none; margin-top: 0; }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 0 32px 24px;
  }

  .card {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .card img {
    width: 100%;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(11,15,26,0.10);
    border: 1px solid #E8ECF1;
  }
  .card-title {
    font-size: 11px; font-weight: 600; color: #3A4256;
    text-align: center; line-height: 1.3;
  }

  @media print {
    @page { size: A3 landscape; margin: 16mm; }
    .cover { page-break-after: always; }
    .section-header { break-before: avoid; }
    .card { break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="cover">
    <h1>NongHyup Mobile App</h1>
    <p>Stakeholder Review — Screen Catalogue</p>
    <div class="badge">weloan365-prototype · ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })} · ${screenshots.length} screens</div>
  </div>
  ${gridHtml}
</body>
</html>`

  const htmlPath = path.join(process.env.HOME, 'Desktop', 'weloan365-stakeholder-review.html')
  fs.writeFileSync(htmlPath, html)

  // ── Print to PDF via Playwright ────────────────────────────────────────────
  const pdfBrowser = await chromium.launch({ headless: true })
  const pdfPage = await pdfBrowser.newPage()
  await pdfPage.goto('file://' + htmlPath, { waitUntil: 'networkidle' })
  await pdfPage.pdf({
    path: PDF_PATH,
    format: 'A3',
    landscape: true,
    margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' },
    printBackground: true,
  })
  await pdfBrowser.close()

  console.log(`\n✓ PDF saved: ${PDF_PATH}`)
  console.log(`✓ HTML saved: ${htmlPath}`)
  console.log(`✓ ${screenshots.length} screens exported to: ${OUT_DIR}`)
}

capture().catch(err => { console.error(err); process.exit(1) })
