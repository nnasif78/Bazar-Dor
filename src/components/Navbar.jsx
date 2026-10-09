"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { showToast } from "@/lib/toast";
import { LoadingLabel } from "@/components/ProductCardSkeleton";
import { waitForMinimumSkeleton } from "@/lib/loading";
import { fetchBazardor } from "@/lib/bazardor-api";

const CATEGORIES_API = "/categories";
const PRODUCTS_API = "/products";
const banglaDigits = (value) => String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);
const formatPrice = (price) => new Intl.NumberFormat("en-IN").format(price).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);
const getUnit = (unit) => {
    const units = { kg: "কেজি", liter: "লিটার", litre: "লিটার", dozen: "ডজন", piece: "পিস", pcs: "পিস" };
    return units[unit] || unit;
};
export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [date, setDate] = useState("");
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const now = new Date();
        const weekdays = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
        const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
        setDate(`${weekdays[now.getDay()]}, ${banglaDigits(now.getDate())} ${months[now.getMonth()]}, ${banglaDigits(now.getFullYear())}`);
    }, []);
    useEffect(() => {
        const startedAt = Date.now();
        const fetchCategories = async () => {
            try {
                const response = await fetchBazardor(CATEGORIES_API);
                if (!response.ok) throw new Error("Failed to fetch categories");
                setCategories(await response.json());
            } catch (error) {
                console.error("Category fetch error:", error);
                await waitForMinimumSkeleton(startedAt);
                showToast.error("ক্যাটাগরি লোড করা যায়নি। আবার চেষ্টা করুন।");
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);
    useEffect(() => {
        const startedAt = Date.now();
        const fetchProducts = async () => {
            try {
                const response = await fetchBazardor(PRODUCTS_API);
                if (!response.ok) throw new Error("Failed to fetch products");
                setProducts(await response.json());
            } catch (error) {
                console.error("Product fetch error:", error);
                await waitForMinimumSkeleton(startedAt);
                showToast.error("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
            } finally {
                setProductsLoading(false);
            }
        };
        fetchProducts();
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const tickerProducts = useMemo(() => [...products, ...products], [products]);
    const handleSignOut = async () => {
        await signOut({ fetchOptions: { onSuccess: () => { setProfileOpen(false); showToast.success("সাইন আউট সফল হয়েছে।"); router.push("/"); } } });
    };
    const isLoggedIn = Boolean(session?.user);
    return (
        <header className="w-full bg-[#FAFCFA]">
            <div className="h-[68px] border-b border-[#E5E7EB]">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-3" aria-label="বাজার দর হোম">
                        <Image src="/assets/logo-icon.png" alt="বাজার দর" width={40} height={40} className="h-10 w-10 rounded-lg bg-[#05893E] object-contain p-3" />
                        <div className="flex flex-col justify-center">
                            <span className="text-[20px] font-bold leading-[28px] text-[#111827]">বাজার দর</span>
                            <span className="text-[12px] font-normal leading-[16px] text-[#6B7280]">{date}</span>
                        </div>
                    </Link>
                    {!isPending && (
                        !isLoggedIn ? (
                            <div className="flex items-center gap-5">
                                <Link href="/sign-in" className="text-[14px] font-semibold leading-[21px] text-[#111827] transition hover:text-[#047F39]">সাইন ইন</Link>
                                <Link href="/sign-up" className="rounded-lg bg-[#047F39] px-5 py-2.5 text-[14px] font-semibold leading-[21px] text-white shadow-sm transition hover:bg-[#036B30]">সাইন আপ</Link>
                            </div>
                        ) : (
                            <div ref={profileRef} className="relative">
                                <button type="button" onClick={() => setProfileOpen((previous) => !previous)} className="flex items-center gap-2">
                                    {session.user.image ? (
                                        <Image src={session.user.image} alt={session.user.name || "Profile"} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#047F39] text-sm font-semibold text-white">{session.user.name?.charAt(0)?.toUpperCase() || "U"}</div>
                                    )}
                                    <span className="max-w-[120px] truncate text-[14px] font-medium leading-[21px] text-[#111827]">{session.user.name}</span>
                                    <span className={`text-xs text-[#6B7280] transition-transform ${profileOpen ? "rotate-180" : ""}`}>▼</span>
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 top-[48px] z-50 w-64 rounded-xl border border-[#E5E7EB] bg-[#FAFCFA] p-4 shadow-lg">
                                        <div className="border-b border-[#E5E7EB] pb-3">
                                            <p className="truncate text-[14px] font-semibold leading-[20px] text-[#111827]">{session.user.name}</p>
                                            <p className="mt-0.5 truncate text-[12px] font-normal leading-[18px] text-[#6B7280]">{session.user.email}</p>
                                        </div>
                                        <div className="pt-2">
                                            <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-md px-2 py-2 text-[14px] font-normal leading-[21px] text-[#111827] transition hover:bg-[#F3F4F6]">
                                                <span>👤</span><span>আমার প্রোফাইল</span>
                                            </Link>
                                            <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[14px] font-normal leading-[21px] text-red-500 transition hover:bg-red-50">
                                                <span aria-hidden="true" className="inline-block h-[18px] w-[18px] shrink-0 bg-[#cc3333] [mask-image:url('/assets/logout.png')] [mask-size:contain] [mask-repeat:no-repeat] [-webkit-mask-image:url('/assets/logout.png')] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat]" />
                                                <span>সাইন আউট</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className="min-h-[45px] border-b border-[#E5E7EB] sm:h-[49px]">
                <div className="mx-auto flex max-w-6xl items-center px-4">
                    <div className="grid w-full grid-cols-4 items-center gap-x-2 sm:flex sm:gap-7">
                        {categoriesLoading ? <LoadingLabel className="h-[45px] justify-center text-xs sm:h-[49px]" /> : categories.map((category) => {
                            const active = pathname === `/category/${category.id}`;
                            return (
                                <Link key={category.id} href={`/category/${category.id}`} className={`flex h-[45px] items-center justify-center gap-1 border-b-2 px-1 text-[11px] font-semibold leading-[17.1px] transition sm:h-[49px] sm:justify-start sm:gap-1.5 sm:text-[12px] ${active ? "border-[#047F39] text-[#047F39]" : "border-transparent text-[#374151] hover:text-[#047F39]"}`}>
                                    <span className="text-[14px] leading-none font-['Segoe_UI_Emoji'] text-[#111827] sm:text-[16px]">{category.icon}</span>
                                    <span>{category.nameBn}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="group h-16 overflow-hidden border-b border-[#E5E7EB] bg-[#F8FAF9]">
                {productsLoading ? (
                    <div className="flex h-full items-center justify-center gap-4" role="status" aria-label="Loading products">
                        <span className="text-sm font-medium text-[#6B7280]">Loading products...</span>
                        <span aria-hidden="true" className="skeleton-shimmer h-5 w-48 rounded bg-[#E4EDE4] sm:w-72" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="bazar-marquee flex h-full w-max items-center gap-8 group-hover:[animation-play-state:paused]">
                        {tickerProducts.map((product, index) => {
                            const isDown = product.change?.dir === "down";
                            const isUp = product.change?.dir === "up";

                            return (
                                <div key={`${product.id}-${index}`} className="flex shrink-0 items-center gap-8">
                                    <Link href={`/product/${product.id}`} className="flex shrink-0 items-center gap-2 whitespace-nowrap transition-opacity hover:opacity-70">
                                        <span className="text-[18px] leading-none font-['Segoe_UI_Emoji'] text-[#111827]">{product.image || product.categoryIcon}</span>
                                        <span className="text-[14px] font-medium leading-5 text-[#111827]">{product.nameBn}</span>
                                        <span className="text-[14px] font-normal leading-5 text-[#374151]">{formatPrice(product.today)} টাকা/{getUnit(product.unit)}</span>
                                        {isUp && <span className="rounded-full bg-[#F0F5F0] px-2.5 py-1 text-[14px] font-semibold leading-5 text-[#DC2626]">▲ {formatPrice(product.change.pct)}%</span>}
                                        {isDown && <span className="rounded-full bg-[#F0F5F0] px-2.5 py-1 text-[14px] font-semibold leading-5 text-[#047F39]">▼ {formatPrice(product.change.pct)}%</span>}
                                    </Link>
                                    <span aria-hidden="true" className="h-6 w-px shrink-0 bg-[#D1D5DB]" />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">দাম লোড হচ্ছে...</div>
                )}
            </div>
        </header>
    );
}
