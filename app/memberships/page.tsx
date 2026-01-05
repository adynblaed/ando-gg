/**
 * Memberships page for players and locals.
 * Describes membership tiers, pricing, features, and CTAs.
 */
"use client";

import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SiteFooter } from "../_components/SiteFooter";
import { SiteHeader } from "../_components/SiteHeader";
import { Card, cx } from "../_components/ui";

type MembershipTier = {
  id: string;
  name: string;
  price: string;
  seasonPassPrice?: string;
  priceNote?: string;
  features: string[];
  note?: string;
  badge?: string;
  highlight?: boolean;
};

const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: "tier-1",
    name: "Tier 1 — Registered Local",
    price: "Free",
    features: [
      "Join as a Northern Nevada player (opt-in roster)",
      "Add your game usernames for local player lookup",
      "Access to weekly game night schedules and events",
      "Best for: trying it out and getting connected",
    ],
    note: "Start here. Join weekly game nights, meet local players, and see if the community fits. No commitment required.",
  },
  {
    id: "tier-2",
    name: "Tier 2 — Player Profile",
    price: "$3/mo",
    seasonPassPrice: "$25/year",
    features: [
      "Player Profile + member roster visibility (you control what you share)",
      "SquadMatch weekly matching (moderated LFG that actually works)",
      "Weekly scheduled game nights + priority event signup",
      "Monthly Player Card + season recap (your progress, over time)",
      "In-store member perks: Focus Hour, early merch drops, 5% discount",
    ],
                note: "The standard membership tier. Get a local identity, local teammates, and weekly nights you can invite friends to. Your season pass tracks all perks and engagements through the yearly season.",
  },
  {
    id: "tier-3",
    name: "Tier 3 — Captain Profile",
    price: "$5/mo",
    seasonPassPrice: "$40/year",
    priceNote: "Limited spots",
    features: [
      "Everything in Tier 2",
      "Captain Queue + priority matching (higher-trust, higher-consistency groups)",
      "Weekly \"VOD Lite\" report (1 clip → 1-page plan within 48–72 hours, limited slots)",
      "Verified Player badge + Club Standing (earnable, behavior-based trust signal)",
      "Showcase / spotlight priority + reserved seating for watch nights",
      "Monthly captain meetings: help shape schedules, scrims, and standards",
    ],
    note: "The leadership tier. Better matches, more trust, and real responsibilities that make weekly nights feel like a club — not a one-off. Your season pass tracks all perks and engagements through the yearly season.",
    badge: "Limited spots",
    highlight: true,
  },
];

export default function MembershipsPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[rgba(var(--accent),0.12)] blur-3xl" />
        <div className="absolute left-[12%] top-[35%] h-[320px] w-[420px] rounded-full bg-[rgba(var(--accent-2),0.10)] blur-3xl" />
      </div>

      {/* Header */}
      <SiteHeader primaryCtaHref="/#waitlist" primaryCtaLabel="Join Waitlist" />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        {/* Hero */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Memberships</h1>
            <p className="max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
              <span className="font-semibold text-[rgb(var(--foreground))]">For Players & Locals:</span> Join a welcoming local gaming community with regularly scheduled game nights. All skill levels welcome. Invite your friends and build consistent gaming habits together.
            </p>
            <p className="max-w-3xl text-xs leading-5 text-[rgb(var(--muted))] mt-2">
              Representing a school or organization? <Link href="/services" className="font-semibold text-[rgb(var(--accent))] hover:underline">View our Services</Link> for tournament hosting and esports infrastructure.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SignedOut>
              <p className="text-sm text-[rgb(var(--muted))]">
                Sign up to get started. <span className="font-medium text-[rgb(var(--foreground))]">No payment today.</span>
              </p>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-3">
                <UserButton />
                <p className="text-sm text-[rgb(var(--muted))]">
                  Welcome back! Choose a tier below to upgrade your membership.
                </p>
              </div>
            </SignedIn>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="tiers-heading" id="tiers">
          <div className="grid gap-4 lg:grid-cols-3">
            {MEMBERSHIP_TIERS.map((tier) => (
              <Card
                key={tier.id}
                className={cx(
                  "relative flex flex-col",
                  tier.highlight && "ring-2 ring-[rgba(var(--accent),0.3)]"
                )}
              >
                {tier.badge && (
                  <div className="absolute right-4 top-4 rounded-full bg-[rgba(var(--accent),0.15)] px-3 py-1 text-xs font-semibold">
                    {tier.badge}
                  </div>
                )}

                <div className="flex-1">
                  <p className="text-sm font-semibold">{tier.name}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-semibold tracking-tight">{tier.price}</p>
                      {tier.priceNote && (
                        <p className="text-xs text-[rgb(var(--muted))]">{tier.priceNote}</p>
                      )}
                    </div>
                    {tier.seasonPassPrice && (
                      <p className="text-xs text-[rgb(var(--muted))]">
                        Season Pass: <span className="font-medium">{tier.seasonPassPrice}</span>
                      </p>
                    )}
                  </div>

                  <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
                    {tier.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>

                  {tier.note && (
                    <p className="mt-4 text-xs italic text-[rgb(var(--muted))]">{tier.note}</p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-[rgb(var(--border))]">
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button
                        className={cx(
                          "w-full rounded-full px-4 py-3 text-sm font-semibold shadow-sm transition-all duration-200",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]",
                          tier.id === "tier-1"
                            ? "border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] text-[rgb(var(--foreground))] hover:bg-[rgba(var(--foreground),0.04)]"
                            : "bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                        )}
                      >
                        {tier.id === "tier-1" ? "Sign Up (Free)" : `Sign Up for ${tier.name.split("—")[0]?.trim()}`}
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <button
                      className={cx(
                        "w-full rounded-full px-4 py-3 text-sm font-semibold shadow-sm transition-all duration-200",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]",
                        tier.id === "tier-1"
                          ? "border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] text-[rgb(var(--foreground))] hover:bg-[rgba(var(--foreground),0.04)]"
                          : "bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                      )}
                      disabled={tier.id === "tier-1"}
                    >
                      {tier.id === "tier-1"
                        ? "Active (Free)"
                        : `Upgrade to ${tier.name.split("—")[0]?.trim()}`}
                    </button>
                  </SignedIn>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature Matrix */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="features-heading" id="features">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="features-heading" className="text-2xl font-semibold tracking-tight">
                How it works
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Weekly scheduled game nights you can count on. SquadMatch pairing and in-store perks provide membership benefits.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* How it works */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-[rgb(var(--accent))]">How it works</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="mb-1.5 text-sm font-semibold">Tier 1 — Registered Local (Free)</p>
                      <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                        Join the community and attend weekly game nights. Add your game usernames so local players can find you. Perfect for trying it out.
                      </p>
                    </div>
                    <div>
                      <p className="mb-1.5 text-sm font-semibold">Tier 2 — Player Profile ($3/mo)</p>
                      <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                        Get a real member profile. SquadMatch pairs you weekly, you RSVP into scheduled game nights, and your Player Card tracks progress through the season. Season Pass: $25/year.
                      </p>
                    </div>
                    <div>
                      <p className="mb-1.5 text-sm font-semibold">Tier 3 — Captain Profile ($5/mo)</p>
                      <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                        For leaders and consistent groups. Priority matching, Verified Player/Standing signals, VOD Lite reports, and captain-led nights that friends can plan around. Season Pass: $40/year.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Problems we solve */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-[rgb(var(--accent))]">Problems we solve</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Reliable teammates (not random queues)</p>
                        <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                          Team formation + scheduling built around real local demand
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Toxicity, griefing, and ego-throwing</p>
                        <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                          Behavior-first culture + enforceable code of conduct
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">No feedback loop</p>
                        <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                          Player Cards + VOD Lite reports + simple weekly priorities (no gatekeeping)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
                      </div>
                    <div>
                      <p className="text-sm font-semibold">No consistent gaming schedule</p>
                      <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                        Weekly scheduled game nights you can count on and invite friends to
                      </p>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Culture & Standards */}
        <section className="mt-6">
          <Card className="p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Culture (non-negotiable)</h3>
                <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
                  <li>• Respect, teamwork, no harassment, no hate speech</li>
                  <li>• No cheating, threats, or repeated rage behavior</li>
                  <li>• 3-strike policy: third strike = permanent removal</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Team Captains</h3>
                <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                  Team Captains are Tier 3 members who host weekly game nights, help match players into teams, and maintain our welcoming culture. They help shape the schedule and build consistent gaming experiences for everyone.
                </p>
                <p className="mt-3 text-xs text-[rgb(var(--muted))]">
                  No food/drink. We win with programming, community infrastructure, and recurring membership.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="mt-14">
          <Card className="p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Ready to get started?</h2>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Join the waitlist to be notified when memberships open, or sign up now to secure your spot.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="rounded-full bg-[rgb(var(--foreground))] px-6 py-3 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]">
                    Sign Up Now
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <p className="text-sm text-[rgb(var(--muted))]">
                  You're signed in! Choose a tier above to upgrade your membership.
                </p>
              </SignedIn>
              <Link
                href="/#waitlist"
                className="rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-[rgba(var(--foreground),0.04)] hover:border-[rgba(var(--border),0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                Join Waitlist
              </Link>
            </div>
          </Card>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

