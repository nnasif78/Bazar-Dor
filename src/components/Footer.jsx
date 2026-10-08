export default function Footer() {
    return (
        <footer className="border-t border-[#E5E7EB] bg-[#FAFCFA]">
            <div className="mx-auto flex min-h-[70px] max-w-6xl flex-col items-center justify-center gap-2 px-4 py-4 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
                <p className="text-[12px] font-normal leading-5 text-[#374151] sm:text-[14px]">
                    বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
                </p>
                <p className="text-[12px] font-normal leading-5 text-[#6B7280] sm:text-right sm:text-[14px]">
                    সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
                </p>
            </div>
        </footer>
    );
}
