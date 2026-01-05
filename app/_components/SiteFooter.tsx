/**
 * Site footer with compact navigation and copyright.
 */
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[rgb(var(--border))] pt-8 text-sm text-[rgb(var(--muted))]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Ando LLC — Ando eSports • Reno/Sparks</p>
        <nav className="flex gap-4" aria-label="Footer navigation">
          <Link
            href="/#waitlist"
            className="transition-colors duration-200 hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)] focus-visible:rounded"
          >
            Join Waitlist
          </Link>
          <Link
            href="/memberships"
            className="transition-colors duration-200 hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)] focus-visible:rounded"
          >
            Memberships
          </Link>
          <Link
            href="/services"
            className="transition-colors duration-200 hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)] focus-visible:rounded"
          >
            Services
          </Link>
          <Link
            href="/about"
            className="transition-colors duration-200 hover:text-[rgb(var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)] focus-visible:rounded"
          >
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}


