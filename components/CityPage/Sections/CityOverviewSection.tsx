import Image from "next/image";
import slug1 from "../../../public/slug/slug1.png";
import slug2 from "../../../public/slug/slug2.png";
import slug3 from "../../../public/slug/slug3.png";
import { ICity } from "@/types";

interface CityOverviewSectionProps {
  city: ICity;
  serviceType: "manicure" | "pedicure";
}

export default function CityOverviewSection({
  city,
  serviceType,
}: CityOverviewSectionProps) {
  const serviceName = serviceType === "manicure" ? "Manicure" : "Pedicure";

  return (
    <section className="py-20 px-6">
      <div className="container">
        <h2 className="mb-16 text-4xl lg:text-5xl font-baloo font-bold text-neutral-900 leading-tight">
          {serviceName} {city.name} - Przegląd cen w 2026
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          <div>
            <Image
              src={slug1}
              alt={`Najlepsza jakość ${serviceName.toLowerCase()} ${city.name} - Profesjonalne usługi paznokci`}
              width={500}
              height={500}
              className="w-[350px]"
              loading="lazy"
              fetchPriority="low"
            />
            <h3 className="text-3xl font-baloo mt-8 lg:mt-12 mb-6 font-bold text-zinc-800">
              Stylistki paznokci w Twojej lokalizacji
            </h3>
            <p className="text-neutral-600 font-poppins font-normal">
              Twoja stylistka paznokci {city.name} - wypróbuj {serviceName.toLowerCase()}, 
              który podkreśli Twój charakter.
            </p>
          </div>

          <div>
            <Image
              src={slug2}
              alt={`Najlepsze opinie ${serviceName.toLowerCase()} ${city.name} - Zadowolone klientki na 2026 rok`}
              width={500}
              height={500}
              className="w-[350px]"
              loading="lazy"
              fetchPriority="low"
            />
            <h3 className="text-3xl font-baloo mt-8 lg:mt-12 mb-6 font-bold text-zinc-800">
              Perfekcyjne stylizacje paznokci
            </h3>
            <p className="text-neutral-600 font-poppins font-normal">
              Setki pozytywnych opinii i tysiące zachwyconych dłoni. Sprawdź, 
              dlaczego kobiety wybierają Naily.
            </p>
          </div>

          <div>
            <Image
              src={slug3}
              alt={`Rezerwuj ${serviceName.toLowerCase()} ${city.name} - Umów wizytę online`}
              width={500}
              height={500}
              className="w-[350px]"
              loading="lazy"
              fetchPriority="low"
            />
            <h3 className="text-3xl font-baloo mt-8 lg:mt-12 mb-6 font-bold text-zinc-800">
              Rezerwuj {serviceName.toLowerCase()}, kiedy chcesz
            </h3>
            <p className="text-neutral-600 font-poppins font-normal">
              Zarezerwuj termin lub przyjmuj klientki wtedy, gdy to dla Ciebie 
              najwygodniejsze.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

