"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Label, TextField } from "@heroui/react";
import { authClient, useSession } from "@/lib/auth-client";
import { PROFILE_AUTH_TOAST_KEY, showToast } from "@/lib/toast";
import { LoadingLabel } from "@/components/ProductCardSkeleton";

export default function UpdateProfile() {
    const { data: session, isPending } = useSession();
    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const redirectHandled = useRef(false);

    useEffect(() => {
        if (!isPending && !session?.user && !redirectHandled.current) {
            redirectHandled.current = true;
            window.sessionStorage.setItem(PROFILE_AUTH_TOAST_KEY, "প্রোফাইল দেখতে আগে সাইন ইন করুন।");
            router.replace("/sign-in");
        }
    }, [isPending, session, router]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedName = name.trim();
        if (!updatedName) {
            showToast.error("আপনার নাম লিখুন।");
            return;
        }

        setIsSaving(true);
        try {
            const { error } = await authClient.updateUser({ name: updatedName });
            if (error) {
                showToast.error(error.message || "প্রোফাইল আপডেট করা যায়নি।");
                return;
            }

            showToast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে।");
            window.setTimeout(() => router.replace("/profile"), 800);
        } catch {
            showToast.error("প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।");
        } finally {
            setIsSaving(false);
        }
    };

    if (isPending) {
        return (
            <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-10">
                <div className="mx-auto mt-20 max-w-4xl">
                    <LoadingLabel className="mb-5" />
                    <div aria-hidden="true" className="skeleton-shimmer h-48 rounded-2xl bg-[#FAFCFA]" />
                </div>
            </main>
        );
    }

    if (!session?.user) return null;

    return (
        <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-10">
            <div className="mx-auto mt-20 max-w-2xl">
                <Link href="/profile" className="text-sm font-semibold text-[#047F39] hover:underline">
                    ← প্রোফাইলে ফিরে যান
                </Link>
                <section className="mt-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFCFA] p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-[#111827]">তথ্য আপডেট করুন</h1>
                    <p className="mt-2 text-sm text-[#6B7280]">আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।</p>
                    <Form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                        <TextField name="name" isRequired>
                            <Label className="mb-1.5 text-sm font-semibold text-[#111827]">নাম</Label>
                            <Input
                                value={name}
                                onChange={event => setName(event.target.value)}
                                placeholder={session.user.name || "আপনার নাম লিখুন"}
                                className="h-11 rounded-lg border-[#D1D5DB] px-3 text-sm"
                            />
                        </TextField>
                        <Button type="submit" isDisabled={isSaving} className="h-11 w-full rounded-lg bg-[#047F39] px-5 text-sm font-bold text-white transition hover:bg-[#036B30] disabled:opacity-60">
                            {isSaving ? "আপডেট হচ্ছে…" : "আপডেট ইনফরমেশন"}
                        </Button>
                    </Form>
                </section>
            </div>
        </main>
    );
}
