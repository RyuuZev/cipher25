export default function Loading() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Memuat panel admin...</span>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="h-3 w-32 animate-pulse rounded bg-overlay/5" />
          <div className="mt-3 h-8 w-56 animate-pulse rounded bg-overlay/5" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-overlay/5" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded-xl bg-overlay/5" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="surface h-20 animate-pulse rounded-2xl" />
        <div className="surface h-20 animate-pulse rounded-2xl" />
        <div className="surface h-20 animate-pulse rounded-2xl" />
      </div>
      <div className="surface h-14 animate-pulse rounded-2xl" />
      <div className="surface h-96 animate-pulse rounded-2xl" />
    </div>
  );
}
