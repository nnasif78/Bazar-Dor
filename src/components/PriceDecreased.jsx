"use client";

import { useEffect, useState } from "react";

export default function PriceDecreased() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("https://api.api-store.workers.dev/api/bazardor/products")
            .then(res => res.json())
            .then(data => setProducts(data.filter(p => p.change?.dir === "down").sort((a, b) => a.change.pct - b.change.pct).slice(0, 6)));
    }, []);

    return (
        <section className="bg-[#F0F5F0] px-4 py-8">
            <div className="mx-auto max-w-6xl">
                <h2 className="mb-5 flex items-center gap-2 text-[20px] font-bold text-[#111827]">
                    <span className="text-[16px] text-[#047F39]">▼</span>আজ দাম কমেছে
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map(product => (
                        <div key={product.id} className="relative rounded-2xl border border-[#E5E7EB] bg-white p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F3F4F6] text-[30px]">{product.image}</div>
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#111827]">{product.nameBn}</h3>
                                    <p className="mt-1 text-[13px] text-[#6B7280]">প্রতি {product.unit === "kg" ? "কেজি" : product.unit === "dozen" ? "ডজন" : product.unit === "litre" ? "লিটার" : "পিস"}</p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <p className="text-[13px] text-[#6B7280]">আজকের দাম</p>
                                <p className="mt-1 text-[22px] font-bold text-[#111827]">{product.today} টাকা</p>
                            </div>

                            <span className="absolute bottom-5 right-5 rounded-full bg-[#ECFDF3] px-2.5 py-1 text-[12px] font-semibold text-[#047F39]">
                                ▼ {Math.abs(product.change.pct)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}