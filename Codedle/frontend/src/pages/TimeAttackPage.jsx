import { useEffect, useState } from "react";

export default function TimeAttackPage() {
  const [timeLeft, setTimeLeft] = useState(5984);
  const [multiplier, setMultiplier] = useState(4.82);
  const [score, setScore] = useState(12450);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      if (Math.random() > 0.8) {
        setMultiplier(Number((4.5 + Math.random() * 0.5).toFixed(2)));
      }
    }, 10);

    const scoreTimer = setInterval(() => {
      setScore((prev) => prev + Math.floor(Math.random() * 10));
    }, 500);

    const toastTimer = setTimeout(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(scoreTimer);
      clearTimeout(toastTimer);
    };
  }, []);

  const display = (timeLeft / 100).toFixed(2).replace(".", ":");

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin md:px-margin py-4 border-b border-outline-variant bg-surface-dim/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <h1 className="font-display-lg-mobile text-display-lg-mobile font-extrabold text-primary tracking-tight">Codedle</h1>
          <div className="hidden md:flex items-center gap-6 ml-8">
            <span className="text-primary font-label-md cursor-pointer hover:text-primary-fixed-dim transition-colors">Terminal</span>
            <span className="text-on-surface-variant font-label-md cursor-pointer hover:text-primary-fixed-dim transition-colors">Logs</span>
            <span className="text-on-surface-variant font-label-md cursor-pointer hover:text-primary-fixed-dim transition-colors">Pipes</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container px-4 py-2 rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-primary mr-2">timer</span>
            <span className="font-mono font-bold text-headline-md text-primary timer-glow">00:{display.padStart(5, "0")}</span>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <span key={`life-${index}`} className="material-symbols-outlined text-on-surface-variant">
                favorite
              </span>
            ))}
          </div>
        </div>
      </header>
      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-surface-container-lowest border-r border-outline-variant w-64 pt-24 pb-8 px-4">
        <div className="flex flex-col gap-2 mb-auto">
          {[
            { icon: "terminal", label: "Terminal", active: true },
            { icon: "list_alt", label: "Logs" },
            { icon: "hub", label: "Pipes" },
            { icon: "menu_book", label: "Library" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                item.active
                  ? "text-primary border-r-2 border-primary bg-primary/10"
                  : "text-on-surface-variant opacity-60 hover:bg-surface-container-high hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
          <div className="flex items-center gap-3 mb-3">
            <img
              alt="User"
              className="w-10 h-10 rounded-full bg-secondary-container"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6viQHTf-7bpthrbv3S9MTUYScJxNSq15fH0kn-RcjKL3EOh4BAX5fWx7CImc66qnmCpjCulredtZrqjVjZFr95HCt7oZg_29laC2ICPLqumZJu7Xl_m8z-3ctu3ioTeFZHzMGmEETiibnn8Pzpw5GVDjazV-4Z41IIrJ9KeInonZoFPJjZ5iXcr83aXVmNjT-czFu097vDKGRk95gJw-KPgX5fl98pLJI2q1di4RuORTWUpzKyHrfQYN_HZGdiClBM79RFiyqpZk"
            />
            <div>
              <p className="font-label-md text-on-surface font-bold">System_User</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-tight">Senior Debugger</p>
            </div>
          </div>
          <button className="w-full py-2 bg-primary text-on-primary font-bold text-label-sm rounded-lg hover:scale-95 transition-transform" type="button">
            DAILY_CHALLENGE
          </button>
        </div>
      </nav>
      <main className="md:ml-64 pt-24 px-margin-mobile md:px-margin pb-12 flex flex-col gap-6 max-w-container-max mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex items-center justify-between overflow-hidden relative group">
            <div className="absolute inset-0 pipeline-flow opacity-30 pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="font-label-sm text-secondary uppercase tracking-[0.2em] mb-1">Current Pipeline Velocity</h2>
              <p className="font-headline-xl text-primary leading-none">OVERCLOCKED</p>
            </div>
            <div className="relative z-10 text-right">
              <p className="font-label-sm text-on-surface-variant uppercase mb-1">Multiplier</p>
              <span className="font-mono font-extrabold text-headline-xl text-secondary">x{multiplier.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-primary text-on-primary p-6 rounded-xl border border-primary shadow-lg shadow-primary/10 flex flex-col justify-center items-center">
            <p className="font-label-sm uppercase tracking-widest opacity-80 mb-2">Total Score</p>
            <p className="font-headline-xl font-bold tracking-tight">{score.toLocaleString()}</p>
          </div>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4 text-secondary">
                <span className="material-symbols-outlined">terminal</span>
                <h3 className="font-headline-md">Task: Optimize Recursion</h3>
              </div>
              <p className="text-on-surface-variant body-md mb-6">
                Identify the bottleneck in the following tree traversal algorithm. Efficiency is paramount for the Time Attack cycle.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "ALGO_HIGHT",
                  "RECURSION",
                  "+2000 XP",
                ].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl flex-grow overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[80px]">hub</span>
              </div>
              <h3 className="font-label-sm text-on-surface-variant uppercase mb-4 tracking-widest">Active Stream</h3>
              <div className="space-y-3 font-mono text-[12px] text-secondary/70">
                {[
                  ["BUFF_ALLOC: 0x4F22", "OK"],
                  ["THREAD_SYNC: PID_991", "ACTIVE"],
                  ["V_MEMORY: 12.4GB", "PEAK"],
                  ["DEBUG_MODE: TRUE", "WARN"],
                ].map(([label, status]) => (
                  <div key={label} className="flex justify-between items-center border-b border-outline-variant pb-2">
                    <span>{label}</span>
                    <span className={status === "WARN" ? "text-error" : status === "PEAK" ? "text-secondary-fixed-dim" : "text-primary"}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 bg-inverse-surface text-inverse-on-surface rounded-xl overflow-hidden flex flex-col shadow-2xl border border-outline shadow-primary/5">
            <div className="flex items-center justify-between px-6 py-3 bg-on-surface-variant/20 border-b border-on-surface-variant/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
              </div>
              <span className="font-mono text-label-sm opacity-60 italic">traversal_engine.rs</span>
            </div>
            <div className="p-6 font-mono text-body-md leading-relaxed terminal-scroll overflow-y-auto max-h-[500px]">
              {[
                "fn traverse_tree(node: &Node) {",
                "    if node.is_leaf() {",
                "        return node.value;",
                "    }",
                "    _ // INPUT OPTIMIZED LOGIC HERE",
                "    let results: Vec<i32> = node.children.iter()",
                "        .map(|c| traverse_tree(c))",
                "        .collect();",
                "    results.iter().sum()",
                "}",
              ].map((line, index) => (
                <div key={`${index}-${line}`} className={`flex gap-4 ${index === 4 ? "bg-primary/10 -mx-6 px-6" : ""}`}>
                  <span className="text-on-surface-variant/40 select-none">{index + 1}</span>
                  <code className={index === 0 ? "text-primary-fixed" : index === 1 ? "ml-4 text-tertiary-fixed-dim" : index === 2 ? "ml-8 text-secondary-fixed" : "ml-4"}>
                    {line}
                  </code>
                </div>
              ))}
            </div>
            <div className="mt-auto p-6 flex gap-4 bg-on-surface-variant/5">
              <input
                className="flex-grow bg-inverse-surface border border-outline-variant rounded-lg px-4 py-3 font-mono text-inverse-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder:opacity-30"
                placeholder="Type command or code snippet..."
                type="text"
              />
              <button className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg font-bold hover:bg-primary-fixed transition-colors active:scale-95 duration-200" type="button">
                EXECUTE
              </button>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl">
            <h4 className="font-label-sm text-on-surface-variant uppercase mb-4 tracking-widest">Global Ranking</h4>
            <div className="space-y-4">
              {[
                ["01", "NullPtr_Queen", "42,900"],
                ["02", "You", "12,450"],
                ["03", "Rustacean_X", "11,200"],
              ].map(([rank, name, value]) => (
                <div
                  key={rank}
                  className={`flex items-center justify-between ${rank === "02" ? "p-2 bg-secondary/5 rounded-lg border border-secondary/10" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${rank === "01" ? "text-primary" : rank === "02" ? "text-secondary" : "text-outline"}`}>{rank}</span>
                    <span className={`body-md ${rank === "02" ? "font-bold" : ""}`}>{name}</span>
                  </div>
                  <span className={`font-mono ${rank === "02" ? "text-primary font-bold" : "text-secondary"}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden relative group">
            <img
              className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_SvOj-4r0Re6KisroPdLkbvj8z2WD-6p3SOj1K70qx0Gozfvn1dBardq_6Vvz5LyiDeGbZpp_1aVeSyf3oGE_AinyyMyw6IQzKNhjYaH7hnH4J9McXYTUL2bEd62aGlQ_ugU2MR_HOydpE6d2jafjF2WHS2ZkOHtLE8dafezoTbGzyMarnhLfk7GBty4wdzXal7fhhMzyVuWwpupjoTeWAxD6IpRg6Fn8d2BZiCDAvliZEFMXFNzHl9sv7dPqIPfPpbW8GVE6uhY"
              alt=""
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-background to-transparent">
              <h4 className="font-headline-md text-primary mb-1">Infrastructure Boost</h4>
              <p className="text-label-sm text-on-surface-variant">Activate to freeze the timer for 5 seconds.</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl flex flex-col justify-between">
            <div>
              <h4 className="font-label-sm text-on-surface-variant uppercase mb-2 tracking-widest">System Health</h4>
              <div className="w-full bg-outline-variant h-2 rounded-full overflow-hidden">
                <div className="bg-primary w-4/5 h-full"></div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-end">
              <div>
                <p className="text-headline-md text-primary leading-tight">80%</p>
                <p className="text-label-sm uppercase text-secondary">Optimal</p>
              </div>
              <span className="material-symbols-outlined text-primary-fixed-dim text-[40px]">timer</span>
            </div>
          </div>
        </section>
      </main>
      <div
        className={`fixed bottom-10 right-10 bg-secondary text-on-secondary px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 transition-all duration-500 z-[100] ${
          toastVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <span className="material-symbols-outlined">check_circle</span>
        <div>
          <p className="font-bold">Logic Verified</p>
          <p className="text-sm opacity-80">+500 Multiplier Bonus</p>
        </div>
      </div>
    </div>
  );
}
