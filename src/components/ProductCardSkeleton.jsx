const shimmer = "skeleton-shimmer rounded bg-[#E4EDE4]";

export function LoadingLabel({ className = "" }) {
    return (
        <p role="status" className={`flex items-center gap-2 text-sm font-medium text-[#6B7280] ${className}`}>
            <span className="loading-dot h-2 w-2 rounded-full bg-[#047F39]" />
            Loading...
        </p>
    );
}

export default function ProductCardSkeleton({ count = 6, dense = false }) {
    return Array.from({ length: count }, (_, index) => (
        <div key={index} aria-hidden="true" className={`relative rounded-2xl border border-[#E5E7EB] bg-white p-5 ${dense ? "h-[140px] w-full max-w-[360px]" : ""}`}>
            {dense ? (
                <div className="flex items-start gap-4">
                    <div className={`${shimmer} h-14 w-14 shrink-0 rounded-xl`} />
                    <div className="min-w-0 flex-1">
                        <div className={`${shimmer} h-4 w-3/4`} />
                        <div className={`${shimmer} mt-2 h-3 w-1/2`} />
                        <div className={`${shimmer} mt-3 h-3 w-20`} />
                        <div className={`${shimmer} mt-1 h-5 w-24`} />
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3">
                        <div className={`${shimmer} h-14 w-14 shrink-0 rounded-xl`} />
                        <div className="min-w-0 flex-1">
                            <div className={`${shimmer} h-4 w-3/4`} />
                            <div className={`${shimmer} mt-2 h-3 w-1/2`} />
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className={`${shimmer} h-3 w-20`} />
                        <div className={`${shimmer} mt-2 h-6 w-28`} />
                    </div>
                </>
            )}
            <div className={`${shimmer} absolute bottom-5 right-5 h-6 w-14 rounded-full`} />
        </div>
    ));
}
