export default function SkeletonBookCard() {
  return (
    <div className="animate-pulse rounded-xl border border-hl-primary/10 bg-white shadow-sm">
      <div className="aspect-[2/3] rounded-t-xl bg-hl-secondary/10" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-hl-secondary/10" />
        <div className="h-3 w-1/2 rounded bg-hl-secondary/10" />
        <div className="h-3 w-1/3 rounded bg-hl-secondary/10" />
        <div className="h-5 w-1/4 rounded bg-hl-secondary/10" />
      </div>
    </div>
  );
}
