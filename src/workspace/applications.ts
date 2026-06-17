// ─────────────────────────────────────────────────────────────────────────────
// Submitted loan applications — an in-memory store so an application the user
// just submitted (e.g. Staff Loan) appears in the "In Review" list on My Loans
// and is carried into its detail.
//
// Deliberately NOT persisted: a full-page refresh resets the prototype to its
// default seeded data (the standing demo loans only). It survives in-app
// navigation because the module stays loaded for the session.
// ─────────────────────────────────────────────────────────────────────────────
export interface LoanApplication {
  title: string
  amount: string // e.g. "$7,500.00"
  term: string // e.g. "12 months"
  rate: string // e.g. "1.0%/mo"
  ref: string
  on: string // requested-on date, e.g. "17 Jun 2026"
}

let applications: LoanApplication[] = []

export function getApplications(): LoanApplication[] {
  return applications
}

export function addApplication(app: LoanApplication) {
  applications = [app, ...applications]
}

export function clearApplications() {
  applications = []
}

// Build the query string the in-review detail screen reads.
export function reviewQuery(app: LoanApplication): string {
  return new URLSearchParams({
    title: app.title,
    amount: app.amount,
    term: app.term,
    rate: app.rate,
    ref: app.ref,
    on: app.on,
  }).toString()
}
