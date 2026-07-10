# WeLoan365 Prototype — Demo Agenda & Run-of-Show

**Purpose:** a repeatable script for walking NongHyup Finance stakeholders through the prototype, in an order that tells a story rather than clicking screens at random.
**Format:** works live on a shared screen, or handed to an attendee's phone via the QR code — pick per audience (see setup below).
**Suggested length:** 30–35 min full walkthrough, or trim to the "Core path only" rows for a 10–12 min pitch.

---

## 0. Before you start (5 min setup)

- [ ] Run `npm run dev` and confirm both URLs print (Local + Network).
- [ ] If demoing on a phone: have the desktop app's QR panel visible, phone on the same Wi-Fi, scan and confirm the app loads before the meeting starts.
- [ ] Reload the app once right before the room fills — every reload lands back on **Select User Flow**, which wipes PIN-unlock state and any submitted applications. Starting clean avoids "why does this already say submitted" questions.
- [ ] Decide **who drives**: you, on desktop with the sidebar (fast persona/screen jumping for Q&A tangents), or an attendee, on their own phone (better for "feel" but you lose the sidebar shortcut).
- [ ] Open with the caveat below so it doesn't derail the demo later.

> **Say this up front:** *"This is a UX prototype, not the live app — there's no real backend. Any 4-digit PIN works, any OTP code works, all loan data is sample data, and refreshing the page resets everything back to a fresh install. We're validating the flow and screens, not the numbers."*

---

## 1. Act I — New customer journey (Visitor → Applicant)

*The story: someone with no relationship to NongHyup Finance discovers a loan product and applies for it.*

| # | Screen / action | What to click | Talking point |
|---|---|---|---|
| 1.1 | Flow Select | Choose **Visitor** | "Every demo starts here — it's not part of the real app, it's how we swap between customer types for this walkthrough." |
| 1.2 | Welcome → Products | Browse the product catalog, open a **Loan Detail** | This is the pre-login experience — no phone number needed to shop. |
| 1.3 | Sign-up: phone | Tap **Apply**, land on **Enter Phone Number** | Country + language picker up front (EN / KM / KO) — call out multi-language support here. |
| 1.4 | OTP | Enter any 4 digits | Mention the 42s resend countdown and the **Sign in with QR** alternative underneath, for branch-assisted onboarding. |
| 1.5 | Name → PIN → Confirm PIN | Click through | The PIN created here is what protects their data for the rest of the session. |
| 1.6 | Apply — MWL, step 1–4 | Fill the 4-step application | Pause on whichever step has the most open design questions — this is usually where stakeholder feedback concentrates. |
| 1.7 | Guarantor · SMS | Show the "SMS sent to guarantor" screen | **This is the moment to explain the guarantor-web flow (Act II) is a separate device/browser tab, not another app screen.** |

**Core path only:** 1.1 → 1.3 → 1.6 (skip catalog browsing and OTP mechanics if short on time).

---

## 2. Act II — Guarantor confirmation (a second person, a different device)

*The story: the applicant's guarantor gets a text and confirms — without installing anything.*

| # | Screen / action | What to click | Talking point |
|---|---|---|---|
| 2.1 | Guarantor · Web invite | Open in a **second browser tab** (not the phone flow) | Emphasize this is deliberately web-only — no app, no account, just the link from the SMS. |
| 2.2 | Guarantor · Web review → confirm → confirmed | Click through | Point out this updates live: switch back to the applicant's tab and show the tracker step advance. |
| 2.3 | Mwl Tracker / Contract ready | Show contract review → full contract doc → sign with PIN | This is the legal/consent moment — worth lingering on with legal or compliance attendees. |
| 2.4 | Submitted | Show final confirmation screen | Loop back: "From here the applicant becomes a **Borrower**." |

---

## 3. Act III — Existing customer (Borrower / Co-Borrower / Guarantor)

*The story: someone who already has a loan, managing it day to day.*

| # | Screen / action | What to click | Talking point |
|---|---|---|---|
| 3.1 | Flow Select | Switch to **Borrower** | Reinforce: this is the same app, different starting state — not a different build. |
| 3.2 | My Loans | Show dashboard with status chips (in review / active / completed) | Highlight currency-aware detail if the audience includes multi-currency stakeholders. |
| 3.3 | Loan Detail → Repayment Schedule | Open one active loan, view schedule | Good moment to show the redesigned payment table if that's a recent change. |
| 3.4 | Early Payoff | Request → PIN confirm → success | Shows the settlement path without a branch visit. |
| 3.5 | Restructuring (optional) | Info → Conditions → Consent → Success | Only include if restructuring is a current priority for this audience. |

**Core path only:** 3.1 → 3.2 → 3.3.

---

## 4. Act IV — Staff loan journey (separate track, show if HR/internal audience present)

*The story: an employee applies for a staff-only loan, with identity re-verified since the stakes/eligibility rules differ.*

| # | Screen / action | What to click | Talking point |
|---|---|---|---|
| 4.1 | Flow Select | Switch to **Staff** | Note Staff skips the PIN gate later — call this out only if someone asks why. |
| 4.2 | Sign-up → Staff Information | Scan National ID → Face verification | This is the KYC step unique to staff onboarding — flag it as a placeholder for whatever real verification vendor gets chosen. |
| 4.3 | Verified success | Show "You're all set" | |
| 4.4 | Staff Loan | Fill details, show tenure/salary eligibility check | This is the business rule most likely to need stakeholder sign-off — pause here for questions. |
| 4.5 | Staff Loan Approved | Show outcome screen | |

---

## 5. Closing — support & self-service (time permitting)

Quick tour, no need for step-by-step:

- **Chat** — conversations, threads, new message, request-a-consultation
- **Loan Calculator** — estimate before applying
- **Credit Score / CBC** — Credit Bureau Cambodia standing
- **Settings** — branch locator, blogs/education, FAQ, About NHFC, Terms & Privacy

> **Say this to close:** *"Everything you saw today is one codebase — the persona switch is the only thing that changed. That's deliberate: it means whatever we agree to change in this review applies everywhere at once, not screen-by-screen."*

---

## 6. After the demo

- [ ] Capture feedback against the specific screen/step number from this agenda (e.g. "1.6 — step 3 of application needs a document upload"), not just "the apply flow" — makes triage faster.
- [ ] Note any screen the audience asked about that **wasn't shown** — that's a signal for the next agenda's running order.
- [ ] Cross-reference open questions against [PM-BRIEF.md](PM-BRIEF.md) for the full feature/persona reference when writing up notes.

---

*Companion doc: [PM-BRIEF.md](PM-BRIEF.md) — full authentication, project, and feature reference.*
