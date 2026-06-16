import { useAuth } from "../AuthProvider.jsx";
import { FadeIn } from "../components/ui/FadeIn.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Bell, Trash2, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { authUser, logout } = useAuth();

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <FadeIn direction="down">
          <header className="mb-8 border-b border-surface-outline/30 pb-6">
            <h1 className="font-headline-xl text-headline-xl text-primary mb-1">System Settings</h1>
            <p className="font-body-lg text-body-lg text-secondary">Configure your terminal and environment parameters.</p>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Account Profile Card */}
          <FadeIn delay={0.1} className="md:col-span-8">
            <Card title="Account Profile" className="w-full h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden shadow-sm flex-shrink-0">
                      <img
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0JGvXiq6tYnbb7zOwbCkZkM8efa5avbTHIJ_-nEtFT_fxsI8X3jPQmubSy_Tes6mguV7uO3gcOS5ZocvwmBhpnA9BQFzJFdO_OBMgtKF5uHl5bWKgAliynfkBQtiHt0UeXsFBDI7EvCI6eIR1vkQkjT-MNYrzbdh_6w5WEhQm64BFLaDvp2_dO8hQOHk9n_GRr25cG4ybqkuYtgZ0kx0hf9lE-6jDjIqBKdeK0V5pjBvtV2cbUciAuUwIVyZhbC-0CpiftwnjAyM"
                      />
                    </div>
                    <div>
                      <h3 className="font-headline-md text-on-surface font-bold">{authUser?.username ?? "System_User"}</h3>
                      <p className="text-xs text-secondary opacity-70">{authUser?.email ?? "debugger@codedle.io"}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-secondary block" htmlFor="displayName">Display Name</label>
                    <Input id="displayName" type="text" defaultValue="System_User" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-secondary block" htmlFor="emailAddress">Email Address</label>
                    <Input id="emailAddress" type="email" defaultValue="debugger@codedle.io" />
                  </div>
                </div>

                <div className="flex flex-col justify-between p-6 bg-surface-muted rounded-xl border border-surface-outline/50">
                  <div className="space-y-1">
                    <p className="font-label-md text-primary font-bold uppercase tracking-widest">PRO STATUS</p>
                    <p className="font-body-md text-secondary">Your current debugging level is Senior. Access all advanced terminal pipes.</p>
                  </div>
                  <Button variant="outline" className="mt-4 w-fit py-2 text-xs">
                    Manage Subscription
                  </Button>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-surface-outline flex justify-between items-center gap-4">
                <Button variant="outline" className="py-3 px-6 uppercase tracking-wider text-[12px] font-bold flex items-center gap-2" onClick={() => logout()}>
                  <LogOut size={14} />
                  Logout
                </Button>
                <div className="flex gap-4">
                  <Button variant="ghost" className="py-3">
                    Discard Changes
                  </Button>
                  <Button className="px-8 py-3 shadow-sm">
                    Update Account
                  </Button>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Preferences Card */}
          <FadeIn delay={0.2} className="md:col-span-4">
            <Card title="Preferences" className="w-full h-full">
              <div className="space-y-8 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <span className="font-label-sm text-secondary block uppercase tracking-tight opacity-70">Challenge Level</span>
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
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-surface-outline text-secondary hover:bg-surface-variant hover:text-primary"
                        }`}
                        type="button"
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-label-md text-on-surface font-bold">Audio Feedback</h4>
                      <p className="text-xs text-secondary">Play sounds on success/error</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" id="sound" name="sound" />
                      <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-label-md text-on-surface font-bold">Clinical Light Mode</h4>
                      <p className="text-xs text-secondary">Optimized for day reading</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" id="theme" name="theme" />
                      <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-outline">
                  <Button className="w-full py-3" variant="outline">
                    Reset Defaults
                  </Button>
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Notifications Card */}
          <FadeIn delay={0.3} className="md:col-span-12">
            <Card title="Notifications" className="w-full" subtitle="Control your system alerts">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 mb-2 text-primary">
                    <Bell size={20} />
                    <h2 className="font-headline-md text-headline-md">Notification Settings</h2>
                  </div>
                  <p className="font-body-md text-secondary">Control how and when the system alerts you of new daily challenges or library updates.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full md:w-auto">
                  {[
                    { id: "push", label: "Push Alerts", checked: true },
                    { id: "email-notif", label: "Email Digests", checked: false },
                    { id: "update-notif", label: "System Updates", checked: true },
                  ].map((option) => (
                    <div key={option.id} className="flex items-center gap-4 bg-surface-muted px-4 py-3 rounded-lg border border-surface-outline transition-colors hover:border-primary/50">
                      <input defaultChecked={option.checked} className="w-5 h-5 rounded border-surface-outline text-primary focus:ring-primary" id={option.id} type="checkbox" />
                      <label className="font-label-md text-on-surface cursor-pointer" htmlFor={option.id}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </FadeIn>

          {/* Danger Zone Card */}
          <FadeIn delay={0.4} className="md:col-span-12">
            <Card title="Danger Zone" className="w-full" subtitle="Irreversible system actions">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1">
                  <h3 className="font-headline-md text-error flex items-center gap-2">
                    <Trash2 size={20} />
                    Wipe System Data
                  </h3>
                  <p className="font-body-md text-secondary">Permanently delete your system logs and user data. This action is irreversible.</p>
                </div>
                <Button variant="danger" className="px-8 py-3">
                  Wipe System Data
                </Button>
              </div>
            </Card>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
