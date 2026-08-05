"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { mockClients } from "@/lib/mock-data";
import type { TripType } from "@/lib/types";

const TRIP_TYPES: { value: TripType; label: string; emoji: string; description: string }[] = [
  { value: "flight", label: "Flight", emoji: "✈", description: "Domestic or international air travel" },
  { value: "hotel", label: "Hotel", emoji: "🏨", description: "Accommodation at destination" },
  { value: "train", label: "Train", emoji: "🚄", description: "Railway bookings via IRCTC" },
  { value: "visa", label: "Visa", emoji: "📋", description: "Visa assistance & documentation" },
];

export default function NewRequestPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const client = mockClients.find((c) => c.portal_token === token);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    traveler_name: "",
    traveler_email: "",
    trip_types: ["flight"] as TripType[],
    origin: "",
    destination: "",
    departure_date: "",
    return_date: "",
    purpose: "",
    preferred_class: "Economy",
    hotel_nights: "",
    hotel_preference: "",
    budget: "",
    special_instructions: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleTripType(type: TripType) {
    setForm((prev) => {
      const already = prev.trip_types.includes(type);
      if (already) {
        // don't deselect if it's the last one
        if (prev.trip_types.length === 1) return prev;
        return { ...prev, trip_types: prev.trip_types.filter((t) => t !== type) };
      }
      return { ...prev, trip_types: [...prev.trip_types, type] };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  const hasFlightOrTrain = form.trip_types.some((t) => t === "flight" || t === "train");
  const hasHotel = form.trip_types.includes("hotel");

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

        {/* What do you need? — multi-select segments */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">What do you need?</h2>
          <p className="text-xs text-muted-foreground mb-4">Select all that apply — you can request multiple services in one go.</p>
          <div className="grid grid-cols-2 gap-3">
            {TRIP_TYPES.map((type) => {
              const selected = form.trip_types.includes(type.value);
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleTripType(type.value)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:border-border/80 hover:bg-secondary/50"
                  }`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{type.emoji}</span>
                  <div>
                    <p className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}>
                      {type.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
                  </div>
                  {selected && (
                    <div className="ml-auto flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 5l2.5 2.5L8 3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trip Route & Dates */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Route & Dates</h2>
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm text-muted-foreground mb-1.5">
                {hasHotel && !hasFlightOrTrain ? "Check-in Date *" : "Departure Date *"}
              </label>
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

        {/* Segment-specific fields */}
        {(hasFlightOrTrain || hasHotel) && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-5">
            <h2 className="text-sm font-semibold text-foreground">Segment Preferences</h2>

            {hasFlightOrTrain && (
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  {form.trip_types.includes("flight") ? "Flight Cabin Class" : "Train Class"}
                </label>
                <div className="flex gap-2 flex-wrap">
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
            )}

            {hasHotel && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Number of Nights</label>
                  <input
                    name="hotel_nights"
                    type="number"
                    min="1"
                    value={form.hotel_nights}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Hotel Preference</label>
                  <input
                    name="hotel_preference"
                    value={form.hotel_preference}
                    onChange={handleChange}
                    placeholder="e.g. Near city centre, 4-star+"
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preferences & Budget */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Purpose & Budget</h2>
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
              <label className="block text-sm text-muted-foreground mb-1.5">Total Budget (₹)</label>
              <input
                name="budget"
                type="number"
                value={form.budget}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-muted-foreground mb-1.5">Special Instructions</label>
              <textarea
                name="special_instructions"
                value={form.special_instructions}
                onChange={handleChange}
                placeholder="Seat preferences, dietary needs, visa requirements, any other requests..."
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
