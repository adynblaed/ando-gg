"use client";

/**
 * Partners page outlining active/desired partnerships plus intake form.
 */
import Link from "next/link";
import React, { useState } from "react";
import { SiteFooter } from "../_components/SiteFooter";
import { SiteHeader } from "../_components/SiteHeader";
import { Card, ErrorText, Input, Textarea, cx } from "../_components/ui";

type PartnerErrors = Partial<Record<"partnerEmail" | "partnerNotes", string>>;

/**
 * Validates partnership form inputs and returns error map.
 */
function validatePartnership(email: string, notes: string): PartnerErrors {
  const next: PartnerErrors = {};
  const e = email.trim();
  if (!e) next.partnerEmail = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) next.partnerEmail = "Enter a valid email.";
  const n = notes.trim();
  if (n.length > 1000) next.partnerNotes = "Keep notes under 1000 characters.";
  return next;
}

type Partner = {
  id: string;
  name: string;
  category: string;
  description: string;
  logo?: string;
};

const ACTIVE_PARTNERS: Partner[] = [
  // Placeholder structure - replace with actual partners when available
  // {
  //   id: "partner-1",
  //   name: "Partner Name",
  //   category: "Sponsor / Equipment / Venue",
  //   description: "How they help the community",
  //   logo: "/path/to/logo.png",
  // },
];

export default function PartnersPage() {
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerNotes, setPartnerNotes] = useState("");
  const [partnerErrors, setPartnerErrors] = useState<PartnerErrors>({});
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);
  const [partnerSubmitted, setPartnerSubmitted] = useState<null | { ok: boolean; message: string }>(null);

  async function onPartnershipSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPartnerSubmitted(null);

    const v = validatePartnership(partnerEmail, partnerNotes);
    setPartnerErrors(v);
    if (Object.keys(v).length) return;

    try {
      setPartnerSubmitting(true);
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: partnerEmail.trim(), notes: partnerNotes.trim() }),
      });

      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!res.ok || !json?.ok) {
        setPartnerSubmitted({ ok: false, message: json?.message || "Could not submit. Please try again." });
        return;
      }

      setPartnerSubmitted({
        ok: true,
        message: json?.message || "Received. We will reach out as soon as possible.",
      });
      setPartnerEmail("");
      setPartnerNotes("");
    } catch {
      setPartnerSubmitted({ ok: false, message: "Network error. Please try again." });
    } finally {
      setPartnerSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[rgba(var(--accent),0.12)] blur-3xl" />
        <div className="absolute left-[12%] top-[35%] h-[320px] w-[420px] rounded-full bg-[rgba(var(--accent-2),0.10)] blur-3xl" />
      </div>

      <SiteHeader primaryCtaHref="/#waitlist" primaryCtaLabel="Join Waitlist" />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <section className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Partners</h1>
          <p className="max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            Our partners help us build a sustainable, thriving esports community in Northern Nevada. Learn about our current partners, 
            partnership goals, and how to get involved.
          </p>
          <p className="max-w-3xl text-xs leading-5 text-[rgb(var(--muted))] mt-2">
            Representing a school or organization? <Link href="/services" className="font-semibold text-[rgb(var(--accent))] hover:underline">View our Services</Link> for tournament hosting and esports infrastructure.
          </p>
        </section>

        {/* Active Partners */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="active-partners-heading" id="active-partners">
          <h2 id="active-partners-heading" className="text-2xl font-semibold tracking-tight">
            Active Partners
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            These organizations and companies support Ando eSports through sponsorship, equipment, venue support, and community programs.
          </p>

          {ACTIVE_PARTNERS.length > 0 ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {ACTIVE_PARTNERS.map((partner) => (
                <Card key={partner.id} className="p-6">
                  {partner.logo && (
                    <div className="mb-4 flex h-16 items-center justify-center">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">{partner.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-[rgb(var(--accent))]">{partner.category}</p>
                  <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">{partner.description}</p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mt-6 p-6 sm:p-8">
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                We&apos;re actively seeking partners to help build Northern Nevada&apos;s esports community. 
                If you&apos;re interested in partnering with us, see our partnership goals below and reach out using the form at the bottom of this page.
              </p>
            </Card>
          )}
        </section>

        {/* Partnership Goals */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="goals-heading" id="goals">
          <h2 id="goals-heading" className="text-2xl font-semibold tracking-tight">
            Current Partnership Goals
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            We&apos;re looking for partners who can help us achieve these milestones and build a sustainable esports community.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Sponsorship & Prizing</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Sponsor-backed events and prizing that upgrade our programming. This includes tournament prizes, gear, equipment, 
                and financial support for events. Partners get visibility at events, in our community, and through our channels.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Equipment & Infrastructure</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Gaming equipment, PCs, peripherals, networking gear, and infrastructure support for our physical location. 
                This helps us provide better experiences for members and enables more programming options.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Venue Support</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Support for our physical location: space, utilities, furniture, or venue partnerships. Having a real third space 
                is core to our model, and venue partners help us maintain and improve this space.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Developer Partnerships</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Direct partnerships with game studios for community programs, tournament support, early access, and long-term 
                ecosystem growth. We want to work with developers to build strong local communities around their games.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Event Collaboration</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Co-hosting events, tournaments, watch parties, and community gatherings. Partners can bring their expertise, 
                resources, or audience to create bigger, better events for the community.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Coaching & Education</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Support for coaching programs, educational content, workshops, and skill development. This includes VOD review 
                resources, coaching tools, and pathways for developing coaches and players.
              </p>
            </Card>
          </div>
        </section>

        {/* How Partners Help */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="how-help-heading" id="how-help">
          <h2 id="how-help-heading" className="text-2xl font-semibold tracking-tight">
            How Partners Help
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            Partnerships enable us to build a sustainable, thriving esports community. Here&apos;s how partner support directly 
            benefits the community and helps us achieve our goals.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Better Programming</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Partner support enables better events, tournaments, and programming. With sponsor-backed prizing, we can run 
                more competitive events. With equipment support, we can offer better experiences. With venue support, we can 
                maintain and improve our physical space.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Sustainable Growth</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                We operate largely on a volunteer basis, with membership revenue going back into the community. Partner support 
                helps us scale faster, expand coaching, improve features, and build toward long-term sustainability without 
                relying solely on member fees.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Community Resources</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Partners provide resources that members can&apos;t access on their own: professional equipment, coaching tools, 
                tournament infrastructure, and industry connections. This levels the playing field and creates real opportunities 
                for local players.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Pathways & Opportunities</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Developer partnerships create pathways for scouting, tryouts, showcases, and credible next-step opportunities 
                for talent. Equipment partners enable better practice environments. Coaching partners help players improve faster. 
                All of this creates real value for members.
              </p>
            </Card>
          </div>

          <Card className="mt-6 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">What Partners Get</h3>
            <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
              Partners receive visibility at events, in our community, and through our channels. They get to support a growing, 
              engaged local esports community and help build something sustainable. They also get direct access to our community 
              for feedback, testing, and collaboration opportunities.
            </p>
            <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
              We work with partners to create mutually beneficial relationships. If you&apos;re interested in partnering, 
              reach out using the form below and we&apos;ll discuss how we can work together.
            </p>
          </Card>
        </section>

        {/* Partnership CTA */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="partner-cta-heading" id="partner-cta">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="partner-cta-heading" className="text-2xl font-semibold tracking-tight">
                  Become a Partner
                </h2>
                <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                  Are you looking to partner with Ando eSports? Leave a contact email and a few notes and we will follow up as soon as we can.
                </p>
              </div>
            </div>

            <form onSubmit={onPartnershipSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">Contact email *</label>
                <Input
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="partner@company.com"
                  error={!!partnerErrors.partnerEmail}
                />
                {partnerErrors.partnerEmail && <ErrorText>{partnerErrors.partnerEmail}</ErrorText>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Notes (optional)</label>
                <Textarea
                  value={partnerNotes}
                  onChange={(e) => setPartnerNotes(e.target.value)}
                  placeholder="What do you want to partner on? Sponsorship, venue support, equipment, event collaboration, community programs, etc."
                  rows={4}
                  error={!!partnerErrors.partnerNotes}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-[rgb(var(--muted))]">
                  <span>Max 1000 characters.</span>
                  <span>{partnerNotes.length}/1000</span>
                </div>
                {partnerErrors.partnerNotes && <ErrorText>{partnerErrors.partnerNotes}</ErrorText>}
              </div>

              <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={partnerSubmitting}
                  className={cx(
                    "rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]",
                    partnerSubmitting
                      ? "cursor-not-allowed bg-zinc-400 text-white opacity-60"
                      : "bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                  aria-busy={partnerSubmitting}
                >
                  {partnerSubmitting ? "Sending…" : "Send"}
                </button>
              </div>

              {partnerSubmitted && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={cx(
                    "sm:col-span-2 rounded-2xl border p-4 text-sm transition-all duration-200",
                    partnerSubmitted.ok
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                  )}
                >
                  <p className="font-semibold">{partnerSubmitted.ok ? "Received" : "Submission failed"}</p>
                  <p className="mt-1">{partnerSubmitted.message}</p>
                </div>
              )}
            </form>
          </Card>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

