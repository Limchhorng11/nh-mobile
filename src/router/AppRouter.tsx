import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useHomePath } from '../workspace/useHomePath'
import RequirePin from '../components/RequirePin'

// ─────────────────────────────────────────────────────────────────────────────
// Screen registry — each flow screen rendered inside the phone canvas.
// Keep route ids in sync with src/workspace/registry.ts.
// ─────────────────────────────────────────────────────────────────────────────
const MyLoanScreen     = lazy(() => import('../screens/MyLoanScreen'))
const MyLoanDetailScreen = lazy(() => import('../screens/MyLoanDetailScreen'))
const CompletedLoanDetailScreen = lazy(() => import('../screens/CompletedLoanDetailScreen'))
const MyLoanReviewDetailScreen = lazy(() => import('../screens/MyLoanReviewDetailScreen'))
const MwlAboutScreen   = lazy(() => import('../screens/mwl/MwlAboutScreen'))
const MwlLoanScreen    = lazy(() => import('../screens/mwl/MwlLoanScreen'))
const MwlGuarantorScreen = lazy(() => import('../screens/mwl/MwlGuarantorScreen'))
const MwlReviewScreen  = lazy(() => import('../screens/mwl/MwlReviewScreen'))
const MwlSuccessScreen = lazy(() => import('../screens/mwl/MwlSuccessScreen'))
const MoreScreen       = lazy(() => import('../screens/samples/MoreScreen'))
const SignUpScreen     = lazy(() => import('../screens/SignUpScreen'))
const ProductsScreen   = lazy(() => import('../screens/ProductsScreen'))
const SplashScreen     = lazy(() => import('../screens/SplashScreen'))
const FlowSelectScreen = lazy(() => import('../screens/FlowSelectScreen'))
const WelcomeScreen    = lazy(() => import('../screens/WelcomeScreen'))
const StaffLoanScreen  = lazy(() => import('../screens/StaffLoanScreen'))
const QrSignInScreen   = lazy(() => import('../screens/visitor/QrSignInScreen'))
const OtpScreen        = lazy(() => import('../screens/visitor/OtpScreen'))
const CreatePinScreen  = lazy(() => import('../screens/visitor/CreatePinScreen'))
const ConfirmPinScreen = lazy(() => import('../screens/visitor/ConfirmPinScreen'))
const AdvanceAccountScreen = lazy(() => import('../screens/AdvanceAccountScreen'))
const CalculatorScreen  = lazy(() => import('../screens/CalculatorScreen'))
const CalculatorScheduleScreen = lazy(() => import('../screens/CalculatorScheduleScreen'))
const ProductDetailScreen = lazy(() => import('../screens/ProductDetailScreen'))
const RestructureInfoScreen = lazy(() => import('../screens/restructure/RestructureInfoScreen'))
const RestructureConditionsScreen = lazy(() => import('../screens/restructure/RestructureConditionsScreen'))
const RestructureConsentScreen = lazy(() => import('../screens/restructure/RestructureConsentScreen'))
const RestructureSuccessScreen = lazy(() => import('../screens/restructure/RestructureSuccessScreen'))
const SettingsScreen   = lazy(() => import('../screens/SettingsScreen'))
const NotificationsScreen = lazy(() => import('../screens/NotificationsScreen'))
const CreditScoreScreen = lazy(() => import('../screens/CreditScoreScreen'))
const EarlyPayoffScreen = lazy(() => import('../screens/EarlyPayoffScreen'))
const EarlyPayoffPinScreen = lazy(() => import('../screens/EarlyPayoffPinScreen'))
const EarlyPayoffSuccessScreen = lazy(() => import('../screens/EarlyPayoffSuccessScreen'))
const ProfileScreen    = lazy(() => import('../screens/profile/ProfileScreen'))
const ProfileDocumentsScreen = lazy(() => import('../screens/profile/ProfileDocumentsScreen'))
const ProfileEditScreen = lazy(() => import('../screens/profile/ProfileEditScreen'))
const AllLoanScreen    = lazy(() => import('../screens/AllLoanScreen'))
const ChatScreen       = lazy(() => import('../screens/ChatScreen'))
const ChatThreadScreen = lazy(() => import('../screens/ChatThreadScreen'))
const NewMessageScreen = lazy(() => import('../screens/NewMessageScreen'))
const RequestConsultScreen = lazy(() => import('../screens/consult/RequestConsultScreen'))
const ConsultSuccessScreen = lazy(() => import('../screens/consult/ConsultSuccessScreen'))
const DocumentViewerScreen = lazy(() => import('../screens/DocumentViewerScreen'))
const AdvanceHistoryPreviewScreen = lazy(() => import('../screens/AdvanceHistoryPreviewScreen'))
const AnnouncementDetailScreen = lazy(() => import('../screens/AnnouncementDetailScreen'))
const AccountSecurityScreen = lazy(() => import('../screens/settings/AccountSecurityScreen'))
const NotificationSettingsScreen = lazy(() => import('../screens/settings/NotificationSettingsScreen'))
const AppSettingsScreen = lazy(() => import('../screens/settings/AppSettingsScreen'))
const AboutScreen      = lazy(() => import('../screens/settings/AboutScreen'))
const TermsPrivacyScreen = lazy(() => import('../screens/settings/TermsPrivacyScreen'))
const BranchLocatorScreen = lazy(() => import('../screens/settings/BranchLocatorScreen'))
const BlogsScreen      = lazy(() => import('../screens/settings/BlogsScreen'))
const SendFeedbackScreen = lazy(() => import('../screens/settings/SendFeedbackScreen'))
const FeedbackHistoryScreen = lazy(() => import('../screens/settings/FeedbackHistoryScreen'))
const FaqScreen        = lazy(() => import('../screens/settings/FaqScreen'))
// ─────────────────────────────────────────────────────────────────────────────

// Fallback: unknown paths go to the flow's home tab (Visitor → Products,
// signed-in flows → My Loan).
function HomeRedirect() {
  return <Navigate to={useHomePath()} replace />
}

function ScreenLoader() {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={28} thickness={4} sx={{ color: '#275CB2' }} />
    </Box>
  )
}

export default function AppRouter() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/flow-select" replace />} />
        <Route path="/flow-select" element={<FlowSelectScreen />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/my-loan" element={<RequirePin><MyLoanScreen /></RequirePin>} />
        <Route path="/my-loan-detail" element={<MyLoanDetailScreen />} />
        <Route path="/my-loan-complete" element={<CompletedLoanDetailScreen />} />
        <Route path="/my-loan-review" element={<MyLoanReviewDetailScreen />} />
        <Route path="/mwl-about" element={<RequirePin><MwlAboutScreen /></RequirePin>} />
        <Route path="/mwl-loan" element={<MwlLoanScreen />} />
        <Route path="/mwl-guarantor" element={<MwlGuarantorScreen />} />
        <Route path="/mwl-review" element={<MwlReviewScreen />} />
        <Route path="/mwl-success" element={<MwlSuccessScreen />} />
        <Route path="/nonmwl-about" element={<RequirePin><MwlAboutScreen nonMwl /></RequirePin>} />
        <Route path="/nonmwl-loan" element={<MwlLoanScreen nonMwl />} />
        <Route path="/nonmwl-review" element={<MwlReviewScreen nonMwl />} />
        <Route path="/nonmwl-success" element={<MwlSuccessScreen product="Non-MWL Loan" />} />
        <Route path="/staff-loan" element={<RequirePin><StaffLoanScreen /></RequirePin>} />
        <Route path="/more" element={<MoreScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/notifications" element={<RequirePin><NotificationsScreen /></RequirePin>} />
        <Route path="/credit-score" element={<CreditScoreScreen />} />
        <Route path="/early-payoff" element={<EarlyPayoffScreen />} />
        <Route path="/early-payoff-pin" element={<EarlyPayoffPinScreen />} />
        <Route path="/early-payoff-success" element={<EarlyPayoffSuccessScreen />} />
        <Route path="/profile" element={<RequirePin><ProfileScreen /></RequirePin>} />
        <Route path="/profile-documents" element={<RequirePin><ProfileDocumentsScreen /></RequirePin>} />
        <Route path="/profile-edit" element={<RequirePin><ProfileEditScreen /></RequirePin>} />
        <Route path="/products" element={<ProductsScreen />} />
        <Route path="/all-loan" element={<AllLoanScreen />} />
        <Route path="/sign-up" element={<SignUpScreen />} />
        <Route path="/qr-signin" element={<QrSignInScreen />} />
        <Route path="/otp" element={<OtpScreen />} />
        <Route path="/create-pin" element={<CreatePinScreen />} />
        <Route path="/confirm-pin" element={<ConfirmPinScreen />} />
        <Route path="/advance" element={<AdvanceAccountScreen />} />
        <Route path="/advance-history-preview" element={<AdvanceHistoryPreviewScreen />} />
        <Route path="/calculator" element={<CalculatorScreen />} />
        <Route path="/calculator-schedule" element={<CalculatorScheduleScreen />} />
        <Route path="/product-detail" element={<ProductDetailScreen />} />
        <Route path="/restructure-info" element={<RestructureInfoScreen />} />
        <Route path="/restructure-conditions" element={<RestructureConditionsScreen />} />
        <Route path="/restructure-consent" element={<RestructureConsentScreen />} />
        <Route path="/restructure-success" element={<RestructureSuccessScreen />} />
        <Route path="/chat" element={<RequirePin><ChatScreen /></RequirePin>} />
        <Route path="/chat-thread" element={<RequirePin><ChatThreadScreen /></RequirePin>} />
        <Route path="/chat-new" element={<RequirePin><NewMessageScreen /></RequirePin>} />
        <Route path="/request-consult" element={<RequestConsultScreen />} />
        <Route path="/consult-success" element={<ConsultSuccessScreen />} />
        <Route path="/document-view" element={<DocumentViewerScreen />} />
        <Route path="/announcement" element={<AnnouncementDetailScreen />} />
        <Route path="/account-security" element={<AccountSecurityScreen />} />
        <Route path="/notification-settings" element={<NotificationSettingsScreen />} />
        <Route path="/app-settings" element={<AppSettingsScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/terms-privacy" element={<TermsPrivacyScreen />} />
        <Route path="/branch-locator" element={<BranchLocatorScreen />} />
        <Route path="/blogs" element={<BlogsScreen />} />
        <Route path="/send-feedback" element={<SendFeedbackScreen />} />
        <Route path="/feedback-history" element={<FeedbackHistoryScreen />} />
        <Route path="/faq" element={<FaqScreen />} />

        {/* Catch-all: redirect unknown paths to the active sample's home */}
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </Suspense>
  )
}
