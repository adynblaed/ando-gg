/**
 * Services page for institutions and organizations.
 * Describes tournament hosting, bracket organization, and esports infrastructure.
 */
"use client";

import Link from "next/link";
import { SiteFooter } from "../_components/SiteFooter";
import { SiteHeader } from "../_components/SiteHeader";
import { Card } from "../_components/ui";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[rgba(var(--accent),0.12)] blur-3xl" />
        <div className="absolute left-[12%] top-[35%] h-[320px] w-[420px] rounded-full bg-[rgba(var(--accent-2),0.10)] blur-3xl" />
      </div>

      <SiteHeader primaryCtaHref="/#waitlist" primaryCtaLabel="Join Waitlist" />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <section className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Services</h1>
          <p className="max-w-3xl text-sm leading-6 text-[rgb(var(--muted))]">
            <span className="font-semibold text-[rgb(var(--foreground))]">For Institutions & Organizations:</span> Ando eSports provides esports infrastructure, tournament hosting, and bracket organization for structured high school and collegiate play, organized by U.S. region.
          </p>
          <p className="max-w-3xl text-xs leading-5 text-[rgb(var(--muted))] mt-2">
            Looking for individual player memberships? <Link href="/memberships" className="font-semibold text-[rgb(var(--accent))] hover:underline">View our Memberships</Link> for local players and community participation.
          </p>
        </section>

        {/* Tournament Hosting & Bracket Organization */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="tournament-hosting-heading" id="tournament-hosting">
          <Card className="p-6 sm:p-8">
            <h2 id="tournament-hosting-heading" className="text-2xl font-semibold tracking-tight mb-4">
              Tournament Hosting & Bracket Organization
            </h2>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                We organize and host structured tournaments with professionally managed brackets. Our event coordination teams handle bracket design, seeding, scheduling, and match progression to ensure fair competition and clear outcomes.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-6">
                <div>
                  <h3 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Bracket Formats</h3>
                  <ul className="text-xs leading-6 text-[rgb(var(--muted))] space-y-1">
                    <li>• Group Stage (recommended for events)</li>
                    <li>• Single Elimination</li>
                    <li>• Double Elimination</li>
                    <li>• Round Robin (seasonal play)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Event Management</h3>
                  <ul className="text-xs leading-6 text-[rgb(var(--muted))] space-y-1">
                    <li>• Match scheduling and coordination</li>
                    <li>• Results tracking and standings</li>
                    <li>• Prize pool distribution</li>
                    <li>• Live event support</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* High School Esports Programs */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="highschool-programs-heading" id="highschool-programs">
          <Card className="p-6 sm:p-8">
            <h2 id="highschool-programs-heading" className="text-2xl font-semibold tracking-tight mb-4">
              High School Esports Programs
            </h2>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                We partner with high schools to establish and maintain structured esports programs. Our services support schools in rostering teams, organizing competitions, and providing pathways for student growth through competitive gaming.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-6">
                <div>
                  <h3 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Program Setup</h3>
                  <ul className="text-xs leading-6 text-[rgb(var(--muted))] space-y-1">
                    <li>• Team roster organization</li>
                    <li>• Faculty coach coordination</li>
                    <li>• Digital player signups</li>
                    <li>• Team management tools</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Ongoing Support</h3>
                  <ul className="text-xs leading-6 text-[rgb(var(--muted))] space-y-1">
                    <li>• Monthly program meetings</li>
                    <li>• Recruitment assistance</li>
                    <li>• Event fair participation</li>
                    <li>• Bracket and role management</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)]">
                <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                  <span className="font-semibold text-[rgb(var(--foreground))]">Example:</span> The Ando eSports Varsity Invitational showcases our tournament hosting capabilities, with 12 participating schools competing in structured brackets with clear progression pathways.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Collegiate Esports Programs */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="collegiate-programs-heading" id="collegiate-programs">
          <Card className="p-6 sm:p-8">
            <h2 id="collegiate-programs-heading" className="text-2xl font-semibold tracking-tight mb-4">
              Collegiate Esports Programs
            </h2>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                We provide tournament hosting and bracket organization services for collegiate esports programs. Our regional organization structure enables colleges and universities to participate in structured competitions aligned with their geographic region.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-6">
                <div>
                  <h3 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Regional Competition</h3>
                  <ul className="text-xs leading-6 text-[rgb(var(--muted))] space-y-1">
                    <li>• U.S. regional organization</li>
                    <li>• Inter-collegiate brackets</li>
                    <li>• Seasonal league play</li>
                    <li>• Championship events</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Program Integration</h3>
                  <ul className="text-xs leading-6 text-[rgb(var(--muted))] space-y-1">
                    <li>• Athletic department coordination</li>
                    <li>• Student-athlete management</li>
                    <li>• Competition scheduling</li>
                    <li>• Performance tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Regional Organization */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="regional-organization-heading" id="regional-organization">
          <Card className="p-6 sm:p-8">
            <h2 id="regional-organization-heading" className="text-2xl font-semibold tracking-tight mb-4">
              Regional Organization
            </h2>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                Our services are organized by U.S. region to facilitate local competition, reduce travel requirements, and build regional esports communities. Each region operates with dedicated event coordination and bracket management.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                  <h3 className="text-sm font-semibold text-[rgb(var(--accent))] mb-2">West</h3>
                  <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                    Pacific states including California, Nevada, Oregon, Washington, and surrounding areas.
                  </p>
                </div>
                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                  <h3 className="text-sm font-semibold text-[rgb(var(--accent))] mb-2">Southwest</h3>
                  <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                    Arizona, New Mexico, Texas, and surrounding states.
                  </p>
                </div>
                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                  <h3 className="text-sm font-semibold text-[rgb(var(--accent))] mb-2">Midwest</h3>
                  <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                    Central states including Illinois, Michigan, Ohio, and surrounding areas.
                  </p>
                </div>
                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                  <h3 className="text-sm font-semibold text-[rgb(var(--accent))] mb-2">East</h3>
                  <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                    Atlantic states including New York, Pennsylvania, Florida, and surrounding areas.
                  </p>
                </div>
              </div>
              <p className="text-xs leading-5 text-[rgb(var(--muted))] mt-4">
                Regional organization enables schools and colleges to compete locally while maintaining pathways to broader competition. Each region operates with consistent bracket formats, scheduling standards, and event coordination.
              </p>
            </div>
          </Card>
        </section>

        {/* Regular Structured Play */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="structured-play-heading" id="structured-play">
          <Card className="p-6 sm:p-8">
            <h2 id="structured-play-heading" className="text-2xl font-semibold tracking-tight mb-4">
              Regular Structured Play
            </h2>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                Beyond single events, we provide ongoing structured play opportunities through seasonal leagues, regular brackets, and consistent competition schedules. This enables schools and colleges to maintain active esports programs with regular competitive opportunities.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-6">
                <div>
                  <h3 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Seasonal Leagues</h3>
                  <p className="text-xs leading-6 text-[rgb(var(--muted))]">
                    Round Robin and league formats for extended competition periods. Teams compete over multiple weeks with standings and playoff progression.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Regular Brackets</h3>
                  <p className="text-xs leading-6 text-[rgb(var(--muted))]">
                    Scheduled tournaments with consistent formats and clear progression. Regular brackets provide predictable competition opportunities for participating programs.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Service Integration */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="integration-heading" id="integration">
          <Card className="p-6 sm:p-8">
            <h2 id="integration-heading" className="text-2xl font-semibold tracking-tight mb-4">
              Service Integration
            </h2>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                Our services integrate tournament hosting, bracket organization, and program support to provide comprehensive esports infrastructure. Schools and colleges can leverage individual services or adopt our full program model.
              </p>
              <div className="mt-6 p-4 rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)]">
                <h3 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Full Program Model</h3>
                <p className="text-xs leading-6 text-[rgb(var(--muted))]">
                  Partnered programs receive tournament hosting, bracket organization, team management support, and regular structured play opportunities. This model enables schools and colleges to establish and maintain active esports programs with minimal administrative overhead.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <section className="mt-14">
          <Card className="p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Interested in our services?</h2>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Contact us to discuss tournament hosting, bracket organization, or program partnership opportunities for your school or college.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/partners"
                className="rounded-full bg-[rgb(var(--foreground))] px-6 py-3 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                Contact Us
              </Link>
              <Link
                href="/events"
                className="rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-[rgba(var(--foreground),0.04)] hover:border-[rgba(var(--border),0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                View Events
              </Link>
            </div>
          </Card>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

