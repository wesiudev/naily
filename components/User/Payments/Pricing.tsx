import Image from "next/image";
import pricingImage from "../../../public/pricing.png";
import PricingButton from "./PricingButton";
import PricingModal from "./PricingModal";
import PricingPlanCard from "./PricingPlanCard";
import { User } from "@/types";

export default function Pricing({
  user,
  setPricingOpen,
  pricingOpen,
}: {
  user: User;
  setPricingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pricingOpen: boolean;
}) {
  return (
    <PricingModal onClose={() => setPricingOpen(false)}>
      <div className="relative h-[180px]">
        <Image
          src={pricingImage}
          alt="Cennik manicure obraz"
          className="object-cover w-full h-[180px]"
          priority
        />
      </div>
      <div className="px-6 py-5">
        <h2 className="text-2xl font-bold text-center text-neutral-900 mb-2">
          Naily Premium
        </h2>
        <p className="text-center text-neutral-600 mb-5">
          Zyskaj dostęp do najnowszych funkcji naszej platformy, dodaj
          nielimitowaną ilość usług i wyświetlaj je w swoim mieście!
        </p>

        <div className="grid grid-cols-1 gap-4">
          <PricingPlanCard
            title="Premium"
            priceLabel="49,99 zł / mies."
            ctaLabel={
              user?.subscription?.status === "active" ||
              user?.premiumActive ||
              user?.active
                ? "Aktywne"
                : "Wykup subskrypcję"
            }
            onCta={() => {}}
            features={[
              { label: "Wyróżnienie w wynikach" },
              { label: "Nieograniczeni klienci" },
              { label: "Automatyczne rezerwacje" },
            ]}
            highlight
            disabled={Boolean(
              user?.subscription?.status === "active" ||
                user?.premiumActive ||
                user?.active
            )}
          />
        </div>

        <div className="mt-5">
          <PricingButton setPricingOpen={setPricingOpen} user={user} />
        </div>
      </div>
    </PricingModal>
  );
}
