import { ReactNode } from 'react'
import { usePinGate } from '../workspace/PinGateContext'
import { useFlow } from '../workspace/FlowContext'
import PinGateScreen from '../screens/PinGateScreen'

// ─────────────────────────────────────────────────────────────────────────────
// Route guard — wraps a protected screen. While the session is locked it
// renders the PIN gate in place of the screen; a correct PIN unlocks the
// session and the protected screen renders. See PinGateContext for scope.
//
// Visitors aren't signed in (no PIN), so they're never gated — the screens
// themselves funnel them to sign-up when an account is required.
// ─────────────────────────────────────────────────────────────────────────────
export default function RequirePin({ children }: { children: ReactNode }) {
  const { unlocked, unlock } = usePinGate()
  const { flow } = useFlow()
  if (flow !== 'Visitor' && !unlocked) return <PinGateScreen onSuccess={unlock} />
  return <>{children}</>
}
