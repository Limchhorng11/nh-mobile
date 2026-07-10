# WeLoan365 Mobile Prototype — Product & Flow Brief

**Prepared for:** Product Management
**Date:** 9 July 2026
**Client:** NongHyup Finance (Cambodia) Plc
**Stage:** UX prototype, pre-build
**Screens:** ~90 across 13 sections
**Personas:** 6 selectable user flows

A client-demo application built for NongHyup Finance (Cambodia) Plc — one interactive React codebase that plays back six different customer journeys through a Cambodian microfinance loan product, from first sign-up to final repayment.

---

## 1. Authentication & User Flow

The prototype opens on a persona picker, not a login screen — each persona represents a distinct stage in a customer's relationship with the bank, and the app reshapes its menu and gating around whichever one is chosen.

### The six personas

| Persona | Represents | PIN gate |
|---|---|---|
| **Visitor** | Browsing products, not signed in, no loans yet. | Not required |
| **Applicant** | Has submitted an application, tracking its progress. | Required |
| **Borrower** | Holds one or more active loans. | Required |
| **Co-Borrower** | Borrower, co-borrower, and guarantor combined on one loan. | Required |
| **Sole Guarantor** | Guaranteeing someone else's loan(s), holds none personally. | Required |
| **Staff** | NongHyup employee applying for a staff loan product. | Not required |

### Sign-up path (Visitor / Guarantor)

1. **Phone number** — country + language picker, 15 countries, EN/KM/KO
2. **OTP verify** — 4-digit code, 42s resend countdown
3. **Enter name** — display name for the account
4. **Create PIN** — 4-digit PIN, used for future sign-in & approvals
5. **Confirm PIN** — re-enter to finish setup

**Alternate entry point:** a "Sign in with QR" option sits beneath the phone-entry screen — a scanner viewfinder that jumps straight to OTP verification, skipping manual phone entry. Modelled on branch-assisted onboarding, where a teller's device generates the code.

### Staff path — adds identity verification

After OTP, the Staff flow inserts a two-step KYC check before PIN setup:

1. **National ID scan** — simulated card outline, scan sweep, success flash
2. **Face verification** — framing guide, capture, match

Both steps must complete before the account is marked verified and the user can reach staff loan products.

### The PIN gate — session-level lock, not account login

Distinct from the PIN created at sign-up, a second gate intercepts entry to personal-data screens: **Profile, My Loan, Chat, Notifications, Apply Loan, Staff Loan**. The first attempt to open any of these prompts for the PIN once; a correct entry unlocks all of them for the rest of the session.

> **By design:** the unlock state lives in memory only — a full reload re-locks everything, so every fresh demo run starts from a clean, "just installed" state. **Visitor** and **Staff** flows bypass the gate entirely, since neither has completed the standard PIN-based sign-up at that point in their story.

---

## 2. The Project

Not a production app — a **disposable, high-fidelity prototype** used to walk NongHyup Finance stakeholders through the intended experience before real engineering begins on the native app. It runs in any mobile browser, so it can be demoed on an actual phone in a client meeting rather than a static mockup.

| | |
|---|---|
| **Client** | NongHyup Finance (Cambodia) Plc — a Cambodia-based lending arm connected to Nonghyup, the Korean agricultural co-operative financial group. |
| **Stack** | React 18 + TypeScript, MUI v5 themed with WeLoan365 design tokens, React Router v6, built on Vite. |
| **Delivery** | Deployed to Vercel as a static SPA; a LAN QR code lets a phone on the same Wi-Fi open the live dev build directly — no app install, no build step for the viewer. |
| **Presentation shell** | On desktop, screens render inside an iPhone 14 Pro frame on a dark studio background with a sidebar screen index; on an actual phone, the same routes fill the full screen — one build serves both the pitch room and the hallway demo. |
| **How personas work** | A single screen registry (`registry.ts`) tags every screen with which persona(s) can see it. Switching the active persona filters the sidebar and redirect targets live — six demos, one codebase, no duplicated screens. |
| **Current focus** | Recent iterations concentrate on My Loan status handling, currency-aware detail views, staff-loan tenure/salary eligibility checks, and payment-table redesign — the loan-servicing side of the journey, past initial sign-up. |

---

## 3. Functionality & Features

Roughly 90 screens organise into the modules below. **ALL** means every persona sees it; anything else names exactly who does.

### Loan origination

| Module | What it covers | Personas |
|---|---|---|
| **Products** | Browse the loan product catalog, view a product's terms, list all loans on offer. | ALL |
| **Apply — MWL** | 4-step application, decision tracker, contract review with full document + PIN-signature, submission. | Applicant, Borrower, Co-Borrower |
| **Guarantor linking** | An SMS link sends a guarantor a web-only journey (no app needed) — review terms, confirm, confirmed — that reports live back to the borrower's submission screen. | Applicant, Borrower, Co-Borrower |
| **Apply — Non-MWL** | Lighter 3-step path: application → review → received, for products that skip full guarantor/contract ceremony. | Applicant, Borrower, Co-Borrower |
| **Staff loan** | Employee-only application with tenure/salary eligibility checks and an approval screen. | Staff |

### Loan servicing

| Module | What it covers | Personas |
|---|---|---|
| **My Loans** | Dashboard of held loans by status (in review / active / completed), currency-aware detail, repayment schedule, settlement certificate. | Applicant, Borrower, Co-Borrower, Guarantor |
| **Early payoff** | Request early settlement, confirm with PIN, submission receipt. | Applicant, Borrower, Co-Borrower |
| **Restructuring** | Request a loan restructure: terms & conditions, consent, confirmation. | Borrower, Co-Borrower |
| **Advance account** | Salary/cash-advance account view with transaction history preview. | Borrower, Co-Borrower |
| **Staff views** | Portfolio summary and loan-requests queue — internal, officer-facing screens rather than customer-facing. | ALL |

### Tools, support & account

| Module | What it covers | Personas |
|---|---|---|
| **Loan calculator** | Estimate payments and view a projected repayment schedule before applying. | ALL |
| **Credit score & CBC** | In-app credit score view; a dedicated screen for Credit Bureau Cambodia standing. | ALL |
| **Support chat** | Conversation list, threaded chat, new message composer, consultation request + confirmation. | ALL |
| **Profile** | View/edit personal details, manage stored documents. | Applicant, Borrower, Co-Borrower |
| **Notifications** | Notification feed with announcement detail pages. | ALL |
| **Settings** | Account security, app settings, branch locator, blogs/financial education, feedback (send + history), FAQ, Contact Us, About NHFC, Terms & Privacy. | ALL |

---

## 4. Apply Loan Process — Side by Side

Three application tracks, by weight: **Non-MWL** (ML / SBL / SME / HL) is a fast single-step path; **MWL** adds a guarantor and a signed contract because it's backed by an overseas work contract; **Staff Loan** skips the guarantor/contract ceremony and substitutes hard salary-percentage caps plus payroll-direct disbursement.

### Process flow, phase by phase

| Phase | Non-MWL (ML / SBL / SME / HL) | MWL (Migrant Worker Loan) | Staff Loan |
|---|---|---|---|
| **1. Application entry** | One screen: name, mobile, branch, currency (USD/Riel, live-converted) | Same fields **plus** destination country (Korea/EPS, Japan/SSW, Singapore/Work Permit) | Staff profile auto-filled from account; toggle **Loan 1** (standard) vs **Loan 2** (top-up while Loan 1 active) |
| **2. Loan request details** | Amount + tenure slider, same screen — flat **0.75%/mo** | Separate step: amount, tenure, repayment method (equal / declining / balloon) — **1.04%/mo** | Amount + tenure with **live eligibility checks** — blocks submit if limits are exceeded |
| **3. Guarantor / consent** | *— none —* | **Add guarantor**: name, phone, relationship → SMS sent → guarantor confirms on a separate **web-only** link (3-step tracker: Open Link → Review → Confirm) | *No 3rd-party guarantor.* Consent checklist: T&Cs, salary deduction authorization, CBC credit check, e-sign |
| **4. Review** | Review screen — Applicant + Loan Request, editable, footnoted "estimate only" | Review screen — Customer + Loan + Guarantor, each independently editable | **Review & confirm** with full fee breakdown (donut chart): upfront fee, CBC fee, net amount |
| **5. Verification / signing** | *— none —* | Guarantor confirms → **Contract Ready** (terms final & fixed) → PIN-bound e-signature on full contract, or **"Sign at a branch instead"** | **Face ID scan** → **PIN entry** (auto-submits on 4th digit) |
| **6. Outcome** | **Application received** — assessed later, no guarantor/contract step at all | Signed contract → lands in **My Loan** as an active loan | **Loan Approved** — funds disbursed straight to payroll account, auto-deducted next payday |

### Business rules

| | Non-MWL | MWL | Staff Loan |
|---|---|---|---|
| **Interest rate** | 0.75%/mo (flat) | 1.04%/mo | 1.0%/mo (Loan 1) · 1.2%/mo (Loan 2) |
| **Amount range** | $100 – $3,000 (ML) / $30,000 (SBL) / $100,000 (SME, HL) | $100 – $15,000 | Up to $1,000 (Loan 1) · up to 25% of base salary (Loan 2) |
| **Guarantor required** | No | **Yes** | No |
| **Contract e-signature** | No | **Yes** — PIN-bound, or in-branch | No formal contract; consent checklist + PIN |
| **Extra identity check at apply** | No | No (PIN only, reuses sign-up KYC) | **Face ID + PIN**, on top of sign-up KYC |
| **Fees disclosed at apply** | None shown | None shown | **1%/1.2% upfront fee + $5 CBC fee**, shown as net-amount breakdown |
| **Disbursement** | Not modelled in prototype | Not modelled in prototype | **Direct to NHFC payroll account** |
| **Hard eligibility guardrails** | None enforced | None enforced | Blocks submission if: amount > product max, monthly payment ≥ 25% of loan amount, or monthly payment > 25% of base salary |

> **Legal note found in the code:** the MWL sign screen flags that a live e-signature would require a PKI-backed certificate under *Sub-Decree No.246* — the prototype simulates the signing act pending that certificate layer.

---

*Source: nh-mobile repository, `registry.ts` & screen inventory.*
