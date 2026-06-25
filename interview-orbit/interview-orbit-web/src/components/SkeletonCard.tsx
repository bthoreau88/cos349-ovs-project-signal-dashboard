type Props = {
  lines?: number;
};

export function SkeletonCard({ lines = 3 }: Props) {
  return (
    <div className="section-card skeleton-card" aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{ width: i === 0 ? "45%" : i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}
