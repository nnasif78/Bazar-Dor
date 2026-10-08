"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Label, TextField, FieldError } from "@heroui/react";
import { signIn } from "@/lib/auth-client";
import { PROFILE_AUTH_TOAST_KEY, showToast } from "@/lib/toast";

const login = async () => {
    const { error } = await signIn.social({ provider: "google" });
    if (error) showToast.error(error.message || "Google দিয়ে সাইন ইন করতে সমস্যা হয়েছে।");
};

const handleGithubSignIn = async () => {
    const { error } = await signIn.social({ provider: "github" });
    if (error) showToast.error(error.message || "GitHub দিয়ে সাইন ইন করতে সমস্যা হয়েছে।");
};

const getSignInErrorMessage = (error) => {
    const message = `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();
    if (/invalid.*(email|password|credential)|(email|password|credential).*invalid|unauthorized|401/.test(message)) {
        return "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। আবার যাচাই করে চেষ্টা করুন।";
    }
    return "সাইন ইন করা যায়নি। ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।";
};

const SignIn = () => {
    const router = useRouter();

    useEffect(() => {
        const message = window.sessionStorage.getItem(PROFILE_AUTH_TOAST_KEY);
        if (!message) return;

        window.sessionStorage.removeItem(PROFILE_AUTH_TOAST_KEY);
        const toastTimer = window.setTimeout(() => showToast.alert(message), 100);
        return () => window.clearTimeout(toastTimer);
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget), data = {};
        formData.forEach((value, key) => data[key] = value.toString());

        const { error } = await signIn.email({
            email: data.email, password: data.password, rememberMe: true,
        });

        if (error) {
            showToast.error(getSignInErrorMessage(error));
            return;
        }

        showToast.success("সাইন ইন সফল হয়েছে।");
        window.setTimeout(() => router.replace("/"), 1000);
    };

    return (
        <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-12">
            <div className="mx-auto flex max-w-md flex-col items-center">
                <div className="mb-7 text-center">
                    <h1 className="text-[28px] font-bold leading-9 text-[#111827]">সাইন ইন</h1>
                    <p className="mt-2 text-[14px] leading-5 text-[#6B7280]">বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।</p>
                </div>

                <div className="h-[374px] w-[416px] max-w-full rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                    <Form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
                        <TextField isRequired name="email" type="email" validate={(value) => !/^[A-Z0-9.\_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? "সঠিক ইমেইল দিন" : null}>
                            <Label className="mb-1.5 text-[14px] font-medium text-[#111827]">ইমেইল</Label>
                            <Input className="h-10 rounded-lg border-[#D1D5DB] px-3 text-[14px]" placeholder="you@example.com" />
                            <FieldError />
                        </TextField>

                        <TextField isRequired minLength={8} name="password" type="password" validate={(value) => value.length < 8 ? "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে" : null}>
                            <Label className="mb-1.5 text-[14px] font-medium text-[#111827]">পাসওয়ার্ড</Label>
                            <Input className="h-10 rounded-lg border-[#D1D5DB] px-3 text-[14px]" placeholder="কমপক্ষে ৮ অক্ষর" />
                            <FieldError />
                        </TextField>

                        <Button type="submit" className="h-10 w-full rounded-lg bg-[#047F39] text-[14px] font-semibold text-white hover:bg-[#036B30]">সাইন ইন</Button>

                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#E5E7EB]" />
                            <span className="text-[12px] text-[#9CA3AF]">অথবা</span>
                            <div className="h-px flex-1 bg-[#E5E7EB]" />
                        </div>

                        <div className="flex w-full gap-2">
                            <Button type="button" onPress={login} className="h-10 min-w-0 flex-1 rounded-lg border border-[#D1D5DB] bg-white px-2 text-[11px] font-semibold text-[#111827] hover:bg-[#F9FAFB]">
                                <img src="https://img.icons8.com/color/1200/google-logo.jpg" alt="Google" className="h-5 w-5 shrink-0 rounded-full object-cover" />
                                <span className="truncate">Google দিয়ে চালিয়ে যান</span>
                            </Button>
                            <Button type="button" onPress={handleGithubSignIn} className="h-10 min-w-0 flex-1 rounded-lg border border-[#D1D5DB] bg-white px-2 text-[11px] font-semibold text-[#111827] hover:bg-[#F9FAFB]">
                                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" className="h-5 w-5 shrink-0" />
                                <span className="truncate">GitHub দিয়ে চালিয়ে যান</span>
                            </Button>
                        </div>
                    </Form>

                    <p className="mt-4 text-center text-[14px] font-normal leading-5 text-[#6B7280]">অ্যাকাউন্ট নেই?{" "}
                        <Link href="/sign-up" className="font-normal text-[#047F39] hover:underline">সাইন আপ করুন</Link>
                    </p>
                </div>

                <Link href="/" className="mt-6 text-[14px] font-medium text-[#6B7280] hover:text-[#047F39]">← হোম পেজে ফিরে যান</Link>
            </div>
        </main>
    );
};
export default SignIn;
