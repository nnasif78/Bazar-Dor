"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Form, Input, Label, TextField } from "@heroui/react";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";

export default function Profile() {
    const { data: session, isPending } = useSession(), [name, setName] = useState("");
    if (isPending) return <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] p-8" />;
    if (!session?.user) return null;
    const user = session.user, updateProfile = async e => { e.preventDefault(); const { error } = await authClient.updateUser({ name }); if (error) showToast.error(error.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।"); else { setName(""); showToast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে।"); } };

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
                    <h2 className="text-[18px] font-bold text-[#111827]">তথ্য</h2>
                    <Form className="mx-auto mt-5 flex max-w-xl flex-col items-center" onSubmit={updateProfile}>
                        <TextField name="name" isRequired className="w-full"><Label className="mb-1.5 text-[14px] font-semibold text-[#111827]">নাম</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} className="h-10 rounded-lg border-[#D1D5DB] px-3 text-[14px]" />
                        </TextField>
                        <Button type="submit" className="mt-4 h-10 w-full rounded-lg bg-[#047F39] px-5 text-[14px] font-bold text-white shadow-[0_4px_0_0_#B7D8C2] hover:bg-[#036B30]">আপডেট</Button>
                    </Form>
                </div>
            </div>
        </main>
    );
}