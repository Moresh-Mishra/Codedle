import { useAuth } from "../AuthProvider.jsx";

export default function SettingsPage() {
  const { authUser, logout } = useAuth();

  return (
    <div className="bg-background text-on-surface overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 md:px-32 py-4 border-b border-outline-variant bg-surface-dim/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span className="font-headline-lg-mobile text-headline-lg-mobile font-extrabold text-primary tracking-tight">Codedle</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="material-symbols-outlined text-primary hover:text-primary-fixed-dim transition-colors" type="button">
            timer
          </button>
          {Array.from({ length: 3 }).map((_, index) => (
            <button
              key={`life-${index}`}
              className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed-dim transition-colors"
              type="button"
            >
              favorite
            </button>
          ))}
        </div>
      </header>
      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-surface-container-lowest border-r border-outline-variant w-64 pt-24 pb-8 px-4">
        <div className="flex flex-col items-center mb-10 px-4 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden mb-3">
            <img
              alt="User Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0JGvXiq6tYnbb7zOwbCkZkM8efa5avbTHIJ_-nEtFT_fxsI8X3jPQmubSy_Tes6mguV7uO3gcOS5ZocvwmBhpnA9BQFzJFdO_OBMgtKF5uHl5bWKgAliynfkBQtiHt0UeXsFBDI7EvCI6eIR1vkQkjT-MNYrzbdh_6w5WEhQm64BFLaDvp2_dO8hQOHk9n_GRr25cG4ybqkuYtgZ0kx0hf9lE-6jDjIqBKdeK0V5pjBvtV2cbUciAuUwIVyZhbC-0CpiftwnjAyM"
            />
          </div>
            <h3 className="font-headline-md text-primary">{authUser?.username ?? "System_User"}</h3>
            <p className="font-label-sm text-on-surface-variant opacity-60">{authUser?.email ?? "Level: Senior Debugger"}</p>
        </div>
        <div className="flex-1 space-y-2">
          {[
            { icon: "terminal", label: "Terminal" },
            { icon: "list_alt", label: "Logs" },
            { icon: "hub", label: "Pipes" },
            { icon: "menu_book", label: "Library" },
          ].map((item) => (
            <a
              key={item.label}
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant opacity-60 hover:bg-surface-container-high hover:text-primary transition-all"
              href="#"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-caps text-label-caps">{item.label}</span>
            </a>
          ))}
        </div>
        <div className="mt-auto px-4">
          <button className="w-full py-3 mb-3 border border-outline-variant text-on-surface-variant font-label-sm rounded-lg hover:bg-surface-container-high transition-all uppercase tracking-widest" type="button" onClick={() => logout()}>
            Logout
          </button>
          <button className="w-full py-3 bg-primary-container text-on-primary-container font-label-sm rounded-lg hover:brightness-105 transition-all uppercase tracking-widest" type="button">
            DAILY_CHALLENGE
          </button>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-margin md:pl-80 md:pr-12 min-h-screen">
        <header className="mb-10">
          <h1 className="font-headline-xl text-headline-xl text-primary">System Settings</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Configure your terminal and environment parameters.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <section className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-secondary">person_outline</span>
              <h2 className="font-headline-md text-headline-md text-secondary">Account Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block">
                  <span className="font-label-md text-on-surface-variant block mb-1">Display Name</span>
                  <input className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface" type="text" defaultValue="System_User" />
                </label>
                <label className="block">
                  <span className="font-label-md text-on-surface-variant block mb-1">Email Address</span>
                  <input className="w-full bg-white border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-on-surface" type="email" defaultValue="debugger@codedle.io" />
                </label>
              </div>
              <div className="flex flex-col justify-between p-6 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div>
                  <p className="font-label-md text-secondary font-bold mb-2">PRO STATUS</p>
                  <p className="font-body-md text-on-surface-variant">Your current debugging level is Senior. Access all advanced terminal pipes.</p>
                </div>
                <button className="mt-4 px-6 py-2 border border-secondary text-secondary font-label-md rounded-lg hover:bg-secondary/5 transition-all w-fit" type="button">
                  Manage Subscription
                </button>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-outline-variant flex justify-end gap-4">
              <button className="px-6 py-3 font-label-md text-on-surface-variant hover:text-on-surface transition-colors" type="button">
                Discard Changes
              </button>
              <button className="px-8 py-3 bg-secondary text-on-secondary font-label-md rounded-lg hover:brightness-110 transition-all shadow-md" type="button">
                Update Account
              </button>
            </div>
          </section>
          <section className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-secondary">tune</span>
              <h2 className="font-headline-md text-headline-md text-secondary">Preferences</h2>
            </div>
            <div className="space-y-8 flex-1">
              <div>
                <span className="font-label-md text-on-surface-variant block mb-4 uppercase tracking-tight opacity-70">Challenge Level</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "DEBUG" },
                    { label: "COMPILED", active: true },
                    { label: "RUNTIME" },
                  ].map((level) => (
                    <button
                      key={level.label}
                      className={`py-2 px-3 border rounded-lg text-label-sm font-bold transition-all ${
                        level.active
                          ? "border-primary-container bg-primary-container text-on-primary-container shadow-sm"
                          : "border-outline-variant text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"
                      }`}
                      type="button"
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-label-md text-on-surface font-bold">Audio Feedback</h4>
                  <p className="text-xs text-on-surface-variant">Play sounds on success/error</p>
                </div>
                <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                  <input defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-outline-variant checked:border-secondary transition-all" id="sound" name="sound" type="checkbox" />
                  <label className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-container-highest cursor-pointer transition-colors" htmlFor="sound"></label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-label-md text-on-surface font-bold">Clinical Light Mode</h4>
                  <p className="text-xs text-on-surface-variant">Optimized for day reading</p>
                </div>
                <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                  <input defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-outline-variant checked:border-secondary transition-all" id="theme" name="theme" type="checkbox" />
                  <label className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-container-highest cursor-pointer transition-colors" htmlFor="theme"></label>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-outline-variant">
              <button className="w-full py-3 bg-primary-container text-on-primary-container font-label-md rounded-lg hover:brightness-105 transition-all" type="button">
                Reset Defaults
              </button>
            </div>
          </section>
          <section className="md:col-span-12 bg-white border border-secondary-container/50 rounded-xl p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-secondary">notifications_active</span>
                <h2 className="font-headline-md text-headline-md text-secondary">Notification Settings</h2>
              </div>
              <p className="font-body-md text-on-surface-variant">Control how and when the system alerts you of new daily challenges or library updates.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full md:w-auto">
              {[
                { id: "push", label: "Push Alerts", checked: true },
                { id: "email-notif", label: "Email Digests", checked: false },
                { id: "update-notif", label: "System Updates", checked: true },
              ].map((option) => (
                <div key={option.id} className="flex items-center gap-4 bg-surface px-4 py-3 rounded-lg border border-outline-variant">
                  <input defaultChecked={option.checked} className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary" id={option.id} type="checkbox" />
                  <label className="font-label-md text-on-surface" htmlFor={option.id}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </section>
          <section className="md:col-span-12 bg-error-container/20 border border-error/20 rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="font-headline-md text-error">Danger Zone</h3>
              <p className="font-body-md text-on-surface-variant">Permanently delete your system logs and user data. This action is irreversible.</p>
            </div>
            <button className="px-8 py-3 border border-error text-error font-label-md rounded-lg hover:bg-error hover:text-white transition-all" type="button">
              Wipe System Data
            </button>
          </section>
        </div>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center py-3 px-4 z-50">
        {[
          { icon: "terminal", label: "Term" },
          { icon: "list_alt", label: "Logs" },
          { icon: "settings", label: "Set", active: true },
          { icon: "menu_book", label: "Lib" },
        ].map((item) => (
          <a
            key={item.label}
            className={`flex flex-col items-center gap-1 ${item.active ? "text-primary" : "text-on-surface-variant opacity-60"}`}
            href="#"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
