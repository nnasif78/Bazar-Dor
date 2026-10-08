"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Banner() {
    const [date, setDate] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDate(new Intl.DateTimeFormat("bn-BD", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        }).format(new Date())), 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="bg-[#F0F5F0] px-4 py-8">
            <div className="mx-auto flex max-w-6xl items-center justify-between overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white px-10 py-8">
                <div className="max-w-2xl">
                    <span className="inline-flex rounded-full bg-[#E8F5EC] px-4 py-1.5 text-[14px] font-semibold text-[#047F39]">{date}</span>
                    <h1 className="mt-4 text-[36px] font-bold leading-[1.2] text-[#111827]">আজকের বাজারের দাম এক নজরে</h1>
                    <p className="mt-3 max-w-xl text-[15px] leading-6 text-[#6B7280]">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
                    <Link href="/products" className="mt-6 inline-flex h-11 items-center rounded-lg bg-[#047F39] px-5 py-2.5 text-[14px] font-bold text-white shadow-sm hover:bg-[#036B30]">সব পণ্য দেখুন</Link>
                </div>
                <div className="relative hidden w-[360px] shrink-0 md:block">
                    <Image src="/assets/bazar-hero.png" alt="বাজারের পণ্যের ঝুড়ি" width={360} height={280} className="h-auto w-full object-contain" priority />
                </div>
            </div>
        </section>
    );
}