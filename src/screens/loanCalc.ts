// ─────────────────────────────────────────────────────────────────────────────
// Loan amortization — shared by the Loan calculator and the loan-request step
// of the application flows. Builds a full repayment schedule for a chosen
// repayment method; the headline monthly payment and totals follow from it.
// ─────────────────────────────────────────────────────────────────────────────

export type Currency = 'USD' | 'KHR'

// Format a number in the selected currency. KHR shows whole riel (no decimals);
// USD shows cents.
export const money = (n: number, currency: Currency = 'USD') =>
  currency === 'KHR'
    ? '៛' + Math.round(n).toLocaleString('en-US')
    : '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export type ScheduleRow = { month: number; principal: number; interest: number; payment: number; balance: number }

// Build the full repayment schedule for the chosen method. Each method shapes the
// principal/interest split differently, so the headline payment and totals follow.
export function buildSchedule(amount: number, months: number, monthlyRatePct: number, method: string) {
  const r = monthlyRatePct / 100
  const rows: ScheduleRow[] = [{ month: 0, principal: 0, interest: 0, payment: 0, balance: amount }]
  let balance = amount

  // Equal monthly payment (annuity) helper over a given principal & term.
  const annuityPayment = (principal: number, n: number) =>
    r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n))

  if (method === 'Decline') {
    // Equal principal each month; interest on the declining balance → payment falls.
    const principalPart = amount / months
    for (let m = 1; m <= months; m++) {
      const interest = balance * r
      const principal = Math.min(principalPart, balance)
      balance = Math.max(0, balance - principal)
      rows.push({ month: m, principal, interest, payment: principal + interest, balance })
    }
  } else if (method === 'Ballon') {
    // Interest-only each month, full principal repaid as a balloon in the final month.
    for (let m = 1; m <= months; m++) {
      const interest = balance * r
      const isLast = m === months
      const principal = isLast ? balance : 0
      balance = Math.max(0, balance - principal)
      rows.push({ month: m, principal, interest, payment: principal + interest, balance })
    }
  } else if (method === 'Mix-Grace Period') {
    // First few months interest-only (grace), then annuity over the remaining term.
    const grace = Math.min(3, Math.max(0, months - 1))
    const payAfter = annuityPayment(amount, months - grace)
    for (let m = 1; m <= months; m++) {
      const interest = balance * r
      if (m <= grace) {
        rows.push({ month: m, principal: 0, interest, payment: interest, balance })
      } else {
        const principal = Math.min(payAfter - interest, balance)
        balance = Math.max(0, balance - principal)
        rows.push({ month: m, principal, interest, payment: principal + interest, balance })
      }
    }
  } else if (method === 'Mix Installment') {
    // Partial balloon: annuity sized so ~20% of principal remains, settled at the end.
    const balloon = amount * 0.2
    const pv = amount - (r === 0 ? balloon : balloon * Math.pow(1 + r, -months))
    const pay = annuityPayment(pv === 0 ? amount : pv, months)
    for (let m = 1; m <= months; m++) {
      const interest = balance * r
      const isLast = m === months
      const principal = isLast ? balance : Math.min(pay - interest, balance)
      balance = Math.max(0, balance - principal)
      rows.push({ month: m, principal, interest, payment: principal + interest, balance })
    }
  } else {
    // Constant (default): equal monthly payment (annuity).
    const payment = annuityPayment(amount, months)
    for (let m = 1; m <= months; m++) {
      const interest = balance * r
      const principal = Math.min(payment - interest, balance)
      balance = Math.max(0, balance - principal)
      rows.push({ month: m, principal, interest, payment, balance })
    }
  }

  const totalPayable = rows.reduce((s, row) => s + row.payment, 0)
  const payment = rows[1]?.payment ?? 0
  return { payment, totalPayable, totalInterest: totalPayable - amount, rows }
}
