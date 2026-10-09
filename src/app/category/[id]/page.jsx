"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { showToast } from "@/lib/toast";
import ProductCardSkeleton, { LoadingLabel } from "@/components/ProductCardSkeleton";
import { waitForMinimumSkeleton } from "@/lib/loading";
import { fetchBazardor } from "@/lib/bazardor-api";

function CategoryPageContent() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [sort, setSort] = useState("default");
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            const startedAt = Date.now();
            setLoading(true);
            setNotFound(false);
            setLoadError(false);

            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetchBazardor(`/products?category=${encodeURIComponent(id)}`),
                    fetchBazardor(`/categories/${encodeURIComponent(id)}`)
                ]);

                if (productsRes.status === 404 || categoriesRes.status === 404) {
                    setNotFound(true);
                    return;
                }
                if (!productsRes.ok || !categoriesRes.ok) {
                    throw new Error("Category request failed");
                }

                const productsData = await productsRes.json();
                const categoryData = await categoriesRes.json();

                if (!categoryData?.nameBn || !Array.isArray(productsData) || productsData.length === 0) {
                    setNotFound(true);
                    return;
                }

                setProducts(productsData);
                setCategory(categoryData);
            } catch (error) {
                console.error(error);
                await waitForMinimumSkeleton(startedAt);
                setLoadError(true);
                showToast.error("তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const banglaNumber = value =>
        String(value).replace(/\d/g, digit => "০১২৩৪৫৬৭৮৯"[digit]);

    const banglaPercentage = value =>
        Number(value)
            .toFixed(1)
            .replace(/\d/g, digit => "০১২৩৪৫৬৭৮৯"[digit]);

    const unit = value =>
        value === "kg"
            ? "কেজি"
            : value === "dozen"
                ? "ডজন"
                : value === "litre"
                    ? "লিটার"
                    : "পিস";

    const sortedProducts = [...products].sort((a, b) => {
        if (sort === "price-low") return a.today - b.today;
        if (sort === "price-high") return b.today - a.today;
        return 0;
    });

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <LoadingLabel className="mb-5" />
                    <div aria-hidden="true" className="skeleton-shimmer h-28 rounded-3xl border border-[#E5E7EB] bg-[#FAFCFA]" />
                    <div aria-hidden="true" className="skeleton-shimmer mt-5 h-16 rounded-3xl border border-[#E5E7EB] bg-[#FAFCFA]" />
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ProductCardSkeleton dense />
                    </div>
                </div>
            </main>
        );
    }

    if (notFound || loadError) {
        return (
            <main className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-[#F0F5F0] px-4 py-10">
                <div className="w-full max-w-lg rounded-3xl border border-[#E5E7EB] bg-[#FAFCFA] px-6 py-12 text-center shadow-sm">
                    <div className="text-5xl" aria-hidden="true">{loadError ? "⚠️" : "🔎"}</div>
                    <h1 className="mt-4 text-2xl font-bold text-[#111827]">
                        {loadError ? "তথ্য লোড করা যায়নি" : "ক্যাটাগরি পাওয়া যায়নি"}
                    </h1>
                    <p className="mt-2 text-sm text-[#6B7280]">
                        {loadError
                            ? "আবার চেষ্টা করুন, অথবা হোম পেজে ফিরে যান।"
                            : "এই ক্যাটাগরিতে কোনো পণ্য নেই, অথবা ক্যাটাগরিটি সঠিক নয়।"}
                    </p>
                    <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-lg bg-[#047F39] px-5 text-sm font-bold text-white hover:bg-[#036B30]">
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-10">
            <div className="mx-auto max-w-6xl">

                <div className="rounded-3xl border border-[#E5E7EB] bg-[#FAFCFA] p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F0F5F0] text-[36px]">
                            {category?.icon}
                        </div>

                        <div>
                            <h1 className="text-[26px] font-bold text-[#111827]">
                                {category?.nameBn}
                            </h1>

                            <p className="mt-1 text-[14px] text-[#6B7280]">
                                {banglaNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-col rounded-3xl border border-[#E5E7EB] bg-[#FAFCFA] p-5">
                    <div className="flex w-full flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] text-[#374151]">
                                সাজান:
                            </span>

                            <div className="relative">
                                <select
                                    value={sort}
                                    onChange={e => setSort(e.target.value)}
                                    aria-label="পণ্যের তালিকা সাজান"
                                    className="h-9 appearance-none rounded-full border border-[#D1D5DB] bg-[#FAFCFA] py-1 pl-3 pr-8 text-[13px] text-[#374151] outline-none"
                                >
                                    <option value="default">ডিফল্ট</option>
                                    <option value="price-low">দাম: কম থেকে বেশি</option>
                                    <option value="price-high">দাম: বেশি থেকে কম</option>
                                </select>
                                <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6B7280]">▼</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-5 text-[16px] text-[#6B7280]">
                    মোট {banglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map(product => {
                        const direction = product.change?.dir;
                        const change = product.change?.pct || 0;

                        return (
                            <Link key={product.id} href={`/product/${product.id}`} className="block">
                                <div className="relative h-[140px] w-full max-w-[360px] rounded-2xl border border-[#D1D5DB] bg-[#FAFCFA] p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-[30px]">
                                            {product.image || product.categoryIcon}
                                        </div>

                                        <div>
                                            <h2 className="text-[16px] font-semibold leading-6 text-[#111827]">
                                                {product.nameBn}
                                            </h2>

                                            <p className="text-[12px] font-normal leading-4 text-[#111827]">
                                                প্রতি {unit(product.unit)}
                                            </p>

                                            <p className="mt-3 text-[12px] font-normal leading-4 text-[#111827]">
                                                আজকের দাম
                                            </p>

                                            <p className="mt-0.5 text-[20px] font-bold leading-6 text-[#111827]">
                                                {banglaNumber(product.today)} <span className="text-[14px] font-normal">টাকা</span>
                                            </p>
                                        </div>
                                    </div>

                                    <span className={`absolute bottom-5 right-5 rounded-full px-2.5 py-1 text-[12px] font-bold ${
                                        direction === "up"
                                        ? "bg-[#F0F5F0] text-[#047F39]"
                                        : direction === "down"
                                                ? "bg-[#F0F5F0] text-[#DC2626]"
                                                : "bg-[#F0F5F0] text-[#6B7280]"
                                    }`}>
                                        {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"}{" "}
                                        {banglaPercentage(Math.abs(change))}%
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}

function CategoryPageLoading() {
    return (
        <main className="min-h-[calc(100vh-68px)] bg-[#F0F5F0] px-4 py-10">
            <div className="mx-auto max-w-6xl">
                <LoadingLabel className="mb-5" />
                <div aria-hidden="true" className="skeleton-shimmer h-28 rounded-3xl border border-[#E5E7EB] bg-[#FAFCFA]" />
                <div aria-hidden="true" className="skeleton-shimmer mt-5 h-16 rounded-3xl border border-[#E5E7EB] bg-[#FAFCFA]" />
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductCardSkeleton count={6} dense />
                </div>
            </div>
        </main>
    );
}

export default function CategoryPage() {
    return (
        <Suspense fallback={<CategoryPageLoading />}>
            <CategoryPageContent />
        </Suspense>
    );
}
