import Image from "next/image";
import Banner from "@/components/Banner";
import PriceIncreased from "@/components/PriceIncreased";
import PriceDecreased from "@/components/PriceDecreased";

export default function Home() {
  return (
    <>
     <Banner />
     <PriceIncreased />
     <PriceDecreased />
    </>
  );
}
