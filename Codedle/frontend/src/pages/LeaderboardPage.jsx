import { useState } from "react";
import { Link } from "react-router-dom";
import { FadeIn } from "../components/ui/FadeIn.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Timer, Heart, Terminal, Trophy, List, GitFork, BookOpen } from "lucide-react";

export default function LeaderboardPage() {
  const [tab, setTab] = useState("daily");

  return (
    <div className="bg-background">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-32 py-4 border-b border-surface-outline bg-surface/60 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span className="font-headline-lg text-headline-lg font-extrabold text-primary tracking-tight">Codedle</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-secondary hover:text-primary transition-colors" type="button">
            <Timer size={20} />
          </button>
          <button className="text-secondary hover:text-primary transition-colors" type="button">
            <Heart size={20} />
          </button>
          <div className="w-10 h-10 rounded-full border border-surface-outline bg-surface overflow-hidden shadow-sm">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnGgahbBDrFwBHiYNXYZc_074OTLA1d3tL3ldtU_rx3aFdabe6gWG1Jiximh3Ujlhluo-tXu1ffq5Wki1nCqjXm7oPGwKt8tpdCcaGUBbKIdUAzpGtVWBP7EPul6azLNMgcDFZwW-4dFwBGm3r0QQ_yAhGOthmw9hF9TLE9NZJp8DvPybSpxGr4-KH1uemTcL8vlQHh58asGupTUinLHTVHgcYGgceNrKRjlL4EH9xo6giSPNKspl9RLZrKj-d5C_52CZZTmm4x7Q"
            />
          </div>
        </div>
      </header>

      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-surface-paper border-r border-surface-outline w-64 pt-24 pb-8">
        <div className="px-6 mb-10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-muted border border-surface-outline">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Terminal size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="font-label-md text-label-md text-on-surface truncate">System_User</p>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Senior Debugger</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 px-4">
          {[
            { label: "Terminal", icon: <Terminal size={18} />, path: "/terminal" },
            { label: "Leaderboard", icon: <Trophy size={18} />, path: "/leaderboard", active: true },
            { label: "Logs", icon: <List size={18} />, path: "/logs" },
            { label: "Pipes", icon: <GitFork size={18} />, path: "/pipes" },
            { label: "Library", icon: <BookOpen size={18} />, path: "/library" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? "text-primary bg-primary/10 font-bold"
                  : "text-secondary opacity-60 hover:bg-surface-variant hover:text-primary"
              }`}
            >
              {item.icon}
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="px-4 mt-auto">
          <Button className="w-full py-4 uppercase tracking-widest text-[12px] font-bold">
            DAILY_CHALLENGE
          </Button>
        </div>
      </nav>

      <main className="md:ml-64 pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-container-max mx-auto">
          <FadeIn direction="down">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-1">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Global Leaderboard</h1>
                <p className="font-body-md text-body-md text-secondary">Analyze system performance rankings and maintain your streak.</p>
              </div>
              <div className="flex p-1 bg-surface-muted rounded-full border border-surface-outline w-fit">
                {[
                  { key: "daily", label: "Daily" },
                  { key: "weekly", label: "Weekly" },
                  { key: "all", label: "All-Time" },
                ].map((item) => (
                  <button
                    key={item.key}
                    className={`px-6 py-2 rounded-full font-label-md text-label-sm transition-all ${
                      tab === item.key
                        ? "bg-surface-paper text-primary shadow-sm"
                        : "text-secondary hover:text-on-surface"
                    }`}
                    onClick={() => setTab(item.key)}
                    type="button"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-3 items-end gap-2 md:gap-8 mb-16 max-w-4xl mx-auto podium-gradient p-8 rounded-3xl border border-primary/5 relative">
            {[
              {
                rank: 2,
                name: "async_queen",
                score: "2,840",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-9Q-v2K1J_ov7qXrlY-XIgUTRf0BGXcUAVpgOG4TXyCieCYKEvmqnt7qHWlKblDYp2HveVgmN1o7Cs8PWxg21vAUOxPRHiTUfBG-zda1d1HBITSB7X13nxg7qOw2oiMHxVzluJdUZ-bojX0YV3ZscIarZH9nykzaeDwn2WPweUWTI-vmkCrtfIq56zGGNxV9H78pn1r-DQCvMQXBAY_pZQ6gdNBugXty4aqzPFr4WosG2LRQOTzEcj7JbUDPy5lv60kzdGoCG7GY",
                border: "border-secondary",
                badge: "bg-secondary text-secondary-foreground",
                glow: "bg-secondary",
              },
              {
                rank: 1,
                name: "null_pointer",
                score: "3,120",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBePddsi9Al-dlvg6ERCGhr_F4T0TsYnHDEyPhpWPSxzsZkM62kZ2OI8L5BBfdv6xafb_4JVCrGcIOVDbc5vHYYeArp9sdJjN9QZ2Haoebm8SbL0xXhDk4st1lPRAyjrVGILX5SkQg-mVPISYD_uL_ZeOja4qaw2UeNWdwZKAHJ2qDI7_jKw8ZxDBcPMdrDDePuY9Wk-60zI0xl",
                border: "border-primary",
                badge: "bg-primary text-primary-foreground",
                glow: "bg-primary",
              },
              {
                rank: 3,
                name: "byte_master",
                score: "2,615",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8LCdqNs-37nEqX8kqAeNGUfCVtmP9FWLmf-POvYmTxR6xGOvX_cPYcxZW1_5tK9jjjKsx-6RdQGnklN-R_UHfg01X9RPj6GS5uilaSLnb27saBhTJhLiU5_6NazQkmNn2-3NTtz64QyaDTNGBTf5xAt_xl",
                border: "border-secondary",
                badge: "bg-secondary text-secondary-foreground",
                glow: "bg-secondary",
              },
            ].map((user) => (
              <FadeIn key={user.rank} delay={0.2 * user.rank}>
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 group">
                    <div className={`absolute -inset-1 ${user.glow} blur opacity-25 group-hover:opacity-50 transition duration-1000`}></div>
                    <div className={`relative w-16 h-16 md:w-24 md:h-24 rounded-full border-4 ${user.border} overflow-hidden bg-surface shadow-sm`}>
                      <img alt={`Rank ${user.rank}`} className="w-full h-full object-cover" src={user.img} />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${user.badge} flex items-center justify-center font-bold text-sm border-2 border-white`}>
                      {user.rank}
                    </div>
                    {user.rank === 1 && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                        <Trophy className="text-primary" size={32} />
                      </div>
                    )}
                  </div>
                  <span className="font-label-md text-label-md text-on-surface">{user.name}</span>
                  <span className={`font-headline-md text-headline-md ${user.rank === 1 ? "text-primary" : "text-secondary"}`}>{user.score}</span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="grid grid-cols-12 px-8 py-3 font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                <div className="col-span-1">Rank</div>
                <div className="col-span-6">User</div>
                <div className="col-span-2 text-right">Streak</div>
                <div className="col-span-3 text-right">Points</div>
              </div>
              {[
                {
                  rank: 4,
                  name: "overflow_ninja",
                  streak: "12d",
                  score: "2,420",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBny5oUmvQWc-8mx1RCYacVLteQ8cRbsbVZLKWKB4p8M23zTh_klYkRRYTTbH9DOugAktYqVr35cn8_XkYZreKjGixJHusJF3_O-HzY34kTzHcRtqdaFHujhIO1NXZB-ikZcbwZTBRLSEZ19_Wg6zYvXgIQlx8NiJVxHxiYJtkZtIv7EsuJRRMxQJmdih1A4fDpGfZQWTNkCFVBC9cbXRKt0PXTqk4H427E4xuiMDqaPsprv6P33Gs09bKaRG9YajMl4jtdSr104Uo",
                },
                {
                  rank: 5,
                  name: "System_User",
                  streak: "8d",
                  score: "2,385",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0MIPB8kdyIBrx9n1E113X8sPdqB0ifRt9YesFa8HBxnDikn59_K5IRUk5jhTvg5tJI8gzQS9rG0TAbS4cytM8-ZqYlN47uj6FqbeZ85ZljSI-dlYQITQcpl02L-t0toInIi6sHvn91zLRJzs_ydAp6B4AERp_RDG26SVuCYUbc4lX3x4iwuM_PAfxNpwzYaigteKmxA8wvOf_cCbdit6aEi8Ofd91ut5CdyOEZlyECnTFzoC0EUX3UxAAifFZjyTv0V-H4SwUyrg",
                  highlight: true,
                },
                {
                  rank: 6,
                  name: "syntax_error_01",
                  streak: "5d",
                  score: "2,210",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9nuw9j81B08K89jf03eqyC-qkvT-R9qq4jN_nUwEUowtlITssmdP3PkpcyrX3xl",
                },
                {
                  rank: 7,
                  name: "git_push_hard",
                  streak: "2d",
                  score: "2,150",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSUOGVWtks2-IAsUNS8jJIklpvoSkfjAv_csAC-HoRpwDZPT654FlzJWU0qtOpmHTZl3rrkSnUHpqwuEizBTdoH3590meNkfJB0ogHVNPyDxLGKO9Y6e7V_NWOhSwVodSRxfsE62da0sBYKqcx0LxBHZGkdwycH_kMtOprZSOY7ckMgwoVCpFKGRmG78Qs9tQSmErxoQb7UOlPzq-jnmvnwaIvmS1X-oKjM3C0jzQhOV9pv2i6ky8h-W0jnquQj0rSTDMLGYPal0U",
                },
              ].map((row) => (
                <div
                  key={row.rank}
                  className={`grid grid-cols-12 items-center px-8 py-4 rounded-xl transition-all cursor-pointer group ${
                    row.highlight
                      ? "bg-primary/10 border-2 border-primary shadow-sm relative"
                      : "bg-surface-paper border border-surface-outline hover:border-primary hover:bg-surface-muted"
                  }`}
                >
                  {row.highlight && (
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full uppercase tracking-tight">
                      You
                    </div>
                  )}
                  <div className={`col-span-1 font-headline-md text-headline-md ${row.highlight ? "text-primary" : "text-secondary group-hover:text-primary"}`}>
                    {row.rank}
                  </div>
                  <div className="col-span-6 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full border ${row.highlight ? "border-primary" : "border-surface-outline"} overflow-hidden`}>
                      <img alt={row.name} className="w-full h-full object-cover" src={row.img} />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-label-md text-label-md text-on-surface block truncate">{row.name}</span>
                      {row.highlight && <span className="text-[10px] text-primary font-bold uppercase">Senior Debugger</span>}
                    </div>
                  </div>
                  <div className="col-span-2 text-right flex justify-end items-center gap-1">
                    <span className={`font-label-md text-label-md ${row.highlight ? "text-primary" : "text-secondary"}`}>{row.streak}</span>
                    <span className={`text-sm ${row.highlight ? "text-primary" : "text-secondary"}`}>🔥</span>
                  </div>
                  <div className={`col-span-3 text-right font-headline-md text-headline-md ${row.highlight ? "text-primary" : "text-on-surface"}`}>
                    {row.score}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Button variant="outline" className="px-8 py-3 rounded-full text-secondary hover:text-primary">
                Load More Ranking Data
              </Button>
            </div>
          </FadeIn>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-dim/95 backdrop-blur-xl border-t border-surface-outline flex justify-around items-center py-3 px-2 z-50">
        {[
          { icon: <Terminal size={20} />, label: "Terminal", path: "/terminal" },
          { icon: <Trophy size={20} />, label: "Rankings", path: "/leaderboard", active: true },
          { icon: <List size={20} />, label: "Logs", path: "/logs" },
          { icon: <BookOpen size={20} />, label: "Library", path: "/library" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors ${item.active ? "text-primary" : "text-secondary opacity-60"}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
