const StatCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-28 w-full clay-card animate-pulse bg-muted/20"
        />
      ))}
    </div>
  );
};

export default StatCardsSkeleton;
