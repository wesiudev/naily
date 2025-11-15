import JoinCTA from "@/components/Influencer/JoinCTA";
import Image from "next/image";
import influencer from "@/public/influencer.jpg";
import {
  AffiliateFAQ,
  AffiliateHowItWorks,
  AffiliateProgram,
} from "@/components/AffiliateLanding";
export default function InfluencerProgramPage() {
  return (
    <div className="min-h-screen mx-auto bg-purple-50">
      {/* Hero */}
      <section className="container relative overflow-hidden pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl lg:text-5xl font-bold font-baloo text-zinc-800">
              Program zaproszeń
            </h1>
            <p className="mt-4 text-neutral-600 text-base sm:text-lg leading-relaxed">
              Zarabiaj polecając platformę, którą tworzymy z miłości do
              manicure. Tworzymy kampanie marketingowe i współpracujemy z
              twórcami treści.
            </p>
            <div className="mt-6">
              <JoinCTA />
            </div>
            <p className="mt-3 text-xs sm:text-sm text-neutral-500">
              Otrzymasz własny link i panel wyników.
            </p>
          </div>
          <div className="h-[50%] overflow-hidden rounded-2xl">
            <Image
              src={influencer}
              width={555}
              height={555}
              alt="Influencer Program"
              className="w-[90vw] lg:max-w-[550px] h-auto shadow-lg mb-6 lg:mb-0"
            />
          </div>
        </div>
      </section>

      <AffiliateProgram />
      <AffiliateHowItWorks />
      <AffiliateFAQ />
    </div>
  );
}
