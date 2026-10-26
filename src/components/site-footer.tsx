export function SiteFooter() {
  return (
    <footer className="border-t border-line/70 bg-ink/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-mono tracking-[0.2em] text-fg-subtle">CIPHER</span>{" "}
          — Teknologi Informasi 2025
        </p>
        <p>
          Dikelola oleh{" "}
          <a
            href="https://github.com/RyuuZev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm font-medium text-fg-subtle underline-offset-4 transition-colors hover:text-neon-soft hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60 min-h-[44px] min-w-[44px] flex items-center px-1 py-2"
            aria-label="RyuuZev di GitHub (membuka tab baru)"
          >
            RyuuZev
          </a>
        </p>
      </div>
    </footer>
  );
}
