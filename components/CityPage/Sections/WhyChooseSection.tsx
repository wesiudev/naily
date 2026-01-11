import {
  FaGem,
  FaStar,
  FaClock,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdSpa } from "react-icons/md";

export default function WhyChooseSection() {
  const features = [
    {
      icon: FaGem,
      title: "Certyfikowane produkty",
      description: "Używanie tylko sprawdzonych i bezpiecznych kosmetyków",
    },
    {
      icon: FaStar,
      title: "Doświadczone stylistki",
      description: "Wykwalifikowany personel z wieloletnim doświadczeniem",
    },
    {
      icon: FaClock,
      title: "Dogodne terminy",
      description: "Elastyczne godziny otwarcia dostosowane do Twoich potrzeb",
    },
    {
      icon: FaPhone,
      title: "Łatwa rezerwacja",
      description: "Szybkie i wygodne umawianie wizyt online lub telefonicznie",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Dogodne lokalizacje",
      description: "Salony w centrum miasta z łatwym dojazdem komunikacją miejską",
    },
    {
      icon: MdSpa,
      title: "Sterylne narzędzia",
      description: "Dezynfekcja i sterylizacja wszystkich narzędzi po każdym kliencie",
    },
  ];

  return (
    <section className="py-12 px-6 bg-neutral-50">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-4xl lg:text-5xl font-baloo font-bold text-zinc-800 mb-4">
            Dlaczego warto?
          </h2>
          <p className="text-neutral-600 max-w-2xl font-poppins font-normal">
            Profesjonalne salony oferują najwyższą jakość usług i bezpieczeństwo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-16">
          {features.map((feature, index) => (
            <div key={index}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="text-4xl text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold font-baloo text-2xl text-zinc-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 text-sm font-poppins font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




