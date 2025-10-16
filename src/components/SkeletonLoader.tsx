"use client";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ className = "", width, height, rounded = false }: SkeletonProps) {
  const style: React.CSSProperties = {};
  
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={style}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
      <Skeleton height={200} className="mb-4 rounded-lg" />
      <Skeleton height={20} className="mb-2" />
      <Skeleton height={16} className="mb-2 w-2/3" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton height={24} className="w-20" />
        <Skeleton height={16} className="w-16" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 animate-pulse">
      <Skeleton height={160} className="rounded-t-xl" />
      <div className="p-6">
        <Skeleton height={20} className="mb-4" />
        <Skeleton height={16} className="w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={20} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 mb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height={16} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton width={48} height={48} rounded />
          <div className="flex-1 space-y-2">
            <Skeleton height={16} className="w-3/4" />
            <Skeleton height={14} className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton height={32} className="w-16 mb-2" />
              <Skeleton height={20} className="w-24" />
            </div>
            <Skeleton width={48} height={48} rounded />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <Skeleton height={16} className="w-20 mb-2" />
          <Skeleton height={40} className="w-full rounded-lg" />
        </div>
      ))}
      <Skeleton height={48} className="w-32 rounded-lg" />
    </div>
  );
}
