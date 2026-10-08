import "./globals.css";
import NotFoundView from "@/components/NotFoundView";

export const metadata = {
    title: "পেজটি পাওয়া যায়নি | বাজার দর",
    description: "আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।",
};

export default function GlobalNotFound() {
    return (
        <html lang="bn">
            <body className="min-h-screen antialiased">
                <NotFoundView />
            </body>
        </html>
    );
}
