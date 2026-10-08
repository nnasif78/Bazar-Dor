"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

function ProductDetailsContent() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (!isPending && !session?.user) router.replace("/sign-in");
    }, [isPending, session, router]);

    useEffect(() => {
        if (session?.user && id) {
            fetch(`https://api.api-store.workers.dev/api/bazardor/products/${id}`)
                .then(res => res.json())
                .then(data => setProduct(data));
        }
    }, [session, id]);

    const banglaNumber = value => Number(value).toFixed(1).replace(/\d/g, digit => "০১২৩৪৫৬৭৮৯"[digit]);
    const unit = value => value === "kg" ? "কেজি" : value === "dozen" ? "ডজন" : value === "litre" ? "লিটার" : "পিস";

    if (isPending || !session?.user || !product) {
        return (
            <main className="min-h-[calc(100vh-68px)] animate-pulse bg-[#F0F5F0] px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <div className="h-4 w-48 rounded bg-[#DDEBDD]" />
                    <div className="mt-5 flex flex-col gap-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-20 w-20 shrink-0 rounded-xl bg-[#F0F5F0]" />
                            <div>
                                <div className="h-7 w-48 rounded bg-[#DDEBDD]" />
                                <div className="mt-2 h-4 w-32 rounded bg-[#E8F1E8]" />
                                <div className="mt-3 h-4 w-64 rounded bg-[#E8F1E8]" />
                            </div>
                        </div>
                        <div className="h-[132px] w-[117px] rounded-xl bg-[#F0F5F0]" />
                    </div>
                    <section className="mt-8 rounded-2xl border border-[#D1D5DB] bg-white p-6">
                        <div className="h-6 w-48 rounded bg-[#DDEBDD]" />
                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="h-28 rounded-2xl bg-[#F0F5F0]" />
                            ))}
                        </div>
                        <div className="mt-8 h-6 w-56 rounded bg-[#DDEBDD]" />
                        <div className="mt-5 overflow-hidden rounded-2xl border border-[#D1D5DB] bg-white">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="h-12 border-b border-[#D1D5DB] bg-[#F0F5F0]" />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    const markets = product.markets || [];
    const minPrice = Math.min(...markets.map(m => m.min));
    const maxPrice = Math.max(...markets.map(m => m.max));
    const averagePrice = markets.length
        ? markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) / markets.length
        : 0;

    const change = product.change?.pct || 0;
    const direction = product.change?.dir;

    return (
        <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-5 text-[14px] text-[#6B7280]">
                    <span>হোম</span><span className="mx-2">›</span>
                    <span>{product.categoryNameBn}</span><span className="mx-2">›</span>
                    <span>{product.nameBn}</span>
                </div>
                <div className="flex flex-col gap-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-[42px]">
                            {product.image || product.categoryIcon}
                        </div>
                        <div>
                            <h1 className="text-[26px] font-bold text-[#111827]">{product.nameBn}</h1>
                            <p className="mt-1 text-[14px] text-[#6B7280]">প্রতি {unit(product.unit)} · {product.categoryNameBn}</p>
                            <p className="mt-2 text-[14px] text-[#374151]">
                                গতকালের তুলনায় আজ দাম{" "}
                                <span className="font-bold">
                                    {direction === "up"
                                        ? "বেড়েছে"
                                        : direction === "down"
                                            ? "কমেছে"
                                            : "অপরিবর্তিত"}
                                </span>{" "}
                                · {banglaNumber(Math.abs(product.today - product.yesterday))} টাকা
                            </p>
                        </div>
                    </div>
                    <div className="flex h-[132px] w-[117px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#F0F5F0] p-3">
                        <p className="text-[13px] text-[#6B7280]">আজকের দাম</p>
                        <div className="mt-1 flex items-end justify-center gap-1">
                            <span className="text-[28px] font-bold text-[#111827]">
                                {banglaNumber(product.today)}
                            </span>
                        </div>
                        <span className="text-[13px] text-[#6B7280]">
                            টাকা / {unit(product.unit)}
                        </span>
                        <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[12px] font-bold ${direction === "up"
                                ? "bg-[#FEF2F2] text-[#DC2626]"
                                : direction === "down"
                                    ? "bg-[#ECFDF3] text-[#047F39]"
                                    : "bg-[#F3F4F6] text-[#6B7280]"
                            }`}>
                            {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"}{" "}
                            {banglaNumber(Math.abs(change))}%
                        </span>
                    </div>
                </div>
                <section className="mt-8 rounded-2xl border border-[#D1D5DB] bg-white p-6">
                    <h2 className="mb-5 text-[20px] font-bold text-[#111827]">
                        দামের সারসংক্ষেপ
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                            <p className="text-[14px] text-[#6B7280]">সর্বনিম্ন দাম</p>
                            <p className="mt-2 text-[26px] font-bold text-[#047F39]">
                                {banglaNumber(minPrice)} টাকা
                            </p>
                            <p className="mt-1 text-[13px] text-[#6B7280]">
                                সবচেয়ে কম দামের বাজার
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                            <p className="text-[14px] text-[#6B7280]">সর্বাধিক দাম</p>
                            <p className="mt-2 text-[26px] font-bold text-[#DC2626]">
                                {banglaNumber(maxPrice)} টাকা
                            </p>
                            <p className="mt-1 text-[13px] text-[#6B7280]">
                                সবচেয়ে বেশি দামের বাজার
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                            <p className="text-[14px] text-[#6B7280]">গড় দাম</p>
                            <p className="mt-2 text-[26px] font-bold text-[#047F39]">
                                {banglaNumber(averagePrice)} টাকা
                            </p>
                            <p className="mt-1 text-[13px] text-[#6B7280]">
                                প্রতি {unit(product.unit)}-এর হিসাবে
                            </p>
                        </div>
                    </div>
                    <h2 className="mb-5 mt-8 text-[20px] font-bold text-[#111827]">
                        বাজারভিত্তিক আজকের দাম
                    </h2>
                    <div className="overflow-hidden rounded-2xl border border-[#D1D5DB] bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left">
                                <thead className="bg-white">
                                    <tr className="border-b border-[#D1D5DB]">
                                        <th className="px-5 py-4 text-[14px] font-semibold text-[#757C77]">বাজার</th>
                                        <th className="px-5 py-4 text-[14px] font-semibold text-[#757C77]">বিভাগ</th>
                                        <th className="px-5 py-4 text-[14px] font-semibold text-[#757C77]">সর্বনিম্ন</th>
                                        <th className="px-5 py-4 text-[14px] font-semibold text-[#757C77]">সর্বাধিক</th>
                                        <th className="px-5 py-4 text-[14px] font-semibold text-[#757C77]">গড়</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {markets.map((market, index) => {
                                        const average = (market.min + market.max) / 2;
                                        return (
                                            <tr
                                                key={index}
                                                className={`border-b border-[#D1D5DB] last:border-0 ${index % 2 === 1 ? "bg-[#F0F5F0]" : "bg-white"}`}
                                            >
                                                <td className="px-5 py-4 text-[14px] text-[#111827]">{market.market}</td>
                                                <td className="px-5 py-4 text-[14px] text-[#111827]">{market.division}</td>
                                                <td className="px-5 py-4 text-[14px] font-normal text-[#111827]">{banglaNumber(market.min)} টাকা</td>
                                                <td className="px-5 py-4 text-[14px] font-normal text-[#111827]">{banglaNumber(market.max)} টাকা</td>
                                                <td className="px-5 py-4 text-[14px] font-bold text-[#111827]">{banglaNumber(average)} টাকা</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

function ProductDetailsLoading() {
    return (
        <main className="min-h-[calc(100vh-68px)] animate-pulse bg-[#F0F5F0] px-4 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="h-4 w-48 rounded bg-[#DDEBDD]" />
                <div className="mt-5 h-48 rounded-2xl border border-[#E5E7EB] bg-white" />
                <div className="mt-8 h-6 w-48 rounded bg-[#DDEBDD]" />
            </div>
        </main>
    );
}

export default function ProductDetails() {
    return (
        <Suspense fallback={<ProductDetailsLoading />}>
            <ProductDetailsContent />
        </Suspense>
    );
}