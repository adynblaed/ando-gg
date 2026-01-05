"use client";

/**
 * About page outlining mission, problems solved, team profiles, and partnership intake.
 */
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
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

type AboutUsMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  currentlyPlaying?: string;
  weekendRotation?: string;
  storyFavorites?: string;
  climbingBadges?: Array<
    | {
        kind: "image";
        game: string;
        label: string;
        badgeSrc: string;
        previewSrc: string;
      }
    | {
        kind: "dial";
        game: string;
        label: string;
        value: string;
        dialColorClassName: string;
        previewSrc: string;
      }
  >;
};

const ABOUT_US_MEMBERS: AboutUsMember[] = [
  {
    id: "adyn-blaed",
    name: "Adyn Blaed",
    role: "Founder",
    bio: "Born and raised in Reno/Sparks, Adyn builds Ando around structured, welcoming spaces for zillennial and local gaming communities. The goal is simple: show up weekly, improve together, and keep it respectful.",
    imageSrc: "/images/blaed_profile_pic.png",
    currentlyPlaying: "ARC Raiders, Marvel Rivals, League of Legends",
    weekendRotation: "Dawn of War, Rogue Trader, Helldivers II, Satisfactory",
    storyFavorites: "Baldur's Gate III, Elden Ring, Where Winds Meet, Cyberpunk 2077, Mass Effect Trilogy",
    climbingBadges: [
      {
        kind: "image",
        game: "Marvel Rivals",
        label: "Grandmaster",
        badgeSrc: "/images/4%20-%20Grandmaster@56.png",
        previewSrc: "/images/marvel_rivals_thumbnail.jpg",
      },
      {
        kind: "dial",
        game: "ARC Raiders",
        label: "Level 55",
        value: "55",
        dialColorClassName: "border-yellow-400/90 text-yellow-300",
        previewSrc: "/images/arc_raiders_thumbnail.jpg",
      },
    ],
  },
  {
    id: "placeholder-1",
    name: "Team Member (Placeholder)",
    role: "Staff",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    imageSrc: "/images/blaed_profile_pic.png",
    currentlyPlaying: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    weekendRotation: "Sed do eiusmod tempor incididunt ut labore et dolore.",
    storyFavorites: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    climbingBadges: [
      {
        kind: "image",
        game: "Marvel Rivals",
        label: "Grandmaster",
        badgeSrc: "/images/4%20-%20Grandmaster@56.png",
        previewSrc: "/images/marvel_rivals_thumbnail.jpg",
      },
      {
        kind: "dial",
        game: "ARC Raiders",
        label: "Level 55",
        value: "55",
        dialColorClassName: "border-yellow-400/90 text-yellow-300",
        previewSrc: "/images/arc_raiders_thumbnail.jpg",
      },
    ],
  },
  {
    id: "placeholder-2",
    name: "Team Member (Placeholder)",
    role: "Staff",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    imageSrc: "/images/blaed_profile_pic.png",
    currentlyPlaying: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    weekendRotation: "Sed do eiusmod tempor incididunt ut labore et dolore.",
    storyFavorites: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    climbingBadges: [
      {
        kind: "image",
        game: "Marvel Rivals",
        label: "Grandmaster",
        badgeSrc: "/images/4%20-%20Grandmaster@56.png",
        previewSrc: "/images/marvel_rivals_thumbnail.jpg",
      },
      {
        kind: "dial",
        game: "ARC Raiders",
        label: "Level 55",
        value: "55",
        dialColorClassName: "border-yellow-400/90 text-yellow-300",
        previewSrc: "/images/arc_raiders_thumbnail.jpg",
      },
    ],
  },
];

// Renders the About experience with goals, problems, staff carousel, and partnership form.
export default function AboutPage() {
  const [activeAboutId, setActiveAboutId] = useState<string>(ABOUT_US_MEMBERS[0]?.id ?? "");
  const [aboutAnimNonce, setAboutAnimNonce] = useState(0);
  const [hoveredAboutId, setHoveredAboutId] = useState<string | null>(null);

  const hoveredAboutIndex = useMemo(() => {
    if (!hoveredAboutId) return -1;
    return ABOUT_US_MEMBERS.findIndex((m) => m.id === hoveredAboutId);
  }, [hoveredAboutId]);

  const activeAboutIndex = useMemo(() => {
    return Math.max(
      0,
      ABOUT_US_MEMBERS.findIndex((m) => m.id === activeAboutId)
    );
  }, [activeAboutId]);

  function selectAboutMember(id: string) {
    setActiveAboutId(id);
    setAboutAnimNonce((n) => n + 1);
  }

  function goToPrevAboutMember() {
    if (!ABOUT_US_MEMBERS.length) return;
    const prevIndex = activeAboutIndex <= 0 ? ABOUT_US_MEMBERS.length - 1 : activeAboutIndex - 1;
    selectAboutMember(ABOUT_US_MEMBERS[prevIndex]!.id);
  }

  function goToNextAboutMember() {
    if (!ABOUT_US_MEMBERS.length) return;
    const nextIndex = activeAboutIndex >= ABOUT_US_MEMBERS.length - 1 ? 0 : activeAboutIndex + 1;
    selectAboutMember(ABOUT_US_MEMBERS[nextIndex]!.id);
  }

  const activeAboutMember = useMemo(() => {
    return ABOUT_US_MEMBERS.find((m) => m.id === activeAboutId) ?? ABOUT_US_MEMBERS[0];
  }, [activeAboutId]);

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
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">About Us</h1>
          <p className="max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            We&apos;re local gamers building Northern Nevada into a hub for gaming and esports culture. 
            Here&apos;s what we&apos;re building and why it matters.
          </p>
          <div className="mt-4 p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)]">
            <p className="text-xs leading-5 text-[rgb(var(--muted))]">
              <span className="font-semibold text-[rgb(var(--foreground))]">For Players & Locals:</span> <Link href="/memberships" className="font-semibold text-[rgb(var(--accent))] hover:underline">Memberships</Link> provide weekly game nights, player profiles, and local community access. 
              <span className="font-semibold text-[rgb(var(--foreground))] ml-2">For Institutions:</span> <Link href="/services" className="font-semibold text-[rgb(var(--accent))] hover:underline">Services</Link> provide tournament hosting, bracket organization, and esports infrastructure for schools and organizations.
            </p>
          </div>
        </section>

        {/* Our Goals */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="goals-heading" id="goals">
          <h2 id="goals-heading" className="text-2xl font-semibold tracking-tight">
            What We&apos;re Building
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            We&apos;re building Northern Nevada into a sustainable esports pipeline — local first, steady, and earned. 
            If you want a structured community with clear pathways, you belong here.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(var(--accent),0.1)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--accent))]">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[rgb(var(--foreground))] mb-2">
                <span className="font-brand font-[900]">1</span> <span>Players Grow</span>
              </h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                Clear habits, coaching, and measurable progress — for any starting point.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(var(--accent),0.1)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--accent))]">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8531 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[rgb(var(--foreground))] mb-2">
                <span className="font-brand font-[900]">2</span> <span>Players Compete</span>
              </h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                Teams, ranked nights, scrims, and events that turn practice into performance.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(var(--accent),0.1)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--accent))]">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8531 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[rgb(var(--foreground))] mb-2">
                <span className="font-brand font-[900]">3</span> <span>Players Become Leaders</span>
              </h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                A pathway into high standards, leadership, and real community roles.
              </p>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">What we mean by &quot;high standards&quot;</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                This means being a teammate people can trust: respectful communication, consistency,
                planning, teamwork, and showing up for your group.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                We also want to make community roles accessible: coaching, leadership, production, operations, and community work.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">Not a LAN café. Not just a game store.</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                Ando eSports is an <span className="font-semibold text-[rgb(var(--foreground))]">esports league model</span>: a physical home base and always-on digital community, 
                structured weekly programming, enforced standards for behavior and safety, and a local pathway for improvement and recognition.
              </p>
              <p className="mt-3 text-xs italic text-[rgb(var(--muted))]">
                We operate largely on a volunteer basis. Proceeds go back into maintaining the playerbase, improving features,
                securing partners, and expanding coaching and staff support.
              </p>
            </Card>
          </div>

            <Card className="mt-8 p-6 sm:p-8 bg-[rgba(var(--accent),0.05)] border-[rgba(var(--accent),0.2)]">
            <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-3">All skill levels welcome</h3>
            <p className="text-sm leading-6 text-[rgb(var(--muted))]">
              We focus on growth, teamwork, and respect. All starting points are valid, and we provide structured pathways for improvement at any skill level.
            </p>
          </Card>

          <div className="mt-8">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-4">Milestones we're working toward</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "1) Top 500 breakthrough",
                    desc: "Develop a Northern Nevada player into top 500 globally in a launch title with verified, repeatable results.",
                  },
                  {
                    title: "2) Clear pathways",
                    desc: "Turn weekly practice into outcomes: clear progression, showcases, tryouts, and role development across seasons.",
                  },
                  {
                    title: "3) More coaches, more reps",
                    desc: "Expand vetted coaching so players get consistent feedback, structure, and measurable improvement plans.",
                  },
                  {
                    title: "4) Sponsor-backed events + prizing",
                    desc: "Secure sponsor support that upgrades programming: events, prizing, gear, and stronger broadcast production.",
                  },
                  {
                    title: "5) Org relationships + opportunities",
                    desc: "Build org relationships for scouting, tryouts, showcases, and credible next-step opportunities for talent.",
                  },
                  {
                    title: "6) Developer partnerships",
                    desc: "Partner directly with game studios for community programs, tournament support, and long-term ecosystem growth.",
                  },
                  {
                    title: "7) Regional roster (season-ready)",
                    desc: "Roster a consistent regional team with scheduled scrims, events, and measurable season goals.",
                  },
                  {
                    title: "8) Global roster (event-ready)",
                    desc: "Qualify and compete in top-tier events with professional standards, clear roles, and sustainable support.",
                  },
                  {
                    title: "9) Northern Nevada on the map",
                    desc: "Sustain recognized results across seasons and establish Northern Nevada as a credible esports region.",
                  },
                ].map((m) => {
                  const match = m.title.match(/^(\d+)\)\s*(.+)$/);
                  const number = match ? match[1] : "";
                  const text = match ? match[2] : m.title;
                  return (
                    <div
                      key={m.title}
                      className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-5"
                    >
                      <p className="text-sm font-semibold">
                        {number && <span className="font-brand font-[900]">{number}</span>}
                        {number && " "}
                        {text}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">{m.desc}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>

        {/* The Problems We Are Trying to Solve */}
        <section className="mt-16 scroll-mt-24" aria-labelledby="problems-heading" id="problems">
          <h2 id="problems-heading" className="text-2xl font-semibold tracking-tight">
            The Problems We Are Trying to Solve
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            These are the things players actually complain about. Here&apos;s how we fix them.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--surface),0.8)] text-xl font-brand font-[900] text-[rgb(var(--foreground))]">1</span>
                <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">The Teammate Problem</h3>
              </div>
              <blockquote className="mb-3 border-l-2 border-[rgb(var(--accent))] pl-3 text-sm italic text-[rgb(var(--muted))]">
                &quot;I can&apos;t find consistent people to play with.&quot;
              </blockquote>
              <p className="mb-4 text-sm leading-6 text-[rgb(var(--muted))]">
                Most players aren&apos;t missing motivation—they&apos;re missing a squad. Online matchmaking is built for one-off games, not relationships.
              </p>
              <div className="rounded-lg bg-[rgba(var(--surface),0.6)] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--accent))]">Our solution</p>
                <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Local player profiles + SquadMatch pairing by game/role/schedule/goals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Weekly team formation and ranked nights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Tiered access for captain-led placement</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-xs font-medium italic text-[rgb(var(--accent))]">
                You stop relying on random teammates.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--surface),0.8)] text-xl font-brand font-[900] text-[rgb(var(--foreground))]">2</span>
                <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">The Toxicity and Burnout Problem</h3>
              </div>
              <blockquote className="mb-3 border-l-2 border-[rgb(var(--accent))] pl-3 text-sm italic text-[rgb(var(--muted))]">
                &quot;Online play is exhausting.&quot;
              </blockquote>
              <p className="mb-4 text-sm leading-6 text-[rgb(var(--muted))]">
                Gamers are tired—not of the games, but of the environment around them. Voice comms turn hostile, blame culture sets in, and people quit because it&apos;s not worth the stress.
              </p>
              <div className="rounded-lg bg-[rgba(var(--surface),0.6)] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--accent))]">Our solution</p>
                <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Clear code of conduct with consistent moderation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>3-strike policy that applies to everyone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Support for emotional regulation and better competitive habits</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-xs font-medium italic text-[rgb(var(--accent))]">
                You can compete without being punished for being human.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--surface),0.8)] text-xl font-brand font-[900] text-[rgb(var(--foreground))]">3</span>
                <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">The Improvement Problem</h3>
              </div>
              <blockquote className="mb-3 border-l-2 border-[rgb(var(--accent))] pl-3 text-sm italic text-[rgb(var(--muted))]">
                &quot;I want to get better, but I don&apos;t know what to practice.&quot;
              </blockquote>
              <p className="mb-4 text-sm leading-6 text-[rgb(var(--muted))]">
                Most players &quot;grind&quot; instead of training, because nobody gives them a simple system.
              </p>
              <div className="rounded-lg bg-[rgba(var(--surface),0.6)] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--accent))]">Our solution</p>
                <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Standardized training language: Plan, Execute, Connect, Control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>VOD reviews, drills, and monthly Player Cards that show progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Clear improvement plans, not just vague advice</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-xs font-medium italic text-[rgb(var(--accent))]">
                You leave with a clear plan, not just another loss screen.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--surface),0.8)] text-xl font-brand font-[900] text-[rgb(var(--foreground))]">4</span>
                <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">The &quot;No Local Scene&quot; Problem</h3>
              </div>
              <blockquote className="mb-3 border-l-2 border-[rgb(var(--accent))] pl-3 text-sm italic text-[rgb(var(--muted))]">
                &quot;Good players here have nowhere to be seen.&quot;
              </blockquote>
              <p className="mb-4 text-sm leading-6 text-[rgb(var(--muted))]">
                Northern Nevada has talent. What it lacks is a consistent stage.
              </p>
              <div className="rounded-lg bg-[rgba(var(--surface),0.6)] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--accent))]">Our solution</p>
                <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Weekly in-store broadcasts of featured matches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Monthly showcases (any game, any format)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Structured progression: improve → compete → get showcased → mentor/coach</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-xs font-medium italic text-[rgb(var(--accent))]">
                Local pride becomes real, and talent gets a platform.
              </p>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8 lg:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--surface),0.8)] text-xl font-brand font-[900] text-[rgb(var(--foreground))]">5</span>
                <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">The &quot;Third Place&quot; Problem</h3>
              </div>
              <blockquote className="mb-3 border-l-2 border-[rgb(var(--accent))] pl-3 text-sm italic text-[rgb(var(--muted))]">
                &quot;There isn&apos;t a place to belong that fits gaming culture.&quot;
              </blockquote>
              <p className="mb-4 text-sm leading-6 text-[rgb(var(--muted))]">
                Many people want community without needing a bar, a loud venue, or a closed friend group. Community is scattered across apps and DMs, 
                and it&apos;s hard to meet people safely in-person.
              </p>
              <div className="rounded-lg bg-[rgba(var(--surface),0.6)] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgb(var(--accent))]">Our solution</p>
                <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>A physical HQ built for gaming: pop culture + gaming merch retail, esports always on in-store</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>Weekly programming that&apos;s easy to join</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>A welcoming &quot;guild, but local&quot; community across multiple games</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--accent))]"></span>
                    <span>A safer, structured environment for parents and younger players</span>
                  </li>
                </ul>
              </div>
              <p className="mt-4 text-xs font-medium italic text-[rgb(var(--accent))]">
                You can walk in alone and leave connected.
              </p>
            </Card>
          </div>
        </section>

        {/* Staff & Partnerships */}
        <section className="mt-16 scroll-mt-24" aria-labelledby="staff-heading" id="staff">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight">Staff</h2>
                <div role="tablist" aria-label="Staff members" className="flex items-center -space-x-3">
                  {ABOUT_US_MEMBERS.map((m) => {
                    const isActive = m.id === activeAboutId;
                    const isHovered = m.id === hoveredAboutId;
                    const index = ABOUT_US_MEMBERS.findIndex((x) => x.id === m.id);
                    const hoverShift =
                      hoveredAboutIndex === -1
                        ? ""
                        : index < hoveredAboutIndex
                          ? "-translate-x-1"
                          : index > hoveredAboutIndex
                            ? "translate-x-1"
                            : "";

                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="tab"
                        id={`about-tab-${m.id}`}
                        aria-selected={isActive}
                        aria-controls={`about-panel-${m.id}`}
                        onClick={() => selectAboutMember(m.id)}
                        onMouseEnter={() => setHoveredAboutId(m.id)}
                        onMouseLeave={() => setHoveredAboutId(null)}
                        className={cx(
                          "relative rounded-full bg-[rgb(var(--surface))] transition",
                          "transform-gpu transition-transform duration-200 ease-out",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent),0.35)]",
                          hoverShift,
                          isActive
                            ? "z-10 ring-2 ring-[rgba(var(--accent),0.55)]"
                            : "z-0 ring-1 ring-[rgb(var(--border))] opacity-85 hover:opacity-100",
                          isHovered && "z-20 scale-[1.12]"
                        )}
                        title={m.name}
                      >
                        <span className="sr-only">{m.name}</span>
                        <Image
                          src={m.imageSrc}
                          alt={`${m.name} profile photo`}
                          width={36}
                          height={36}
                          className={cx("h-9 w-9 rounded-full object-cover", m.id.startsWith("placeholder") && "grayscale")}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {activeAboutMember && (
                  <div
                    role="tabpanel"
                    key={`${activeAboutMember.id}-${aboutAnimNonce}`}
                    id={`about-panel-${activeAboutMember.id}`}
                    aria-labelledby={`about-tab-${activeAboutMember.id}`}
                    className="min-h-[28rem] space-y-4 about-panel-enter"
                  >
                    <div className="flex items-start gap-4">
                      <div className="about-cascade shrink-0" style={{ animationDelay: "40ms" }}>
                        <Image
                          src={activeAboutMember.imageSrc}
                          alt={`${activeAboutMember.name} profile photo`}
                          width={64}
                          height={64}
                          className={cx(
                            "h-16 w-16 shrink-0 rounded-full border border-[rgb(var(--border))] object-cover",
                            activeAboutMember.id.startsWith("placeholder") && "grayscale"
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold about-cascade" style={{ animationDelay: "90ms" }}>
                          {activeAboutMember.name}
                        </p>
                        <p className="mt-1 text-xs text-[rgb(var(--muted))] about-cascade" style={{ animationDelay: "130ms" }}>
                          {activeAboutMember.role}
                        </p>
                        <p
                          className="mt-2 text-sm leading-6 text-[rgb(var(--muted))] about-cascade"
                          style={{ animationDelay: "170ms" }}
                        >
                          {activeAboutMember.bio}
                        </p>
                      </div>
                    </div>

                    <div
                      className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-4 about-cascade"
                      style={{ animationDelay: "230ms" }}
                    >
                      <p className="text-xs font-semibold text-[rgb(var(--muted))]">Actively playing</p>
                      <p className="mt-2 text-sm leading-6">{activeAboutMember.currentlyPlaying ?? "—"}</p>
                    </div>

                    <div
                      className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-4 about-cascade"
                      style={{ animationDelay: "290ms" }}
                    >
                      <p className="text-xs font-semibold text-[rgb(var(--muted))]">Weekend rotation</p>
                      <p className="mt-2 text-sm leading-6">{activeAboutMember.weekendRotation ?? "—"}</p>
                    </div>

                    <div
                      className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-4 about-cascade"
                      style={{ animationDelay: "350ms" }}
                    >
                      <p className="text-xs font-semibold text-[rgb(var(--muted))]">Story favorites</p>
                      <p className="mt-2 text-sm leading-6">{activeAboutMember.storyFavorites ?? "—"}</p>
                    </div>

                    <div
                      className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-4 about-cascade"
                      style={{ animationDelay: "410ms" }}
                    >
                      <p className="text-xs font-semibold text-[rgb(var(--muted))]">Leveling up</p>
                      <div className="mt-3">
                        {activeAboutMember.climbingBadges?.length ? (
                          <div className="flex items-center gap-3">
                            {activeAboutMember.climbingBadges.map((b) => (
                              <button
                                key={`${b.kind}-${b.game}-${b.label}`}
                                type="button"
                                className="group relative inline-flex"
                                aria-label={`${b.game}: ${b.label}`}
                              >
                                {b.kind === "image" ? (
                                  <Image src={b.badgeSrc} alt={`${b.game} badge`} width={56} height={56} className="h-14 w-14" />
                                ) : (
                                  <div
                                    className={cx(
                                      "grid h-14 w-14 place-items-center rounded-full border-2 bg-black/20",
                                      b.dialColorClassName
                                    )}
                                  >
                                    <span className="text-base font-bold leading-none">{b.value}</span>
                                  </div>
                                )}

                                <div
                                  role="tooltip"
                                  className={cx(
                                    "pointer-events-none absolute left-1/2 bottom-full z-50 mb-3 -translate-x-1/2",
                                    "w-auto",
                                    "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                                  )}
                                >
                                  <div className="relative aspect-video w-[min(84vw,20rem)] overflow-hidden rounded-2xl shadow-xl sm:w-[22rem]">
                                    <Image
                                      src={b.previewSrc}
                                      alt={`${b.game} thumbnail`}
                                      fill
                                      sizes="(max-width: 640px) 84vw, 352px"
                                      className="object-cover"
                                    />
                                  </div>
                                </div>

                                <div
                                  className={cx(
                                    "pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2",
                                    "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                                  )}
                                >
                                  <div className="inline-flex w-max max-w-[84vw] items-center justify-center rounded-md bg-black/65 px-2.5 py-1 shadow-sm">
                                    <p className="truncate whitespace-nowrap text-[11px] font-semibold text-white/95">
                                      {b.game} - {b.label}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm leading-6 text-[rgb(var(--muted))]">—</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-[rgb(var(--muted))]">
                    {activeAboutIndex + 1}/{ABOUT_US_MEMBERS.length}
                  </p>
                  <div className="flex items-center gap-1 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-1">
                    <button
                      type="button"
                      onClick={goToPrevAboutMember}
                      aria-label="Previous team member"
                      className={cx(
                        "grid h-9 w-9 place-items-center rounded-full text-[rgb(var(--muted))] transition",
                        "hover:bg-[rgba(var(--surface),0.9)] hover:text-[rgb(var(--foreground))]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent),0.35)]"
                      )}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M15 18l-6-6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={goToNextAboutMember}
                      aria-label="Next team member"
                      className={cx(
                        "grid h-9 w-9 place-items-center rounded-full text-[rgb(var(--muted))] transition",
                        "hover:bg-[rgba(var(--surface),0.9)] hover:text-[rgb(var(--foreground))]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent),0.35)]"
                      )}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M9 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="partnerships-heading" className="text-2xl font-semibold tracking-tight">
                    Partnerships
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
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}


