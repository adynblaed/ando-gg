"use client";

// Players page with registry, filters, league badges preview, and leaderboards by game.
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { SiteFooter } from "../_components/SiteFooter";
import { SiteHeader } from "../_components/SiteHeader";
import { Card, cx } from "../_components/ui";

type ClimbingBadge =
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
    };

type Player = {
  id: string;
  clubUsername: string;
  name?: string;
  role?: string;
  imageSrc?: string;
  region?: string;
  games: Array<{
    gameId: string;
    gameName: string;
    rank?: string;
    level?: string;
    badges?: ClimbingBadge[];
  }>;
  currentlyPlaying?: string;
  publicProfile?: boolean;
};

const SAMPLE_PLAYERS: Player[] = [
  {
    id: "adyn-blaed",
    clubUsername: "ando",
    name: "Adyn Blaed",
    role: "Founder",
    imageSrc: "/images/blaed_profile_pic.png",
    region: "Reno",
    games: [
      {
        gameId: "marvel-rivals",
        gameName: "Marvel Rivals",
        rank: "Grandmaster",
        badges: [
          {
            kind: "image",
            game: "Marvel Rivals",
            label: "Grandmaster",
            badgeSrc: "/images/4%20-%20Grandmaster@56.png",
            previewSrc: "/images/marvel_rivals_thumbnail.jpg",
          },
        ],
      },
      {
        gameId: "arc-raiders",
        gameName: "ARC Raiders",
        level: "55",
        badges: [
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
        gameId: "league-of-legends",
        gameName: "League of Legends",
        rank: "Unranked",
      },
      {
        gameId: "valorant",
        gameName: "Valorant",
        rank: "Unranked",
      },
    ],
    currentlyPlaying: "ARC Raiders, Marvel Rivals, League of Legends",
    publicProfile: true,
  },
];

const LAUNCH_GAMES = [
  { gameId: "arc-raiders", gameName: "ARC Raiders" },
  { gameId: "valorant", gameName: "Valorant" },
  { gameId: "league-of-legends", gameName: "League of Legends" },
  { gameId: "marvel-rivals", gameName: "Marvel Rivals" },
];

const RECOGNIZED_GAMES = [
  ...LAUNCH_GAMES,
  { gameId: "abiotic_factor", gameName: "Abiotic Factor" },
  { gameId: "dune_awakening", gameName: "Dune: Awakening" },
  { gameId: "elden_ring", gameName: "Elden Ring" },
  { gameId: "genshin_impact", gameName: "Genshin Impact" },
  { gameId: "helldivers_2", gameName: "Helldivers 2" },
  { gameId: "lethal_company", gameName: "Lethal Company" },
  { gameId: "rocket_league", gameName: "Rocket League" },
  { gameId: "valheim", gameName: "Valheim" },
];

// Renders player registry search, badges overview, and per-game leaderboards.
export default function PlayersPage() {
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [badgesOpen, setBadgesOpen] = useState(false);

  const filteredPlayers = useMemo(() => {
    let players = SAMPLE_PLAYERS.filter((p) => p.publicProfile);

    if (selectedGame !== "all") {
      players = players.filter((p) => p.games.some((g) => g.gameId === selectedGame));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      players = players.filter(
        (p) =>
          p.clubUsername.toLowerCase().includes(query) ||
          p.name?.toLowerCase().includes(query) ||
          p.region?.toLowerCase().includes(query)
      );
    }

    return players;
  }, [selectedGame, searchQuery]);

  const getPlayersForGame = (gameId: string) => {
    return SAMPLE_PLAYERS.filter(
      (p) => p.publicProfile && p.games.some((g) => g.gameId === gameId)
    );
  };

  /**
   * Gets top 10 players for a game, with empty slots if fewer than 10
   */
  const getTop10PlayersForGame = (gameId: string): (Player | null)[] => {
    const players = getPlayersForGame(gameId);
    const top10: (Player | null)[] = players.slice(0, 10);
    // Fill remaining slots up to 10 with null for empty state
    while (top10.length < 10) {
      top10.push(null);
    }
    return top10;
  };

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
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Players</h1>
            <p className="max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
              Browse the player registry and leaderboards. Find teammates, check ranks, and connect with the Ando
              community.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] px-4 py-2.5">
              <p className="text-xs font-semibold text-[rgb(var(--muted))]">Total Players</p>
              <p className="mt-1 text-lg font-bold text-[rgb(var(--foreground))]">
                {SAMPLE_PLAYERS.filter((p) => p.publicProfile).length}
              </p>
            </div>
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] px-4 py-2.5">
              <p className="text-xs font-semibold text-[rgb(var(--muted))]">Active Games</p>
              <p className="mt-1 text-lg font-bold text-[rgb(var(--foreground))]">
                {LAUNCH_GAMES.filter((g) => getPlayersForGame(g.gameId).length > 0).length}
              </p>
            </div>
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] px-4 py-2.5">
              <p className="text-xs font-semibold text-[rgb(var(--muted))]">Regions</p>
              <p className="mt-1 text-lg font-bold text-[rgb(var(--foreground))]">
                {new Set(SAMPLE_PLAYERS.filter((p) => p.publicProfile && p.region).map((p) => p.region)).size}
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="mt-8">
          <Card className="p-4 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[rgb(var(--muted))]">Search players</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username, name, or region..."
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-4 py-2.5 text-sm transition focus:border-[rgba(var(--accent),0.5)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--accent),0.1)]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-[rgb(var(--muted))]">Filter by game</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.9)] px-4 py-2.5 text-sm text-[rgb(var(--foreground))] transition focus:border-[rgba(var(--accent),0.5)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--accent),0.1)] dark:bg-[rgba(var(--surface-2),0.95)]"
                >
                  <option value="all">All Games</option>
                  {RECOGNIZED_GAMES.map((game) => (
                    <option key={game.gameId} value={game.gameId} className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
                      {game.gameName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </section>

        {/* Info Section - Public Profiles & Find Teammates */}
        <section className="mt-14">
          <Card className="p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Public profiles</h3>
                <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                  Players can opt-in to make their profiles public, sharing their ranks, badges, and gaming preferences
                  with the community. All information is optional and controlled by the player.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">Find teammates</h3>
                <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                  Use the leaderboards and registry to find players at your skill level, in your region, or playing your
                  favorite games. Connect and build your squad.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* League Badges */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="badges-heading" id="badges">
          <Card className={cx("relative", badgesOpen ? "p-6 sm:p-8" : "rounded-2xl p-4 sm:p-5")}>
            <div
              className={cx(
                "relative overflow-hidden",
                badgesOpen
                  ? "-mx-6 -mt-6 mb-5 rounded-t-3xl sm:-mx-8 sm:-mt-8"
                  : "-m-4 rounded-2xl sm:-m-5"
              )}
            >
              <div className="pointer-events-none absolute inset-0">
                <Image
                  src="/images/waitlist_banner.jpg"
                  alt=""
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 92vw, 960px"
                  className="object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/20 to-transparent" />
              </div>

              <button
                type="button"
                onClick={() => setBadgesOpen((v) => !v)}
                aria-expanded={badgesOpen}
                aria-controls="badges-panel"
                className={cx(
                  "relative z-10 w-full text-left",
                  badgesOpen ? "px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8" : "p-4 sm:p-5"
                )}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 id="badges-heading" className="text-2xl font-semibold tracking-tight text-white drop-shadow">
                      League Badges
                    </h2>
                    <p className="mt-1 text-sm text-white/85 drop-shadow">
                      Seasonal collectibles and achievements. Earn badges through participation, milestones, and community
                      contributions.
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <p className="text-xs text-white/80 drop-shadow">Collectible • Seasonal</p>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className={cx(
                        "shrink-0 text-white/90 drop-shadow transition-transform duration-200",
                        badgesOpen ? "rotate-180" : "rotate-0"
                      )}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            <div
              id="badges-panel"
              className={cx(
                "overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                badgesOpen ? "max-h-[5000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
              )}
            >
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-[rgb(var(--accent))]">First Wave Collectibles</h3>
                  <p className="mb-4 text-sm leading-6 text-[rgb(var(--muted))]">
                    Exclusive badges for first wave members who join before launch. These collectibles represent your
                    early commitment to building the Ando community.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        id: "founder-token",
                        name: "Year 1 Founder's Token",
                        description: "Exclusive collectible for first wave members. Your esports league badge and player ID.",
                        rarity: "Founder",
                        icon: "🏆",
                      },
                      {
                        id: "early-adopter",
                        name: "Early Adopter",
                        description: "Joined during the pre-launch waitlist period and helped shape the community.",
                        rarity: "Limited",
                        icon: "⭐",
                      },
                      {
                        id: "community-builder",
                        name: "Community Builder",
                        description: "Actively participated in community voting and feedback during launch.",
                        rarity: "Seasonal",
                        icon: "🤝",
                      },
                    ].map((badge) => (
                      <Card key={badge.id} className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--accent),0.1)] text-2xl">
                            {badge.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold">{badge.name}</p>
                                <p className="mt-1 text-xs text-[rgb(var(--muted))]">{badge.description}</p>
                              </div>
                              <span className="shrink-0 rounded-full bg-[rgba(var(--accent),0.1)] px-2.5 py-1 text-[10px] font-semibold text-[rgb(var(--accent))]">
                                {badge.rarity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-5">
                  <h4 className="mb-2 text-sm font-semibold text-[rgb(var(--accent))]">More Badges Coming Soon!</h4>
                  <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                    Additional seasonal badges will be added throughout the year. Earn badges for milestones, achievements,
                    tournament participation, coaching contributions, and community leadership.
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-[rgb(var(--accent))]">First Wave Rewards</h3>
                  <p className="mb-4 text-sm leading-6 text-[rgb(var(--muted))]">
                    Accomplishing the achievements that grant each collectible is an official raffle entry for rewards. We
                    rotate rewards based on in-store pickups and drops coordinated with each season.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      {
                        id: "popmart",
                        name: "Popmart Blindbox",
                        description: "Collectible blindbox figures from Popmart collections.",
                      },
                      {
                        id: "tcg",
                        name: "TCG Play Booster Packs",
                        description: "Trading card game booster packs for competitive and casual play.",
                      },
                      {
                        id: "3d-printed",
                        name: "3D Printed Ando Collectibles",
                        description: "Curated collectibles printed every League Season based on Badge Achievements.",
                      },
                    ].map((reward) => (
                      <Card key={reward.id} className="p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(var(--accent),0.1)] mb-3">
                          <span className="text-xl">🎁</span>
                        </div>
                        <p className="text-sm font-semibold">{reward.name}</p>
                        <p className="mt-1.5 text-xs leading-5 text-[rgb(var(--muted))]">{reward.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Player Registry */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="registry-heading" id="registry">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="registry-heading" className="text-2xl font-semibold tracking-tight">
                Player Registry
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Browse all public player profiles. Players can opt-in to share their progress and connect with others.
              </p>
            </div>
          </div>

          {filteredPlayers.length === 0 ? (
            <Card className="mt-6 p-8 text-center">
              <p className="text-sm text-[rgb(var(--muted))]">
                {searchQuery || selectedGame !== "all"
                  ? "No players found matching your search."
                  : "No public profiles yet. Join the waitlist to be among the first!"}
              </p>
            </Card>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlayers.map((player) => (
                <Card key={player.id} className="p-5 transition-all hover:shadow-md">
                  <div className="flex items-start gap-4">
                    {player.imageSrc ? (
                      <Image
                        src={player.imageSrc}
                        alt={player.clubUsername}
                        width={64}
                        height={64}
                        className="h-16 w-16 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--accent),0.1)] text-lg font-semibold text-[rgb(var(--accent))]">
                        {player.clubUsername[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{player.clubUsername}</p>
                          {player.name && (
                            <p className="mt-0.5 text-xs text-[rgb(var(--muted))]">{player.name}</p>
                          )}
                          {player.role && (
                            <p className="mt-1 text-xs font-semibold text-[rgb(var(--accent))]">{player.role}</p>
                          )}
                        </div>
                      </div>
                      {player.region && (
                        <p className="mt-2 text-xs text-[rgb(var(--muted))]">📍 {player.region}</p>
                      )}
                      {player.currentlyPlaying && (
                        <p className="mt-3 text-xs leading-5 text-[rgb(var(--muted))]">
                          <span className="font-semibold">Playing:</span> {player.currentlyPlaying}
                        </p>
                      )}
                      {player.games.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {player.games.slice(0, 3).map((game) => (
                            <span
                              key={game.gameId}
                              className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] px-2.5 py-1 text-xs font-semibold"
                            >
                              {game.gameName}
                              {game.rank && (
                                <span className="ml-1.5 text-[rgb(var(--muted))]">• {game.rank}</span>
                              )}
                              {game.level && (
                                <span className="ml-1.5 text-[rgb(var(--muted))]">• Lv.{game.level}</span>
                              )}
                            </span>
                          ))}
                          {player.games.length > 3 && (
                            <span className="inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] px-2.5 py-1 text-xs font-semibold text-[rgb(var(--muted))]">
                              +{player.games.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      {player.games.some((g) => g.badges && g.badges.length > 0) && (
                        <div className="mt-3 flex items-center gap-2">
                          {player.games
                            .flatMap((g) => g.badges || [])
                            .slice(0, 3)
                            .map((badge, index) => (
                              <div key={index} className="group relative">
                                {badge.kind === "image" ? (
                                  <Image
                                    src={badge.badgeSrc}
                                    alt={`${badge.game} ${badge.label}`}
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 cursor-pointer transition-transform hover:scale-110"
                                  />
                                ) : (
                                  <div
                                    className={cx(
                                      "grid h-8 w-8 place-items-center rounded-full border-2 bg-black/20 text-[10px] font-bold",
                                      badge.dialColorClassName
                                    )}
                                  >
                                    {badge.value}
                                  </div>
                                )}
                                <div
                                  role="tooltip"
                                  className={cx(
                                    "pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 -translate-x-1/2",
                                    "w-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                  )}
                                >
                                  <div className="relative aspect-video w-[min(84vw,18rem)] overflow-hidden rounded-xl shadow-lg sm:w-[20rem]">
                                    <Image
                                      src={badge.previewSrc}
                                      alt={`${badge.game} thumbnail`}
                                      fill
                                      sizes="(max-width: 640px) 84vw, 320px"
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={cx(
                                    "pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2",
                                    "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                  )}
                                >
                                  <div className="inline-flex w-max max-w-[84vw] items-center justify-center rounded-md bg-black/65 px-2 py-0.5 shadow-sm">
                                    <p className="truncate whitespace-nowrap text-[10px] font-semibold text-white/95">
                                      {badge.game} - {badge.label}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Game Leaderboards */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="leaderboards-heading" id="leaderboards">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="leaderboards-heading" className="text-2xl font-semibold tracking-tight">
                Game Leaderboards
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Top players by game. Rankings update as players join and share their progress.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {LAUNCH_GAMES.map((game) => {
              const gamePlayers = getPlayersForGame(game.gameId);
              const top10Players = getTop10PlayersForGame(game.gameId);
              const hasPlayers = gamePlayers.length > 0;

              return (
                <Card key={game.gameId} className="p-0 relative" style={{ overflow: 'visible' }}>
                  <div className="border-b border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(var(--accent),0.1)]">
                          <span className="text-lg">🎮</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{game.gameName}</h3>
                          <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                            {hasPlayers
                              ? `Top 10 Leaderboard • ${gamePlayers.length} ${gamePlayers.length === 1 ? "player" : "players"} registered`
                              : "Top 10 Leaderboard • No players registered yet"}
                          </p>
                        </div>
                      </div>
                      {hasPlayers && (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="rounded-full bg-[rgba(var(--accent),0.1)] px-3 py-1 text-xs font-semibold text-[rgb(var(--accent))]">
                            Active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto" style={{ overflowY: 'visible', clipPath: 'none' }}>
                    <div className="min-w-full inline-block relative" style={{ overflow: 'visible' }}>
                      <table className="w-full relative" style={{ overflow: 'visible' }}>
                        <thead className="bg-[rgba(var(--surface),0.4)] sticky top-0" style={{ zIndex: 1 }}>
                          <tr>
                            <th className="w-16 sm:w-20 px-3 sm:px-6 py-3 text-left text-xs font-semibold text-[rgb(var(--muted))]">
                              Rank
                            </th>
                            <th className="min-w-[140px] sm:min-w-[200px] flex-1 px-3 sm:px-6 py-3 text-left text-xs font-semibold text-[rgb(var(--muted))]">
                              Player
                            </th>
                            <th className="w-28 sm:w-36 px-3 sm:px-6 py-3 text-left text-xs font-semibold text-[rgb(var(--muted))] hidden sm:table-cell">
                              Rank/Level
                            </th>
                            <th className="w-24 sm:w-32 px-3 sm:px-6 py-3 text-left text-xs font-semibold text-[rgb(var(--muted))]">
                              Badges
                            </th>
                            <th className="w-20 sm:w-28 px-3 sm:px-6 py-3 text-left text-xs font-semibold text-[rgb(var(--muted))] hidden md:table-cell">
                              Region
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgb(var(--border))]" style={{ position: "relative", zIndex: 1 }}>
                          {top10Players.map((player, index) => {
                            // Empty slot
                            if (!player) {
                              return (
                                <tr
                                  key={`empty-${index}`}
                                  className="opacity-40"
                                >
                                  <td className="px-3 sm:px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      <span className="font-brand text-lg sm:text-xl font-[900] text-[rgb(var(--muted))] opacity-40">
                                        {index + 1}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-3 sm:px-6 py-4">
                                    <span className="text-[10px] sm:text-xs text-[rgb(var(--muted))] italic">— Available —</span>
                                  </td>
                                  <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                                    <span className="text-[10px] sm:text-xs text-[rgb(var(--muted))]">—</span>
                                  </td>
                                  <td className="px-3 sm:px-6 py-4">
                                    <span className="text-[10px] sm:text-xs text-[rgb(var(--muted))]">—</span>
                                  </td>
                                  <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                                    <span className="text-[10px] sm:text-xs text-[rgb(var(--muted))]">—</span>
                                  </td>
                                </tr>
                              );
                            }

                            // Player row
                            const gameData = player.games.find((g) => g.gameId === game.gameId);
                            return (
                              <tr
                                key={player.id}
                                className="transition-colors hover:bg-[rgba(var(--surface),0.4)]"
                              >
                                <td className="px-3 sm:px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-brand text-lg sm:text-xl font-[900] text-[rgb(var(--foreground))]">
                                      {index + 1}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    {player.imageSrc ? (
                                      <Image
                                        src={player.imageSrc}
                                        alt={player.clubUsername}
                                        width={40}
                                        height={40}
                                        className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full object-cover ring-2 ring-[rgba(var(--border),0.5)]"
                                      />
                                    ) : (
                                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--accent),0.1)] text-xs sm:text-sm font-semibold text-[rgb(var(--accent))] ring-2 ring-[rgba(var(--border),0.5)]">
                                        {player.clubUsername[0]?.toUpperCase()}
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs sm:text-sm font-semibold truncate">{player.clubUsername}</p>
                                      {player.name && (
                                        <p className="text-[10px] sm:text-xs text-[rgb(var(--muted))] truncate">{player.name}</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                                  <div className="text-xs sm:text-sm">
                                    {gameData?.rank && (
                                      <span className="inline-flex items-center rounded-full bg-[rgba(var(--accent),0.1)] px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-[rgb(var(--accent))]">
                                        {gameData.rank}
                                      </span>
                                    )}
                                    {gameData?.level && (
                                      <span className="inline-flex items-center rounded-full bg-[rgba(var(--accent),0.1)] px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-[rgb(var(--accent))]">
                                        Lv.{gameData.level}
                                      </span>
                                    )}
                                    {!gameData?.rank && !gameData?.level && (
                                      <span className="text-[10px] sm:text-xs text-[rgb(var(--muted))]">—</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4" style={{ overflow: 'visible', position: 'relative', zIndex: 100 }}>
                                  <div className="relative flex items-center gap-1.5 sm:gap-2" style={{ position: 'relative', zIndex: 100 }}>
                                    {gameData?.badges && gameData.badges.length > 0 ? (
                                      gameData.badges.map((badge, badgeIndex) => (
                                        <div key={badgeIndex} className="group relative" style={{ position: 'relative', zIndex: 100 }}>
                                          {badge.kind === "image" ? (
                                            <Image
                                              src={badge.badgeSrc}
                                              alt={`${badge.game} ${badge.label}`}
                                              width={40}
                                              height={40}
                                              className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer transition-transform hover:scale-110"
                                            />
                                          ) : (
                                            <div
                                              className={cx(
                                                "grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full border-2 bg-black/20 text-[10px] sm:text-xs font-bold transition-transform hover:scale-110",
                                                badge.dialColorClassName
                                              )}
                                            >
                                              {badge.value}
                                            </div>
                                          )}
                                          <div
                                            role="tooltip"
                                            className={cx(
                                              "pointer-events-none absolute left-1/2 bottom-full mb-3 -translate-x-1/2",
                                              "w-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                                              "max-w-[90vw]"
                                            )}
                                            style={{ 
                                              zIndex: 10000,
                                              position: 'absolute'
                                            }}
                                          >
                                            <div className="relative aspect-video w-[min(84vw,20rem)] overflow-hidden rounded-2xl shadow-xl sm:w-[22rem]">
                                              <Image
                                                src={badge.previewSrc}
                                                alt={`${badge.game} thumbnail`}
                                                fill
                                                sizes="(max-width: 640px) 84vw, 352px"
                                                className="object-cover"
                                              />
                                            </div>
                                          </div>
                                          <div
                                            className={cx(
                                              "pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2",
                                              "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                            )}
                                            style={{ 
                                              zIndex: 10000,
                                              position: 'absolute'
                                            }}
                                          >
                                            <div className="inline-flex w-max max-w-[84vw] items-center justify-center rounded-md bg-black/65 px-2.5 py-1 shadow-sm">
                                              <p className="truncate whitespace-nowrap text-[11px] font-semibold text-white/95">
                                                {badge.game} - {badge.label}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-[10px] sm:text-xs text-[rgb(var(--muted))]">—</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                                  <span className="text-xs sm:text-sm text-[rgb(var(--muted))]">{player.region || "—"}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14">
          <Card className="p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Join the community</h2>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Sign up to create your profile, share your progress, and connect with other players.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/#waitlist"
                className="rounded-full bg-[rgb(var(--foreground))] px-6 py-3 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                Join Waitlist
              </Link>
              <Link
                href="/games"
                className="rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-[rgba(var(--foreground),0.04)] hover:border-[rgba(var(--border),0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                View Games
              </Link>
            </div>
          </Card>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

