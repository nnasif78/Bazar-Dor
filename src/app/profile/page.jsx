"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { signOut, useSession } from "@/lib/auth-client";
import { PROFILE_AUTH_TOAST_KEY, showToast } from "@/lib/toast";
import { LoadingLabel } from "@/components/ProductCardSkeleton";

export default function Profile() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const redirectHandled = useRef(false);

    useEffect(() => {
        if (!isPending && !session?.user && !redirectHandled.current) {
            redirectHandled.current = true;
            window.sessionStorage.setItem(PROFILE_AUTH_TOAST_KEY, "প্রোফাইল দেখতে আগে সাইন ইন করুন।");
            const redirectTimer = window.setTimeout(() => router.replace("/sign-in"), 1000);
            return () => {
                window.clearTimeout(redirectTimer);
            };
        }
    }, [isPending, session, router]);

    if (isPending) return (
        <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-10">
            <div className="mx-auto mt-20 max-w-4xl">
                <LoadingLabel className="mb-5" />
                <div aria-hidden="true" className="skeleton-shimmer h-16 w-52 rounded bg-[#E4EDE4]" />
                <div className="skeleton-shimmer mt-7 h-28 rounded-2xl border border-[#E5E7EB] bg-white" />
                <div className="mt-5 rounded-2xl border border-[#E5E7EB] bg-white p-6">
                    <div aria-hidden="true" className="skeleton-shimmer h-6 w-24 rounded bg-[#E4EDE4]" />
                    <div aria-hidden="true" className="skeleton-shimmer mx-auto mt-5 h-10 max-w-xl rounded-lg bg-[#E4EDE4]" />
                    <div aria-hidden="true" className="skeleton-shimmer mx-auto mt-4 h-10 max-w-xl rounded-lg bg-[#E4EDE4]" />
                </div>
            </div>
        </main>
    );
    if (!session?.user) return (
        <main className="flex min-h-[calc(100vh-138px)] items-center justify-center bg-[#F0F5F0] px-4 py-10">
            <section className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
                <h1 className="text-2xl font-bold text-[#111827]">প্রোফাইল দেখতে সাইন ইন করুন</h1>
                <p className="mt-2 text-sm text-[#6B7280]">আপনার অ্যাকাউন্টের তথ্য দেখতে আগে সাইন ইন করতে হবে।</p>
                <Link href="/sign-in" className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#047F39] px-5 text-sm font-bold text-white transition hover:bg-[#036B30]">
                    সাইন ইন করুন
                </Link>
            </section>
        </main>
    );
    const user = session.user;

    return (
        <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-10 ">
            <div className="mx-auto max-w-4xl mt-20">
                <div className="mb-7"><h1 className="text-[28px] font-bold leading-9 text-[#111827]">আমার প্রোফাইল</h1>
                <p className="mt-1 text-[14px] leading-5 text-[#6B7280]">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন</p>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white p-6">
                    <div className="flex items-center gap-4">
                        <Image src={user.image || "/assets/logo-icon.png"} alt={user.name || "Profile"} width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
                    <div>
                        <h2 className="text-[18px] font-semibold text-[#111827]">{user.name}</h2><p className="mt-1 text-[14px] text-[#6B7280]">{user.email}</p>
                        </div>
                        </div>
                    <Button onPress={() => signOut({ fetchOptions: { onSuccess: () => showToast.success("সাইন আউট সফল হয়েছে।") } })} className="rounded-lg border border-[#FCA5A5] bg-white px-4 text-[14px] font-semibold text-[#DC2626] hover:bg-[#FEF2F2]">← সাইন আউট</Button>
                </div>
                <div className="mt-5 rounded-2xl border border-[#E5E7EB] bg-white p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-[18px] font-bold text-[#111827]">তথ্য</h2>
                            <p className="mt-1 text-sm text-[#6B7280]">আপনার প্রোফাইলের তথ্য পরিবর্তন করুন</p>
                        </div>
                        <Link href="/profile/update" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#047F39] px-5 text-[14px] font-bold text-white shadow-sm transition hover:bg-[#036B30]">
                            তথ্য আপডেট করুন
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
