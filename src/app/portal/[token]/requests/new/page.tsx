"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { mockClients } from "@/lib/mock-data";

export default function NewRequestPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const client = mockClients.find((c) => c.portal_token === token);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    traveler_name: "",
    traveler_email: "",
    trip_type: "flight",
    origin: "",
    destination: "",
    departure_date: "",
    return_date: "",
    purpose: "",
    preferred_class: "Economy",
    budget: "",
    special_instructions: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  if (!client) {
    return <div className="text-center py-20"><p className="text-muted-foreground">Invalid portal link.</p></div>;
  }

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Request Submitted</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          Your travel consultant will review this and share curated options shortly. You&apos;ll be notified here when options are ready.
        </p>
        <Link
          href={`/portal/${token}`}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        href={`/portal/${token}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portal
      </Link>

      <h1 className="text-2xl font-semibold text-foreground mb-1">New Travel Request</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Fill in the details and your consultant will research the best options for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Traveler */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Traveler Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-muted-foreground mb-1.5">Traveler Name *</label>
              <input
                name="traveler_name"
                value={form.traveler_name}
                onChange={handleChange}
                required
                placeholder="Full name"
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm text-muted-foreground mb-1.5">Traveler Email</label>
              <input
                name="traveler_email"
                type="email"
                value={form.traveler_email}
                onChange={handleChange}
                placeholder="employee@company.com"
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Trip */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Trip Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-muted-foreground mb-1.5">Travel Type *</label>
              <div className="flex gap-2 flex-wrap">
                {["flight", "train", "hotel", "combined", "visa"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, trip_type: type }))}
                    className={`px-3.5 py-1.5 rounded-lg text-sm border transition-all capitalize ${
                      form.trip_type === type
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">From *</label>
              <input
                name="origin"
                value={form.origin}
                onChange={handleChange}
                required
                placeholder="City or airport"
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">To *</label>
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
                placeholder="City or country"
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Departure Date *</label>
              <input
                name="departure_date"
                type="date"
                value={form.departure_date}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Return Date</label>
              <input
                name="return_date"
                type="date"
                value={form.return_date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Preferences & Budget</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Travel Purpose *</label>
              <input
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                required
                placeholder="e.g. Client meeting, Conference"
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Budget (₹)</label>
              <input
                name="budget"
                type="number"
                value={form.budget}
                onChange={handleChange}
                placeholder="Optional budget limit"
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-muted-foreground mb-1.5">Cabin / Class</label>
              <div className="flex gap-2">
                {["Economy", "Premium Economy", "Business", "First"].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, preferred_class: cls }))}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      form.preferred_class === cls
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-muted-foreground mb-1.5">Special Instructions</label>
              <textarea
                name="special_instructions"
                value={form.special_instructions}
                onChange={handleChange}
                placeholder="Any special requests, dietary needs, visa requirements, seat preferences..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}
