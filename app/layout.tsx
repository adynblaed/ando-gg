/**
 * Root layout for the app.
 * Sets up Clerk provider, fonts, theme pre-hydration script, and global styles.
 */
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "./_components/ErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function ThemeInitScript() {
  const script = `
  (function() {
    try {
      var key = "bb_theme";
      var saved = localStorage.getItem(key);
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      var useDark = saved === "dark" || (saved !== "light" && prefersDark);
      var root = document.documentElement;
      root.classList.toggle("dark", !!useDark);
      root.dataset.theme = useDark ? "dark" : "light";
    } catch (e) {}
  })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export const metadata: Metadata = {
  title: "Ando eSports — Reno/Sparks (Coming Soon)",
  description:
    "Northern Nevada's eSports League: find teammates, improve safely, and get seen. Join the first-wave waitlist.",
  metadataBase: new URL("https://ando.gg"),
  openGraph: {
    title: "Ando eSports — Coming Soon (Reno/Sparks)",
    description:
      "Join the first-wave waitlist for Northern Nevada's eSports League: squads, skill, spotlight.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <ThemeInitScript />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
