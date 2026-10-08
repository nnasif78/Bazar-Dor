"use client";

export default function HomeNavigationButton() {
    return (
        <button
            type="button"
            onClick={() => window.location.assign("/")}
            className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-[#047F39] px-5 text-sm font-bold text-white transition hover:bg-[#036B30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047F39]"
        >
            হোম পেজে ফিরে যান
        </button>
    );
}
