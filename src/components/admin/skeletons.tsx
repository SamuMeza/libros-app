export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="admin-skeleton h-4 w-1/4" />
          <div className="admin-skeleton h-4 w-1/6" />
          <div className="admin-skeleton h-4 w-1/6" />
          <div className="admin-skeleton h-4 w-1/8" />
          <div className="admin-skeleton h-4 w-1/6" />
        </div>
      ))}
    </div>
  );
}
