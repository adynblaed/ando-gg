"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { SiteFooter } from "../_components/SiteFooter";
import { SiteHeader } from "../_components/SiteHeader";
import { Card, cx } from "../_components/ui";

type HighSchoolBadge = {
  schoolId: string;
  schoolName: string;
  city: string;
  badgeSrc: string;
  description: string;
  website: string;
};

const INVITED_HIGH_SCHOOLS: HighSchoolBadge[] = [
  {
    schoolId: "damonte-ranch-high",
    schoolName: "Damonte Ranch High School",
    city: "Reno",
    badgeSrc: "/images/damonte_hs_badge.jpg",
    description: "A WCSD public high school in south Reno. Building a tradition of excellence in academics, athletics, and student activities.",
    website: "https://damonteranch.washoeschools.net/",
  },
  {
    schoolId: "galena-high",
    schoolName: "Galena High School",
    city: "Reno",
    badgeSrc: "/images/galena_hs_badge.jpg",
    description: "A WCSD public high school in Reno. Recognized for academic rigor, competitive athletics, and comprehensive extracurricular programs.",
    website: "https://galena.washoeschools.net/",
  },
  {
    schoolId: "incline-high",
    schoolName: "Incline High School",
    city: "Incline Village",
    badgeSrc: "/images/incline_hs_badge.jpg",
    description: "A WCSD public high school in Incline Village (Lake Tahoe area). Serving the North Lake Tahoe community with comprehensive educational programs.",
    website: "https://inclinehs.washoeschools.net/",
  },
  {
    schoolId: "innovations-high",
    schoolName: "Innovations High School",
    city: "Reno",
    badgeSrc: "/images/innovations_hs_badge.jpg",
    description: "A WCSD public 'School of Choice' high school in Reno. Offers alternative educational pathways and personalized learning approaches.",
    website: "https://innovations.washoeschools.net/",
  },
  {
    schoolId: "mcqueen-high",
    schoolName: "McQueen High School",
    city: "Reno",
    badgeSrc: "/images/mcqueen_hs_badge.jpg",
    description: "A WCSD public high school in Reno (Robert McQueen HS). Emphasizing innovation, student achievement, and comprehensive academic programs.",
    website: "https://mcqueen.washoeschools.net/",
  },
  {
    schoolId: "north-valleys-high",
    schoolName: "North Valleys High School",
    city: "Reno",
    badgeSrc: "/images/north_valleys_hs_badge.jpg",
    description: "A WCSD public high school in Reno's north valleys. Serving the North Valleys community with diverse academic and extracurricular opportunities.",
    website: "https://northvalleys.washoeschools.net/",
  },
  {
    schoolId: "hug-high",
    schoolName: "Procter R. Hug High School",
    city: "Sparks",
    badgeSrc: "/images/hug_hs_badge.jpg",
    description: "The new WCSD public high school in Sparks. Fostering academic excellence, student leadership, and community engagement.",
    website: "https://hug.washoeschools.net/",
  },
  {
    schoolId: "reed-high",
    schoolName: "Edward C. Reed High School",
    city: "Sparks",
    badgeSrc: "/images/reed_hs_badge.jpg",
    description: "A WCSD public high school in Sparks. Committed to academic achievement, character development, and preparing students for post-secondary success.",
    website: "https://reed.washoeschools.net/",
  },
  {
    schoolId: "sparks-high",
    schoolName: "Sparks High School",
    city: "Sparks",
    badgeSrc: "/images/sparks_hs_badge.jpg",
    description: "A WCSD public high school in Sparks. Home of the Railroaders, committed to academic excellence, student achievement, and comprehensive educational programs.",
    website: "https://sparkshs.washoeschools.net/",
  },
  {
    schoolId: "spanish-springs-high",
    schoolName: "Spanish Springs High School",
    city: "Spanish Springs",
    badgeSrc: "/images/spanish_springs_hs_badge.jpg",
    description: "A WCSD public high school in Spanish Springs (Sparks area). Providing comprehensive educational programs and strong community connections.",
    website: "https://spanishspringshs.washoeschools.net/",
  },
  {
    schoolId: "tmcc-high",
    schoolName: "Truckee Meadows CC High School",
    city: "Reno",
    badgeSrc: "/images/tmcc_hs_badge.jpg",
    description: "A WCSD public magnet high school at TMCC. Provides college credit opportunities and prepares students for post-secondary education.",
    website: "https://tmcchs.washoeschools.net/",
  },
  {
    schoolId: "wooster-high",
    schoolName: "Earl Wooster High School",
    city: "Reno",
    badgeSrc: "/images/wooster_hs_badge.jpg",
    description: "A WCSD public high school in southwest Reno. Committed to student success, community engagement, and comprehensive educational excellence.",
    website: "https://wooster.washoeschools.net/",
  },
];

function getSchoolDisplayName(schoolName: string): string {
  if (schoolName.includes("Truckee Meadows CC")) {
    return "TMCC High";
  }
  
  const parenMatch = schoolName.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    return parenMatch[2];
  }
  
  let displayName = schoolName
    .replace(/\s+High\s+School$/i, "")
    .replace(/\s+CC\s+High\s+School$/i, "")
    .replace(/\s+High$/i, "")
    .trim();
  
  return displayName;
}

export default function EventsPage() {
  const [bracketFormatIndex, setBracketFormatIndex] = useState(0);
  const bracketFormats = [
    {
      id: "group-stage",
      label: "Group Stage",
      description: "3 groups of 4 teams, top 2 advance",
      detailedDescription: {
        origin: "Originated in international soccer tournaments (FIFA World Cup, UEFA Champions League) and adapted for esports by major leagues like League of Legends World Championship and Dota 2's The International.",
        howItWorks: "Teams are divided into groups where each team plays every other team in their group. Top teams from each group advance to a playoff bracket. For 12 teams: 3 groups of 4, each team plays 3 matches, top 2 from each group (6 teams) advance to playoffs.",
        comparison: "More matches per team than single elimination, fewer than round robin. Provides recovery opportunities—teams can lose a match and still advance. Balances participation with competitive intensity.",
        esportsPerception: "Widely used in premier esports tournaments. Considered fair and engaging for viewers. Allows underdogs to prove themselves while ensuring top teams advance. Standard format for major international competitions.",
      },
    },
    {
      id: "round-robin",
      label: "Round Robin",
      description: "All teams play each other once",
      detailedDescription: {
        origin: "Classic tournament format dating back to chess and traditional sports. Used in esports for league play (Overwatch League regular season, LCS/LEC splits) and some smaller tournaments.",
        howItWorks: "Every team plays every other team exactly once. Teams are ranked by win-loss record. For 12 teams: each team plays 11 matches (66 total matches). Top teams by record advance to playoffs or win directly.",
        comparison: "Maximum matches per team, ensuring every team faces every opponent. Most time-intensive format. Provides the most comprehensive ranking but can be lengthy for tournaments.",
        esportsPerception: "Common for regular season play in professional leagues. Less common for standalone tournaments due to time requirements. Valued for fairness and comprehensive competition. Sometimes seen as less exciting than elimination formats.",
      },
    },
    {
      id: "single-elimination",
      label: "Single Elimination",
      description: "Direct knockout bracket",
      detailedDescription: {
        origin: "Traditional knockout format from tennis Grand Slams, boxing, and March Madness. Widely used in esports for quick tournaments, qualifiers, and some major events (Valorant Champions, CS:GO Majors use hybrid formats).",
        howItWorks: "Teams compete in a bracket where losing one match eliminates you. Bracket progresses through rounds until one champion remains. For 12 teams: top 4 seeds get byes, 8 teams play in first round, winners advance through quarterfinals, semifinals, to finals.",
        comparison: "Fewest total matches, fastest format. High stakes—one loss ends your run. Less forgiving than group stage or double elimination. Can feel harsh for teams that lose early.",
        esportsPerception: "Classic tournament format, exciting and dramatic. Popular for viewer engagement due to high stakes. Sometimes criticized for being too punishing—one bad day eliminates strong teams. Common in qualifiers and smaller tournaments.",
      },
    },
    {
      id: "double-elimination",
      label: "Double Elimination",
      description: "Losers bracket for second chance",
      detailedDescription: {
        origin: "Evolved from fighting game tournaments (EVO, Capcom Cup) and adopted by major esports (The International, many CS:GO events). Designed to give teams a second chance after one loss.",
        howItWorks: "Teams start in a winners bracket. After a loss, teams drop to a losers bracket where they can still compete. Losers bracket winner faces winners bracket winner in Grand Finals. For 12 teams: more matches than single elimination, but fewer than group stage.",
        comparison: "More matches than single elimination, fewer than group stage. Provides second chances while maintaining competitive intensity. More complex to follow than single elimination but fairer.",
        esportsPerception: "Highly respected in competitive esports, especially fighting games and MOBAs. Considered the fairest elimination format. Popular with players and viewers. Standard for many premier tournaments. Can be complex for casual viewers.",
      },
    },
  ];
  const currentBracketFormat = bracketFormats[bracketFormatIndex];
  const [bracketSeedings] = useState<string[]>(() => 
    INVITED_HIGH_SCHOOLS.map(s => s.schoolId)
  );

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[rgba(var(--accent),0.12)] blur-3xl" />
        <div className="absolute left-[12%] top-[35%] h-[320px] w-[420px] rounded-full bg-[rgba(var(--accent-2),0.10)] blur-3xl" />
      </div>

      <SiteHeader primaryCtaHref="/#waitlist" primaryCtaLabel="Join Waitlist" />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <section className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Events</h1>
          <p className="max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            Structured tournaments, exhibition matches, and community events for Northern Nevada players and teams.
          </p>
        </section>

        {/* Varsity Invitational */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="invitational-heading" id="invitational">
          <Card className="p-0 relative overflow-hidden">
            <div className="relative aspect-[21/9] w-full">
              <Image
                src="/images/reno_city_overlook_banner.jpg"
                alt="Reno city overlook"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              <div className="absolute inset-0 flex items-end">
                <div className="w-full p-6 sm:p-8">
                  <h2 id="invitational-heading" className="text-3xl font-semibold tracking-tight text-white drop-shadow-lg sm:text-4xl">
                    1st Annual Ando eSports Varsity Invitational (2026)
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90 drop-shadow sm:text-base">
                    Local tournament for Northern Nevada high schools. Structured play, exhibition matches, and community showcase.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">Prize Pool</h3>
              <div className="mb-4">
                <p className="text-3xl font-semibold tracking-tight text-[rgb(var(--foreground))]">$1,000</p>
                <p className="mt-1 text-sm text-[rgb(var(--muted))]">Total prize pool for participating teams</p>
              </div>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                The tournament features a $1,000 prize pool distributed among top-performing teams. This provides meaningful recognition 
                and rewards for student athletes while supporting the growth of competitive esports programs in Northern Nevada schools.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">Goals</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                This tournament aims to establish an esports league within the Northern Nevada region, making competitive 
                gaming accessible to students and faculty just like traditional sports programs.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                High schools can begin to roster esports as extracurricular activities or regularly scheduled programs, providing 
                structured pathways for team play, communication skills, and personal growth aligned with our core pillars: 
                <span className="font-semibold text-[rgb(var(--foreground))]"> Plan</span> (decision-making and objectives), 
                <span className="font-semibold text-[rgb(var(--foreground))]"> Execute</span> (mechanics and consistency), 
                <span className="font-semibold text-[rgb(var(--foreground))]"> Connect</span> (communication and teamwork), and 
                <span className="font-semibold text-[rgb(var(--foreground))]"> Control</span> (mental game and emotional regulation).
              </p>
            </Card>
          </div>

          <div className="mt-6" style={{ overflow: 'visible', position: 'relative' }}>
            <Card className="p-6 sm:p-8" style={{ overflow: 'visible', position: 'relative' }}>
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-4">Invited Schools</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))] mb-6">
                Public high schools across Northern Nevada have been invited to participate in the tournament. 
                Hover over each school badge to learn more.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" style={{ overflow: 'visible', position: 'relative' }}>
                {INVITED_HIGH_SCHOOLS.map((school) => (
                  <div key={school.schoolId} className="group relative flex flex-col items-center" style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] shadow-sm transition-transform duration-200 hover:scale-110 hover:border-[rgb(var(--accent))] cursor-pointer block"
                      aria-label={`Visit ${school.schoolName} website`}
                    >
                      <Image
                        src={school.badgeSrc}
                        alt={`${school.schoolName} badge`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 96px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[rgba(var(--accent),0.1)] text-[rgb(var(--accent))] font-semibold text-xs">${school.schoolName.split(' ').map(n => n[0]).join('')}</div>`;
                          }
                        }}
                      />
                    </a>
                    <p className="mt-2 text-xs font-semibold text-center text-[rgb(var(--foreground))] max-w-[100px]">
                      {school.schoolName}
                    </p>
                    <p className="mt-1 text-[10px] text-center text-[rgb(var(--muted))]">
                      {school.city}
                    </p>
                    <div
                      role="tooltip"
                      className={cx(
                        "pointer-events-none absolute left-1/2 bottom-full mb-3 -translate-x-1/2",
                        "w-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                        "max-w-[90vw]"
                      )}
                      style={{ 
                        zIndex: 99999,
                        position: 'absolute'
                      }}
                    >
                      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-2xl p-4 max-w-[420px] min-w-[320px]">
                        <h4 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-1.5">
                          {school.schoolName}
                        </h4>
                        <p className="text-xs text-[rgb(var(--muted))] leading-5 whitespace-normal">
                          {school.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-4">Team Structure & Support</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Roster Requirements</h4>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    Each school is invited to roster <span className="font-semibold text-[rgb(var(--foreground))]">5 players</span> with up to <span className="font-semibold text-[rgb(var(--foreground))]">2 substitutes each</span>, for a total of <span className="font-semibold text-[rgb(var(--foreground))]">15 players per school</span>. Teams field different player counts depending on the game:
                  </p>
                  <ul className="mt-2 ml-4 space-y-1 text-sm leading-6 text-[rgb(var(--muted))] list-disc">
                    <li><span className="font-semibold text-[rgb(var(--foreground))]">5 players</span> at a time for League of Legends and Valorant</li>
                    <li><span className="font-semibold text-[rgb(var(--foreground))]">6 players</span> at a time for Marvel Rivals</li>
                    <li><span className="font-semibold text-[rgb(var(--foreground))]">3 players</span> for ARC Raiders</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Coaching & Organization</h4>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    Each team is chaperoned and organized by a designated <span className="font-semibold text-[rgb(var(--foreground))]">faculty member or alumni volunteer coach</span>. Coaches interface with Ando's event coordination teams to organize brackets, assign player roles, schedule monthly esports program meetings per school, and ensure smooth tournament operations.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Recruitment & Team Management</h4>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    Ando assists in recruitment at school-sponsored schedules and event fairs. We just need an afternoon to set up a table with flyers, and we help with <span className="font-semibold text-[rgb(var(--foreground))]">digital player signups and team management</span> in collaboration with faculty members. This makes it easy for schools to onboard students and maintain organized rosters.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-4">Example Brackets</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))] mb-4">
                    Explore different bracket formats we can support for the tournament. The <span className="font-semibold text-[rgb(var(--foreground))]">group stage format</span> is our recommended starting format for the inaugural tournament, ensuring all teams get meaningful competitive play with 12 participating schools divided into <span className="font-semibold text-[rgb(var(--foreground))]">3 groups of 4 teams</span>.
                  </p>
                </div>

                {/* Carousel Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setBracketFormatIndex((prev) => (prev === 0 ? bracketFormats.length - 1 : prev - 1))}
                    className="p-2 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)] transition-colors"
                    aria-label="Previous bracket format"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--muted))]">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  
                  <div className="flex-1 mx-4 text-center">
                    <h4 className="text-base font-semibold text-[rgb(var(--foreground))]">
                      {currentBracketFormat.label}
                    </h4>
                    <p className="text-xs text-[rgb(var(--muted))] mt-1">
                      {currentBracketFormat.description}
                    </p>
                    <div className="flex justify-center gap-1.5 mt-2">
                      {bracketFormats.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setBracketFormatIndex(idx)}
                          className={cx(
                            "h-1.5 rounded-full transition-all duration-200",
                            idx === bracketFormatIndex
                              ? "w-6 bg-[rgb(var(--accent))]"
                              : "w-1.5 bg-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]"
                          )}
                          aria-label={`View ${bracketFormats[idx].label} format`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setBracketFormatIndex((prev) => (prev === bracketFormats.length - 1 ? 0 : prev + 1))}
                    className="p-2 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)] transition-colors"
                    aria-label="Next bracket format"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--muted))]">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Carousel Content */}
                <div className="relative overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.3)] p-4 sm:p-6">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ 
                      transform: `translateX(-${bracketFormatIndex * (100 / bracketFormats.length)}%)`,
                      width: `${bracketFormats.length * 100}%`
                    }}
                  >
                    {/* Group Stage Format */}
                    <div className="w-full flex-shrink-0 px-2" style={{ width: `${100 / bracketFormats.length}%` }}>
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                          {[
                            { group: "A", teams: bracketSeedings.slice(0, 4) },
                            { group: "B", teams: bracketSeedings.slice(4, 8) },
                            { group: "C", teams: bracketSeedings.slice(8, 12) },
                          ].map(({ group, teams }) => (
                            <div key={group} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                              <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">Group {group}</h4>
                              <div className="space-y-2">
                                {teams.map((schoolId) => {
                                  const school = INVITED_HIGH_SCHOOLS.find(s => s.schoolId === schoolId);
                                  if (!school) return null;
                                  return (
                                    <div
                                      key={schoolId}
                                      className="flex items-center gap-2 p-2 rounded-lg bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)] transition-colors"
                                    >
                                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                        <Image
                                          src={school.badgeSrc}
                                          alt={`${school.schoolName} badge`}
                                          fill
                                          className="object-cover"
                                          sizes="32px"
                                        />
                                      </div>
                                      <span className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                        {getSchoolDisplayName(school.schoolName)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="mt-3 text-[10px] text-[rgb(var(--muted))] italic">
                                Top 2 advance to playoffs
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-[rgb(var(--muted))]">
                            Each team plays 3 matches in group play • Top 2 from each group advance to playoffs
                          </p>
                        </div>
                        
                        {/* About Group Stage */}
                        <div className="rounded-xl border border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)] p-4 mt-6">
                          <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">About Group Stage</h4>
                          <div className="space-y-3 text-xs leading-5 text-[rgb(var(--muted))]">
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Origin:</p>
                              <p>{bracketFormats[0].detailedDescription.origin}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">How It Works:</p>
                              <p>{bracketFormats[0].detailedDescription.howItWorks}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Comparison:</p>
                              <p>{bracketFormats[0].detailedDescription.comparison}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Esports Perception:</p>
                              <p>{bracketFormats[0].detailedDescription.esportsPerception}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Round Robin Format */}
                    <div className="w-full flex-shrink-0 px-2" style={{ width: `${100 / bracketFormats.length}%` }}>
                      <div className="space-y-4">
                        <p className="text-sm leading-6 text-[rgb(var(--muted))] text-center mb-4">
                          All 12 teams play each other once in a round-robin format. Each team plays 11 matches.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                          {INVITED_HIGH_SCHOOLS.map((school) => (
                            <div
                              key={school.schoolId}
                              className="flex items-center gap-2 p-3 rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)]"
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                <Image
                                  src={school.badgeSrc}
                                  alt={`${school.schoolName} badge`}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                  {getSchoolDisplayName(school.schoolName)}
                                </p>
                                <p className="text-[10px] text-[rgb(var(--muted))]">
                                  11 matches
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center mt-4">
                          <p className="text-xs text-[rgb(var(--muted))]">
                            Total: 66 matches • Top teams by win record advance to playoffs
                          </p>
                        </div>
                        
                        {/* About Round Robin */}
                        <div className="rounded-xl border border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)] p-4 mt-6">
                          <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">About Round Robin</h4>
                          <div className="space-y-3 text-xs leading-5 text-[rgb(var(--muted))]">
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Origin:</p>
                              <p>{bracketFormats[1].detailedDescription.origin}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">How It Works:</p>
                              <p>{bracketFormats[1].detailedDescription.howItWorks}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Comparison:</p>
                              <p>{bracketFormats[1].detailedDescription.comparison}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Esports Perception:</p>
                              <p>{bracketFormats[1].detailedDescription.esportsPerception}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Single Elimination Format */}
                    <div className="w-full flex-shrink-0 px-2" style={{ width: `${100 / bracketFormats.length}%` }}>
                      <div className="space-y-4">
                        <p className="text-sm leading-6 text-[rgb(var(--muted))] text-center mb-4">
                          12 teams compete in a single-elimination bracket. Top 4 seeds receive first-round byes.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                          {/* Finals - Top */}
                          <div className="w-full max-w-md">
                            <p className="text-xs font-semibold text-[rgb(var(--accent))] mb-3 text-center">Championship</p>
                            <div className="rounded-xl border-2 border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.1)] p-4">
                              <div className="flex items-center justify-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[rgb(var(--accent))] flex-shrink-0">
                                    <Image
                                      src={INVITED_HIGH_SCHOOLS[0]?.badgeSrc || ""}
                                      alt={`${INVITED_HIGH_SCHOOLS[0]?.schoolName} badge`}
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-[rgb(var(--foreground))]">
                                    {INVITED_HIGH_SCHOOLS[0] ? getSchoolDisplayName(INVITED_HIGH_SCHOOLS[0].schoolName) : "Team 1"}
                                  </span>
                                </div>
                                <span className="text-xs text-[rgb(var(--muted))]">vs</span>
                                <div className="flex items-center gap-2">
                                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[rgb(var(--accent))] flex-shrink-0">
                                    <Image
                                      src={INVITED_HIGH_SCHOOLS[1]?.badgeSrc || ""}
                                      alt={`${INVITED_HIGH_SCHOOLS[1]?.schoolName} badge`}
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-[rgb(var(--foreground))]">
                                    {INVITED_HIGH_SCHOOLS[1] ? getSchoolDisplayName(INVITED_HIGH_SCHOOLS[1].schoolName) : "Team 2"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto mt-2"></div>
                          </div>

                          {/* Semifinals */}
                          <div className="w-full max-w-2xl">
                            <p className="text-[10px] font-semibold text-[rgb(var(--muted))] mb-3 text-center">Semifinals</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                              {[
                                { teams: [0, 1] },
                                { teams: [2, 3] },
                              ].map((match, matchIdx) => (
                                <div key={matchIdx}>
                                  <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] p-3">
                                    <div className="flex flex-col gap-2">
                                      {match.teams.map((teamIdx) => {
                                        const school = INVITED_HIGH_SCHOOLS[teamIdx];
                                        if (!school) return null;
                                        return (
                                          <div key={teamIdx} className="flex items-center gap-2">
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                              <Image
                                                src={school.badgeSrc}
                                                alt={`${school.schoolName} badge`}
                                                fill
                                                className="object-cover"
                                                sizes="32px"
                                              />
                                            </div>
                                            <span className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                              {getSchoolDisplayName(school.schoolName)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto mt-2"></div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-center mt-2">
                              <div className="w-full max-w-md h-px bg-[rgb(var(--border))]"></div>
                            </div>
                            <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto"></div>
                          </div>

                          {/* Quarterfinals */}
                          <div className="w-full max-w-4xl">
                            <p className="text-[10px] font-semibold text-[rgb(var(--muted))] mb-3 text-center">Quarterfinals</p>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              {[
                                { teams: [0, 1] },
                                { teams: [2, 3] },
                                { teams: [4, 5] },
                                { teams: [6, 7] },
                              ].map((match, matchIdx) => (
                                <div key={matchIdx}>
                                  <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] p-2.5">
                                    <div className="flex flex-col gap-1.5">
                                      {match.teams.map((teamIdx) => {
                                        const school = INVITED_HIGH_SCHOOLS[teamIdx];
                                        if (!school) return null;
                                        return (
                                          <div key={teamIdx} className="flex items-center gap-1.5">
                                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                              <Image
                                                src={school.badgeSrc}
                                                alt={`${school.schoolName} badge`}
                                                fill
                                                className="object-cover"
                                                sizes="24px"
                                              />
                                            </div>
                                            <span className="text-[10px] font-semibold text-[rgb(var(--foreground))] truncate">
                                              {getSchoolDisplayName(school.schoolName)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto mt-2"></div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-center mt-2">
                              <div className="w-full max-w-4xl h-px bg-[rgb(var(--border))]"></div>
                            </div>
                            <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto"></div>
                          </div>

                          {/* Round of 12 - Bottom */}
                          <div className="w-full max-w-4xl">
                            <p className="text-[10px] font-semibold text-[rgb(var(--muted))] mb-3 text-center">Round of 12 (Top 4 seeds get byes)</p>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              {[
                                { teams: [8, 9] },
                                { teams: [10, 11] },
                                { teams: [4, 5] },
                                { teams: [6, 7] },
                              ].map((match, matchIdx) => (
                                <div key={matchIdx}>
                                  <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-2.5">
                                    <div className="flex flex-col gap-1.5">
                                      {match.teams.map((teamIdx) => {
                                        const school = INVITED_HIGH_SCHOOLS[teamIdx];
                                        if (!school) return null;
                                        return (
                                          <div key={teamIdx} className="flex items-center gap-1.5">
                                            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                              <Image
                                                src={school.badgeSrc}
                                                alt={`${school.schoolName} badge`}
                                                fill
                                                className="object-cover"
                                                sizes="24px"
                                              />
                                            </div>
                                            <span className="text-[10px] font-semibold text-[rgb(var(--foreground))] truncate">
                                              {getSchoolDisplayName(school.schoolName)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <p className="text-xs text-[rgb(var(--muted))]">
                            Total: 11 matches • Single elimination
                          </p>
                        </div>
                        
                        {/* About Single Elimination */}
                        <div className="rounded-xl border border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)] p-4 mt-6">
                          <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">About Single Elimination</h4>
                          <div className="space-y-3 text-xs leading-5 text-[rgb(var(--muted))]">
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Origin:</p>
                              <p>{bracketFormats[2].detailedDescription.origin}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">How It Works:</p>
                              <p>{bracketFormats[2].detailedDescription.howItWorks}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Comparison:</p>
                              <p>{bracketFormats[2].detailedDescription.comparison}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Esports Perception:</p>
                              <p>{bracketFormats[2].detailedDescription.esportsPerception}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Double Elimination Format */}
                    <div className="w-full flex-shrink-0 px-2" style={{ width: `${100 / bracketFormats.length}%` }}>
                      <div className="space-y-4">
                        <p className="text-sm leading-6 text-[rgb(var(--muted))] text-center mb-4">
                          Double elimination format provides a second chance. Teams that lose in the winners bracket drop to the losers bracket for another opportunity.
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                            <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">Winners Bracket</h4>
                            <div className="space-y-2">
                              {INVITED_HIGH_SCHOOLS.slice(0, 6).map((school) => (
                                <div
                                  key={school.schoolId}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-[rgba(var(--surface),0.7)]"
                                >
                                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                    <Image
                                      src={school.badgeSrc}
                                      alt={`${school.schoolName} badge`}
                                      fill
                                      className="object-cover"
                                      sizes="28px"
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                    {getSchoolDisplayName(school.schoolName)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                            <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">Losers Bracket</h4>
                            <div className="space-y-2">
                              {INVITED_HIGH_SCHOOLS.slice(6, 12).map((school) => (
                                <div
                                  key={school.schoolId}
                                  className="flex items-center gap-2 p-2 rounded-lg bg-[rgba(var(--surface),0.7)] opacity-75"
                                >
                                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                    <Image
                                      src={school.badgeSrc}
                                      alt={`${school.schoolName} badge`}
                                      fill
                                      className="object-cover"
                                      sizes="28px"
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                    {getSchoolDisplayName(school.schoolName)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <p className="mt-3 text-[10px] text-[rgb(var(--muted))] italic">
                              Teams from winners bracket enter here after a loss
                            </p>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <p className="text-xs text-[rgb(var(--muted))]">
                            Losers bracket winner faces winners bracket winner in Grand Finals
                          </p>
                        </div>
                        
                        {/* About Double Elimination */}
                        <div className="rounded-xl border border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)] p-4 mt-6">
                          <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">About Double Elimination</h4>
                          <div className="space-y-3 text-xs leading-5 text-[rgb(var(--muted))]">
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Origin:</p>
                              <p>{bracketFormats[3].detailedDescription.origin}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">How It Works:</p>
                              <p>{bracketFormats[3].detailedDescription.howItWorks}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Comparison:</p>
                              <p>{bracketFormats[3].detailedDescription.comparison}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Esports Perception:</p>
                              <p>{bracketFormats[3].detailedDescription.esportsPerception}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">Ando's Recommendation</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                For single events and tournaments like the Varsity Invitational, we recommend using <span className="font-semibold text-[rgb(var(--foreground))]">Group Stage</span> or <span className="font-semibold text-[rgb(var(--foreground))]">Single/Double Elimination</span> formats. These formats provide clear progression, exciting matchups, and a definitive conclusion within the event timeframe.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                We reserve <span className="font-semibold text-[rgb(var(--foreground))]">Round Robin brackets</span> for seasonal play outside of single events, particularly for partnered high school esports programs. Round Robin works best for ongoing league play where teams compete over an extended period, ensuring comprehensive competition and fair rankings across a full season.
              </p>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">For Schools, Students, and Parents</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                Esports programs offer students opportunities to develop teamwork, strategic thinking, and communication skills in a 
                structured, supervised environment. Like traditional sports, esports teaches students how to work together toward common 
                goals, manage pressure, and build resilience through practice and competition.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Schools can integrate esports as an extracurricular activity or scheduled program, providing students with a pathway to 
                compete, improve, and represent their school. Faculty can oversee teams, ensuring a safe, positive environment that 
                emphasizes growth and sportsmanship alongside competitive achievement.
              </p>
            </Card>
          </div>
        </section>

        {/* How to Participate */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="participate-heading" id="participate">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="participate-heading" className="text-2xl font-semibold tracking-tight">
                How to Participate
              </h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Information for high schools, players, and community members interested in the tournament.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">For High Schools</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                Register your school's esports program to compete in structured matches and exhibition games. 
                Roster teams and players from your school to represent your program in the tournament.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                This event provides a platform for your students to compete locally, build team cohesion, and 
                showcase your school's esports program to the broader community.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">For Players & Guests</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                Registered players and community members can attend as spectators, participate in watch parties, 
                and connect with other local gamers. The venue serves as both a competitive space and a social hub.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Join us to support local high school esports, meet other community members, and experience 
                structured competitive play in a welcoming environment.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14">
          <Card className="p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Interested in participating?</h2>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Join the waitlist to receive updates about tournament registration, schedules, and event details.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/#waitlist"
                className="rounded-full bg-[rgb(var(--foreground))] px-6 py-3 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                Join Waitlist
              </Link>
              <Link
                href="/about#partnerships"
                className="rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-[rgba(var(--foreground),0.04)] hover:border-[rgba(var(--border),0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                Contact Us
              </Link>
            </div>
          </Card>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
