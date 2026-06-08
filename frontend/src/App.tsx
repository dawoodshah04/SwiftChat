import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { StreamVideo } from '@stream-io/video-react-sdk';
import './index.css';

// Pages
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import FriendsPage from './pages/FriendsPage';
import NotificationsPage from './pages/NotificationsPage';
import ChatPage from './pages/ChatPage';
import CallPage from './pages/CallPage';

// Guards
import ProtectedRoute from './components/auth/ProtectedRoute';

// Calling
import IncomingCallModal from './components/call/IncomingCallModal';

// Hooks & context
import useAuth from './hooks/useAuth';
import useStreamVideo from './hooks/useStreamVideo';
import { VideoClientContext } from './lib/videoContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,   // 2 min
      gcTime:    10 * 60 * 1000,  // 10 min
      retry: false,
    },
  },
});

// ── Route tree (shared between wrapped and unwrapped render) ──
const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/"         element={<LandingPage />} />
    <Route path="/signup"   element={<SignupPage />} />
    <Route path="/login"    element={<LoginPage />} />

    {/* Semi-protected: authed but not yet onboarded */}
    <Route path="/onboarding" element={
      <ProtectedRoute requireOnboarded={false}>
        <OnboardingPage />
      </ProtectedRoute>
    } />

    {/* Protected: must be authed + onboarded */}
    <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
    <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
    <Route path="/chat/:userId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
    <Route path="/call/:callId" element={<ProtectedRoute><CallPage /></ProtectedRoute>} />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// ── Inner app: uses hooks (must be inside QueryClientProvider + BrowserRouter) ──
const AppInner = () => {
  const { authUser } = useAuth();
  const { videoClient } = useStreamVideo(authUser);

  return (
    <VideoClientContext.Provider value={videoClient}>
      {videoClient ? (
        // When video client is ready, wrap everything in StreamVideo so
        // IncomingCallModal and CallPage can use the SDK hooks.
        <StreamVideo client={videoClient}>
          <AppRoutes />
          <IncomingCallModal />
        </StreamVideo>
      ) : (
        // Still render routes while video client initializes (no calling features yet).
        <AppRoutes />
      )}
    </VideoClientContext.Provider>
  );
};

// ── Root app ──────────────────────────────────────────────
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#efefef',
            border: '1px solid #2e2e2e',
            fontSize: 13,
            borderRadius: 10,
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
