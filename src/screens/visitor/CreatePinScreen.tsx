import { useNavigate, useSearchParams } from 'react-router-dom'
import PinView from './PinView'
import { useFlow } from '../../workspace/FlowContext'

export default function CreatePinScreen() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setFlow } = useFlow()
  const suffix = params.get('next') ? '?next=' + encodeURIComponent(params.get('next')!) : ''
  return (
    <PinView
      title="Create 4-digit PIN"
      subtitle="You'll use this to sign in and approve actions"
      onBack={() => navigate('/otp' + suffix)}
      onComplete={() => navigate('/confirm-pin' + suffix)}
      onSkip={() => { setFlow('Applicant'); navigate(params.get('next') ?? '/products') }}
    />
  )
}
