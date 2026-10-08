
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[calc(100vh-134px)] items-center justify-center bg-[#F0F5F0] px-4">
            <div className="text-center">
                <p className="text-[72px] font-bold leading-none text-[#047F39]">৪০৪</p>
                <h1 className="mt-4 text-[26px] font-bold text-[#111827]">
                    পেজটি পাওয়া যায়নি
                </h1>
                <p className="mt-2 text-[14px] text-[#6B7280]">
                    আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরিয়ে ফেলা হয়েছে বা অস্তিত্ব নেই।
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex rounded-lg bg-[#047F39] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#036B30]"
                >
                    হোমে ফিরে যান
                </Link>
            </div>
        </main>
    );
}
