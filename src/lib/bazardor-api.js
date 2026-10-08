const API_BASES = [
    "https://api.api-store.workers.dev/api/bazardor",
    "https://api.abcz.workers.dev/api/bazardor",
];

export async function fetchBazardor(path, options) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    let lastResponse;
    let lastError;

    for (const base of API_BASES) {
        try {
            const response = await fetch(`${base}${normalizedPath}`, options);
            if (response.ok) return response;
            lastResponse = response;
        } catch (error) {
            lastError = error;
        }
    }

    if (lastResponse) return lastResponse;
    throw lastError ?? new Error("All Bazardor APIs are unavailable");
}
