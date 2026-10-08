"use client";

import React from "react";
import Link from "next/link";
import { Button, Form, Input, Label, TextField, FieldError } from "@heroui/react";
import { signIn, signUp } from "@/lib/auth-client";

const login = async () => await signIn.social({ provider: "google" });
const handleGithubSignIn = async () => await signIn.social({ provider: "github" });

const SignUp = () => {
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget), data = {};
        formData.forEach((value, key) => data[key] = value.toString());
        if (data.password !== data.confirmPassword) return;

        const { data: signupdata, error } = await signUp.email({
            name: data.name, email: data.email, password: data.password, callbackURL: "/",
        });
        console.log(signupdata, error);
    };

    return (
        <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-12">
            <div className="mx-auto flex max-w-md flex-col items-center">
                <div className="mb-7 text-center">
                    <h1 className="text-[28px] font-bold leading-9 text-[#111827]">অ্যাকাউন্ট তৈরি করুন</h1>
                    <p className="mt-2 text-[14px] font-normal leading-5 text-[#6B7280]">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
                </div>

                <div className="w-[416px] max-w-full rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                    <Form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
                        <TextField isRequired name="name" validate={(value) => value.length < 3 ? "নাম কমপক্ষে ৩ অক্ষরের হতে হবে" : null}>
                            <Label className="mb-1.5 text-[14px] font-semibold text-[#111827]">নাম</Label>
                            <Input className="h-10 rounded-lg border-[#D1D5DB] px-3 text-[14px]" placeholder="যেমন: রহিম উদ্দিন" />
                            <FieldError />
                        </TextField>

                        <TextField isRequired name="email" type="email" validate={(value) => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? "সঠিক ইমেইল দিন" : null}>
                            <Label className="mb-1.5 text-[14px] font-semibold text-[#111827]">ইমেইল</Label>
                            <Input className="h-10 rounded-lg border-[#D1D5DB] px-3 text-[14px]" placeholder="you@example.com" />
                            <FieldError />
                        </TextField>

                        <TextField isRequired minLength={8} name="password" type="password" validate={(value) => value.length < 8 ? "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে" : !/[A-Z]/.test(value) ? "পাসওয়ার্ডে অন্তত ১টি বড় হাতের অক্ষর থাকতে হবে" : !/[0-9]/.test(value) ? "পাসওয়ার্ডে অন্তত ১টি সংখ্যা থাকতে হবে" : null}>
                            <Label className="mb-1.5 text-[14px] font-semibold text-[#111827]">পাসওয়ার্ড</Label>
                            <Input className="h-10 rounded-lg border-[#D1D5DB] px-3 text-[14px]" placeholder="কমপক্ষে ৮ অক্ষর" />
                            <FieldError />
                        </TextField>

                        <TextField isRequired name="confirmPassword" type="password" validate={(value) => value !== document.querySelector('input[name="password"]')?.value ? "পাসওয়ার্ড মিলছে না" : null}>
                            <Label className="mb-1.5 text-[14px] font-semibold text-[#111827]">পাসওয়ার্ড নিশ্চিত করুন</Label>
                            <Input className="h-10 rounded-lg border-[#D1D5DB] px-3 text-[14px]" placeholder="আবার লিখুন" />
                            <FieldError />
                        </TextField>

                        <Button type="submit" className="h-10 w-full rounded-lg bg-[#047F39] text-[14px] font-bold text-white shadow-sm hover:bg-[#036B30]">অ্যাকাউন্ট তৈরি করুন</Button>

                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#E5E7EB]" />
                            <span className="text-[12px] font-normal text-[#9CA3AF]">অথবা</span>
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

                    <p className="mt-4 text-center text-[14px] font-normal leading-5 text-[#6B7280]">অ্যাকাউন্ট আছে?{" "}
                        <Link href="/sign-in" className="font-regular text-[#047F39] hover:underline">সাইন ইন করুন</Link>
                    </p>
                </div>

                <Link href="/" className="mt-6 text-[14px] font-normal leading-5 text-[#6B7280] hover:text-[#047F39]">← হোম পেজে ফিরে যান</Link>
            </div>
        </main>
    );
};

export default SignUp;
