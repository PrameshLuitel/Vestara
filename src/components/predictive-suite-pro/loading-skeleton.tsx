
'use client';
import { FC } from 'react';
import { Skeleton } from '../ui/skeleton';

const LoadingSkeleton: FC = () => {
    return (
        <div className="p-2 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-md bg-card/50 relative overflow-hidden">
                        <Skeleton className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary/10 to-transparent"/>
                        <div className="flex justify-between items-center mb-2">
                            <Skeleton className="h-6 w-1/3" />
                        </div>
                        <Skeleton className="h-5 w-1/2 mb-4" />
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadingSkeleton;
