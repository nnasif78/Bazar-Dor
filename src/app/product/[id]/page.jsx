"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import { LoadingLabel } from "@/components/ProductCardSkeleton";
import { waitForMinimumSkeleton } from "@/lib/loading";
import { fetchBazardor } from "@/lib/bazardor-api";

function ProductDetailsContent() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [product, setProduct] = useState(null);
    const [productNotFound, setProductNotFound] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const signInRedirectHandled = useRef(false);

    useEffect(() => {
        if (!isPending && !session?.user && !signInRedirectHandled.current) {
            signInRedirectHandled.current = true;
            showToast.alert("পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন।");
            router.replace("/sign-in");
        }
    }, [isPending, session, router]);

    useEffect(() => {
        if (!session?.user || !id) return;

        setProduct(null);
        setProductNotFound(false);
        setLoadError(false);

        const fetchProduct = async () => {
            const startedAt = Date.now();
            try {
                const [productResult, categoriesResult] = await Promise.allSettled([
                    fetchBazardor(`/products/${encodeURIComponent(id)}`),
                    fetchBazardor("/categories")
                ]);
                if (productResult.status === "rejected") throw productResult.reason;

                const response = productResult.value;
                if (response.status === 404) {
                    setProductNotFound(true);
                    return;
                }
                if (!response.ok) throw new Error("Product request failed");

                const data = await response.json();
                if (!data?.nameBn) {
                    setProductNotFound(true);
                    return;
                }

                let categories = [];
                if (categoriesResult.status === "fulfilled" && categoriesResult.value.ok) {
                    try {
                        const categoryData = await categoriesResult.value.json();
                        categories = Array.isArray(categoryData)
                            ? categoryData
                            : Array.isArray(categoryData?.categories)
                                ? categoryData.categories
                                : categoryData?.id
                                    ? [categoryData]
                                    : [];
                    } catch {
                        // Product details can still render if the category response is malformed.
                    }
                }

                const productCategory = data.categoryId
                    ?? (typeof data.category === "string" ? data.category : data.category?.id ?? data.category?.slug)
                    ?? null;
                const matchedCategory = categories.find(category =>
                    category.id === productCategory
                    || category.slug === productCategory
                    || category.nameBn === data.categoryNameBn
                );
                setProduct({ ...data, categoryId: matchedCategory?.id ?? productCategory });
            } catch (error) {
                console.error(error);
                await waitForMinimumSkeleton(startedAt);
                setLoadError(true);
                showToast.error("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
            }
        };

        fetchProduct();
    }, [session, id]);

    const banglaNumber = value => Number(value).toFixed(1).replace(/\d/g, digit => "০১২৩৪৫৬৭৮৯"[digit]);
    const unit = value => value === "kg" ? "কেজি" : value === "dozen" ? "ডজন" : value === "litre" ? "লিটার" : "পিস";

    if (!isPending && session?.user && (productNotFound || loadError)) {
        return (
            <main className="flex min-h-[calc(100vh-138px)] items-center justify-center bg-[#F0F5F0] px-4 py-10">
                <section className="w-full max-w-xl rounded-3xl border border-[#E5E7EB] bg-[#FAFCFA] px-6 py-12 text-center shadow-sm">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E8F5EC] text-4xl" aria-hidden="true">
                        {loadError ? "⚠️" : "🔎"}
                    </div>
                    <p className="mt-6 text-[72px] font-extrabold leading-none tracking-tight text-[#047F39]">
                        {loadError ? "!" : "৪০৪"}
                    </p>
                    <h1 className="mt-4 text-2xl font-bold text-[#111827]">
                        {loadError ? "পণ্যের তথ্য লোড করা যায়নি" : "পণ্যটি পাওয়া যায়নি"}
                    </h1>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
                        {loadError
                            ? "আবার চেষ্টা করুন, অথবা হোম পেজে ফিরে যান।"
                            : "পণ্যটি সরিয়ে ফেলা হয়েছে, অথবা ঠিকানাটি সঠিক নয়।"}
                    </p>
                    <Link href="/" className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-[#047F39] px-5 text-sm font-bold text-white transition hover:bg-[#036B30]">
                        হোম পেজে ফিরে যান
                    </Link>
                </section>
            </main>
        );
    }

    if (isPending || !session?.user || !product) {
        return (
            <main className="min-h-[calc(100vh-68px)] animate-pulse bg-[#F0F5F0] px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <LoadingLabel className="mb-5" />
                    <div className="skeleton-shimmer h-4 w-48 rounded bg-[#DDEBDD]" />
                    <div className="mt-5 flex flex-col gap-6 rounded-2xl border border-[#E5E7EB] bg-[#FAFCFA] p-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="skeleton-shimmer h-20 w-20 shrink-0 rounded-xl bg-[#F0F5F0]" />
                            <div>
                                <div className="skeleton-shimmer h-7 w-48 rounded bg-[#DDEBDD]" />
                                <div className="skeleton-shimmer mt-2 h-4 w-32 rounded bg-[#E8F1E8]" />
                                <div className="skeleton-shimmer mt-3 h-4 w-64 rounded bg-[#E8F1E8]" />
                            </div>
                        </div>
                        <div className="skeleton-shimmer h-[132px] w-[117px] rounded-xl bg-[#F0F5F0]" />
                    </div>
                    <section className="mt-8 rounded-2xl border border-[#D1D5DB] bg-[#FAFCFA] p-6">
                        <div className="skeleton-shimmer h-6 w-48 rounded bg-[#DDEBDD]" />
                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="skeleton-shimmer h-28 rounded-2xl bg-[#F0F5F0]" />
                            ))}
                        </div>
                        <div className="skeleton-shimmer mt-8 h-6 w-56 rounded bg-[#DDEBDD]" />
                        <div className="mt-5 overflow-hidden rounded-2xl border border-[#D1D5DB] bg-[#FAFCFA]">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="skeleton-shimmer h-12 border-b border-[#D1D5DB] bg-[#F0F5F0]" />
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
                <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-x-2 text-[14px] text-[#6B7280]">
                    <Link href="/" className="rounded-sm transition-colors hover:text-[#047F39] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047F39]">
                        হোম
                    </Link>
                    <span aria-hidden="true">›</span>
                    {product.categoryId ? (
                        <Link href={`/category/${product.categoryId}`} className="rounded-sm transition-colors hover:text-[#047F39] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047F39]">
                            {product.categoryNameBn}
                        </Link>
                    ) : (
                        <span>{product.categoryNameBn}</span>
                    )}
                    <span aria-hidden="true">›</span>
                    <Link href={`/product/${product.id}`} aria-current="page" className="rounded-sm font-medium text-[#111827] transition-colors hover:text-[#047F39] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047F39]">
                        {product.nameBn}
                    </Link>
                </nav>
                <div className="flex flex-col gap-5 rounded-2xl border border-[#E5E7EB] bg-[#FAFCFA] p-4 sm:gap-6 sm:p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0] text-[36px] sm:h-20 sm:w-20 sm:text-[42px]">
                            {product.image || product.categoryIcon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="break-words text-[22px] font-bold leading-tight text-[#111827] sm:text-[26px]">{product.nameBn}</h1>
                            <p className="mt-1 text-[14px] text-[#6B7280]">প্রতি {unit(product.unit)}</p>
                            <span className="mt-2 inline-flex rounded-full bg-[#E8F5EC] px-3 py-1 text-[12px] font-semibold text-[#047F39]">
                                {product.categoryNameBn}
                            </span>
                            <p className="mt-2 break-words text-[14px] leading-5 text-[#374151]">
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
                    <div className="flex w-full shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-[#F0F5F0] p-4 text-center sm:flex-row sm:justify-center sm:gap-3 md:w-[280px] md:flex-col md:gap-2 md:p-5">
                        <div className="min-w-0 flex flex-col items-center justify-center text-center">
                            <p className="text-[13px] leading-5 text-[#6B7280]">আজকের দাম</p>
                            <div className="mt-1 flex items-baseline justify-center gap-1 whitespace-nowrap">
                                <span className="text-[28px] font-bold leading-tight text-[#111827] sm:text-[30px]">{banglaNumber(product.today)}</span>
                                <span className="text-[13px] text-[#6B7280] sm:text-[14px]">টাকা / {unit(product.unit)}</span>
                            </div>
                        </div>
                        <span className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[12px] font-bold ${direction === "up" ? "bg-[#F0F5F0] text-[#DC2626]" : direction === "down" ? "bg-[#F0F5F0] text-[#047F39]" : "bg-[#F0F5F0] text-[#6B7280]"}`}>
                            {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"} {banglaNumber(Math.abs(change))}%
                        </span>
                    </div>
                </div>
                <section className="mt-8 rounded-2xl border border-[#D1D5DB] bg-[#FAFCFA] p-6">
                    <h2 className="mb-5 text-[20px] font-bold text-[#111827]">
                        দামের সারসংক্ষেপ
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFCFA] p-5">
                            <p className="text-[14px] text-[#6B7280]">সর্বনিম্ন দাম</p>
                            <p className="mt-2 text-[26px] font-bold text-[#047F39]">
                                {banglaNumber(minPrice)} টাকা
                            </p>
                            <p className="mt-1 text-[13px] text-[#6B7280]">
                                সবচেয়ে কম দামের বাজার
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFCFA] p-5">
                            <p className="text-[14px] text-[#6B7280]">সর্বাধিক দাম</p>
                            <p className="mt-2 text-[26px] font-bold text-[#DC2626]">
                                {banglaNumber(maxPrice)} টাকা
                            </p>
                            <p className="mt-1 text-[13px] text-[#6B7280]">
                                সবচেয়ে বেশি দামের বাজার
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFCFA] p-5">
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
                    <div className="overflow-hidden rounded-2xl border border-[#D1D5DB] bg-[#FAFCFA]">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left">
                                <thead className="bg-[#FAFCFA]">
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
                                                className={`border-b border-[#D1D5DB] last:border-0 ${index % 2 === 1 ? "bg-[#F0F5F0]" : "bg-[#FAFCFA]"}`}
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
                <div className="mt-5 h-48 rounded-2xl border border-[#E5E7EB] bg-[#FAFCFA]" />
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
