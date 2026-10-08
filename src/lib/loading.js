export const MIN_ERROR_SKELETON_DURATION = 10_000;

export function waitForMinimumSkeleton(startedAt, minimumDuration = MIN_ERROR_SKELETON_DURATION) {
    const remaining = minimumDuration - (Date.now() - startedAt);
    return remaining > 0 ? new Promise(resolve => setTimeout(resolve, remaining)) : Promise.resolve();
}
