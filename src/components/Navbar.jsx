"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const { data: session } = authClient.useSession();

    const handleLogout = async () => {
        try {
            const result = await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        setIsMenuOpen(false);
                        router.push("/sign-in");
                    },
                    onError: (ctx) => {
                        console.error("Logout failed:", ctx.error);
                    },
                },
            });

            console.log("Logout result:", result);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
            <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="sr-only">Menu</span>

                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    <div className="flex items-center gap-3">
                        <p className="font-bold">ACME</p>
                    </div>
                </div>

                <ul className="hidden items-center gap-4 md:flex">
                    <li>
                        <Link href="#">Features</Link>
                    </li>

                    <li>
                        <Link
                            href="#"
                            className="font-medium text-accent"
                            aria-current="page"
                        >
                            Dashboard
                        </Link>
                    </li>

                    <li>
                            {
                                session?.user && <li>
                            <Link href="/profile" className="block py-2">
                                Profile
                               
                            </Link>
                             </li>
                            }
                        </li>
                </ul>

                {session?.user ? (
                    <Button
                        onPress={handleLogout}
                        className="bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
                    >
                        Logout
                    </Button>
                ) : (
                    <div className="hidden items-center gap-4 md:flex">
                        <Link href="/sign-in">Login</Link>

                        <Link href="/sign-up">
                            <Button>Sign Up</Button>
                        </Link>
                    </div>
                )}
            </header>

            {isMenuOpen && (
                <div className="border-t border-separator md:hidden">
                    <ul className="flex flex-col gap-2 p-4">
                        <li>
                            <Link href="#" className="block py-2">
                                Features
                            </Link>
                        </li>

                        <li>
                            <Link href="#" className="block py-2 font-medium text-accent">
                                Dashboard
                            </Link>
                        </li>

                        

                        <li className="mt-4 flex flex-col gap-2 border-t border-separator pt-4">
                            {session?.user ? (
                                <Button onPress={handleLogout} className="w-full">
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Link href="/sign-in" className="block py-2">
                                        Login
                                    </Link>

                                    <Link href="/sign-up">
                                        <Button className="w-full">Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}