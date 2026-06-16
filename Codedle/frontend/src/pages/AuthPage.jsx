import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthProvider.jsx";
import { FadeIn } from "../components/ui/FadeIn.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Lock, Mail, User, ChevronRight, Terminal } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-4 overflow-x-hidden bg-background">
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
            className="absolute w-[1px] h-full opacity-[0.05] bg-primary"
            style={{ left: `${left}%` }}
          />
        ))}
      </div>
      <main className="w-full max-w-[440px] z-10">
        <FadeIn direction="down">
          <header className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-primary/20 group hover:scale-105 transition-transform">
              <Terminal className="text-primary" size={32} />
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Codedle
            </h1>
            <p className="font-body-md text-body-md text-secondary mt-1 opacity-80">
              The Debugger's Sanctuary
            </p>
          </header>
        </FadeIn>

        <Card title={tab === "login" ? "System Access" : "Initialize Account"}>
          <div className="flex p-1 bg-surface-muted rounded-lg mb-8">
            <button
              className={`flex-1 py-2 rounded-md font-label-sm text-label-sm transition-all duration-200 ${
                tab === "login" ? "bg-surface-paper text-primary shadow-sm" : "text-secondary hover:text-on-surface"
              }`}
              onClick={() => setSearchParams({ tab: "login" })}
              type="button"
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-md font-label-sm text-label-sm transition-all duration-200 ${
                tab === "signup" ? "bg-surface-paper text-primary shadow-sm" : "text-secondary hover:text-on-surface"
              }`}
              onClick={() => setSearchParams({ tab: "signup" })}
              type="button"
            >
              Create Account
            </button>
          </div>

          <form
            className="space-y-5"
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
            {tab === "signup" && (
              <div className="space-y-2">
                <label htmlFor="username" className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" size={18} />
                  <Input
                    className="pl-10"
                    id="username"
                    placeholder="system_user"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    type="text"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">
                System Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" size={18} />
                <Input
                  className="pl-10"
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
                <label htmlFor="password" className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">
                  Access Token
                </label>
                <a className="text-[10px] font-label-sm text-primary uppercase hover:underline" href="#">
                  Reset?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" size={18} />
                <Input
                  className="pl-10 pr-10"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                />
              </div>
            </div>

            <Button
              className="w-full py-4"
              disabled={isSubmitting}
              type="submit"
            >
              <span>{isSubmitting ? "Working..." : tab === "login" ? "Execute Login" : "Initialize Account"}</span>
              <ChevronRight size={18} />
            </Button>

            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-surface-outline"></div>
              <span className="flex-shrink mx-4 font-label-sm text-label-sm text-secondary uppercase">
                Integrated Ops
              </span>
              <div className="flex-grow border-t border-surface-outline"></div>
            </div>

            <Button
              variant="outline"
              className="w-full py-4 flex items-center justify-center gap-2"
              type="button"
            >
              <svg
                height="18"
                width="18"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>Login with GitHub</span>
            </Button>
          </form>
        </Card>

        <div className="mt-8 flex justify-center items-center gap-4 text-secondary font-label-sm text-label-sm uppercase tracking-widest opacity-60">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            API ONLINE
          </span>
          <span className="h-1 w-1 bg-surface-outline rounded-full"></span>
          <span>VER 2.4.0-STABLE</span>
        </div>
      </main>
    </div>
  );
}
