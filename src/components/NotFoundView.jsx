import Link from "next/link";

export default function NotFoundView() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#F0F5F0] px-4 py-12">
            <section className="w-full max-w-xl rounded-3xl border border-[#E5E7EB] bg-white px-6 py-12 text-center shadow-sm sm:px-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E8F5EC] text-4xl" aria-hidden="true">
                    🛒
                </div>
                <p className="mt-6 text-[72px] font-extrabold leading-none tracking-tight text-[#047F39]">৪০৪</p>
                <h1 className="mt-4 text-2xl font-bold text-[#111827]">পেজটি পাওয়া যায়নি</h1>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
                    আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরিয়ে ফেলা হয়েছে, ঠিকানা ভুল, অথবা পেজটির অস্তিত্ব নেই।
                </p>
                <Link
                    href="/"
                    className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-[#047F39] px-5 text-sm font-bold text-white transition hover:bg-[#036B30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047F39]"
                >
                    হোম পেজে ফিরে যান
                </Link>
            </section>
        </main>
    );
}
