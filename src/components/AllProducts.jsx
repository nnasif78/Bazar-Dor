"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCardSkeleton, { LoadingLabel } from "@/components/ProductCardSkeleton";
import { showToast } from "@/lib/toast";
import { waitForMinimumSkeleton } from "@/lib/loading";
import { fetchBazardor } from "@/lib/bazardor-api";

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const startedAt = Date.now();
        fetchBazardor("/products")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch products");
                return res.json();
            })
            .then(data => setProducts(data))
            .catch(async error => {
                console.error(error);
                await waitForMinimumSkeleton(startedAt);
                showToast.error("পণ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
            })
            .finally(() => setLoading(false));
    }, []);

    const unit = value => value === "kg" ? "কেজি" : value === "dozen" ? "ডজন" : value === "litre" ? "লিটার" : "পিস";
    const banglaNumber = value => Number(value).toFixed(1).replace(/\d/g, digit => "০১২৩৪৫৬৭৮৯"[digit]);
    const banglaPrice = value => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 })
        .format(Number(value)).replace(/\d/g, digit => "০১২৩৪৫৬৭৮৯"[digit]);
    return (
        <section id="সব-পণ্য" className="scroll-mt-4 bg-[#F0F5F0] px-4 py-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-5">
                    <h2 className="text-[28px] font-bold leading-9 text-[#111827]">সব পণ্য</h2>
                    <p className="mt-1 text-[14px] text-[#6B7280]">মোট {products.length}টি পণ্য দেখানো হচ্ছে</p>
                </div>

                {loading && <LoadingLabel className="mb-4" />}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? <ProductCardSkeleton /> : products.map(product => {
                        const change = product.change?.pct || 0;
                        const direction = product.change?.dir;

                        return (
                            <Link href={`/product/${product.id}`} key={product.id} className="block">
                            <div key={product.id} className="relative rounded-2xl border border-[#E5E7EB] bg-[#FAFCFA] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F3F4F6] text-[30px]">
                                        {product.image}
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold text-[#111827]">{product.nameBn}</h3>
                                        <p className="mt-1 text-[13px] text-[#6B7280]">প্রতি {unit(product.unit)}</p>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <p className="text-[13px] text-[#6B7280]">আজকের দাম</p>
                                    <p className="mt-1 text-[22px] font-bold text-[#111827]">{banglaPrice(product.today)} টাকা</p>
                                </div>
                                <span className={`absolute bottom-5 right-5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                                    direction === "up"
                                        ? "bg-[#F0F5F0] text-[#047F39]"
                                        : direction === "down"
                                            ? "bg-[#F0F5F0] text-[#DC2626]"
                                            : "bg-[#F0F5F0] text-[#6B7280]"
                                }`}>
                                    {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"} {banglaNumber(Math.abs(change))}%
                                </span>
                            </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
