import { useNavigate, useSearchParams } from 'react-router-dom'
import PinView from './PinView'
import { useFlow } from '../../workspace/FlowContext'
import { homePath } from '../../workspace/useHomePath'

export default function ConfirmPinScreen() {
  const navigate = useNavigate()
  const { flow, setFlow } = useFlow()
  const [params] = useSearchParams()
  const next = params.get('next')
  // Signing in turns a Visitor into a signed-in user. With no "new user" persona,
  // they become an Applicant (about to apply). Other flows stay as they are.
  const signedInFlow = flow === 'Visitor' ? 'Applicant' : flow
  // After the account + PIN are set, continue to the intended apply-loan screen
  // if one was carried through; otherwise land on the flow's home tab.
  const done = homePath(signedInFlow)
  const complete = () => {
    if (flow === 'Visitor') setFlow('Applicant')
    navigate(next ?? done)
  }
  return (
    <PinView
      title="Confirm PIN"
      subtitle="Type the same 4 digits to confirm"
      onBack={() => navigate('/create-pin' + (next ? '?next=' + encodeURIComponent(next) : ''))}
      onComplete={complete}
    />
  )
}
