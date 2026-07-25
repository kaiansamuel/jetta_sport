export default function CatalogoLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="h-8 w-40 animate-pulse rounded bg-jetta-graphite" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-2xl bg-jetta-graphite" />
        ))}
      </div>
    </div>
  );
}
