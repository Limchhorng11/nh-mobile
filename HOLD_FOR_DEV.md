# Hold for Development

Sections/points flagged during prototyping that are intentionally left as-is for now,
to be revisited when real backend/development work begins.

- **Download Point** — the whole app. All "Download" buttons/links across screens
  (loan documents, repayment schedules, receipts, certificates, QR codes, CSV/PDF
  exports) are currently static/simulated for the prototype. See list below for
  every occurrence found as of this note.

  - [MyLoanDetailScreen.tsx](src/screens/MyLoanDetailScreen.tsx) — Payment table header "Download"
  - [CompletedLoanDetailScreen.tsx](src/screens/CompletedLoanDetailScreen.tsx) — "Download" link + "Download Certificate" button
  - [RepaymentScheduleDetailScreen.tsx](src/screens/RepaymentScheduleDetailScreen.tsx) — "Download as PDF" button
  - [SettlementCertificateScreen.tsx](src/screens/SettlementCertificateScreen.tsx) — "Download as PDF" button
  - [restructure/RestructureConditionsScreen.tsx](src/screens/restructure/RestructureConditionsScreen.tsx) — "Download" text (static, no handler)
  - [CalculatorScreen.tsx](src/screens/CalculatorScreen.tsx) — "Download Schedule" link + CSV export sheet
  - [mwl/MwlLoanScreen.tsx](src/screens/mwl/MwlLoanScreen.tsx) — "Download" link + CSV export sheet
  - [mwl/RepaymentEstimate.tsx](src/screens/mwl/RepaymentEstimate.tsx) — "Download PDF" button
  - [CalculatorScheduleScreen.tsx](src/screens/CalculatorScheduleScreen.tsx) — CSV download button
  - [DocumentViewerScreen.tsx](src/screens/DocumentViewerScreen.tsx) — header icon + "Download PDF" button
  - [AdvanceAccountScreen.tsx](src/screens/AdvanceAccountScreen.tsx) — "Download" link, "Download QR", "Download record"
  - [components/PayLoanSheet.tsx](src/components/PayLoanSheet.tsx) — receipt "Download" + "Download QR"
  - [NotificationsScreen.tsx](src/screens/NotificationsScreen.tsx) — receipt sheet "Receipt" download button
