import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main id="konten" className="relative flex-1 overflow-hidden">
        <div className="cyber-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div
            className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <span className="sr-only">Memuat profil...</span>
            <div className="surface aspect-[4/5] w-full animate-pulse rounded-3xl" />
            <div>
              <div className="h-4 w-36 animate-pulse rounded bg-overlay/5" />
              <div className="mt-5 flex gap-2">
                <div className="h-7 w-32 animate-pulse rounded-full bg-overlay/5" />
                <div className="h-7 w-28 animate-pulse rounded-full bg-overlay/5" />
              </div>
              <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-overlay/5" />
              <div className="mt-4 h-4 w-44 animate-pulse rounded bg-overlay/5" />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="surface h-24 animate-pulse rounded-2xl" />
                <div className="surface h-24 animate-pulse rounded-2xl" />
                <div className="surface h-24 animate-pulse rounded-2xl" />
                <div className="surface h-24 animate-pulse rounded-2xl" />
              </div>
              <div className="mt-8 h-11 w-40 animate-pulse rounded-xl bg-overlay/5" />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
