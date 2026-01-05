/**
 * Shared UI primitives (class name joiner, Pill, Card, form inputs).
 * Keeps styling consistent across pages and components.
 */
import React from "react";

export function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.72)] px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))] shadow-sm backdrop-blur"
      )}
    >
      {children}
    </span>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.72)] p-6 shadow-sm backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-semibold">{children}</label>;
}

export function Input({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cx(
        "mt-2 w-full rounded-2xl border bg-[rgb(var(--surface))] px-4 py-3 text-sm shadow-sm transition-all duration-200",
        "border-[rgb(var(--border))] focus:border-[rgba(var(--accent),0.6)] focus:ring-2 focus:ring-[rgba(var(--accent),0.1)]",
        error && "border-red-500/70 focus:border-red-500/70 focus:ring-red-500/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props.className
      )}
      aria-invalid={error ? "true" : undefined}
    />
  );
}

export function Select({
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      {...props}
      className={cx(
        "mt-2 w-full rounded-2xl border bg-[rgb(var(--surface))] px-4 py-3 text-sm shadow-sm transition-all duration-200",
        "border-[rgb(var(--border))] focus:border-[rgba(var(--accent),0.6)] focus:ring-2 focus:ring-[rgba(var(--accent),0.1)]",
        error && "border-red-500/70 focus:border-red-500/70 focus:ring-red-500/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props.className
      )}
      aria-invalid={error ? "true" : undefined}
    >
      {children}
    </select>
  );
}

export function Textarea({
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      {...props}
      className={cx(
        "mt-2 w-full resize-none rounded-2xl border bg-[rgb(var(--surface))] px-4 py-3 text-sm shadow-sm transition-all duration-200",
        "border-[rgb(var(--border))] focus:border-[rgba(var(--accent),0.6)] focus:ring-2 focus:ring-[rgba(var(--accent),0.1)]",
        error && "border-red-500/70 focus:border-red-500/70 focus:ring-red-500/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props.className
      )}
      aria-invalid={error ? "true" : undefined}
    />
  );
}

export function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-xs text-red-600 dark:text-red-400" role="alert">
      {children}
    </p>
  );
}


