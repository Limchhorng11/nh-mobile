import { createContext, useContext, useState, ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// PIN gate — protects personal-information features (Profile, Chat,
// Notifications, Apply loan) behind a 4-digit PIN.
//
// "Once per session": the first time any protected area is opened the user
// enters their PIN; after a correct PIN everything stays unlocked until the
// app is relaunched. State is in-memory (NOT persisted) so a full reload — the
// start of a fresh demo run — re-locks the gate.
// ─────────────────────────────────────────────────────────────────────────────

interface PinGateValue {
  unlocked: boolean
  unlock: () => void
  lock: () => void
}

const PinGateContext = createContext<PinGateValue>({ unlocked: false, unlock: () => {}, lock: () => {} })

export function PinGateProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  return (
    <PinGateContext.Provider value={{ unlocked, unlock: () => setUnlocked(true), lock: () => setUnlocked(false) }}>
      {children}
    </PinGateContext.Provider>
  )
}

export function usePinGate() {
  return useContext(PinGateContext)
}
