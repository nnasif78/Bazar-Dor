"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <div data-rht-toaster="true">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        borderRadius: "12px",
                        background: "#ffffff",
                        color: "#111827",
                        boxShadow: "0 8px 24px rgba(17, 24, 39, 0.12)",
                        padding: "12px 16px",
                    },
                }}
            />
        </div>
    );
}
