"use client";

/**
 * How It Works page covering the model, membership tiers, community standards, and CTAs.
 */
import Link from "next/link";
import { SiteFooter } from "../_components/SiteFooter";
import { SiteHeader } from "../_components/SiteHeader";
import { Card } from "../_components/ui";

export default function HowWeWorkPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[rgba(var(--accent),0.12)] blur-3xl" />
        <div className="absolute left-[12%] top-[35%] h-[320px] w-[420px] rounded-full bg-[rgba(var(--accent-2),0.10)] blur-3xl" />
      </div>

      <SiteHeader primaryCtaHref="/#waitlist" primaryCtaLabel="Join Waitlist" />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <section className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">How It Works</h1>
          <p className="max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            A clear guide to understanding Ando eSports — whether you&apos;re a gamer, parent, investor, or just curious about what we&apos;re building.
          </p>
          <p className="max-w-3xl text-xs leading-5 text-[rgb(var(--muted))] mt-2">
            <span className="font-semibold text-[rgb(var(--foreground))]">For Players:</span> <Link href="/memberships" className="font-semibold text-[rgb(var(--accent))] hover:underline">Memberships</Link> provide access to weekly game nights and local community. 
            <span className="font-semibold text-[rgb(var(--foreground))] ml-2">For Institutions:</span> <Link href="/services" className="font-semibold text-[rgb(var(--accent))] hover:underline">Services</Link> provide tournament hosting and esports infrastructure.
          </p>
        </section>

        {/* What is Ando */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="what-is-heading" id="what-is">
          <h2 id="what-is-heading" className="text-2xl font-semibold tracking-tight">
            What is Ando eSports?
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            Ando eSports is a hybrid third space and local game store designed for Northern Nevada&apos;s gaming community. 
            It combines a community center, local game shop, and structured esports program — all built around 
            consistent weekly programming and local connections.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Collect",
                desc: "Build your gaming identity, track progress, and earn achievements. Your Player Card shows your growth over time, and monthly challenges give you seasonal goals to chase.",
              },
              {
                title: "Create",
                desc: "Form teams, host game nights, and shape the community. Tier 3 members become Team Captains who help organize schedules, match players, and maintain our culture.",
              },
              {
                title: "Connect",
                desc: "Meet local players, find your squad, and build real friendships. Weekly game nights, SquadMatch pairing, and in-person meetups create lasting connections beyond the screen.",
              },
            ].map((p) => (
              <Card key={p.title} className="p-6">
                <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">{p.desc}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">The Third Space Concept</h3>
            <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
              A &quot;third space&quot; is a community hub between home and work where people gather regularly. 
              Examples include coffee shops, libraries, and community centers. Ando combines this concept with organized play, 
              community events, and a place where gamers can show up weekly, improve together, and build relationships.
            </p>
            <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
              We&apos;re building a sustainable, local-first community that supports both casual players who want respectful 
              games and competitive players who want structure, coaching, and pathways to improvement.
            </p>
          </Card>
        </section>

        {/* How Membership Works */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="membership-heading" id="membership">
          <h2 id="membership-heading" className="text-2xl font-semibold tracking-tight">
            How Membership Works
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            We offer three membership tiers, each designed for different levels of engagement. Start free, upgrade when you&apos;re ready. 
            Season passes (annual) are our default — they track all perks and engagements through the yearly season. Monthly billing is also available.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card>
              <p className="text-sm font-semibold">Tier 1 — Registered Local</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">Free</p>
              <p className="mt-4 text-xs font-semibold text-[rgb(var(--accent))]">Who it&apos;s for:</p>
              <p className="mt-1 text-sm leading-6 text-[rgb(var(--muted))]">
                Anyone curious about the community. Perfect for trying it out, meeting local players, and seeing if Ando fits your style.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
                <li>• Join as a Northern Nevada player (opt-in roster)</li>
                <li>• Add your game usernames for local player lookup</li>
                <li>• Access to weekly game night schedules and events</li>
                <li>• No commitment required</li>
              </ul>
              <p className="mt-4 text-xs italic text-[rgb(var(--muted))]">
                Start here. Join weekly game nights, meet local players, and see if the community fits.
              </p>
            </Card>

            <Card>
              <p className="text-sm font-semibold">Tier 2 — Player Profile</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">$3/mo</p>
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                Season Pass: <span className="font-medium">$25/year</span>
              </p>
              <p className="mt-4 text-xs font-semibold text-[rgb(var(--accent))]">Who it&apos;s for:</p>
              <p className="mt-1 text-sm leading-6 text-[rgb(var(--muted))]">
                Players who want a membership with local identity, consistent teammates, and weekly nights they can invite friends to.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
                <li>• Player Profile + member roster visibility (you control what you share)</li>
                <li>• SquadMatch weekly matching (moderated LFG that actually works)</li>
                <li>• Weekly scheduled game nights + priority event signup</li>
                <li>• Monthly Player Card + season recap (your progress, over time)</li>
                <li>• In-store member perks: Focus Hour, early merch drops, 5% discount</li>
              </ul>
              <p className="mt-4 text-xs italic text-[rgb(var(--muted))]">
                The standard membership tier. Get a local identity, local teammates, and weekly nights you can invite friends to.
              </p>
            </Card>

            <Card className="relative">
              <div className="absolute right-4 top-4 rounded-full bg-[rgba(var(--accent),0.15)] px-3 py-1 text-xs font-semibold">
                Limited spots
              </div>
              <p className="text-sm font-semibold">Tier 3 — Captain Profile</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">$5/mo</p>
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                Season Pass: <span className="font-medium">$40/year</span>
              </p>
              <p className="mt-4 text-xs font-semibold text-[rgb(var(--accent))]">Who it&apos;s for:</p>
              <p className="mt-1 text-sm leading-6 text-[rgb(var(--muted))]">
                Leaders, consistent groups, and players who want priority matching, coaching support, and real responsibilities that make weekly nights feel like a club.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
                <li>• Everything in Tier 2</li>
                <li>• Captain Queue + priority matching (higher-trust, higher-consistency groups)</li>
                <li>• Weekly &quot;VOD Lite&quot; report (1 clip → 1-page plan within 48–72 hours, limited slots)</li>
                <li>• Verified Player badge + Club Standing (earnable, behavior-based trust signal)</li>
                <li>• Showcase / spotlight priority + reserved seating for watch nights</li>
                <li>• Monthly captain meetings: help shape schedules, scrims, and standards</li>
              </ul>
              <p className="mt-4 text-xs italic text-[rgb(var(--muted))]">
                The leadership tier. Better matches, more trust, and real responsibilities that make weekly nights feel like a club — not a one-off.
              </p>
            </Card>
          </div>
        </section>

        {/* How We Foster Community */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="community-heading" id="community">
          <h2 id="community-heading" className="text-2xl font-semibold tracking-tight">
            How We Foster Community
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            Community requires structure. We create structured environments, clear expectations, and pathways for connection.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Weekly Game Nights</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Every week, we host scheduled game nights at our physical location. These aren&apos;t random drop-ins — they&apos;re 
                organized sessions where members RSVP, get matched with teammates, and play in a structured, respectful environment.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Tier 2 and Tier 3 members can invite friends (even non-members) to these nights, making it easy to introduce 
                people to the community. We publish schedules in advance so you can plan around them.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">SquadMatch System</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Finding teammates shouldn&apos;t be a gamble. Our SquadMatch system pairs Tier 2+ members weekly based on games, 
                play style, availability, and intent (casual vs. competitive). We moderate these matches to ensure quality, 
                and you get suggested squads before game nights.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                This isn&apos;t random matchmaking. It&apos;s intentional pairing that respects your schedule, skill level, and goals.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Monthly Challenges</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                We program monthly challenges tied to seasonal achievements in each game. These give you clear goals to work toward, 
                whether you&apos;re chasing rank, learning a new role, or completing specific objectives.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Your progress shows up on your monthly Player Card, creating a visible record of growth over time. This isn&apos;t 
                about being the best — it&apos;s about consistent improvement and having something to work toward.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Behavior-First Culture</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Toxicity, griefing, and ego-throwing kill communities. We enforce a clear code of conduct: respectful communication, 
                consistency, planning, teamwork, and showing up for your group. Violations have consequences, and good behavior 
                earns trust signals like Verified Player badges and Club Standing.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Tier 3 Team Captains help maintain this culture by modeling standards, moderating queues, and working with staff 
                to keep the community high-trust and low-tox.
              </p>
            </Card>
          </div>
        </section>

        {/* Casual vs Competitive */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="play-styles-heading" id="play-styles">
          <h2 id="play-styles-heading" className="text-2xl font-semibold tracking-tight">
            Organized Environments for Casual and Competitive Play
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            We support both casual players who want fun, respectful games and competitive players who want structure, coaching, and pathways to improvement.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">For Casual Players</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                A relaxed, welcoming place to play with good people — no ego, no pressure, and no random-queue chaos.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
                <li>• Find local teammates through SquadMatch and in-person open league nights</li>
                <li>• Clear culture rules so games stay fun, respectful, and low-tox</li>
                <li>• Drop-in events, themed nights, and casual formats (mixed skill, learn-as-you-go)</li>
                <li>• Optional guidance: tips, drills, and &quot;what to work on next&quot; without gatekeeping</li>
                <li>• A community that supports IRL hangouts and online play between meetups</li>
                <li>• Monthly challenges that are achievable and fun, not stressful</li>
              </ul>
              <p className="mt-4 text-xs italic text-[rgb(var(--muted))]">
                You don&apos;t need to be competitive to belong here. Many members just want consistent, friendly games with people they can trust.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">For Competitive Players</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                A structured environment built for improvement and results — consistent practice, strong team culture, and preparation.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
                <li>• Scheduled ranked nights, team formation, scrims, and tournament-ready practice</li>
                <li>• Standards that protect performance: punctuality, comms discipline, and accountability</li>
                <li>• Coaching/VOD review pathways with goals, drills, and measurable KPIs</li>
                <li>• Roles and leadership development (IGL, support, operations, broadcast, coaching)</li>
                <li>• A community that values consistency and teamwork on-site and online</li>
                <li>• Monthly challenges tied to ranked progression and skill development</li>
              </ul>
              <p className="mt-4 text-xs italic text-[rgb(var(--muted))]">
                If you want to improve, compete, and build toward real opportunities, Tier 3 gives you the structure and support to do it.
              </p>
            </Card>
          </div>

          <Card className="mt-6 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">The Hybrid Approach</h3>
            <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
              Many members start casual and become more competitive over time. Others stay casual forever. Some are competitive from day one. 
              We support all paths. The key is that everyone follows the same behavior standards — respectful, consistent, and team-oriented — 
              whether you&apos;re playing for fun or playing to win.
            </p>
            <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
              Our monthly challenges, Player Cards, and community events work for both styles. Casual players can chase fun achievements 
              and social goals. Competitive players can focus on ranked progression and skill milestones. Both groups show up weekly, 
              improve together, and build real relationships.
            </p>
          </Card>
        </section>

        {/* Trust and Safety */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="trust-heading" id="trust">
          <h2 id="trust-heading" className="text-2xl font-semibold tracking-tight">
            Trust, Safety, and Quality Standards
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            We take community health seriously. Here&apos;s how we maintain a high-trust, low-tox environment that parents, players, and partners can rely on.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Verified Player System</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Tier 3 members can earn Verified Player badges and Club Standing through consistent positive behavior, showing up for 
                scheduled sessions, and contributing to the community. These are earnable, behavior-based trust signals — not pay-to-win status.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                This helps you identify reliable teammates and community leaders. It also creates accountability: bad behavior can 
                result in losing these signals.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Moderated Matching</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                SquadMatch isn&apos;t automated. We review matches, check for red flags, and ensure pairings make sense. If someone 
                consistently causes problems, they get removed from the matching pool and face consequences.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Team Captains (Tier 3) help moderate Captain Queue, ensuring higher-trust groups stay that way. Staff reviews reports 
                and takes action when needed.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Clear Code of Conduct</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                We publish clear rules: no toxicity, no griefing, no harassment. Respectful communication, consistency, planning, 
                and teamwork are expected. Violations result in warnings, temporary suspensions, or permanent bans depending on severity.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Parents can review our code of conduct and know their kids are in a monitored, structured environment. Investors and 
                partners can see we take community health seriously.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">Physical Location</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                We have a real physical location in Reno/Sparks where weekly game nights happen. This isn&apos;t just an online community — 
                it&apos;s a place you can visit, meet people in person, and build relationships.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Having a physical space creates accountability, makes the community feel real, and gives parents, partners, and members 
                a place to see what we&apos;re building. It also enables in-store perks, Focus Hours, and events that online-only communities can&apos;t offer.
              </p>
            </Card>
          </div>
        </section>

        {/* For Different Audiences */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="audiences-heading" id="audiences">
          <h2 id="audiences-heading" className="text-2xl font-semibold tracking-tight">
            What This Means for You
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            Whether you&apos;re a gamer, parent, investor, or just curious, here&apos;s what Ando offers you.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">For Gamers</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Stop dealing with random queues, toxic teammates, and inconsistent schedules. Get matched with local players who share 
                your goals, show up to weekly game nights you can actually plan around, and track your progress over time.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Start free (Tier 1) to try it out. Upgrade to Tier 2 ($3/mo) when you want membership benefits. Move to Tier 3 ($5/mo) 
                if you want leadership roles, coaching support, and priority matching. Season passes track all perks through the yearly season — monthly billing is also available.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">For Parents</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Your kids can game in a monitored, structured environment with clear rules, real accountability, and positive role models. 
                We enforce behavior standards, have a physical location you can visit, and create pathways for leadership and responsibility.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Start with Tier 1 (free) so they can try it out. Tier 2 ($3/mo) gives them a membership with local identity and 
                consistent teammates. Tier 3 ($5/mo) is for kids who want to take on leadership roles and get coaching support. 
                Season passes track all perks and engagements through the yearly season — monthly billing is also available.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">For Investors & Partners</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                We&apos;re building a sustainable, local-first esports community with clear revenue streams (memberships, season passes), 
                a physical location, and a structured approach to community health. We solve real problems: inconsistent practice environments, 
                weak local pipelines, and unstable team culture.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Our model is membership-based, not ad-reliant. We have clear tiers, season passes (annual) as the default with monthly options, and a path to profitability 
                through community growth and partnerships. We operate largely on a volunteer basis, with proceeds going back into the playerbase, 
                features, and coaching support.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[rgb(var(--accent))]">For the Curious</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                Ando is a new kind of gaming community: part third space, part local game store, part structured esports program. 
                We&apos;re building something sustainable and local-first, focused on turning gaming into a consistent, positive habit 
                with relationships.
              </p>
              <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                Start with Tier 1 (free) to see what we&apos;re about. Join weekly game nights, meet local players, and decide if the 
                community fits. No commitment required. If you like it, upgrade when you&apos;re ready.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">Ready to Get Started?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgb(var(--muted))]">
              Join the waitlist to be part of our first wave. Early members get the Year 1 Founder&apos;s Token and help shape 
              the community from day one.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/#waitlist"
                className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--foreground))] px-6 py-3 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                Join the Waitlist
              </Link>
              <Link
                href="/memberships"
                className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-[rgba(var(--foreground),0.04)] hover:border-[rgba(var(--border),0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                View Memberships
              </Link>
            </div>
          </Card>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

