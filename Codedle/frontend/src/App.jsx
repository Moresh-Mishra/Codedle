import { BrowserRouter, NavLink, Link, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthProvider.jsx";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/ui/PageTransition.jsx";
import { LoadingScreen } from "./components/ui/LoadingScreen.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import TerminalPage from "./pages/TerminalPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import TimeAttackPage from "./pages/TimeAttackPage.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function NavLinks() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const links = isAuthenticated
    ? [
        { to: "/terminal", label: "Terminal" },
        { to: "/leaderboard", label: "Leaderboard" },
        { to: "/time-attack", label: "Time Attack" },
        { to: "/settings", label: "Settings" },
      ]
    : [
        { to: "/auth?tab=login", label: "Login" },
        { to: "/auth?tab=signup", label: "Signup" },
      ];

  return (
    <div className="flex items-center gap-1 rounded-full border border-surface-outline bg-surface-dim/50 backdrop-blur-md px-1.5 py-1">
      {links.map((link) =>
        isAuthenticated ? (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-full text-label-sm uppercase tracking-widest transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-variant"
              }`
            }
          >
            {link.label}
          </NavLink>
        ) : (
          <Link
            key={link.to}
            className="px-3 py-1.5 rounded-full text-label-sm uppercase tracking-widest transition-all duration-200 text-on-surface-variant hover:text-primary hover:bg-surface-variant"
            to={link.to}
          >
            {link.label}
          </Link>
        )
      )}
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <TerminalPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/terminal"
          element={
            <ProtectedRoute>
              <PageTransition>
                <TerminalPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <LeaderboardPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageTransition>
                <SettingsPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/time-attack"
          element={
            <ProtectedRoute>
              <PageTransition>
                <TimeAttackPage />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background text-on-surface">
          <div className="sticky top-0 z-[100] border-b border-surface-outline bg-surface/60 backdrop-blur-xl">
            <div className="max-w-container-max mx-auto flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm group cursor-pointer hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
                </div>
                <div className="leading-tight">
                  <div className="font-headline-md text-headline-md text-on-surface tracking-tight">Codedle</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label-caps">UI Console</div>
                </div>
              </div>
              <NavLinks />
            </div>
          </div>
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
