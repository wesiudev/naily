import Image from "next/image";

export default function ImageCollage() {
  return (
    <section className="px-4 sm:px-6 py-10 sm:py-14 bg-white">
      <div className="container-professional">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 mb-2 sm:mb-3">
            Profesjonalny manicure
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Zobacz dbałość o detale oraz pracę specjalistek
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="relative group rounded-2xl overflow-hidden shadow-xl lg:row-span-2 h-72 sm:h-96 lg:h-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1600&h=2200&fit=crop&crop=center&auto=format"
              alt="Zbliżenie na profesjonalny manicure – dbałość o detale"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/85 text-neutral-900">
                Zbliżenie • Precyzja
              </span>
            </div>
          </div>

          <div className="grid grid-rows-2 gap-4 sm:gap-6">
            <div className="relative group rounded-2xl overflow-hidden shadow-xl h-64 sm:h-72">
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&h=1200&fit=crop&crop=center&auto=format"
                alt="Manicure w salonie – naturalna, komfortowa atmosfera"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/85 text-neutral-900">
                  Salon • Komfort
                </span>
              </div>
            </div>
            <div className="relative group rounded-2xl overflow-hidden shadow-xl h-64 sm:h-72">
              <Image
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&h=1200&fit=crop&crop=center&auto=format"
                alt="Paleta lakierów i narzędzia – przygotowanie do zabiegu"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/85 text-neutral-900">
                  Stylizacja • Preparaty
                </span>
              </div>
            </div>
          </div>

          <div className="relative group rounded-2xl overflow-hidden shadow-xl h-64 sm:h-80 lg:h-auto lg:min-h-[240px]">
            <Image
              src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=1600&h=1200&fit=crop&crop=center&auto=format"
              alt="Efekt końcowy – perfekcyjnie wykończone paznokcie"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/85 text-neutral-900">
                Efekt • Wykończenie
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
