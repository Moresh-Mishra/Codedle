import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthProvider.jsx";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") === "signup" ? "signup" : "login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wires = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10,
      })),
    []
  );

  const pipes = useMemo(
    () => Array.from({ length: 6 }, () => Math.random() * 100),
    []
  );

  const { login, signup, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    setTab(searchParams.get("tab") === "signup" ? "signup" : "login");
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-x-hidden bg-surface">
      <div className="pipeline-bg" aria-hidden="true">
        {wires.map((wire, index) => (
          <div
            key={`wire-${index}`}
            className="pipeline-wire"
            style={{
              top: `${wire.top}%`,
              left: "-100%",
              "--delay": `${wire.delay}s`,
              "--duration": `${wire.duration}s`,
            }}
          />
        ))}
        {pipes.map((left, index) => (
          <div
            key={`pipe-${index}`}
            className="absolute w-[1px] h-full opacity-[0.05] bg-secondary"
            style={{ left: `${left}%` }}
          />
        ))}
      </div>
      <main className="w-full max-w-[440px] z-10">
        <header className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-4 shadow-sm border border-outline-variant">
            <span className="material-symbols-outlined text-on-primary-container text-4xl">
              terminal
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
            Codedle
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 opacity-70">
            The Debugger's Sanctuary
          </p>
        </header>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_4px_20px_rgba(22,101,52,0.04)] overflow-hidden">
          <div className="flex border-b border-outline-variant">
            <button
              className={`flex-1 py-4 font-label-md text-label-md transition-all duration-300 ${
                tab === "login" ? "tab-active" : "tab-inactive"
              }`}
              onClick={() => setSearchParams({ tab: "login" })}
              type="button"
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 font-label-md text-label-md transition-all duration-300 ${
                tab === "signup" ? "tab-active" : "tab-inactive"
              }`}
              onClick={() => setSearchParams({ tab: "signup" })}
              type="button"
            >
              Create Account
            </button>
          </div>
          <div className="p-8">
            <form
              className="space-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                setError("");
                setIsSubmitting(true);

                try {
                  if (tab === "signup") {
                    await signup({ username, email, password });
                  } else {
                    await login({ email, password });
                  }
                } catch (submitError) {
                  setError(submitError.message || "Authentication failed");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {tab === "signup" ? (
                <div className="space-y-2">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                      badge
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      id="username"
                      placeholder="system_user"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      type="text"
                    />
                  </div>
                </div>
              ) : null}
              <div className="space-y-2">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider"
                  htmlFor="email"
                >
                  System Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                    alternate_email
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    id="email"
                    placeholder="user@codedle.io"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider"
                    htmlFor="password"
                  >
                    Access Token
                  </label>
                  <a
                    className="text-[10px] font-label-sm text-primary uppercase hover:underline"
                    href="#"
                  >
                    Reset?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
                    lock
                  </span>
                  <input
                    className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    id="password"
                    placeholder="********"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>
              <button
                className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-4 rounded-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                disabled={isSubmitting}
                type="submit"
              >
                <span>{isSubmitting ? "Working..." : tab === "login" ? "Execute Login" : "Initialize Account"}</span>
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
              {error ? <p className="text-sm text-error font-medium">{error}</p> : null}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-outline-variant"></div>
                <span className="flex-shrink mx-4 font-label-sm text-label-sm text-outline uppercase">
                  Integrated Ops
                </span>
                <div className="flex-grow border-t border-outline-variant"></div>
              </div>
              <button
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-label-md text-label-md py-3 rounded-lg hover:bg-surface-container-high active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                type="button"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>Login with GitHub</span>
              </button>
            </form>
          </div>
          <footer className="bg-surface-container px-8 py-4 flex items-center justify-between border-t border-outline-variant">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="font-label-sm text-label-sm">E2E Encrypted</span>
            </div>
            <div className="flex gap-4">
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Privacy
              </a>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                Terms
              </a>
            </div>
          </footer>
        </div>
        <div className="mt-8 flex justify-center items-center gap-4 text-outline font-label-sm text-label-sm uppercase tracking-widest opacity-60">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            API ONLINE
          </span>
          <span className="h-1 w-1 bg-outline-variant rounded-full"></span>
          <span>VER 2.4.0-STABLE</span>
        </div>
      </main>
    </div>
  );
}
