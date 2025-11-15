import JoinCTA from "../Influencer/JoinCTA";

export default function AffiliateProgram() {
  return (
    <section className="relative py-16 lg:py-24 bg-professional-gradient overflow-hidden animate-fade-in">
      <div className="relative z-10 container">
        {/* Section header */}
        <div className="mb-12 lg:mb-20">
          <h2 className="font-baloo text-4xl lg:text-5xl text-zinc-800 mb-6">
            System partnerski Naily
          </h2>
          <p
            className={`text-neutral-500 max-w-3xl leading-relaxed lg:text-lg font-poppins`}
          >
            Jesteśmy najnowszą platformą łączącą miłośniczki manicure ze
            specjalistkami w Polsce.
          </p>
        </div>

        {/* Program description */}
        <div className="relative">
          {/* Glass container */}
          <div className="bg-purple-50 p-8 lg:p-12 rounded-3xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text content */}
              <div>
                <h3 className="font-baloo text-2xl lg:text-3xl text-neutral-900 mb-6">
                  Jak zacząć?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <p className={`text-neutral-700`}>
                      <span className="font-semibold">Zarejestruj się</span> w
                      naszym programie partnerskim - to zajmuje kilka minut
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <p className={`text-neutral-700`}>
                      <span className="font-semibold">Utwórz linki i kody</span>{" "}
                      zapraszające i rozpocznij promocję
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <p className={`text-neutral-700 `}>
                      <span className="font-semibold">
                        Zarabiaj miesięczną prowizję
                      </span>{" "}
                      za każdą stylistkę zaproszoną przez Ciebie
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual element */}
              <div className="relative mt-8 lg:mt-0">
                <div className="gap-4 flex flex-col bg-white p-8 rounded-2xl">
                  <h4 className="text-xl lg:text-2xl font-baloo font-bold text-zinc-800 mb-2">
                    Zarabiaj promując to, co kochasz!
                  </h4>
                  <p className={`text-neutral-600 `}>
                    Bez opłat rejestracyjnych, bez ukrytych kosztów
                  </p>
                  <JoinCTA />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
