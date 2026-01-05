/**
 * Sticky site header with brand, primary navigation, theme toggle, and Clerk auth CTAs.
 * @param primaryCtaHref link target for primary action
 * @param primaryCtaLabel label for primary action
 */
"use client";

import { SignUpButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { cx } from "./ui";
import { useThemeMode } from "../_hooks/useThemeMode";

export function SiteHeader({
  primaryCtaHref,
  primaryCtaLabel,
}: {
  primaryCtaHref: string;
  primaryCtaLabel: string;
}) {
  const { isDark, toggleTheme } = useThemeMode();
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsAboutMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsAboutMenuOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(var(--surface),0.7)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-brand text-2xl font-[900] tracking-tight text-[rgb(var(--foreground))]">
            ando
          </span>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold tracking-tight">eSports League</p>
            <p className="text-xs text-[rgb(var(--muted))]">Reno/Sparks • Coming Soon</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden sm:flex items-center gap-3 text-sm" aria-label="Header navigation">
            <Link
              href="/"
              className="rounded-full px-3 py-2 font-semibold text-[rgb(var(--muted))] transition hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
            >
              Home
            </Link>
            <Link
              href="/players"
              className="rounded-full px-3 py-2 font-semibold text-[rgb(var(--muted))] transition hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
            >
              Players
            </Link>
            <Link
              href="/games"
              className="rounded-full px-3 py-2 font-semibold text-[rgb(var(--muted))] transition hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
            >
              Games
            </Link>
            <Link
              href="/events"
              className="rounded-full px-3 py-2 font-semibold text-[rgb(var(--muted))] transition hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
            >
              Events
            </Link>
            <Link
              href="/memberships"
              className="rounded-full px-3 py-2 font-semibold text-[rgb(var(--muted))] transition hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
            >
              Memberships
            </Link>
            <Link
              href="/services"
              className="rounded-full px-3 py-2 font-semibold text-[rgb(var(--muted))] transition hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
            >
              Services
            </Link>
            <div
              ref={menuContainerRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={() => {
                if (closeTimeoutRef.current) {
                  clearTimeout(closeTimeoutRef.current);
                  closeTimeoutRef.current = null;
                }
                setIsAboutMenuOpen(true);
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  handleMouseLeave();
                }
              }}
            >
              <Link
                href="/about"
                className="rounded-full px-3 py-2 font-semibold text-[rgb(var(--muted))] transition hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)] flex items-center gap-1"
                aria-expanded={isAboutMenuOpen}
                aria-haspopup="true"
              >
                About Us
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={cx(
                    "transition-transform duration-200",
                    isAboutMenuOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              {/* Invisible bridge to prevent menu from closing when moving mouse to dropdown */}
              <div
                className={cx(
                  "absolute left-0 top-full z-40 h-2 w-full",
                  isAboutMenuOpen ? "block" : "hidden"
                )}
                onMouseEnter={handleMouseEnter}
                aria-hidden="true"
              />
              <div
                className={cx(
                  "absolute left-0 top-full z-50 mt-2 min-w-[180px] rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.95)] shadow-lg backdrop-blur-sm py-2 transition-all duration-200",
                  isAboutMenuOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto visible"
                    : "opacity-0 -translate-y-2 pointer-events-none invisible"
                )}
                role="menu"
                aria-orientation="vertical"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/how-we-work"
                  className="block px-4 py-2 text-sm font-semibold text-[rgb(var(--muted))] transition hover:bg-[rgba(var(--foreground),0.04)] hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)] focus-visible:rounded-lg"
                  role="menuitem"
                >
                  How It Works
                </Link>
                <Link
                  href="/partners"
                  className="block px-4 py-2 text-sm font-semibold text-[rgb(var(--muted))] transition hover:bg-[rgba(var(--foreground),0.04)] hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)] focus-visible:rounded-lg"
                  role="menuitem"
                >
                  Partners
                </Link>
              </div>
            </div>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className={cx(
              "hidden sm:flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-2.5 py-2 shadow-sm transition-all duration-200",
              "hover:bg-[rgba(var(--surface),0.9)] hover:border-[rgba(var(--border),0.8)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[rgba(var(--surface),0.7)]"
            )}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
          >
            <span
              className={cx(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ease-in-out",
                isDark ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--muted))]"
              )}
              aria-hidden="true"
            >
              <span
                className={cx(
                  "inline-block h-3.5 w-3.5 translate-x-0.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out",
                  isDark && "translate-x-[18px]"
                )}
              />
            </span>
          </button>

          {/* Clerk Authentication: Show sign up button for signed-out users */}
          <SignedOut>
            <SignUpButton
              mode="modal"
              forceRedirectUrl={primaryCtaHref}
              fallbackRedirectUrl={primaryCtaHref}
            >
              <button className="rounded-full bg-[rgb(var(--foreground))] px-4 py-2 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]">
                {primaryCtaLabel}
              </button>
            </SignUpButton>
          </SignedOut>
          {/* Show direct link for signed-in users */}
          <SignedIn>
            <Link
              href={primaryCtaHref}
              className="rounded-full bg-[rgb(var(--foreground))] px-4 py-2 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
            >
              {primaryCtaLabel}
            </Link>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}


