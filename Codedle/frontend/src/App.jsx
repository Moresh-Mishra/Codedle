import { BrowserRouter, NavLink, Link, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthProvider.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import TerminalPage from "./pages/TerminalPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import TimeAttackPage from "./pages/TimeAttackPage.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
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
    <div className="flex flex-wrap items-center gap-2 rounded-full border border-outline-variant bg-transparent px-2 py-1 shadow-sm">
      {links.map((link) =>
        isAuthenticated ? (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest transition-all border ${
                isActive
                  ? "bg-primary text-on-primary border-primary shadow-sm"
                  : "bg-transparent text-on-surface-variant border-transparent hover:border-primary hover:text-primary"
              }`
            }
          >
            {link.label}
          </NavLink>
        ) : (
          <Link
            key={link.to}
            to={link.to}
            className="px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest transition-all border bg-transparent text-on-surface-variant border-transparent hover:border-primary hover:text-primary"
          >
            {link.label}
          </Link>
        )
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background text-on-surface">
        <div className="sticky top-0 z-[100] border-b border-outline-variant bg-surface-dim/60 backdrop-blur-2xl">
          <div className="max-w-container-max mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
              </div>
              <div className="leading-tight">
                <div className="font-headline-md text-headline-md text-primary tracking-tight">Codedle</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">UI Console</div>
              </div>
            </div>
            <NavLinks />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <TerminalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/terminal"
            element={
              <ProtectedRoute>
                <TerminalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/time-attack"
            element={
              <ProtectedRoute>
                <TimeAttackPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
