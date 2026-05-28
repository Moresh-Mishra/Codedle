import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider.jsx";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-background text-on-surface">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-24 py-4 border-b border-outline-variant bg-surface-dim/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="font-display-lg-mobile text-display-lg-mobile font-extrabold text-primary tracking-tight" style={{ fontSize: "24px" }}>
            Codedle
          </span>
        </div>
        {isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-8">
            <Link className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors" to="/terminal">
              Terminal
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary-fixed-dim transition-colors" to="/leaderboard">
              Leaderboard
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary-fixed-dim transition-colors" to="/time-attack">
              Time Attack
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary-fixed-dim transition-colors" to="/settings">
              Settings
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-8">
            <Link className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors" to="/auth?tab=login">
              Login
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary-fixed-dim transition-colors" to="/auth?tab=signup">
              Signup
            </Link>
          </nav>
        )}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
                timer
              </span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
                favorite
              </span>
              <Link className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md font-bold hover:brightness-95 transition-all" to="/terminal">
                DAILY_CHALLENGE
              </Link>
            </>
          ) : (
            <>
              <Link className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-md text-label-md font-bold hover:brightness-95 transition-all" to="/auth?tab=login">
                Login
              </Link>
              <Link className="bg-surface-container-lowest text-secondary border border-outline-variant px-6 py-2 rounded-lg font-label-md text-label-md font-bold hover:bg-surface-container transition-colors" to="/auth?tab=signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="pt-24">
        <section className="relative min-h-[819px] flex flex-col items-center justify-center text-center px-margin py-20 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-20"></div>
          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/30 border border-secondary/20 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-primary node-pulse"></span>
              <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
                System Online: Challenge #412
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl md:text-[80px] text-on-background leading-tight">
              Decode the <span className="text-primary italic">System.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              A daily mystery for the curious developer. Trace the logic, find the variable, and restore the pipeline.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10">
              <Link className="bg-primary-container text-on-primary-container px-10 py-4 rounded-xl font-headline-md text-headline-md shadow-lg hover:scale-[1.02] transition-transform flex items-center gap-3" to="/terminal">
                Start Daily Challenge
                <span className="material-symbols-outlined">terminal</span>
              </Link>
              <Link className="bg-surface-container-lowest text-secondary border border-outline-variant px-10 py-4 rounded-xl font-headline-md text-headline-md hover:bg-surface-container transition-colors" to="/auth?tab=login">
                Login
              </Link>
              <Link className="bg-primary-container text-on-primary-container px-10 py-4 rounded-xl font-headline-md text-headline-md shadow-lg hover:scale-[1.02] transition-transform flex items-center gap-3" to="/auth?tab=signup">
                Signup
                <span className="material-symbols-outlined">person_add</span>
              </Link>
            </div>
          </div>
        </section>
        <section className="px-margin py-20 max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-7 bg-white border border-outline-variant rounded-xl p-8 relative overflow-hidden h-[500px]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline-md text-headline-md text-secondary">System Pipeline</h3>
                <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-3 py-1 rounded">
                  Status: <span className="text-error font-bold">FAULTY</span>
                </span>
              </div>
              <div className="relative h-full flex flex-col justify-center items-center">
                <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 600 300">
                  <path d="M50,150 L150,150 L250,80 L350,220 L450,150 L550,150" fill="none" stroke="#d1fae5" strokeWidth="4"></path>
                  <path className="pipeline-flow" d="M50,150 L150,150 L250,80 L350,220 L450,150 L550,150" fill="none" stroke="#84cc16" strokeDasharray="10,500" strokeWidth="4"></path>
                </svg>
                <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-bold">01</div>
                  <span className="font-label-sm text-label-sm mt-2">Input</span>
                </div>
                <div className="absolute left-[240px] top-[70px] flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold border-4 border-white shadow-md">?</div>
                  <span className="font-label-sm text-label-sm mt-2 text-primary">Logic Filter</span>
                </div>
                <div className="absolute left-[340px] bottom-[70px] flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-error/20 border-2 border-error text-error flex items-center justify-center font-bold">!!</div>
                  <span className="font-label-sm text-label-sm mt-2 text-error">Memory Leak</span>
                </div>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center font-bold opacity-50">04</div>
                  <span className="font-label-sm text-label-sm mt-2 opacity-50">Output</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 bg-[#1e293b] rounded-xl p-0 shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-[#0f172a] px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-slate-400 font-mono ml-4">validator.js</span>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed text-slate-300">
                <div className="flex gap-4">
                  <span className="text-slate-600 text-right w-4">12</span>
                  <code className="text-blue-400">
                    function <span className="text-yellow-300">validatePipeline</span>(node) {"{"}
                  </code>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 text-right w-4">13</span>
                  <code className="ml-4 text-purple-400">const <span className="text-slate-300">threshold</span> = 0.85;</code>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 text-right w-4">14</span>
                  <code>&nbsp;</code>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 text-right w-4">15</span>
                  <code className="ml-4 text-blue-400">
                    if <span className="text-slate-300">(node.load &gt; threshold) {"{"}</span>
                  </code>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 text-right w-4">16</span>
                  <code className="ml-8 text-pink-400">return <span className="bg-primary/20 border-b-2 border-primary px-2 text-white italic">______</span>;</code>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 text-right w-4">17</span>
                  <code className="ml-4 text-slate-300">{"}"}</code>
                </div>
                <div className="mt-8 flex flex-col gap-4">
                  <span className="text-xs text-slate-500 font-sans italic">
                    // Trace the logic above. What value restores the pipeline?
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-slate-700 hover:bg-primary transition-colors text-white py-2 rounded-lg text-xs font-sans" type="button">
                      "RETRY"
                    </button>
                    <button className="bg-slate-700 hover:bg-primary transition-colors text-white py-2 rounded-lg text-xs font-sans" type="button">
                      "FAILED"
                    </button>
                    <button className="bg-slate-700 hover:bg-primary transition-colors text-white py-2 rounded-lg text-xs font-sans" type="button">
                      "CRITICAL"
                    </button>
                    <button className="bg-primary-container text-on-primary-container py-2 rounded-lg text-xs font-sans font-bold" type="button">
                      "DROPPED"
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-surface-container-low py-24 px-margin">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-headline-lg text-headline-lg text-on-background">Engineered for Accuracy</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">The definitive mental gym for software engineers.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "calendar_today",
                  title: "Daily Logic",
                  text: "New hand-crafted challenges every 24 hours across Python, JS, Rust, and System Architecture.",
                },
                {
                  icon: "timer",
                  title: "Time Attack",
                  text: "Compete against the clock. Precision is key, but speed defines the senior debuggers.",
                },
                {
                  icon: "leaderboard",
                  title: "Global Ranks",
                  text: "Climb the leaderboard and earn clinical-grade badges to showcase your debugging prowess.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white p-8 rounded-xl border border-outline-variant hover:border-primary transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                      {item.icon}
                    </span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-secondary mb-3">{item.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 px-margin border-y border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCVYLu93Jl49cm2_HPshy9BKgio6NRUKc-5QPmRN8Sxy2muLGX9jCnH5tuB_4k0qvDcgOKSCxW0cevaHA8hexL0ZuQSbXuE_WX60ZFwF6HPUN9DyoHnm62Gwe8Zqg4YmY8nfmIL8JHR0utJ3kQUkMpIpocsE4dChjN7UO8aQomHEnMN04L_4KzzM4WCOkplkImq_EtR_gnCe8gNTWcpspQIZSJ43RcL-0o3zn__GkpMctSbm2IdTsSxxTHMZCLP5d6olobcpah8l94",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCegCtb4q8hmrqViKW_pV1Fo3XHNlAvuhtR8WFMKIMWToBK0TQlUhI2h0RAXacbM3D8kVwwFHEUwTILBoR2rlu-yK7ftTWjiXnrWuq2yXS_8tvqYc-p4bJcaZTgCk5OyUyVS-xvBLZX_xg2lJTfNBnVayXSqQDZsVXkLlWQEVEXmGAOieB8fW6XFggN0cXENrM35TsqFT8LoiV58iA_OgCYgxUGydoGgQYOeaTIu2xX4GbZG4EBFO_d4j_GInmBt18agFinOn1hl8A",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuADG2322PcJeSaqQAuZAkXU7-debsnzaq-bwQBQi_wEndvDCL2AhN8xdxQ4b_HBHKEDi1dYhWJdQY08ufXktT8W5hChDQl6GbSiayQKq9A9mL2v43d2HOKk8tt-q6LBQIofo8WXseKKOgoCQXYD5s33fV-Mx9BgwpxwH5BmVLz_qbq_-gqMLrZqSu5SVjknHco27GA-bSfgh0Km9kNEWT-DQF2wkrt0TbKZG6EE5_Wktj72Akd6lJMSIwT0ml_lq4IV4pZ2UCE0GvI",
                ].map((src) => (
                  <img
                    key={src}
                    className="w-12 h-12 rounded-full border-2 border-white bg-surface-dim"
                    src={src}
                    alt=""
                  />
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface">
                Join <span className="font-bold text-primary">50,000+ debuggers</span> solving the mystery today.
              </p>
            </div>
            <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
              <span className="font-extrabold text-2xl">STACK</span>
              <span className="font-extrabold text-2xl">CLOUDFLARE</span>
              <span className="font-extrabold text-2xl">VERCEL</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-surface py-16 px-margin">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <span className="font-display-lg-mobile text-display-lg-mobile font-extrabold text-primary tracking-tight" style={{ fontSize: "28px" }}>
              Codedle
            </span>
            <p className="font-label-sm text-label-sm text-on-surface-variant max-w-xs">
              The premium daily challenge for developers who live in the terminal.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            {[
              {
                title: "Product",
                links: ["Terminal", "Library", "API"],
              },
              {
                title: "Company",
                links: ["About", "Careers"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms"],
              },
            ].map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <span className="font-label-sm text-label-sm font-bold text-secondary uppercase">
                  {section.title}
                </span>
                {section.links.map((link) => (
                  <a
                    key={link}
                    className="font-label-md text-label-md text-on-surface-variant hover:text-primary"
                    href="#"
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-outline-variant flex justify-between items-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Copyright 2024 Codedle System. All rights reserved.
          </span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">
              language
            </span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">
              shield
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
