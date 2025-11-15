import { FaUserPlus, FaLink, FaShare, FaMoneyBillWave } from "react-icons/fa";

export default function AffiliateHowItWorks() {
  const steps = [
    {
      number: "01",
      icon: FaUserPlus,
      title: "Dołącz do programu",
      description:
        "Załóż darmowe konto partnerskie Naily. Proces zajmuje 2 minuty – bez opłat i formalności.",
      details: [
        "Wypełnij prosty formularz",
        "Potwierdź adres e-mail",
        "Zaloguj się do panelu partnerskiego",
      ],
      color: "from-pink-500 to-pink-600",
    },
    {
      number: "02",
      icon: FaLink,
      title: "Odbierz link partnerski",
      description:
        "Po rejestracji otrzymasz unikalny link i materiały promocyjne.",
      details: [
        "Indywidualny link afiliacyjny",
        "Kody rabatowe dla stylistek",
        "Banery i grafiki do social mediów",
      ],
      color: "from-violet-500 to-violet-600",
    },
    {
      number: "03",
      icon: FaShare,
      title: "Polecaj Naily",
      description:
        "Udostępniaj swój link wśród stylistek, w social mediach, na blogu lub w salonie.",
      details: [
        "Instagram, TikTok, Facebook",
        "Blog lub strona www",
        "Grupy branżowe i znajome stylistki",
        "QR kody w salonie",
      ],
      color: "from-fuchsia-500 to-fuchsia-600",
    },
    {
      number: "04",
      icon: FaMoneyBillWave,
      title: "Zarabiaj prowizje",
      description:
        "Otrzymuj do 20% prowizji od każdej opłaconej subskrypcji stylistki, którą polecisz.",
      details: [
        "20% prowizji",
        "Wypłaty przez Stripe co 2 tygodnie",
        "Bez limitu poleceń i progów",
      ],
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <section
      id="jak-to-dziala"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-primary-600 to-accent-600"
    >
      <div className="relative z-10 container">
        {/* Section header */}
        <div className="mb-12 lg:mb-16">
          <h2 className="font-baloo text-3xl lg:text-4xl xl:text-5xl text-white leading-tight mb-6">
            Jak to działa?
          </h2>
          <p
            className={`!text-white text-lg lg:text-xl max-w-3xl leading-relaxed font-poppins`}
          >
            Prosty proces w 4 krokach, który pozwoli Ci zacząć zarabiać w ciągu
            kilku minut.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffa920]/30 to-transparent transform -translate-y-1/2"></div>

          <div className="grid lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step container */}
                <div className="relative">
                  {/* Glass background */}
                  <div className="glass bg-white/10 backdrop-blur-xl p-6 lg:p-8 rounded-2xl border border-white/20">
                    {/* Step number */}
                    <div
                      className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                      <step.icon className="text-white text-2xl" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 font-baloo">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`!text-white z-50 leading-relaxed mb-6 font-poppins`}
                    >
                      {step.description}
                    </p>

                    {/* Details list */}
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-center gap-3 text-sm text-white/80 font-poppins"
                        >
                          <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Mobile arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-6 mb-2">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-[#ffa920] to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stripe disclaimer */}
        <div className="mt-20 flex justify-center">
          <div className="bg-white/20 rounded-lg px-4 py-2 max-w-xl text-center text-xs text-white/80 font-poppins backdrop-blur-sm border border-white/10">
            <span className="font-semibold">Stripe</span> to międzynarodowa,
            bezpieczna platforma do wypłat i obsługi płatności online. Do
            otrzymywania prowizji wymagane jest jednorazowe, szybkie założenie
            konta Stripe.
          </div>
        </div>
      </div>
    </section>
  );
}
