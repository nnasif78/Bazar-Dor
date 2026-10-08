"use client";

import { useEffect, useState } from "react";

export default function AllProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("https://api.api-store.workers.dev/api/bazardor/products")
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    const unit = value => value === "kg" ? "কেজি" : value === "dozen" ? "ডজন" : value === "litre" ? "লিটার" : "পিস";
    const banglaNumber = value => Number(value).toFixed(1).replace(/\d/g, digit => "০১২৩৪৫৬৭৮৯"[digit]);
    return (
        <section className="bg-[#F0F5F0] px-4 py-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-5">
                    <h2 className="text-[28px] font-bold leading-9 text-[#111827]">সব পণ্য</h2>
                    <p className="mt-1 text-[14px] text-[#6B7280]">মোট {products.length}টি পণ্য দেখানো হচ্ছে</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map(product => {
                        const change = product.change?.pct || 0;
                        const direction = product.change?.dir;
                        
                        return (
                            <div key={product.id} className="relative rounded-2xl border border-[#E5E7EB] bg-white p-5">
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
                                    <p className="mt-1 text-[22px] font-bold text-[#111827]">{product.today} টাকা</p>
                                </div>
                                <span className={`absolute bottom-5 right-5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                                    direction === "up"
                                        ? "bg-[#FEF2F2] text-[#DC2626]"
                                        : direction === "down"
                                            ? "bg-[#ECFDF3] text-[#047F39]"
                                            : "bg-[#F3F4F6] text-[#6B7280]"
                                }`}>
                                    {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"} {banglaNumber(Math.abs(change))}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}