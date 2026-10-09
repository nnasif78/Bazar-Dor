"use client";

import Image from "next/image";
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
        <section className="bg-[#FAFCFA] px-4 py-8">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white px-5 py-7 sm:px-8 sm:py-8 md:flex-row md:px-10">
                <div className="w-full max-w-2xl text-center md:text-left">
                    <span className="inline-flex rounded-full bg-[#E8F5EC] px-4 py-1.5 text-[14px] font-semibold text-[#047F39]">{date}</span>
                    <h1 className="mt-4 text-[30px] font-bold leading-[1.2] text-[#111827] sm:text-[36px]">আজকের বাজারের দাম এক নজরে</h1>
                    <p className="mt-3 max-w-xl text-[15px] leading-6 text-[#6B7280]">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
                    <a href="#সব-পণ্য" className="mx-auto mt-6 inline-flex h-11 items-center rounded-lg bg-[#047F39] px-5 py-2.5 text-[14px] font-bold text-white shadow-sm hover:bg-[#036B30] md:mx-0">সব পণ্য দেখুন</a>
                </div>
                <div className="relative mx-auto mt-6 w-full max-w-[240px] shrink-0 sm:max-w-[300px] md:mx-0 md:mt-0 md:w-[360px] md:max-w-none">
                    <Image src="/assets/bazar-hero.png" alt="বাজারের পণ্যের ঝুড়ি" width={360} height={280} className="h-auto w-full object-contain" priority />
                </div>
            </div>
        </section>
    );
}
