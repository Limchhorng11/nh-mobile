import { createContext, useContext, useState, ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// User-flow context — defines which kind of user the prototype represents.
//   • Visitor   → browsing, not signed in, no loans yet
//   • Applicant → has applied, watching their application progress
//   • Borrower  → has active loans
//
// Drives the sidebar menu and the in-app bottom nav.
// Persisted to localStorage so it survives the preview's full-page reloads.
// ─────────────────────────────────────────────────────────────────────────────

export type UserFlow = 'Visitor' | 'Applicant' | 'Borrower' | 'Co-Borrower' | 'Guarantee' | 'Staff'
export const USER_FLOWS: UserFlow[] = ['Visitor', 'Applicant', 'Borrower', 'Co-Borrower', 'Guarantee', 'Staff']

const STORAGE_KEY = 'weloan-user-flow'

function readStored(): UserFlow {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && (USER_FLOWS as string[]).includes(v)) return v as UserFlow
  } catch {
    /* localStorage unavailable */
  }
  return 'Visitor'
}

interface FlowContextValue {
  flow: UserFlow
  setFlow: (f: UserFlow) => void
}

const FlowContext = createContext<FlowContextValue>({ flow: 'Visitor', setFlow: () => {} })

export function FlowProvider({ children }: { children: ReactNode }) {
  const [flow, setFlowState] = useState<UserFlow>(readStored)

  const setFlow = (f: UserFlow) => {
    setFlowState(f)
    try {
      localStorage.setItem(STORAGE_KEY, f)
    } catch {
      /* ignore */
    }
  }

  return <FlowContext.Provider value={{ flow, setFlow }}>{children}</FlowContext.Provider>
}

export function useFlow() {
  return useContext(FlowContext)
}
