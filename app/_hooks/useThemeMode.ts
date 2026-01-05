/**
 * Theme mode hook using useSyncExternalStore for SSR-safe light/dark sync.
 * Persists preference in localStorage, syncs across tabs, and applies DOM classes.
 */
"use client";

import { useSyncExternalStore } from "react";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

function getInitialThemeFromDom(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function applyTheme(isDark: boolean) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.dataset.theme = isDark ? "dark" : "light";
}

/**
 * Custom hook for theme mode management
 * 
 * Uses useSyncExternalStore to subscribe to:
 * - localStorage changes (cross-tab sync)
 * - System preference changes (when no saved preference)
 * - Custom "bb_theme_change" events (same-tab updates)
 * 
 * @returns Object containing:
 *   - isDark: Current dark mode state
 *   - toggleTheme: Function to toggle between light/dark themes
 */
export function useThemeMode() {
  /**
   * Subscribe function for useSyncExternalStore
   * Sets up event listeners for theme changes
   */
  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === "undefined") return () => {};

    const notify = () => onStoreChange();

    // Listen for cross-tab storage changes
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "bb_theme") return;
      const saved = e.newValue;
      const nextDark = saved === "dark" || (saved !== "light" && getSystemPrefersDark());
      applyTheme(nextDark);
      notify();
    };

    // Listen for system preference changes (only when no saved preference)
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)") ?? null;
    const onSystemPrefChange = () => {
      const saved = localStorage.getItem("bb_theme");
      if (saved === "dark" || saved === "light") return;
      const prefersDark = getSystemPrefersDark();
      applyTheme(prefersDark);
      notify();
    };

    window.addEventListener("storage", onStorage);
    mq?.addEventListener?.("change", onSystemPrefChange);
    window.addEventListener("bb_theme_change", notify);

    return () => {
      window.removeEventListener("storage", onStorage);
      mq?.removeEventListener?.("change", onSystemPrefChange);
      window.removeEventListener("bb_theme_change", notify);
    };
  };

  const getSnapshot = () => getInitialThemeFromDom();
  const getServerSnapshot = () => false;

  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Toggles theme between light and dark
   * Persists preference to localStorage and dispatches custom event
   */
  const toggleTheme = () => {
    const next = !isDark;
    try {
      localStorage.setItem("bb_theme", next ? "dark" : "light");
    } catch {
      // Ignore storage failures (e.g., private browsing mode)
    }
    applyTheme(next);
    window.dispatchEvent(new Event("bb_theme_change"));
  };

  return { isDark, toggleTheme };
}


