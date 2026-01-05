"use client";

// Games page showing launch catalog, community choice slots, and how catalog expands.
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "../_components/SiteFooter";
import { SiteHeader } from "../_components/SiteHeader";
import { Card, cx } from "../_components/ui";

type LaunchGame = {
  gameId: string;
  gameName: string;
  imageSrc: string;
  imageAlt: string;
};

type CommunityChoiceGame = {
  gameId: string;
  gameName: string;
};

type RecognizedGame = {
  gameId: string;
  gameName: string;
  imageSrc: string;
  imageAlt: string;
};

const LAUNCH_GAMES: LaunchGame[] = [
  {
    gameId: "arc-raiders",
    gameName: "ARC Raiders",
    imageSrc: "/images/arc_raiders_thumbnail.jpg",
    imageAlt: "ARC Raiders key art",
  },
  {
    gameId: "valorant",
    gameName: "Valorant",
    imageSrc: "/images/valorant_thumbnail.jpg",
    imageAlt: "Valorant key art",
  },
  {
    gameId: "league-of-legends",
    gameName: "League of Legends",
    imageSrc: "/images/league_of_legends_thumbnail.jpg",
    imageAlt: "League of Legends key art",
  },
  {
    gameId: "marvel-rivals",
    gameName: "Marvel Rivals",
    imageSrc: "/images/marvel_rivals_thumbnail.jpg",
    imageAlt: "Marvel Rivals key art",
  },
];

const COMMUNITY_CHOICE_GAMES: CommunityChoiceGame[] = [
  {
    gameId: "community-choice-1",
    gameName: "Community Choice",
  },
  {
    gameId: "community-choice-2",
    gameName: "Community Choice",
  },
];

const RECOGNIZED_GAMES: RecognizedGame[] = [
  {
    gameId: "abiotic_factor",
    gameName: "Abiotic Factor",
    imageSrc: "/images/abiotic_factor.jpg",
    imageAlt: "Abiotic Factor key art",
  },
  {
    gameId: "dune_awakening",
    gameName: "Dune: Awakening",
    imageSrc: "/images/dune_awakening.jpg",
    imageAlt: "Dune: Awakening key art",
  },
  {
    gameId: "elden_ring",
    gameName: "Elden Ring",
    imageSrc: "/images/elden_ring.jpg",
    imageAlt: "Elden Ring key art",
  },
  {
    gameId: "genshin_impact",
    gameName: "Genshin Impact",
    imageSrc: "/images/genshin_impact.jpg",
    imageAlt: "Genshin Impact key art",
  },
  {
    gameId: "helldivers_2",
    gameName: "Helldivers 2",
    imageSrc: "/images/helldivers_2.jpg",
    imageAlt: "Helldivers 2 key art",
  },
  {
    gameId: "lethal_company",
    gameName: "Lethal Company",
    imageSrc: "/images/lethal_company.jpg",
    imageAlt: "Lethal Company key art",
  },
  {
    gameId: "peak",
    gameName: "Peak",
    imageSrc: "/images/peak.jpg",
    imageAlt: "Peak key art",
  },
  {
    gameId: "repo",
    gameName: "Repo",
    imageSrc: "/images/repo.jpg",
    imageAlt: "Repo key art",
  },
  {
    gameId: "rocket_league",
    gameName: "Rocket League",
    imageSrc: "/images/rocket_league.jpg",
    imageAlt: "Rocket League key art",
  },
  {
    gameId: "smash_bros",
    gameName: "Super Smash Bros.",
    imageSrc: "/images/smash_bros.jpg",
    imageAlt: "Super Smash Bros. key art",
  },
  {
    gameId: "valheim",
    gameName: "Valheim",
    imageSrc: "/images/valheim.jpg",
    imageAlt: "Valheim key art",
  },
  {
    gameId: "warhammer_40k_darktide",
    gameName: "Warhammer 40K: Darktide",
    imageSrc: "/images/warhammer_40k_darktide.jpg",
    imageAlt: "Warhammer 40K: Darktide key art",
  },
];

// Renders catalog details: launch games, community choice slots, FAQs, and CTA.
export default function GamesPage() {
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
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Games</h1>
            <p className="max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
              A curated catalog of multiplayer titles for structured play, plus recognition and support for all games
              — from cozy singleplayer adventures to competitive esports.
            </p>
          </div>
        </section>

        {/* What To Expect */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="benefits-heading" id="benefits">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="benefits-heading" className="text-2xl font-semibold tracking-tight">
                What To Expect
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Structured play, community connection, and support for the games you love.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Local Teammates",
                desc: "Find local players who show up, communicate, and match your vibe — no random queues.",
              },
              {
                title: "Structured Play",
                desc: "Scheduled ranked nights, scrims, and team formation for consistent improvement.",
              },
              {
                title: "All Games Supported",
                desc: "Whether competitive multiplayer or cozy singleplayer, find your community.",
              },
              {
                title: "Shape the Catalog",
                desc: "First wave members vote on community choice games and influence what we add next.",
              },
            ].map((benefit) => (
              <Card key={benefit.title} className="p-5">
                <p className="text-sm font-semibold text-[rgb(var(--accent))]">{benefit.title}</p>
                <p className="mt-2 text-xs leading-5 text-[rgb(var(--muted))]">{benefit.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Year 1 Launch Games */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="launch-games-heading" id="launch-games">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="launch-games-heading" className="text-2xl font-semibold tracking-tight">
                Year 1 Launch Games
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Four confirmed multiplayer titles for structured competitive and casual play, plus two community-voted
                slots.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LAUNCH_GAMES.map((game) => (
              <Card
                key={game.gameId}
                className="group relative overflow-hidden border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.72)] p-0 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[rgba(var(--accent),0.3)]"
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={game.imageSrc}
                    alt={game.imageAlt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-base font-semibold text-white drop-shadow-md">{game.gameName}</p>
                  </div>
                </div>
              </Card>
            ))}

            {COMMUNITY_CHOICE_GAMES.map((game) => (
              <Card
                key={game.gameId}
                className="group relative overflow-hidden border-2 border-dashed border-[rgba(var(--border),0.6)] bg-[rgba(var(--surface),0.72)] p-0 shadow-sm transition-all duration-300 hover:border-[rgba(var(--accent),0.4)] hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-[rgba(var(--accent),0.1)] to-[rgba(var(--accent-2),0.1)]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl font-bold text-[rgb(var(--muted))] opacity-50">?</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-base font-semibold text-[rgb(var(--foreground))]">{game.gameName}</p>
                    <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                      First wave members will vote to fill these slots
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Community voting</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    The two open slots in our Year 1 catalog will be filled by community vote. First wave members can
                    nominate and vote for their preferred multiplayer titles during our launch period.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                    This ensures our structured play programming matches what the community wants most.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Expanding on demand</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    We actively expand our recognized major multiplayer titles based on member interest and demand. If
                    enough players want structured play for a title, we&apos;ll add it to our catalog.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                    Throughout the seasons, we&apos;ll grow this catalog and partner with studios where possible to
                    support community events, tournaments, and showcases.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* All Games Welcome */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="all-games-heading" id="all-games">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="all-games-heading" className="text-2xl font-semibold tracking-tight">
                All Games Welcome
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                While our eSports catalog focuses on structured multiplayer play, we recognize and encourage members to
                connect and explore many other titles between runs.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RECOGNIZED_GAMES.map((game) => (
              <Card
                key={game.gameId}
                className="group relative overflow-hidden border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.72)] p-0 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[rgba(var(--accent),0.3)]"
              >
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={game.imageSrc}
                    alt={game.imageAlt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-base font-semibold text-white drop-shadow-md">{game.gameName}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Beyond the catalog</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    While our Year 1 Launch Games catalog highlights multiplayer titles designed for structured
                    competitive and casual play, we recognize and encourage all games — singleplayer adventures, puzzle
                    games, party games, cozy titles, horror experiences, and everything in between.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                    Gaming is diverse, and so is our community. Whether you&apos;re climbing ranks in Valorant or
                    building farms in Stardew Valley, you belong here.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Connect online and offline</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    We encourage players to connect both online and offline. Join LFG channels for any game, organize
                    in-person meetups for local co-op sessions, or find teammates for your favorite multiplayer
                    title.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                    Our community infrastructure supports finding players for structured competitive play, casual
                    drop-in sessions, story-driven co-op, and everything in between.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Multiplayer",
                    desc: "Structured competitive and casual play for ranked nights, scrims, and team formation.",
                  },
                  {
                    title: "Singleplayer",
                    desc: "Share your progress, discuss story moments, and find others playing the same titles.",
                  },
                  {
                    title: "Co-op & Party",
                    desc: "Organize local and online sessions for co-op adventures, party games, and social play.",
                  },
                ].map((category) => (
                  <div
                    key={category.title}
                    className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-4"
                  >
                    <p className="text-sm font-semibold text-[rgb(var(--accent))]">{category.title}</p>
                    <p className="mt-2 text-xs leading-5 text-[rgb(var(--muted))]">{category.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Seasonal Growth */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="growth-heading" id="growth">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="growth-heading" className="text-2xl font-semibold tracking-tight">
                Growing Together
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Our game catalog evolves with the community and through strategic partnerships.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Seasonal expansion</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    Throughout each season, we expand our catalog based on community interest, emerging titles, and
                    member feedback. New multiplayer titles are added to structured play programming when there&apos;s
                    sufficient demand.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                    This keeps our programming relevant and ensures we&apos;re supporting the games players actually
                    want to play together.
                  </p>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Studio partnerships</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    Where possible, we partner with game studios to support community events, tournaments, showcases,
                    and long-term ecosystem growth. These partnerships help us provide better programming, prizing, and
                    opportunities for our members.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                    Interested in partnering?{" "}
                    <Link href="/about#partnerships" className="font-semibold text-[rgb(var(--accent))] hover:underline">
                      Get in touch
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="how-it-works-heading" id="how-it-works">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="how-it-works-heading" className="text-2xl font-semibold tracking-tight">
                How It Works
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Simple steps to get started and find your gaming community.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "Join the Waitlist",
                    desc: "Sign up for free. No payment required. First wave members get exclusive access and voting rights.",
                  },
                  {
                    step: "2",
                    title: "Select Your Games",
                    desc: "Choose from our launch catalog or add your own games. All games are welcome and recognized.",
                  },
                  {
                    step: "3",
                    title: "Connect & Play",
                    desc: "Find teammates, join scheduled play sessions, and participate in community events when we open.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div
                      className={cx(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        "bg-[rgba(var(--accent),0.12)] text-[rgb(var(--accent))] ring-1 ring-[rgba(var(--accent),0.25)]",
                        "font-brand text-lg font-[900] tracking-tight leading-none"
                      )}
                      aria-hidden="true"
                    >
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-2 text-xs leading-5 text-[rgb(var(--muted))]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="faq-heading" id="faq">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Common questions about our games catalog and community.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[
              {
                q: "Do I need to play the launch games to join?",
                a: "No. While our structured play programming focuses on the launch catalog, we recognize and support all games. You can add any games you play to your profile.",
              },
              {
                q: "How do the community choice slots work?",
                a: "First wave members can nominate and vote for multiplayer titles to fill the two open slots. Voting happens during our launch period based on registered interests.",
              },
              {
                q: "Can you add my favorite game to the catalog?",
                a: "Yes. We expand our recognized multiplayer titles based on member demand. If enough players want structured play for a title, we'll add it to our programming.",
              },
              {
                q: "What if I only play singleplayer games?",
                a: "You're welcome here. Our community supports all games. Share your progress, discuss story moments, and connect with others playing the same titles — online or at in-person meetups.",
              },
              {
                q: "When will new games be added?",
                a: "We expand our catalog throughout each season based on community interest and emerging titles. New multiplayer games are added when there's sufficient demand from members.",
              },
              {
                q: "How do I vote on community choice games?",
                a: "First wave members will receive voting access when we launch. You'll be able to nominate titles and vote on the final selections for the two open slots.",
              },
            ].map((item) => (
              <Card key={item.q} className="p-5">
                <h3 className="text-sm font-semibold text-[rgb(var(--accent))]">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">{item.a}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14">
          <Card className="p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Ready to join?</h2>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Join the first wave waitlist to vote on community choice games, shape our catalog, and secure your spot.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/#waitlist"
                className="rounded-full bg-[rgb(var(--foreground))] px-6 py-3 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                Join Waitlist
              </Link>
              <Link
                href="/memberships"
                className="rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-[rgba(var(--foreground),0.04)] hover:border-[rgba(var(--border),0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                View Memberships
              </Link>
            </div>
            <p className="mt-4 text-xs text-[rgb(var(--muted))]">
              Free to join. No payment required. First wave members get exclusive benefits.
            </p>
          </Card>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

