type LoadingSkeletonProps = {
  variant?: 'content' | 'cards';
  count?: number;
};

function SkeletonLines() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="h-4 w-full animate-pulse rounded-sm bg-gray-200" />
      <div className="h-4 w-11/12 animate-pulse rounded-sm bg-gray-200" />
      <div className="h-4 w-4/5 animate-pulse rounded-sm bg-gray-200" />
    </div>
  );
}

export default function LoadingSkeleton({ variant = 'content', count = 3 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="w-full" role="status" aria-live="polite">
      {variant === 'cards' ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {items.map((item) => (
            <li key={item} className="overflow-hidden rounded-lg border border-mairie-line bg-white">
              <div className="aspect-[4/3] animate-pulse bg-gray-200" />
              <div className="space-y-4 p-5">
                <div className="h-4 w-1/3 animate-pulse rounded-sm bg-gray-200" />
                <div className="h-6 w-4/5 animate-pulse rounded-sm bg-gray-200" />
                <SkeletonLines />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-6" aria-hidden="true">
          {items.map((item) => (
            <div key={item} className="space-y-4">
              <div className="h-7 w-2/5 animate-pulse rounded-sm bg-gray-200" />
              <SkeletonLines />
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-sm text-mairie-muted">Chargement des informations...</p>
      <span className="sr-only">Chargement des informations...</span>
    </div>
  );
}
