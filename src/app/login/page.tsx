"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Eye, EyeOff, ArrowRight } from "lucide-react";

const DEMO_CREDENTIALS = [
  { email: "priya@travelio.in", password: "demo1234", role: "Owner", name: "Priya Sharma" },
  { email: "arjun@travelio.in", password: "demo1234", role: "Consultant", name: "Arjun Mehta" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const match = DEMO_CREDENTIALS.find(
      (c) => c.email === email && c.password === password
    );

    if (match) {
      localStorage.setItem("travel_user", JSON.stringify(match));
      router.push("/dashboard");
    } else {
      setError("Invalid email or password. Try a demo account below.");
      setLoading(false);
    }
  }

  function fillDemo(cred: (typeof DEMO_CREDENTIALS)[0]) {
    setEmail(cred.email);
    setPassword(cred.password);
    setError("");
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">Travelio</span>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-white leading-tight mb-4">
            Your corporate travel business,{" "}
            <span className="text-primary">fully in control.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            From request to approval to booking — manage every journey, every client, and every rupee from one calm, intelligent command center.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Live view of all active travel requests",
              "Curated options with client collaboration",
              "Cash flow, receivables & supplier payables",
              "Dedicated portal for each corporate client",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-sm">
          &copy; 2026 Travelio. Built for modern travel agencies.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold">Travelio</span>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-1">Sign in</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Access your agency&apos;s operations platform
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@youragency.com"
                required
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
              Demo accounts
            </p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => fillDemo(cred)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 border border-border rounded-lg hover:bg-secondary/60 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{cred.name}</p>
                    <p className="text-xs text-muted-foreground">{cred.email}</p>
                  </div>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {cred.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Password for all demo accounts: <code className="text-foreground font-mono">demo1234</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
